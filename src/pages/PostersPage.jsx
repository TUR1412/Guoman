import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiImage, FiShare2, FiTrash2 } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastProvider';
import { downloadTextFile } from '../utils/download';
import {
  buildPosterSvg,
  clearSharePosters,
  getSharePosters,
  recordSharePoster,
} from '../utils/sharePoster';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { trackEvent } from '../utils/analytics';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Card = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 6;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      260px 180px at 12% 0%,
      rgba(var(--secondary-rgb), 0.16),
      transparent 62%
    );
    opacity: 0.8;
    pointer-events: none;
  }

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const WideCard = styled(Card)`
  grid-column: 1 / -1;
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  font-family: var(--font-display);
  position: relative;
  z-index: 1;
`;

const Muted = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  position: relative;
  z-index: 1;
`;

const Form = styled.form`
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const Label = styled.label`
  display: grid;
  gap: 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

const Input = styled.input.attrs({ 'data-focus-guide': true })`
  padding: 10px 12px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-soft-border);
    background: var(--field-bg-focus);
    box-shadow: var(--shadow-ring);
  }
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Button = styled.button.attrs({
  type: 'button',
  'data-pressable': true,
  'data-shimmer': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm-plus) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: var(--chip-border-hover);
    background: var(--surface-soft-hover);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  border-color: var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.16);
`;

const Preview = styled.div.attrs({ 'data-card': true })`
  position: relative;
  z-index: 1;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-paper);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
`;

const PreviewImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const HistoryList = styled.div.attrs({ role: 'list', 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const HistoryItem = styled.div.attrs({ role: 'listitem' })`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-paper);
  box-shadow: var(--shadow-sm);

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Thumb = styled.div`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  max-width: 220px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const HistoryMain = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const HistoryTitle = styled.div`
  font-weight: 900;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HistoryMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const formatTime = (timestamp) => {
  if (!timestamp) return '未知时间';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleString('zh-CN');
  }
};

const svgToDataUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const safeFilename = (value) =>
  String(value || 'poster')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .slice(0, 40);

function PostersPage() {
  const toast = useToast();
  const [signal, setSignal] = useState(0);
  const [title, setTitle] = useState('凡人修仙传');
  const [subtitle, setSubtitle] = useState('一口气追到上头的国漫推荐');
  const [rating, setRating] = useState('4.8');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onStorage = (event) => {
      const key = event?.detail?.key || event?.key;
      if (key === STORAGE_KEYS.sharePoster) {
        setSignal((prev) => prev + 1);
      }
    };

    window.addEventListener('guoman:storage', onStorage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('guoman:storage', onStorage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const svg = useMemo(() => buildPosterSvg({ title, subtitle, rating }), [rating, subtitle, title]);
  const previewSrc = useMemo(() => svgToDataUri(svg), [svg]);
  const history = useMemo(() => {
    void signal;
    return getSharePosters();
  }, [signal]);

  const onDownload = () => {
    const file = `guoman-poster-${safeFilename(title)}.svg`;
    downloadTextFile(svg, file, 'image/svg+xml;charset=utf-8');
    recordSharePoster({ title, subtitle });
    setSignal((prev) => prev + 1);
    toast.success('海报已下载', '已为你生成 SVG 海报，可直接用于社交分享。');
    trackEvent('poster.download', { title: String(title || '').slice(0, 30) });
  };

  const onClearHistory = () => {
    const ok = window.confirm('确定要清空海报历史吗？此操作不可撤销。');
    if (!ok) return;
    clearSharePosters();
    setSignal((prev) => prev + 1);
    toast.info('已清空海报历史', '你可以随时重新生成。');
    trackEvent('poster.history.clear');
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onDownload();
  };

  return (
    <PageShell
      title="海报工坊"
      subtitle="把你的国漫推荐“做成一张图”。支持一键生成 SVG 海报 + 历史管理（本地保存）。"
      badge="增长模块"
      meta={<span>分享裂变 · 海报生成 · SVG 导出</span>}
      actions={
        <Actions>
          <PrimaryButton onClick={onDownload} title="下载 SVG 海报">
            <FiDownload /> 下载海报
          </PrimaryButton>
          <Button onClick={onClearHistory} title="清空海报历史" disabled={history.length === 0}>
            <FiTrash2 /> 清空历史
          </Button>
        </Actions>
      }
    >
      <Grid>
        <Card aria-label="海报生成器">
          <Title>
            <FiShare2 /> 生成海报
          </Title>
          <Muted>建议 10-18 个字以内：更适合海报排版。</Muted>
          <Form onSubmit={onSubmit}>
            <Label>
              标题
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：凡人修仙传"
                maxLength={40}
              />
            </Label>
            <Label>
              副标题
              <Input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="例如：国漫世界 · 今日推荐"
                maxLength={60}
              />
            </Label>
            <Label>
              评分（可选）
              <Input
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="例如：4.8"
                maxLength={10}
              />
            </Label>
            <Actions>
              <PrimaryButton type="submit">
                <FiDownload /> 下载 SVG
              </PrimaryButton>
              <Button
                onClick={() => {
                  setTitle('国漫世界');
                  setSubtitle('把喜欢的国漫推荐给朋友');
                  setRating('');
                }}
                title="快速填充示例"
              >
                <FiImage /> 用示例
              </Button>
            </Actions>
          </Form>
        </Card>

        <Card aria-label="海报预览">
          <Title>
            <FiImage /> 预览
          </Title>
          <Muted>预览为 SVG 渲染效果；下载后可直接用于分享或二次编辑。</Muted>
          <Preview>
            <PreviewImg src={previewSrc} alt="海报预览" loading="eager" decoding="async" />
          </Preview>
        </Card>

        <WideCard aria-label="海报历史">
          <Title>
            <FiShare2 /> 历史记录
          </Title>
          {history.length > 0 ? (
            <HistoryList aria-label="海报历史列表">
              {history.map((item) => {
                const itemSvg = buildPosterSvg({
                  title: item.title,
                  subtitle: item.subtitle,
                  rating: '',
                });
                const thumb = svgToDataUri(itemSvg);
                const filename = `guoman-poster-${safeFilename(item.title)}-${item.id}.svg`;

                return (
                  <HistoryItem key={item.id}>
                    <Thumb aria-hidden="true">
                      <img src={thumb} alt="" loading="lazy" decoding="async" />
                    </Thumb>
                    <HistoryMain>
                      <HistoryTitle>{item.title || '分享海报'}</HistoryTitle>
                      <HistoryMeta>
                        {item.subtitle || '无副标题'} · {formatTime(item.createdAt)}
                      </HistoryMeta>
                    </HistoryMain>
                    <Actions>
                      <Button
                        onClick={() => {
                          downloadTextFile(itemSvg, filename, 'image/svg+xml;charset=utf-8');
                          toast.success('已下载历史海报', '已为你重新导出 SVG。');
                          trackEvent('poster.history.download', { id: item.id });
                        }}
                        title="下载该海报"
                      >
                        <FiDownload /> 下载
                      </Button>
                    </Actions>
                  </HistoryItem>
                );
              })}
            </HistoryList>
          ) : (
            <EmptyState
              icon={<FiShare2 size={22} />}
              title="暂无海报历史"
              description="先生成一张海报吧：下载后可直接分享给朋友。"
              primaryAction={{ to: '/recommendations', label: '去看推荐' }}
              secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
            />
          )}
        </WideCard>
      </Grid>
    </PageShell>
  );
}

export default PostersPage;
