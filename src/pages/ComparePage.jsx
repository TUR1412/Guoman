import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiColumns, FiRefreshCcw, FiTrash2 } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import animeData, { animeIndex } from '../data/animeData';
import { useToast } from '../components/ToastProvider';
import { getCompareList, setCompareList, toggleCompare } from '../utils/compareStore';
import { trackEvent } from '../utils/analytics';
import { useStorageSignal } from '../utils/useStorageSignal';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { SelectField } from '../ui';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  align-items: start;
`;

const Controls = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
`;

const ActionButton = styled.button.attrs({
  type: 'button',
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm-plus) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      border-color: var(--chip-border-hover);
      background: var(--surface-soft-hover);
      box-shadow: var(--shadow-glow);
    }
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(ActionButton)`
  border-color: var(--danger-border);
  background: rgba(var(--danger-rgb), 0.12);
`;

const CompareCard = styled.section.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '4',
})`
  grid-column: span 6;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: var(--spacing-md);
  align-items: center;
`;

const Cover = styled.div`
  width: 96px;
  height: 128px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-paper);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;

const CardTitle = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const Title = styled.div`
  font-size: var(--text-xl);
  font-weight: 900;
  font-family: var(--font-display);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Subtitle = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const MetaRow = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
`;

const Table = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  grid-column: 1 / -1;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

const RowLabel = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  font-weight: 700;
`;

const RowValue = styled.div`
  color: var(--text-primary);
  font-size: var(--text-sm);
  min-width: 0;
`;

const RowValueLink = styled(Link).attrs({ 'data-pressable': true })`
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 6px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  transition: var(--transition);
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      background: var(--chip-bg-hover);
    }
  }
`;

const formatNumber = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  return num.toLocaleString();
};

const formatString = (value) => {
  const text = String(value || '').trim();
  return text || '—';
};

const formatTags = (value) => {
  if (!Array.isArray(value)) return '—';
  const list = value.map((item) => String(item || '').trim()).filter(Boolean);
  if (list.length === 0) return '—';
  return list.slice(0, 10).join(' · ');
};

