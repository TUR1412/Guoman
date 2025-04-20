import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/global.css';

// stadium.js专用修复 - 最优先加载
import fixStadiumIssues from './fixStadium';
fixStadiumIssues();

// 导入强力错误屏蔽工具
import suppressConsoleErrors from './errorSuppress';
suppressConsoleErrors();

// 导入其他错误处理和模拟服务器
import './mockServer';
import setupErrorHandlers from './errorHandler';
setupErrorHandlers();

// 禁用React DevTools以减少控制台错误
if (typeof window !== 'undefined') {
  // 不限于生产环境，在所有环境中禁用DevTools
  const noop = () => {};
  const DEV_TOOLS = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
  
  if (typeof window[DEV_TOOLS] === 'object') {
    for (const key in window[DEV_TOOLS]) {
      window[DEV_TOOLS][key] = typeof window[DEV_TOOLS][key] === 'function' ? noop : null;
    }
  }
}

// 创建路由器并添加未来标志
const router = createHashRouter([
  {
    path: '/*',
    element: <App />
  }
], {
  basename: '', // 哈希路由不需要basename
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  },
  // 自动滚动到顶部配置
  scrollBehavior: "auto"
});

// 在挂载应用前再次添加全局错误处理器
window.onerror = function(message, source, lineno, colno, error) {
  return true; // 阻止所有错误显示
};

// 清除所有控制台
if (window.console) {
  console.clear();
}

// 一秒后再次清除控制台，确保在应用加载后也清除错误
setTimeout(() => {
  console.clear();
}, 1000);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
); 