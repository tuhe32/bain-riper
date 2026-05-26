---
trigger: model_decision
description: CodeGraph 代码知识图谱使用规则。在代码探索、检索仓库现有实现、分析调用关系时，优先使用 CodeGraph MCP 工具替代 Grep/Glob 全库扫描，减少 token 消耗。适用于所有 OpenSpec skill 及日常 AI 编码交互。
---

# CodeGraph 使用规范

> ⚖️ **上级规则**：本文件受 `.qoder/rules/project_constitution.md`（项目宪法，always_on）约束。
> 当本文件与宪法冲突时，以宪法为准。本文件仅定义"优先用什么工具"，不修改任何宪法条款。

**codegraph**（v0.9.4, TypeScript）是一个本地代码知识图谱，已在本项目完成初始化：
- 索引范围：210 个文件，5,713 个 AST 节点，9,348 条关系边
- 数据库：`.codegraph/codegraph.db`（SQLite，WAL 模式，约 11.4 MB）
- 语言支持：Java（198 文件）+ YAML（12 文件）

---

## §1 工具分层与优先级

代码探索分为两个阶段，不同阶段使用不同工具：

```
阶段 A「找在哪」→ CodeGraph MCP 优先（秒级、低 token）
阶段 B「读内容」→ Read 确认（精确、必须）
```

| 阶段 | 任务 | 优先工具 | 降级工具（无 CodeGraph 或失败时） |
|------|------|---------|--------------------------|
| A | 搜索符号/类/方法 | `codegraph_query` | search_codebase + Grep |
| A | 查看文件结构 | `codegraph_files` | Glob |
| A | 分析调用者 | `codegraph_callers` | ❌ 无等价工具（只能手工 Grep） |
| A | 分析被调用方 | `codegraph_callees` | ❌ 无等价工具（只能手工 Grep） |
| A | 变更影响分析 | `codegraph_impact` | ❌ 无等价工具 |
| A | 任务相关上下文 | `codegraph_context` | Read × N（高 token） |
| B | 读取实现细节 | Read（必须） | Read（唯一方案） |
| B | 读取参考模板 | Read（必须） | Read（唯一方案） |
| B | 读取知识库 | Read（必须） | Read（唯一方案） |

> **硬规则**：「阶段 A」任务禁止用 Grep/Glob 直接扫描全库，「阶段 B」任务禁止用 `codegraph_query` 代替 Read。

---

## §2 对各宪法条款的增强

### §5（禁止重复造轮子）—— `codegraph_query`

**效果**：将"搜索同名类/同语义方法"从手动多次 Grep 变为一条 query。

**使用模式**：
```text
# 检查是否存在同名 Service
codegraph_query("EmployeeExport")  → 返回所有匹配符号（类/方法/字段）+ 位置 + 相关度评分

# 若结果 ≥ 1，再 Read 具体文件做精确判断
Read(结果[0].文件路径)
```

**前置条件**：在 Restate 阶段声明"将通过 codegraph_query 检查仓库现有实现"。
**禁止**：① query 出结果后跳过 Read 直接假设功能重复 ② query 无结果后跳过 pom.xml 依赖检查。

### §6（禁止猜测第三方 API）—— `codegraph_callers` / `codegraph_callees`

**效果**：通过调用链分析确认"API 是否已被使用"。

**使用模式**：
```text
# 查询某方法的所有被调用方（确认依赖该 API 的代码范围）
codegraph_callees("EmployeeInfoServ")

# 查询某方法的所有调用者（确认该 API 是否被实际使用）
codegraph_callers("TenantModel.getTenantId")
```

**前置条件**：需要精度跨越的领域（如引入新的二方库/三方库），在 proposal.md 的 Why 中注明"已通过 codegraph 调用链分析确认无同类实现"。

### §1（Spec is Truth）—— `codegraph_impact`

**效果**：在改代码前自动评估变更影响面，提前预判是否需要改 spec。

