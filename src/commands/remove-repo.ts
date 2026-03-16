import { existsSync, rmSync } from 'fs';
import { getRepoPath, readConfig } from '../utils/index.js';

export async function removeRepo(name: string): Promise<void> {
  const repoPath = getRepoPath(name);
  
  if (!existsSync(repoPath)) {
    console.error(`Repository ${name} not found`);
    process.exit(1);
  }
  
  const config = readConfig();
  const installedAgents = config.agents.filter(a => a.repo === name);
  
  if (installedAgents.length > 0) {
    console.error(`Cannot remove repository ${name}: ${installedAgents.length} agent${installedAgents.length !== 1 ? 's are' : ' is'} still installed`);
    console.error('\nInstalled agents:');
    for (const agent of installedAgents) {
      console.error(`  - ${agent.name} (${agent.id})`);
    }
    console.error('\nUninstall all agents first.');
    process.exit(1);
  }
  
  rmSync(repoPath, { recursive: true, force: true });
  console.log(`Removed repository ${name}`);
}
