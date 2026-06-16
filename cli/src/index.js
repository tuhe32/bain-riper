import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HELP_TEXT = `
  bain-riper-cli - 将 AI 工程化资产脚手架化到你的项目

  用法：
    bain-riper-cli init [--all] [--force] [--skip-openspec]   交互式选择模块（--all 全量安装）
    bain-riper-cli add <module> [--force]                     安装指定模块
    bain-riper-cli list                                       查看模块安装状态

  模块：
    rules             7 个 AI 规则文件（宪法 / Preflight / Task Tiers 等）
    skills            需求拆分 Skill（requirement-breakdown）
    mcp               CodeGraph MCP 配置（mcp.json）
    openspec          OpenSpec 工作流配置 + 项目 Profile
    reference-code    Java CRUD 参考模板（EmployeeTraining 八层示例）

  参数：
    --all             非交互模式，安装全部模块
    --force           覆盖已存在的文件
    --skip-openspec   跳过 OpenSpec 自动检测和初始化

  示例：
    npx bain-riper-cli init                          # 交互式选择
    npx bain-riper-cli init --all                    # 全量安装
    npx bain-riper-cli init --all --skip-openspec    # 全量安装，跳过 OpenSpec
    npx bain-riper-cli add rules                     # 只安装规则
    npx bain-riper-cli list                          # 查看安装状态
`;

export async function main(args) {
  const command = args[0];
  const flags = {
    all: args.includes('--all'),
    force: args.includes('--force'),
    skipOpenSpec: args.includes('--skip-openspec'),
  };

  switch (command) {
    case 'init':
      await initCommand(flags);
      break;

    case 'add': {
      const moduleId = args[1];
      if (!moduleId || moduleId.startsWith('--')) {
        console.error('\n  错误：缺少模块名称。');
        console.error('  用法：bain-riper-cli add <module>');
        console.error('  可用模块：rules, skills, mcp, openspec, reference-code\n');
        process.exit(1);
      }
      await addCommand(moduleId, flags);
      break;
    }

    case 'list':
      await listCommand();
      break;

    case '--help':
    case '-h':
    case 'help':
      console.log(HELP_TEXT);
      break;

    case '--version':
    case '-v': {
      const pkgPath = path.resolve(__dirname, '..', 'package.json');
      const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
      console.log(`bain-riper-cli v${pkg.version}`);
      break;
    }

    default:
      if (command) {
        console.error(`\n  未知命令：${command}\n`);
      }
      console.log(HELP_TEXT);
      process.exit(command ? 1 : 0);
  }
}
