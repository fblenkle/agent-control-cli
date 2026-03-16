import { selectAgentInteractive } from '../utils/index.js';
import { installAgent } from '../commands/install.js';

export async function installAgentTool(): Promise<void> {
  const selection = await selectAgentInteractive('Select an agent to install:', true);
  if (!selection) return;
  
  await installAgent(selection.repo, selection.agentId);
}
