import { createHash } from 'crypto';

export function hashPath(path: string): string {
  return createHash('sha256').update(path).digest('hex').substring(0, 16);
}
