import React, { useId, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from './icons/feather';
import { Button } from '../ui';
import { useToast } from './ToastProvider';
import { usePageMeta } from '../utils/pageMeta';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

const LoginContainer = styled(motion.section).attrs({ layout: true })`
  min-height: calc(100vh - var(--header-height));
  display: grid;
  place-items: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  background: transparent;
`;

const LoginCard = styled(motion.div).attrs({
  'data-parallax': true,
  'data-card': true,
  'data-divider': 'card',
  'data-stagger': true,
  'data-elev': '6',
})`
  width: 100%;
  max-width: 820px;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  }
`;

const FormPane = styled.div`
  grid-column: span 7;
  display: grid;
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const SidePane = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 5;
  display: grid;
  gap: var(--spacing-md);
  align-content: start;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  background: var(--surface-ink);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(240px 160px at 10% 0%, var(--primary-soft), transparent 70%);
    opacity: 0.55;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const SideBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-wide);
  padding: var(--spacing-xs-plus) var(--spacing-md-compact);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--stamp-border);
  background: var(--stamp-bg);
  color: var(--stamp-text);
  font-size: var(--text-xs);
  font-weight: 700;
  width: fit-content;
  box-shadow: var(--shadow-stamp);
  position: relative;
  z-index: 1;
`;

const SideTitle = styled.h3`
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
`;

const SideList = styled.ul.attrs({ 'data-divider': 'list', role: 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
`;

const SideItem = styled.li.attrs({ role: 'listitem' })`
  position: relative;
  padding-left: var(--spacing-md);

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--secondary-color);
  }
`;

const SideStats = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const SideStat = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '2',
})`
  padding: var(--spacing-sm-plus) var(--spacing-md-tight);
  border-radius: var(--border-radius-md);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  display: grid;
  gap: var(--spacing-xs);

  strong {
    color: var(--text-primary);
    font-size: var(--text-lg);
  }
`;

const FormTitle = styled.h2`
  font-size: var(--text-6xl);
  text-align: left;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const Tabs = styled.div.attrs({ role: 'tablist' })`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-xl);
  grid-column: 1 / -1;
`;

const Tab = styled.button.attrs({ 'data-pressable': true, role: 'tab' })`
  flex: 1;
  padding: var(--spacing-md) 0;
  font-size: var(--text-lg);
  font-weight: 500;
  color: ${(props) => (props.$active ? 'var(--primary-color)' : 'var(--text-tertiary)')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
    transform: scaleX(${(props) => (props.$active ? '1' : '0')});
    transition: var(--transition);
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  grid-column: 1 / -1;
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  padding-left: 2.5rem;
  background-color: var(--field-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: var(--transition);

  &:focus {
    border-color: var(--primary-color);
    background-color: var(--field-bg-focus);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: var(--spacing-sm-plus);
  transform: translateY(-50%);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const TogglePasswordButton = styled.button.attrs({ 'data-pressable': true })`
  --pressable-offset-y: -50%;

  position: absolute;
  top: 50%;
  right: var(--spacing-sm-plus);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--text-secondary);
    }
  }
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Checkbox = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--border-radius-sm);
  background-color: var(--field-bg);
  position: relative;
  cursor: pointer;

  &:checked {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }

  &:checked::before {
    content: '✓';
    position: absolute;
    color: var(--text-on-primary);
    font-size: var(--text-xxs);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ForgotPassword = styled(Link).attrs({ 'data-pressable': true })`
  color: var(--text-tertiary);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--primary-color);
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled(Button).attrs({
  variant: 'primary',
  'data-shimmer': true,
  'data-pressable': true,
  'data-focus-guide': true,
})`
  --pressable-hover-translate-y: -2px;

  padding: var(--spacing-md);
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: var(--text-base);
  cursor: pointer;
  box-shadow: var(--shadow-primary);
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--primary-color);
      filter: brightness(1.05);
      box-shadow: var(--shadow-primary-hover);
    }
  }

  &:disabled {
    background-color: var(--button-disabled-bg);
    color: var(--button-disabled-text);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  grid-column: 1 / -1;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--border-subtle);
  }

  span {
    padding: 0 var(--spacing-md);
    color: var(--text-tertiary);
    font-size: var(--text-sm);
  }
`;

const SocialLogin = styled.div.attrs({ role: 'list' })`
  display: flex;
  gap: var(--spacing-md);
  grid-column: 1 / -1;
`;

const SocialButton = styled(Button).attrs({
  variant: 'secondary',
  'data-pressable': true,
  role: 'listitem',
})`
  --pressable-hover-translate-y: -2px;

  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--control-bg);
  color: var(--text-secondary);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--control-bg-hover);
    }
  }
