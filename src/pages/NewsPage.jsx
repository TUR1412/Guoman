import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import newsData from '../data/newsData';
import { usePersistedState } from '../utils/usePersistedState';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { prefetchRoute } from '../utils/routePrefetch';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  grid-auto-flow: dense;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-pressable': true,
})`
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  transition: var(--transition);
  grid-column: span 4;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-soft-border);
  }

  &:focus-visible {
    outline: 2px solid rgba(var(--primary-rgb), 0.7);
    outline-offset: 2px;
  }
`;

const FeaturedCard = styled(Card).attrs({
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  grid-column: span 8;
  grid-row: span 2;

  @media (max-width: 992px) {
    grid-column: span 1;
    grid-row: auto;
  }
`;

const Title = styled.h2`
  font-size: var(--text-lg-plus);
  line-height: var(--leading-snug);
  font-family: var(--font-display);
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: var(--text-sm-plus);
`;

const Summary = styled.p`
  color: var(--text-secondary);
  line-height: var(--leading-loose);
`;

const TagRow = styled.div.attrs({ role: 'list', 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const Tag = styled.button.attrs({ role: 'listitem', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: var(--spacing-xs) var(--spacing-sm-wide);
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

const formatDate = (value) =>
  new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(value),
  );

function NewsPage() {
  const [activeTag, setActiveTag] = usePersistedState(STORAGE_KEYS.newsFilter, 'all');

  const tags = useMemo(() => {
    const set = new Set();
    newsData.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    if (activeTag === 'all') return newsData;
    return newsData.filter((n) => n.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <PageShell
      title="最新资讯"
      subtitle="精选短读：趋势、制作、盘点与幕后，让你更懂国漫。"
      badge="资讯"
      meta={<span>趋势 · 盘点 · 幕后</span>}
      actions={
        <TagRow aria-label="资讯标签筛选">
          {tags.map((tag) => (
            <Tag
              key={tag}
              type="button"
              onClick={() => {
                setActiveTag(tag);
                trackEvent('news.tag.change', { tag });
              }}
              $active={activeTag === tag}
              aria-pressed={activeTag === tag}
            >
              <FiTag />
              {tag === 'all' ? '全部' : tag}
            </Tag>
          ))}
        </TagRow>
      }
    >
      {filtered.length > 0 ? (
        <Grid role="list" aria-label="资讯列表">
          {filtered.map((item, index) => {
            const Component = index === 0 ? FeaturedCard : Card;
            return (
              <Component
                key={item.id}
                to={`/news/${item.id}`}
                aria-label={`阅读：${item.title}`}
                role="listitem"
                onMouseEnter={() => prefetchRoute(`/news/${item.id}`)}
                onFocus={() => prefetchRoute(`/news/${item.id}`)}
              >
                <Title>{item.title}</Title>
                <Meta>
                  <span>{formatDate(item.date)}</span>
                  <span>{item.tags.join(' · ')}</span>
                </Meta>
                <Summary>{item.summary}</Summary>
              </Component>
            );
          })}
        </Grid>
      ) : (
        <EmptyState
          title="暂无相关资讯"
          description="换个标签试试，或者稍后再来看看。"
          primaryAction={{ to: '/recommendations', label: '去看推荐' }}
          secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
        />
      )}
    </PageShell>
  );
}

export default NewsPage;
