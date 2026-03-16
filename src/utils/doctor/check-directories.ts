import { existsSync } from 'fs';
import { REPOS_DIR, KIRO_AGENTS_DIR, AGENTS_DIR } from '../../constants.js';
import { ensureDirectories } from '../index.js';
import type { DiagnosticResult } from './types.js';

export function checkDirectories(): DiagnosticResult {
  console.log('Checking directories...');
  
  let issues = 0;
  const fixes: Array<() => void> = [];
  
  if (!existsSync(REPOS_DIR)) {
    console.log('  ⚠️  Repositories directory missing');
    issues++;
    fixes.push(() => {
      ensureDirectories();
      console.log('  ✓ Created repositories directory');
    });
  } else {
    console.log('  ✓ Repositories directory exists');
  }
  
  if (!existsSync(KIRO_AGENTS_DIR)) {
    console.log('  ⚠️  Kiro agents directory missing');
    issues++;
    fixes.push(() => {
      ensureDirectories();
      console.log('  ✓ Created Kiro agents directory');
    });
  } else {
    console.log('  ✓ Kiro agents directory exists');
  }
  
  if (!existsSync(AGENTS_DIR)) {
    console.log('  ⚠️  Agents directory missing');
    issues++;
    fixes.push(() => {
      ensureDirectories();
      console.log('  ✓ Created agents directory');
    });
  } else {
    console.log('  ✓ Agents directory exists');
  }
  
  return { issues, fixes };
}
