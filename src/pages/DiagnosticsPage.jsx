import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastProvider';
import { FiActivity, FiDownload, FiTrash2, FiZap } from '../components/icons/feather';
import { downloadTextFile } from '../utils/download';
import { getErrorReports, clearErrorReports } from '../utils/errorReporter';
import { getFeatureSummaries } from '../utils/dataVault';
import { formatBytes } from '../utils/formatBytes';
import {
  getHealthSnapshot,
  startHealthMonitoring,
  stopHealthMonitoring,
} from '../utils/healthConsole';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Card = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  grid-column: span 6;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const WideCard = styled(Card)`
  grid-column: 1 / -1;
`;

const CardTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-lg-plus);
  font-family: var(--font-display);
`;

const List = styled.div.attrs({ 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const StatKey = styled.span`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const StatValue = styled.span`
  color: var(--text-primary);
  font-weight: 700;
  font-size: var(--text-sm);
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const ActionButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
  }
`;

const ProgressRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--spacing-md);
  align-items: center;
`;

const ProgressTrack = styled.div`
  height: 10px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: var(--progress);
  background: linear-gradient(
    90deg,
    rgba(var(--primary-rgb), 0.58),
    rgba(var(--secondary-rgb), 0.58)
  );
`;

const buildDiagnosticsBundle = () => {
  const snapshot = getHealthSnapshot();
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    snapshot,
  };
};

const copyToClipboard = async (text) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === 'undefined') return false;

  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', 'true');
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
};

export default function DiagnosticsPage() {
  const toast = useToast();
  const [monitoring, setMonitoring] = useState(false);
  const [bundle, setBundle] = useState(() => buildDiagnosticsBundle());
  const [errors, setErrors] = useState(() => getErrorReports());
  const [storage, setStorage] = useState(() => getFeatureSummaries());

  const refresh = useCallback(() => {
    setBundle(buildDiagnosticsBundle());
    setErrors(getErrorReports());
    setStorage(getFeatureSummaries());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!monitoring) return undefined;
    const t = window.setInterval(refresh, 1000);
    return () => window.clearInterval(t);
  }, [monitoring, refresh]);

  const maxStorageBytes = useMemo(() => {
    const bytes = storage.map((x) => Number(x.bytes) || 0);
    return Math.max(0, ...bytes);
  }, [storage]);

  const jsonText = useMemo(() => JSON.stringify(bundle, null, 2), [bundle]);

  const snapshot = bundle.snapshot || {};
  const perf = snapshot.perf || {};
  const lag = snapshot.lag || {};
  const longTasks = snapshot.longTasks || {};
  const reactCommits = snapshot.reactCommits || {};
  const memory = snapshot.memory || null;

  return (
    <PageShell
      title="诊断面板"
      subtitle="本地健康快照：性能、错误、存储、PWA。可一键导出为 JSON 便于排障（不上传网络）。"
      badge="Diagnostics"
      meta={<span>local-first · 无远程依赖 · 可复制/下载</span>}
      actions={
        <Actions>
          <ActionButton
            type="button"
            onClick={() => {
              try {
                if (monitoring) {
                  stopHealthMonitoring();
                  setMonitoring(false);
                  toast.info('已停止监控', '已停止采样（LongTask / 内存 / 事件循环延迟）。');
                } else {
                  startHealthMonitoring();
                  setMonitoring(true);
                  toast.success('已开始监控', '将每秒刷新一次快照。');
                }
              } catch {
                toast.warning('操作失败', '浏览器环境不支持或被权限策略限制。');
              }
            }}
            title={monitoring ? '停止采样（减少开销）' : '开始采样（建议排障时开启）'}
          >
            <FiZap />
            {monitoring ? '停止监控' : '开始监控'}
          </ActionButton>
          <ActionButton type="button" onClick={refresh}>
            <FiActivity />
            刷新快照
          </ActionButton>
          <ActionButton
            type="button"
            onClick={async () => {
              try {
                const ok = await copyToClipboard(jsonText);
                if (ok) {
                  toast.success('已复制', '诊断 JSON 已复制到剪贴板。');
                } else {
                  toast.warning('复制失败', '当前浏览器不支持剪贴板写入。');
                }
              } catch {
                toast.warning('复制失败', '当前浏览器不支持剪贴板写入。');
              }
            }}
          >
            复制 JSON
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => {
              const filename = `guoman-diagnostics-${Date.now()}.json`;
              const res = downloadTextFile({
                text: jsonText,
                filename,
                mimeType: 'application/json;charset=utf-8',
              });
              if (!res.ok) {
                toast.warning('下载失败', '请检查浏览器下载权限。');
                return;
              }
              toast.success('已下载', `文件已保存：${filename}`);
            }}
          >
            <FiDownload />
            下载 JSON
          </ActionButton>
        </Actions>
      }
    >
      <Grid>
        <Card>
          <CardTitle>系统</CardTitle>
          <List>
            <StatRow>
              <StatKey>生成时间</StatKey>
              <StatValue>
                {bundle.generatedAt ? new Date(bundle.generatedAt).toLocaleString('zh-CN') : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>运行时长</StatKey>
              <StatValue>
                {typeof snapshot.uptimeSeconds === 'number' ? `${snapshot.uptimeSeconds}s` : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>页面可见性</StatKey>
              <StatValue>{snapshot.visibility || '—'}</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Service Worker</StatKey>
              <StatValue>
                {snapshot.sw?.supported
                  ? snapshot.sw.controlling
                    ? '已接管'
                    : '可用（未接管）'
                  : '不支持'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>内存（JS Heap）</StatKey>
              <StatValue>
                {memory
                  ? `${memory.usedText} / ${memory.totalText}（上限 ${memory.limitText}）`
                  : '—'}
              </StatValue>
            </StatRow>
          </List>
        </Card>

        <Card>
          <CardTitle>性能</CardTitle>
          <List>
            <StatRow>
              <StatKey>CLS</StatKey>
              <StatValue>
                {typeof perf.cls?.value === 'number' ? perf.cls.value.toFixed(3) : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>LCP</StatKey>
              <StatValue>
                {typeof perf.lcp?.value === 'number' ? `${perf.lcp.value.toFixed(0)}ms` : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>FID</StatKey>
              <StatValue>
                {typeof perf.fid?.value === 'number' ? `${perf.fid.value.toFixed(1)}ms` : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>事件循环延迟</StatKey>
              <StatValue>
                {typeof lag.avg === 'number' ? `${lag.avg}ms` : '—'} /{' '}
                {typeof lag.max === 'number' ? `${lag.max}ms` : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Long Task</StatKey>
              <StatValue>
                {longTasks.count || 0} 次（max{' '}
                {typeof longTasks.max === 'number' ? `${longTasks.max}ms` : '—'}）
              </StatValue>
            </StatRow>
          </List>
        </Card>

        <Card>
          <CardTitle>React</CardTitle>
          <List>
            <StatRow>
              <StatKey>Commit 采样</StatKey>
              <StatValue>{reactCommits.count || 0} 次</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Commit P95</StatKey>
              <StatValue>
                {typeof reactCommits.p95 === 'number' ? `${reactCommits.p95}ms` : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Commit Max</StatKey>
              <StatValue>
                {typeof reactCommits.max === 'number' ? `${reactCommits.max}ms` : '—'}
              </StatValue>
            </StatRow>
          </List>
        </Card>

        <Card>
          <CardTitle>错误</CardTitle>
          <List>
            <StatRow>
              <StatKey>最近错误</StatKey>
              <StatValue>{errors.length} 条</StatValue>
            </StatRow>
          </List>
          <Actions>
            <ActionButton
              type="button"
              onClick={() => {
                clearErrorReports();
                refresh();
                toast.success('已清空错误记录', '本地错误列表已清空。');
              }}
            >
              <FiTrash2 />
              清空错误
            </ActionButton>
          </Actions>
        </Card>

        <WideCard>
          <CardTitle>本地存储占用</CardTitle>
          {storage.length > 0 ? (
            <List>
              {storage
                .slice()
                .sort((a, b) => (Number(b.bytes) || 0) - (Number(a.bytes) || 0))
                .map((item) => {
                  const bytes = Number(item.bytes) || 0;
                  const progress =
                    maxStorageBytes > 0
                      ? `${Math.min(100, Math.round((bytes / maxStorageBytes) * 100))}%`
                      : '0%';

                  return (
                    <div key={item.key}>
                      <StatRow>
                        <StatKey>
                          {item.label} · {item.count} 条
                        </StatKey>
                        <StatValue>{formatBytes(bytes)}</StatValue>
                      </StatRow>
                      <ProgressRow>
                        <ProgressTrack aria-hidden="true">
                          <ProgressFill style={{ '--progress': progress }} />
                        </ProgressTrack>
                        <StatKey aria-hidden="true">{progress}</StatKey>
                      </ProgressRow>
                    </div>
                  );
                })}
            </List>
          ) : (
            <EmptyState
              title="暂无本地数据"
              description="当你收藏、追更、搜索后，这里会显示各模块占用。"
            />
          )}
        </WideCard>

        <WideCard>
          <CardTitle>最近错误明细</CardTitle>
          {errors.length > 0 ? (
            <List>
              {errors.slice(0, 12).map((e) => (
                <div key={e.id}>
                  <strong>{new Date(e.at).toLocaleString('zh-CN')}</strong>
                  {e.source ? <span> · {e.source}</span> : null}
                  <div>{e.message}</div>
                </div>
              ))}
            </List>
          ) : (
            <EmptyState
              title="暂无错误"
              description="这里会记录脚本错误与未捕获 Promise 拒绝，便于你导出诊断包定位问题。"
              primaryAction={{ to: '/', label: '回到首页' }}
              secondaryAction={{ to: '/profile', label: '用户中心' }}
            />
          )}
        </WideCard>
      </Grid>
    </PageShell>
  );
}
