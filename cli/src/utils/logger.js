const c = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
};

export const logger = {
  success(msg) { console.log(`  ${c.green('✓')} ${msg}`); },
  skip(msg)    { console.log(`  ${c.yellow('⊘')} ${c.dim(msg)}`); },
  error(msg)   { console.error(`  ${c.red('✗')} ${msg}`); },
  info(msg)    { console.log(`  ${c.cyan('ℹ')} ${msg}`); },
  header(msg)  { console.log(`\n${c.bold(msg)}\n`); },
  overwrite(m) { console.log(`  ${c.yellow('↻')} ${m} ${c.dim('（已覆盖）')}`); },
  plain(msg)   { console.log(`  ${msg}`); },
};
