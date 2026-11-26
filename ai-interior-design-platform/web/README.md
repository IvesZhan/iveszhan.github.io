# System Web App

This directory is the system-level web product for the AI interior design platform.

Current deployment target:

```text
https://iveszhan.github.io/ai-interior-design-platform/web/
```

Deployment uses the account-level Pages repository:

```text
IvesZhan/iveszhan.github.io
```

The public output from this directory is published to:

```text
/ai-interior-design-platform/web/
```

## 3D 户型校对

新方案的原图上传可读取 RoomPlan 与 OpenPlan3D Editable Plan JSON。全屏工作台使用米制 `layout-review/v1` 数据，可打开空间检查并调整布局，或导出 JSON 后重新导入。

方案版本通过 `layoutScene` 关联布局模型。Pascal 依赖和构建方法见 `layout-review/vendor/pascal-build/README.md`。Three.js 运行时版本为 0.181.2，许可随模块发布。

## 实时 3D 方案与分享

在「新方案」上传一张有横纵尺寸标注的 PNG、JPEG 或 WebP 平面图即可开始。风格默认为奶油风，效果说明和设计想法可选。识别完成后可查看原图与识别摘要，也可以在生成前查看导入的 3D 户型。方案调整在独立工作台内进行。图片识别启用方式见 [Worker 说明](../../cloudflare/README.md#图片户型识别)。RoomPlan / OpenPlan3D JSON、平台户型 JSON 与标准毫米制 DXF 可走同一流程。DWG 依赖已有转换服务。

生成后保存实时 3D V1，并进入现有方案预览页。左侧是当前版本的整屋鸟瞰图，右侧显示方案概览、户型图和「打开 3D 工作台」。从右侧进入独立编辑页，工作台和服务端共用米制 `layout-review/v1`。工作台可切换 2D、剖切鸟瞰和第一人称漫游。任何历史版本都可以继续编辑。保存时可覆盖当前查看的版本，或从该版本新建下一版。返回方案会展示刚保存的版本。业主链接绑定版本编号并显示该版本最新保存的内容，可附房间或家具反馈。复杂非正交户型可沿用原 3D 校对器。

实时 3D V1 会依据明确的沙发尺寸、餐桌形状及尺寸和座数调整家具。例句为「客厅沙发 2.4 米 × 90 厘米；餐厅放直径 1.15 米的四人圆桌」。布局无法容纳或要求需要补充时，设计师可在该版本的「设计要求」查看待确认内容。

大成乐府奶油风样板使用 Floorplan Studio 展示四房布局和客餐厅风格参考。照片级全屋效果图和 2:1 VR 渲染待另行验证。

本机联调可在 `127.0.0.1:8141` 提供 `apps/`，普通 Worker 使用 `127.0.0.1:8011`。启动本地 Worker 时通过 `--var ALLOWED_ORIGINS:http://127.0.0.1:8141` 允许网页来源。D1 迁移与设计师登录配置见 `cloudflare/README.md`。素材来源和许可证见 `layout-review/assets/` 下的来源记录。glTF 加载器和配套几何工具跟 Three.js 一样固定在 0.181.2。

## VR 背景音乐

方案版本可在 `vrPackage.shareMeta.backgroundMusic` 配置 `url`、`title` 和可选的 `credit`。服务端记录可用 `share_meta` 保存同一配置。音频应随方案一起部署，便于持续访问与授权管理。

网页在用户点击「音乐」后开始循环播放。切换房间、进入或退出同一版本的全屏模式会继续播放。离开 VR 或切换方案版本时停止，单空间调整保留原方案的音乐配置。
