# 云瞻开放平台内部知识库 V2

本项目是云瞻开放平台的内部工作知识门户，用于统一业务认知、工作规则、标准流程与组织经验。知识内容同时维护“现行、计划调整、待复核、历史”状态，只有标记为现行且经过负责人确认的规则可以作为当前执行口径。

正式服务器地址：<https://zsk.iyunzhanle.cn/>（飞书登录、分级权限和数据库持久化）

GitHub Pages 兼容地址：<https://fd918.github.io/yunzhan/>（只读静态备份）

> 正式服务器通过飞书身份登录并按账号分配查看、编辑或管理员权限。GitHub Pages 兼容地址仍使用浏览器端临时共享密码，只能作为只读备份，不能承载敏感内容或数据库写入。

正式服务器构建时设置 `NEXT_PUBLIC_SERVER_AUTH=true`，由服务端统一拦截页面与接口访问，不再加载 `public/access-gate.js`。静态兼容版继续保留该脚本，同一标签页验证一次后不重复提示；源码只保存密码校验摘要，不记录明文密码。

## 知识结构

11 个一级模块及其配置编号如下：

| 编号 | 模块 | 配置值 | 新页面目录 |
| --- | --- | --- | --- |
| 01 | 平台与业务 | `platform` | `public/pages/platform/` |
| 02 | 业务规则中心 | `rules` | `public/pages/rules/` |
| 03 | SOP中心 | `sop` | `public/pages/sop/` |
| 04 | 数据指标中心 | `metrics` | `public/pages/metrics/` |
| 05 | 岗位与培训 | `roles` | `public/pages/roles/` |
| 06 | 协作中心 | `collaboration` | `public/pages/collaboration/` |
| 07 | 问题处理中心 | `troubleshooting` | `public/pages/troubleshooting/` |
| 08 | AI与自动化 | `automation` | `public/pages/automation/` |
| 09 | 模板中心 | `templates` | `public/pages/templates/` |
| 10 | 项目中心 | `projects` | `public/pages/projects/` |
| 11 | 复盘与经验库 | `reviews` | `public/pages/reviews/` |

新人入口配置在 `app/knowledge-data.ts` 的 `onboardingEntry`。当前首页已展示“新人从这里开始”和 Day 1、3、7、15、30 学习路径，状态为“建设中”，暂时没有独立新人知识页。

## 当前已上线页面

知识库首页位于 `app/page.tsx`，公网路径为 `/yunzhan/`。当前共上线 25 篇正式知识：

| 模块 | 篇数 | 主要内容 |
| --- | ---: | --- |
| 平台与业务 | 3 | 平台业务体系、业务状态、平台工具与产品能力 |
| 业务规则中心 | 5 | 本地生活规则、全业务台账、推广合规、推广活动、提现税务发票 |
| SOP中心 | 4 | 链接密令、工单、数据订单、实名支付审批 |
| 数据指标中心 | 1 | 业务数据、订单、佣金与结算指标词典 |
| 岗位与培训 | 2 | 客服职责与培训规范、新人打卡训练营 |
| 协作中心 | 1 | 商务、客服、技术、产品与财务责任矩阵 |
| 问题处理中心 | 3 | 客服高频问题、账号实名、订单佣金与对账处理 |
| AI与自动化 | 1 | 飞书群聊知识沉淀与发布流水线 |
| 模板中心 | 1 | 客服通知、等待、升级与关闭话术模板 |
| 项目中心 | 3 | GEO 运营策略、客服工单治理、独立售卖系统资料索引 |
| 复盘与经验库 | 1 | 历史政策、运营事件与可复用经验 |

15 篇群聊知识页面由 `scripts/generate-group-knowledge-pages.mjs` 统一生成，生成命令为 `npm run knowledge:generate`。页面仍作为正式 HTML 文件纳入版本管理，便于全文搜索、网页编辑和 GitHub Pages 发布。

2026-08-13 从用户提供的 7 个飞书知识库节点及其 2 个直接下级节点提取 778 个内容块，按顶层来源分别整理为 7 篇独立知识页：账号实名、推广活动、订单对账、提现税务发票、平台工具产品、新人训练营和独立系统资料。源文档中的金额、费率、门槛、时效和产品状态若缺少当前负责人确认，统一标记为“待确认”，不直接作为现行承诺。

