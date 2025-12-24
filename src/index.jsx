import React, { Profiler } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/global.css';

import AppErrorBoundary from './components/AppErrorBoundary';
import { initTheme } from './utils/theme';
import { initPerformanceMonitor } from './utils/performance';
import { initErrorMonitor } from './utils/errorReporter';
import { fireDueFollowingReminders } from './utils/followingStore';
import { isProEnabled } from './utils/proMembership';
import { registerServiceWorker } from './utils/serviceWorker';
import {
  installHealthConsole,
  recordReactCommit,
  startHealthMonitoring,
} from './utils/healthConsole';

// 尽量在首帧渲染前初始化主题，避免闪烁
initTheme();
initPerformanceMonitor();
initErrorMonitor();
fireDueFollowingReminders();
try {
  document.documentElement.dataset.pro = isProEnabled() ? 'true' : 'false';
} catch {}

// 控制台健康全景图：__GUOMAN_HEALTH__.print()
void installHealthConsole();
if (import.meta.env.DEV) {
  startHealthMonitoring();
}

// 创建路由器并添加未来标志 - 使用HashRouter适配GitHub Pages
const router = createHashRouter(
  [
    {
      path: '/*',
      element: <App />,
    },
  ],
  {
    basename: '', // 在HashRouter中不需要设置basename
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Profiler id="App" onRender={recordReactCommit}>
        <RouterProvider router={router} />
      </Profiler>
    </AppErrorBoundary>
  </React.StrictMode>,
);

void registerServiceWorker();
