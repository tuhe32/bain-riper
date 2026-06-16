import { checkbox } from '@inquirer/prompts';
import { modules } from '../modules.js';
import { copyModule, printSummary } from '../utils/copier.js';
import { printChecklist } from '../utils/checklist.js';
import { ensureOpenSpec } from '../utils/openspec.js';
import { logger } from '../utils/logger.js';

/**
 * Init command: interactive module selection or --all for full install.
 */
export async function initCommand(flags = {}) {
  let selectedIds;

  if (flags.all) {
    // Non-interactive: select all modules
    selectedIds = modules.map(m => m.id);
  } else {
    // Check if stdin is a TTY (interactive terminal)
    if (!process.stdin.isTTY) {
      logger.error('未检测到交互式终端，请使用 --all 参数全量安装。');
      logger.plain('示例：npx bain-riper-cli init --all');
      process.exit(1);
    }

    // Interactive: show checkbox selection
    logger.header('bain-riper CLI - 项目初始化');

    selectedIds = await checkbox({
      message: '选择要安装的模块（空格切换，回车确认）',
      choices: modules.map(mod => ({
        name: `${mod.name.padEnd(18)} - ${mod.description}`,
        value: mod.id,
        checked: false,
      })),
    });

    if (selectedIds.length === 0) {
      logger.info('未选择任何模块，已退出。');
      return;
    }
  }

  // Install selected modules
  const allResults = { created: [], skipped: [], overwritten: [], errors: [] };

  for (const id of selectedIds) {
    const mod = modules.find(m => m.id === id);
    logger.header(`正在安装：${mod.name}`);
    const results = await copyModule(mod, { force: flags.force });

    allResults.created.push(...results.created);
    allResults.skipped.push(...results.skipped);
    allResults.overwritten.push(...results.overwritten);
    allResults.errors.push(...results.errors);
  }

  printSummary(allResults);
  printChecklist(selectedIds);

  // 检查并初始化 OpenSpec
  await ensureOpenSpec({ skipOpenSpec: flags.skipOpenSpec });
}
