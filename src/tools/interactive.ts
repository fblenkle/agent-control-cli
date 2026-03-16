import { addRepoTool } from './add-repo-tool.js';
import { listReposTool } from './list-repos-tool.js';
import { listAvailableAgentsTool } from './list-available-tool.js';
import { update } from '../commands/update.js';
import { cleanup } from '../commands/cleanup.js';
import { doctor } from '../commands/doctor.js';
import { listInstalledAgentsTool } from './list-tool.js';

export async function interactive(): Promise<void> {
  const { select } = await import('@inquirer/prompts');
  
  while (true) {
    console.log('\n');
    
    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { name: '🔄  Update repositories', value: 'update' },
        { name: '🔍  Browse available agents', value: 'list-available' },
        { name: '📦  Manage installed agents', value: 'list-installed' },
        { name: '📚  Manage repositories', value: 'list-repos' },
        { name: '🩺  Doctor (diagnose & fix)', value: 'doctor' },
        { name: '🧹  Cleanup symlinks', value: 'cleanup' },
        { name: '👋  Exit', value: 'exit' }
      ]
    });
    
    if (action === 'exit') {
      console.log('\nGoodbye!\n');
      break;
    }
    
    try {
      switch (action) {
        case 'update':
          await update();
          break;
        case 'list-available':
          await listAvailableAgentsTool();
          break;
        case 'list-installed':
          await listInstalledAgentsTool();
          break;
        case 'list-repos':
          await listReposTool();
          break;
        case 'doctor':
          await doctor();
          break;
        case 'cleanup':
          await cleanup();
          break;
      }
    } catch (err) {
      if ((err as any).name === 'ExitPromptError') {
        console.log('\nGoodbye!\n');
        break;
      }
      console.error('Error:', (err as Error).message);
    }
  }
}
