import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMail } from 'react-icons/fi';
import PageShell from '../components/PageShell';

const Card = styled.div`
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-md);
  max-width: 720px;
`;

const InputRow = styled.form`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 240px;
  padding: 0.85rem 1rem;
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

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.1rem;
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
  line-height: 1.85;
`;

const Success = styled.div`
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.12);
  color: var(--text-secondary);
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <PageShell title="找回密码" subtitle="当前为演示版本：我们模拟发送重置邮件的流程。">
      <Card>
        <Tip>
          输入邮箱后点击发送。未来接入后端后，这里会真正发出重置链接，并提供安全验证（验证码 /
          限流等）。
        </Tip>

        <InputRow onSubmit={submit}>
          <Input
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
    </PageShell>
  );
}

export default ForgotPasswordPage;
