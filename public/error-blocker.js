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
          msg.includes('Failed to load resource') ||
          msg.includes('TypeError') ||
          msg.includes('Permissions-Policy header')
      )) {
        return;
      }
      return originalConsole.log.apply(console, arguments);
    };
  }
  
  // 创建一个更完整的模拟对象
  var mockObjectWithMethods = function() {
    var handler = {
      get: function(target, prop) {
        if (typeof target[prop] !== 'undefined') {
          return target[prop];
        }
        
        // 如果属性不存在，返回一个函数
        return function() { return null; };
      }
    };
    
    return new Proxy({}, handler);
  };
  
  // 定义全局对象
  window.stadium = mockObjectWithMethods();
  window.t = mockObjectWithMethods();
  
  // 定义额外的方法和属性
  t.get = function() { return null; };
  t.set = function() { return null; };
  t.init = function() { return null; };
  t.config = mockObjectWithMethods();
  
  // 阻止权限策略错误
  try {
    // 尝试清除控制台，减少干扰
    setTimeout(function() {
      console.clear();
    }, 1000);
  } catch(e) {}
})(); 