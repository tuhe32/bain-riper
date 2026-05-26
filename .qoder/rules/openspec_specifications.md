---
trigger: glob
glob: openspec/**/*.md
---
# OpenSpec 项目规则索引

> ⚖️ **上级规则**：本文件受 `.qoder/rules/project_constitution.md`（项目宪法，always_on）约束。宪法 §7 目录约束即本文件 §三 的源头，冲突以宪法为准。

适用范围：在 `openspec/changes/**` 与 `openspec/specs/**` 下创建或修改
`proposal.md` / `design.md` / `spec.md` / `tasks.md` 时生效。

本文件作为 OpenSpec 项目规则的**索引层**，按职责将完整规则拆分为三份独立文件。
任何 artifact 的写作都必须依次满足这三层约束。

## 零、项目宪法（最高优先级）

**单一真相源**：⚖️ `.qoder/rules/project_constitution.md`（trigger: always_on）

定义 10 条跨场景绝不可违反的底线（Spec is Truth / Restate First / 多租户 /
SHALL-MUST / 禁重复造轮子 / 禁猜 API / 标准分层 / 参考代码对齐 /
禁独立编译任务 / Preflight 自检物理可见）。
本索引仅列条目，条款正文以宪法文件为准。

## 一、Preflight（写作前）

**单一真相源**：📋 `.qoder/rules/openspec_preflight.md`

定义写作前的 Restate First、前置阅读、Preflight 自检清单。
未完成 Preflight 前禁止生成任何 artifact。

## 二、Output Specs（写作中 / 落盘前）

**单一真相源**：📋 `.qoder/rules/openspec_output_specs.md`

定义 proposal / design / spec / tasks 四类 artifact 的章节硬性要求、
通用输出约定、Artifact 输出自检清单。
未通过自检禁止落盘。

## 二点五、Task Tiers（任务深度分级）

**单一真相源**：📋 `.qoder/rules/openspec_task_tiers.md`

定义 `zero` / `fast` / `standard` / `deep` 四档及其流程裁剪：
fast 档跳过 design.md 与 Clarify；standard 默认全套；deep 追加
codemap.md 与 ≥5 个 Clarify 点。Restate 末尾必须声明档位。

## 二点六、Reverse Sync（反向同步硬规则）

**单一真相源**：📋 `.qoder/rules/openspec_reverse_sync.md`

定义 apply 阶段发现 spec/design/tasks 偏差时的五步处理流程
（停止→诊断→回写文档→等确认→继续）。apply 阶段必须加载。

## 二点七、CodeGraph 代码知识图谱（工具增强）

**单一真相源**：📋 `.qoder/rules/openspec_codegraph.md`

定义 CodeGraph（v0.9.4）MCP 工具在代码探索中的分层与优先级：
`codegraph_query / callers / callees / impact / context / files / status / sync`。
对宪法 §5（禁重复造轮子）、§6（禁猜测 API）、§1（Spec is Truth）提供
工具级增强，减少 Grep/Glob 手工扫描 token 消耗。可选启用，失败降级。

## 三、目录与命名约束

> 完整目录树与所有路径约定见 `openspec/project-profile.md` §2 / §3。
> 以下为速记摘要，冲突以 profile 为准。

```
<base-package>/
├── controller/           # REST API endpoints
├── service/              # Business logic layer
│   └── impl/             # Service implementations
├── mapper/               # MyBatis mapper interfaces
├── constant/             # Enums and constants
├── config/               # Spring config & utility classes
└── domain/               # JPA/MyBatis entities
    ├── params/           # param objects
    └── vo/               # view objects
```

- 新增实体、Mapper、Service、Controller 必须落在上述目录
- 常量/枚举统一 `constant/`
- 工具类与 Spring 配置统一 `config/`
- 基础包路径、Mapper XML 路径、建表 SQL 路径等具体值见 profile
