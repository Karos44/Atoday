import rawPosts from './posts.json';
import { MemoryRecord } from '../types';

const POSTS: MemoryRecord[] = rawPosts as MemoryRecord[];

export function getAllRecords(): MemoryRecord[] {
  return POSTS;
}

export function getRecordById(id: number): MemoryRecord | null {
  return POSTS.find(p => p.id === id) ?? null;
}
