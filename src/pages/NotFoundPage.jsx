import React from 'react';
import { FiCompass } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';

function NotFoundPage() {
  return (
    <PageShell title="页面不存在" subtitle="你访问的地址可能拼写错误或已被移动。">
      <EmptyState
        icon={<FiCompass size={22} />}
        title="404：迷路了"
        description="回到首页继续探索，或者去推荐和排行榜看看。"
        primaryAction={{ to: '/', label: '回到首页' }}
        secondaryAction={{ to: '/recommendations', label: '去看推荐' }}
      />
    </PageShell>
  );
}

export default NotFoundPage;