当前知识来源覆盖 6 个飞书群、111,625 条去重消息，消息范围为 2023-10-20—2026-08-17。2026-08-17 首次周度运行抓取原有 4 群上周消息 515 条，与既有全量基线按消息 ID 去重后新增 146 条；同日自动发现并首次全量补抓需求讨论群 10,372 条、云瞻核心群 1,268 条：

| 群 | 去重消息数 | 主要沉淀方向 |
| --- | ---: | --- |
| 商务&客服业务沟通群 | 18,324 | 业务规则、活动口径、链接密令、数据与结算 |
| 客服问题反馈处理群 | 48,632 | 问题案例、排查步骤、处理结论与升级 |
| 客服中心内部沟通群 | 13,265 | 岗位制度、值班交接、审批与培训 |
| 客服问题反馈处理群-通知群 | 19,764 | 历史工单与周度新增工单的分类、优先级、状态与时效 |
| 需求讨论群 | 10,372 | 产品诉求、排期讨论、上线反馈和历史决策，按需求状态判断是否已上线 |
| 云瞻核心群 | 1,268 | 经营决策、跨部门统一口径、重点业务风险和上线确认 |

原始群聊不进入公网站点；手机号、证件、账号密码、订单号、客户资料和附件原文均不发布，只保留脱敏后的规则、方法和汇总统计。

平台介绍与 GEO 运营策略是现有成熟知识。没有明确需求时，不改写其正文、数据、图表或原有知识逻辑。

## 源码与部署仓库

当前采用“私有源码仓库 + 正式服务器 + 公开静态备份仓库”的分离方式。正式服务器提供飞书登录、权限和数据库；公开仓库只保存可公开的静态成品。

| 仓库 | `main` 内容 | 用途 |
| --- | --- | --- |
| `fd918/simple-dashboard`（私有） | 原始源码 | 长期维护 React/Next.js 页面、知识配置、模板、样式、测试和构建配置 |
| `fd918/yunzhan`（公开） | GitHub Pages 兼容部署产物 | 保存 `index.html`、`_next/`、`__next...`、`pagefind/` 等静态构建结果，作为只读备份 |

私有源码仓库必须长期保留以下内容：

- `app/`：首页、交互和 `app/knowledge-data.ts` 知识配置；
- `public/`：正式 HTML 知识页、官方 Logo 和公共样式；
- `public/access-gate.js`：全站临时共享密码门槛；
- `templates/page-template.html`：新知识页模板；
- `package.json`、`next.config.ts`、`tsconfig*.json`：依赖和构建配置；
- `tests/`：自动化检查；
- `scripts/generate-group-knowledge-pages.mjs`：15 篇群聊知识页面的统一生成源；
- `.github/workflows/deploy-pages.yml`：GitHub Pages 构建流程配置。
- `server/`：正式服务器、飞书 OAuth、会话、权限接口和数据库迁移命令；
- `database/`：正式 PostgreSQL 正向迁移与回滚脚本；
- `scripts/build-server-release.mjs`：生成不含真实密钥的 Windows 服务器发布包。

`out/`、`.next/`、`public/pagefind/` 是可重新生成的构建产物，已由 `.gitignore` 排除，不进入私有源码仓库的 Git 版本记录。公开部署仓库出现这些文件属于正常现象。

## 网页内编辑与标记

所有正式知识页和看板已统一加载 `public/knowledge-editor.js`。打开知识页面后，左下角提供“编辑内容”按钮，可直接修改正文，并支持加粗、黄色标记、红色标记、绿色标记、清除格式、撤销、保存草稿、导出修改稿和恢复正式版。

- “保存草稿”只保存到当前浏览器的本机存储，刷新页面或关闭浏览器后仍可恢复；其他人员不会看到该草稿；
- `Command/Ctrl + S` 可快速保存，`Esc` 可退出编辑；
- 粘贴内容统一按纯文本写入，避免把外部网页脚本或复杂格式带入知识库；
- “导出修改稿”会下载包含当前修改的完整 HTML，正式发布时用该文件更新私有源码，再执行 GitHub 发布流程；
- “恢复正式版”会删除当前页面的本机草稿并重新加载线上版本；
- GitHub 密钥不得写入公开网页，因此当前编辑器不会在浏览器内直接提交或发布正式内容。

