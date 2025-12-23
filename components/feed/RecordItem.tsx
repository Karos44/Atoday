import React from 'react';
import { MemoryRecord } from '../../types';

interface RecordItemProps {
  data: MemoryRecord;
  onClick: () => void;
}

/**
 * 顺序编号（与时间解耦）
 * AT-0001 / AT-0039 / AT-0123
 */
function formatSequence(id: number) {
  return `AT-${String(id).padStart(4, '0')}`;
}

export const RecordItem = ({ data, onClick }: RecordItemProps) => {
  return (
    <div
      onClick={onClick}
      className="
        relative
        pl-8 pr-4 py-8
        group cursor-pointer
        hover:bg-black/5 dark:hover:bg-white/5
        transition-colors duration-200
      "
    >
      {/* 左侧时间线 / 轨道装饰 */}
      <div
        className="
          absolute left-0 top-0 bottom-0 w-4
          border-r border-concrete-300 dark:border-metal-700
          flex flex-col items-center gap-4 py-4
          bg-concrete-100 dark:bg-metal-900
          transition-colors duration-300
        "
      >
        <span className="w-1.5 h-1.5 bg-concrete-300 dark:bg-metal-800 rounded-full" />
        <span className="w-1.5 h-1.5 bg-concrete-300 dark:bg-metal-800 rounded-full" />
        <span className="w-1.5 h-1.5 bg-ink-900 dark:bg-black rounded-full border border-concrete-400 dark:border-metal-600 group-hover:bg-safety-orange transition-colors" />
        <span className="w-1.5 h-1.5 bg-concrete-300 dark:bg-metal-800 rounded-full" />
        <span className="w-1.5 h-1.5 bg-concrete-300 dark:bg-metal-800 rounded-full" />
      </div>

      <div
        className="
          border-l-2 border-transparent
          pl-4
          group-hover:border-safety-orange
          transition-colors duration-300
        "
      >
        {/* 标题（主视觉） */}
        {data.title && (
          <div
            className="
              mb-2
              font-tech
              tracking-widest
              text-safety-orange
              group-hover:brightness-110
              transition-colors
            "
          >
            {data.title}
          </div>
        )}

        {/* 元信息行：编号 / 日期 / 状态 */}
        <header
          className="
            flex items-baseline gap-4 mb-2
            font-tech text-sm
            text-ink-500 dark:text-metal-500
          "
        >
          {/* 顺序编号（身份） */}
          <span className="text-safety-dim group-hover:text-safety-orange transition-colors">
            #{formatSequence(data.id)}
          </span>

          {/* 日期（时间戳） */}
          <span className="opacity-80">[{data.date}]</span>

          {/* 填充虚线 */}
          <span className="flex-grow border-b border-concrete-300 dark:border-metal-800 border-dashed opacity-40" />

          {/* 状态 */}
          <span
            className={`
              text-[10px] px-1 border
              ${
                data.mood === '波动'
                  ? 'border-red-700 text-red-700 dark:border-red-900 dark:text-red-700'
                  : 'border-concrete-300 dark:border-metal-700'
              }
            `}
          >
            状态: {data.mood}
          </span>
        </header>

        {/* 内容预览 */}
        <div
          className="
            prose dark:prose-invert
            prose-p:font-mono prose-p:leading-relaxed
            max-w-none line-clamp-3
            transition-colors
          "
        >
          <p
            className="
              whitespace-pre-wrap
              text-ink-500 dark:text-metal-300
              group-hover:text-ink-900 dark:group-hover:text-concrete-50
              transition-colors
            "
          >
            {data.content}
          </p>
        </div>

        {/* 缩略图 */}
        {data.image && (
          <div
            className="
              mt-4 inline-block
              border-2 border-concrete-300 dark:border-metal-700
              p-1
              bg-concrete-200 dark:bg-metal-900
            "
          >
            <img
              src={data.image}
              alt="附件"
              className="
                h-20 w-auto max-w-full object-cover
                opacity-80 dark:opacity-60
                group-hover:opacity-100 transition-opacity
                contrast-125 sepia-[.2]
              "
            />
          </div>
        )}
      </div>

      {/* 底部分隔线 */}
      <div className="absolute bottom-0 left-8 right-0 h-px bg-concrete-200 dark:bg-metal-800">
        <span className="absolute right-0 -top-1.5 text-[10px] text-ink-400 dark:text-metal-700">
          +
        </span>
      </div>
    </div>
  );
};
