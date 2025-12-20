import React from 'react';
import PageShell from '../components/PageShell';
import AnimeList from '../components/AnimeList';
import { STORAGE_KEYS } from '../utils/dataKeys';

function RecommendationsPage() {
  return (
    <PageShell
      title="国漫推荐"
      subtitle="从「精选 / 热门 / 最新」到标签分类，一键找到你的下一部心动国漫。"
      badge="推荐精选"
      meta={<span>精选推荐 · 标签筛选 · 一键收藏</span>}
    >
      <AnimeList
        title="为你精选"
        defaultTab="featured"
        storageKey={STORAGE_KEYS.recommendationsTab}
      />
    </PageShell>
  );
}

export default RecommendationsPage;



