import React from 'react';
import styled from 'styled-components';
import { FiMail, FiShield, FiHelpCircle, FiMessageSquare, FiDownload } from 'react-icons/fi';
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
`;

const H2 = styled.h2`
  font-size: 1.25rem;
`;

const P = styled.p`
  color: var(--text-secondary);
  line-height: 1.85;
`;

const List = styled.ul`
  display: grid;
  gap: 0.5rem;
  color: var(--text-secondary);
`;

const Li = styled.li`
  position: relative;
  padding-left: 1rem;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--primary-color);
  }
`;

const PAGES = {
  help: {
    title: '帮助中心',
    subtitle: '常见操作指引与使用建议。',
    sections: [
      {
        title: '快速开始',
        icon: <FiHelpCircle />,
        body: (
          <>
            <P>你可以从「推荐 / 排行榜 / 搜索」三个入口开始探索。</P>
            <List>
              <Li>想随便逛：去推荐页</Li>
              <Li>想看口碑：去排行榜</Li>
              <Li>想精准找：用搜索页多关键词</Li>
            </List>
          </>
        ),
      },
    ],
  },
  faq: {
    title: '常见问题',
    subtitle: '先看这里，可能就解决了。',
    sections: [
      {
        title: '为什么“登录/注册”无法真正登录？',
        icon: <FiHelpCircle />,
        body: <P>当前版本以展示与浏览为主，登录页属于演示交互，后续可接入真实后端。</P>,
      },
      {
        title: '为什么有些链接会跳到“未开放”？',
        icon: <FiHelpCircle />,
        body: <P>我们先把导航与页面骨架搭起来，后续会逐步补全内容与功能。</P>,
      },
    ],
  },
  contact: {
    title: '联系我们',
    subtitle: '你的一句话，可能让下一版更好。',
    sections: [
      {
        title: '邮箱',
        icon: <FiMail />,
        body: <P>contact@guoman.world（示例）</P>,
      },
      {
        title: '反馈入口',
        icon: <FiMessageSquare />,
        body: <P>也可以直接去「意见反馈」页面留言，我们会集中整理。</P>,
      },
    ],
  },
  feedback: {
    title: '意见反馈',
    subtitle: '把你想要的功能/体验告诉我们。',
    sections: [
      {
        title: '我们最想收到的反馈',
        icon: <FiMessageSquare />,
        body: (
          <List>
            <Li>你希望首页优先看到什么？</Li>
            <Li>你最常用的筛选维度是什么？</Li>
            <Li>作品详情页还缺哪些信息？</Li>
          </List>
        ),
      },
      {
        title: '暂未接入后端',
        icon: <FiShield />,
        body: <P>当前反馈页为静态展示入口，后续可接入表单或 Issue 系统。</P>,
      },
    ],
  },
  app: {
    title: '下载 APP',
    subtitle: '移动端体验与离线观看，敬请期待。',
    sections: [
      {
        title: '计划中',
        icon: <FiDownload />,
        body: (
          <List>
            <Li>账号同步：收藏 / 观看记录</Li>
            <Li>离线观看：缓存与下载</Li>
            <Li>推送提醒：新番更新</Li>
          </List>
        ),
      },
    ],
  },
  terms: {
    title: '服务条款',
    subtitle: '透明、清晰、可理解（示例文本）。',
    sections: [
      {
        title: '内容声明',
        icon: <FiShield />,
        body: <P>本站为作品信息展示与导览用途，相关内容版权归原权利方所有。</P>,
      },
    ],
  },
  privacy: {
    title: '隐私政策',
    subtitle: '我们尽量少收集、只在必要时收集（示例文本）。',
    sections: [
      {
        title: '数据收集',
        icon: <FiShield />,
        body: <P>当前站点不接入真实账号系统，不主动收集敏感信息。</P>,
      },
    ],
  },
  cookies: {
    title: 'Cookie 政策',
    subtitle: '当前版本仅用于演示（示例文本）。',
    sections: [
      {
        title: '说明',
        icon: <FiShield />,
        body: <P>若未来接入统计/偏好功能，会在此明确告知用途与范围。</P>,
      },
    ],
  },
  accessibility: {
    title: '无障碍声明',
    subtitle: '让每个人都能顺畅使用。',
    sections: [
      {
        title: '已做的事',
        icon: <FiShield />,
        body: (
          <List>
            <Li>提供“跳到主要内容”入口（键盘友好）</Li>
            <Li>提供清晰的焦点样式与高对比度配色</Li>
            <Li>尊重系统的“减少动态效果”偏好</Li>
          </List>
        ),
      },
    ],
  },
};

function StaticPage({ page }) {
  const data = PAGES[page] || {
    title: '页面未开放',
    subtitle: '我们正在加速完善内容。',
    sections: [],
  };

  return (
    <PageShell title={data.title} subtitle={data.subtitle}>
      {data.sections.map((s) => (
        <Card key={s.title}>
          <H2>
            <span style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}>{s.icon}</span>
            {s.title}
          </H2>
          {s.body}
        </Card>
      ))}
    </PageShell>
  );
}

export default StaticPage;
