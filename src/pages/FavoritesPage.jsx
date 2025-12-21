import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiFolder, FiHeart, FiTrash2, FiUpload } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { useFavorites } from '../components/FavoritesProvider';
import { useToast } from '../components/ToastProvider';
import { downloadTextFile } from '../utils/download';
import animeData from '../data/animeData';
import {
  assignFavoriteToGroup,
  createFavoriteGroup,
  deleteFavoriteGroup,
  getFavoriteGroups,
  removeFavoriteFromGroup,
} from '../utils/favoriteGroups';
import { trackEvent } from '../utils/analytics';
import { scheduleStorageWrite } from '../utils/storageQueue';
import { STORAGE_KEYS } from '../utils/dataKeys';

const ToggleGroup = styled.div.attrs({ 'data-divider': 'inline' })`
  --divider-inline-gap: var(--spacing-xs);
  display: inline-flex;
  border: 1px solid var(--border-subtle);
  border-radius: var(--border-radius-pill);
  overflow: hidden;
  background: var(--surface-soft);
`;

const Toggle = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md-tight);
  color: ${(p) => (p.$active ? 'var(--text-on-primary)' : 'var(--text-secondary)')};
  background: ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? 'transparent' : 'var(--border-subtle)')};
  transition: var(--transition);

  &:hover {
    background: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--surface-soft-hover)')};
  }
`;

const ActionButton = styled.button.attrs({
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm-plus) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
    background: var(--surface-soft-hover);
  }

  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const DangerButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm-plus) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-soft-border);
  background: var(--primary-soft);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
    background: var(--primary-soft-hover);
  }

  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Summary = styled.div`
  color: var(--text-tertiary);
`;

const ActionRow = styled.div.attrs({ 'data-divider': 'inline', 'aria-label': '收藏操作' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
`;

