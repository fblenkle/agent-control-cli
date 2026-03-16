import { execSync } from 'child_process';
import { readdirSync, lstatSync } from 'fs';
import { ensureDirectories, getRepoPath, isGitRepository, hasUncommittedChanges } from '../utils/index.js';
import { analyzeRepository } from '../analyzer.js';
import { cleanup } from './cleanup.js';
import { REPOS_DIR } from '../constants.js';

export async function update(): Promise<void> {
  ensureDirectories();
  
  const repos = readdirSync(REPOS_DIR).filter(f => {
    const fullPath = getRepoPath(f);
    const stat = lstatSync(fullPath);
    return stat.isDirectory() || stat.isSymbolicLink();
  });
  
  // Check for uncommitted changes first
  for (const repo of repos) {
    const repoPath = getRepoPath(repo);
    if (isGitRepository(repoPath) && hasUncommittedChanges(repoPath)) {
      console.error(`Error: Repository ${repo} has uncommitted changes. Please commit or stash them first.`);
      process.exit(1);
    }
  }
  
  // Update repositories
  for (const repo of repos) {
    const repoPath = getRepoPath(repo);
    
    if (isGitRepository(repoPath)) {
      console.log(`Updating ${repo}...`);
      execSync('git pull', { cwd: repoPath, stdio: 'inherit' });
    } else {
      console.log(`Skipping ${repo} (not a git repository)...`);
    }
    
    console.log(`Analyzing ${repo}...`);
    analyzeRepository(repo, repoPath);
  }
  
  await cleanup();
  console.log('Update complete');
}
