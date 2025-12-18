import React from 'react';
import PageShell from '../components/PageShell';
import AnimeList from '../components/AnimeList';

function RecommendationsPage() {
  return (
    <PageShell
      title="国漫推荐"
      subtitle="从「精选 / 热门 / 最新」到标签分类，一键找到你的下一部心动国漫。"
    >
      <AnimeList
        title="为你精选"
        defaultTab="featured"
        storageKey="guoman.recommendations.activeTab"
      />
    </PageShell>
  );
}

export default RecommendationsPage;
