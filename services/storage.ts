import { BlogPost } from '../types';

const STORAGE_KEY = 'lumina_blog_posts_v1';

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to Lumina',
    content: "## A New Way to Blog\n\nLumina isn't just a static site. It's an **AI-powered knowledge base**.\n\n### Features:\n- **AI Summarization**: Automatically generate summaries for your posts.\n- **Smart Editing**: Fix grammar and expand ideas with one click.\n- **Ask Your Blog**: Use the chat feature to ask questions about your own content.\n\nEnjoy the future of personal blogging.",
    summary: 'Introduction to the Lumina platform and its AI capabilities.',
    tags: ['Welcome', 'Guide'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    coverImage: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    title: 'The Future of TypeScript',
    content: "TypeScript has evolved significantly. With features like **Satisfies** and better inference, it makes frontend development safer and faster.\n\nWe should always prioritize types over `any`. It ensures maintainability in the long run.",
    summary: 'A quick look at modern TypeScript features and best practices.',
    tags: ['Tech', 'TypeScript'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    coverImage: 'https://picsum.photos/800/401'
  }
];

export const getPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  return JSON.parse(stored);
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const getPostById = (id: string): BlogPost | undefined => {
  return getPosts().find(p => p.id === id);
};