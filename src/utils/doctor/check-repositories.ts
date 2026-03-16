import { existsSync, readdirSync, statSync, lstatSync, readlinkSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { REPOS_DIR } from '../../constants.js';
import type { DiagnosticResult } from './types.js';

export function checkRepositories(): DiagnosticResult {
  console.log('\nChecking repositories...');
  
  let issues = 0;
  const fixes: Array<() => void> = [];
  
  if (!existsSync(REPOS_DIR)) {
    return { issues, fixes };
  }
  
  const entries = readdirSync(REPOS_DIR);
  const repos = entries.filter(entry => {
    const fullPath = join(REPOS_DIR, entry);
    try {
      return statSync(fullPath).isDirectory();
    } catch {
      return false;
    }
  });
  
  for (const repo of repos) {
    const repoPath = join(REPOS_DIR, repo);
    
    try {
      const isSymlink = lstatSync(repoPath).isSymbolicLink();
      
      if (isSymlink) {
        try {
          const target = readlinkSync(repoPath);
          if (!existsSync(target)) {
            console.log(`  ⚠️  Repository '${repo}' is a broken symlink (target: ${target})`);
            issues++;
            fixes.push(() => {
              unlinkSync(repoPath);
              console.log(`  ✓ Removed broken symlink '${repo}'`);
            });
          } else {
            console.log(`  ✓ Repository '${repo}' (symlink)`);
          }
        } catch {
          console.log(`  ⚠️  Repository '${repo}' symlink is corrupted`);
          issues++;
          fixes.push(() => {
            unlinkSync(repoPath);
            console.log(`  ✓ Removed corrupted symlink '${repo}'`);
          });
        }
      } else {
        const hasGit = existsSync(join(repoPath, '.git'));
        if (hasGit) {
          try {
            execSync('git status', { cwd: repoPath, stdio: 'ignore' });
            console.log(`  ✓ Repository '${repo}' (git)`);
          } catch {
            console.log(`  ⚠️  Repository '${repo}' has corrupted git state`);
            issues++;
          }
        } else {
          console.log(`  ⚠️  Repository '${repo}' has no git support`);
        }
      }
    } catch (err) {
      console.log(`  ⚠️  Repository '${repo}' is inaccessible`);
      issues++;
    }
  }
  
  return { issues, fixes };
}
