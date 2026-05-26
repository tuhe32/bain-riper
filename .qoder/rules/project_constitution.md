---
trigger: always_on
---
# 项目宪法（Constitution）

**本文件是 AI 在本项目中进行任何对话、生成任何 artifact、修改任何代码时
必须遵守的最高优先级底线清单**。无论是否进入 OpenSpec 流程、无论当前
处于哪个 skill，以下十条条款始终生效。

> 等级说明：
> - 本宪法 **高于** `.qoder/rules/` 下的所有其他规则文件。
> - 其他规则文件定义「怎么做」，宪法定义「**绝对不可为**」。
> - 违反宪法 = 立即停止并向用户报错，不允许以"更好的方案"为由绕开。

---

## §1 Spec is Truth（真相源优先）
OpenSpec 的 `spec.md` / `design.md` / `tasks.md` 是业务行为的**唯一真相源**。
代码、文档、口头约定与 spec 冲突时，**先改 spec，再改其他**。
Reverse Sync 五步法见 `.qoder/rules/openspec_reverse_sync.md`。

## §2 Restate First
在生成任何 artifact（proposal / design / spec / tasks）或开始实施任何任务前，
必须先用 ≤8 行复述「目标 / 边界 / Done Contract / 风险」并等待用户明确确认。
未确认禁止进入后续步骤。详见 `.qoder/rules/openspec_preflight.md` §零。

## §3 多租户字段完整性
所有业务实体、数据表、DTO、Mapper 查询必须包含多租户字段并正确过滤，
除非该实体被知识库明确列为全局共享表（如字典、系统配置）。新增业务表
缺失多租户字段即视为违宪。
> 具体字段名、基类及知识库路径见 `openspec/project-profile.md` §4 / §2。

## §4 SHALL / MUST 关键字
`spec.md` 的每条 Requirement 必须以 `SHALL` 或 `MUST` 开头，否则
`openspec archive` 会直接失败。禁止使用 should / may / will 等弱动词。

## §5 禁止重复造轮子
新增任何功能前必须：
1. 检索仓库现有实现（同名 / 同语义的类、工具方法、Service）
2. 核对 `pom.xml` 与 `admin/pom.xml` 已有依赖
3. 只有现有代码与依赖均不能满足时，才允许新增

禁止引入功能重复的依赖或重复实现已有工具类。

## §6 禁止猜测第三方 API
若在 `docs/reference-code/` 与仓库现有实现中未找到同类型用法，
必须先阅读该包的源码或官方 README 确认 API 存在且版本兼容，
再在 artifact 或代码中引用具体类名 / 方法名。严禁"假设 API 存在"式编码。

## §7 标准分层目录
所有 Java 类必须落在标准分层目录内，不得放在其他包。
> 完整目录树与路径约定见 `openspec/project-profile.md` §3；
> 附加资源路径（Mapper XML、建表 SQL）见 `openspec/project-profile.md` §2。

## §8 参考代码优先对齐
新增同类型功能（CRUD / 导入导出 / 权限 / 分页）必须以参考模板的
继承结构、注解写法、分页约定、多租户处理方式为准，不得自创风格。
> 参考模板完整文件清单见 `openspec/project-profile.md` §5。

## §9 禁止独立编译验证任务
`tasks.md` 禁止独立列出 `mvn clean compile` / `mvn compile` 等整体
编译验证步骤。单任务内「编译无错误」作为证据可保留，但不得单独用作
任务条目。

## §10 Preflight 自检物理可见
在执行 OpenSpec 任一 skill（propose / continue / explore / apply）的
Step 1 之前，必须按 `.qoder/rules/openspec_preflight.md` §二 完成自检，
并在主回复开头以可见形式展示已勾选项。未展示自检结果即视为未执行。

---

## 附：违宪处置流程
1. 立即**停止**当前动作
2. 在回复中**明示**违反条款编号
3. **回滚**已做改动（如有）
4. **等待用户**决定：调整需求 / 修订宪法 / 放弃任务

---

## 与其他规则文件的关系

| 文件 | 关系 |
|---|---|
| `.qoder/rules/openspec_preflight.md` | 本宪法的**执行手册**，定义写作前流程 |
| `.qoder/rules/openspec_output_specs.md` | 本宪法 §4 / §9 的**输出格式落地** |
| `.qoder/rules/openspec_specifications.md` | 本宪法 §7 的**目录约束索引层** |
| `openspec/config.yaml` | 向 openspec CLI 注入时提供 context / rules 双保险 |
| `openspec/project-profile.md` | 本宪法 §3 / §5 / §7 / §8 的具体值存放处；**移植项目时唯一需大改的文件** |

修改本宪法条款 = 变更项目底线，需团队讨论后谨慎执行。
