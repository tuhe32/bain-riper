import { modules } from '../modules.js';
import { logger } from './logger.js';

/**
 * Print post-install checklist for the given installed module IDs.
 */
export function printChecklist(installedIds) {
  const items = [];

  for (const id of installedIds) {
    const mod = modules.find(m => m.id === id);
    if (mod && mod.checklistItems.length > 0) {
      items.push(...mod.checklistItems);
    }
  }

  if (items.length === 0) {
    return;
  }

  logger.header('安装后须知');
  logger.plain('以下文件需要手动编辑后才能使用：\n');

  // Group by file
  const grouped = new Map();
  for (const item of items) {
    if (!grouped.has(item.file)) {
      grouped.set(item.file, []);
    }
    grouped.get(item.file).push(item);
  }

  for (const [file, fileItems] of grouped) {
    logger.plain(`[ ] ${file}`);
    for (const item of fileItems) {
      logger.plain(`    ${item.field} → ${item.action}`);
    }
    console.log();
  }

  // General suggestions
  logger.plain('─'.repeat(60));
  logger.plain('其他建议：');
  logger.plain('[ ] 创建 .qoder/repowiki/ 项目知识库');
  logger.plain('[ ] 安装 CodeGraph：npm install -g codegraph');
  console.log();
}
