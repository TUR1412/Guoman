import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FiGrid } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import VirtualizedGrid from '../components/VirtualizedGrid';
import animeData from '../data/animeData';
import styled from 'styled-components';
import { usePersistedState } from '../utils/usePersistedState';
import { trackEvent } from '../utils/analytics';
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

const CATEGORY_MAP = {
  action: { title: '热血动作', tag: '热血' },
  fantasy: { title: '奇幻玄幻', tag: '奇幻' },
  ancient: { title: '古风仙侠', tag: '古风' },
  scifi: { title: '科幻未来', tag: '科幻' },
  comedy: { title: '轻松搞笑', tag: '搞笑' },
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
};

function CategoryPage() {
  const { category } = useParams();
  const meta = CATEGORY_MAP[category];
  const [sortId, setSortId] = usePersistedState(STORAGE_KEYS.categorySort, SORTS.rating.id);

  const sort = SORTS[sortId] || SORTS.rating;

  const results = useMemo(() => {
    if (!meta) return [];
    const list = animeData.filter((anime) => (anime.tags || []).includes(meta.tag));
    return list.sort(sort.sortFn);
  }, [meta, sort.sortFn]);

  if (!meta) {
    return (
      <PageShell title="分类不存在" subtitle="你访问的分类可能拼写错误或暂未开放。">
        <EmptyState
          icon={<FiGrid size={22} />}
          title="找不到这个分类"
          description="回到推荐页，从标签和筛选开始探索。"
          primaryAction={{ to: '/recommendations', label: '去看推荐' }}
          secondaryAction={{ to: '/', label: '回到首页' }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`分类：${meta.title}`}
      subtitle={`当前分类标签映射为「${meta.tag}」，后续可接入更精细的分类体系。`}
      badge="分类"
      meta={<span>标签：{meta.tag}</span>}
      actions={
        <ToggleGroup aria-label="排序方式">
          {Object.values(SORTS).map((item) => (
            <Toggle
              key={item.id}
              type="button"
              $active={sortId === item.id}
              aria-pressed={sortId === item.id}
              onClick={() => {
                setSortId(item.id);
                trackEvent('category.sort.change', { category, sort: item.id });
              }}
            >
              {item.label}
            </Toggle>
          ))}
        </ToggleGroup>
      }
    >
      {results.length > 0 ? (
        results.length > 24 ? (
          <VirtualizedGrid
            items={results}
            renderItem={(anime) => <AnimeCard anime={anime} virtualized />}
          />
        ) : (
          <AnimeGrid $bento>
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </AnimeGrid>
        )
      ) : (
        <EmptyState
          icon={<FiGrid size={22} />}
          title="这个分类下暂无作品"
          description="我们会持续补充内容，先去看看推荐与排行榜吧。"
          primaryAction={{ to: '/rankings', label: '看看排行榜' }}
          secondaryAction={{ to: '/recommendations', label: '去看推荐' }}
        />
      )}
    </PageShell>
  );
}

export default CategoryPage;
