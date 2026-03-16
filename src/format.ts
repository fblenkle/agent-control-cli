import { existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { REPOS_DIR } from './constants.js';

export function getRepoGitIndicator(repo: string): string {
  const repoPath = join(REPOS_DIR, repo);
  const isSymlink = lstatSync(repoPath).isSymbolicLink();
  const hasGit = existsSync(join(repoPath, '.git'));
  
  if (isSymlink || !hasGit) {
    return '\x1b[33m●\x1b[44m\x1b[37m'; // Orange dot, then restore background
  }
  return '\x1b[32m●\x1b[44m\x1b[37m'; // Green dot, then restore background
}

export function formatRepo(repo: string): string {
  const gitIndicator = getRepoGitIndicator(repo);
  return `\x1b[44m\x1b[37m ${repo} ${gitIndicator} \x1b[0m`;
}

export function formatAgentDisplay(name: string, repo: string, description?: string): string {
  const repoTag = formatRepo(repo);
  
  if (description) {
    return `${repoTag} ${name} - ${description}`;
  }
  return `${repoTag} ${name}`;
}
