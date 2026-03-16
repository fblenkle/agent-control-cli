import { loadRepoMeta } from '../analyzer.js';
import { formatAgentDisplay } from '../format.js';

export async function listAvailableAgents(repo: string): Promise<void> {
  const meta = loadRepoMeta(repo);
  
  if (!meta) {
    console.error(`Repository ${repo} not found`);
    process.exit(1);
  }
  
  console.log(`\nAgents in ${repo}:\n`);
  for (const agent of meta.agents) {
    console.log(`  ${agent.id} - ${formatAgentDisplay(agent.name, repo)}`);
    console.log(`    ${agent.description}\n`);
  }
}
