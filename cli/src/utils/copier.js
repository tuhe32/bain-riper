import fs from 'node:fs/promises';
import path from 'node:path';
import { getTemplatePath, getTargetPath } from '../modules.js';
import { logger } from './logger.js';

/**
 * Check if a file exists.
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy all files for a given module from templates/ to the target project.
 * @param {Object} mod - Module definition from modules.js
 * @param {Object} options - { force: boolean, cwd: string }
 * @returns {Promise<{ created: string[], skipped: string[], overwritten: string[], errors: {file: string, error: string}[] }>}
 */
export async function copyModule(mod, options = {}) {
  const { force = false, cwd = process.cwd() } = options;
  const results = { created: [], skipped: [], overwritten: [], errors: [] };

  for (const file of mod.files) {
    const srcPath = getTemplatePath(mod, file);
    const destPath = getTargetPath(mod, file, cwd);
    const relDest = path.join(mod.targetBase, file);

    try {
      const exists = await fileExists(destPath);

      if (exists && !force) {
        results.skipped.push(relDest);
        logger.skip(`${relDest} （已存在）`);
        continue;
      }

      // Create target directory
      await fs.mkdir(path.dirname(destPath), { recursive: true });

      // Copy file
      await fs.copyFile(srcPath, destPath);

      if (exists && force) {
        results.overwritten.push(relDest);
        logger.overwrite(relDest);
      } else {
        results.created.push(relDest);
        logger.success(relDest);
      }
    } catch (err) {
      results.errors.push({ file: relDest, error: err.message });
      logger.error(`${relDest}: ${err.message}`);
    }
  }

  // Create extra directories if defined (e.g., openspec/changes, openspec/specs)
  if (mod.extraDirs) {
    for (const dir of mod.extraDirs) {
      const dirPath = path.join(cwd, dir);
      await fs.mkdir(dirPath, { recursive: true });
      const gitkeepPath = path.join(dirPath, '.gitkeep');
      if (!(await fileExists(gitkeepPath))) {
        await fs.writeFile(gitkeepPath, '');
      }
      logger.info(`已创建目录：${dir}/`);
    }
  }

  return results;
}

/**
 * Print a summary of copy results.
 */
export function printSummary(results) {
  const total = results.created.length + results.skipped.length
              + results.overwritten.length + results.errors.length;

  logger.header('汇总');
  if (results.created.length) {
    logger.success(`已创建 ${results.created.length} 个文件`);
  }
  if (results.overwritten.length) {
    logger.info(`已覆盖 ${results.overwritten.length} 个文件`);
  }
  if (results.skipped.length) {
    logger.skip(`已跳过 ${results.skipped.length} 个文件（已存在，使用 --force 可覆盖）`);
  }
  if (results.errors.length) {
    logger.error(`失败 ${results.errors.length} 个文件`);
  }
  if (total === 0) {
    logger.info('未处理任何文件。');
  }
}