新建知识页时必须保留对 `knowledge-editor.js` 的引用，并通过 `data-yz-editor-root` 标记允许编辑的正文区域。普通知识页模板已经包含该配置。

## 待确认知识工作台

左侧“知识门户”提供“待确认知识”入口。正式服务器使用飞书 OAuth 登录和 PostgreSQL 持久化，不建立独立账号密码；本企业飞书账号第一次登录会自动成为“查看者”。账号与权限入口位于左下角登录账号信息区，不混入待确认知识工作台。跨企业账号会被拒绝，管理员手动停用的账号不会在再次登录时自动恢复。

权限分为五级：

| 角色 | 可用能力 |
| --- | --- |
| 查看者 | 查看已发布知识和全文搜索，不能进入审核工作台 |
| 编辑者 | 查看、新建和修改候选知识，不能批准发布或管理账号 |
| 发布者 | 查看、编辑、确认并发布知识，不能管理账号 |
| 管理员 | 查看、编辑、发布，并可设置普通成员的查看者、编辑者、发布者权限；不能管理其他管理员 |
| 超级管理员 | 查看、编辑、发布，可新增或调整管理员；“谭文杰”账号固定为受保护的超级管理员，其他账号不能修改或停用 |

候选知识支持以下流程：

1. 飞书群聊、飞书文档或人工录入形成候选，保留来源日期和原始摘录；
2. 系统按标题与内容提供建议模块、建议知识页，金额、费率、日期和门槛类标记为动态口径；
3. 审核人修改为脱离聊天上下文后可直接执行的正式知识，选择最终模块与页面；
4. 编辑者保存后进入“修改中”，发布者、管理员或超级管理员可以驳回；
5. 发布者、管理员或超级管理员点击“确认并发布”后记录审核人和时间，内容即时进入所选知识页的“审核确认补充”章节并加入服务端搜索；
6. 浏览器不持有飞书应用密钥、数据库密码或 GitHub 密钥，所有写入与发布动作都由服务端校验会话和角色。

正式基础迁移位于 `database/001_knowledge_workbench.sql`，超级管理员与发布者角色迁移位于 `database/002_super_admin_permissions.sql`；对应角色回滚位于 `database/002_super_admin_permissions.rollback.sql`：

- `knowledge_users`：保存飞书用户标识、显示名、角色、启用状态和最后登录时间；
- `knowledge_sessions`：只保存随机会话令牌的哈希和过期时间；
- `knowledge_candidates`：保存候选知识、状态、风险、建议目录、最终目录、来源和审核字段；
- `knowledge_candidate_events`：保存每次新建、修改和状态变化的操作记录。
- `knowledge_auth_audit`：记录登录、登出和权限调整等安全事件。

基础迁移只新增上述五张表、约束和索引；角色迁移仅扩展知识库用户角色约束，并把现有“谭文杰”账号升级为唯一超级管理员。两者都不修改“云瞻数据看板”的数据库表或现有知识页。正式回滚前先用 `pg_dump` 备份 `yunzhan_knowledge` 数据库，再停止 `YunzhanKnowledgeWeb` 任务并执行对应回滚脚本；GitHub Pages 静态备份不受影响。

飞书开发者后台的安全重定向地址固定为 `https://zsk.iyunzhanle.cn/auth/feishu/callback`。真实 `FEISHU_APP_SECRET`、数据库密码、会话签名密钥和首次管理员令牌只允许保存在服务器 ACL 保护的 `.env` 或本地安全存储，不得提交 Git。

2026-08-18 已登记上述回调并完成首位超级管理员初始化。后续本企业新账号首次登录自动获得查看权限；管理员或超级管理员在左下角账号区点击“账号与权限”。普通管理员可以设置成员为查看者、编辑者或发布者；只有超级管理员可以设置管理员。账号确需禁止访问时再点击“停用”；不再重复使用首次管理员令牌。

