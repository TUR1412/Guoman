// 追更中心：管理提醒设置并提供观影计划器与节奏建议。
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FiBell, FiClock, FiTrendingUp, FiTrash2 } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { useToast } from '../components/ToastProvider';
import { animeIndex } from '../data/animeData';
import {
  clearFollowing,
  fireDueFollowingReminders,
  toggleFollowing,
  updateFollowingReminder,
} from '../utils/followingStore';
import { pushNotification } from '../utils/notificationsStore';
import { useFollowingEntries } from '../utils/useIsFollowing';
import { SelectField, TextField, RangeInput } from '../ui';
import { buildWatchPlan, formatMinutes } from '../utils/watchPlanner';
import { subscribeWatchProgress } from '../utils/watchProgress';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { usePersistedState } from '../utils/usePersistedState';
import { useStorageSignal } from '../utils/useStorageSignal';

const Card = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      220px 140px at 12% 0%,
      rgba(var(--primary-rgb), 0.16),
      transparent 60%
    );
    opacity: 0.8;
    pointer-events: none;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const TitleStack = styled.div`
  display: grid;
  gap: 4px;
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  font-family: var(--font-display);
  line-height: var(--leading-tight);
`;

const Subtitle = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const Cover = styled.img`
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  background: var(--surface-soft);
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
  position: relative;
  z-index: 1;
`;

const Label = styled.label`
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
`;

const ToggleRow = styled.label.attrs({ 'data-pressable': true })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 10px 12px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  position: relative;
  z-index: 1;
  cursor: pointer;
`;

const ToggleText = styled.div`
  display: grid;
  gap: 2px;
`;

const ToggleTitle = styled.div`
  font-weight: 700;
  color: var(--text-primary);
`;

const ToggleDesc = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-xs);
`;

const ToggleInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const Button = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs-plus);
  padding: 10px 14px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--control-border);
  background: var(--control-bg);
  color: var(--text-primary);
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      background: var(--control-bg-hover);
    }
  }
`;

const DangerButton = styled(Button)`
  border-color: rgba(var(--danger-rgb), 0.35);
  color: var(--danger-color);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: rgba(var(--danger-rgb), 0.6);
      background: rgba(var(--danger-rgb), 0.08);
    }
  }
`;

const PlannerCard = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '4',
})`
  grid-column: 1 / -1;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(320px 220px at 12% 0%, rgba(var(--primary-rgb), 0.18), transparent 60%),
      radial-gradient(280px 200px at 90% 20%, rgba(var(--secondary-rgb), 0.16), transparent 62%);
    opacity: 0.9;
    pointer-events: none;
  }
`;

const PlannerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PlannerTitle = styled.h2`
  font-size: var(--text-4xl);
  font-family: var(--font-display);
  letter-spacing: 0.02em;
`;

const PlannerSubtitle = styled.p`
  color: var(--text-secondary);
  max-width: 60ch;
`;

const PlannerBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 6px 12px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--stamp-border);
  background: var(--stamp-bg);
  color: var(--stamp-text);
  font-size: var(--text-xs);
  font-weight: 800;
  box-shadow: var(--shadow-stamp);
`;

const PlannerMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div.attrs({ 'data-card': true, 'data-elev': '2' })`
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  display: grid;
  gap: 6px;
`;

const MetricLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MetricValue = styled.div`
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--text-primary);
`;

const PlannerControl = styled.div`
  display: grid;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const PlannerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const PlannerValue = styled.div`
  padding: 4px 12px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

