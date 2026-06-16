import fs from 'node:fs/promises';
import path from 'node:path';
import { modules, getTargetPath } from '../modules.js';
import { logger } from '../utils/logger.js';

/**
 * List command: show installation status of all modules.
 */
export async function listCommand() {
  const cwd = process.cwd();

  logger.header('bain-riper 模块状态');

  for (const mod of modules) {
    let present = 0;
    const missing = [];

    for (const file of mod.files) {
      const filePath = getTargetPath(mod, file, cwd);
      try {
        await fs.access(filePath);
        present++;
      } catch {
        missing.push(file);
      }
    }

    const total = mod.files.length;
    const ratio = present / total;

    if (ratio === 1) {
      logger.success(`${mod.id.padEnd(18)} [已安装]   ${present}/${total} 个文件就位`);
    } else if (ratio > 0) {
      logger.plain(`  ◐ ${mod.id.padEnd(16)} [部分安装] ${present}/${total} 个文件就位`);
      for (const f of missing) {
        logger.plain(`      缺失：${path.join(mod.targetBase, f)}`);
      }
    } else {
      logger.skip(`${mod.id.padEnd(18)} [未安装]`);
    }
  }

  console.log();
}
