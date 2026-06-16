import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

export const modules = [
  {
    id: 'rules',
    name: 'Rules',
    description: '7 个 AI 规则文件（宪法 / Preflight / Task Tiers 等）',
    templateBase: 'qoder/rules',
    targetBase: '.qoder/rules',
    files: [
      'project_constitution.md',
      'openspec_preflight.md',
      'openspec_task_tiers.md',
      'openspec_specifications.md',
      'openspec_codegraph.md',
      'openspec_output_specs.md',
      'openspec_reverse_sync.md',
    ],
    checklistItems: [],
  },
  {
    id: 'skills',
    name: 'Skills',
    description: '需求拆分 Skill（requirement-breakdown）',
    templateBase: 'qoder/skills',
    targetBase: '.qoder/skills',
    files: [
      'requirement-breakdown/SKILL.md',
    ],
    checklistItems: [],
  },
  {
    id: 'mcp',
    name: 'MCP',
    description: 'CodeGraph MCP 配置（mcp.json）',
    templateBase: 'qoder',
    targetBase: '.qoder',
    files: [
      'mcp.json',
    ],
    checklistItems: [
      {
        file: '.qoder/mcp.json',
        field: 'args -p 参数',
        action: '将 "/path/to/your-java-project" 替换为你的项目绝对路径',
      },
    ],
  },
  {
    id: 'openspec',
    name: 'OpenSpec',
    description: 'OpenSpec 工作流配置 + 项目 Profile',
    templateBase: 'openspec',
    targetBase: 'openspec',
    files: [
      'config.yaml',
      'project-profile.md',
    ],
    checklistItems: [
      {
        file: 'openspec/project-profile.md',
        field: '§1 技术栈',
        action: '替换为你的项目技术栈（语言版本、框架、ORM、构建工具等）',
      },
      {
        file: 'openspec/project-profile.md',
        field: '§2 项目骨架',
        action: '替换 Maven groupId、基础包路径、Mapper XML 路径、构建命令等',
      },
      {
        file: 'openspec/project-profile.md',
        field: '§3 标准分层',
        action: '根据你的项目结构调整分层目录',
      },
      {
        file: 'openspec/project-profile.md',
        field: '§4 领域约定',
        action: '替换基类名称、注解名称、多租户字段名等',
      },
      {
        file: 'openspec/project-profile.md',
        field: '§5 参考模板',
        action: '替换为你自己项目中的 CRUD 参考文件清单',
      },
      {
        file: 'openspec/project-profile.md',
        field: '§6 repowiki',
        action: '根据实际 repowiki 目录树重写章节映射表',
      },
    ],
    extraDirs: [
      'openspec/changes',
      'openspec/specs',
    ],
  },
  {
    id: 'reference-code',
    name: 'Reference Code',
    description: 'Java CRUD 参考模板（EmployeeTraining 八层示例）',
    templateBase: 'docs/reference-code',
    targetBase: 'docs/reference-code',
    files: [
      'controller/EmployeeTrainingController.java',
      'service/IEmployeeTrainingService.java',
      'service/impl/EmployeeTrainingServiceImpl.java',
      'mapper/EmployeeTrainingMapper.java',
      'resources/mapper/EmployeeTrainingMapper.xml',
      'domain/EmployeeTraining.java',
      'domain/bo/EmployeeTrainingBo.java',
      'domain/vo/EmployeeTrainingVo.java',
    ],
    checklistItems: [
      {
        file: 'docs/reference-code/',
        field: '整体',
        action: '替换为你自己项目中的 CRUD 示例代码，保持八层结构',
      },
    ],
  },
];

export function getModuleById(id) {
  return modules.find(m => m.id === id);
}

export function getTemplatePath(mod, file) {
  return path.join(TEMPLATES_DIR, mod.templateBase, file);
}

export function getTargetPath(mod, file, cwd = process.cwd()) {
  return path.join(cwd, mod.targetBase, file);
}
