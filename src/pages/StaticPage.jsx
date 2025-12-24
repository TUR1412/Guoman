import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiMail,
  FiShield,
  FiHelpCircle,
  FiMessageSquare,
  FiDownload,
} from '../components/icons/feather';
import PageShell from '../components/PageShell';
import { useToast } from '../components/ToastProvider';
import { clearFeedback, getFeedbackList, submitFeedback } from '../utils/feedbackStore';

const Grid = styled.div.attrs({
  role: 'list',
  'data-stagger': true,
  'data-divider': 'grid',
  'aria-label': '信息卡片列表',
})`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Card = styled.div.attrs({
  role: 'listitem',
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
  grid-column: span 6;

  &:nth-child(1) {
    grid-column: span 7;
  }

  &:nth-child(2) {
    grid-column: span 5;
  }

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const H2 = styled.h2`
  font-size: var(--text-xl);
  font-family: var(--font-display);
`;

const P = styled.p`
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
`;

const List = styled.ul.attrs({ 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

const Li = styled.li`
  position: relative;
  padding-left: var(--spacing-md);

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
    badge: '帮助',
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
    badge: 'FAQ',
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
    badge: '联系',
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
    badge: '反馈',
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
    badge: 'APP',
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
    badge: '条款',
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
    badge: '隐私',
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
    badge: 'Cookie',
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
    badge: '无障碍',
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
    badge: '公告',
    sections: [],
  };
  const toast = useToast();
  const [feedbackList, setFeedbackList] = useState(() => getFeedbackList());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');

  const onSubmitFeedback = (event) => {
    event.preventDefault();
    const trimmed = feedbackMessage.trim();
    if (!trimmed) {
      toast.warning('反馈不能为空', '写点你的想法吧。');
      return;
    }
    const entry = submitFeedback({ message: trimmed, contact: feedbackContact });
    if (!entry) {
      toast.warning('提交失败', '稍后再试。');
      return;
    }
    setFeedbackList((prev) => [entry, ...prev]);
    setFeedbackMessage('');
    setFeedbackContact('');
    toast.success('感谢反馈', '已保存到本地。');
  };

  const onClearFeedback = () => {
    clearFeedback();
    setFeedbackList([]);
    toast.info('已清空反馈记录');
  };

  return (
    <PageShell title={data.title} subtitle={data.subtitle} badge={data.badge}>
      <Grid>
        {data.sections.map((s) => (
          <Card key={s.title}>
            <H2>
              <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--primary-color)' }}>
                {s.icon}
              </span>
              {s.title}
            </H2>
            {s.body}
          </Card>
        ))}
      </Grid>

      {page === 'feedback' && (
        <Card>
          <H2>
            <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--primary-color)' }}>
              <FiMessageSquare />
            </span>
            提交反馈
          </H2>
          <form onSubmit={onSubmitFeedback} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <input
              type="text"
              placeholder="联系方式（可选）"
              value={feedbackContact}
              onChange={(event) => setFeedbackContact(event.target.value)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--field-bg)',
                color: 'var(--text-primary)',
              }}
            />
            <textarea
              placeholder="写下你的建议..."
              value={feedbackMessage}
              onChange={(event) => setFeedbackMessage(event.target.value)}
              style={{
                minHeight: '120px',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--field-bg)',
                color: 'var(--text-primary)',
              }}
            />
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <button
                type="submit"
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-soft)',
                  color: 'var(--text-primary)',
                }}
              >
                提交反馈
              </button>
              <button
                type="button"
                onClick={onClearFeedback}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-soft)',
                  color: 'var(--text-primary)',
                }}
              >
                清空记录
              </button>
            </div>
          </form>

          {feedbackList.length > 0 && (
            <List style={{ marginTop: 'var(--spacing-md)' }}>
              {feedbackList.map((item) => (
                <li key={item.id}>
                  <strong>{new Date(item.createdAt).toLocaleString('zh-CN')}</strong> ·{' '}
                  {item.message}
                </li>
              ))}
            </List>
          )}
        </Card>
      )}
    </PageShell>
  );
}

export default StaticPage;
