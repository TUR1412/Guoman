// 模拟服务器处理失败的网络请求
class MockServer {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      try {
        // 尝试原始fetch
        const response = await originalFetch(url, options);
        return response;
      } catch (error) {
        // 如果失败，返回模拟响应
        console.log(`[MockServer] 拦截到失败的请求: ${url}`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: '模拟响应', 
            data: {} 
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
    };

    // 拦截XHR请求
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(...args) {
      this._mockServerUrl = args[1];
      return originalXHROpen.apply(this, args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('error', () => {
        console.log(`[MockServer] 拦截到失败的XHR请求: ${this._mockServerUrl}`);
        
        // 模拟成功响应
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'statusText', { value: 'OK' });
        Object.defineProperty(this, 'response', { 
          value: JSON.stringify({ success: true, message: '模拟响应', data: {} }) 
        });
        Object.defineProperty(this, 'responseText', { 
          value: JSON.stringify({ success: true, message: '模拟响应', data: {} }) 
        });
        
        // 触发回调
        if (typeof this.onload === 'function') {
          this.onload();
        }
      });
      
      return originalXHRSend.apply(this, args);
    };
  }
}

// 实例化并导出
export default new MockServer(); 