服务器发布命令为 `npm run build:server`。产物生成在被 Git 忽略的 `release/knowledge-server/`，服务监听 `127.0.0.1:8792`，由 Nginx 对外提供 `zsk.iyunzhanle.cn` HTTPS；Windows 计划任务名称为 `YunzhanKnowledgeWeb`。

### 正式服务器独立发布架构

正式服务器采用“共享入口、站点隔离”的发布结构：公共 Nginx 只在主配置中加载一次 `C:/nginx/conf/sites-enabled/*.conf`，每个网站单独维护自己的站点配置、应用目录、端口、数据库和 Windows 计划任务。

| 项目 | 知识库 | 云瞻数据看板 |
| --- | --- | --- |
| 应用目录 | `C:\apps\yunzhan-knowledge` | 保持原项目正式目录，不由知识库发布覆盖 |
| 本机端口 | `127.0.0.1:8792` | `127.0.0.1:8791` |
| 计划任务 | `YunzhanKnowledgeWeb` | `YunzhanDashboardWeb` |
| Nginx 站点配置 | `C:\nginx\conf\sites-enabled\yunzhan-knowledge.conf` | 使用数据看板自己的站点配置 |
| 数据库 | 独立 `yunzhan_knowledge` | 保持数据看板原数据库 |

日常应用发布只替换本项目目录并重启 `YunzhanKnowledgeWeb`，不停止公共 Nginx，不重启其他项目任务，也不修改其他站点配置。只有域名、证书或反向代理规则发生变化时，才先执行 `nginx -t`，再通过 SYSTEM 权限的计划任务平滑重载 Nginx；证书续期也复用同一安全重载方式，避免普通登录用户无法通知 Nginx 主进程。

每次正式发布前必须分别备份应用目录和本项目站点配置；发布后同时验证知识库健康接口、飞书登录跳转、数据看板登录页及两个计划任务状态。知识库回退只恢复本项目备份并重启 `YunzhanKnowledgeWeb`，不得覆盖共享主配置、其他站点目录或数据看板服务。

## 新增一篇知识

如果修改本轮 15 篇群聊知识页，应优先修改 `scripts/generate-group-knowledge-pages.mjs`，再执行 `npm run knowledge:generate`，避免下次生成时覆盖手工修改。其他独立知识页按以下流程新增。

### 1. 创建知识页面

复制 `templates/page-template.html`，放到所属模块目录。目录不存在时直接新建。例如新增业务规则：

```text
public/pages/rules/meituan-rules.html
```

文件名使用稳定、简短的英文或拼音小写名称，单词之间用短横线连接。不要移动现有的 `public/yunzhan.html` 和 `public/geo-strategy-dashboard.html`。

### 2. 填写页面元信息和正文

在新 HTML 中填写：

- 所属模块；
- 页面标题和简介；
- 页面状态；
- 最后更新时间；
- 内容来源、生效日期和更新时间；
- 正文。

正文区域必须保留 `data-pagefind-body`，否则 Pagefind 不会收录。导航、页脚等重复内容使用 `data-pagefind-ignore`。

### 3. 登记知识配置

修改 `app/knowledge-data.ts` 的 `knowledgePages`，登记模块、标题、状态和更新时间：

```ts
{
  id: "meituan-rules",
  module: "rules",
  title: "美团业务规则",
  shortTitle: "美团业务规则",
  description: "查询美团业务当前佣金、结算和推广限制。",
  url: "pages/rules/meituan-rules.html",
  keywords: ["美团", "佣金", "结算", "推广规则"],
  status: "已上线",
  updatedAt: "2026-08-10",
  featured: false,
}
```

维护规则：

- `module` 必须使用上表中的配置值；
- `title` 是完整标题，`shortTitle` 是导航短标题；
- 只有可以正式打开的知识页才登记到 `knowledgePages`，当前页面状态填写 `已上线`；
- `updatedAt` 使用 `YYYY-MM-DD`，每次正文发生有效修改时同步更新；
- 模块整体状态在 `knowledgeModules` 中维护，可用 `已上线`、`部分上线`、`建设中`；
- 首页的模块数量、最近更新和导航会从配置自动计算，不要重复手工修改首页数据。

### 4. 生成搜索并验证

在 macOS 终端进入项目目录：

