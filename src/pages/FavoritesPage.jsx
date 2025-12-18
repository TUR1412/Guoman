import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { FiDownload, FiHeart, FiTrash2, FiUpload } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { useFavorites } from '../components/FavoritesProvider';
import { useToast } from '../components/ToastProvider';
import { downloadTextFile } from '../utils/download';
import animeData from '../data/animeData';

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
  }

  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 77, 77, 0.45);
  background: rgba(255, 77, 77, 0.16);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
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

function FavoritesPage() {
  const { favoriteIds, clearFavorites, exportFavoritesBackup, importFavoritesBackup } =
    useFavorites();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const importModeRef = useRef('merge');

  const list = useMemo(() => {
    const ids = Array.from(favoriteIds);
    return ids.map((id) => animeData.find((a) => a.id === id)).filter(Boolean);
  }, [favoriteIds]);

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

  const startImport = (mode) => {
    if (mode === 'replace' && favoriteIds.size > 0) {
      const ok = window.confirm('覆盖导入会用备份内容替换你当前的收藏。确定继续吗？');
      if (!ok) return;
    }

    importModeRef.current = mode;
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
      summary = importFavoritesBackup(text, { mode: importModeRef.current });
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

    if (summary.mode === 'replace') {
      toast.success('已覆盖导入', `导入 ${summary.imported} 条收藏，现有 ${summary.after} 条。`);
      return;
    }

    toast.success(
      '已导入收藏',
      `导入 ${summary.imported} 条收藏，新增加 ${summary.added} 条，共 ${summary.after} 条。`,
    );
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
      actions={
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
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

          <DangerButton type="button" onClick={onClear} disabled={favoriteIds.size === 0}>
            <FiTrash2 />
            清空
          </DangerButton>
        </>
      }
    >
      <Summary>
        共收藏 <strong>{favoriteIds.size}</strong> 部作品 · 支持本地备份/恢复（JSON 文件）
      </Summary>

      {list.length > 0 ? (
        <AnimeGrid>
          {list.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      ) : (
        <EmptyState
          icon={<FiHeart size={22} />}
          title="你还没有收藏任何作品"
          description="去作品详情页点一下“收藏”，它就会出现在这里。"
          primaryAction={{ href: '#/recommendations', label: '去看推荐' }}
          secondaryAction={{ href: '#/rankings', label: '看看排行榜' }}
        />
      )}
    </PageShell>
  );
}

export default FavoritesPage;
