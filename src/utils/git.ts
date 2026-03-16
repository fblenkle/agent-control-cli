import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export function isGitRepository(repoPath: string): boolean {
  return existsSync(join(repoPath, '.git'));
}

export function hasUncommittedChanges(repoPath: string): boolean {
  try {
    const status = execSync('git status --porcelain', { cwd: repoPath, encoding: 'utf8' });
    return status.trim().length > 0;
  } catch {
    return false;
  }
}
