import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { ARCHIVE_DATA } from "./data/mockData";
import { MemoryRecord, Category } from "./types";

import { MechanicalKnob } from "./components/ui/MechanicalKnob";
import { ThemeSwitch } from "./components/ui/ThemeSwitch";
import { ProfilePanel } from "./components/layout/ProfilePanel";
import { RecordItem } from "./components/feed/RecordItem";

import { HomePage } from "./data/Homepage";
import { Fatal404 } from "./data/Fatal404";

/**
 * ============================
 * MainApp = 布局 + 子路由
 * 规则：
 * - 只能用 Routes / Route
 * - 不允许 BrowserRouter
 * ============================
 */
export default function MainApp() {
  const [category, setCategory] = useState<Category>("全部");
  const [search, setSearch] = useState("");
  const [expandedRecord, setExpandedRecord] =
    useState<MemoryRecord | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const filteredData = ARCHIVE_DATA.filter((item) => {
    const matchesCat = category === "全部" || item.category === category;
    const q = search.toLowerCase();
    return (
      matchesCat &&
      (item.content.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.date.includes(q))
    );
  });

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-paper dark:bg-void transition-colors">
      {/* 左栏 */}
      <aside className="lg:col-span-2 bg-concrete-50 dark:bg-void border-r border-concrete-300 dark:border-metal-800">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="font-tech tracking-[0.4em]">TERMINAL</h1>
        </div>

        <MechanicalKnob
          options={["全部", "日常", "吐槽", "视觉", "混沌"]}
          selected={category}
          onChange={setCategory}
        />

        <ThemeSwitch isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      </aside>

      {/* 中栏 = 路由区 */}
      <main className="lg:col-span-7 border-r border-concrete-300 dark:border-metal-800 relative">
        <Routes>
          {/* 首页 */}
          <Route
            path="/"
            element={
              <HomePage
                filteredData={filteredData}
                onSelectRecord={setExpandedRecord}
              />
            }
          />

          {/* 文章详情页（占位） */}
          <Route
            path="/post/:id"
            element={
              <div className="p-10 font-mono text-ink-500 dark:text-metal-300">
                // ARTICLE DETAIL PAGE //
              </div>
            }
          />

          {/* 中栏 404 */}
          <Route path="*" element={<Fatal404 />} />
        </Routes>

        {/* 搜索栏 */}
        <div className="sticky bottom-0 border-t border-safety-orange bg-black">
          <input
            className="w-full h-14 bg-transparent px-4 font-mono text-safety-orange outline-none"
            placeholder="搜索记忆库..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </main>

      {/* 右栏 */}
      <aside
        id="app-scroll"
        className="lg:col-span-3 bg-concrete-50 dark:bg-metal-900 overflow-y-auto"
      >
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="font-tech tracking-[0.4em]">STATUS</h1>
        </div>
        <ProfilePanel />
      </aside>
    </div>
  );
}
