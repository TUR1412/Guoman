import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import EmptyState from '../EmptyState';
import { FiDownload, FiSearch, FiTrash2 } from '../icons/feather';
import TextField from '../../ui/TextField';
import SelectField from '../../ui/SelectField';
import { DiagnosticsActions, DiagnosticsActionButton, DiagnosticsCardTitle } from './diagnosticsUi';

const DEFAULT_EMPTY_STATE = {
  title: '暂无事件',
  description: '这里会记录关键交互埋点（local-first），方便你在排障时还原行为路径。',
  primaryAction: { to: '/', label: '回到首页' },
  secondaryAction: { to: '/profile', label: '用户中心' },
};

const DEFAULT_NO_MATCH_STATE = {
  title: '无匹配事件',
  description: '请调整关键词或事件名筛选条件。',
  primaryAction: { to: '/diagnostics', label: '重置视图' },
  secondaryAction: { to: '/profile', label: '用户中心' },
};

const Filters = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
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

const NameBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.03);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--primary-color);
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

const safeJson = (value) => {
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

const normalizeEventName = (value) => String(value || '').trim();

const normalizeEventNameFilter = (value) => {
  const text = String(value || '').trim();
  if (!text) return 'all';
  if (text.toLowerCase() === 'all') return 'all';
  return text;
};

export default function DiagnosticsEventsExplorer({
  className,
  events,
  onClear,
  onDownload,
  focus,
  defaultLimit = 24,
  title = '事件浏览器',
  emptyState,
  noMatchState,
}) {
  const [query, setQuery] = useState('');
  const [eventName, setEventName] = useState('all');
  const [limit, setLimit] = useState(defaultLimit);
  const focusToken = focus?.token;
  const focusQuery = focus?.query;
  const focusEventName = focus?.eventName;

  useEffect(() => {
    if (!focusToken) return;

    if (typeof focusQuery === 'string') {
      setQuery(focusQuery);
    }

    if (focusEventName !== null && focusEventName !== undefined) {
      setEventName(normalizeEventNameFilter(focusEventName));
    }

    setLimit(defaultLimit);
  }, [defaultLimit, focusEventName, focusQuery, focusToken]);

  const list = useMemo(() => (Array.isArray(events) ? events : []), [events]);
  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const nameOptions = useMemo(() => {
    const counts = list.reduce((acc, entry) => {
      const name = normalizeEventName(entry?.name);
      if (!name) return acc;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((entry) => {
      const name = normalizeEventName(entry?.name);
      if (eventName !== 'all' && name !== eventName) return false;
      if (!normalizedQuery) return true;

      if (name.toLowerCase().includes(normalizedQuery)) return true;
      const payloadText = safeJson(entry?.payload).toLowerCase();
      return payloadText.includes(normalizedQuery);
    });
  }, [eventName, list, normalizedQuery]);

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

      {Array.isArray(events) && events.length > 0 ? (
        <>
          <SummaryRow>
            <div>
              总计 <Count>{events.length}</Count> 条 · 匹配 <Count>{filtered.length}</Count> 条
            </div>
            <div>展示 {shown.length} 条</div>
          </SummaryRow>

          <Filters>
            <TextField
              label="关键词"
              placeholder="搜索 event name / payload…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              startIcon={<FiSearch />}
            />
            <SelectField
              label="事件名"
              value={eventName}
              onChange={(event) => setEventName(event.target.value)}
            >
              <option value="all">全部</option>
              {nameOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name} · {opt.count}
                </option>
              ))}
            </SelectField>
          </Filters>

          <DiagnosticsActions>
            {typeof onDownload === 'function' ? (
              <DiagnosticsActionButton
                type="button"
                onClick={() => {
                  onDownload(filtered, {
                    query: normalizedQuery || null,
                    eventName: eventName === 'all' ? null : eventName,
                  });
                }}
                title="下载筛选后的事件列表（JSON）"
              >
                <FiDownload />
                下载筛选结果
              </DiagnosticsActionButton>
            ) : null}
            {typeof onClear === 'function' ? (
              <DiagnosticsActionButton
                type="button"
                onClick={() => {
                  onClear();
                  setQuery('');
                  setEventName('all');
                  setLimit(defaultLimit);
                }}
                title="清空本地事件并重置筛选"
              >
                <FiTrash2 />
                清空并重置
              </DiagnosticsActionButton>
            ) : null}
          </DiagnosticsActions>

          {filtered.length > 0 ? (
            <>
              <Records>
                {shown.map((entry, index) => {
                  const at = typeof entry?.at === 'number' ? entry.at : null;
                  const stamp = typeof at === 'number' ? new Date(at).toLocaleString('zh-CN') : '—';
                  const name = normalizeEventName(entry?.name) || '—';
                  const payloadText = safeJson(entry?.payload);

                  return (
                    <RecordItem key={entry?.id || `event:${index}`}>
                      <RecordSummary>
                        <MetaRow>
                          <span>{stamp}</span>
                          <NameBadge>{name}</NameBadge>
                        </MetaRow>
                        <Message>{payloadText ? `${name} · payload` : name}</Message>
                      </RecordSummary>
                      {payloadText ? (
                        <DetailsBody>
                          {entry?.id ? <div>id: {entry.id}</div> : null}
                          <Pre>{payloadText}</Pre>
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
