---
name: requirement-breakdown
description: Parse large requirement documents (.docx/.doc), clarify functionality through multi-round Q&A with user, break down into independent OpenSpec change steps, and create inputs/requirement.md for each step. Use when the user provides a requirement document and wants to split it into incremental OpenSpec changes.
---

# 需求文档拆分（Requirement Breakdown）

将大需求文档（`.docx` / `.doc`）解析、澄清并拆分为多个独立的 OpenSpec change，每个 change 可单独 `/opsx:propose` 渐进实现。

## 前置条件

开始前确认：
- 用户已提供需求文档路径（`.docx` 或 `.doc`）
- `.qoder/repowiki/zh/content/` 知识库可访问
- `openspec/changes/` 目录存在

## 执行流程

### Step 1：读取知识库建立项目上下文

从 `.qoder/repowiki/zh/content/` 读取项目背景知识（最多 3 个主章节）：

1. **系统架构设计/** — 了解技术栈、分层目录、核心依赖
2. **核心功能模块/** — 了解现有功能模块，判断新需求归属
3. **数据模型设计/** 或 **安全与权限/** — 按需求类型补充（数据密集型→数据模型，涉及权限→安全与权限）

> 读取策略：先 `list_dir` 查看章节目录，再 `read_file` 只读 3-4 个最相关的 .md。
> 同 session 内已读章节不重复读取。

### Step 2：解析需求文档

读取用户提供的 `.docx` 或 `.doc` 文件，提取核心内容：

- 功能模块划分
- 数据实体及字段
- 业务流程与交互
- 接口列表
- 非功能性需求

> 如果文档格式为 `.doc`（旧格式），先尝试直接解析；若失败则提示用户转换为 `.docx` 后重试。

### Step 3：多轮对话澄清（必须用 AskUserQuestion）

基于文档内容与业务复杂度，**不设固定轮次上限**，持续对话直到以下条件全部满足：
- 所有功能模块的边界已明确（包含 / 不包含什么）
- 所有数据实体字段、关联关系、多租户策略已确认
- 各模块的实现优先级和依赖关系已排序
- 文中模糊表述（如「支持多种方式」「后续扩展」）已逐一澄清为具体方案
- 拆分后的每个 change 均已确认为独立可交付

**每轮必须用 `AskUserQuestion` 提交选择题**（二选一或三选一），禁止开放式文本问题。

**澄清维度 checklist**（逐项覆盖，未澄清不进入 Step 4）：
- [ ] 功能边界：各模块的包含/不包含范围
- [ ] 数据模型：实体字段、关联关系、多租户策略
- [ ] 实现优先级：哪些模块先做、哪些可后置
- [ ] 技术细节：是否涉及新依赖、新中间件、数据迁移
- [ ] 拆分粒度：确认拆分后的每个 change 是否独立可交付
- [ ] 模糊表述消歧：文档中所有不确定描述均已确认

**结束条件**：用户显式回复「澄清完毕 / 没有更多问题 / 可以开始拆分」或 checklist 全部通过且用户确认，方可进入 Step 4。

### Step 4：拆分并落盘

澄清完成后，将需求拆分为多个独立实现步骤。每个步骤：

1. **确定 `<name>`**：英文短横线命名（如 `add-employee-training-crud`）
2. **创建目录**：`openspec/changes/<name>/`
3. **创建 inputs 子目录**：`openspec/changes/<name>/inputs/`
4. **写入需求文件**：`openspec/changes/<name>/inputs/requirement.md`

`requirement.md` 尽可能包含：

```markdown
# [步骤中文标题]

## 关联模块
- 所属功能模块：XXX
- 依赖的上游 change：<name>（无则填「无」）

## 功能描述
[该步骤要实现的核心功能，详细描述]

## 数据范围
- 涉及实体/表：XXX
- 新增字段：[列出或填「无」]

## 接口清单
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /xxx | 分页查询 |
| POST | /xxx | 新增 |

## 不包含
[不包含的功能]

## 代码结构

## 验收标准
- [ ] XXX
- [ ] XXX
```

### Step 5：输出拆分总览

#### 5.1 输出拆分全貌表格

```
| 序号 | Change Name | 标题 | 依赖 | 启动命令 |
|------|-------------|------|------|----------|
| 1    | xxx         | XXX  | 无   | `/opsx:propose openspec/changes/xxx/inputs/requirement.md` |
| 2    | yyy         | YYY  | xxx  | `/opsx:propose openspec/changes/yyy/inputs/requirement.md` |
```

#### 5.2 输出执行指引

提示用户：
> 按依赖顺序逐个执行。在**新对话**中直接复制启动命令即可开始实现，Change Name 是唯一标识，不会因序号混淆出错。

## 约束

- 每个 change 必须是**独立可交付**的功能增量
- 拆分后的 change 数量建议 ≤ 5 个（超过时与用户二次确认）
- 所有实体默认含多租户字段，除非确认为全局共享表
- 技术判断以 `.qoder/repowiki/` 和 `openspec/project-profile.md` 为准，不猜测
- 命名遵循 OpenSpec 规范：英文、短横线、小写
