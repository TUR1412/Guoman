import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Reorder, useDragControls } from 'framer-motion';
import {
  FiDownload,
  FiFolder,
  FiHeart,
  FiMove,
  FiTrash2,
  FiUpload,
} from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { useFavorites } from '../components/FavoritesProvider';
import { useToast } from '../components/ToastProvider';
import { downloadTextFile } from '../utils/download';
import { animeIndex } from '../data/animeData';
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
import { safeJsonParse } from '../utils/json';
import { SelectField } from '../ui';
import { formatZhDateTime } from '../utils/datetime';
import { usePersistedState } from '../utils/usePersistedState';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

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
    box-shadow: var(--shadow-glow);
    background: var(--surface-soft-hover);
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
    box-shadow: var(--shadow-glow);
    background: var(--primary-soft-hover);
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

  ${(p) =>
    p.$droppable
      ? `
    box-shadow: var(--shadow-ring);
  `
      : ''}

  ${(p) =>
    p.$dragOver
      ? `
    border-color: var(--primary-soft-border);
    background: rgba(var(--primary-rgb), 0.18);
    color: var(--text-primary);
    transform: translateY(-1px);
  `
      : ''}
`;

const FavoriteItem = styled.div`
  display: grid;
  gap: var(--spacing-sm);
`;

const SortableList = styled(Reorder.Group).attrs({
  as: 'div',
  axis: 'y',
  role: 'list',
  'aria-label': '自定义排序列表',
})`
  display: grid;
  gap: var(--spacing-lg);
`;

const SortableItem = styled(Reorder.Item).attrs({ as: 'div', role: 'listitem' })`
  position: relative;
  display: grid;
  gap: var(--spacing-sm);
`;

const HandleRow = styled.div.attrs({ 'data-divider': 'inline', 'aria-label': '拖拽操作' })`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  align-items: center;
`;

const Handle = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 6px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-secondary);
  font-weight: 800;
  transition: var(--transition);

  &:hover {
    border-color: var(--chip-border-hover);
    color: var(--text-primary);
    background: var(--surface-soft-hover);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const DragGroupHandle = styled(Handle).attrs({ draggable: true })`
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const normalizeIdList = (value) => {
  if (!Array.isArray(value)) return [];
  const out = [];
  const seen = new Set();
  value.forEach((item) => {
    const id = Number(item);
    if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) return;
    if (seen.has(id)) return;
    seen.add(id);
    out.push(id);
  });
  return out;
};

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((item, idx) => item === b[idx]);
};

const SORTS = {
  custom: {
    id: 'custom',
    label: '自定义',
    sortFn: null,
  },
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

function SortableFavoriteRow({
  anime,
  reducedMotion,
  groups,
  groupMap,
  updateGroupAssignment,
  startGroupDrag,
  endGroupDrag,
  onStartReorder,
}) {
  const controls = useDragControls();

  return (
    <SortableItem
      value={anime.id}
      dragListener={false}
      dragControls={controls}
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 44 }}
    >
      <HandleRow>
        <Handle
          aria-label="拖拽排序"
          title="拖拽排序（仅自定义排序）"
          onPointerDown={(event) => {
            onStartReorder?.();
            controls.start(event);
          }}
        >
          <FiMove /> 拖拽排序
        </Handle>
        {groups.length > 0 ? (
          <DragGroupHandle
            aria-label="拖拽到分组"
            title="拖拽到上方分组标签：移动分组"
            onDragStart={startGroupDrag(anime.id)}
            onDragEnd={endGroupDrag}
            onClick={(event) => event.preventDefault()}
          >
            <FiFolder /> 拖到分组
          </DragGroupHandle>
        ) : null}
      </HandleRow>

      <AnimeCard anime={anime} />

      <SelectField
        aria-label="选择分组"
        value={groupMap.get(anime.id) || 'none'}
        onChange={(event) => updateGroupAssignment(anime.id, event.target.value)}
      >
        <option value="none">未分组</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </SelectField>
    </SortableItem>
  );
}

