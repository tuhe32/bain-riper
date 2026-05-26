# bain-riper — AI 工程化规则层仓库

**bain-riper** 是一套面向软件工程的 AI 工程化体系，通过 OpenSpec 规范驱动开发、CodeGraph 代码知识图谱、repowiki 项目知识库和参考代码模板，让 AI 编码助手在严格的规则约束下完成需求→设计→规格→实施的完整闭环。

本仓库是 **规则与知识管理层**，不包含业务代码。实际 Java 源码位于独立仓库中，通过 CodeGraph MCP 与本仓库联动。

---

## 目录结构

```
bain-riper/
├── .qoder/
│   ├── rules/           # 7 个规则文件（宪法 / Preflight / CodeGraph / Task Tiers 等）
│   ├── commands/opsx/   # OpenSpec 斜杠命令（/opsx:propose, /opsx:apply 等）
│   ├── skills/          # 9 个 OpenSpec 技能定义
│   ├── repowiki/zh/     # 项目知识库（架构 / 数据模型 / API / 运维 / 安全等）
│   └── mcp.json         # MCP 服务器配置（CodeGraph 指向实际代码仓库）
├── docs/
│   └── reference-code/  # RuoYi-Vue-Plus 风格 CRUD 参考模板（EmployeeTraining 示例）
└── openspec/
    ├── config.yaml      # OpenSpec 工作流配置
    ├── project-profile.md  # 项目骨架 Profile（技术栈 / 分层 / 约定 / 模板）
    ├── specs/           # 当前活跃 spec 快照
    └── changes/archive/ # 已归档的 change 历史
```

---

## 安装步骤

### 1. 安装 OpenSpec

OpenSpec 是本体系的核心 CLI，管理 proposal → design → spec → tasks → archive 的完整工作流。

```bash
npm install -g @openspec/cli
```

验证安装：

```bash
openspec --version
```

### 2. 安装 CodeGraph

CodeGraph 是本地代码知识图谱，为 AI 提供秒级代码符号检索、调用链分析和变更影响评估，替代全库扫描以降低 token 消耗。

```bash
npm install -g codegraph
```

在业务代码仓库中初始化索引：

```bash
cd /path/to/your-java-project
codegraph init          # 初始化
codegraph index         # 构建代码索引
codegraph sync          # 对修改增量更新
```

> CodeGraph 以 MCP 模式运行（`codegraph serve --mcp`），内置文件监听器自动增量同步，无需手动执行 `codegraph sync`。相关配置见 `.qoder/mcp.json`。

### 3. 打开 Qoder 软件，构建项目的 repowiki 知识库

在 Qoder 中打开本项目目录，AI 助手将基于 `openspec/project-profile.md`、`.qoder/rules/` 下的规则文件和 `.qoder/repowiki/zh/` 中的知识库内容，建立对项目架构、数据模型、API 接口和开发规范的完整认知。

> repowiki 知识库按需阅读：AI 在每个任务中最多选择 2 个主章节，先列目录再读文件，避免全量扫描。

### 4. 在 `docs/reference-code` 中复制一个完整的 CRUD 实例代码

将你项目中的一个完整 CRUD 功能代码复制到 `docs/reference-code/` 目录下，作为后续所有同类功能的参考模板。参考代码基于 [RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus) 5.X 代码生成模板（`ruoyi-generator/src/main/resources/vm/`），以 `EmployeeTraining` 为示例实体，覆盖：

| 层次 | 文件 |
|------|------|
| Controller | `controller/EmployeeTrainingController.java` |
| Service 接口 | `service/IEmployeeTrainingService.java` |
| Service 实现 | `service/impl/EmployeeTrainingServiceImpl.java` |
| Mapper 接口 | `mapper/EmployeeTrainingMapper.java` |
| Mapper XML | `resources/mapper/EmployeeTrainingMapper.xml` |
| 实体 Entity | `domain/EmployeeTraining.java` |
| 业务对象 BO | `domain/bo/EmployeeTrainingBo.java` |
| 返回 VO | `domain/vo/EmployeeTrainingVo.java` |

> 根据项目宪法 §8，所有新增 CRUD / 导入导出 / 权限 / 分页等常规功能，必须以参考模板的继承结构、注解写法、分页约定、多租户处理方式为准。
>
> 关键约定：Entity 继承 `TenantEntity`、Mapper 继承 `BaseMapperPlus<Entity, Vo>`、Controller 继承 `BaseController`、统一响应 `R<T>` / `TableDataInfo<T>`、构造器注入 `@RequiredArgsConstructor`。

### 5. 每次 AI 工作的标准流程

所有开发任务按 OpenSpec 默认流程执行，使用 `/opsx` 系列斜杠命令：

```
/opsx:propose   → 描述需求，AI 生成 proposal.md
/opsx:apply     → 按 tasks.md 逐条实施，偏差时自动触发 Reverse Sync
/opsx:verify    → 验证实施与 spec 一致
/opsx:archive   → 归档完成的 change
```

完整工作流：

```
需求输入 → Restate First（复述对齐）→ Clarify（暴露歧义）
    → 前置阅读（repowiki / reference-code / inputs）
    → proposal → design → spec → tasks
    → apply（代码实现 + Reverse Sync 偏差修正）
    → verify → archive
```

每个阶段 AI 都会严格遵循项目宪法 10 条底线（`project_constitution.md`），包括但不限于：

- **§1 Spec is Truth**：spec 是业务行为的唯一真相源
- **§2 Restate First**：实施前必须复述目标/边界并获确认
- **§3 多租户字段完整性**：所有业务实体必须含 `tenant_id`
- **§5 禁止重复造轮子**：新增功能前先检索现有实现
- **§7 标准分层目录**：所有 Java 类落在规定目录
- **§8 参考代码优先对齐**：同类功能对齐参考模板风格
- **§10 Preflight 自检物理可见**：进入工作流前展示自检清单

---

## 移植到新项目

本仓库的核心规则文件实现了"核心套件跨项目复用 / 只换 Profile"的两层架构。移植时只需修改：

1. **`openspec/project-profile.md`** — 技术栈、包路径、领域约定、参考模板清单、repowiki 章节目录映射
2. **`.qoder/mcp.json`** — CodeGraph 指向新的代码仓库路径
3. **`.qoder/repowiki/zh/`** — 替换为新项目的知识库内容
4. **`docs/reference-code/`** — 替换为新项目的 CRUD 参考模板

其余规则文件（宪法 / Preflight / Task Tiers 等）无需改动。

---

## 许可证

内部项目，暂不对外开源。
