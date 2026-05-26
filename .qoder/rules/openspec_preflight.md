---
trigger: model_decision
description: OpenSpec skills（openspec-propose / openspec-continue-change / openspec-explore / openspec-apply-change）与在 openspec/changes/** 或 openspec/specs/** 下生成任何 artifact（proposal/design/spec/tasks）前的统一 Preflight 流程（Restate First + Clarify 主动找歧义 + 前置阅读 + 物理化自检展示）。apply 阶段额外叠加 Reverse Sync 硬规则（发现 spec 偏差时先回写文档再改代码）。因 Qoder 在 skill 触发时同步加载 model_decision 规则，本文件无需在各 SKILL.md 中硬编码 Step 0 引用即可自动生效。
---

# OpenSpec Preflight（统一前置流程）

> ⚖️ **上级规则**：本文件受 `.qoder/rules/project_constitution.md`（项目宪法，always_on）约束。宪法 §2 / §10 直接对应本文件的 §零 Restate First 与 §二 自检清单，冲突以宪法为准。

**本文件是 OpenSpec 体系中所有提案/继续/探索前置流程的唯一真相源。**
触发 `openspec-propose` / `openspec-continue-change` / `openspec-explore` 三个 skill，
或在 `openspec/changes/**`、`openspec/specs/**` 下创建/修改
`proposal.md` / `design.md` / `spec.md` / `tasks.md` 时，必须按本文件流程执行，
不得跳过、简化或重新发明。

其它文件（三个 SKILL.md、`openspec_specifications.md`、`openspec/config.yaml`）
仅负责引用本文件，不再重复 Preflight 内容。

---

## §零、Restate First（最先执行，优先级高于一切）

在**任何**前置阅读、CLI 调用、artifact 生成之前，必须先完成一次「Restate + Checkpoint」：

1. **Restate（用自己的话复述）**：以 8 行以内，明确给出：
   - 任务目标（一句话）
   - 变更边界（包含 / 不包含什么）
   - Done Contract（什么算完成、由什么证明）
   - 已识别的关键风险或歧义
   - **任务档位**：`zero` / `fast` / `standard` / `deep` 四选一 + 一句话理由
     （判定规则见 📋 `.qoder/rules/openspec_task_tiers.md` §二 决策树）
2. **等待用户确认**：若用户未明确同意（"OK / 继续 / 确认"等），
   禁止进入前置阅读与任何 artifact 生成。若存在歧义，使用 AskUserQuestion 澄清。
   用户有权在此时覆盖 AI 判定的档位。
3. **确认通过后**，按档位裁剪后续流程（fast 档跳过 Clarify、跳过 design.md；
   standard 走全套；deep 追加 codemap.md），才进入 §一 前置阅读与后续工作流。
4. **再对齐时机（Core Goal as Loop Anchor）**：

   以下三个时机**强制**重新回看 Restate 中的核心目标，不得仅靠记忆推进：

   | 时机 | 动作 |
   |------|------|
   | **执行前 checkpoint** | 每一个实施步骤（如 tasks.md 的每个 task）执行前，输出 **≤4 行 Core Goal Re-Anchor**：<br>· 核心目标（来自 proposal.md / spec.md，≤1 句）<br>· 当前步骤对目标的贡献<br>· 1 行 sanity check：「基于当前进度，此步骤是否仍合理？」 |
   | **偏差暴露后** | 发现 spec / design / tasks 与实现不一致时，启动 Reverse Sync 五步法（见 `.qoder/rules/openspec_reverse_sync.md`）；回写文档后**回到本节的 Re-Anchor 重新对齐** |
   | **artifact 收尾时** | 全部任务完成后，回看 Restate 中的 Done Contract，逐条检查是否由证据证明完成 |

   **Core Goal Re-Anchor 格式**（轻量，非完整 Restate）：
   ```
   ## Core Goal Re-Anchor
   - **目标**：<1 句核心目标>
   - **当前步骤**：<步骤编号 + 描述> → 贡献：<1 句>
   - **Sanity Check**：<1 句路径检查>
   ```

   若 Re-Anchor 发现核心目标已偏移、当前步骤不再合理：
   - 立即暂停
   - 报告偏移内容
   - 建议更新 spec / design / tasks 后再继续
   - **禁止**绕过偏移继续推进

   此机制是宪法 §2 Restate First 在实施阶段的轻量化延伸，
   与 Preflight 自检（§二）互为补充：自检管"开始前"，Loop Anchor 管"进行中"。

> 灵感来源：轻量 AI Agent Harness 实践（SDD-RIPER Light）。
> 目的：避免"四件套写完才发现理解错了"的返工。

---

## §零点五、Clarify（Restate 通过后、前置阅读前执行）

Restate 被用户确认后，**不得直接进入前置阅读**，必须先执行一次主动找歧义：

1. **主动列出 3-5 个歧义点**，每条包含：
   - 歧义编号（Q1 / Q2 ...）
   - 一句话描述争议（例："字段 X 是否跟随租户隔离？"）
   - **二选一或三选一**的候选答案（避免开放式问题）
   - 推荐答案 + 简短理由（可选）
2. **展示方式**：必须用 AskUserQuestion 工具提交（多选或单选），
   禁止以"请回复数字 1/2/3"的自由文本形式草草带过。
3. **无歧义的例外**：若任务确实简单（例如仅修正错别字、仅加一个枚举值），
   允许显式声明「本任务无需 Clarify，理由：XXX」并等待用户"OK"后继续；
   但涉及数据模型、接口、权限、租户隔离、编制计划等领域变更时不得省略。
   **档位例外**：声明为 `zero` 档的任务不进入本节；声明为 `fast` 档的任务
   **默认跳过** Clarify（需显式写"fast 档无需 Clarify"），`standard` / `deep`
   档仍必须执行。
4. **确认方式**：用户作答后，必须把答案回写到 Restate 末尾形成"对齐纪要"，
   再进入 §一 前置阅读。

> 灵感来源：GitHub Spec-Kit `/clarify` 阶段。
> 目的：把 Restate First 从"复述理解"升级为"主动暴露并锁死边界"，
> 避免"复述看似无误、落盘才知分歧"的隐性返工。

---

## §一、前置阅读（强制，Restate 确认后执行）

在编写任何 OpenSpec artifact 前，必须按需读取以下资料，并在输出文档中
显式引用来源（文件路径 + 章节名）。

### 1. 本次 change 的原始需求输入（最高优先级）
约定路径：`openspec/changes/<name>/inputs/`

- 若该目录存在，必须**完整阅读**其中所有文件（PRD、会议纪要、接口草案、
  原型图等），作为本次 change 的权威需求源。
- 若目录缺失或为空，**禁止凭空编写 artifact**，必须先向用户确认需求来源
  （对话 / 外部链接 / 其他），并把确认后的需求落盘到 `inputs/requirement.md`
  再进入后续流程。
- 图片资料统一放到 `inputs/mockups/`，在 `inputs/requirement.md` 中用
  相对路径引用。
- `inputs/` 目录随 change 一同归档到 `openspec/changes/archive/`，保证可回溯。

建议结构：
```
openspec/changes/<name>/
├── inputs/
│   ├── requirement.md      # PRD / 业务方描述（必需）
│   ├── api-draft.yaml      # 接口草案（可选）
│   ├── mockups/            # 原型/截图（可选）
│   └── data-samples.sql    # 样本数据（可选）
├── proposal.md
├── design.md
├── specs/
└── tasks.md
```

### 2. 知识库 `.qoder/repowiki/zh/content/`（按需阅读，禁止全量扫描）

> ⚠️ **读取策略硬规则**：repowiki 体量大，**全量扫描昂贵且无必要**。本节
> 既是阅读清单，也是**读取成本控制**的硬约束。

#### 2.1 三步路由法（按顺序执行）

1. **预判**：根据 Restate 中的变更类型，从下方映射表选出 **最多 2 个** 主章节；
   无关章节禁止打开。
2. **先列目录再读文件**：对每个目标章节，先用 `list_dir` 查看文件清单
   （成本约为 `read_file` 的 1/20），再根据文件名判断只读 1-3 个最相关
   `.md`，禁止把整个章节目录批量 `read_file`。
3. **增量补读**：后续 Step 若发现证据不足，再按需补读新文件；
   禁止"先把所有可能相关的都读一遍再开始"。

#### 2.2 变更类型 → 主章节映射（最多选 2 个）

> 完整映射表见 `openspec/project-profile.md` §6。该表根据当前项目 repowiki 目录树维护，
> 移植项目时只需改 profile 一处。

#### 2.3 不重复读取（本 session 内强约束）

- **已在本 session 内读过的文件禁止再次 `read_file`**。若需回忆内容，
  通过上下文引用（直接写出文件路径 + 章节名），而不是重新读。
- 若对已读内容有新的需要（如只记得大意需要精确行号），允许二次读取，
  但必须在回复中标注"二次读取原因：XXX"。
- **Preflight 自检清单中必须列出本次已读章节清单**（见 §二），作为
  "不重复读取"的取证基准。

#### 2.4 跨轮对话的已读判定

- 用户在上一轮已明确引用某文件，或上一轮已通过 `read_file` 输出其内容，
  视为**已读**，本轮禁止重读，直接基于上下文工作。
- 仅当用户显式要求"重新读一次最新版"时，才允许重读。

> 目的：把 repowiki 从"每轮从零扫描"改为"按需最小读取 + 跨轮缓存"，
> 显著降低 token 成本与响应延迟。

### 3. 参考代码 `docs/reference-code/`
以参考模板为标准，按层检索。完整七层文件清单见 `openspec/project-profile.md` §5。

### 4. 项目规则
- `.qoder/rules/openspec_specifications.md`：项目规则索引层（含目录与命名约束）。
- `.qoder/rules/openspec_output_specs.md`：**artifact 输出规范的唯一真相源**
  （proposal / design / spec / tasks 章节硬性要求 + 落盘前自检清单），写入
  artifact 前必读且必须严格遵守。
- `.qoder/rules/openspec_reverse_sync.md`：**apply 阶段偏差处理的唯一标准**（Reverse Sync 五步法），实施代码前必读。
- `openspec/config.yaml`：`context` 与按 artifact 分类的 `rules` 字段，
  由 openspec CLI 注入给 AI。

### 5. 依赖版本确认
涉及第三方库选型时，必须阅读：
- `/pom.xml` 的 `dependencyManagement`（版本）
- `/admin/pom.xml` 的 `dependencies`（实际依赖清单）
> 模块名与依赖清单见 `openspec/project-profile.md` §2。

禁止凭空假设依赖或版本。

### 6. 依赖与实现复用原则
- **避免重复造轮子**：新增功能前先检索仓库现有实现与 `pom.xml` 中已有的包，
  禁止引入功能重复的依赖或重复实现已有的工具类。在 `proposal.md` 的 **Why** /
  **What Changes** 中需明确说明与已有能力的边界。
- **禁止猜测第三方包用法**：若 `docs/reference-code/` 与仓库现有实现中均未
  找到同类型用法，必须先阅读该包的源码或官方 README，确认 API 存在、
  版次兼容后，再在 `design.md` / `tasks.md` 中引用具体类名或方法名；
  不允许以假定存在的 API 为前提编写 artifact。

---

## §二、Preflight 自检清单（进入 skill 后续 Step 前必须全部通过）

**物理化展示硬规则（宪法 §10 落地）**：进入 Step 1 之前，必须在主回复开头
用可见的 Markdown checkbox 形式（`- [x]` / `- [ ]`）打印下方清单的真实勾选
状态，禁止仅用"已完成 Preflight"等文字描述代替。未展示勾选结果 = 视为
未执行 Preflight，用户有权要求重做。

- [ ] Restate 已产出且 ≤ 8 行（含目标 / 边界 / Done Contract / 风险）
- [ ] **已在 Restate 末尾声明任务档位**（`zero` / `fast` / `standard` / `deep`）并给出一句话理由
- [ ] 用户已明确确认（"OK / 继续 / 确认"等），或歧义已通过 AskUserQuestion 澄清
- [ ] Clarify 阶段已完成：已列 3-5 个歧义点并获用户答复，或已显式声明"本任务无需 Clarify"且得到用户"OK"
- [ ] `openspec/changes/<name>/inputs/` 已完整阅读，或已按缺失处理流程
      落盘 `inputs/requirement.md`
- [ ] 与当前变更主题相关的 repowiki 章节已识别并阅读（已读清单必须列出：`路径A#章节X`、`路径B#章节Y`；已读文件本 session 不重复 `read_file`）
- [ ] 与当前变更同类型的 reference-code 模板已识别并阅读
- [ ] 涉及依赖变更时，`/pom.xml` 与 `/admin/pom.xml` 已核对
- [ ] 已加载 `.qoder/rules/openspec_output_specs.md`，准备在写入 artifact 时按其执行落盘前自检
- [ ] 已加载 `.qoder/rules/project_constitution.md` 宪法 10 条并确认本次任务不违宪

**任一项未完成**：禁止进入 skill 的后续 Step，禁止生成任何 artifact。

---

## §三、与其他文件的引用关系

| 文件 | 引用方式 |
|---|---|
| `.qoder/skills/openspec-propose/SKILL.md` | 方案甲迁移后不再含 Step 0 硬引用；规则由 Qoder model_decision 自动加载本文件 |
| `.qoder/skills/openspec-continue-change/SKILL.md` | 同上 |
| `.qoder/skills/openspec-explore/SKILL.md` | 同上，探索场景通过本文件 §一.5 覆盖 |
| `.qoder/skills/openspec-apply-change/SKILL.md` | 同上；Reverse Sync 五步法已搬迁至 `openspec_reverse_sync.md` |
| `.qoder/rules/openspec_specifications.md` | §零 为引用指针，自身只保留输出规范 |
| `.qoder/rules/openspec_output_specs.md` | §五 tasks.md 末尾记录 Reverse Sync 硬规则，指向 `openspec_reverse_sync.md` |
| `.qoder/rules/openspec_task_tiers.md` | 在 §零 Restate 与 §零点五 Clarify 中被引用；四档裁剪规则由该文件承载 |
| `.qoder/rules/openspec_reverse_sync.md` | apply 阶段偏差处理流程（五步法）；本文件 §零 完成后、进入实施时由该文件接管偏差处置 |
| `openspec/config.yaml` | `context.Restate First` / `rules.proposal` 保留硬约束，作为 CLI 注入链路的双保险 |
