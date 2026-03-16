import { readConfig } from '../utils/index.js';
import { loadRepoMeta } from '../analyzer.js';
import { installAgentFiles, registerSymlinks, removeAllSymlinks } from '../symlinks.js';

export async function cleanup(): Promise<void> {
  const config = readConfig();
  
  console.log('Removing all symlinks...');
  removeAllSymlinks();
  
  console.log('Recreating symlinks...');
  for (const agentConfig of config.agents) {
    const meta = loadRepoMeta(agentConfig.repo);
    if (!meta) continue;
    
    const agent = meta.agents.find(a => a.id === agentConfig.id);
    if (!agent) continue;
    
    const { symlinks } = installAgentFiles(agent, agentConfig.repo);
    registerSymlinks(agent.id, symlinks);
  }
  
  console.log('Cleanup complete');
}
