import rawPosts from './posts.json';
import { MemoryRecord } from '../types';

// 明确告诉 TS：这是文章数组
const POSTS: MemoryRecord[] = rawPosts as MemoryRecord[];

export function getAllRecords(): MemoryRecord[] {
  return POSTS;
}

export function getRecordById(id: string): MemoryRecord | null {
  return POSTS.find(p => p.id === id) ?? null;
}