```bash
cd "/Users/tanwenjie/Documents/看板项目"
npm test
npm run lint
```

`npm test` 会先执行构建和 Pagefind 索引生成，再运行自动化检查。至少确认新页面能打开、标题和正文关键词能被搜索、模块数量与更新时间正确、移动端没有横向滚动，并再次检查页面不含敏感信息。

## Pagefind 全文搜索

项目使用 Pagefind 1.5.2，索引 `public/` 中带 `data-pagefind-body` 的 HTML 页面。搜索在浏览器本地完成，不使用数据库或外部搜索 API。

手动生成命令：

```bash
npm run search:index
```

索引生成到 `public/pagefind/`，随后静态导出会把它复制到 `out/pagefind/`。以下命令都会在开始时自动重新生成索引：

- `npm run dev`；
- `npm run build`；
- `npm run build:github-pages`；
- `npm test`。

因此不需要手工编辑或提交 Pagefind 文件。新增知识后，必须先重新构建，再把新的静态成品推送到公开部署仓库；公开仓库 `main` push 后，GitHub Pages 会发布已经包含新 Pagefind 索引的成品。

## 每周飞书群聊增量更新

每周一 09:00（北京时间）自动处理上一周周一 00:00 至周日 23:59:59 的群聊消息。默认动态读取“信息整理小助手”当前所在的全部群，并与私密群状态登记表对比：已经完成初始化的群只抓上一自然周；新发现或上次尚未完成知识发布的群，会从最早可读取消息抓取到本次任务开始时间。首次全量知识成功发布后，才将该群确认成已初始化，下一次自动转为普通周度增量。

群状态登记表保存在被 Git 忽略的 `work/feishu-weekly/chat-capture-state.json`。首次启用新机制时，会从已有私密抓取记录识别已处理过的群，避免把原有群误判为新群重复全量抓取。若知识整理、构建或公网发布中途失败，不执行初始化确认，新群下次仍会重新全量抓取，防止知识遗漏。

如需排除测试群或敏感群，在本机 `.env` 的 `FEISHU_WEEKLY_EXCLUDED_CHAT_IDS` 中填写群 ID。旧的 `FEISHU_WEEKLY_CHAT_IDS` 白名单仍兼容，但启用白名单会阻止自动发现白名单外的新群；要使用默认的新群发现能力，应保持白名单为空。

自动流程包括：按群抓取消息和话题、去重、提炼规则与 SOP、识别变更和冲突、敏感信息扫描、更新生成源与知识页、重建搜索、运行测试、推送私有源码和公开静态成品、验证公网地址。金额、费率、日期、活动门槛等动态口径若没有清晰的正式确认，只能以“待复核”状态上架，不能自动替换现行规则。

2026-08-17 已按最新提炼规则对 6 个群 111,625 条去重历史消息完成一次全量上下文复核：先从 29,482 条广义业务候选中筛出 712 条明确决策候选，再按时间、话题、说话角色和后续替代通知逐条核对。该过程补齐了需求分级、内部数据保密、发单中台能力、密令白名单、淘宝归因、激励看板展示、日结垫资、版本费用生效、业务关停等知识；原始候选和消息上下文仍只保存在 Git 忽略的私密工作目录。

群聊类型不限制为客服群：需求讨论群应重点提炼需求状态、评审、排期、上线与验收；核心协作群应重点提炼最终决策、统一口径和跨部门结论。群内“已提开发”“准备排期”等过程消息不能直接写成已上线功能。

每次知识更新必须输出一份唯一的“知识点清单”，按 1、2、3……顺序逐条列明知识点、状态、适用边界和落入页面。当前任务结果与飞书成功卡片必须使用同一顺序、同一内容，不能只发送笼统摘要。群聊中出现“现行逻辑”“统一口径”“同步内部”“上线通知”“请知悉”等明确决策句时，必须单独形成知识候选并逐条核对，不能只归并进宽泛主题。

抓取结果仅写入被 Git 忽略的 `work/feishu-weekly/`，原始群聊不会进入公开仓库。成功发布后，脚本统一复用“云瞻数据看板”项目保存在 macOS 钥匙串中的飞书 Webhook 与签名密钥发送卡片通知，不发送到商务沟通群，也不在本项目重复保存 Webhook。卡片固定标明项目、运行环境、通知模块、状态与时间、说明、影响范围、处理结果、按顺序编号的知识点清单、公网入口和来源标识；通知文件每个非空行代表一条知识点，脚本统一整理为 1、2、3……编号。