function FavoritesPage() {
  const { favoriteIds, clearFavorites, exportFavoritesBackup, importFavoritesBackup, updatedAt } =
    useFavorites();
  const toast = useToast();
  const reducedMotion = useAppReducedMotion();
  const fileInputRef = useRef(null);
  const importModeRef = useRef('merge');
  const importTypeRef = useRef('favorites');
  const [sortId, setSortId] = useState(SORTS.rating.id);
  const [groups, setGroups] = useState(() => getFavoriteGroups());
  const [activeGroupId, setActiveGroupId] = useState('all');
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverGroupId, setDragOverGroupId] = useState(null);
  const [favoritesOrder, setFavoritesOrder] = usePersistedState(STORAGE_KEYS.favoritesOrder, [], {
    serialize: (value) => JSON.stringify(normalizeIdList(value)),
    deserialize: (raw) => safeJsonParse(raw, []),
  });
  const [draftFavoritesOrder, setDraftFavoritesOrder] = useState(() =>
    normalizeIdList(favoritesOrder),
  );
  const [isReordering, setIsReordering] = useState(false);

  const sort = SORTS[sortId] || SORTS.rating;
  const activeGroupLabel = useMemo(() => {
    if (activeGroupId === 'all') return '全部';
    if (activeGroupId === 'none') return '未分组';
    return groups.find((group) => group.id === activeGroupId)?.name || '全部';
  }, [activeGroupId, groups]);

  const list = useMemo(() => {
    const ids = Array.from(favoriteIds);
    return ids.map((id) => animeIndex.get(id)).filter(Boolean);
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
    if (activeGroupId === 'none') {
      return list.filter((anime) => !groupMap.has(anime.id));
    }
    const group = groups.find((item) => item.id === activeGroupId);
    if (!group) return list;
    const idSet = new Set(group.itemIds || []);
    return list.filter((anime) => idSet.has(anime.id));
  }, [activeGroupId, groupMap, groups, list]);

  const mergedFavoritesOrder = useMemo(() => {
    const current = list.map((anime) => anime.id);
    const currentSet = new Set(current);
    const normalized = normalizeIdList(favoritesOrder);
    const keep = normalized.filter((id) => currentSet.has(id));
    const seen = new Set(keep);
    const missing = current.filter((id) => !seen.has(id));
    return [...keep, ...missing];
  }, [favoritesOrder, list]);

  useEffect(() => {
    const currentSet = new Set(list.map((anime) => anime.id));
    const normalizedStored = normalizeIdList(favoritesOrder).filter((id) => currentSet.has(id));
    if (arraysEqual(normalizedStored, mergedFavoritesOrder)) return;
    setFavoritesOrder(mergedFavoritesOrder);
  }, [favoritesOrder, list, mergedFavoritesOrder, setFavoritesOrder]);

  useEffect(() => {
    if (sortId !== SORTS.custom.id || activeGroupId !== 'all') {
      setIsReordering(false);
    }

    if (isReordering) return;
    setDraftFavoritesOrder(mergedFavoritesOrder);
  }, [activeGroupId, isReordering, mergedFavoritesOrder, sortId]);

  const customList = useMemo(() => {
    const map = new Map(list.map((anime) => [anime.id, anime]));
    const order =
      sortId === SORTS.custom.id && activeGroupId === 'all' && draftFavoritesOrder.length > 0
        ? draftFavoritesOrder
        : mergedFavoritesOrder;
    const ordered = order.map((id) => map.get(id)).filter(Boolean);

    if (activeGroupId === 'all') return ordered;
    if (activeGroupId === 'none') return ordered.filter((anime) => !groupMap.has(anime.id));
    const group = groups.find((item) => item.id === activeGroupId);
    if (!group) return ordered;
    const idSet = new Set(group.itemIds || []);
    return ordered.filter((anime) => idSet.has(anime.id));
  }, [activeGroupId, draftFavoritesOrder, groupMap, groups, list, mergedFavoritesOrder, sortId]);

  const beginReorder = useCallback(() => {
    setIsReordering(true);
  }, []);

  const sortedList = useMemo(() => {
    if (sortId === SORTS.custom.id) return customList;
    const next = [...filteredList];
    next.sort(sort.sortFn);
    return next;
  }, [customList, filteredList, sort.sortFn, sortId]);

  const updateGroupAssignment = useCallback(
    (animeId, nextGroupId) => {
      const currentGroupId = groupMap.get(animeId);
      if (currentGroupId) {
        removeFavoriteFromGroup(currentGroupId, animeId);
      }
      if (nextGroupId && nextGroupId !== 'none' && nextGroupId !== 'all') {
        assignFavoriteToGroup(nextGroupId, animeId);
      }
      setGroups(getFavoriteGroups());
      trackEvent('favorites.groups.assign', { id: animeId, group: nextGroupId });
    },
    [groupMap],
  );

  const clearDragState = useCallback(() => {
    setDraggingId(null);
    setDragOverGroupId(null);
  }, []);

  const getDragIdFromEvent = (event) => {
    if (!event) return null;
    const raw = event.dataTransfer?.getData?.('text/plain');
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
  };

  const startGroupDrag = useCallback(
    (animeId) => (event) => {
      const id = Number(animeId);
      if (!Number.isFinite(id) || id <= 0) return;
      setDraggingId(id);
      setDragOverGroupId(null);
      try {
        event.dataTransfer?.setData?.('text/plain', String(id));
        event.dataTransfer.effectAllowed = 'move';
      } catch {}
      trackEvent('favorites.dragGroup.start', { id });
    },
    [],
  );

  const endGroupDrag = useCallback(() => {
    clearDragState();
  }, [clearDragState]);

  const dropToGroup = useCallback(
    (groupId) => (event) => {
      if (!draggingId) return;
      event.preventDefault();

      const id = draggingId || getDragIdFromEvent(event);
      if (!id) return;

      clearDragState();

      updateGroupAssignment(id, groupId);

      const groupName =
        groupId === 'none' ? '未分组' : groups.find((g) => g.id === groupId)?.name || '分组';

      toast.success('已移动分组', `《${animeIndex.get(id)?.title || `#${id}`}》 → ${groupName}`, {
        celebrate: true,
        durationMs: 2200,
      });
      trackEvent('favorites.dragGroup.drop', { id, group: groupId });
    },
    [clearDragState, draggingId, groups, toast, updateGroupAssignment],
  );

  const allowDrop = useCallback(
    (groupId) => (event) => {
      if (!draggingId) return;
      event.preventDefault();
      setDragOverGroupId((prev) => (prev === groupId ? prev : groupId));
      try {
        event.dataTransfer.dropEffect = 'move';
      } catch {}
    },
    [draggingId],
  );

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
      meta={<span>最近更新：{formatZhDateTime(updatedAt, '暂无记录')} · 支持导入/导出</span>}
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
        <strong>{activeGroupLabel}</strong>
      </Summary>

      <GroupRow>
        <GroupChip
          type="button"
          $active={activeGroupId === 'all'}
          onClick={() => setActiveGroupId('all')}
        >
          全部
        </GroupChip>
        <GroupChip
          type="button"
          $active={activeGroupId === 'none'}
          $droppable={Boolean(draggingId)}
          $dragOver={dragOverGroupId === 'none'}
          onClick={() => setActiveGroupId('none')}
          onDragOver={allowDrop('none')}
          onDragEnter={allowDrop('none')}
          onDragLeave={() => {
            if (dragOverGroupId === 'none') setDragOverGroupId(null);
          }}
          onDrop={dropToGroup('none')}
        >
          未分组
        </GroupChip>
        {groups.map((group) => (
          <GroupChip
            key={group.id}
            type="button"
            $active={activeGroupId === group.id}
            onClick={() => setActiveGroupId(group.id)}
            $droppable={Boolean(draggingId)}
            $dragOver={dragOverGroupId === group.id}
            onDragOver={allowDrop(group.id)}
            onDragEnter={allowDrop(group.id)}
            onDragLeave={() => {
              if (dragOverGroupId === group.id) setDragOverGroupId(null);
            }}
            onDrop={dropToGroup(group.id)}
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
        sortId === SORTS.custom.id && activeGroupId === 'all' ? (
          <div data-divider="list">
            <Summary style={{ marginBottom: 'var(--spacing-sm)' }}>
              提示：使用“自定义”排序后，拖拽 <FiMove style={{ verticalAlign: 'middle' }} />{' '}
              即可调整顺序（自动保存）。
            </Summary>

            <SortableList
              values={draftFavoritesOrder.length > 0 ? draftFavoritesOrder : mergedFavoritesOrder}
              onReorder={(next) => setDraftFavoritesOrder(next)}
              onDragEnd={() => {
                setIsReordering(false);
                setFavoritesOrder(normalizeIdList(draftFavoritesOrder));
                trackEvent('favorites.reorder', { count: draftFavoritesOrder.length });
              }}
            >
              {customList.map((anime) => (
                <SortableFavoriteRow
                  key={anime.id}
                  anime={anime}
                  reducedMotion={reducedMotion}
                  groups={groups}
                  groupMap={groupMap}
                  updateGroupAssignment={updateGroupAssignment}
                  startGroupDrag={startGroupDrag}
                  endGroupDrag={endGroupDrag}
                  onStartReorder={beginReorder}
                />
              ))}
            </SortableList>
          </div>
        ) : (
          <AnimeGrid $bento>
            {sortedList.map((anime) => (
              <FavoriteItem key={anime.id}>
                <AnimeCard anime={anime} />
                <HandleRow aria-label="分组拖拽">
                  {groups.length > 0 ? (
                    <DragGroupHandle
                      aria-label="拖拽到分组"
                      title="拖拽到上方分组标签：移动分组"
                      onDragStart={startGroupDrag(anime.id)}
                      onDragEnd={endGroupDrag}
                      onClick={(event) => event.preventDefault()}
                    >
                      <FiFolder /> 拖到分组
                    </DragGroupHandle>
                  ) : null}
                </HandleRow>
                <SelectField
                  aria-label="选择分组"
                  value={groupMap.get(anime.id) || 'none'}
                  onChange={(event) => updateGroupAssignment(anime.id, event.target.value)}
                >
                  <option value="none">未分组</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </SelectField>
              </FavoriteItem>
            ))}
          </AnimeGrid>
        )
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
