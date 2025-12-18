import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/global.css';

import AppErrorBoundary from './components/AppErrorBoundary';
import { initTheme } from './utils/theme';

// 尽量在首帧渲染前初始化主题，避免闪烁
initTheme();

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
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </React.StrictMode>,
);
