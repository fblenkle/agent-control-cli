export interface AgentConfig {
  id: string;
  repo: string;
  name: string;
}

export interface Config {
  agents: AgentConfig[];
  symlinks: Record<string, string[]>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  files: string[];
}

export interface RepoMeta {
  agents: Agent[];
  lastUpdated?: string;
}

export interface AgentJson {
  id?: string;
  name?: string;
  description?: string;
  prompt?: string;
  resources?: string[];
}
