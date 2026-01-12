import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import EmptyState from '../EmptyState';
import { FiArrowRight, FiDownload, FiFilter, FiSearch } from '../icons/feather';
import TextField from '../../ui/TextField';
import SelectField from '../../ui/SelectField';
import { DiagnosticsActions, DiagnosticsActionButton, DiagnosticsCardTitle } from './diagnosticsUi';

const DEFAULT_EMPTY_STATE = {
  title: '暂无时间线',
  description: '导入诊断包后，这里会将 logs/errors/events 聚合为可检索的时间线视图。',
  primaryAction: null,
  secondaryAction: null,
};

const DEFAULT_NO_MATCH_STATE = {
  title: '无匹配记录',
  description: '请调整类型筛选或关键词条件。',
  primaryAction: null,
  secondaryAction: null,
};

const Filters = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: var(--spacing-md);
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

const Count = styled.span`
  color: var(--text-primary);
  font-weight: 800;
`;

const Records = styled.div.attrs({ 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-sm);
`;

const RecordItem = styled.details`
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  overflow: hidden;

  &[open] {
    background: var(--surface-soft-hover);
  }
`;

const RecordSummary = styled.summary`
  cursor: pointer;
  list-style: none;
  padding: var(--spacing-sm) var(--spacing-md);
  display: grid;
  gap: 6px;
  outline: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:focus-visible {
    box-shadow: var(--shadow-ring);
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
`;

const KindBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--badge-border);
  background: var(--badge-bg);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--badge-color, var(--text-secondary));
`;

const Message = styled.div`
  color: var(--text-primary);
  line-height: var(--leading-snug-plus);
`;

const DetailsBody = styled.div`
  padding: 0 var(--spacing-md) var(--spacing-md);
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

const Pre = styled.pre`
  margin: 0;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  background: var(--surface-paper);
  border: 1px solid var(--border-subtle);
  overflow: auto;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  line-height: 1.45;
`;

const safeText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    try {
      return String(value);
    } catch {
      return '';
    }
  }
};

const normalizeKind = (value) => {
  if (value === 'log' || value === 'error' || value === 'event') return value;
  return 'log';
};

const kindLabel = (kind) => {
  if (kind === 'error') return 'ERROR';
  if (kind === 'event') return 'EVENT';
  return 'LOG';
};

const kindTitle = (kind) => {
  if (kind === 'error') return '错误';
  if (kind === 'event') return '事件';
  return '日志';
};

const kindColor = (kind, record) => {
  if (kind === 'error') return 'var(--danger-color)';
  if (kind === 'event') return 'var(--info-color)';

  const level = String(record?.level || '').toLowerCase();
  if (level === 'error') return 'var(--danger-color)';
  if (level === 'warn' || level === 'warning') return 'var(--warning-color)';
  if (level === 'debug') return 'var(--text-tertiary)';
  return 'var(--text-secondary)';
};

const toAt = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

const normalizeTimeline = ({ logs, errors, events }) => {
  const out = [];

  const logList = Array.isArray(logs) ? logs : [];
  logList.forEach((entry, index) => {
    const at = toAt(entry?.at);
    out.push({
      kind: 'log',
      at,
      id: entry?.id || `log:${index}`,
      level: entry?.level || 'info',
      message: safeText(entry?.message),
      source: safeText(entry?.source),
      detail: safeText(entry?.context),
      raw: entry,
    });
  });

  const errorList = Array.isArray(errors) ? errors : [];
  errorList.forEach((entry, index) => {
    const at = toAt(entry?.at);
    out.push({
      kind: 'error',
      at,
      id: entry?.id || `error:${index}`,
      message: safeText(entry?.message),
      source: safeText(entry?.source),
      detail: safeText(entry?.stack),
      raw: entry,
    });
  });

  const eventList = Array.isArray(events) ? events : [];
  eventList.forEach((entry, index) => {
    const at = toAt(entry?.at);
    const name = safeText(entry?.name);
    const payload = safeText(entry?.payload);
    out.push({
      kind: 'event',
      at,
      id: entry?.id || `event:${index}`,
      message: name,
      source: '',
      detail: payload,
      raw: entry,
    });
  });

  out.sort((a, b) => {
    const av = typeof a.at === 'number' ? a.at : -1;
    const bv = typeof b.at === 'number' ? b.at : -1;
    return bv - av;
  });

  return out;
};

export default function DiagnosticsTimelineExplorer({
  className,
  title = '导入时间线',
  logs,
  errors,
  events,
  onDownload,
  onJump,
  defaultLimit = 32,
  emptyState,
  noMatchState,
}) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [limit, setLimit] = useState(defaultLimit);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);
  const timeline = useMemo(
    () => normalizeTimeline({ logs, errors, events }),
    [logs, errors, events],
  );

  const filtered = useMemo(() => {
    return timeline.filter((record) => {
      const recordKind = normalizeKind(record?.kind);
      if (kind !== 'all' && recordKind !== kind) return false;
      if (!normalizedQuery) return true;

      const hay = `${safeText(record?.message)}\n${safeText(record?.source)}\n${safeText(
        record?.detail,
      )}`.toLowerCase();
      return hay.includes(normalizedQuery);
    });
  }, [kind, normalizedQuery, timeline]);

  const shown = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const remaining = Math.max(0, filtered.length - shown.length);
  const resolvedEmptyState = emptyState
    ? { ...DEFAULT_EMPTY_STATE, ...emptyState }
    : DEFAULT_EMPTY_STATE;
  const resolvedNoMatchState = noMatchState
    ? { ...DEFAULT_NO_MATCH_STATE, ...noMatchState }
    : DEFAULT_NO_MATCH_STATE;

  return (
    <div className={className}>
      <DiagnosticsCardTitle>{title}</DiagnosticsCardTitle>

      {timeline.length > 0 ? (
        <>
          <SummaryRow>
            <div>
              总计 <Count>{timeline.length}</Count> 条 · 匹配 <Count>{filtered.length}</Count> 条
            </div>
            <div>展示 {shown.length} 条</div>
          </SummaryRow>

          <Filters>
            <TextField
              label="关键词"
              placeholder="搜索 message/source/detail…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              startIcon={<FiSearch />}
            />
            <SelectField
              label="类型"
              value={kind}
              onChange={(event) => setKind(event.target.value)}
            >
              <option value="all">全部</option>
              <option value="log">日志</option>
              <option value="event">事件</option>
              <option value="error">错误</option>
            </SelectField>
          </Filters>

          <DiagnosticsActions>
            {typeof onDownload === 'function' ? (
              <DiagnosticsActionButton
                type="button"
                onClick={() => {
                  onDownload(filtered, {
                    query: normalizedQuery || null,
                    kind: kind === 'all' ? null : kind,
                  });
                }}
                title="下载筛选后的时间线（JSON）"
              >
                <FiDownload />
                下载筛选结果
              </DiagnosticsActionButton>
            ) : null}
            <DiagnosticsActionButton
              type="button"
              onClick={() => {
                setQuery('');
                setKind('all');
                setLimit(defaultLimit);
              }}
              title="重置筛选条件"
            >
              <FiFilter />
              重置视图
            </DiagnosticsActionButton>
          </DiagnosticsActions>

          {filtered.length > 0 ? (
            <>
              <Records>
                {shown.map((record, index) => {
                  const recordKind = normalizeKind(record?.kind);
                  const color = kindColor(recordKind, record);
                  const at = typeof record?.at === 'number' ? record.at : null;
                  const stamp = typeof at === 'number' ? new Date(at).toLocaleString('zh-CN') : '—';

                  return (
                    <RecordItem key={record?.id || `timeline:${index}`}>
                      <RecordSummary>
                        <MetaRow>
                          <span>{stamp}</span>
                          <KindBadge style={{ '--badge-color': color }}>
                            {kindLabel(recordKind)}
                          </KindBadge>
                          {record?.source ? <span>· {record.source}</span> : null}
                        </MetaRow>
                        <Message>{record?.message || '—'}</Message>
                      </RecordSummary>
                      {record?.detail || typeof onJump === 'function' ? (
                        <DetailsBody>
                          {record?.id ? <div>id: {record.id}</div> : null}
                          {typeof onJump === 'function' ? (
                            <DiagnosticsActions>
                              <DiagnosticsActionButton
                                type="button"
                                onClick={() => onJump(record)}
                                title={`定位到${kindTitle(recordKind)}浏览器`}
                              >
                                <FiArrowRight />
                                定位到{kindTitle(recordKind)}浏览器
                              </DiagnosticsActionButton>
                            </DiagnosticsActions>
                          ) : null}
                          {record?.detail ? <Pre>{record.detail}</Pre> : null}
                        </DetailsBody>
                      ) : null}
                    </RecordItem>
                  );
                })}
              </Records>

              {remaining > 0 ? (
                <DiagnosticsActions>
                  <DiagnosticsActionButton
                    type="button"
                    onClick={() => setLimit((n) => n + defaultLimit)}
                    title={`还有 ${remaining} 条匹配结果`}
                  >
                    显示更多（+{Math.min(defaultLimit, remaining)}）
                  </DiagnosticsActionButton>
                </DiagnosticsActions>
              ) : null}
              {filtered.length > defaultLimit && shown.length > defaultLimit ? (
                <DiagnosticsActions>
                  <DiagnosticsActionButton
                    type="button"
                    onClick={() => setLimit(defaultLimit)}
                    title="收起到默认展示数量"
                  >
                    收起
                  </DiagnosticsActionButton>
                </DiagnosticsActions>
              ) : null}
            </>
          ) : (
            <EmptyState
              title={resolvedNoMatchState.title}
              description={resolvedNoMatchState.description}
              primaryAction={resolvedNoMatchState.primaryAction}
              secondaryAction={resolvedNoMatchState.secondaryAction}
            />
          )}
        </>
      ) : (
        <EmptyState
          title={resolvedEmptyState.title}
          description={resolvedEmptyState.description}
          primaryAction={resolvedEmptyState.primaryAction}
          secondaryAction={resolvedEmptyState.secondaryAction}
        />
      )}
    </div>
  );
}
