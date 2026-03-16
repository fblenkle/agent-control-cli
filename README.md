# agent-manager

CLI tool to manage agent repositories.

## Installation

```bash
npm install
npm run build
npm install -g .
```

## Development

```bash
npm run dev  # Watch mode
```

## Usage

### Interactive Mode

Simply run without arguments to start interactive mode:
```bash
agent-manager
```

This provides a menu with options to:
- Update repositories
- Browse available agents (with install option)
- List installed agents
- Cleanup symlinks
- Add repository
- Exit

### Direct Commands

```bash
# Repository Management
agent-manager add-repo <url> <name>      # Add a repository
agent-manager remove-repo <name>         # Remove a repository
agent-manager list-repos                 # List all repositories

# Agent Management
agent-manager list                       # List installed agents
agent-manager list-available <repo>      # List available agents
agent-manager info <repo> <agent-id>     # Show agent information
agent-manager install <repo> <agent-id>  # Install an agent
agent-manager uninstall <repo> <agent-id> # Uninstall an agent

# Maintenance
agent-manager cleanup                    # Cleanup and recreate symlinks
agent-manager update                     # Update all repositories
agent-manager doctor                     # Diagnose and fix issues
```

## Project Structure

```
src/
├── cli.ts              # CLI entry point
├── commands/           # Command implementations
│   ├── add-repo.ts
│   ├── install.ts
│   ├── uninstall.ts
│   ├── list.ts
│   ├── list-available.ts
│   ├── info.ts
│   ├── cleanup.ts
│   ├── update.ts
│   ├── interactive.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── config.ts       # Config management
│   ├── filesystem.ts   # File operations
│   ├── markdown.ts     # Markdown parsing
│   ├── paths.ts        # Path utilities
│   ├── hash.ts         # Hashing utilities
│   ├── git.ts          # Git operations
│   ├── interactive.ts  # Interactive prompts
│   └── index.ts
├── analyzer.ts         # Repository and agent analysis
├── symlinks.ts         # Symlink management
├── format.ts           # Output formatting
├── constants.ts        # Configuration constants
└── types.ts            # TypeScript types
```

## Configuration

Configuration is stored in `~/.agent-manager/config.json`.
Repositories are cloned to `~/.agent-manager/repos/`.
Agent files are copied to `~/.agent-manager/agents/`.
Symlinks are created in `~/.kiro/agents/`.