**使用模式**：
```text
# 修改某方法前，评估影响面
codegraph_impact("待修改的符号名") → 返回受影响的调用链
→ 交叉验证 spec.md 中是否有对应 Scenario 覆盖
→ 若无 → 先触发 Reverse Sync
```

### §3（多租户完整性）

**效果**：`codegraph_query("tenant_id")` 可列出所有包含 `tenant_id` 的符号，辅助验证 Mapper 是否缺多租户过滤。

---

## §3 Preflight 前置阅读中的使用

在 `openspec_preflight.md` §一 前置阅读阶段，CodeGraph 作为可选辅助工具使用：

| Preflight 步骤 | CodeGraph 辅助方式 | 严格程度 |
|---------------|-------------------|---------|
| §一.1 读取 inputs | 不适用（纯文本输入） | — |
| §一.2 repowiki 阅读 | 不适用（业务知识，非代码） | — |
| §一.3 参考代码 | `codegraph_files` 快速了解模板文件结构；仍必须 Read 模板内容 | 辅助，不可替代 |
| §一.4 项目规则 | 不适用（规则文本） | — |
| §一.5 存储现有实现检索 | **`codegraph_query` 优先**，替代手工 Grep | 推荐，失败降级 Grep |
| §一.6 调用链分析 | **`codegraph_callers/callees` 优先**，回答"谁在用这个 API" | 推荐 |

> **硬约束**：CodeGraph 的输出是"快速索引摘要"，精度不如 Read 全文。
> 关键决策（如"确定没有重复实现"）需要 Read 确认后做出，不可仅凭 CodeGraph 摘要拍板。

---

## §4 同步策略

### 4.1 自动同步

配置 `.qoder/mcp.json` 后，CodeGraph MCP 将以 `serve --mcp` 模式运行，内置文件监听器自动增量同步。无需手动执行 `codegraph sync`。

### 4.2 手动同步（异常恢复）

当索引落后或出现不一致时：

```bash
cd /path/to/your-java-project
codegraph sync    # 增量同步
codegraph status  # 确认状态
```

### 4.3 索引新鲜度验证

每次 OpenSpec skill 启动时，CodeGraph MCP 自动提供的 `codegraph_status` 可查看当前索引状态。若发现文件数明显少于预期（< 200），应触发手动 sync。

---

## §5 Preflight 自检扩展项

使用 CodeGraph 辅助时，preflight 自检清单追加两项（仅在使用阶段生效，不影响不使用时）：

- [ ] （如启用 CodeGraph）`codegraph_status` 已确认索引新鲜（文件数 ≥ 200）
- [ ] （如启用 CodeGraph）关键代码检索/调用链分析已通过 CodeGraph 完成，结果已写入 Restate 对齐纪要

---

## §6 禁止行为

以下行为视为违反本规范：

| 禁止行为 | 理由 |
|---------|------|
| 用 `codegraph_query` 结果代替 Read 做精确判断 | query 返回的是索引摘要，不包括完整方法体/注解/import |
| 用 `codegraph_context` 代替 Read 阅读源代码 | context 用于了解任务周边，不用于精确实现 |
| 发现 CodeGraph 失败后直接跳过检索步骤 | 应降级到 Grep/Glob 继续检索，宪法 §5 要求必须检索仓库 |
| CodeGraph 不可用时以此为由拒绝执行任务 | CodeGraph 是可选增强，不是必需依赖 |
| 使用 CodeGraph 工具时跳过宪法 §2（Restate First） | 任何工具均不豁免 Restate 义务 |

---

## §7 技术参考

- CLI 入口：`codegraph`（v0.9.4, npm 全局安装，路径 `/usr/local/bin/codegraph`）
- 索引存储：`.codegraph/codegraph.db`（已加入 `.codegraph/.gitignore`，不入库）
- MCP 模式：`codegraph serve --mcp`（stdio 传输）
- MCP 工具列表：`codegraph_query` / `codegraph_context` / `codegraph_callers` / `codegraph_callees` / `codegraph_impact` / `codegraph_affected` / `codegraph_files` / `codegraph_status` / `codegraph_sync`
