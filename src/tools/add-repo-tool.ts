import { existsSync } from 'fs';
import { getRepoPath } from '../utils/index.js';
import { addRepo } from '../commands/add-repo.js';

export async function addRepoTool(): Promise<void> {
  const { input } = await import('@inquirer/prompts');
  
  const repoUrl = await input({
    message: 'Enter repository URL or local path:',
    validate: (value) => value.trim().length > 0 || 'URL or path is required'
  });
  
  const repoName = await input({
    message: 'Enter repository name:',
    validate: (value) => {
      if (value.trim().length === 0) return 'Name is required';
      const repoPath = getRepoPath(value);
      if (existsSync(repoPath)) return 'Repository with this name already exists';
      return true;
    }
  });
  
  await addRepo(repoUrl, repoName);
}
