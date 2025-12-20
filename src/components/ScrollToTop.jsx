import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const main = document.getElementById('main');
    if (!main) return;

    try {
      main.focus({ preventScroll: true });
    } catch {
      main.focus();
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default ScrollToTop;



