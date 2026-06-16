#!/usr/bin/env node

import { main } from '../src/index.js';

// Handle Ctrl+C gracefully
process.on('uncaughtException', (error) => {
  if (error?.name === 'ExitPromptError') {
    console.log('\n  已取消。\n');
    process.exit(0);
  }
  throw error;
});

main(process.argv.slice(2));