`;

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const titleId = useId();
  const descId = useId();
  const emailId = useId();
  const usernameId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const reducedMotion = useAppReducedMotion();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rememberMe: false,
  });
  const navigate = useNavigate();
  const toast = useToast();
  usePageMeta({
    title: activeTab === 'login' ? '登录' : '注册',
    description:
      activeTab === 'login'
        ? '登录国漫世界，继续你的收藏与探索之旅。'
        : '注册国漫世界账号，解锁更多个性化体验。',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里通常会调用API进行登录/注册
    // 成功后重定向到首页
    toast.success(
      activeTab === 'login' ? '登录成功（演示）' : '注册成功（演示）',
      '当前版本未接入真实后端，仅展示交互流程。',
    );
    navigate('/');
  };

  return (
    <LoginContainer>
      <LoginCard
        aria-labelledby={titleId}
        aria-describedby={descId}
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <FormPane>
          <FormTitle id={titleId}>{activeTab === 'login' ? '欢迎回来' : '创建账号'}</FormTitle>
          <span id={descId} className="sr-only">
            {activeTab === 'login'
              ? '登录后可同步收藏与观看进度。'
              : '注册账号以开启个性化推荐与多端同步。'}
          </span>

          <Tabs>
            <Tab
              type="button"
              $active={activeTab === 'login'}
              aria-selected={activeTab === 'login'}
              tabIndex={activeTab === 'login' ? 0 : -1}
              onClick={() => setActiveTab('login')}
            >
              登录
            </Tab>
            <Tab
              type="button"
              $active={activeTab === 'register'}
              aria-selected={activeTab === 'register'}
              tabIndex={activeTab === 'register' ? 0 : -1}
              onClick={() => setActiveTab('register')}
            >
              注册
            </Tab>
          </Tabs>

          <FormContainer onSubmit={handleSubmit}>
            {activeTab === 'register' && (
              <FormGroup>
                <label className="sr-only" htmlFor={emailId}>
                  邮箱
                </label>
                <FormInput
                  id={emailId}
                  type="email"
                  name="email"
                  placeholder="邮箱"
                  aria-label="邮箱"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputIcon>
                  <FiMail />
                </InputIcon>
              </FormGroup>
            )}

            <FormGroup>
              <label className="sr-only" htmlFor={usernameId}>
                用户名
              </label>
              <FormInput
                id={usernameId}
                type="text"
                name="username"
                placeholder="用户名"
                aria-label="用户名"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <InputIcon>
                <FiUser />
              </InputIcon>
            </FormGroup>

            <FormGroup>
              <label className="sr-only" htmlFor={passwordId}>
                密码
              </label>
              <FormInput
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="密码"
                aria-label="密码"
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <InputIcon>
                <FiLock />
              </InputIcon>
              <TogglePasswordButton
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </TogglePasswordButton>
            </FormGroup>

            {activeTab === 'login' && (
              <RememberForgot>
                <CheckboxContainer>
                  <Checkbox
                    id={rememberId}
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor={rememberId}>记住我</label>
                </CheckboxContainer>
                <ForgotPassword to="/forgot-password">忘记密码？</ForgotPassword>
              </RememberForgot>
            )}

            <SubmitButton type="submit">{activeTab === 'login' ? '登录' : '注册'}</SubmitButton>
          </FormContainer>

          <Divider>
            <span>或使用以下方式{activeTab === 'login' ? '登录' : '注册'}</span>
          </Divider>

          <SocialLogin>
            <SocialButton type="button">
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="var(--brand-google-blue)"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="var(--brand-google-green)"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="var(--brand-google-yellow)"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="var(--brand-google-red)"
                />
              </svg>
              Google
            </SocialButton>
            <SocialButton type="button">
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="var(--brand-facebook-blue)"
              >
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.37 19.6 18.58C21.16 16.79 22.03 14.53 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
              Facebook
            </SocialButton>
            <SocialButton type="button">
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="var(--brand-twitter-blue)"
              >
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
              </svg>
              Twitter
            </SocialButton>
          </SocialLogin>
        </FormPane>

        <SidePane>
          <SideBadge>账号权益</SideBadge>
          <SideTitle>登录后解锁更多国漫能力</SideTitle>
          <SideList>
            <SideItem>收藏与观看进度多端同步</SideItem>
            <SideItem>专属推荐与喜好筛选</SideItem>
            <SideItem>抢先看与新番提醒</SideItem>
            <SideItem>社区互动与弹幕历史</SideItem>
          </SideList>
          <SideStats>
            <SideStat>
              <strong>2000万+</strong>
              注册用户
            </SideStat>
            <SideStat>
              <strong>500+</strong>
              国漫作品
            </SideStat>
          </SideStats>
        </SidePane>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