function ComparePage() {
  const toast = useToast();
  const { signal, bump } = useStorageSignal([STORAGE_KEYS.compareList]);

  const compareIds = useMemo(() => (signal, getCompareList()), [signal]);
  const leftId = compareIds[0] ?? null;
  const rightId = compareIds[1] ?? null;

  const left = leftId ? animeIndex.get(leftId) : null;
  const right = rightId ? animeIndex.get(rightId) : null;

  const options = useMemo(
    () =>
      (Array.isArray(animeData) ? animeData : [])
        .map((item) => ({ id: item.id, title: item.title }))
        .filter((item) => item.id && item.title),
    [],
  );

  const setSide = (side, nextId) => {
    const id = Number(nextId);
    if (!Number.isFinite(id)) return;

    const next = side === 'left' ? [id, rightId].filter(Boolean) : [leftId, id].filter(Boolean);
    const deduped = Array.from(new Set(next)).slice(0, 2);
    setCompareList(deduped);
    bump();
    trackEvent('compare.select', { side, id });
  };

  const onToggle = (id) => {
    const result = toggleCompare(id);
    bump();
    if (!result.changed) return;

    if (result.action === 'add') {
      toast.success('已加入对比', '可在此页并排查看差异。');
      trackEvent('compare.add', { id });
      return;
    }

    toast.info('已移出对比', '你可以继续添加其他作品。');
    trackEvent('compare.remove', { id });
  };

  const onSwap = () => {
    if (!leftId || !rightId) return;
    setCompareList([rightId, leftId]);
    bump();
    trackEvent('compare.swap');
  };

  const onClear = () => {
    setCompareList([]);
    bump();
    trackEvent('compare.clear');
  };

  const ready = Boolean(left && right);

  return (
    <PageShell
      title="作品对比"
      subtitle="把两部作品放在同一张“数据卡”上：更快做出下一部要看的决定。"
      badge="高级功能"
      meta={<span>最多 2 个作品 · Local-first · 支持导入导出</span>}
      actions={
        <Controls>
          <ActionButton onClick={onSwap} disabled={!ready} title="交换左右对比顺序">
            <FiRefreshCcw /> 交换
          </ActionButton>
          <DangerButton onClick={onClear} disabled={compareIds.length === 0} title="清空对比列表">
            <FiTrash2 /> 清空
          </DangerButton>
        </Controls>
      }
    >
      {!ready ? (
        <EmptyState
          icon={<FiColumns size={22} />}
          title="还没选满 2 个作品"
          description="从任意作品卡片点“加入对比”，或在下方选择器中手动指定。"
          primaryAction={{ to: '/recommendations', label: '去看推荐' }}
          secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
        />
      ) : null}

      <Grid>
        <CompareCard aria-label="对比对象 A">
          <CardHeader>
            <Cover aria-hidden="true">
              {left?.cover ? <img src={left.cover} alt="" loading="lazy" decoding="async" /> : null}
            </Cover>
            <CardTitle>
              <Title title={left?.title || ''}>{left?.title || '未选择'}</Title>
              <Subtitle>{left ? `${left.releaseYear} · ${left.status}` : '请选择作品'}</Subtitle>
              <MetaRow>
                <Chip title="评分">评分 {formatNumber(left?.rating)}</Chip>
                <Chip title="人气">人气 {formatNumber(left?.popularity)}</Chip>
              </MetaRow>
            </CardTitle>
          </CardHeader>

          <SelectField
            aria-label="选择对比对象 A"
            value={leftId ?? ''}
            onChange={(event) => setSide('left', event.target.value)}
          >
            <option value="">请选择作品</option>
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </SelectField>

          {left ? (
            <ActionButton onClick={() => onToggle(left.id)} title="从对比中移除该作品">
              <FiTrash2 /> 移除
            </ActionButton>
          ) : null}
        </CompareCard>

        <CompareCard aria-label="对比对象 B">
          <CardHeader>
            <Cover aria-hidden="true">
              {right?.cover ? (
                <img src={right.cover} alt="" loading="lazy" decoding="async" />
              ) : null}
            </Cover>
            <CardTitle>
              <Title title={right?.title || ''}>{right?.title || '未选择'}</Title>
              <Subtitle>{right ? `${right.releaseYear} · ${right.status}` : '请选择作品'}</Subtitle>
              <MetaRow>
                <Chip title="评分">评分 {formatNumber(right?.rating)}</Chip>
                <Chip title="人气">人气 {formatNumber(right?.popularity)}</Chip>
              </MetaRow>
            </CardTitle>
          </CardHeader>

          <SelectField
            aria-label="选择对比对象 B"
            value={rightId ?? ''}
            onChange={(event) => setSide('right', event.target.value)}
          >
            <option value="">请选择作品</option>
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </SelectField>

          {right ? (
            <ActionButton onClick={() => onToggle(right.id)} title="从对比中移除该作品">
              <FiTrash2 /> 移除
            </ActionButton>
          ) : null}
        </CompareCard>

        {ready ? (
          <Table aria-label="关键指标对比">
            <TableRow>
              <RowLabel>详情页</RowLabel>
              <RowValue>
                <RowValueLink to={`/anime/${left.id}`}>
                  <span>打开《{left.title}》</span>
                </RowValueLink>
              </RowValue>
              <RowValue>
                <RowValueLink to={`/anime/${right.id}`}>
                  <span>打开《{right.title}》</span>
                </RowValueLink>
              </RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>工作室</RowLabel>
              <RowValue>{formatString(left.studio)}</RowValue>
              <RowValue>{formatString(right.studio)}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>类型</RowLabel>
              <RowValue>{formatString(left.type)}</RowValue>
              <RowValue>{formatString(right.type)}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>集数</RowLabel>
              <RowValue>{formatNumber(left.episodes)}</RowValue>
              <RowValue>{formatNumber(right.episodes)}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>评分</RowLabel>
              <RowValue>{formatNumber(left.rating)}</RowValue>
              <RowValue>{formatNumber(right.rating)}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>人气</RowLabel>
              <RowValue>{formatNumber(left.popularity)}</RowValue>
              <RowValue>{formatNumber(right.popularity)}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>年份</RowLabel>
              <RowValue>{formatNumber(left.releaseYear)}</RowValue>
              <RowValue>{formatNumber(right.releaseYear)}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>标签</RowLabel>
              <RowValue title={formatTags(left.tags)}>{formatTags(left.tags)}</RowValue>
              <RowValue title={formatTags(right.tags)}>{formatTags(right.tags)}</RowValue>
            </TableRow>
          </Table>
        ) : null}
      </Grid>
    </PageShell>
  );
}

export default ComparePage;
