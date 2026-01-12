import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import EmptyState from '../EmptyState';
import { FiDownload, FiSearch, FiTrash2 } from '../icons/feather';
import TextField from '../../ui/TextField';
import { DiagnosticsActions, DiagnosticsActionButton, DiagnosticsCardTitle } from './diagnosticsUi';

const DEFAULT_EMPTY_STATE = {
  title: '暂无错误',
  description: '这里会记录脚本错误与未捕获 Promise 拒绝，便于你导出诊断包定位问题。',
  primaryAction: { to: '/', label: '回到首页' },
  secondaryAction: { to: '/profile', label: '用户中心' },
};

const DEFAULT_NO_MATCH_STATE = {
  title: '无匹配错误',
  description: '请调整关键词筛选条件。',
  primaryAction: { to: '/diagnostics', label: '重置视图' },
  secondaryAction: { to: '/profile', label: '用户中心' },
};

const Filters = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-md);
  align-items: end;
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

const Message = styled.div`
  color: var(--danger-color);
  font-weight: 700;
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
    return String(value);
  } catch {
    return '';
  }
};

export default function DiagnosticsErrorsExplorer({
  className,
  errors,
  onClear,
  onDownload,
  focus,
  defaultLimit = 16,
  title = '错误浏览器',
  emptyState,
  noMatchState,
}) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(defaultLimit);
  const focusToken = focus?.token;
  const focusQuery = focus?.query;

  useEffect(() => {
    if (!focusToken) return;
    if (typeof focusQuery === 'string') {
      setQuery(focusQuery);
    }
    setLimit(defaultLimit);
  }, [defaultLimit, focusQuery, focusToken]);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const filtered = useMemo(() => {
    const list = Array.isArray(errors) ? errors : [];
    if (!normalizedQuery) return list;

    return list.filter((entry) => {
      const message = safeText(entry?.message).toLowerCase();
      const source = safeText(entry?.source).toLowerCase();
      const stack = safeText(entry?.stack).toLowerCase();
      return (
        message.includes(normalizedQuery) ||
        source.includes(normalizedQuery) ||
        stack.includes(normalizedQuery)
      );
    });
  }, [errors, normalizedQuery]);

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

      {Array.isArray(errors) && errors.length > 0 ? (
        <>
          <SummaryRow>
            <div>
              总计 <Count>{errors.length}</Count> 条 · 匹配 <Count>{filtered.length}</Count> 条
            </div>
            <div>展示 {shown.length} 条</div>
          </SummaryRow>

          <Filters>
            <TextField
              label="关键词"
              placeholder="搜索 message / source / stack…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              startIcon={<FiSearch />}
            />
          </Filters>

          <DiagnosticsActions>
            {typeof onDownload === 'function' ? (
              <DiagnosticsActionButton
                type="button"
                onClick={() => {
                  onDownload(filtered, { query: normalizedQuery || null });
                }}
                title="下载筛选后的错误列表（JSON）"
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
                  setLimit(defaultLimit);
                }}
                title="清空本地错误并重置筛选"
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
                  const stackText = safeText(entry?.stack);

                  return (
                    <RecordItem key={entry?.id || `error:${index}`}>
                      <RecordSummary>
                        <MetaRow>
                          <span>{stamp}</span>
                          {entry?.source ? <span>· {entry.source}</span> : null}
                        </MetaRow>
                        <Message>{entry?.message}</Message>
                      </RecordSummary>
                      {stackText ? (
                        <DetailsBody>
                          <Pre>{stackText}</Pre>
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
