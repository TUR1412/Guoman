import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import EmptyState from '../EmptyState';
import { FiDownload, FiSearch, FiTrash2 } from '../icons/feather';
import TextField from '../../ui/TextField';
import SelectField from '../../ui/SelectField';
import { DiagnosticsActions, DiagnosticsActionButton, DiagnosticsCardTitle } from './diagnosticsUi';

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

const LevelBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.03);
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
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--border-subtle);
  overflow: auto;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  line-height: 1.45;
`;

const normalizeLevel = (value) => {
  const text = String(value || '').toLowerCase();
  if (text === 'debug') return 'debug';
  if (text === 'warn' || text === 'warning') return 'warn';
  if (text === 'error') return 'error';
  return 'info';
};

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

const getLevelColor = (level) => {
  if (level === 'error') return 'rgba(255, 90, 90, 0.92)';
  if (level === 'warn') return 'var(--warning-color)';
  if (level === 'debug') return 'var(--text-tertiary)';
  return 'var(--info-color)';
};

export default function DiagnosticsLogsExplorer({
  className,
  logs,
  onClear,
  onDownload,
  defaultLimit = 24,
}) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [limit, setLimit] = useState(defaultLimit);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const filtered = useMemo(() => {
    const list = Array.isArray(logs) ? logs : [];
    const narrowed = list.filter((entry) => {
      const entryLevel = normalizeLevel(entry?.level);
      if (level !== 'all' && entryLevel !== level) return false;
      if (!normalizedQuery) return true;

      const message = String(entry?.message || '').toLowerCase();
      const source = String(entry?.source || '').toLowerCase();
      if (message.includes(normalizedQuery)) return true;
      if (source.includes(normalizedQuery)) return true;

      const context = safeJson(entry?.context).toLowerCase();
      return context.includes(normalizedQuery);
    });

    return narrowed;
  }, [level, logs, normalizedQuery]);

  const shown = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const remaining = Math.max(0, filtered.length - shown.length);

  return (
    <div className={className}>
      <DiagnosticsCardTitle>日志浏览器</DiagnosticsCardTitle>

      {Array.isArray(logs) && logs.length > 0 ? (
        <>
          <SummaryRow>
            <div>
              总计 <Count>{logs.length}</Count> 条 · 匹配 <Count>{filtered.length}</Count> 条
            </div>
            <div>展示 {shown.length} 条</div>
          </SummaryRow>

          <Filters>
            <TextField
              label="关键词"
              placeholder="搜索 message / source / context…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              startIcon={<FiSearch />}
            />
            <SelectField
              label="级别"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="all">全部</option>
              <option value="error">ERROR</option>
              <option value="warn">WARN</option>
              <option value="info">INFO</option>
              <option value="debug">DEBUG</option>
            </SelectField>
          </Filters>

          <DiagnosticsActions>
            {typeof onDownload === 'function' ? (
              <DiagnosticsActionButton
                type="button"
                onClick={() => {
                  onDownload(filtered, { level, query: normalizedQuery || null });
                }}
                title="下载筛选后的日志（JSON）"
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
                  setLevel('all');
                  setLimit(defaultLimit);
                }}
                title="清空本地日志并重置筛选"
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
                  const entryLevel = normalizeLevel(entry?.level);
                  const color = getLevelColor(entryLevel);
                  const at = typeof entry?.at === 'number' ? entry.at : null;
                  const stamp = typeof at === 'number' ? new Date(at).toLocaleString('zh-CN') : '—';
                  const contextText = safeJson(entry?.context);

                  return (
                    <RecordItem key={entry?.id || `log:${index}`}>
                      <RecordSummary>
                        <MetaRow>
                          <span>{stamp}</span>
                          <LevelBadge style={{ '--badge-color': color }}>
                            {entryLevel.toUpperCase()}
                          </LevelBadge>
                          {entry?.source ? <span>· {entry.source}</span> : null}
                        </MetaRow>
                        <Message>{entry?.message}</Message>
                      </RecordSummary>
                      {(entry?.source || contextText) && (
                        <DetailsBody>
                          {entry?.source ? <div>source: {entry.source}</div> : null}
                          {contextText ? <Pre>{contextText}</Pre> : null}
                        </DetailsBody>
                      )}
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
              title="无匹配日志"
              description="请调整关键词或级别筛选条件。"
              primaryAction={{ to: '/diagnostics', label: '重置视图' }}
              secondaryAction={{ to: '/profile', label: '用户中心' }}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="暂无日志"
          description="这里会记录关键行为与异常线索（local-first），方便你导出日志定位问题。"
          primaryAction={{ to: '/', label: '回到首页' }}
          secondaryAction={{ to: '/profile', label: '用户中心' }}
        />
      )}
    </div>
  );
}
