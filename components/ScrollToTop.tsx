import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;

    // 下一帧再滚动，等内容真正渲染完
    requestAnimationFrame(() => {
      el.scrollTop = 0;
    });
  }, [location.key]); // 注意：不是 pathname

  return null;
}