本机配置集中保存在 `.env`，字段示例见 `.env.example`。真实 App Secret、群 ID 和其他认证信息不得提交到 Git、公开文档或截图。手工验证命令：

```bash
cd "/Users/tanwenjie/Documents/看板项目"
npm run feishu:weekly:capture
```

抓取完成后，必须在知识整理、测试、源码发布、公网发布与公网验证全部成功后，再确认本次首次全量群：

```bash
npm run feishu:weekly:finalize -- --manifest=work/feishu-weekly/YYYY-MM-DD_to_YYYY-MM-DD/manifest.json
```

确认失败时不得发送成功通知；未确认的新群下次任务会继续按首次全量处理。

## GitHub Pages 发布

当前实际发布流程如下：

1. 在私有源码仓库完成修改并运行 `npm test`、`npm run lint`；
2. 将源码修改提交到 `fd918/simple-dashboard`；
3. 使用公网仓库路径构建静态成品；命令会默认写入 `/yunzhan` 子路径和正式公网地址：

```bash
npm run build:github-pages
```

如需发布到其他仓库路径，才需要临时提供 `NEXT_PUBLIC_BASE_PATH` 和 `NEXT_PUBLIC_SITE_URL` 覆盖默认值。构建完成后必须确认 `out/index.html` 中的 CSS、JavaScript、Logo 和访问脚本均以 `/yunzhan/` 开头。

4. 将 `out/` 内容同步到公开仓库 `fd918/yunzhan` 的 `main` 根目录，同时保留 `.nojekyll`，并把本 README 同步为公开仓库 README；
5. 推送公开仓库 `main` 后，GitHub Pages 自动发布到 <https://fd918.github.io/yunzhan/>；
6. 发布完成后检查首页、Logo、CSS、JavaScript、`pagefind/pagefind.js` 和新增知识页均返回正常。

用户已授权本项目默认执行上述完整发布流程。后续知识库改动在测试通过且确认不含敏感信息后，默认同步推送私有源码仓库与公开静态成品仓库，无需再次单独确认 GitHub 推送。

注意：私有源码仓库当前套餐不支持直接启用 GitHub Pages，所以仅 push `fd918/simple-dashboard/main` 不会自动更新静态兼容站点。`.github/workflows/deploy-pages.yml` 保留同仓库 Pages 构建方案；正式业务入口以 `zsk.iyunzhanle.cn` 服务器版为准，`fd918/yunzhan` 仅作为静态只读备份。

## 本地运行

需要 Node.js 22.13.0 或更高版本。在 macOS 终端执行：

```bash
cd "/Users/tanwenjie/Documents/看板项目"
npm install
npm run dev
```

默认本地地址通常为 <http://localhost:3000/>，以终端实际显示为准。

## 维护边界

- `app/knowledge-data.ts` 是模块、知识页面、状态和更新时间的唯一配置入口；
- `templates/page-template.html` 是新增普通知识页的起点；
- `public/knowledge-page.css` 是普通知识页公共样式；
- `public/dashboard-navigation.css` 是现有看板统一章节导航样式；
- `public/access-gate.js` 是当前临时访问门槛，所有新增 HTML 知识页都必须保留对它的引用；
- `public/knowledge-editor.js` 是统一网页编辑工具，负责直接改字、加粗、标色、本机草稿和修改稿导出；
- `scripts/feishu-weekly-capture.mjs` 负责每周时间窗抓取、动态群列表、新群首次全量、两阶段初始化确认和成功通知，认证信息只从本机 `.env` 读取；
- 群聊提炼内容的生成源是 `scripts/generate-group-knowledge-pages.mjs`，修改生成页正文后必须重新生成并验证；
- 新人学习入口仍为建设中，只展示规划内容，不创建无正文的空页面；
- 除本次已确认的飞书登录、PostgreSQL 和正式服务器能力外，未明确提出前不再增加第二套数据库、登录或发布架构。
