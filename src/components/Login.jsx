import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginContainer = styled.section`
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  background: transparent;
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  background: var(--surface-glass);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2xl);
  border: 1px solid var(--border-subtle);
  position: relative;
  overflow: hidden;
  
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

const FormTitle = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-xl);
`;

const Tab = styled.button`
  flex: 1;
  padding: var(--spacing-md) 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-tertiary)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
    transform: scaleX(${props => props.$active ? '1' : '0'});
    transition: var(--transition);
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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
  font-size: 1rem;
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
  left: 0.75rem;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--text-secondary);
  }
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
    color: white;
    font-size: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ForgotPassword = styled(Link)`
  color: var(--text-tertiary);
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  padding: var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  transition: var(--transition);
  
  &:hover {
    background-color: #e64545;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--border-subtle);
  }
  
  span {
    padding: 0 var(--spacing-md);
    color: var(--text-tertiary);
    font-size: 0.9rem;
  }
`;

const SocialLogin = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const SocialButton = styled.button`
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // 这里通常会调用API进行登录/注册
    // 成功后重定向到首页
    navigate('/');
  };
  
  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs>
          <Tab 
            $active={activeTab === 'login'}
            onClick={() => setActiveTab('login')}
          >
            登录
          </Tab>
          <Tab
            $active={activeTab === 'register'}
            onClick={() => setActiveTab('register')}
          >
            注册
          </Tab>
        </Tabs>
        
        <FormContainer onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <FormGroup>
              <FormInput
                type="email"
                name="email"
                placeholder="邮箱"
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
            <FormInput
              type="text"
              name="username"
              placeholder="用户名"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <InputIcon>
              <FiUser />
            </InputIcon>
          </FormGroup>
          
          <FormGroup>
            <FormInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="密码"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputIcon>
              <FiLock />
            </InputIcon>
            <TogglePasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </TogglePasswordButton>
          </FormGroup>
          
          {activeTab === 'login' && (
            <RememberForgot>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label>记住我</label>
              </CheckboxContainer>
              <ForgotPassword to="/forgot-password">忘记密码？</ForgotPassword>
            </RememberForgot>
          )}
          
          <SubmitButton type="submit">
            {activeTab === 'login' ? '登录' : '注册'}
          </SubmitButton>
        </FormContainer>
        
        <Divider>
          <span>或使用以下方式{activeTab === 'login' ? '登录' : '注册'}</span>
        </Divider>
        
        <SocialLogin>
          <SocialButton type="button">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </SocialButton>
          <SocialButton type="button">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.37 19.6 18.58C21.16 16.79 22.03 14.53 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
            </svg>
            Facebook
          </SocialButton>
          <SocialButton type="button">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
            </svg>
            Twitter
          </SocialButton>
        </SocialLogin>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login; 
