import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import newsData from '../data/newsData';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  transition: var(--transition);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 77, 77, 0.25);
  }
`;

const Title = styled.h2`
  font-size: 1.2rem;
  line-height: 1.3;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: 0.95rem;
`;

const Summary = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
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
  const [activeTag, setActiveTag] = useState('all');

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
      actions={
        <TagRow aria-label="资讯标签筛选">
          {tags.map((tag) => (
            <Tag
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
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
        <Grid role="list">
          {filtered.map((item) => (
            <Card
              key={item.id}
              to={`/news/${item.id}`}
              aria-label={`阅读：${item.title}`}
              role="listitem"
            >
              <Title>{item.title}</Title>
              <Meta>
                <span>{formatDate(item.date)}</span>
                <span>{item.tags.join(' · ')}</span>
              </Meta>
              <Summary>{item.summary}</Summary>
            </Card>
          ))}
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
