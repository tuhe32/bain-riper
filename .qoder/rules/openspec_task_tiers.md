---
trigger: model_decision
description: OpenSpec 四档任务深度分级（zero / fast / standard / deep）。在 Restate First 完成后，必须据此判定本次任务档位并向用户声明，再按档位裁剪 Clarify / 前置阅读 / 四件套 / Reverse Sync 的执行力度。触发 openspec-propose / openspec-continue-change / openspec-explore / openspec-apply-change 四个 skill 时必须加载本文件。
---

# OpenSpec 任务深度分级（Task Tiers）

> ⚖️ **上级规则**：本文件受 `.qoder/rules/project_constitution.md`（项目宪法，always_on）约束。
> 宪法 §2 Restate First 在本文件扩展为「复述 + 声明档位」两步。档位无论高低，均不得绕开宪法 10 条底线。

**本文件是 项目对任务规模的唯一分级标准。**
目的：让小任务轻量、大任务扎实。避免"改一个字段也要跑完四件套"的体验负担。

---

## §一、四档定义（按"范围 + 风险 + 交付物"三维判定）

| 档位 | 适用范围 | 风险 | 交付物 | 典型用时 |
|---|---|---|---|---|
| **zero** | 纯问答 / 解读 / 代码走读 / 规则答疑 | 无代码变更 | 仅对话回复，不生成任何 artifact，不启动 openspec CLI | 秒级 |
| **fast** | 单字段新增 / 单枚举补录 / 错别字 / 日志文案 / 常量修订 | 低 | 直接走 `openspec-apply-change` 风格的轻量 change：**仅 spec delta + 1 个 task**，**跳过 design.md**、**跳过 Clarify**（显式声明） | 5-15 分钟 |
| **standard** | 单领域常规 CRUD / 导入导出 / 权限校验 / 单表字段扩展（≤3 字段） | 中 | 完整四件套（proposal + design + spec + tasks），Clarify 必做 | 30-90 分钟 |
| **deep** | 跨领域 / 架构级调整 / 多模块影响 / 涉及数据迁移 / 新增领域实体（≥5 字段） | 高 | 四件套 + 追加 `codemap.md`（关键调用链 / 入口清单），Clarify 至少 5 个歧义点，Reverse Sync 零容忍 | 半天~若干轮对话 |

---

## §二、判定决策树（Restate 完成后立即执行）

```
Restate 通过
  ↓
是否需要改代码或文档？
  ├── 否 → [zero]（直接回复）
  └── 是
       ↓
     改动是否同时满足：① ≤1 个字段/枚举/文案；② 不涉及接口签名；③ 不涉及权限/租户逻辑？
       ├── 是 → [fast]
       └── 否
            ↓
          是否满足任一条：① 跨 ≥2 个业务模块；② 动数据库 ≥2 张表；③ 改架构/中间件/通用基类；④ 新增领域实体 ≥5 字段？
            ├── 是 → [deep]
            └── 否 → [standard]（默认档）
```

**判定结果必须在 Restate 末尾显式声明**，格式：

```
档位：<zero|fast|standard|deep>
理由：一句话说明为什么是这个档
```

**用户有权覆盖 AI 的判定**（"这个按 standard 跑"）。用户未反对 = 采纳 AI 判定。

---

## §三、各档流程裁剪

### zero
- ❌ 不走 openspec 任何 skill
- ❌ 不生成 artifact
- ✅ 允许直接基于已加载上下文回答；涉及代码示例时必须真实引用文件路径

### fast
- ✅ 必做：Restate + 档位声明 + Preflight 自检物理化展示（§二）
- ❌ 可跳过：Clarify（显式声明"fast 档无需 Clarify"即可）
- ❌ 可跳过：design.md（直接 proposal + spec delta + tasks，tasks 通常只有 1-3 条）
- ✅ repowiki 按需：最多 **0-1 个** 主章节
- ✅ 归档：走 `openspec-archive-change` 正常流程

### standard（默认档）
- ✅ 全套流程，严格遵守前几轮已落地的所有硬规则
- ✅ Clarify 3-5 个歧义点
- ✅ repowiki 最多 2 个主章节
- ✅ 四件套齐备

### deep
- ✅ 在 standard 基础上叠加：
  - Clarify **≥5** 个歧义点，必须覆盖架构 / 数据一致性 / 租户 / 性能 4 个维度
  - 追加 `openspec/changes/<name>/codemap.md`（关键类 / 入口 / 调用链 / 风险点）
  - Reverse Sync 零容忍：任何偏差必须立即触发五步法
  - repowiki 最多 3 个主章节（仍遵守"先 list_dir 再 read_file"）

---

## §四、升档与降档

- **升档**：实施过程中发现复杂度超出预期 → 立即停止，向用户声明升档理由（如 "fast → standard：发现需要新建 Mapper 接口"），**等用户确认后**按新档位补齐前置流程（如补 Clarify / 补 design.md）。
- **降档**：禁止 AI 主动降档。只有用户显式要求"按 fast 跑" / "直接做" 时才允许降档，且必须保留 Restate + 档位声明两项底线。

---

## §五、与其他规则文件的关系

| 文件 | 关系 |
|---|---|
| `.qoder/rules/project_constitution.md` | 宪法 §2 的"声明档位"落地于本文件 §二 |
| `.qoder/rules/openspec_preflight.md` | §零 Restate 末尾追加档位声明；§零点五 Clarify 对 fast/zero 放行；§二 自检新增"档位项" |
| `.qoder/rules/openspec_output_specs.md` | fast 档允许省略 design.md；其他 artifact 章节硬性要求在 standard/deep 档仍完整生效 |
| `openspec/config.yaml` | context 新增 `Task Tiers` 段，rules.proposal 追加"档位声明"硬约束 |

---

## §六、档位判定自检清单（Restate 阶段必须通过）

- [ ] 已在 Restate 末尾显式声明档位（`档位：<...>`）
- [ ] 已给出判定理由（一句话）
- [ ] 若声明为 fast：已显式写"本任务无需 Clarify"
- [ ] 若声明为 deep：已规划 codemap.md 并预告至少 5 个 Clarify 点
- [ ] 若用户覆盖 AI 判定：已采纳用户档位，不再争论
