import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastProvider';
import ManualCopyDialog from '../components/ManualCopyDialog';
import { FiActivity, FiDownload, FiTrash2, FiUpload, FiZap } from '../components/icons/feather';
import { copyTextToClipboard } from '../utils/share';
import { buildDiagnosticsBundle } from '../utils/diagnosticsBundle';
import { downloadBinaryFile, downloadTextFile } from '../utils/download';
import { getErrorReports, clearErrorReports } from '../utils/errorReporter';
import { getLogs, clearLogs } from '../utils/logger';
import { getFeatureSummaries } from '../utils/dataVault';
import { formatBytes } from '../utils/formatBytes';
import { canGzip, gzipCompressString } from '../utils/compression';
import {
  decodeDiagnosticsBytes,
  parseDiagnosticsBundleText,
  summarizeDiagnosticsBundle,
} from '../utils/diagnosticsImport';
import { startHealthMonitoring, stopHealthMonitoring } from '../utils/healthConsole';

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

export default function DiagnosticsPage() {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [monitoring, setMonitoring] = useState(false);
  const [manualCopyOpen, setManualCopyOpen] = useState(false);
  const [importedCopyOpen, setImportedCopyOpen] = useState(false);
  const [bundle, setBundle] = useState(() => buildDiagnosticsBundle());
  const [errors, setErrors] = useState(() => getErrorReports());
  const [logs, setLogs] = useState(() => getLogs());
  const [storage, setStorage] = useState(() => getFeatureSummaries());
  const [importedBundle, setImportedBundle] = useState(null);
  const [importedMeta, setImportedMeta] = useState(null);

  const refresh = useCallback(() => {
    setBundle(buildDiagnosticsBundle());
    setErrors(getErrorReports());
    setLogs(getLogs());
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
  const importedJsonText = useMemo(
    () => (importedBundle ? JSON.stringify(importedBundle, null, 2) : ''),
    [importedBundle],
  );
  const currentSummary = useMemo(() => summarizeDiagnosticsBundle(bundle), [bundle]);
  const importedSummary = useMemo(
    () => summarizeDiagnosticsBundle(importedBundle),
    [importedBundle],
  );

  const build = bundle.build || {};
  const snapshot = bundle.snapshot || {};
  const perf = snapshot.perf || {};
  const lag = snapshot.lag || {};
  const longTasks = snapshot.longTasks || {};
  const reactCommits = snapshot.reactCommits || {};
  const memory = snapshot.memory || null;
  const gzipSupported = useMemo(() => canGzip(), []);
  const isGzipBytes = useCallback((bytes) => bytes?.[0] === 0x1f && bytes?.[1] === 0x8b, []);

  const handleImport = useCallback(
    async (file) => {
      if (!file) return;
      if (typeof file.arrayBuffer !== 'function') {
        toast.warning('导入失败', '当前浏览器不支持读取本地文件。');
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (Number(file.size) > maxSize) {
        toast.warning('导入失败', `文件过大（>${formatBytes(maxSize)}），建议先裁剪或压缩。`);
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const decoded = await decodeDiagnosticsBytes({ bytes, filename: file.name });
        if (!decoded.ok) {
          if (decoded.reason === 'gzip-unavailable') {
            toast.warning(
              '导入失败',
              '当前环境不支持 gzip 解压，请改用 Chrome/Edge 或先本地解压。',
            );
            return;
          }
          toast.warning('导入失败', '无法解析该文件，请确认文件格式是否正确。');
          return;
        }

        const parsed = parseDiagnosticsBundleText(decoded.text);
        if (!parsed.ok) {
          if (parsed.reason === 'invalid-json') {
            toast.warning('导入失败', '文件不是合法 JSON（或 gzip 解压失败）。');
            return;
          }
          toast.warning('导入失败', '文件不是合法诊断包（缺少必要字段）。');
          return;
        }

        setImportedBundle(parsed.bundle);
        setImportedMeta({
          filename: file.name,
          sizeBytes: Number(file.size) || 0,
          gzip: decoded.gzip,
          importedAt: new Date().toISOString(),
        });
        toast.success('导入成功', `已加载：${file.name}`);
      } catch {
        toast.warning('导入失败', '读取文件失败，请检查文件或稍后重试。');
      }
    },
    [toast],
  );

  const formatMetric = (value, digits = 0, suffix = '') =>
    typeof value === 'number' ? `${value.toFixed(digits)}${suffix}` : '—';

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
                const result = await copyTextToClipboard(jsonText);
                if (result.ok) {
                  toast.success('已复制', '诊断 JSON 已复制到剪贴板。');
                } else {
                  setManualCopyOpen(true);
                  toast.info('请手动复制', '已打开手动复制窗口。');
                }
              } catch {
                setManualCopyOpen(true);
                toast.info('请手动复制', '已打开手动复制窗口。');
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
          {gzipSupported ? (
            <ActionButton
              type="button"
              onClick={async () => {
                try {
                  const bytes = await gzipCompressString(jsonText);
                  if (!isGzipBytes(bytes)) {
                    toast.warning('下载失败', '当前环境不支持 gzip 压缩导出。');
                    return;
                  }

                  const buildTag =
                    build.shortSha || (import.meta.env.DEV ? 'dev' : build.version || 'local');
                  const filename = `guoman-diagnostics-${buildTag}-${Date.now()}.json.gz`;
                  const res = downloadBinaryFile({
                    bytes,
                    filename,
                    mimeType: 'application/gzip',
                  });
                  if (!res.ok) {
                    toast.warning('下载失败', '请检查浏览器下载权限。');
                    return;
                  }
                  toast.success('已下载', `文件已保存：${filename}`);
                } catch {
                  toast.warning('下载失败', '请检查浏览器下载权限或稍后重试。');
                }
              }}
              title="下载 gzip 压缩诊断包（体积更小，便于分享）"
            >
              下载 .gz
            </ActionButton>
          ) : null}
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
              <StatKey>版本</StatKey>
              <StatValue>{build.version || '—'}</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Build</StatKey>
              <StatValue>{build.shortSha || (import.meta.env.DEV ? 'dev' : '—')}</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>构建时间</StatKey>
              <StatValue>
                {build.builtAt ? new Date(build.builtAt).toLocaleString('zh-CN') : '—'}
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
              <StatKey>INP</StatKey>
              <StatValue>
                {typeof perf.inp?.value === 'number' ? `${perf.inp.value.toFixed(0)}ms` : '—'}
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

        <Card>
          <CardTitle>日志</CardTitle>
          <List>
            <StatRow>
              <StatKey>最近日志</StatKey>
              <StatValue>{logs.length} 条</StatValue>
            </StatRow>
          </List>
          <Actions>
            <ActionButton
              type="button"
              onClick={() => {
                clearLogs();
                refresh();
                toast.success('已清空日志', '本地日志列表已清空。');
              }}
            >
              <FiTrash2 />
              清空日志
            </ActionButton>
            <ActionButton
              type="button"
              onClick={() => {
                const filename = `guoman-logs-${Date.now()}.json`;
                const res = downloadTextFile({
                  text: JSON.stringify(getLogs(), null, 2),
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
              下载日志
            </ActionButton>
          </Actions>
        </Card>

        <WideCard>
          <CardTitle>
            <FiUpload />
            导入诊断包
          </CardTitle>
          <List>
            <StatRow>
              <StatKey>支持格式</StatKey>
              <StatValue>.json / .json.gz</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>隐私</StatKey>
              <StatValue>仅本地解析，不上传网络</StatValue>
            </StatRow>
          </List>
          <Actions>
            <ActionButton
              type="button"
              onClick={() => {
                fileInputRef.current?.click?.();
              }}
              title="从本地选择导出的诊断包（JSON 或 gzip 压缩包）"
            >
              <FiUpload />
              选择文件
            </ActionButton>
            {importedBundle ? (
              <>
                <ActionButton
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await copyTextToClipboard(importedJsonText);
                      if (result.ok) {
                        toast.success('已复制', '导入的诊断 JSON 已复制到剪贴板。');
                        return;
                      }
                      setImportedCopyOpen(true);
                      toast.info('请手动复制', '已打开手动复制窗口。');
                    } catch {
                      setImportedCopyOpen(true);
                      toast.info('请手动复制', '已打开手动复制窗口。');
                    }
                  }}
                >
                  复制导入 JSON
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => {
                    const base = importedMeta?.filename || `imported-${Date.now()}.json`;
                    const safeName = String(base).replace(/\.gz$/i, '');
                    const filename = safeName.toLowerCase().endsWith('.json')
                      ? safeName
                      : `${safeName}.json`;
                    const res = downloadTextFile({
                      text: importedJsonText,
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
                  下载导入包
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => {
                    setImportedBundle(null);
                    setImportedMeta(null);
                    toast.info('已清空导入', '已移除导入的诊断包。');
                  }}
                >
                  <FiTrash2 />
                  清空导入
                </ActionButton>
              </>
            ) : null}
          </Actions>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.gz,application/json,application/gzip"
            style={{ display: 'none' }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              void handleImport(file);
            }}
          />
          {importedBundle ? (
            <>
              <List>
                <StatRow>
                  <StatKey>文件</StatKey>
                  <StatValue>
                    {importedMeta?.filename || '—'}
                    {importedMeta?.gzip ? ' · gzip' : ''}
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>大小</StatKey>
                  <StatValue>{formatBytes(importedMeta?.sizeBytes || 0)}</StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>生成时间</StatKey>
                  <StatValue>
                    {importedSummary.generatedAt
                      ? new Date(importedSummary.generatedAt).toLocaleString('zh-CN')
                      : '—'}
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>版本</StatKey>
                  <StatValue>{importedSummary.build.version || '—'}</StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>Build</StatKey>
                  <StatValue>
                    {importedSummary.build.shortSha || importedSummary.build.sha || '—'}
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>日志 / 错误</StatKey>
                  <StatValue>
                    {importedSummary.logsCount} 条 / {importedSummary.errorsCount} 条
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>Schema</StatKey>
                  <StatValue>{importedSummary.schemaVersion ?? '—'}</StatValue>
                </StatRow>
              </List>

              <List>
                <StatRow>
                  <StatKey>对照（当前 / 导入）</StatKey>
                  <StatValue>—</StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>Build</StatKey>
                  <StatValue>
                    {currentSummary.build.shortSha || (import.meta.env.DEV ? 'dev' : '—')} /{' '}
                    {importedSummary.build.shortSha || importedSummary.build.sha || '—'}
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>日志</StatKey>
                  <StatValue>
                    {currentSummary.logsCount} 条 / {importedSummary.logsCount} 条
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>错误</StatKey>
                  <StatValue>
                    {currentSummary.errorsCount} 条 / {importedSummary.errorsCount} 条
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>INP</StatKey>
                  <StatValue>
                    {formatMetric(currentSummary.perf.inp, 0, 'ms')} /{' '}
                    {formatMetric(importedSummary.perf.inp, 0, 'ms')}
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>LCP</StatKey>
                  <StatValue>
                    {formatMetric(currentSummary.perf.lcp, 0, 'ms')} /{' '}
                    {formatMetric(importedSummary.perf.lcp, 0, 'ms')}
                  </StatValue>
                </StatRow>
                <StatRow>
                  <StatKey>CLS</StatKey>
                  <StatValue>
                    {formatMetric(currentSummary.perf.cls, 3)} /{' '}
                    {formatMetric(importedSummary.perf.cls, 3)}
                  </StatValue>
                </StatRow>
              </List>
            </>
          ) : (
            <EmptyState
              title="尚未导入"
              description="你可以导入从 ErrorBoundary 或 /diagnostics 导出的诊断包（JSON 或 .json.gz），用于对照排障。"
            />
          )}
        </WideCard>

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

        <WideCard>
          <CardTitle>最近日志明细</CardTitle>
          {logs.length > 0 ? (
            <List>
              {logs.slice(0, 16).map((entry) => (
                <div key={entry.id}>
                  <strong>{new Date(entry.at).toLocaleString('zh-CN')}</strong>{' '}
                  <span>· {String(entry.level || 'info').toUpperCase()}</span>
                  {entry.source ? <span> · {entry.source}</span> : null}
                  <div>{entry.message}</div>
                </div>
              ))}
            </List>
          ) : (
            <EmptyState
              title="暂无日志"
              description="这里会记录关键行为与异常线索（local-first），方便你导出日志定位问题。"
              primaryAction={{ to: '/', label: '回到首页' }}
              secondaryAction={{ to: '/profile', label: '用户中心' }}
            />
          )}
        </WideCard>
      </Grid>

      <ManualCopyDialog
        open={manualCopyOpen}
        onClose={() => setManualCopyOpen(false)}
        title="手动复制诊断 JSON"
        description="当前环境不支持自动写入剪贴板。你可以手动复制下面的内容并分享给维护者（建议先检查是否需要脱敏）。"
        label="诊断 JSON"
        text={jsonText}
      />

      <ManualCopyDialog
        open={importedCopyOpen}
        onClose={() => setImportedCopyOpen(false)}
        title="手动复制导入的诊断 JSON"
        description="当前环境不支持自动写入剪贴板。你可以手动复制下面的内容并分享给维护者（建议先检查是否需要脱敏）。"
        label="导入的诊断 JSON"
        text={importedJsonText}
      />
    </PageShell>
  );
}
