import React, { useEffect, useMemo, useRef, useState } from "react";

type LinkItem = {
  label: string;
  href: string;
  hint?: string;
};

type FloatingLinkOrbProps = {
  links?: LinkItem[];
  /** 初始位置（px），默认左下角偏移 */
  initial?: { x?: number; y?: number };
  /** 悬浮球尺寸（px） */
  size?: number;
  /** 距离屏幕边缘最小留白（px） */
  margin?: number;
};

export function FloatingLinkOrb({
  links,
  initial,
  size = 56,
  margin = 10,
}: FloatingLinkOrbProps) {
  const items: LinkItem[] = useMemo(
    () =>
      links ?? [
        { label: "GITHUB", href: "https://github.com/Karos44", hint: "repo / code" },
        { label: "TWITTER/X", href: "https://x.com/your", hint: "signal feed" },
        { label: "BILIBILI", href: "https://space.bilibili.com/470956929", hint: "video node" },
      ],
    [links]
  );

  const orbRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  // 位置（px）：fixed left/top
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const x = initial?.x ?? margin; // 左侧
    // bottom-left：用 window.innerHeight 计算 top
    const y =
      initial?.y ??
      Math.max(margin, (typeof window !== "undefined" ? window.innerHeight : 800) - size - margin);
    return { x, y };
  });

  // 拖拽状态
  const drag = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
    moved: false,
  });

  const clampPos = (x: number, y: number) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 面板展开时宽度更大，仍然不允许球体出界
    const maxX = Math.max(margin, w - size - margin);
    const maxY = Math.max(margin, h - size - margin);

    return {
      x: Math.min(Math.max(margin, x), maxX),
      y: Math.min(Math.max(margin, y), maxY),
    };
  };

  // resize 时把球体夹回屏内
  useEffect(() => {
    const onResize = () => {
      setPos((p) => clampPos(p.x, p.y));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, margin]);

  const onPointerDown = (e: React.PointerEvent) => {
    // 只左键/触摸
    if (e.button !== 0 && e.pointerType === "mouse") return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    drag.current.active = true;
    drag.current.pointerId = e.pointerId;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.baseX = pos.x;
    drag.current.baseY = pos.y;
    drag.current.moved = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || drag.current.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    // 轻微移动不算拖拽，避免点按时误触
    if (!drag.current.moved && Math.hypot(dx, dy) > 6) {
      drag.current.moved = true;
    }

    const next = clampPos(drag.current.baseX + dx, drag.current.baseY + dy);
    setPos(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current.pointerId !== e.pointerId) return;

    // 释放
    drag.current.active = false;
    drag.current.pointerId = null;

    // 没有发生拖拽 -> 视为点击：开合
    if (!drag.current.moved) {
      setOpen((v) => !v);
    }
  };

  // 点击页面其他地方：收起
  useEffect(() => {
    const onDocDown = (ev: MouseEvent) => {
      if (!open) return;
      const el = orbRef.current;
      if (!el) return;
      if (ev.target instanceof Node && el.contains(ev.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  // 打开时：如果靠近底部/右侧，面板自动朝屏内展开（避免出屏）
  const panelDir = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;

    const right = pos.x > w * 0.55;
    const bottom = pos.y > h * 0.55;

    return {
      // panel 从球体旁边弹出：默认向右上
      alignX: right ? "left" : "right",
      alignY: bottom ? "top" : "bottom",
    } as const;
  }, [pos.x, pos.y]);

  const panelStyle: React.CSSProperties = useMemo(() => {
    const gap = 12;
    const base: React.CSSProperties = { position: "absolute" };

    // X
    if (panelDir.alignX === "right") {
      base.left = size + gap;
    } else {
      base.right = size + gap;
    }

    // Y
    if (panelDir.alignY === "bottom") {
      base.top = 0;
    } else {
      base.bottom = 0;
    }

    return base;
  }, [panelDir.alignX, panelDir.alignY, size]);

  return (
    <div
      ref={orbRef}
      className="fixed z-50 select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Orb + drag handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative"
        style={{ width: size, height: size }}
        role="button"
        aria-label="External links orb"
        title="External Nodes (drag / click)"
      >
        {/* 外圈：金属环 */}
        <div
          className="
            absolute inset-0 rounded-full
            border border-metal-700/80 dark:border-metal-600/80
            bg-black/35 backdrop-blur
            shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_30px_rgba(0,0,0,0.55)]
          "
        />

        {/* 内核：扫描线 + 辐射光 */}
        <div
          className="
            absolute inset-[6px] rounded-full
            bg-gradient-to-b from-black/60 via-black/40 to-black/70
            border border-safety-orange/30
            shadow-[0_0_22px_rgba(255,140,0,0.20),inset_0_0_18px_rgba(0,0,0,0.75)]
            overflow-hidden
          "
        >
          {/* 扫描线 */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-screen"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 7px)",
            }}
          />
          {/* 噪点 */}
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.22) 1px, rgba(0,0,0,0) 1px)",
              backgroundSize: "6px 6px",
            }}
          />
          {/* HUD 标识 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-tech text-[10px] tracking-[0.35em] text-metal-200/80">
              NODE
            </div>
          </div>
          {/* 状态点 */}
          <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-safety-orange shadow-[0_0_10px_rgba(255,140,0,0.75)]" />
        </div>

        {/* 点击展开提示：小箭头 */}
        <div
          className={`
            absolute -right-2 -bottom-2
            w-6 h-6 rounded-full
            bg-black/45 border border-metal-700/70
            flex items-center justify-center
            text-[10px] text-metal-200/80
            transition-transform duration-200
            ${open ? "rotate-90" : ""}
          `}
        >
          ↗
        </div>
      </div>

      {/* Panel */}
      {open && (
        <div style={panelStyle} className="pointer-events-auto">
          <div
            className="
              relative w-[240px]
              bg-black/55 backdrop-blur
              border border-metal-700/80
              shadow-[0_14px_40px_rgba(0,0,0,0.55)]
              overflow-hidden
            "
          >
            {/* Panel 顶部条 */}
            <div className="px-3 py-2 border-b border-metal-700/70 flex items-center justify-between">
              <div className="font-tech text-[10px] tracking-[0.35em] text-metal-200/80">
                EXTERNAL_NODES
              </div>
              <div className="text-[10px] text-safety-orange/80 font-tech tracking-widest">
                {items.length.toString().padStart(2, "0")}
              </div>
            </div>

            {/* CRT 扫描遮罩 */}
            <div
              className="absolute inset-0 opacity-[0.14] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.04) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 8px)",
              }}
            />

            {/* 列表 */}
            <div className="p-2">
              {items.map((it) => (
                <a
                  key={it.label}
                  href={it.href}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group block rounded
                    px-3 py-2
                    border border-transparent
                    hover:border-safety-orange/40
                    hover:bg-black/40
                    transition-colors
                  "
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-tech text-xs tracking-widest text-metal-200/85">
                      {it.label}
                    </div>
                    <div className="text-xs text-safety-orange/80 group-hover:text-safety-orange transition-colors">
                      ↗
                    </div>
                  </div>
                  {it.hint && (
                    <div className="mt-1 text-[10px] font-mono text-metal-400/70">
                      // {it.hint}
                    </div>
                  )}
                </a>
              ))}
            </div>

            {/* 底部安全条 */}
            <div className="px-3 py-2 border-t border-safety-orange/40 flex items-center justify-between">
              <div className="text-[10px] font-mono text-metal-400/70">
                drag: enabled
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[10px] font-tech tracking-widest text-metal-200/70 hover:text-safety-orange transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>

          {/* 小连接线：像电缆 */}
          <div
            className="absolute -left-4 top-3 h-[2px] w-4 bg-safety-orange/60"
            style={{
              boxShadow: "0 0 12px rgba(255,140,0,0.55)",
            }}
          />
        </div>
      )}
    </div>
  );
}