const GroupRow = styled.div.attrs({ 'data-divider': 'inline', 'aria-label': '收藏分组' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
`;

const GroupChip = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: var(--spacing-xs-plus) var(--spacing-md-compact);
  border-radius: var(--border-radius-pill);
  border: 1px solid ${(p) => (p.$active ? 'var(--chip-border-active)' : 'var(--chip-border)')};
  background: ${(p) => (p.$active ? 'var(--chip-bg-active)' : 'var(--chip-bg)')};
  color: var(--text-secondary);
  transition: var(--transition);

  &:hover {
    border-color: var(--chip-border-hover);
    background: var(--chip-bg-hover);
    color: var(--text-primary);
  }
`;

const GroupSelect = styled.select`
  width: 100%;
  padding: var(--spacing-xs-plus) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
`;

const FavoriteItem = styled.div`
  display: grid;
  gap: var(--spacing-sm);
`;

const formatDateTime = (value) => {
  if (!value) return '暂无记录';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const SORTS = {
  rating: {
    id: 'rating',
    label: '评分',
    sortFn: (a, b) => b.rating - a.rating,
  },
  popularity: {
    id: 'popularity',
    label: '人气',
    sortFn: (a, b) => b.popularity - a.popularity,
  },
  title: {
    id: 'title',
    label: '名称',
    sortFn: (a, b) => a.title.localeCompare(b.title, 'zh-CN'),
  },
};

function FavoritesPage() {
  const { favoriteIds, clearFavorites, exportFavoritesBackup, importFavoritesBackup, updatedAt } =
    useFavorites();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const importModeRef = useRef('merge');
  const importTypeRef = useRef('favorites');
  const [sortId, setSortId] = useState(SORTS.rating.id);
  const [groups, setGroups] = useState(() => getFavoriteGroups());
  const [activeGroupId, setActiveGroupId] = useState('all');

  const sort = SORTS[sortId] || SORTS.rating;

  const list = useMemo(() => {
    const ids = Array.from(favoriteIds);
    return ids.map((id) => animeData.find((a) => a.id === id)).filter(Boolean);
  }, [favoriteIds]);

  const groupMap = useMemo(() => {
    const map = new Map();
    groups.forEach((group) => {
      (group.itemIds || []).forEach((id) => map.set(id, group.id));
    });
    return map;
  }, [groups]);

  const filteredList = useMemo(() => {
    if (activeGroupId === 'all') return list;
    const group = groups.find((item) => item.id === activeGroupId);
    if (!group) return list;
    const idSet = new Set(group.itemIds || []);
    return list.filter((anime) => idSet.has(anime.id));
  }, [activeGroupId, groups, list]);

  const sortedList = useMemo(() => {
    const next = [...filteredList];
    next.sort(sort.sortFn);
    return next;
  }, [filteredList, sort.sortFn]);

  const onExport = () => {
    if (favoriteIds.size === 0) {
      toast.info('暂无可导出的收藏', '先去详情页点一下“收藏”，再来做备份。');
      return;
    }

    const json = exportFavoritesBackup();
    const date = new Date();
    const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate(),
    ).padStart(2, '0')}`;
    const filename = `guoman-favorites-${ymd}.json`;

    const res = downloadTextFile({
      text: json,
      filename,
      mimeType: 'application/json;charset=utf-8',
    });

    if (!res.ok) {
      toast.warning('导出失败', '你的浏览器可能阻止了下载，请换个浏览器再试。');
      return;
    }

    toast.success('已导出收藏', `备份文件已下载：${filename}`);
  };

  const startImport = (mode, type = 'favorites') => {
    if (mode === 'replace' && favoriteIds.size > 0) {
      const ok = window.confirm('覆盖导入会用备份内容替换你当前的收藏。确定继续吗？');
      if (!ok) return;
    }

    importModeRef.current = mode;
    importTypeRef.current = type;
    fileInputRef.current?.click?.();
  };

  const onImportFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    let text = '';
    try {
      text = await file.text();
    } catch {
      toast.warning('读取失败', '无法读取该文件内容，请确认文件权限或重新导出。');
      return;
    }

    let summary;
    try {
      if (importTypeRef.current === 'groups') {
        const parsed = JSON.parse(text);
        const incoming = Array.isArray(parsed.groups) ? parsed.groups : [];
        const mode = importModeRef.current;
        const nextGroups =
          mode === 'replace'
            ? incoming
            : [...groups, ...incoming.filter((item) => !groups.some((g) => g.id === item.id))];
        setGroups(nextGroups);
        scheduleStorageWrite(STORAGE_KEYS.favoriteGroups, JSON.stringify(nextGroups));
        summary = { imported: incoming.length, after: nextGroups.length, mode };
        trackEvent('favorites.groups.import', { mode, count: incoming.length });
      } else {
        summary = importFavoritesBackup(text, { mode: importModeRef.current });
      }
    } catch (err) {
      toast.warning('导入失败', err instanceof Error ? err.message : '备份文件格式不正确。');
      return;
    }

    if (!summary) {
      toast.warning('导入失败', '未能解析备份内容，请尝试重新导出后再导入。');
      return;
    }

    if (summary.imported === 0) {
      toast.info('导入完成', '备份里没有可用的收藏 ID。');
      return;
    }

    if (importTypeRef.current === 'groups') {
      toast.success('已导入分组', `导入 ${summary.imported} 个分组，现有 ${summary.after} 个。`);
      return;
    }

    if (summary.mode === 'replace') {
      toast.success('已覆盖导入', `导入 ${summary.imported} 条收藏，现有 ${summary.after} 条。`);
      return;
    }

    toast.success(
      '已导入收藏',
      `导入 ${summary.imported} 条收藏，新增加 ${summary.added} 条，共 ${summary.after} 条。`,
    );
  };

  const onExportGroups = () => {
    if (groups.length === 0) {
      toast.info('暂无分组可导出', '先创建分组并分配收藏吧。');
      return;
    }
    const json = JSON.stringify({ schemaVersion: 1, groups });
    const res = downloadTextFile({
      text: json,
      filename: `guoman-favorite-groups-${Date.now()}.json`,
      mimeType: 'application/json;charset=utf-8',
    });
    if (!res.ok) {
      toast.warning('导出失败', '你的浏览器可能阻止了下载。');
      return;
    }
    toast.success('已导出分组', '分组备份已下载。');
    trackEvent('favorites.groups.export', { count: groups.length });
  };

  const createGroup = () => {
    const name = window.prompt('分组名称', '我的收藏');
    if (!name) return;
    const entry = createFavoriteGroup(name.trim());
    if (!entry) return;
    setGroups((prev) => [entry, ...prev]);
    toast.success('分组已创建', `已创建分组：${entry.name}`);
    trackEvent('favorites.groups.create');
  };

  const removeGroup = () => {
    if (activeGroupId === 'all') return;
    const target = groups.find((group) => group.id === activeGroupId);
    if (!target) return;
    const ok = window.confirm(`确定删除分组「${target.name}」吗？`);
    if (!ok) return;
    deleteFavoriteGroup(target.id);
    setGroups((prev) => prev.filter((group) => group.id !== target.id));
    setActiveGroupId('all');
    trackEvent('favorites.groups.delete', { id: target.id });
  };

  const updateGroupAssignment = (animeId, nextGroupId) => {
    const currentGroupId = groupMap.get(animeId);
    if (currentGroupId) {
      removeFavoriteFromGroup(currentGroupId, animeId);
    }
    if (nextGroupId && nextGroupId !== 'none' && nextGroupId !== 'all') {
      assignFavoriteToGroup(nextGroupId, animeId);
    }
    setGroups(getFavoriteGroups());
    trackEvent('favorites.groups.assign', { id: animeId, group: nextGroupId });
  };

  const onClear = () => {
    if (favoriteIds.size === 0) return;
    const ok = window.confirm('确定要清空收藏吗？此操作不可撤销。');
    if (!ok) return;

    clearFavorites();
    toast.success('已清空收藏', '随时可以从详情页再次加入收藏。');
  };

  return (
    <PageShell
      title="我的收藏"
      subtitle="你点过心动的作品都会留在这里（本地保存，刷新不丢）。"
      badge="收藏"
      meta={<span>最近更新：{formatDateTime(updatedAt)} · 支持导入/导出</span>}
      actions={
        <ActionRow>
          <ToggleGroup aria-label="收藏排序">
            {Object.values(SORTS).map((item) => (
              <Toggle
                key={item.id}
                type="button"
                $active={sortId === item.id}
                aria-pressed={sortId === item.id}
                onClick={() => setSortId(item.id)}
              >
                {item.label}
              </Toggle>
            ))}
          </ToggleGroup>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            aria-label="导入收藏备份文件"
            style={{ display: 'none' }}
            onChange={onImportFileChange}
          />

          <ActionButton type="button" onClick={onExport} disabled={favoriteIds.size === 0}>
            <FiDownload />
            导出
          </ActionButton>
          <ActionButton type="button" onClick={() => startImport('merge')}>
            <FiUpload />
            导入合并
          </ActionButton>
          <ActionButton type="button" onClick={() => startImport('replace')}>
            <FiUpload />
            覆盖导入
          </ActionButton>

          <ActionButton type="button" onClick={onExportGroups} disabled={groups.length === 0}>
            <FiFolder />
            导出分组
          </ActionButton>
          <ActionButton type="button" onClick={() => startImport('merge', 'groups')}>
            <FiFolder />
            导入分组
          </ActionButton>
          <ActionButton type="button" onClick={() => startImport('replace', 'groups')}>
            <FiFolder />
            覆盖分组
          </ActionButton>

          <DangerButton type="button" onClick={onClear} disabled={favoriteIds.size === 0}>
            <FiTrash2 />
            清空
          </DangerButton>
        </ActionRow>
      }
    >
      <Summary role="status" aria-live="polite">
        共收藏 <strong>{favoriteIds.size}</strong> 部作品 · 当前分组{' '}
        <strong>{activeGroupId === 'all' ? '全部' : '自定义'}</strong>
      </Summary>

      <GroupRow>
        <GroupChip
          type="button"
          $active={activeGroupId === 'all'}
          onClick={() => setActiveGroupId('all')}
        >
          全部
        </GroupChip>
        {groups.map((group) => (
          <GroupChip
            key={group.id}
            type="button"
            $active={activeGroupId === group.id}
            onClick={() => setActiveGroupId(group.id)}
          >
            {group.name} ({group.itemIds?.length || 0})
          </GroupChip>
        ))}
        <ActionButton type="button" onClick={createGroup}>
          <FiFolder />
          新建分组
        </ActionButton>
        <ActionButton type="button" onClick={removeGroup} disabled={activeGroupId === 'all'}>
          <FiTrash2 />
          删除分组
        </ActionButton>
      </GroupRow>

      {sortedList.length > 0 ? (
        <AnimeGrid $bento>
          {sortedList.map((anime) => (
            <FavoriteItem key={anime.id}>
              <AnimeCard anime={anime} />
              <GroupSelect
                value={groupMap.get(anime.id) || 'none'}
                onChange={(event) => updateGroupAssignment(anime.id, event.target.value)}
              >
                <option value="none">未分组</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </GroupSelect>
            </FavoriteItem>
          ))}
        </AnimeGrid>
      ) : (
        <EmptyState
          icon={<FiHeart size={22} />}
          title="你还没有收藏任何作品"
          description="去作品详情页点一下“收藏”，它就会出现在这里。"
          primaryAction={{ to: '/recommendations', label: '去看推荐' }}
          secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
        />
      )}
    </PageShell>
  );
}

export default FavoritesPage;
