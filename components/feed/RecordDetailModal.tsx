import React from 'react';
import { MemoryRecord } from '../../types';

interface RecordDetailModalProps {
  record: MemoryRecord;
  onClose: () => void;
}

export const RecordDetailModal = ({ record, onClose }: RecordDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-concrete-50 dark:bg-metal-900 border-2 border-concrete-400 dark:border-metal-600 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-colors duration-300" onClick={e => e.stopPropagation()}>
        <div className="bg-concrete-100 dark:bg-metal-800 p-4 border-b border-concrete-300 dark:border-metal-700 flex justify-between items-center">
          <div className="font-tech text-safety-orange tracking-wider">正在查看: {record.serialNumber}</div>
          <button onClick={onClose} className="text-ink-400 dark:text-metal-400 hover:text-ink-900 dark:hover:text-white font-mono text-xl leading-none">[关闭]</button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar relative">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.05)_50%)] dark:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
          <div className="flex justify-between items-end mb-6 border-b border-concrete-300 dark:border-metal-700 pb-2">
            <span className="text-2xl font-bold text-ink-900 dark:text-white font-mono">{record.category}</span>
            <span className="font-tech text-ink-500 dark:text-metal-500">{record.date}</span>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none font-mono text-ink-900 dark:text-metal-300">
            <p className="whitespace-pre-wrap leading-loose">{record.content}</p>
          </div>
          {record.image && (
            <div className="mt-8 border border-concrete-300 dark:border-metal-600 p-2 bg-white dark:bg-black">
              <img src={record.image} alt="证据" className="w-full h-auto grayscale contrast-125" />
            </div>
          )}
          <div className="mt-8 pt-4 border-t border-concrete-300 dark:border-metal-700 flex justify-between text-xs font-tech text-ink-500 dark:text-metal-600">
             <span>情绪分析: {record.mood}</span>
             <span>记录 ID: {record.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};