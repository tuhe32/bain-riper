---
trigger: glob
glob: openspec/**/*.md
---
# OpenSpec 输出规范（Output Specs）

> ⚖️ **上级规则**：本文件受 `.qoder/rules/project_constitution.md`（项目宪法，always_on）约束。宪法 §4（SHALL/MUST 硬性）与 §9（禁止独立编译任务）直接落地于本文件 §四 / §五，冲突以宪法为准。

**本文件是 OpenSpec artifact（proposal / design / spec / tasks）输出格式与内容
要求的唯一真相源。** 在 `openspec/changes/**` 与 `openspec/specs/**` 下创建或
修改任何 artifact 时必须遵守本文件，违反即视为 artifact 不合规。

> 与本文件配套的另两份规则：
> - 📋 `.qoder/rules/openspec_preflight.md`：写作前的 Preflight（Restate + 前置阅读）
> - 📋 `.qoder/rules/openspec_specifications.md`：项目级目录与命名约束、规则索引

---

## §一、通用输出约定

- 所有标题与正文使用中文，代码、路径、标识符保留英文
- 引用 repowiki 章节统一格式：`见 .qoder/repowiki/zh/content/xxx.md#章节名`
- 引用 reference-code 统一格式：`参考 docs/reference-code/xxx/Xxx.java`（路径前缀见 `openspec/project-profile.md` §2）
- 行尾不留多余空格，文末保留单个换行
- artifact 内禁止粘贴 `<context>` / `<rules>` / `<project_context>` 块

---

## §二、proposal.md

| 章节 | 硬性要求 |
|---|---|
| **Why** | 必须显式引用 repowiki 相关章节，说明新增能力与现有能力的边界 |
| **Why / What Changes** | 必须能在 `inputs/requirement.md`（若存在）中找到对应依据，不得夹带需求文档未提及的功能 |
| **What Changes** | 对每一项新增能力须标注可参考的 reference-code 模板路径 |
| **Impact** | 列出受影响的 repowiki 章节（将来知识库需要更新的条目） |

附加约束（与 `openspec/config.yaml` `rules.proposal` 同源）：
- 禁止凭空假设技术栈，须以实际依赖为准（pom 路径见 `openspec/project-profile.md` §2）
- 避免重复造轮子：先检索仓库现有实现与已有依赖，禁止引入功能重复的依赖
- 禁止猜测第三方包用法：未在 reference-code 与现有实现中找到同类型用法时，
  必须先阅读包源码或 README 确认 API 存在后再引用

---

## §三、design.md

| 章节 | 硬性要求 |
|---|---|
| **Context** | 引用 repowiki 的"数据模型设计"与"系统架构设计"对应章节 |
| **Decisions** | Domain / Mapper / Controller 选型对齐参考模板的继承与注解写法（实体基类、Mapper 基类、表名注解等）。具体注解名与基类见 `openspec/project-profile.md` §4 / §5 |
| **Non-Goals** | 显式声明不修改的 repowiki 现有模块 |

---

## §四、spec.md

- **Requirement 条目必须以 `SHALL` 或 `MUST` 开头**（OpenSpec 归档校验硬性
  要求，使用其他动词将导致 `openspec archive` 失败）
- 场景以 `WHEN / THEN / AND` 结构描述，行为与 reference-code 中同类型功能
  保持一致
- 数据模型类 spec 必须包含：
  - 建表 SQL 路径约定（路径见 `openspec/project-profile.md` §2）
  - 表名使用 snake_case
  - 主键、多租户字段完整声明（字段名见 `openspec/project-profile.md` §4）

---

## §五、tasks.md

- 每个任务可独立验证，给出验证命令或可观察证据
- 涉及新增类的任务，任务描述必须指明参考的 `docs/reference-code/` 文件路径
- 建表 / SQL 脚本任务统一放到建表 SQL 路径（见 `openspec/project-profile.md` §2）
- Mapper XML 统一放到 Mapper XML 路径（见 `openspec/project-profile.md` §2）
- **禁止包含编译验证任务**：tasks.md 不得独立列出 `mvn clean compile` /
  `mvn compile` 等整体编译验证步骤；单任务内的"编译无错误"作为验证证据
  可保留，但不得单独用作任务条目
- **Reverse Sync 硬规则（apply 阶段强制）**：实施任一任务时若发现 spec.md /
  design.md / tasks.md 自身描述与代码/参考实现不一致，**必须先停止代码实现，
  按 `.qoder/rules/openspec_reverse_sync.md` 的「Reverse Sync 五步法」
  回写 artifact 并等待用户确认**，禁止反向修改代码适配错误文档

---

## §六、Artifact 输出自检清单（落盘前逐项核验）

通用：
- [ ] 全文中文叙述、英文路径与代码
- [ ] 所有 repowiki / reference-code 引用使用统一格式
- [ ] 未粘贴 context / rules 注入块

proposal.md：
- [ ] Why / What Changes 在 `inputs/requirement.md` 中均能找到依据
- [ ] What Changes 每项新增能力都标注了 reference-code 模板
- [ ] Impact 列出受影响 repowiki 章节

design.md：
- [ ] Context 引用了 repowiki 数据模型 / 系统架构章节
- [ ] Decisions 与 reference-code 注解、继承一致
- [ ] Non-Goals 明确

spec.md：
- [ ] 每条 Requirement 以 SHALL 或 MUST 开头
- [ ] 场景使用 WHEN / THEN / AND
- [ ] 数据模型类 spec 含建表 SQL 路径、snake_case 表名、多租户字段

tasks.md：
- [ ] 每个任务可独立验证
- [ ] 新增类任务标注了 reference-code 路径
- [ ] 不含独立的 `mvn compile` 任务

**任一项未通过**：禁止落盘，先修订后再写入。