const PlannerQueue = styled.div.attrs({ 'data-divider': 'list', role: 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const PlannerQueueItem = styled.div.attrs({ role: 'listitem' })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-paper);
`;

const PlannerQueueTitle = styled.div`
  font-weight: 700;
  color: var(--text-primary);
`;

const PlannerQueueMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-xs);
`;

const pad2 = (value) => String(value).padStart(2, '0');

const toDatetimeLocal = (timestamp) => {
  if (!timestamp || !Number.isFinite(timestamp)) return '';
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
};

const fromDatetimeLocal = (value) => {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function FollowingPage() {
  const toast = useToast();
  const entries = useFollowingEntries();
  const { signal: planSignal, bump: bumpPlan } = useStorageSignal([STORAGE_KEYS.watchProgress]);
  const [planMinutes, setPlanMinutes] = usePersistedState(STORAGE_KEYS.watchPlanner, 60, {
    serialize: (value) => String(value),
    deserialize: (raw) => Number(raw) || 60,
  });

  useEffect(() => subscribeWatchProgress(bumpPlan), [bumpPlan]);

  const list = useMemo(() => {
    return entries
      .map((entry) => ({
        ...entry,
        anime: animeIndex.get(entry.animeId) || null,
      }))
      .filter((entry) => entry.anime);
  }, [entries]);

  const plan = useMemo(() => {
    void planSignal;
    return buildWatchPlan({
      animeList: list.map((entry) => entry.anime),
      dailyMinutes: planMinutes,
    });
  }, [list, planMinutes, planSignal]);

  const finishLabel = plan.finishDate
    ? plan.finishDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    : '—';

  return (
    <PageShell
      title="追更中心"
      subtitle="把喜欢的国漫加入追更，一键设置开播提醒，打开站点时自动触发本地通知。"
      badge="留存增长"
      meta={<span>本地追更 · 自定义提醒 · 零后端依赖</span>}
      actions={
        <>
          <Button
            onClick={() => {
              const fired = fireDueFollowingReminders();
              if (fired.length === 0) {
                toast.info('暂无可触发提醒', '当你设置的时间到达时，会自动推送站内通知。');
              } else {
                toast.success('提醒已触发', `已推送 ${fired.length} 条追更提醒。`);
              }
            }}
          >
            <FiClock /> 检查提醒
          </Button>
          <DangerButton
            onClick={() => {
              clearFollowing();
              toast.info('已清空追更', '追更列表已清空。');
            }}
          >
            <FiTrash2 /> 清空追更
          </DangerButton>
        </>
      }
    >
      {list.length === 0 ? (
        <EmptyState
          icon={<FiBell size={22} />}
          title="还没有追更作品"
          description="在作品卡片/详情页点一下“追更”，就能在这里设置提醒时间。"
          primaryAction={{ to: '/recommendations', label: '去逛逛推荐' }}
          secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
        />
      ) : (
        <>
          <PlannerCard aria-label="观影计划器">
            <PlannerHeader>
              <div>
                <PlannerTitle>观影计划器</PlannerTitle>
                <PlannerSubtitle>
                  基于追更与观看进度计算剩余时长，帮你规划每天的观看预算与优先顺序。
                </PlannerSubtitle>
              </div>
              <PlannerBadge>
                <FiTrendingUp /> 量子节奏
              </PlannerBadge>
            </PlannerHeader>

            <PlannerMetrics>
              <MetricCard>
                <MetricLabel>剩余时长</MetricLabel>
                <MetricValue>{formatMinutes(plan.totalMinutes)}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricLabel>预计完成</MetricLabel>
                <MetricValue>{plan.daysNeeded ? `${plan.daysNeeded}天` : '—'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricLabel>完成日期</MetricLabel>
                <MetricValue>{finishLabel}</MetricValue>
              </MetricCard>
            </PlannerMetrics>

            <PlannerControl>
              <PlannerRow>
                <Label htmlFor="guoman-plan-minutes">每日观看预算</Label>
                <PlannerValue>{plan.dailyMinutes} 分钟/天</PlannerValue>
              </PlannerRow>
              <RangeInput
                id="guoman-plan-minutes"
                min={15}
                max={240}
                step={5}
                value={planMinutes}
                onChange={(event) => setPlanMinutes(Number(event.target.value))}
              />
            </PlannerControl>

            <PlannerQueue aria-label="优先观影队列">
              {plan.priority.length > 0 ? (
                plan.priority.map((item) => (
                  <PlannerQueueItem key={item.anime.id}>
                    <div>
                      <PlannerQueueTitle>{item.anime.title}</PlannerQueueTitle>
                      <PlannerQueueMeta>
                        剩余 {Math.ceil(item.remainingEpisodes)} 集 · 单集约{' '}
                        {item.minutesPerEpisode} 分
                      </PlannerQueueMeta>
                    </div>
                    <PlannerQueueMeta>{formatMinutes(item.remainingMinutes)}</PlannerQueueMeta>
                  </PlannerQueueItem>
                ))
              ) : (
                <PlannerQueueItem>
                  <PlannerQueueTitle>暂无追更计划</PlannerQueueTitle>
                  <PlannerQueueMeta>添加追更后将自动生成计划</PlannerQueueMeta>
                </PlannerQueueItem>
              )}
            </PlannerQueue>

            <ButtonRow>
              <Button
                onClick={() => {
                  if (!plan.items.length) {
                    toast.info('尚无计划', '先添加追更或观看进度后再生成计划摘要。');
                    return;
                  }
                  pushNotification({
                    title: '观影计划已更新',
                    body: `每日 ${plan.dailyMinutes} 分钟 · 预计 ${plan.daysNeeded} 天完成 · 剩余 ${formatMinutes(
                      plan.totalMinutes,
                    )}`,
                  });
                  toast.success('计划摘要已发送', '可在「用户中心 → 通知」查看。');
                }}
                title="生成计划摘要"
              >
                <FiBell /> 生成计划摘要
              </Button>
            </ButtonRow>
          </PlannerCard>

          <AnimeGrid $bento>
            {list.map((entry) => {
              const reminderValue = entry.reminderAt ? toDatetimeLocal(entry.reminderAt) : '';

              return (
                <Card
                  key={entry.animeId}
                  role="listitem"
                  aria-label={`追更设置：${entry.anime.title}`}
                >
                  <TitleRow>
                    <TitleStack>
                      <Title>{entry.anime.title}</Title>
                      <Subtitle>
                        {entry.title && entry.title !== entry.anime.title ? entry.title : '追更中'}
                      </Subtitle>
                    </TitleStack>
                    <Button
                      onClick={() => {
                        toggleFollowing({ animeId: entry.animeId, title: entry.anime.title });
                        toast.info('已取消追更', '该作品已从追更中心移除。');
                      }}
                      title="取消追更"
                      aria-label="取消追更"
                    >
                      <FiTrash2 />
                    </Button>
                  </TitleRow>

                  <Cover src={entry.anime.cover} alt={entry.anime.title} loading="lazy" />

                  <ToggleRow>
                    <ToggleText>
                      <ToggleTitle>开启提醒</ToggleTitle>
                      <ToggleDesc>到点后会写入「站内通知」，打开站点即可看到。</ToggleDesc>
                    </ToggleText>
                    <ToggleInput
                      type="checkbox"
                      checked={entry.reminderEnabled}
                      onChange={(event) => {
                        updateFollowingReminder(entry.animeId, {
                          reminderEnabled: event.target.checked,
                          reminderAt: entry.reminderAt,
                          remindBeforeMinutes: entry.remindBeforeMinutes,
                          note: entry.note,
                        });
                      }}
                      aria-label="开启追更提醒"
                    />
                  </ToggleRow>

                  <Field>
                    <Label htmlFor={`guoman-following-${entry.animeId}-at`}>开播时间（本地）</Label>
                    <TextField
                      id={`guoman-following-${entry.animeId}-at`}
                      data-focus-guide
                      type="datetime-local"
                      value={reminderValue}
                      onChange={(event) => {
                        updateFollowingReminder(entry.animeId, {
                          reminderEnabled: entry.reminderEnabled,
                          reminderAt: fromDatetimeLocal(event.target.value),
                          remindBeforeMinutes: entry.remindBeforeMinutes,
                          note: entry.note,
                        });
                      }}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor={`guoman-following-${entry.animeId}-before`}>提前提醒</Label>
                    <SelectField
                      id={`guoman-following-${entry.animeId}-before`}
                      data-focus-guide
                      value={entry.remindBeforeMinutes}
                      onChange={(event) => {
                        updateFollowingReminder(entry.animeId, {
                          reminderEnabled: entry.reminderEnabled,
                          reminderAt: entry.reminderAt,
                          remindBeforeMinutes: Number(event.target.value || 0),
                          note: entry.note,
                        });
                      }}
                    >
                      <option value={0}>到点提醒</option>
                      <option value={15}>提前 15 分钟</option>
                      <option value={30}>提前 30 分钟</option>
                      <option value={60}>提前 1 小时</option>
                      <option value={180}>提前 3 小时</option>
                    </SelectField>
                  </Field>

                  <ButtonRow>
                    <Button
                      onClick={() => {
                        pushNotification({
                          title: `追更提醒（测试）：${entry.anime.title}`,
                          body: '这是一条演示通知，用于确认你的通知中心工作正常。',
                        });
                        toast.success('已发送测试通知', '可在「用户中心 → 通知」查看。');
                      }}
                      title="发送一条站内通知（不会影响真实提醒）"
                    >
                      <FiBell /> 测试通知
                    </Button>
                  </ButtonRow>
                </Card>
              );
            })}
          </AnimeGrid>
        </>
      )}
    </PageShell>
  );
}

export default FollowingPage;
