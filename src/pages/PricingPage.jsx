import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FiAward, FiCheck, FiGift, FiShield, FiStar, FiZap } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import { useToast } from '../components/ToastProvider';
import { setProMembership } from '../utils/proMembership';
import { useProMembership } from '../utils/useProMembership';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Tier = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 4;
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
  transition: var(--transition);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    border-color: var(--chip-border-hover);
  }

  @media (max-width: 992px) {
    grid-column: span 6;
  }

  @media (max-width: 576px) {
    grid-column: 1 / -1;
  }
`;

const TierName = styled.h3`
  font-size: var(--text-2xl);
  font-family: var(--font-display);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const TierMeta = styled.p`
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
`;

const Price = styled.div`
  font-size: var(--text-8xl);
  font-weight: 900;
  letter-spacing: 0.02em;
  color: var(--primary-color);
`;

const PriceHint = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const FeatureList = styled.ul`
  list-style: none;
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  line-height: var(--leading-snug-plus);

  svg {
    margin-top: 2px;
    flex: 0 0 auto;
    color: var(--primary-color);
  }
`;

const Button = styled.button.attrs({
  type: 'button',
  'data-pressable': true,
  'data-shimmer': true,
})`
  width: 100%;
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm-plus) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.14);
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: 0.02em;
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    border-color: var(--chip-border-hover);
    background: rgba(var(--primary-rgb), 0.22);
  }
`;

const Secondary = styled(Button)`
  border-color: var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);

  &:hover {
    background: var(--surface-soft-hover);
    border-color: var(--chip-border-hover);
  }
`;

const ActiveBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 6px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.16);
  color: var(--primary-color);
  font-size: var(--text-xs);
  font-weight: 900;
  z-index: 2;
`;

function PricingPage() {
  const toast = useToast();
  const pro = useProMembership();

  const tiers = useMemo(
    () => [
      {
        id: 'free',
        icon: <FiShield />,
        name: 'Free',
        price: '¥0',
        hint: '默认计划 · 永久可用',
        meta: '适合轻量体验与日常浏览。',
        features: ['完整浏览/搜索/收藏', '本地数据 Vault', '性能/错误监控钩子'],
      },
      {
        id: 'supporter',
        icon: <FiGift />,
        name: 'Supporter',
        price: '¥9',
        hint: '演示价 · 本地开关（无真实支付）',
        meta: '适合支持项目、解锁更“影院级”的体验细节。',
        features: [
          'PRO 视觉标识 + 更强 Aurora 氛围',
          '追更中心（提醒/测试通知）',
          '口味画像推荐（Taste Engine）',
        ],
      },
      {
        id: 'studio',
        icon: <FiAward />,
        name: 'Studio',
        price: '¥49',
        hint: '演示价 · 适配未来商业化',
        meta: '适合团队/社群共建：用于后续接入真实登录、云同步、权益系统。',
        features: [
          '预留权益字段（plan / startedAt）',
          '可扩展的本地订阅模型',
          '事件埋点：转化/留存/触发提醒',
        ],
      },
    ],
    [],
  );

  const activate = (plan) => {
    setProMembership({ enabled: plan !== 'free', plan });
    if (plan === 'free') {
      toast.info('已切换到 Free', 'PRO 状态已关闭。');
    } else {
      toast.success('PRO 已开启', '这是本地演示开关：不会产生真实支付。', {
        celebrate: true,
      });
    }
  };

  return (
    <PageShell
      title="会员与赞助"
      subtitle="面向未来商业化的「权益模型」：本地开关演示（无后端、无真实支付），用于验证 UI/UX 与数据结构。"
      badge="商业化模块"
      meta={<span>权益模型 · 转化链路 · 本地演示</span>}
    >
      <Grid>
        {tiers.map((tier) => {
          const active = pro.enabled ? pro.plan === tier.id : tier.id === 'free';

          return (
            <Tier key={tier.id} aria-label={`${tier.name} 计划`}>
              {active ? (
                <ActiveBadge>
                  <FiZap /> 当前计划
                </ActiveBadge>
              ) : null}

              <TierName>
                {tier.icon} {tier.name}
              </TierName>
              <TierMeta>{tier.meta}</TierMeta>

              <div>
                <Price>{tier.price}</Price>
                <PriceHint>{tier.hint}</PriceHint>
              </div>

              <FeatureList aria-label="计划权益">
                {tier.features.map((text) => (
                  <Feature key={text}>
                    <FiCheck />
                    <span>{text}</span>
                  </Feature>
                ))}
              </FeatureList>

              {tier.id === 'free' ? (
                <Secondary onClick={() => activate('free')}>使用 Free</Secondary>
              ) : (
                <Button onClick={() => activate(tier.id)}>
                  <FiStar /> 开启 {tier.name}
                </Button>
              )}
            </Tier>
          );
        })}
      </Grid>
    </PageShell>
  );
}

export default PricingPage;
