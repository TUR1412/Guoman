import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiActivity,
  FiBell,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiUpload,
  FiUser,
} from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastProvider';
import { downloadBinaryFile, downloadTextFile } from '../utils/download';
import { canGzip, gzipCompressString, gzipDecompressToString } from '../utils/compression';
import { formatBytes } from '../utils/formatBytes';
import {
  clearAllData,
  clearFeatureData,
  exportAllData,
  exportFeatureData,
  getFeatureSummaries,
  importAllData,
  importFeatureData,
} from '../utils/dataVault';
import {
  clearNotifications,
  getNotifications,
  markNotificationRead,
  pushNotification,
} from '../utils/notificationsStore';
import { clearFeedback, getFeedbackList, submitFeedback } from '../utils/feedbackStore';
import { usePersistedState } from '../utils/usePersistedState';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { getEventStats, trackEvent } from '../utils/analytics';
import { getPerformanceSnapshot } from '../utils/performance';
import { safeJsonParse } from '../utils/json';
import { flushStorageQueue } from '../utils/storageQueue';
import {
  getStoredVisualSettings,
  resetVisualSettings,
  setVisualSettings,
} from '../utils/visualSettings';
import { RangeInput, TextAreaField, TextField } from '../ui';

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
  grid-column: span 4;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-md);

  @media (max-width: 992px) {
    grid-column: span 6;
  }

  @media (max-width: 576px) {
    grid-column: 1 / -1;
  }
`;

const CardTitle = styled.h3`
  font-size: var(--text-lg-plus);
  font-family: var(--font-display);
`;

const CardMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const CardCount = styled.div`
  font-size: var(--text-6xl);
  font-weight: 800;
  color: var(--primary-color);
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: var(--surface-soft-hover);
    }
  }
`;

const WideCard = styled(Card)`
  grid-column: span 12;
`;

const InlineForm = styled.form`
  display: grid;
  gap: var(--spacing-md);
`;

const List = styled.div.attrs({ 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const ToggleButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
`;

const SettingsGroup = styled.div`
  display: grid;
  gap: var(--spacing-lg);
`;

const SettingRow = styled.div`
  display: grid;
  gap: var(--spacing-sm);
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const SettingLabel = styled.label`
  font-weight: 900;
  color: var(--text-primary);
`;

const SettingValue = styled.span`
  padding: 0 var(--spacing-sm);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

