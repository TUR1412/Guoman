// 模拟stadium.js接口，解决类型错误
// 这个文件用于解决React DevTools或其他库引用的问题

// 创建一个更全面的模拟对象
const stadium = {
  get: function(obj, prop) {
    if (typeof obj === 'undefined') return null;
    return obj && obj[prop];
  },
  set: function() { return true; },
  delete: function() { return true; },
  has: function() { return false; }
};

// 导出模拟对象
export default stadium; 