import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * 导航链接组件，处理正确的基础路径和哈希路由
 * 
 * 使用此组件替换所有 React Router 的 Link 组件
 */
function NavLink({ to, children, ...props }) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
}

export default NavLink; 