import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import newsData from '../data/newsData';

const Article = styled.article`
  display: grid;
  gap: var(--spacing-lg);
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
`;

const Tag = styled.span`
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.12);
`;

const Paragraph = styled.p`
  color: var(--text-secondary);
  line-height: 1.85;
  font-size: 1.05rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 700;
`;

const formatDate = (value) =>
  new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(value),
  );

function NewsDetailPage() {
  const { id } = useParams();
  const item = newsData.find((n) => n.id === id);

  if (!item) {
    return (
      <PageShell title="资讯不存在" subtitle="你访问的文章可能已被移动或删除。">
        <EmptyState
          title="找不到这篇文章"
          description="试试返回资讯列表，或者回到首页继续探索。"
          primaryAction={{ href: '#/news', label: '返回资讯' }}
          secondaryAction={{ href: '#/', label: '回到首页' }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={item.title}
      subtitle={item.summary}
      actions={
        <BackLink to="/news">
          <FiArrowLeft />
          返回列表
        </BackLink>
      }
    >
      <Article>
        <Meta>
          <span>{formatDate(item.date)}</span>
          {item.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Meta>
        {item.content.map((p, idx) => (
          <Paragraph key={idx}>{p}</Paragraph>
        ))}
      </Article>
    </PageShell>
  );
}

export default NewsDetailPage;

