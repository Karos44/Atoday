import React, { useEffect, useMemo, useState } from 'react';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { MemoryRecord, Category } from './types';
import { getAllRecords, getRecordById } from './data/posts';
import { MechanicalKnob } from './components/ui/MechanicalKnob';
import { ThemeSwitch } from './components/ui/ThemeSwitch';
import { RecordItem } from './components/feed/RecordItem';
import { ProfilePanel } from './components/layout/ProfilePanel';
import { FloatingLinkOrb } from './components/layout/FloatingLinkOrb';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminPostEditor } from './admin/AdminPostEditor';
import { Fatal404 } from './data/Fatal404';

/* ---------- types ---------- */

type ShellContext = {
  filteredData: MemoryRecord[];
  openRecord: (record: MemoryRecord) => void;
};

function useShellContext() {
  return useOutletContext<ShellContext>();
}

const CATEGORY_TO_SLUG: Record<Category, string> = {
  全部: '',
  日常: 'daily',
  吐槽: 'rant',
  视觉: 'visual',
  混沌: 'chaos',
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

/* ---------- shell ---------- */

function TerminalShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const selectedCategory: Category = slugToCategory(params.cat);
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const allRecords = getAllRecords();

  const filteredData = useMemo(() => {
    return allRecords.filter((item) => {
      const matchesCat =
        selectedCategory === '全部' || item.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        item.content.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allRecords, selectedCategory, search]);

  const handleCategoryChange = (next: Category) => {
    const to = categoryToPath(next);
    if (location.pathname !== to) navigate(to);
  };

  const openRecord = (record: MemoryRecord) => {
    navigate(`/posts/${record.id}`);
  };

  return (
    <>
      {/* ================= 主体三栏 ================= */}
      <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-paper dark:bg-void overflow-hidden">
        {/* LEFT */}
        <aside className="col-span-1 lg:col-span-2 flex flex-col border-r border-concrete-300 dark:border-metal-800">
          <MechanicalKnob
            options={['全部', '日常', '吐槽', '视觉', '混沌']}
            selected={selectedCategory}
            onChange={handleCategoryChange}
          />
          <ThemeSwitch isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </aside>

        {/* CENTER */}
        <main className="col-span-1 lg:col-span-7 flex flex-col overflow-hidden">
          <div id="main-scroll" className="flex-1 overflow-y-auto">
            <Outlet context={{ filteredData, openRecord }} />
          </div>

          <div className="h-16 border-t border-safety-orange flex items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent px-4 text-safety-orange"
              placeholder="搜索记忆库..."
            />
          </div>
        </main>

        {/* RIGHT */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col overflow-hidden border-l border-concrete-300 dark:border-metal-800">
          <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-concrete-300 dark:border-metal-800">
            <div className="font-tech text-xs tracking-[0.25em] text-ink-500 dark:text-metal-500">
              STATUS
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate('/admin/write')}
                className="px-3 py-2 border border-concrete-300 dark:border-metal-700
                           text-ink-600 dark:text-metal-300
                           hover:border-safety-orange hover:text-safety-orange
                           transition-colors font-tech text-xs uppercase"
              >
                WRITE
              </button>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <ProfilePanel />
          </div>
        </aside>
      </div>

      {/* ================= 悬浮外链球（全局 / fixed） ================= */}
      <FloatingLinkOrb
        links={[
          { label: 'GITHUB', href: 'https://github.com/Karos44', hint: 'repo / code' },
          { label: 'TWITTER/X', href: 'https://x.com/你的地址', hint: 'signal feed' },
          { label: 'BILIBILI', href: 'https://space.bilibili.com/470956929', hint: 'video node' },
        ]}
      />
    </>
  );
}

/* ---------- routes ---------- */

function FeedRoute() {
  const { filteredData, openRecord } = useShellContext();
  return (
    <>
      {filteredData.map((r) => (
        <RecordItem key={r.id} data={r} onClick={() => openRecord(r)} />
      ))}
    </>
  );
}

/* ---------- PostRoute ---------- */

function PostRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const record = id ? getRecordById(Number(id)) : null;

  if (!record) return <Fatal404 />;

  return (
    <div className="relative">
      {/* 顶部返回条 */}
      <div
        className="
          sticky top-0 z-20
          bg-paper/80 dark:bg-void/80
          backdrop-blur
          border-b border-concrete-300 dark:border-metal-800
          px-6 py-4
        "
      >
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="
              px-3 py-2
              border border-concrete-300 dark:border-metal-700
              text-ink-700 dark:text-metal-300
              hover:border-safety-orange hover:text-safety-orange
              transition-colors
              font-tech text-xs uppercase
            "
          >
            ← Back
          </button>

          <div className="text-xs font-tech text-ink-500 dark:text-metal-600">
            分类:{' '}
            <span className="text-ink-700 dark:text-metal-300">
              {record.category}
            </span>
          </div>
        </div>
      </div>

      {/* ================= 文章展示区 ================= */}
      <div className="flex justify-center py-16 px-4">
        <article
          className="
            w-full max-w-3xl
            bg-paper/90 dark:bg-black/55
            backdrop-blur
            border border-concrete-300 dark:border-metal-700
            shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.15)]
            dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_90px_rgba(0,0,0,0.85)]
            px-10 py-10
            relative
          "
        >
          {/* 装饰边角 */}
          <span className="absolute left-0 top-0 w-3 h-3 border-l border-t border-safety-orange" />
          <span className="absolute right-0 top-0 w-3 h-3 border-r border-t border-safety-orange" />
          <span className="absolute left-0 bottom-0 w-3 h-3 border-l border-b border-safety-orange" />
          <span className="absolute right-0 bottom-0 w-3 h-3 border-r border-b border-safety-orange" />

          {/* 标题 */}
          {record.title && (
            <h1
              className="
                mb-4
                font-tech
                text-3xl
                tracking-widest
                text-safety-orange
              "
            >
              {record.title}
            </h1>
          )}

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-ink-500 dark:text-metal-400 mb-10">
            <span className="text-safety-dim">
              #{record.serialNumber}
            </span>
            <span>{record.date}</span>
            <span>分类：{record.category}</span>
            <span className="border border-concrete-300 dark:border-metal-700 px-2 py-[1px] text-[10px]">
              状态: {record.mood}
            </span>
          </div>

          {/* 分隔线 */}
          <div className="mb-8 h-px bg-gradient-to-r from-transparent via-concrete-300 dark:via-metal-700 to-transparent opacity-60" />

          {/* 正文 */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-ink-700 dark:text-metal-200 font-mono">
              {record.content}
            </p>

            {record.image && (
              <div
                className="
                  mt-8
                  border border-concrete-300 dark:border-metal-700
                  p-2
                  bg-paper/80 dark:bg-black/60
                  inline-block
                "
              >
                <img
                  src={record.image}
                  alt="附件"
                  className="
                    max-w-full h-auto
                    object-cover
                    contrast-110
                    sepia-[.15]
                    opacity-95
                  "
                />
              </div>
            )}
          </div>

          {/* 底部标记 */}
          <div className="mt-12 text-right text-[10px] font-tech tracking-widest text-ink-400 dark:text-metal-500">
            END_OF_RECORD
          </div>
        </article>
      </div>
    </div>
  );
}


/* ---------- admin write ---------- */

function AdminWriteRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') return <Fatal404 />;

  return (
    <div className="h-screen w-full bg-paper dark:bg-void overflow-hidden flex flex-col">
      <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-concrete-300 dark:border-metal-800">
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 border border-concrete-300 dark:border-metal-700
                     text-ink-600 dark:text-metal-300
                     hover:border-safety-orange hover:text-safety-orange
                     transition-colors font-tech text-xs uppercase"
        >
          ← Back
        </button>

        <div className="font-tech text-xs tracking-[0.25em] text-ink-500 dark:text-metal-500">
          WRITE_SESSION
        </div>

        <div className="w-[72px]" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <AdminPostEditor />
      </div>
    </div>
  );
}

/* ---------- app ---------- */

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<TerminalShell />}>
          <Route index element={<FeedRoute />} />
          <Route path="c/:cat" element={<FeedRoute />} />
          <Route path="posts/:id" element={<PostRoute />} />
          <Route path="admin/write" element={<AdminWriteRoute />} />
          <Route path="*" element={<Fatal404 />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
