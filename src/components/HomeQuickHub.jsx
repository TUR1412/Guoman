import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import animeData, { tagCounts } from '../data/animeData';
import newsData from '../data/newsData';
import { FiBell, FiBookOpen, FiCompass, FiStar, FiTrendingUp } from './icons/feather';
import { trackEvent } from '../utils/analytics';

const Section = styled.section`
  padding: var(--spacing-2xl) 0;
`;

const Inner = styled.div.attrs({ 'data-divider': 'list' })`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const HubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '4',
  'data-pointer-glow': true,
})`
  grid-column: span 5;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(260px 180px at 0% 0%, rgba(var(--primary-rgb), 0.18), transparent 62%),
      radial-gradient(260px 180px at 100% 100%, rgba(var(--secondary-rgb), 0.16), transparent 64%);
    opacity: 0.9;
  }
`;

const SummaryHeader = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--spacing-sm);
`;

const SummaryTitle = styled.h2`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-4xl);
  letter-spacing: 0.01em;
`;

const SummaryDesc = styled.p`
  color: var(--text-tertiary);
  max-width: 40ch;
`;

const Metrics = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm-plus);
`;

const MetricCard = styled.div.attrs({
  'data-divider': 'card',
  'data-elev': '2',
})`
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  padding: var(--spacing-sm-plus) var(--spacing-md);
  display: grid;
  gap: 2px;
`;

const MetricLabel = styled.span`
  color: var(--text-tertiary);
  font-size: var(--text-xs);
`;

const MetricValue = styled.strong`
  font-size: var(--text-2xl);
  letter-spacing: 0.01em;
`;

const TagRow = styled.ul`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs-plus);
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TagItem = styled.li`
  display: inline-flex;
`;

const TagChip = styled(Link).attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0.36rem 0.68rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      background: var(--chip-bg-hover);
      color: var(--text-primary);
    }
  }
`;

const ActionGrid = styled.ul`
  grid-column: span 7;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionItem = styled.li`
  display: flex;
`;

const ActionCard = styled(Link).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
  'data-pressable': true,
})`
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: grid;
  gap: var(--spacing-sm-plus);
  position: relative;
  overflow: hidden;

  .icon {
    width: 38px;
    height: 38px;
    border-radius: var(--border-radius-pill);
    display: grid;
    place-items: center;
    border: 1px solid var(--border-subtle);
    color: var(--primary-color);
    background: var(--surface-soft);
  }

  .title {
    font-size: var(--text-lg);
    font-weight: 700;
  }

  .desc {
    color: var(--text-tertiary);
    line-height: var(--leading-relaxed);
    font-size: var(--text-sm);
  }

  .link {
    font-size: var(--text-xs);
    color: var(--primary-color);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 700;
  }
`;

const actionBlueprints = [
  {
    to: '/recommendations',
    icon: FiCompass,
    title: '口味推荐',
    desc: '基于收藏与观看历史，快速发现下一部。',
  },
  {
    to: '/rankings',
    icon: FiTrendingUp,
    title: '实时榜单',
    desc: '热度榜 + 评分榜，快速锁定站内热门。',
  },
  { to: '/following', icon: FiBell, title: '追更中心', desc: '集中管理在追作品与更新提醒。' },
  { to: '/news', icon: FiBookOpen, title: '资讯速递', desc: '行业动态、制作解析与视觉趋势。' },
];

export default function HomeQuickHub() {
  const stats = useMemo(() => {
    const totalWorks = animeData.length;
    const averageRating = (
      animeData.reduce((sum, anime) => sum + (anime.rating || 0), 0) / totalWorks
    ).toFixed(1);
    const ongoingCount = animeData.filter((anime) => anime.status === '连载中').length;
    const ongoingRatio = Math.round((ongoingCount / totalWorks) * 100);
    const latestYear = animeData.reduce((max, anime) => Math.max(max, anime.releaseYear || 0), 0);
    const topTags = Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    return {
      totalWorks,
      averageRating,
      ongoingRatio,
      latestYear,
      topTags,
    };
  }, []);

  return (
    <Section aria-label="首页导航枢纽">
      <Inner>
        <HubGrid>
          <SummaryCard>
            <SummaryHeader>
              <SummaryTitle>
                <FiStar />
                本周观影导航
              </SummaryTitle>
              <SummaryDesc>
                以首页数据为锚点，快速了解站内内容规模、更新节奏与热点标签，减少“找片”路径成本。
              </SummaryDesc>
            </SummaryHeader>

            <Metrics role="list" aria-label="站内概览数据">
              <MetricCard role="listitem">
                <MetricLabel>作品总量</MetricLabel>
                <MetricValue>{stats.totalWorks} 部</MetricValue>
              </MetricCard>
              <MetricCard role="listitem">
                <MetricLabel>连载占比</MetricLabel>
                <MetricValue>{stats.ongoingRatio}%</MetricValue>
              </MetricCard>
              <MetricCard role="listitem">
                <MetricLabel>平均评分</MetricLabel>
                <MetricValue>{stats.averageRating}</MetricValue>
              </MetricCard>
              <MetricCard role="listitem">
                <MetricLabel>最新年份</MetricLabel>
                <MetricValue>{stats.latestYear || '—'}</MetricValue>
              </MetricCard>
            </Metrics>

            <TagRow aria-label="热点标签">
              {stats.topTags.map(([tag, count]) => (
                <TagItem key={tag}>
                  <TagChip
                    to={`/tag/${encodeURIComponent(tag)}`}
                    onClick={() => trackEvent('home.quickHub.tag.open', { tag })}
                    title={`查看 ${tag} 相关作品`}
                  >
                    #{tag}
                    <span>{count}</span>
                  </TagChip>
                </TagItem>
              ))}
            </TagRow>
          </SummaryCard>

          <ActionGrid aria-label="首页快捷入口">
            {actionBlueprints.map((action) => {
              const Icon = action.icon;
              const desc =
                action.to === '/news'
                  ? `${action.desc} 当前收录 ${newsData.length} 条动态。`
                  : action.desc;
              return (
                <ActionItem key={action.to}>
                  <ActionCard
                    to={action.to}
                    title={action.title}
                    onClick={() => trackEvent('home.quickHub.navigate', { target: action.to })}
                  >
                    <span className="icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="title">{action.title}</span>
                    <span className="desc">{desc}</span>
                    <span className="link">立即前往</span>
                  </ActionCard>
                </ActionItem>
              );
            })}
          </ActionGrid>
        </HubGrid>
      </Inner>
    </Section>
  );
}
