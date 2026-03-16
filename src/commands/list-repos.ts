import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { REPOS_DIR } from '../constants.js';
import { loadRepoMeta } from '../analyzer.js';

export async function listRepos(): Promise<void> {
  if (!existsSync(REPOS_DIR)) {
    console.log('\nNo repositories found\n');
    return;
  }
  
  const entries = readdirSync(REPOS_DIR);
  const repos = entries.filter(entry => {
    const fullPath = join(REPOS_DIR, entry);
    return statSync(fullPath).isDirectory();
  });
  
  if (repos.length === 0) {
    console.log('\nNo repositories found\n');
    return;
  }
  
  console.log('\nRepositories:\n');
  for (const repo of repos) {
    const meta = loadRepoMeta(repo);
    const agentCount = meta?.agents.length || 0;
    console.log(`  ${repo} - ${agentCount} agent${agentCount !== 1 ? 's' : ''}`);
  }
  console.log();
}
