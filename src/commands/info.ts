import { loadRepoMeta } from '../analyzer.js';
import { readConfig } from '../utils/index.js';

export async function showAgentInfo(repo: string, agentId: string): Promise<void> {
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
  
  const config = readConfig();
  const isInstalled = config.agents.some(a => a.id === agentId && a.repo === repo);
  
  console.log(`\nAgent Information:\n`);
  console.log(`  ID: ${agent.id}`);
  console.log(`  Name: ${agent.name}`);
  console.log(`  Repository: ${repo}`);
  console.log(`  Description: ${agent.description}`);
  console.log(`  Status: ${isInstalled ? '\x1b[32mInstalled\x1b[0m' : '\x1b[33mNot installed\x1b[0m'}`);
  console.log(`\n  Files (${agent.files.length}):`);
  for (const file of agent.files) {
    console.log(`    - ${file}`);
  }
  console.log();
}
