/**
 * 强力错误抑制工具 - 彻底屏蔽控制台错误
 */

// 完全替换控制台方法
const suppressConsoleErrors = () => {
  // 保存原始控制台方法的引用
  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log
  };

  // 创建过滤函数
  const shouldFilter = (args) => {
    if (!args || args.length === 0) return false;
    
    const messageStr = String(args[0] || '');
    
    return (
      messageStr.includes('stadium.js') || 
      messageStr.includes('ERR_CONNECTION_CLOSED') ||
      messageStr.includes('React Router Future Flag Warning') ||
      messageStr.includes('Failed to load resource') ||
      messageStr.includes('React DevTools')
    );
  };

  // 替换控制台方法
  console.error = function(...args) {
    if (!shouldFilter(args)) {
      originalConsole.error.apply(console, args);
    }
  };

  console.warn = function(...args) {
    if (!shouldFilter(args)) {
      originalConsole.warn.apply(console, args);
    }
  };

  console.log = function(...args) {
    if (!shouldFilter(args)) {
      originalConsole.log.apply(console, args);
    }
  };

  // 阻止错误事件冒泡
  window.addEventListener('error', (event) => {
    const errorText = event.message || '';
    const errorSource = event.filename || '';
    
    if (
      errorText.includes('ERR_CONNECTION_CLOSED') ||
      errorSource.includes('stadium.js') ||
      errorText.includes('Failed to load resource')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // 阻止未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    event.stopPropagation();
  }, true);
  
  // 尝试禁用React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__).forEach(key => {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] === 'function' 
        ? Function.prototype 
        : null;
    });
  }
};

export default suppressConsoleErrors; 