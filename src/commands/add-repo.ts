import { execSync } from 'child_process';
import { existsSync, symlinkSync } from 'fs';
import { ensureDirectories, getRepoPath } from '../utils/index.js';
import { analyzeRepository } from '../analyzer.js';

export async function addRepo(url: string, name: string): Promise<void> {
  ensureDirectories();
  const repoPath = getRepoPath(name);
  
  if (existsSync(url)) {
    console.log(`Linking local path ${url} to ${repoPath}...`);
    symlinkSync(url, repoPath);
  } else {
    console.log(`Cloning ${url} to ${repoPath}...`);
    execSync(`git clone ${url} ${repoPath}`, { stdio: 'inherit' });
  }
  
  console.log('Analyzing agents...');
  analyzeRepository(name, repoPath);
}
