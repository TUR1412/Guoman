import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FiGrid } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData from '../data/animeData';

const CATEGORY_MAP = {
  action: { title: '热血动作', tag: '热血' },
  fantasy: { title: '奇幻玄幻', tag: '奇幻' },
  ancient: { title: '古风仙侠', tag: '古风' },
  scifi: { title: '科幻未来', tag: '科幻' },
  comedy: { title: '轻松搞笑', tag: '搞笑' },
};

function CategoryPage() {
  const { category } = useParams();
  const meta = CATEGORY_MAP[category];

  const results = useMemo(() => {
    if (!meta) return [];
    return animeData.filter((anime) => (anime.tags || []).includes(meta.tag));
  }, [meta]);

  if (!meta) {
    return (
      <PageShell title="分类不存在" subtitle="你访问的分类可能拼写错误或暂未开放。">
        <EmptyState
          icon={<FiGrid size={22} />}
          title="找不到这个分类"
          description="回到推荐页，从标签和筛选开始探索。"
          primaryAction={{ href: '#/recommendations', label: '去看推荐' }}
          secondaryAction={{ href: '#/', label: '回到首页' }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`分类：${meta.title}`}
      subtitle={`当前分类标签映射为「${meta.tag}」，后续可接入更精细的分类体系。`}
    >
      {results.length > 0 ? (
        <AnimeGrid>
          {results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      ) : (
        <EmptyState
          icon={<FiGrid size={22} />}
          title="这个分类下暂无作品"
          description="我们会持续补充内容，先去看看推荐与排行榜吧。"
          primaryAction={{ href: '#/rankings', label: '看看排行榜' }}
          secondaryAction={{ href: '#/recommendations', label: '去看推荐' }}
        />
      )}
    </PageShell>
  );
}

export default CategoryPage;
