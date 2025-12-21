import React, { useMemo, useState } from 'react';
import { MemoryRecord, Category } from '../types';
import { useAuth } from '../context/AuthContext';

const GITHUB_OWNER = 'Karos44';
const GITHUB_REPO = 'Atoday';
const POSTS_PATH = 'data/posts.json';


function buildGitHubEditUrl(newPost: MemoryRecord) {
  const base = `https://github.com/Karos44/Atoday/edit/main/data/posts.json`;

  // 生成要插入的 JSON 片段（给你复制用）
  const snippet = JSON.stringify(newPost, null, 2);

  // GitHub 编辑页支持 #L 行号，但不能自动插入文本
  // 我们把内容放到剪贴板 + 给你明确提示
  return { url: base, snippet };
}

export function AdminEditor() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [form, setForm] = useState<Omit<MemoryRecord, 'id'>>({
    serialNumber: '',
    date: new Date().toISOString().slice(0, 10),
    category: '日常',
    mood: '平静',
    content: '',
    image: null,
  });

  const nextId = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6)}`;
  }, []);

  if (!isAdmin) return null;

  const handlePublish = async () => {
    const newPost: MemoryRecord = {
      id: nextId,
      ...form,
    };

    const { url, snippet } = buildGitHubEditUrl(newPost);

    try {
      await navigator.clipboard.writeText(`,\n${snippet}`);
      alert(
        '新文章 JSON 已复制到剪贴板。\n\n下一步：\n1. 页面将打开 GitHub 编辑页\n2. 粘贴到数组最后（注意逗号）\n3. Commit 即可上线'
      );
    } catch {
      alert('无法自动复制，请手动复制控制台内容。');
      console.log(snippet);
    }

    window.open(url, '_blank');
  };

  return (
    <div className="p-6 border border-concrete-300 dark:border-metal-700 bg-concrete-50 dark:bg-metal-900">
      <h2 className="font-tech text-lg mb-4">ADMIN · 新建文章</h2>

      <div className="grid gap-3">
        <input
          placeholder="Serial Number（如 AT-002）"
          value={form.serialNumber}
          onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
        >
          <option value="日常">日常</option>
          <option value="吐槽">吐槽</option>
          <option value="视觉">视觉</option>
          <option value="混沌">混沌</option>
        </select>

        <input
          placeholder="Mood"
          value={form.mood}
          onChange={(e) => setForm({ ...form, mood: e.target.value })}
        />

        <textarea
          rows={8}
          placeholder="正文内容"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <button
          onClick={handlePublish}
          className="mt-4 px-4 py-2 border border-safety-orange text-safety-orange hover:bg-safety-orange hover:text-black transition-colors"
        >
          发布到 GitHub
        </button>
      </div>
    </div>
  );
}