const SettingHint = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  line-height: var(--leading-snug-plus);
`;

const buildExportFilename = (prefix, extension = 'json') => `${prefix}-${Date.now()}.${extension}`;

function UserCenterPage() {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [includeSensitiveExport, setIncludeSensitiveExport] = useState(false);
  const [importTarget, setImportTarget] = useState({ scope: 'all', mode: 'merge', feature: null });
  const [, setRefreshKey] = useState(0);
  const [visual, setVisual] = useState(() => getStoredVisualSettings());

  const [profile, setProfile] = usePersistedState(
    STORAGE_KEYS.userProfile,
    { name: '', signature: '' },
    {
      serialize: (value) => JSON.stringify(value),
      deserialize: (raw) => safeJsonParse(raw, { name: '', signature: '' }),
    },
  );

  const [sync, setSync] = usePersistedState(
    STORAGE_KEYS.syncProfile,
    { token: '', lastSync: null },
    {
      serialize: (value) => JSON.stringify(value),
      deserialize: (raw) => safeJsonParse(raw, { token: '', lastSync: null }),
    },
  );

  const [shortcuts, setShortcuts] = usePersistedState(
    STORAGE_KEYS.shortcuts,
    { enabled: true },
    {
      serialize: (value) => JSON.stringify(value),
      deserialize: (raw) => safeJsonParse(raw, { enabled: true }),
    },
  );

  const [notifications, setNotifications] = useState(() => getNotifications());
  const [feedbackList, setFeedbackList] = useState(() => getFeedbackList());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');

  const featureSummaries = getFeatureSummaries();
  const eventStats = getEventStats();
  const perfSnapshot = getPerformanceSnapshot();

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setVisual(getStoredVisualSettings());
  };

  const startImport = (scope, mode = 'merge', feature = null) => {
    setImportTarget({ scope, mode, feature });
    fileInputRef.current?.click?.();
  };

  const onImportFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    // 防御性限制：避免异常/恶意大文件导致页面卡死（本项目为纯前端，本地导入应保持可控）
    const MAX_IMPORT_BYTES = 5 * 1024 * 1024; // 5MB（压缩包另行解压后再校验）
    const MAX_DECOMPRESSED_CHARS = 10 * 1024 * 1024; // 10M chars 作为上限

    const isGzipFile =
      file.name?.toLowerCase?.().endsWith?.('.gz') || file.type === 'application/gzip';
    if (!isGzipFile && file.size > MAX_IMPORT_BYTES) {
      toast.warning('文件过大', '导入文件超过 5MB，可能导致页面卡顿。请拆分或使用压缩包导入。');
      return;
    }

    let text = '';
    try {
      if (isGzipFile) {
        const buffer = await file.arrayBuffer();
        text = await gzipDecompressToString(new Uint8Array(buffer));
      } else {
        text = await file.text();
      }
    } catch {
      toast.warning('读取失败', '无法读取导入文件内容。');
      return;
    }

    if (text.length > MAX_DECOMPRESSED_CHARS) {
      toast.warning('解压后内容过大', '导入内容超过限制（10M 字符），已拒绝导入以保护性能。');
      return;
    }

    try {
      let result = null;
      if (importTarget.scope === 'all') {
        result = importAllData(text, { mode: importTarget.mode });
      } else if (importTarget.feature) {
        result = importFeatureData(importTarget.feature, text, { mode: importTarget.mode });
      }
      flushStorageQueue();

      const importedKeys = Number.isFinite(result?.importedKeys)
        ? result.importedKeys
        : result?.after && typeof result.after === 'object'
          ? Object.keys(result.after).length
          : null;
      const skippedKeys = Number.isFinite(result?.skippedKeys) ? result.skippedKeys : null;

      const parts = [];
      if (Number.isFinite(importedKeys)) parts.push(`写入 ${importedKeys} 个键`);
      if (Number.isFinite(skippedKeys) && skippedKeys > 0)
        parts.push(`跳过 ${skippedKeys} 个未知键`);

      toast.success(
        '导入完成',
        parts.length ? `数据已写入本地存储（${parts.join('，')}）。` : '数据已写入本地存储。',
      );
      trackEvent('data.import', { scope: importTarget.scope, feature: importTarget.feature });
      triggerRefresh();
    } catch (error) {
      toast.warning('导入失败', error instanceof Error ? error.message : '文件格式错误。');
    }
  };

  const exportAll = () => {
    const json = exportAllData({ includeSensitive: includeSensitiveExport });
    const filename = buildExportFilename('guoman-data');
    const result = downloadTextFile({
      text: json,
      filename,
      mimeType: 'application/json;charset=utf-8',
    });

    if (!result.ok) {
      toast.warning('导出失败', '请检查浏览器下载权限。');
      return;
    }

    toast.success('已导出所有数据', `文件已保存：${filename}`);
    trackEvent('data.export', { scope: 'all', includeSensitive: includeSensitiveExport });
  };

  const exportAllCompressed = async () => {
    if (!canGzip()) {
      exportAll();
      toast.info('压缩不可用', '当前浏览器不支持 gzip 压缩，已导出未压缩 JSON。');
      return;
    }

    const json = exportAllData({ includeSensitive: includeSensitiveExport });
    const filename = buildExportFilename('guoman-data', 'json.gz');
    const bytes = await gzipCompressString(json);
    const result = downloadBinaryFile({
      bytes,
      filename,
      mimeType: 'application/gzip',
    });

    if (!result.ok) {
      toast.warning('导出失败', '请检查浏览器下载权限。');
      return;
    }

    toast.success('已导出所有数据（压缩）', `文件已保存：${filename}`);
    trackEvent('data.export', {
      scope: 'all',
      compressed: true,
      includeSensitive: includeSensitiveExport,
    });
  };

  const exportFeature = (featureKey) => {
    const json = exportFeatureData(featureKey, { includeSensitive: includeSensitiveExport });
    const filename = buildExportFilename(`guoman-${featureKey}`);
    const result = downloadTextFile({
      text: json,
      filename,
      mimeType: 'application/json;charset=utf-8',
    });

    if (!result.ok) {
      toast.warning('导出失败', '请检查浏览器下载权限。');
      return;
    }

    toast.success('已导出数据', `文件已保存：${filename}`);
    trackEvent('data.export', {
      scope: 'feature',
      feature: featureKey,
      includeSensitive: includeSensitiveExport,
    });
  };

  const exportFeatureCompressed = async (featureKey) => {
    if (!canGzip()) {
      exportFeature(featureKey);
      toast.info('压缩不可用', '当前浏览器不支持 gzip 压缩，已导出未压缩 JSON。');
      return;
    }

    const json = exportFeatureData(featureKey, { includeSensitive: includeSensitiveExport });
    const filename = buildExportFilename(`guoman-${featureKey}`, 'json.gz');
    const bytes = await gzipCompressString(json);
    const result = downloadBinaryFile({
      bytes,
      filename,
      mimeType: 'application/gzip',
    });

    if (!result.ok) {
      toast.warning('导出失败', '请检查浏览器下载权限。');
      return;
    }

    toast.success('已导出数据（压缩）', `文件已保存：${filename}`);
    trackEvent('data.export', {
      scope: 'feature',
      feature: featureKey,
      compressed: true,
      includeSensitive: includeSensitiveExport,
    });
  };

  const clearFeature = (featureKey, label) => {
    const ok = window.confirm?.(`确定清理「${label}」的本地数据吗？此操作不可撤销。`);
    if (!ok) return;

    try {
      clearFeatureData(featureKey);
      flushStorageQueue();
      toast.success('已清理', `「${label}」数据已从本地移除。`);
      trackEvent('data.clear', { scope: 'feature', feature: featureKey });
      triggerRefresh();
    } catch (error) {
      toast.warning('清理失败', error instanceof Error ? error.message : '请稍后再试。');
    }
  };

  const clearAll = () => {
    const ok = window.confirm?.(
      '确定清空全部本地数据吗？包含收藏、进度、搜索、通知等。此操作不可撤销，完成后将刷新页面。',
    );
    if (!ok) return;

    try {
      clearAllData();
      flushStorageQueue();
      trackEvent('data.clear', { scope: 'all' });
      toast.success('已清空本地数据', '正在刷新页面以应用变更...');
      window.setTimeout(() => window.location.reload(), 650);
    } catch (error) {
      toast.warning('清理失败', error instanceof Error ? error.message : '请稍后再试。');
    }
  };

  const onCreateNotification = () => {
    const entry = pushNotification({
      title: '新番更新提醒',
      body: '你关注的作品本周已更新，点击查看详情。',
    });
    setNotifications((prev) => [entry, ...prev]);
    trackEvent('notifications.add');
    triggerRefresh();
  };

  const onMarkRead = (id) => {
    markNotificationRead(id);
    setNotifications(getNotifications());
    triggerRefresh();
  };

  const onClearNotifications = () => {
    clearNotifications();
    setNotifications([]);
    trackEvent('notifications.clear');
    triggerRefresh();
  };

  const onSubmitFeedback = (event) => {
    event.preventDefault();
    const trimmed = feedbackMessage.trim();
    if (!trimmed) {
      toast.warning('反馈不能为空', '写点你的想法吧。');
      return;
    }
    const entry = submitFeedback({ message: trimmed, contact: feedbackContact });
    if (!entry) {
      toast.warning('提交失败', '稍后再试。');
      return;
    }
    setFeedbackList((prev) => [entry, ...prev]);
    setFeedbackMessage('');
    setFeedbackContact('');
    toast.success('感谢反馈', '已保存到本地，后续可导出。');
    trackEvent('feedback.submit');
    triggerRefresh();
  };

  const onClearFeedback = () => {
    clearFeedback();
    setFeedbackList([]);
    trackEvent('feedback.clear');
    triggerRefresh();
  };

  const onSyncTokenChange = (value) => {
    setSync({ ...sync, token: value, lastSync: Date.now() });
    trackEvent('sync.token.update');
  };

  const toggleShortcuts = () => {
    setShortcuts({ enabled: !shortcuts?.enabled });
    trackEvent('shortcuts.toggle', { enabled: !shortcuts?.enabled });
  };

  const updateVisual = (patch) => {
    const next = setVisualSettings(patch);
    setVisual(next);
  };

  const resetVisual = () => {
    const next = resetVisualSettings();
    setVisual(next);
    toast.success('已恢复默认', '视觉设置已恢复为推荐默认值。');
    trackEvent('visual.settings.reset');
  };

  return (
    <PageShell
      title="用户中心"
      subtitle="管理你的收藏、观看进度与本地偏好。"
      badge="我的"
      meta={<span>本地存储 · 导入/导出 · 快捷设置</span>}
      actions={
        <Actions>
          <ActionButton as={Link} to="/diagnostics">
            <FiActivity />
            诊断面板
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => setIncludeSensitiveExport((prev) => !prev)}
            title={
              includeSensitiveExport
                ? '当前导出将包含同步 Token 等敏感字段，请勿分享给他人。'
                : '当前导出默认脱敏：同步 Token 等敏感字段将被排除。'
            }
          >
            {includeSensitiveExport ? <FiEye /> : <FiEyeOff />}
            {includeSensitiveExport ? '敏感：包含' : '敏感：脱敏'}
          </ActionButton>
          <ActionButton type="button" onClick={exportAll}>
            <FiDownload />
            导出全部
          </ActionButton>
          <ActionButton
            type="button"
            onClick={exportAllCompressed}
            title="导出 gzip 压缩包（.json.gz）"
          >
            <FiDownload />
            导出.gz
          </ActionButton>
          <ActionButton type="button" onClick={() => startImport('all', 'merge')}>
            <FiUpload />
            导入合并
          </ActionButton>
          <ActionButton type="button" onClick={() => startImport('all', 'replace')}>
            <FiUpload />
            覆盖导入
          </ActionButton>
          <ActionButton type="button" onClick={clearAll}>
            <FiTrash2 />
            清空全部
          </ActionButton>
        </Actions>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,application/gzip,.json,.gz"
        style={{ display: 'none' }}
        onChange={onImportFileChange}
        aria-label="导入数据文件"
      />

      <SummaryRow>
        <span>事件总数：{eventStats.total}</span>
        <span>CLS：{perfSnapshot?.cls?.value?.toFixed?.(3) || '—'}</span>
        <span>LCP：{perfSnapshot?.lcp?.value?.toFixed?.(0) || '—'}ms</span>
      </SummaryRow>

      <Grid>
        {featureSummaries.map((feature) => (
          <Card key={feature.key}>
            <CardTitle>{feature.label}</CardTitle>
            <CardCount>{feature.count}</CardCount>
            <CardMeta>
              {feature.count > 0 ? '数据已记录，可随时导出。' : feature.emptyHint}
              <div style={{ marginTop: '6px' }}>占用：{formatBytes(feature.bytes)}</div>
            </CardMeta>
            <Actions>
              <ActionButton type="button" onClick={() => exportFeature(feature.key)}>
                <FiDownload />
                导出
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => exportFeatureCompressed(feature.key)}
                title="导出 gzip 压缩包（.json.gz）"
              >
                <FiDownload />
                导出.gz
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => startImport('feature', 'merge', feature.key)}
              >
                <FiUpload />
                导入
              </ActionButton>
              <ActionButton type="button" onClick={() => clearFeature(feature.key, feature.label)}>
                <FiTrash2 />
                清理
              </ActionButton>
            </Actions>
          </Card>
        ))}
      </Grid>

      <WideCard>
        <CardTitle>
          <FiUser /> 个人档案
        </CardTitle>
        <InlineForm>
          <TextField
            label="昵称"
            labelSrOnly
            type="text"
            placeholder="昵称"
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
          />
          <TextAreaField
            label="个人签名"
            labelSrOnly
            placeholder="个人签名"
            value={profile.signature}
            onChange={(event) => setProfile({ ...profile, signature: event.target.value })}
          />
        </InlineForm>
      </WideCard>

      <WideCard>
        <CardTitle>
          <FiToggleRight /> 快捷键设置
        </CardTitle>
        <CardMeta>控制 Ctrl/⌘ + K 命令面板是否启用。</CardMeta>
        <ToggleButton type="button" onClick={toggleShortcuts}>
          {shortcuts?.enabled ? <FiToggleRight /> : <FiToggleLeft />}
          {shortcuts?.enabled ? '已启用' : '已停用'}
        </ToggleButton>
      </WideCard>

      <WideCard>
        <CardTitle>
          <FiEye /> 视觉设置
        </CardTitle>
        <CardMeta>
          调节纸纹、极光、字号与动效策略，适配不同设备/弱网环境；所有设置仅保存在本地，可随 Data
          Vault 导出。
        </CardMeta>

        <SettingsGroup>
          <SettingRow>
            <SettingHeader>
              <SettingLabel htmlFor="guoman-visual-noise">纸纹噪点</SettingLabel>
              <SettingValue>{Math.round(visual.paperNoiseOpacity * 100)}%</SettingValue>
            </SettingHeader>
            <RangeInput
              id="guoman-visual-noise"
              min={0}
              max={14}
              step={1}
              value={Math.round(visual.paperNoiseOpacity * 100)}
              onChange={(event) =>
                updateVisual({ paperNoiseOpacity: Number(event.target.value) / 100 })
              }
            />
            <SettingHint>
              越低越干净，越高越“纸感”。弱网/省流时会自动进一步降载（叠乘生效）。
            </SettingHint>
          </SettingRow>

          <SettingRow>
            <SettingHeader>
              <SettingLabel htmlFor="guoman-visual-aurora">极光光晕</SettingLabel>
              <SettingValue>{Math.round(visual.auroraOpacity * 100)}%</SettingValue>
            </SettingHeader>
            <RangeInput
              id="guoman-visual-aurora"
              min={0}
              max={100}
              step={5}
              value={Math.round(visual.auroraOpacity * 100)}
              onChange={(event) =>
                updateVisual({ auroraOpacity: Number(event.target.value) / 100 })
              }
            />
            <SettingHint>用于控制全局 Aurora Mesh 的强度（不影响文本对比度）。</SettingHint>
          </SettingRow>

          <SettingRow>
            <SettingHeader>
              <SettingLabel htmlFor="guoman-visual-font">字号缩放</SettingLabel>
              <SettingValue>{Math.round(visual.fontScale * 100)}%</SettingValue>
            </SettingHeader>
            <RangeInput
              id="guoman-visual-font"
              min={90}
              max={120}
              step={2}
              value={Math.round(visual.fontScale * 100)}
              onChange={(event) => updateVisual({ fontScale: Number(event.target.value) / 100 })}
            />
            <SettingHint>用于提升可读性（已限制范围，避免布局溢出）。</SettingHint>
          </SettingRow>

          <SettingRow>
            <SettingHeader>
              <SettingLabel id="guoman-visual-blur-label">玻璃模糊</SettingLabel>
              <SettingValue>{visual.disableBlur ? '已关闭' : '已开启'}</SettingValue>
            </SettingHeader>
            <ToggleButton
              type="button"
              onClick={() => updateVisual({ disableBlur: !visual.disableBlur })}
              aria-labelledby="guoman-visual-blur-label"
              aria-pressed={visual.disableBlur}
            >
              {visual.disableBlur ? <FiEyeOff /> : <FiEye />}
              {visual.disableBlur ? '关闭 blur（更省）' : '开启 blur（更通透）'}
            </ToggleButton>
          </SettingRow>

          <SettingRow>
            <SettingHeader>
              <SettingLabel id="guoman-visual-motion-label">减少动效</SettingLabel>
              <SettingValue>{visual.forceReducedMotion ? '已开启' : '跟随系统'}</SettingValue>
            </SettingHeader>
            <ToggleButton
              type="button"
              onClick={() => updateVisual({ forceReducedMotion: !visual.forceReducedMotion })}
              aria-labelledby="guoman-visual-motion-label"
              aria-pressed={visual.forceReducedMotion}
            >
              <FiActivity />
              {visual.forceReducedMotion ? '已减少动效' : '跟随系统偏好'}
            </ToggleButton>
            <SettingHint>
              开启后将强制进入低动效模式（等价于系统的 prefers-reduced-motion）。
            </SettingHint>
          </SettingRow>

          <Actions>
            <ActionButton type="button" onClick={resetVisual}>
              恢复默认
            </ActionButton>
          </Actions>
        </SettingsGroup>
      </WideCard>

      <WideCard>
        <CardTitle>
          <FiInfo /> 多端同步
        </CardTitle>
        <CardMeta>此处可保存你的同步 Token（占位，后续可接入真实后端）。</CardMeta>
        <TextField
          label="同步 Token"
          labelSrOnly
          type="text"
          placeholder="同步 Token"
          value={sync.token || ''}
          onChange={(event) => onSyncTokenChange(event.target.value)}
        />
      </WideCard>

      <WideCard>
        <CardTitle>
          <FiBell /> 消息通知
        </CardTitle>
        {notifications.length > 0 ? (
          <List>
            {notifications.map((item) => (
              <div key={item.id}>
                <strong>{item.title}</strong> · {item.read ? '已读' : '未读'}
                <div>{item.body}</div>
                {!item.read && (
                  <ActionButton type="button" onClick={() => onMarkRead(item.id)}>
                    标记已读
                  </ActionButton>
                )}
              </div>
            ))}
          </List>
        ) : (
          <EmptyState
            title="暂无通知"
            description="可以先创建一条示例通知，未来接入真实推送后会自动同步。"
            primaryAction={{ to: '/news', label: '看看资讯' }}
            secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
          />
        )}
        <Actions>
          <ActionButton type="button" onClick={onCreateNotification}>
            <FiBell />
            生成示例通知
          </ActionButton>
          <ActionButton type="button" onClick={onClearNotifications}>
            清空通知
          </ActionButton>
        </Actions>
      </WideCard>

      <WideCard>
        <CardTitle>
          <FiInfo /> 意见反馈
        </CardTitle>
        <InlineForm onSubmit={onSubmitFeedback}>
          <TextField
            label="联系方式（可选）"
            labelSrOnly
            type="text"
            placeholder="联系方式（可选）"
            value={feedbackContact}
            onChange={(event) => setFeedbackContact(event.target.value)}
          />
          <TextAreaField
            label="反馈内容"
            labelSrOnly
            placeholder="写下你的想法..."
            value={feedbackMessage}
            onChange={(event) => setFeedbackMessage(event.target.value)}
          />
          <Actions>
            <ActionButton type="submit">提交反馈</ActionButton>
            <ActionButton type="button" onClick={onClearFeedback}>
              清空反馈
            </ActionButton>
          </Actions>
        </InlineForm>

        {feedbackList.length > 0 ? (
          <List>
            {feedbackList.map((item) => (
              <div key={item.id}>
                <strong>{new Date(item.createdAt).toLocaleString('zh-CN')}</strong>
                <div>{item.message}</div>
              </div>
            ))}
          </List>
        ) : (
          <CardMeta>暂无反馈记录。</CardMeta>
        )}
      </WideCard>
    </PageShell>
  );
}

export default UserCenterPage;
