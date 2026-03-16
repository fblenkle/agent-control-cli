import { existsSync, readdirSync, statSync, symlinkSync, unlinkSync } from 'fs';
import { join } from 'path';

export function findJsonFiles(dir: string): string[] {
  const results: string[] = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...findJsonFiles(fullPath));
    } else if (item.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

export function createSymlink(target: string, link: string): void {
  if (existsSync(link)) {
    throw new Error(`Symlink ${link} already exists`);
  }
  symlinkSync(target, link);
}

export function removeSymlink(link: string): void {
  if (existsSync(link)) unlinkSync(link);
}
