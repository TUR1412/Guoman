import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiShare2 } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import newsData from '../data/newsData';
import { useToast } from '../components/ToastProvider';
import { shareOrCopyLink } from '../utils/share';
import { recordNewsRead } from '../utils/newsHistory';
import { trackEvent } from '../utils/analytics';

const DetailGrid = styled.div.attrs({ 'data-stagger': true, 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-2xl);
`;

const Article = styled.article.attrs({ 'aria-label': '资讯正文' })`
  display: grid;
  gap: var(--spacing-lg);
  grid-column: span 8;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const Meta = styled.div.attrs({ role: 'list', 'aria-label': '资讯元信息' })`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm-plus);
  color: var(--text-tertiary);
`;

const Tag = styled.span.attrs({ role: 'listitem' })`
  padding: var(--spacing-xs) var(--spacing-sm-wide);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
`;

const Paragraph = styled.p`
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  font-size: var(--text-base-plus);
`;

const BackLink = styled(Link).attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--primary-color);
  font-weight: 700;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
`;

const ActionButton = styled.button.attrs({
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md-tight);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-secondary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    color: var(--text-primary);
  }
`;

const SideCard = styled.aside.attrs({
  'data-parallax': true,
  'data-card': true,
  'data-divider': 'card',
})`
  grid-column: span 4;
  align-self: start;
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      200px 140px at 10% 0%,
      var(--primary-soft),
      transparent 70%
    );
    opacity: 0.55;
    pointer-events: none;
  }

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const SideTitle = styled.h3`
  font-size: var(--text-base-plus);
  color: var(--text-primary);
  position: relative;
  z-index: 1;
`;

const SideMeta = styled.div`
  display: grid;
  gap: var(--spacing-xs-plus);
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
`;

const SideTags = styled.div.attrs({ 'data-divider': 'inline', role: 'list' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const SideActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const formatDate = (value) =>
  new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(value),
  );

const estimateReadTime = (paragraphs = []) => {
  const text = paragraphs.join('');
  const minutes = Math.max(1, Math.ceil(text.length / 300));
  return `${minutes} 分钟`;
};

function NewsDetailPage() {
  const { id } = useParams();
  const item = newsData.find((n) => n.id === id);
  const toast = useToast();

  useEffect(() => {
    if (!item) return;
    recordNewsRead({ id: item.id, title: item.title });
    trackEvent('news.read', { id: item.id });
  }, [item]);

  if (!item) {
    return (
      <PageShell title="资讯不存在" subtitle="你访问的文章可能已被移动或删除。">
        <EmptyState
          title="找不到这篇文章"
          description="试试返回资讯列表，或者回到首页继续探索。"
          primaryAction={{ to: '/news', label: '返回资讯' }}
          secondaryAction={{ to: '/', label: '回到首页' }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={item.title}
      subtitle={item.summary}
      badge="资讯"
      meta={<span>阅读时长：{estimateReadTime(item.content)}</span>}
      actions={
        <ActionRow>
          <BackLink to="/news">
            <FiArrowLeft />
            返回列表
          </BackLink>
          <ActionButton
            type="button"
            onClick={async () => {
              const url = window.location.href;
              const result = await shareOrCopyLink({ title: item.title, url });
              trackEvent('news.share', {
                id: item.id,
                method: result.method || 'unknown',
                ok: result.ok,
              });

              if (result.ok && result.method === 'share') {
                toast.success('已打开分享面板', '把这篇资讯分享给朋友吧。');
                return;
              }

              if (result.ok && result.method === 'clipboard') {
                toast.success('链接已复制', '已复制到剪贴板，直接粘贴发送即可。');
                return;
              }

              toast.warning('无法自动复制', '请手动从地址栏复制当前链接。');
            }}
          >
            <FiShare2 />
            分享
          </ActionButton>
        </ActionRow>
      }
    >
      <DetailGrid>
        <Article>
          <Meta>
            <span role="listitem">{formatDate(item.date)}</span>
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </Meta>
          {item.content.map((p, idx) => (
            <Paragraph key={idx}>{p}</Paragraph>
          ))}
        </Article>

        <SideCard aria-label="资讯详情侧栏">
          <SideTitle>文章信息</SideTitle>
          <SideMeta>
            <span>发布时间：{formatDate(item.date)}</span>
            <span>阅读时长：{estimateReadTime(item.content)}</span>
          </SideMeta>
          <SideTags>
            {item.tags.map((t) => (
              <Tag key={`side-${t}`}>{t}</Tag>
            ))}
          </SideTags>
          <SideActions>
            <ActionButton
              type="button"
              onClick={async () => {
                const url = window.location.href;
                const result = await shareOrCopyLink({ title: item.title, url });
                trackEvent('news.share', {
                  id: item.id,
                  method: result.method || 'unknown',
                  ok: result.ok,
                });

                if (result.ok && result.method === 'share') {
                  toast.success('已打开分享面板', '把这篇资讯分享给朋友吧。');
                  return;
                }

                if (result.ok && result.method === 'clipboard') {
                  toast.success('链接已复制', '已复制到剪贴板，直接粘贴发送即可。');
                  return;
                }

                toast.warning('无法自动复制', '请手动从地址栏复制当前链接。');
              }}
            >
              <FiShare2 />
              分享资讯
            </ActionButton>
          </SideActions>
        </SideCard>
      </DetailGrid>
    </PageShell>
  );
}

export default NewsDetailPage;



