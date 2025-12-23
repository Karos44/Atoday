import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthTerminal } from '../auth/AuthTerminal';

/**
 * SYSTEM BOOT TIME
 * 系统启动时间：2025-12-24 00:00:00 (UTC)
 * 只要时间在走，运行时间就会一直增加
 */
const SYSTEM_BOOT_TIME = new Date('2025-12-24T00:00:00Z').getTime();

/** 计算系统运行小时数 */
function getSystemUptimeHours(): number {
  const diff = Date.now() - SYSTEM_BOOT_TIME;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
}

export const ProfilePanel = () => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  /* ===== System Stats ===== */
  const [memoryUsage, setMemoryUsage] = useState(14);
  const [uptime, setUptime] = useState(getSystemUptimeHours());

  /** 内存占用 & 运行时间拟态更新 */
  useEffect(() => {
    const timer = setInterval(() => {
      // 内存占用：轻微上下波动（8% ~ 22%）
      setMemoryUsage(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.min(22, Math.max(8, next));
      });

      // 运行时间：基于系统启动时间重新计算（全站一致）
      setUptime(getSystemUptimeHours());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {showAuth && <AuthTerminal onClose={() => setShowAuth(false)} />}

      {/* Identity Module */}
      <div className="border border-concrete-400 dark:border-metal-600 p-1 bg-concrete-200 dark:bg-metal-800 shrink-0 transition-colors duration-300 relative group">
        <div 
          onClick={() => !user && setShowAuth(true)}
          className={`
            border border-concrete-300 dark:border-metal-700 p-4 flex flex-col items-center gap-4 bg-paper dark:bg-void transition-all duration-300
            ${!user ? 'cursor-pointer hover:border-safety-orange' : ''}
          `}
        >
          {/* Avatar */}
          <div className={`
            w-24 h-24 border-2 border-concrete-400 dark:border-metal-600 overflow-hidden relative transition-all duration-700
            ${!user ? 'grayscale contrast-125 opacity-70' : 'grayscale-0 contrast-100 ring-2 ring-safety-orange ring-offset-4 ring-offset-void'}
          `}>
            <img 
              src={user ? user.avatar : "https://picsum.photos/seed/user/200"} 
              alt="头像" 
              className="object-cover w-full h-full" 
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10 dark:to-black/50"></div>

            {!user && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-full h-px bg-safety-orange animate-pulse"></div>
              </div>
            )}
          </div>

          <div className="text-center">
            <h2 className={`text-lg font-bold tracking-widest transition-colors ${user ? 'text-safety-orange' : 'text-ink-900 dark:text-metal-100'}`}>
              {user ? user.name : 'USER_NULL'}
            </h2>
            <p className="text-xs text-ink-600 dark:text-metal-400 font-tech mt-1">
              {user ? `[权限等级: ${user.role}]` : '“等待身份同步...”'}
            </p>
          </div>
        </div>

        {/* Access Status */}
        <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-bold ${user ? 'bg-green-600 text-white' : 'bg-red-700 text-white animate-pulse'}`}>
          {user ? '[ AUTHORIZED ]' : '[ UNAUTHORIZED ]'}
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-6">
        <div className="bg-concrete-200 dark:bg-metal-800 p-3 border border-concrete-300 dark:border-metal-700 transition-colors duration-300">
          <div className="text-[10px] text-ink-700 dark:text-metal-400 mb-1 font-bold uppercase">
            内存占用
          </div>
          <div className="text-safety-orange font-mono text-xl">
            {memoryUsage}%
          </div>
        </div>

        <div className="bg-concrete-200 dark:bg-metal-800 p-3 border border-concrete-300 dark:border-metal-700 transition-colors duration-300">
          <div className="text-[10px] text-ink-700 dark:text-metal-400 mb-1 font-bold uppercase">
            运行时间
          </div>
          <div className="text-ink-900 dark:text-metal-100 font-mono text-xl">
            {uptime}h
          </div>
        </div>
      </div>

      {/* Actions */}
      {user && (
        <div className="flex flex-col gap-2 mt-auto shrink-0 pt-6">
          <div className="text-[10px] text-ink-700 dark:text-metal-400 uppercase tracking-widest mb-2 border-b border-concrete-300 dark:border-metal-800 pb-1 font-bold">
            身份操作
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-between group px-3 py-2
                       border border-red-900/30 hover:bg-red-900/20
                       text-red-700 transition-all font-tech text-sm"
          >
            <span>TERMINATE_SESSION</span>
            <span>[ESC]</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="text-[10px] text-ink-500 dark:text-metal-500 text-center pt-4 border-t border-concrete-300 dark:border-metal-800 shrink-0 mt-6 font-tech">
        终端标识: XF-99<br/>
        SYSTEM INITIALIZED · 2025-12-24<br/>
        {user ? `UID: ${user.id}` : '身份未验证'}
      </div>
    </div>
  );
};
