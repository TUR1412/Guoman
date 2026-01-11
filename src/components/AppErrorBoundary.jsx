import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiDownload, FiRefreshCcw, FiShare2 } from './icons/feather';
import { buildDiagnosticsBundle } from '../utils/diagnosticsBundle';
import { downloadTextFile } from '../utils/download';
import { reportError } from '../utils/errorReporter';
import { copyTextToClipboard } from '../utils/share';

const Fullscreen = styled.div`
  min-height: 100vh;
  padding: calc(var(--header-height) + var(--spacing-2xl)) var(--spacing-lg) var(--spacing-3xl);
  display: grid;
  place-items: center;
  background: var(--app-bg);
  color: var(--text-primary);
`;

const Card = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '6',
})`
  width: min(720px, 100%);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const MainPane = styled.div`
  grid-column: span 8;
  display: grid;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const SidePane = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 4;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-ink);
  padding: var(--spacing-lg);
  display: grid;
  gap: var(--spacing-sm);
  align-content: start;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(200px 140px at 10% 0%, var(--primary-soft), transparent 70%);
    opacity: 0.55;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const SideTitle = styled.h3`
  font-size: var(--text-base);
  color: var(--text-primary);
  position: relative;
  z-index: 1;
`;

const SideList = styled.ul.attrs({ 'data-divider': 'list' })`
  display: grid;
  gap: 0.45rem;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
`;

const SideItem = styled.li`
  position: relative;
  padding-left: var(--spacing-md);

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--secondary-color);
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  svg {
    color: var(--secondary-color);
    flex: 0 0 auto;
  }
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  line-height: var(--leading-tight);
`;

const Desc = styled.p`
  color: var(--text-secondary);
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const ActionStatus = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const Button = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm-plus) var(--spacing-lg-compact);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--control-bg);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: var(--control-bg-hover);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

const HomeLink = styled.a.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm-plus) var(--spacing-lg-compact);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background: var(--primary-soft);
    transform: translateY(-1px);
  }
`;

const DevDetails = styled.details`
  margin-top: var(--spacing-xl);
  color: var(--text-tertiary);
  grid-column: 1 / -1;

  summary {
    cursor: pointer;
    user-select: none;
  }

  pre {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    background: var(--surface-ink);
    border: 1px solid var(--border-subtle);
    overflow: auto;
    color: var(--text-secondary);
  }
`;

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, actionMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    reportError({
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      source: info?.componentStack,
    });
    if (import.meta.env?.DEV) {
      console.error('[AppErrorBoundary] 捕获到未处理错误：', error, info);
    }
  }

  getDiagnosticsJsonText() {
    try {
      return JSON.stringify(buildDiagnosticsBundle(), null, 2);
    } catch (error) {
      const message = error?.message || String(error || 'Unknown');
      return JSON.stringify(
        {
          schemaVersion: 2,
          generatedAt: new Date().toISOString(),
          error: message,
        },
        null,
        2,
      );
    }
  }

  async handleCopyDiagnostics() {
    const text = this.getDiagnosticsJsonText();

    try {
      const result = await copyTextToClipboard(text);
      if (result.ok) {
        this.setState({ actionMessage: '诊断信息已复制到剪贴板。' });
        return;
      }

      this.setState({ actionMessage: '复制失败：当前环境不支持剪贴板写入。' });
    } catch {
      this.setState({ actionMessage: '复制失败：当前环境不支持剪贴板写入。' });
    }
  }

  handleDownloadDiagnostics() {
    const text = this.getDiagnosticsJsonText();
    const filename = `guoman-crash-${Date.now()}.json`;
    const res = downloadTextFile({
      text,
      filename,
      mimeType: 'application/json;charset=utf-8',
    });

    if (res.ok) {
      this.setState({ actionMessage: `已下载诊断包：${filename}` });
      return;
    }

    this.setState({ actionMessage: '下载失败：请检查浏览器下载权限。' });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const titleId = 'guoman-error-title';
    const descId = 'guoman-error-desc';

    return (
      <Fullscreen>
        <Card aria-labelledby={titleId} aria-describedby={descId}>
          <MainPane>
            <TitleRow>
              <FiAlertTriangle size={22} />
              <Title id={titleId}>页面出了点小状况</Title>
            </TitleRow>
            <Desc id={descId}>
              不用担心，刷新通常可以恢复。如果问题持续出现，建议清空缓存或稍后再试。
            </Desc>
            <Actions>
              <Button type="button" onClick={() => window.location.reload()}>
                <FiRefreshCcw />
                刷新页面
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void this.handleCopyDiagnostics();
                }}
              >
                <FiShare2 />
                复制诊断
              </Button>
              <Button type="button" onClick={() => this.handleDownloadDiagnostics()}>
                <FiDownload />
                下载诊断包
              </Button>
              <HomeLink href="#/">返回首页</HomeLink>
            </Actions>
            {this.state.actionMessage ? (
              <ActionStatus role="status" aria-live="polite">
                {this.state.actionMessage}
              </ActionStatus>
            ) : null}
          </MainPane>

          <SidePane>
            <SideTitle>快速排查</SideTitle>
            <SideList>
              <SideItem>确认网络连接是否正常</SideItem>
              <SideItem>尝试清空浏览器缓存</SideItem>
              <SideItem>稍后刷新或重新打开页面</SideItem>
              <SideItem>可复制/下载诊断包，便于排障</SideItem>
              <SideItem>如持续出现，请联系维护人员</SideItem>
            </SideList>
          </SidePane>

          {import.meta.env?.DEV && this.state.error && (
            <DevDetails>
              <summary>开发者信息（仅开发环境展示）</summary>
              <pre>
                {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
              </pre>
            </DevDetails>
          )}
        </Card>
      </Fullscreen>
    );
  }
}

export default AppErrorBoundary;
