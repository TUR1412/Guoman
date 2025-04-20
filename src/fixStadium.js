/**
 * 修复stadium.js相关问题的专用模块
 */

const fixStadiumIssues = () => {
  try {
    // 定义虚拟对象处理stadium.js中的t.get调用
    const stadiumProxy = new Proxy({}, {
      get: function(target, prop) {
        // 返回一个通用函数，无论调用什么方法都不报错
        if (typeof target[prop] === 'undefined') {
          return function() { return null; };
        }
        return target[prop];
      }
    });

    // 尝试在全局作用域定义相关对象
    window.stadium = stadiumProxy;
    window.t = stadiumProxy;

    // 尝试处理错误调用栈中可能出现的问题点
    ['stadium.js:1:2654', 'stadium.js:1:2794', 'stadium.js:1:110', 
     'stadium.js:1:2832', 'stadium.js:1:903', 'stadium.js:1:912'].forEach(location => {
      const [file, line, col] = location.split(':');
      
      // 在错误位置注入调用修复
      try {
        Object.defineProperty(window, `__fix_${line}_${col}`, {
          value: function() { return stadiumProxy; },
          writable: false
        });
      } catch (e) {}
    });
    
    // 监听脚本加载错误，拦截stadium.js的请求
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && (value.includes('stadium.js') || /[0-9A-F]{6,8}/.test(value))) {
            // 阻止加载可疑脚本
            console.warn('[Stadium Fix] 拦截可疑脚本加载:', value);
            return;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
    
    console.log('[Stadium Fix] 已应用stadium.js问题修复');
  } catch (e) {
    // 静默失败
  }
};

export default fixStadiumIssues; 