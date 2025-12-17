import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCcw } from 'react-icons/fi';

const Fullscreen = styled.div`
  min-height: 100vh;
  padding: calc(var(--header-height) + var(--spacing-2xl)) var(--spacing-lg) var(--spacing-3xl);
  display: grid;
  place-items: center;
  background: var(--app-bg);
  color: var(--text-primary);
`;

const Card = styled.div`
  width: min(720px, 100%);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2xl);
  backdrop-filter: blur(14px);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  svg {
    color: var(--secondary-color);
    flex: 0 0 auto;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 1.2;
`;

const Desc = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

const HomeLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background: rgba(255, 77, 77, 0.12);
    transform: translateY(-1px);
  }
`;

const DevDetails = styled.details`
  margin-top: var(--spacing-xl);
  color: var(--text-tertiary);

  summary {
    cursor: pointer;
    user-select: none;
  }

  pre {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-subtle);
    overflow: auto;
    color: var(--text-secondary);
  }
`;

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.error('[AppErrorBoundary] 捕获到未处理错误：', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Fullscreen>
        <Card>
          <TitleRow>
            <FiAlertTriangle size={22} />
            <Title>页面出了点小状况</Title>
          </TitleRow>
          <Desc>
            不用担心，刷新通常可以恢复。如果问题持续出现，建议清空缓存或稍后再试。
          </Desc>
          <Actions>
            <Button type="button" onClick={() => window.location.reload()}>
              <FiRefreshCcw />
              刷新页面
            </Button>
            <HomeLink href="#/">返回首页</HomeLink>
          </Actions>

          {import.meta.env?.DEV && this.state.error && (
            <DevDetails>
              <summary>开发者信息（仅开发环境展示）</summary>
              <pre>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
            </DevDetails>
          )}
        </Card>
      </Fullscreen>
    );
  }
}

export default AppErrorBoundary;

