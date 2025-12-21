import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { MemoryRecord, Category } from './types';
import { getAllRecords, getRecordById } from './data/posts';
import { MechanicalKnob } from './components/ui/MechanicalKnob';
import { ThemeSwitch } from './components/ui/ThemeSwitch';
import { RecordItem } from './components/feed/RecordItem';
import { ProfilePanel } from './components/layout/ProfilePanel';
import { AuthProvider } from './context/AuthContext';

// 确保 Fatal404.tsx 和 App.tsx 在同一层（同级目录）
// 如果你放在别处，把下面这行路径改成对应位置即可
import { Fatal404 } from './data/Fatal404';

/**
 * Outlet Context：简单说就是“父页面把数据塞给子页面用”
 * 这里我们把：筛选后的列表 + 点击打开文章的方法，传给子路由页面
 */
type ShellContext = {
  filteredData: MemoryRecord[];
  openRecord: (record: MemoryRecord) => void;
};

function useShellContext() {
  return useOutletContext<ShellContext>();
}

/** 把中文分类映射成 URL 里更稳的英文 slug */
const CATEGORY_TO_SLUG: Record<Category, string> = {
  '全部': '',
  '日常': 'daily',
  '吐槽': 'rant',
  '视觉': 'visual',
  '混沌': 'chaos',
};

const SLUG_TO_CATEGORY: Record<string, Category> = {
  daily: '日常',
  rant: '吐槽',
  visual: '视觉',
  chaos: '混沌',
};

function slugToCategory(slug?: string): Category {
  if (!slug) return '全部';
  return SLUG_TO_CATEGORY[slug] ?? '全部';
}

function categoryToPath(cat: Category): string {
  const slug = CATEGORY_TO_SLUG[cat];
  return slug ? `/c/${slug}` : `/`;
}

/**
 * 三栏“外壳”：
 * - 左侧终端（分类/主题）
 * - 中间数据流（这里放 Outlet，让路由页面在中间切换）
 * - 右侧状态面板
 */
function TerminalShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // /c/:cat 的 cat 参数（例如 daily/rant/visual/chaos）
  const selectedCategory: Category = slugToCategory(params.cat);

  const [search, setSearch] = useState('');

  // 主题：用 localStorage 记一下，刷新不会“突然又变回黑夜”
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
    } catch {}
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  // 过滤数据（分类 + 搜索）
  const allRecords = getAllRecords();

const filteredData = useMemo(() => {
  return allRecords.filter((item) => {
      const matchesCat = selectedCategory === '全部' || item.category === selectedCategory;

      const searchLower = search.toLowerCase();
      const matchesSearch =
        item.content.toLowerCase().includes(searchLower) ||
        item.serialNumber.toLowerCase().includes(searchLower) ||
        item.date.toLowerCase().includes(searchLower);

      return matchesCat && matchesSearch;
    });
  }, [allRecords, selectedCategory, search]);

  // 点击分类：不再 setCategory，而是“跳 URL”
  const handleCategoryChange = (next: Category) => {
    const to = categoryToPath(next);
    if (location.pathname !== to) navigate(to);
  };

  // 点击文章：跳到 /posts/:id
  const openRecord = (record: MemoryRecord) => {
    navigate(`/posts/${record.id}`);
  };

  // 路由变化时，把中间滚动条拉回顶部（避免你说的“刷新停在奇怪位置”）
  useEffect(() => {
    const main = document.getElementById('main-scroll');
    if (main) {
      main.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    const right = document.getElementById('app-scroll');
    if (right) right.scrollTop = 0;
  }, [location.pathname]);

  // 仅用于底部那行“已找到 X 条记录”的显示：只在列表页显示更合理
  const isFeedPage = location.pathname === '/' || location.pathname.startsWith('/c/');

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-paper dark:bg-void transition-colors duration-300 lg:h-screen lg:overflow-hidden">
      {/* 左侧栏 */}
      <aside className="flex lg:col-span-2 flex-col z-20 shadow-xl lg:shadow-[10px_0_20px_rgba(0,0,0,0.05)] dark:lg:shadow-[10px_0_20px_rgba(0,0,0,0.5)] order-1 bg-concrete-50 dark:bg-void border-b-2 lg:border-b-0 lg:border-r-2 border-concrete-300 dark:border-metal-800 relative h-auto lg:h-screen overflow-y-auto no-scrollbar shrink-0 transition-colors duration-300">
        <div className="h-16 flex items-center justify-center border-b-2 border-concrete-300 dark:border-metal-800 bg-concrete-100 dark:bg-metal-900 shrink-0 transition-colors duration-300">
          <h1 className="font-tech text-xl tracking-[0.4em] text-ink-500 dark:text-metal-400 uppercase">TERMINAL</h1>
        </div>

        <MechanicalKnob
          options={['全部', '日常', '吐槽', '视觉', '混沌']}
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />

        <ThemeSwitch isDark={isDark} onToggle={() => setIsDark(!isDark)} />

        <div className="hidden lg:block flex-grow min-h-[100px] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 dark:opacity-20"></div>
        <div className="hidden lg:block p-4 text-[10px] text-ink-400 dark:text-metal-700 text-center font-tech leading-tight shrink-0">
          系统就绪
          <br />
          等待输入
          <br />
          信号正常
        </div>
      </aside>

      {/* 中间栏 */}
      <main className="col-span-1 lg:col-span-7 bg-paper dark:bg-void relative flex flex-col min-h-screen lg:h-screen border-r-0 lg:border-r-2 border-concrete-300 dark:border-metal-800 order-2 transition-colors duration-300 lg:overflow-hidden">
        {/* 顶部条：放在滚动区外面，所以天然固定 */}
        <div className="h-16 bg-concrete-100 dark:bg-metal-900 border-b border-concrete-300 dark:border-metal-700 flex items-center justify-between px-6 overflow-hidden shrink-0 z-40 transition-colors duration-300">
          <div className="font-tech text-xl tracking-[0.4em] text-ink-500 dark:text-metal-400 uppercase">DATA_STREAM</div>
          <div className="flex gap-1 h-full items-end pb-4 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`w-1 bg-ink-900 dark:bg-metal-500 ${i % 2 === 0 ? 'h-4' : 'h-2'}`}></div>
            ))}
          </div>
        </div>

        {/* ✅ 中间滚动区：桌面端只滚这里 */}
        <div id="main-scroll" className="flex-grow pb-32 relative lg:overflow-y-auto">
          <Outlet context={{ filteredData, openRecord }} />
        </div>

        {/* 底部命令条：放在滚动区外面，所以天然固定 */}
        <div className="shrink-0 border-t-2 border-safety-orange bg-concrete-50 dark:bg-black z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-colors duration-300">
          <div className="flex items-center h-16">
            <div className="w-16 h-full bg-safety-orange text-black flex items-center justify-center font-bold text-xl shrink-0">
              &gt;_
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isFeedPage ? '搜索记忆库...' : '输入关键词返回列表…（或点返回）'}
              className="flex-grow h-full bg-transparent text-safety-orange px-4 font-mono uppercase text-lg focus:outline-none placeholder-ink-400 dark:placeholder-metal-700 caret-safety-orange"
              // 如果你未来还遇到“刷新滚动位置怪”，优先把 autoFocus 去掉
              autoFocus
            />

            {isFeedPage && (
              <div className="px-6 text-xs text-ink-500 dark:text-metal-600 font-tech hidden sm:block shrink-0">
                已找到 {filteredData.length} 条记录
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 右侧栏 */}
      <aside
        id="app-scroll"
        className="flex lg:col-span-3 flex-col bg-concrete-50 dark:bg-metal-900 shadow-none lg:shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)] dark:lg:shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)] order-3 border-t-2 lg:border-t-0 border-concrete-300 dark:border-metal-800 relative h-auto lg:h-screen overflow-y-auto no-scrollbar shrink-0 transition-colors duration-300"
      >
        <div className="h-16 flex items-center justify-center border-b-2 border-concrete-300 dark:border-metal-800 bg-concrete-100 dark:bg-metal-900 shrink-0 transition-colors duration-300">
          <h1 className="font-tech text-xl tracking-[0.4em] text-ink-500 dark:text-metal-400 uppercase">STATUS</h1>
        </div>
        <div className="p-6 flex flex-col gap-6 h-full">
          <ProfilePanel />
        </div>
      </aside>
    </div>
  );
}

