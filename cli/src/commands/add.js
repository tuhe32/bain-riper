import { getModuleById, modules } from '../modules.js';
import { copyModule, printSummary } from '../utils/copier.js';
import { printChecklist } from '../utils/checklist.js';
import { logger } from '../utils/logger.js';

/**
 * Add a specific module by ID.
 */
export async function addCommand(moduleId, flags = {}) {
  const mod = getModuleById(moduleId);

  if (!mod) {
    logger.error(`未知模块：${moduleId}`);
    console.log();
    logger.plain('可用模块：');
    for (const m of modules) {
      logger.plain(`  ${m.id.padEnd(18)} ${m.description}`);
    }
    console.log();
    process.exit(1);
  }

  logger.header(`正在安装：${mod.name}`);

  const results = await copyModule(mod, { force: flags.force });
  printSummary(results);
  printChecklist([mod.id]);
}
