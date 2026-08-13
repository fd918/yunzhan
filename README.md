# 云瞻开放平台内部知识库 V2

本项目是云瞻开放平台的内部工作知识门户，用于统一业务认知、工作规则、标准流程与组织经验。当前阶段只维护 V2 框架和已确认知识，不继续调整首页设计，也不在没有明确需求时重构现有功能。

公网地址：<https://fd918.github.io/yunzhan/>

> 当前站点通过公开链接访问，并设置了临时共享密码门槛，但这只是浏览器端校验，不是真正的登录或权限控制。禁止录入 API Key、Token、Cookie、密码、私钥、数据库连接信息、个人隐私、客户名单、未公开财务数据、未公开经营数据及其他不适合公开的信息。“内部知识库”只是内容定位，不代表访问受限。

临时访问门槛由 `public/access-gate.js` 统一维护，覆盖首页、现有正式页面和后续知识页模板。同一标签页验证一次后不重复提示，关闭标签页后需要重新输入。源码只保存密码校验摘要，不在 README 或代码中记录明文密码；更换密码时需要重新生成 SHA-256 摘要并更新 `PASSWORD_HASH`。这是过渡方案，后续应替换为飞书登录等服务端身份鉴权。

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

- 知识库首页：`app/page.tsx`，公网路径 `/yunzhan/`；
- 云瞻开放平台与业务体系介绍：`public/yunzhan.html`，公网路径 `/yunzhan/yunzhan.html`；
- 云瞻开放平台 GEO 运营策略：`public/geo-strategy-dashboard.html`，公网路径 `/yunzhan/geo-strategy-dashboard.html`；
- 本地生活核心业务规则与客服口径：`public/pages/rules/local-life-business-rules.html`，公网路径 `/yunzhan/pages/rules/local-life-business-rules.html`。

平台介绍与 GEO 运营策略是现有成熟知识。没有明确需求时，不改写其正文、数据、图表或原有知识逻辑。

## 源码与部署仓库

当前采用“私有源码仓库 + 公开静态成品仓库”的简单分离方式，不需要调整项目结构。

| 仓库 | `main` 内容 | 用途 |
| --- | --- | --- |
| `fd918/simple-dashboard`（私有） | 原始源码 | 长期维护 React/Next.js 页面、知识配置、模板、样式、测试和构建配置 |
| `fd918/yunzhan`（公开） | GitHub Pages 部署产物 | 保存 `index.html`、`_next/`、`__next...`、`pagefind/` 等构建结果并提供公网访问 |

私有源码仓库必须长期保留以下内容：

- `app/`：首页、交互和 `app/knowledge-data.ts` 知识配置；
- `public/`：正式 HTML 知识页、官方 Logo 和公共样式；
- `public/access-gate.js`：全站临时共享密码门槛；
- `templates/page-template.html`：新知识页模板；
- `package.json`、`next.config.ts`、`tsconfig*.json`：依赖和构建配置；
- `tests/`：自动化检查；
- `.github/workflows/deploy-pages.yml`：GitHub Pages 构建流程配置。

`out/`、`.next/`、`public/pagefind/` 是可重新生成的构建产物，已由 `.gitignore` 排除，不进入私有源码仓库的 Git 版本记录。公开部署仓库出现这些文件属于正常现象。

## 新增一篇知识

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

## GitHub Pages 发布

当前实际发布流程如下：

1. 在私有源码仓库完成修改并运行 `npm test`、`npm run lint`；
2. 将源码修改提交到 `fd918/simple-dashboard`；
3. 使用公网仓库路径构建静态成品：

```bash
NEXT_PUBLIC_BASE_PATH="/yunzhan" \
NEXT_PUBLIC_SITE_URL="https://fd918.github.io/yunzhan" \
npm run build:github-pages
```

4. 将 `out/` 内容同步到公开仓库 `fd918/yunzhan` 的 `main` 根目录，同时保留 `.nojekyll`，并把本 README 同步为公开仓库 README；
5. 推送公开仓库 `main` 后，GitHub Pages 自动发布到 <https://fd918.github.io/yunzhan/>；
6. 发布完成后检查首页、Logo、CSS、JavaScript、`pagefind/pagefind.js` 和新增知识页均返回正常。

用户已授权本项目默认执行上述完整发布流程。后续知识库改动在测试通过且确认不含敏感信息后，默认同步推送私有源码仓库与公开静态成品仓库，无需再次单独确认 GitHub 推送。

注意：私有源码仓库当前套餐不支持直接启用 GitHub Pages，所以仅 push `fd918/simple-dashboard/main` 不会自动更新公网站点或线上搜索索引。`.github/workflows/deploy-pages.yml` 保留了同仓库 Pages 构建方案，但当前正式上线以 `fd918/yunzhan` 静态成品仓库为准。

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
- 建设中模块只在首页展示规划内容，不创建无正文的空页面；
- 未明确提出前，不新增数据库、后端、登录、AI 问答或复杂发布架构。
