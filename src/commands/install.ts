import { readConfig, writeConfig } from '../utils/index.js';
import { loadRepoMeta } from '../analyzer.js';
import { installAgentFiles, registerSymlinks, rollbackInstallation } from '../symlinks.js';

export async function installAgent(repo: string, agentId: string): Promise<void> {
  const config = readConfig();
  const meta = loadRepoMeta(repo);
  
  if (!meta) {
    console.error(`Repository ${repo} not found`);
    process.exit(1);
  }
  
  const agent = meta.agents.find(a => a.id === agentId);
  
  if (!agent) {
    console.error(`Agent ${agentId} not found in ${repo}`);
    process.exit(1);
  }
  
  if (config.agents.find(a => a.id === agent.id && a.repo === repo)) {
    console.error(`Error: Agent ${agent.name} (${agent.id}) is already installed`);
    process.exit(1);
  }
  
  try {
    const { symlinks } = installAgentFiles(agent, repo);
    
    config.agents.push({ id: agent.id, repo, name: agent.name });
    writeConfig(config);
    
    registerSymlinks(agent.id, symlinks);
    
    console.log(`Installed ${agent.name} (${agent.id}) from ${repo}`);
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    rollbackInstallation(agent.id, []);
    process.exit(1);
  }
}
