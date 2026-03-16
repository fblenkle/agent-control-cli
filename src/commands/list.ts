import { readConfig } from '../utils/index.js';
import { formatAgentDisplay } from '../format.js';

export async function listInstalledAgents(): Promise<void> {
  const config = readConfig();
  
  if (config.agents.length === 0) {
    console.log('\nNo agents installed\n');
    return;
  }
  
  console.log(`\nInstalled agents:\n`);
  for (const agent of config.agents) {
    console.log(`  ${agent.id} - ${formatAgentDisplay(agent.name, agent.repo)}`);
  }
  console.log();
}
