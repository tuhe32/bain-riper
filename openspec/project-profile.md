# bain-riper 项目 Profile

> **定位**：本文件是「换了项目必改」信息的**唯一存放处**。
> `.qoder/rules/` 下的规则文件与 `openspec/config.yaml` 通过硬路径引用本文件，
> 实现两层架构：**核心套件跨项目复用 / 只换 Profile**。
>
> **移植到新项目时**：只需修改本文件，`.qoder/rules/` 下除宪法 §3/§7/§8 少量条款外均无需改动。
>
> **当前项目**：bain-riper

---

## §1 技术栈

| 项 | 值 |
|---|---|
| 语言版本 | JDK 21 |
| 框架 | Spring Boot 3.5.9 |
| ORM | MyBatis-Plus |
| 数据库 | MySQL |
| Web 容器 | Undertow |
| 构建工具 | Maven（多模块，根 POM `/pom.xml` 聚合 `admin/`） |
| 核心依赖 | MapStruct Plus 1.5.0 / Lombok 1.18.42 / Redisson / Jasypt 3.0.5 / EasyExcel |
| 测试框架 | JUnit 5 (spring-boot-starter-test) |

## §2 项目骨架

| 项 | 值 |
|---|---|
| Maven groupId | `com.reference` |
| 业务模块（唯一） | `admin/` |
| 基础包路径 | `admin/src/main/java/com/reference/` |
| Mapper XML 路径 | `admin/src/main/resources/mapper/` |
| 建表 SQL 路径 | `script/SQL/` |
| 参考代码路径 | `docs/reference-code/` |
| 知识库路径 | `.qoder/repowiki/zh/content/` |
| 构建命令 | `cd admin && mvn clean package -DskipTests` |
| 测试命令 | `cd admin && mvn test` |
| 本地运行 | IDEA 启动 `com.reference.Application#main` 或 `cd admin && mvn spring-boot:run` |

## §3 标准分层目录

```
<base-package>/               ← 基础包路径见 §2
├── controller/               # REST API 端点
├── service/                  # 业务接口
│   └── impl/                 # 业务实现
├── mapper/                   # MyBatis Mapper 接口
├── domain/                   # 实体（Entity）
│   ├── bo/                   # 业务对象（BO，承载查询/新增/修改参数）
│   └── vo/                   # 返回视图对象
├── constant/                 # 枚举与常量
└── config/                   # Spring 配置与工具类
```

- 新增实体 / Mapper / Service / Controller **必须**落在上述目录
- 常量/枚举统一 `constant/`
- 工具类与 Spring 配置统一 `config/`

## §4 领域约定

| 项 | 值 |
|---|---|
| 多租户字段 | `tenant_id`（所有业务表、DTO、Mapper 查询必含） |
| 实体基类 | `TenantModel`（binfast 框架提供） |
| Mapper 基类 | `BinBaseMapper<T>`（binfast 框架提供） |
| 表名注解 | `@TableName("table_name")`（snake_case） |
| API 文档注解 | `@ApiModelProperty` |
| 响应风格 | RESTful |
| 异常规范 | 统一用 `BusinessException`，禁止直接抛 `RuntimeException` |
| Commit 风格 | Conventional Commits |

## §5 参考模板（八层标杆，基于 RuoYi-Vue-Plus）

新增 CRUD / 导入导出 / 权限 / 分页等常规功能时，必须以
`docs/reference-code/` 下 `EmployeeTraining` 示例的继承结构、注解写法、分页约定、多租户处理方式为准。
参考代码对齐 [RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus) 5.X 代码生成模板风格：

| 层次 | 参考文件 |
|---|---|
| Controller | `controller/EmployeeTrainingController.java` |
| Service 接口 | `service/IEmployeeTrainingService.java` |
| Service 实现 | `service/impl/EmployeeTrainingServiceImpl.java` |
| Mapper 接口 | `mapper/EmployeeTrainingMapper.java` |
| Mapper XML | `resources/mapper/EmployeeTrainingMapper.xml` |
| Entity 实体 | `domain/EmployeeTraining.java` |
| 业务对象 BO | `domain/bo/EmployeeTrainingBo.java` |
| 返回 VO | `domain/vo/EmployeeTrainingVo.java` |

## §6 repowiki 章节目录

基于 `.qoder/repowiki/zh/content/` 的中文章节结构，变更类型 → 主章节映射：

| 变更类型 | 候选章节（按命中率排序，选最相关的 1-2 个） |
|---|---|
| 新增业务功能 | `核心功能模块/`、`API接口文档/` |
| 数据模型变更 | `数据模型设计/` |
| 架构/组件调整 | `系统架构设计/` |
| 配置/环境变更 | `配置管理/`、`部署与运维/` |
| 权限/安全相关 | `安全与权限/` |
| 开发规范相关 | `开发指南/` |

> 移植到新项目时，本节是整个 Profile 中**唯一需要根据 repowiki 目录树重新填写**的章节。

---

_本文件版本：v1.0；修改时同步检查 `.qoder/rules/` 与 `openspec/config.yaml` 中的引用是否仍有效。_
