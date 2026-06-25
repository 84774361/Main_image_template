# SKU 通用模板稳定版记录

稳定版本：`20260625-sku-gap-same-category`

这个 profile 在面板里显示为 `SKU`，作为不同电商渠道通用的 SKU 主图模板入口。内部 profile id 仍保留为 `pddSkuGift`，用于兼容已有 PSD、CSV 字段和历史记录。

旧版 `PDD SKU` profile 代码保留用于历史回溯，但已从插件面板下拉选项隐藏，避免后续维护两套分叉逻辑。

## 保存路径

- GitHub repo: `https://github.com/84774361/Main_image_template.git`
- 本地工作区: `F:\SOFT\CODEX\PROJECT\Main_image_template`
- Obsidian vault: `F:\SOFT\Obsidian\data\Main image template`
- Obsidian 笔记: `F:\SOFT\Obsidian\data\Main image template\PDD_SKU_GIFT 模版记录.md`

## 默认路径

- PSD 模板: `F:\NEWPAGE\AI生图\批量生图测试\PDDSKU\02\PDD_SKU_GIFT_Template.psd`
- 默认 CSV: `F:\NEWPAGE\AI生图\批量生图测试\PDDSKU\02\sku-防晒40ml+叮叮喷雾100ml.csv`
- 素材目录: `F:\NEWPAGE\AI生图\批量生图测试\assets`
- 导出目录: `F:\NEWPAGE\AI生图\批量生图测试\PDDSKU\02\export`

## 当前稳定规则

- 产品图默认调用 `front` 视角；产品名称表里的 `angle` 或无视角路径会按当前 profile 归一到 `front`。
- 未写前缀的产品名默认按婴童产品匹配。
- `txt.mainProductLabel` 解析主品区产品，放入 `product.area`。
- `txt.giftProductLabel` 解析赠品区产品，放入 `gift.area`。
- `product.count` 和 `gift.count` 不依赖 CSV 旧列，按 `txt.mainProductLabel` / `txt.giftProductLabel` 计算。
- 促销机制标题使用 `txt.promoTitle`；旧名 `txt.bottomText` 继续兼容，便于旧 PSD / CSV 逐步迁移。
- `txt.mainProductLabel` 和 `txt.giftProductLabel` 保持 PSD 原文本框、段落、字号、颜色；超过 22 字符时按 `+` 换行，`+` 保留在上一行末尾。
- `txt.mainProductLabel` / `txt.giftProductLabel` 的符号、英文、数字按 LINE Seed Sans App Regular；中文沿用 PSD 模板原中文样式。
- `txt.subtitle` 中文沿用 PSD 模板原中文字体，英文、数字、符号按 LINE Seed Sans App Regular。
- `txt.subtitle.1` / `txt.subtitle.2` 的切换用原始 `txt.subtitle` 文案判断，超过阈值后即使换行清理空格导致显示字符数变短，也保持使用小字号变体。
- `txt.subtitle.rectangle` 根据 `txt.subtitle` 内容宽度调整红色矩形宽度。
- 管装 / tube 15g 使用通用高度规则：same `0.72`，mixed `0.7`；不再对 `唇周霜15g` 单独硬编码。
- `product.layout=auto` 转为 line 排布时，默认仍按品类/规格自动计算 gap；不同品类保持约 `0.64~0.84` 的大间距，同品类 jar 仍保留 line 中偏大的间距，但显著小于不同品类。
- `PRODUCT.shadow` 通过复制 `PRODUCT` 组、合并、垂直镜像生成；顶边默认对齐当前 `product.area` 下边缘，不透明度 100%，目标组为 `PRODUCT.PROJECT`；导出前强制显示 `PRODUCT.PROJECT` 和 `PRODUCT.shadow`。
- 如果产品区或赠品区存在次抛产品，其他产品图层默认优先排在次抛图层上方。
- 导出格式以插件 UI 选择为准，支持 `JPG`、`PSD`、`JPG + PSD`。

## 文件入口

- 主插件脚本: `src/main-full.js`
- 面板缓存入口: `panel.html`

## 验证

保存此版本前已执行：

```powershell
node --check src/main-full.js
```

语法检查通过。
