import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FiBell, FiClock, FiTrash2 } from '../components/icons/feather';
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

const Card = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
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

const Input = styled.input.attrs({ 'data-focus-guide': true })`
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
  transition: var(--transition);

  &:focus {
    border-color: var(--primary-soft-border);
    background: var(--field-bg-focus);
    box-shadow: var(--shadow-ring);
    outline: none;
  }
`;

const Select = styled.select.attrs({ 'data-focus-guide': true })`
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
  transition: var(--transition);

  &:focus {
    border-color: var(--primary-soft-border);
    background: var(--field-bg-focus);
    box-shadow: var(--shadow-ring);
    outline: none;
  }
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

  &:hover {
    transform: translateY(-1px);
    border-color: var(--chip-border-hover);
    background: var(--control-bg-hover);
  }
`;

const DangerButton = styled(Button)`
  border-color: rgba(255, 90, 90, 0.35);
  color: rgba(255, 140, 140, 0.96);

  &:hover {
    border-color: rgba(255, 90, 90, 0.6);
    background: rgba(255, 90, 90, 0.08);
  }
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

  const list = useMemo(() => {
    return entries
      .map((entry) => ({
        ...entry,
        anime: animeIndex.get(entry.animeId) || null,
      }))
      .filter((entry) => entry.anime);
  }, [entries]);

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
                  <Input
                    id={`guoman-following-${entry.animeId}-at`}
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
                  <Select
                    id={`guoman-following-${entry.animeId}-before`}
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
                  </Select>
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
      )}
    </PageShell>
  );
}

export default FollowingPage;
