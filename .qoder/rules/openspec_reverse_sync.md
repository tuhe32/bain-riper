---
trigger: model_decision
description: OpenSpec apply 阶段的 Reverse Sync（反向同步）硬规则。在 openspec-apply-change 执行过程中，一旦发现 spec/design/tasks 与代码实现存在偏差，必须立即执行五步法（停止→诊断→回写文档→等确认→继续），禁止反向修改代码适配错误文档。触发 openspec-apply-change skill 时必须加载本文件。
---

# OpenSpec Reverse Sync（反向同步硬规则）

> ⚖️ **上级规则**：本文件受 `.qoder/rules/project_constitution.md`（项目宪法，always_on）约束。
> 宪法 §1「Spec is Truth」即本文件的理论根基——代码、文档冲突时**先改文档，再改代码**。

**本文件是 项目在 apply 阶段处理 spec 偏差的唯一标准流程。**
目的：确保 Spec 始终是业务行为的唯一真相源，杜绝「代码写完、文档烂尾」的腐败。

---

## §一、触发条件（以下任一情况出现即必须启动）

在整个 `openspec-apply-change` 执行过程中，一旦发现：

1. 按 `tasks.md` 实现时，发现 `spec.md` / `design.md` 中的描述与实际代码结构无法对齐
2. `reference-code` 中同类型实现与 spec 存在冲突
3. 实现过程中发现 spec 遗漏了关键字段 / 接口 / 校验规则
4. 实现过程中发现 `tasks.md` 的步骤顺序或依赖关系存在错误

**必须立即执行下方五步法，禁止以下行为**：
- ❌ 先改代码以适配错误的 spec
- ❌ 在代码中埋 TODO 占位绕过 spec 偏差
- ❌ 口头说"后面再修文档"然后继续写代码

---

## §二、Reverse Sync 五步法

### 第 1 步：停止
**立即停止**当前任务的代码实现。在回复中显式声明：
> ⚠️ 检测到 spec/deviation，暂停代码实现，启动 Reverse Sync。

### 第 2 步：诊断
在回复中**明示偏差点**，格式：
```
偏差点：<具体描述>
位置：
  - spec.md §X 行 Y：「原文」
  - design.md §Z：「原文」
  - 实际代码/结构：「现状」
建议修订方向：<一句话>
```
每个偏差点必须引用具体文件、章节、行号或原文片段，禁止模糊描述。

### 第 3 步：回写文档（核心）
**先修改文档，而非代码**。使用 `search_replace` 工具提交 `spec.md` /
`design.md` / `tasks.md` 的修订。修订范围应限于：
- 补充遗漏字段 / 接口 / 校验规则
- 修正错误的步骤顺序或依赖关系
- 修正与实际代码结构不符的描述

**严禁在回写文档的同时修改代码**。第 3 步**只改文档**。

### 第 4 步：等待确认
回写完成后，**必须等待用户明确确认**（"OK / 同意 / 继续"等）。
未确认前禁止进入第 5 步，禁止恢复代码实现。

若用户拒绝修订方向，回到第 2 步重新诊断。

### 第 5 步：继续
用户确认后，回到原任务的代码实现，**基于修正后的文档**继续工作。

---

## §三、档位差异

| 档位 | Reverse Sync 执行力度 |
|---|---|
| **zero** | 不适用（无代码变更） |
| **fast** | 偏差暴露时仍须执行五步法，但因改动小（单字段/单枚举），诊断应 ≤2 个偏差点 |
| **standard** | 严格遵守五步法，诊断可含 3-5 个偏差点 |
| **deep** | **零容忍**——任何偏差必须立即触发五步法；诊断不设上限；回写完成后须**逐条核验**修正是否闭环；禁止以"后续 change 再修"为理由推迟 |

---

## §四、与其他文件的关系

| 文件 | 关系 |
|---|---|
| `.qoder/rules/project_constitution.md` | 宪法 §1「Spec is Truth」为本文件的理论根基 |
| `.qoder/rules/openspec_preflight.md` | apply 阶段 Preflight 完成后，本文件在实施中持续生效；§零.4 Core Goal Loop Anchor 检测到目标偏移时触发本文件的五步法 |
| `.qoder/rules/openspec_output_specs.md` | §五 tasks.md 末尾记录本文件的硬约束摘要 |
| `.qoder/skills/openspec-apply-change/SKILL.md` | 本文件替代原 SKILL.md 中 Step 0 Reverse Sync 块与 Guardrails 中的硬规则；apply skill 触发时由 Qoder model_decision 加载本文件 |

---

## §五、自检清单（apply 阶段 Preflight 中必须验证）

- [ ] 已加载本文件并理解五步法
- [ ] 若当前任务档位为 `deep`：已确认零容忍策略
- [ ] 已知偏差触发条件（§一 4 条）
- [ ] 已约定偏差点诊断格式（文件 + 章节 + 原文引用）
