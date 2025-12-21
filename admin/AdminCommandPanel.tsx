import React from 'react';
import { useAuth } from '../context/AuthContext';

const EDIT_URL = 'https://github.com/Karos44/Atoday/edit/main/data/posts.json';

export function AdminCommandPanel() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') return null;

  const handleEdit = () => {
    window.open(EDIT_URL, '_blank');
  };

  return (
    <div
      className="
        mt-6
        border border-safety-orange/60
        bg-black/40 dark:bg-black/60
        shadow-[0_0_20px_rgba(255,170,0,0.15)]
      "
    >
      {/* 标题 */}
      <div
        className="
          px-4 py-2
          border-b border-safety-orange/40
          text-safety-orange
          font-tech
          text-xs
          tracking-[0.3em]
          uppercase
          bg-gradient-to-r
          from-black
          to-safety-orange/10
        "
      >
        SYSTEM_COMMAND
      </div>

      {/* 内容 */}
      <div className="p-4 flex flex-col gap-3 text-xs font-mono">
        <div className="text-ink-400 dark:text-metal-600">
          权限级别：
          <span className="ml-2 text-safety-orange">ADMIN</span>
        </div>

        <div className="text-ink-500 dark:text-metal-500 leading-relaxed">
          此操作将跳转至 GitHub 仓库，直接编辑
          <br />
          <span className="text-safety-orange">data/posts.json</span>
          <br />
          并触发自动部署。
        </div>

        <button
          onClick={handleEdit}
          className="
            mt-2
            w-full
            px-4 py-2
            border
            border-safety-orange
            text-safety-orange
            font-tech
            tracking-widest
            uppercase
            text-xs
            bg-black
            hover:bg-safety-orange
            hover:text-black
            transition-colors
          "
        >
          &gt; EDIT_POSTS [GITHUB]
        </button>

        <div className="text-[10px] text-ink-400 dark:text-metal-700 text-center">
          Press to execute command
        </div>
      </div>
    </div>
  );
}
