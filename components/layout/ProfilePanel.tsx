import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthTerminal } from '../auth/AuthTerminal';

export const ProfilePanel = () => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

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
          {/* Avatar with Grayscale/Color Logic */}
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
             
             {/* Scanline decoration when logged out */}
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

        {/* Access Status Indicator */}
        <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-bold ${user ? 'bg-green-600 text-white' : 'bg-red-700 text-white animate-pulse'}`}>
          {user ? '[ AUTHORIZED ]' : '[ UNAUTHORIZED ]'}
        </div>
      </div>

      {/* System Stats Section */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-6">
        <div className="bg-concrete-200 dark:bg-metal-800 p-3 border border-concrete-300 dark:border-metal-700 transition-colors duration-300">
          <div className="text-[10px] text-ink-700 dark:text-metal-400 mb-1 font-bold uppercase">内存占用</div>
          <div className="text-safety-orange font-mono text-xl animate-pulse">14%</div>
        </div>
        <div className="bg-concrete-200 dark:bg-metal-800 p-3 border border-concrete-300 dark:border-metal-700 transition-colors duration-300">
          <div className="text-[10px] text-ink-700 dark:text-metal-400 mb-1 font-bold uppercase">运行时间</div>
          <div className="text-ink-900 dark:text-metal-100 font-mono text-xl">842h</div>
        </div>
      </div>

      {/* External Links / Actions */}
      <div className="flex flex-col gap-2 mt-auto shrink-0 pt-6">
         <div className="text-[10px] text-ink-700 dark:text-metal-400 uppercase tracking-widest mb-2 border-b border-concrete-300 dark:border-metal-800 pb-1 font-bold">
           {user ? '身份操作' : '外部节点'}
         </div>
         
         {user ? (
           <button 
             onClick={logout}
             className="flex items-center justify-between group px-3 py-2 border border-red-900/30 hover:bg-red-900/20 text-red-700 transition-all font-tech text-sm"
           >
             <span>TERMINATE_SESSION</span>
             <span>[ESC]</span>
           </button>
         ) : (
           ['GITHUB', 'TWITTER/X', 'BILIBILI'].map(link => (
             <a key={link} href="#" className="flex items-center justify-between group px-3 py-2 border border-transparent hover:border-concrete-400 dark:hover:border-metal-600 hover:bg-concrete-200 dark:hover:bg-metal-800 transition-all">
               <span className="text-sm text-ink-700 dark:text-metal-300 group-hover:text-safety-orange transition-colors">{link}</span>
               <span className="text-xs text-ink-400 dark:text-metal-500">↗</span>
             </a>
           ))
         )}
      </div>

      <div className="text-[10px] text-ink-500 dark:text-metal-500 text-center pt-4 border-t border-concrete-300 dark:border-metal-800 shrink-0 mt-6 font-tech">
        终端标识: XF-99<br/>
        {user ? `UID: ${user.id}` : '身份未验证'}
      </div>
    </div>
  );
};