
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthTerminalProps {
  onClose: () => void;
}

export const AuthTerminal = ({ onClose }: AuthTerminalProps) => {
  const { login, isLoggingIn } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  const script = [
    "> INITIALIZING_HANDSHAKE_PROTOCOL...",
    "> CONNECTING TO SUPABASE_AUTH_NODE...",
    "> PREPARING_GITHUB_OAUTH_REDIRECT...",
    "> WAITING FOR USER_PHYSICAL_GRANT..."
  ];

  useEffect(() => {
    if (step < script.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, script[step]]);
        setStep(s => s + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogin = async () => {
    setLogs(prev => [...prev, "> REDIRECTING_TO_IDENTITY_PROVIDER..."]);
    // This will redirect the page, so no need for state management post-call
    await login();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 dark:bg-void/60 backdrop-blur-2xl p-4 transition-all duration-500">
      <div className="w-full max-w-lg border-2 border-ink-900 dark:border-safety-orange bg-concrete-50 dark:bg-black shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_0_80px_rgba(255,170,0,0.2)] overflow-hidden font-mono transition-all duration-300 animate-in zoom-in-95 duration-300">
        
        {/* Terminal Header */}
        <div className="bg-ink-900 dark:bg-safety-orange text-white dark:text-black px-4 py-2 flex justify-between items-center text-xs font-bold tracking-tighter">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></span>
            <span>SECURE_SHELL_AUTH v2.0 // IDENTITY_GATE</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity font-bold">[ 关闭 ]</button>
        </div>
        
        <div className="p-8 min-h-[320px] flex flex-col relative">
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

          {/* Log Area */}
          <div className="flex-grow text-ink-900 dark:text-safety-orange text-sm space-y-2 mb-8 relative z-10">
            {logs.map((log, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300 flex items-start gap-2">
                <span className="opacity-40 select-none">[{i.toString().padStart(2, '0')}]</span>
                <span className="font-bold">{log}</span>
              </div>
            ))}
            
            {step === script.length && !isLoggingIn && (
              <div className="pt-4 border-t border-concrete-300 dark:border-safety-dim/30 animate-pulse text-xs text-ink-500 dark:text-safety-dim font-bold">
                系统就绪。等待用户物理授权确认...
              </div>
            )}
            
            {isLoggingIn && (
              <div className="flex items-center gap-3 pt-6 text-ink-900 dark:text-safety-orange">
                <div className="flex gap-1">
                  <span className="w-1.5 h-4 bg-ink-900 dark:bg-safety-orange animate-[bounce_1s_infinite_0ms]"></span>
                  <span className="w-1.5 h-4 bg-ink-900 dark:bg-safety-orange animate-[bounce_1s_infinite_200ms]"></span>
                  <span className="w-1.5 h-4 bg-ink-900 dark:bg-safety-orange animate-[bounce_1s_infinite_400ms]"></span>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">重定向至授权中心</span>
              </div>
            )}
          </div>

          {/* Action Area */}
          {!isLoggingIn && (
            <div className="flex flex-col gap-3 relative z-10">
              <button 
                onClick={handleLogin}
                className="w-full py-4 bg-ink-900 dark:bg-safety-orange text-white dark:text-black font-bold hover:invert transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                <span>正式连接 GITHUB 身份</span>
              </button>
              <button 
                onClick={onClose}
                className="w-full py-2 border-2 border-concrete-300 dark:border-safety-dim text-ink-400 dark:text-safety-dim hover:bg-concrete-200 dark:hover:bg-safety-dim/10 transition-colors text-[10px] font-bold tracking-widest uppercase"
              >
                取消访问
              </button>
            </div>
          )}
        </div>
        
        {/* Terminal Footer */}
        <div className="bg-concrete-200 dark:bg-safety-dim/10 px-6 py-3 text-[9px] text-ink-500 dark:text-safety-dim flex justify-between items-center border-t border-concrete-300 dark:border-transparent">
          <span className="italic font-bold">注意: 生产环境请确保环境变量已配置</span>
          <span className="font-mono">SECURE_TUNNEL: ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
