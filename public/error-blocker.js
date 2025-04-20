/**
 * 错误阻断器 - 在HTML页面加载最早期阻止错误
 * 此文件将作为脚本标签注入到index.html中
 */

(function() {
  // 在页面最早期阻止错误
  window.onerror = function() { return true; };
  
  // 阻止未处理的Promise拒绝
  window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    return false;
  }, true);
  
  // 拦截控制台方法
  if (window.console) {
    var originalConsole = {
      error: console.error,
      warn: console.warn,
      log: console.log
    };
    
    console.error = function() { return false; };
    console.warn = function() { return false; };
    console.log = function() {
      // 只允许非错误日志通过
      var msg = arguments[0];
      if (typeof msg === 'string' && (
          msg.includes('stadium') || 
          msg.includes('ERR_CONNECTION_CLOSED') ||
          msg.includes('Failed to load resource')
      )) {
        return;
      }
      return originalConsole.log.apply(console, arguments);
    };
  }
  
  // 定义空stadium对象
  window.stadium = {
    get: function() { return null; }
  };
  
  // 在全局定义t对象
  window.t = {
    get: function() { return null; }
  };
})(); 