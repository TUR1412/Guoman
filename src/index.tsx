import React, { Profiler } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/global.css';

import AppErrorBoundary from './components/AppErrorBoundary';
import { initTheme } from './utils/theme';
import { initVisualSettings } from './utils/visualSettings';
import { initPerformanceMonitor } from './utils/performance';
import { initErrorMonitor } from './utils/errorReporter';
import { fireDueFollowingReminders } from './utils/followingStore';
import { isProEnabled } from './utils/proMembership';
import { runStorageMigrations } from './utils/storageMigrations';
import { registerServiceWorker } from './utils/serviceWorker';
import {
  installHealthConsole,
  recordReactCommit,
  startHealthMonitoring,
} from './utils/healthConsole';

// 尽量在首帧渲染前初始化主题，避免闪烁
runStorageMigrations();
initTheme();
initVisualSettings();
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Profiler id="App" onRender={recordReactCommit}>
        <HashRouter>
          <App />
        </HashRouter>
      </Profiler>
    </AppErrorBoundary>
  </React.StrictMode>,
);

void registerServiceWorker();
