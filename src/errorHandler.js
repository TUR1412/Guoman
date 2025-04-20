// 全局错误处理器

// 捕获所有未处理的错误
const setupErrorHandlers = () => {
  // 替换控制台错误方法
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // 过滤掉特定错误
    const errorMsg = args[0]?.toString() || '';
    
    // 忽略stadium.js相关错误
    if (errorMsg.includes('stadium.js') || 
        (args[0] && args[0].stack && args[0].stack.includes('stadium.js'))) {
      // 如果是stadium.js相关错误，不输出到控制台
      return;
    }
    
    // 忽略网络错误
    if (errorMsg.includes('ERR_CONNECTION_CLOSED') || 
        errorMsg.includes('Failed to fetch') ||
        errorMsg.includes('NetworkError')) {
      // 如果是网络错误，不输出到控制台
      return;
    }
    
    // 正常输出其他错误
    originalConsoleError.apply(console, args);
  };
  
  // 捕获全局错误
  window.addEventListener('error', (event) => {
    // 阻止错误传播到控制台
    if (event.filename && event.filename.includes('stadium.js')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // 对于网络错误也进行阻止
    if (event.message && (
        event.message.includes('ERR_CONNECTION_CLOSED') || 
        event.message.includes('Failed to fetch') ||
        event.message.includes('NetworkError'))) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);
  
  // 捕获Promise未处理的rejection
  window.addEventListener('unhandledrejection', (event) => {
    // 阻止rejection传播到控制台
    const errorMsg = event.reason?.toString() || '';
    
    if (errorMsg.includes('stadium.js') || 
        errorMsg.includes('ERR_CONNECTION_CLOSED') || 
        errorMsg.includes('Failed to fetch') ||
        errorMsg.includes('NetworkError')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
};

// 导出并执行
export default setupErrorHandlers; 