/** 列表页（原来的中间栏内容） */
function FeedRoute() {
  const { filteredData, openRecord } = useShellContext();

  return (
    <div className="min-h-full">
      {filteredData.length > 0 ? (
        filteredData.map((record) => (
          <RecordItem key={record.id} data={record} onClick={() => openRecord(record)} />
        ))
      ) : (
        <div className="p-10 flex flex-col items-center justify-center h-64 text-ink-400 dark:text-metal-600 font-tech">
          <div className="text-4xl mb-4 opacity-20">?</div>
          <div className="animate-pulse">// 未找到相关记录 //</div>
        </div>
      )}
    </div>
  );
}

/** 文章详情页 /posts/:id */
function PostRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const record = id ? getRecordById(id) : null;

  // id 不存在：用你的全屏 404 覆盖
  if (!record) return <Fatal404 />;

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 border border-concrete-300 dark:border-metal-700 text-ink-600 dark:text-metal-300 hover:border-safety-orange hover:text-safety-orange transition-colors font-tech text-xs uppercase"
        >
          ← Back
        </button>

        <div className="text-xs font-tech text-ink-400 dark:text-metal-600">
          分类: <span className="text-ink-600 dark:text-metal-300">{record.category}</span>
        </div>
      </div>

      <header className="flex items-baseline gap-4 mb-4 font-tech text-ink-500 dark:text-metal-500 text-sm">
        <span className="text-safety-dim">#{record.serialNumber}</span>
        <span>[{record.date}]</span>
        <span className="flex-grow border-b border-concrete-300 dark:border-metal-800 border-dashed opacity-50"></span>
        <span className="text-[10px] px-1 border border-concrete-300 dark:border-metal-700">状态: {record.mood}</span>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-ink-700 dark:text-metal-200 leading-relaxed font-mono">
          {record.content}
        </p>

        {record.image && (
          <div className="mt-6 border-2 border-concrete-300 dark:border-metal-700 p-1 bg-concrete-200 dark:bg-metal-900 inline-block">
            <img
              src={record.image}
              alt="证据"
              className="max-w-full h-auto object-cover opacity-90 dark:opacity-75 contrast-125 sepia-[.2]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 外壳路由：负责三栏结构 */}
        <Route path="/" element={<TerminalShell />}>
          {/* / */}
          <Route index element={<FeedRoute />} />
          {/* /c/daily | /c/rant | /c/visual | /c/chaos */}
          <Route path="c/:cat" element={<FeedRoute />} />
          {/* /posts/:id */}
          <Route path="posts/:id" element={<PostRoute />} />

          {/* 任何未匹配的地址：全屏 404 覆盖 */}
          <Route path="*" element={<Fatal404 />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
