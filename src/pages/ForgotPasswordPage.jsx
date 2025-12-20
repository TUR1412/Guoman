import React, { useId, useState } from 'react';
import styled from 'styled-components';
import { FiMail } from 'react-icons/fi';
import PageShell from '../components/PageShell';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Card = styled.div.attrs({
  'data-parallax': true,
  'data-card': true,
  'data-divider': 'card',
})`
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-md);
  grid-column: span 7;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const InputRow = styled.form`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 240px;
  padding: 0.85rem var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);

  &:focus {
    border-color: var(--primary-color);
    background: var(--field-bg-focus);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const Button = styled.button.attrs({
  'data-shimmer': true,
  'data-pressable': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.85rem var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-soft-border);
  background: var(--primary-soft);
  color: var(--text-primary);
  font-weight: 700;
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
    background: var(--primary-soft-hover);
  }
`;

const Tip = styled.p`
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
`;

const Success = styled.div`
  padding: var(--spacing-sm-plus) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--success-border);
  background: var(--success-bg);
  color: var(--text-secondary);
`;

const AsideCard = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  border-radius: var(--border-radius-lg);
  background: var(--surface-ink);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-sm);
  grid-column: span 5;
  align-content: start;
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

const AsideTitle = styled.h3`
  font-size: var(--text-lg);
  color: var(--text-primary);
  position: relative;
  z-index: 1;
`;

const AsideList = styled.ul.attrs({ 'data-divider': 'list', role: 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
`;

const AsideItem = styled.li.attrs({ role: 'listitem' })`
  position: relative;
  padding-left: var(--spacing-md);

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--secondary-color);
  }
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const emailId = useId();
  const tipId = useId();
  const asideTitleId = useId();

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <PageShell
      title="找回密码"
      subtitle="当前为演示版本：我们模拟发送重置邮件的流程。"
      badge="安全"
      meta={<span>演示流程 · 不会真实发送</span>}
    >
      <Grid>
        <Card aria-describedby={tipId}>
          <Tip id={tipId}>
            输入邮箱后点击发送。未来接入后端后，这里会真正发出重置链接，并提供安全验证（验证码 /
            限流等）。
          </Tip>

          <InputRow onSubmit={submit}>
            <label className="sr-only" htmlFor={emailId}>
              输入邮箱
            </label>
            <Input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSent(false);
              }}
              placeholder="请输入你的邮箱"
              aria-label="邮箱"
              autoComplete="email"
              required
            />
            <Button type="submit">
              <FiMail />
              发送重置邮件
            </Button>
          </InputRow>

          {sent && <Success>已发送（模拟）：「{email}」请查收邮件（演示环境不会真的发送）。</Success>}
        </Card>

        <AsideCard aria-labelledby={asideTitleId}>
          <AsideTitle id={asideTitleId}>安全提示</AsideTitle>
          <AsideList>
            <AsideItem>重置链接有效期通常为 10-30 分钟</AsideItem>
            <AsideItem>请勿将重置链接转发给他人</AsideItem>
            <AsideItem>若未收到邮件，请检查垃圾箱</AsideItem>
            <AsideItem>未来版本将加入验证码/多因子验证</AsideItem>
          </AsideList>
        </AsideCard>
      </Grid>
    </PageShell>
  );
}

export default ForgotPasswordPage;



