import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Fatal404() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-paper dark:bg-black
        text-ink-800 dark:text-safety-orange
        font-mono
        overflow-hidden
      "
    >
      {/* 扫描线 */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)]
          dark:bg-[linear-gradient(rgba(255,170,0,0.05)_1px,transparent_1px)]
          bg-[size:100%_4px]
          animate-pulse
        "
      />

      {/* 噪点 */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-[0.04]
          bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]
        "
      />

      <div className="relative z-10 text-center px-6">
        <div className="text-[96px] tracking-widest mb-4 opacity-80">
          404
        </div>

        <div className="text-sm tracking-[0.3em] mb-6">
          SYSTEM FAILURE
        </div>

        <div className="text-xs opacity-70 mb-8 leading-relaxed">
          路径不可达 / 信号丢失<br />
          TRACE FAILED AT:
          <div className="mt-2 text-safety-orange">
            {location.pathname}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="
              px-6 py-2
              border border-safety-orange
              text-safety-orange
              hover:bg-safety-orange hover:text-black
              transition-colors
            "
          >
            REBOOT
          </button>

          <button
            onClick={() => window.location.reload()}
            className="
              px-6 py-2
              border border-ink-400 dark:border-safety-orange/40
              text-ink-600 dark:text-safety-orange/70
              hover:border-safety-orange hover:text-safety-orange
              transition-colors
            "
          >
            FORCE RELOAD
          </button>
        </div>
      </div>
    </div>
  );
}
