import React, { useMemo, useState } from 'react';
import { MemoryRecord, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import posts from '../data/posts.json';
console.log('🔥🔥🔥 AdminPostEditor FILE LOADED');


/** === GitHub 发布目标 === */
const GITHUB_OWNER = 'Karos44';
const GITHUB_REPO = 'Atoday';
const POSTS_PATH = 'data/posts.json';

const EDIT_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/edit/main/${POSTS_PATH}`;

const CATEGORIES: Category[] = ['日常', '吐槽', '视觉', '混沌'];

/** 生成 AT-YYMMDD（展示编号） */
function generateNextSerial(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `AT-${yy}${mm}${dd}`;
}

/** 从现有 posts.json 生成下一个数字 ID */
function generateNumericId(existing: { id: number }[]): number {
  if (!existing.length) return 1;
  return Math.max(...existing.map(p => p.id)) + 1;
}

export function AdminPostEditor() {
  console.log('🔥🔥🔥 AdminPostEditor COMPONENT EXECUTED');

  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('日常');
  const [mood, setMood] = useState('稳定');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const previewImage = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  const serialNumber = useMemo(generateNextSerial, []);
  const date = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const id = useMemo(
    () => generateNumericId(posts as { id: number }[]),
    []
  );

  const handlePublish = async () => {
    const imagePath = imageFile
      ? `/images/${imageFile.name}`
      : null;

    const post: MemoryRecord = {
      id,               // ✅ number
      serialNumber,
      date,
      title,            // ✅ 独立字段
      category,
      mood,
      content,          // ✅ 不再拼 title
      image: imagePath,
    };

    const jsonSnippet = JSON.stringify(post, null, 2);

    try {
      await navigator.clipboard.writeText(`,\n${jsonSnippet}`);
      alert(
        '文章数据已复制到剪贴板。\n\n下一步：\n1. 页面将打开 GitHub 编辑器\n2. 将内容粘贴到数组最后\n3. 提交 Commit 即可发布'
      );
    } catch {
      alert('复制失败，请手动从控制台复制。');
      console.log(jsonSnippet);
    }

    window.open(EDIT_URL, '_blank');
  };

  return (
    <div
      className="
        mt-6
        border border-safety-orange/60
        bg-black/40 dark:bg-black/60
        shadow-[0_0_30px_rgba(255,170,0,0.2)]
      "
    >
      {/* Header */}
      <div
        className="
          px-4 py-2
          border-b border-safety-orange/40
          text-safety-orange
          font-tech
          text-xs
          tracking-[0.4em]
          uppercase
          bg-gradient-to-r
          from-black
          to-safety-orange/10
        "
      >
        WRITE_SESSION
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-4 text-xs font-mono">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-ink-400 dark:text-metal-600">
            SERIAL<br />
            <span className="text-safety-orange">{serialNumber}</span>
          </div>
          <div className="text-ink-400 dark:text-metal-600">
            DATE<br />
            <span className="text-safety-orange">{date}</span>
          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          className="
            bg-black
            border border-concrete-300
            dark:border-metal-700
            text-safety-orange
            px-3 py-2
            outline-none
          "
        />

        {/* Category / Mood */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="bg-black border border-concrete-300 dark:border-metal-700 text-safety-orange px-2 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="状态 / 情绪"
            className="bg-black border border-concrete-300 dark:border-metal-700 text-safety-orange px-3 py-2"
          />
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在此输入正文内容……"
          rows={10}
          className="
            bg-black
            border border-concrete-300
            dark:border-metal-700
            text-ink-100
            px-3 py-2
            outline-none
            leading-relaxed
          "
        />

        {/* Image */}
        <div className="flex flex-col gap-2">
          <label className="text-ink-400 dark:text-metal-600">
            附加图像（Git 模式）
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="max-h-48 border border-concrete-300 dark:border-metal-700"
            />
          )}

          {imageFile && (
            <div className="text-[10px] text-ink-400 dark:text-metal-600">
              请将该图片放入：<br />
              <span className="text-safety-orange">
                /public/images/{imageFile.name}
              </span>
            </div>
          )}
        </div>

        {/* Publish */}
        <button
          onClick={handlePublish}
          className="
            mt-2
            px-4 py-2
            border border-safety-orange
            text-safety-orange
            font-tech
            tracking-widest
            uppercase
            bg-black
            hover:bg-safety-orange
            hover:text-black
            transition-colors
          "
        >
          &gt; PUBLISH_RECORD
        </button>
      </div>
    </div>
  );
}
