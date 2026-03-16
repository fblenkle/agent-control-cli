import { readdirSync, existsSync, statSync, lstatSync } from 'fs';
import { join } from 'path';
import { REPOS_DIR } from '../constants.js';
import { loadRepoMeta } from '../analyzer.js';
import { readConfig } from '../utils/index.js';
import { formatAgentDisplay } from '../format.js';
import { showAgentInfoTool } from './info-tool.js';

export async function listAvailableAgentsTool(): Promise<void> {
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
  
  // Collect all agents from all repos with git support info
  const config = readConfig();
  const allAgents: Array<{ 
    repo: string; 
    agentId: string; 
    name: string; 
    description: string; 
    installed: boolean;
    gitSupport: string;
  }> = [];
  
  for (const repo of repos) {
    const meta = loadRepoMeta(repo);
    if (!meta) continue;
    
    const repoPath = join(REPOS_DIR, repo);
    const isSymlink = lstatSync(repoPath).isSymbolicLink();
    const hasGit = existsSync(join(repoPath, '.git'));
    
    let gitSupport = '\x1b[33m○\x1b[0m'; // Orange for no git
    if (isSymlink) {
      gitSupport = '\x1b[33m○\x1b[0m'; // Orange for symlink
    } else if (hasGit) {
      gitSupport = '\x1b[32m●\x1b[0m'; // Green for git
    }
    
    for (const agent of meta.agents) {
      const installed = config.agents.some(a => a.id === agent.id && a.repo === repo);
      allAgents.push({
        repo,
        agentId: agent.id,
        name: agent.name,
        description: agent.description,
        installed,
        gitSupport
      });
    }
  }
  
  if (allAgents.length === 0) {
    console.log('\nNo agents found\n');
    return;
  }
  
  const { search } = await import('@inquirer/prompts');
  
  const selected = await search({
    message: 'Search for an agent (type to filter, use arrow keys):',
    source: async (input) => {
      const filtered = input 
        ? allAgents.filter(a => 
            a.name.toLowerCase().includes(input.toLowerCase()) ||
            a.description.toLowerCase().includes(input.toLowerCase()) ||
            a.repo.toLowerCase().includes(input.toLowerCase())
          )
        : allAgents;
      
      const choices = filtered.map(a => ({
        name: `${formatAgentDisplay(a.name, a.repo)} ${a.installed ? '\x1b[32m✓\x1b[0m' : ''}`,
        value: `${a.repo}:${a.agentId}`,
        description: a.description
      }));
      
      choices.push({
        name: '← Back',
        value: 'back',
        description: 'Return to main menu'
      });
      
      return choices;
    }
  });
  
  if (selected === 'back') return;
  
  const [repo, agentId] = selected.split(':');
  await showAgentInfoTool(repo, agentId);
}
