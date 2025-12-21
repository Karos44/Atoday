export type Category = '全部' | '日常' | '吐槽' | '视觉' | '混沌';

export interface User {
  id: string;
  name: string;
  avatar: string;
  githubUrl?: string;
  role: 'ADMIN' | 'GUEST' | 'USER';
}

export interface MemoryRecord {
  id: string;
  serialNumber: string;
  date: string;
  category: Category;
  content: string;
  image?: string | null;
  mood?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  coverImage?: string;
}