import { execSync, spawnSync } from 'node:child_process';
import { logger } from './logger.js';

/**
 * 检查命令是否已安装
 */
function isCommandInstalled(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    try {
      // Windows 兼容
      execSync(`where ${cmd}`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * 确保 OpenSpec CLI 已安装并在当前项目中初始化。
 * @param {Object} options - { skipOpenSpec: boolean }
 */
export async function ensureOpenSpec(options = {}) {
  if (options.skipOpenSpec) {
    return;
  }

  logger.header('OpenSpec 检查');

  const installed = isCommandInstalled('openspec');

  if (!installed) {
    logger.info('未检测到 OpenSpec CLI，正在全局安装 @openspec/cli ...');
    try {
      execSync('npm install -g @openspec/cli', { stdio: 'inherit' });
      logger.success('OpenSpec CLI 安装成功');
    } catch (err) {
      logger.error(`OpenSpec CLI 安装失败：${err.message}`);
      logger.plain('请手动执行：npm install -g @openspec/cli');
      return;
    }
  } else {
    // 获取已安装版本
    try {
      const version = execSync('openspec --version', { encoding: 'utf-8' }).trim();
      logger.success(`OpenSpec CLI 已安装（${version}）`);
    } catch {
      logger.success('OpenSpec CLI 已安装');
    }
  }

  // 在当前项目中初始化 openspec（需要交互式终端）
  logger.info('正在当前项目中执行 openspec init ...');
  const result = spawnSync('openspec', ['init'], {
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    logger.error('openspec init 执行失败，请手动执行：openspec init');
  } else {
    logger.success('OpenSpec 项目初始化完成');
  }
}
