import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export function extractMarkdownLinks(mdPath: string, visited = new Set<string>()): string[] {
  if (visited.has(mdPath) || !existsSync(mdPath)) return [];
  visited.add(mdPath);
  
  const content = readFileSync(mdPath, 'utf8');
  const links: string[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const link = match[2];
    if (!link.startsWith('http')) {
      const linkedPath = join(mdPath, '..', link);
      if (existsSync(linkedPath)) {
        links.push(linkedPath);
        if (linkedPath.endsWith('.md')) {
          links.push(...extractMarkdownLinks(linkedPath, visited));
        }
      }
    }
  }
  
  return links;
}
