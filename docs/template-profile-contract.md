# Template Profile Contract

## 目的

这份文档定义模板插件的 profile 契约。后续整理代码时，`profile` 不再表示“某一个具体 PSD 模板”，而表示“一类模板可以共用的渲染能力和命名约定”。

一个 profile 应该能服务很多 PSD；每个具体 PSD 只提供路径、少量图层别名和必要覆盖项。

## 核心概念

### Profile

Profile 是模板家族的能力契约。它定义插件应该启用哪些通用能力，以及这些能力默认读取哪些 CSV 字段、查找哪些 PSD 图层。

示例类型：

- `baseCommerceProfile`：基础电商主图能力。
- `mechanismMainProfile`：带机制切换的日销主图能力。
- `skuProfile`：SKU 图能力。
- `popMechanismProfile`：POP 机制图能力。

Profile 不应该绑定单一平台。天猫、京东、拼多多模板只要遵守同一套图层和 CSV 约定，就可以共用一个 profile。

### Template Instance

Template instance 是某个具体 PSD 模板的实例配置。它引用一个 profile，并提供具体路径、默认数据源、图层别名和少量模板覆盖。

示意结构：

```js
{
  id: "tmall88",
  profile: "mechanismMainProfile",
  paths: {
    template: "...",
    csv: "...",
    assets: "...",
    output: "..."
  },
  layerAliases: {
    "mechanism.1": ["mechanism.1", "机制-1"]
  }
}
```

### Capability

Capability 是插件的一项可复用能力，例如机制切换、人物切换、背景切换、产品排版、赠品排版、混合字体标题、PSD 导出清理。

新模板优先通过启用 capability 和配置字段接入。只有 profile 无法表达的新行为，才修改渲染代码。

## 配置分层

建议长期整理成三层：

1. `profiles`：模板家族能力契约。
2. `templates`：具体 PSD 实例。
3. `runtime`：当前面板选择、当前 CSV 行覆盖、用户手动选择的文件路径。

当前代码里的 `BASE_TEMPLATE_CONFIG` 和 `TEMPLATE_CONFIGS` 可以先视为 `profiles + templates` 混合体。整理时先拆概念，再拆代码。

## Profile 字段

### `id`

Profile 的稳定标识。只用于代码引用，不用于显示。

要求：

- 使用英文、数字和驼峰或短横线。
- 一旦被 CSV 的 `template.profile` 使用，不要随意改名。

### `label`

面板里显示给使用者看的名称。

要求：

- 可以包含平台或模板家族名称。
- 不作为逻辑判断依据。

### `extends`

可选。表示当前 profile 继承哪个基础 profile。

建议：

- 用于表达能力继承关系，例如 `mechanismMainProfile` 继承 `baseCommerceProfile`。
- 不要通过复制大段配置来表达继承。

### `capabilities`

声明当前 profile 启用的通用能力。

建议字段：

```js
capabilities: {
  textReplace: true,
  mixedTitleFont: true,
  productLayout: true,
  giftLayout: true,
  mechanismSwitch: true,
  personSwitch: true,
  backgroundSwitch: false,
  layerVisibilitySwitches: true,
  productNameMap: true,
  psdExportCleanup: true,
  mergedPsdExport: true
}
```

要求：

- `capabilities` 只表达能力是否启用。
- 具体图层名、CSV 字段和默认值放到对应配置块里。

### `paths`

具体模板实例的默认文件路径。

现有字段：

```js
paths: {
  template: "",
  csv: "",
  assets: "",
  output: ""
}
```

说明：

- `template`：默认 PSD/PSB 模板路径。
- `csv`：默认 CSV 数据路径。
- `assets`：默认素材目录。
- `output`：默认导出目录。

要求：

- 路径属于 template instance，不属于可复用 profile。
- 换电脑时这些绝对路径可能失效，面板手动选择应始终可覆盖默认路径。

### `filePrefixPlaceholder`

导出名前缀输入框的 placeholder。

要求：

- 只影响 UI 提示，不参与核心逻辑。

### `exportNameColumns`

导出文件名的候选 CSV 列，按优先级从左到右读取。

示例：

```js
exportNameColumns: ["exportName", "sku", "id", "goodsId"]
```

要求：

- 新模板优先复用通用字段 `exportName`、`sku`、`id`、`goodsId`。
- 平台字段可以作为兼容项追加，但不应成为唯一字段。

### `ignoredDataColumns`

CSV 里不应被当作 PSD 图层名处理的字段。

典型字段：

```js
ignoredDataColumns: [
  "template.profile",
  "templateProfile",
  "export.format",
  "exportFormat",
  "导出格式"
]
```

要求：

- 所有控制字段都应该进入此列表或被统一控制字段识别函数覆盖。
- 新增控制字段时，先判断是否属于通用契约，再决定是否加入 profile。

### `layerAliases`

图层别名表。用于让同一个 profile 适配历史 PSD 里的不同命名。

建议结构：

```js
layerAliases: {
  "txt.title": ["txt.title", "title", "主标题"],
  "img.product": ["img.product", "product", "产品"],
  "mechanism.1": ["mechanism.1", "机制-1"]
}
```

要求：

- 渲染逻辑应优先查标准名，再查别名。
- 别名用于兼容旧 PSD，不应鼓励新 PSD 继续发散命名。
- 新 PSD 应优先按标准命名制作。

## 通用图层命名

### 文本图层

标准命名：

- `txt.title`
- `txt.subtitle`
- `txt.productNote`
- `txt.bottomText`
- `txt.price`
- `txt.giftLeftTitle`
- `txt.giftLeftDesc`
- `txt.giftRightTitle`
- `txt.giftRightDesc`

要求：

- CSV 表头和 PSD 图层名优先保持一致。
- 文字样式默认继承 PSD 模板，只替换内容。

### 图片智能对象

标准命名：

- `img.product`
- `img.product.1`
- `img.product.2`
- `img.person`
- `img.gift`
- `img.gift.1`
- `img.giftLeft`
- `img.giftLeft.1`
- `img.giftRight`
- `img.giftRight.1`

要求：

- 产品多图优先使用独立编号智能对象。
- 赠品可继续支持自动复制，但复杂组合仍推荐 PSD 预设编号图层。

### 区域辅助图层

标准命名：

- `product.area`
- `gift.area`
- `giftLeft.area`
- `giftRight.area`
- `bottomText.area`

要求：

- `.area` 图层只用于读取排版边界，导出前应隐藏。
- 新 profile 不应把区域坐标硬编码为唯一方案；优先读取 PSD 区域图层。

## Capability 配置

### `MechanismSwitch`

机制切换配置。适合多个机制分组只显示一个的模板。

现有常见结构：

```js
mechanismSwitch: {
  enabled: true,
  column: "mechanism",
  defaultMechanism: "2",
  groups: {
    "1": ["mechanism.1", "机制-1"],
    "2": ["mechanism.2", "机制-2"]
  }
}
```

字段说明：

- `enabled`：是否启用机制切换。
- `column`：读取哪个 CSV 字段。
- `defaultMechanism`：CSV 为空时使用的机制。
- `groups`：机制值到 PSD 图层组名的映射。
- `productAreas`：不同机制下的产品区域。
- `giftAreas`：不同机制下的赠品区域。
- `autoOverridesExplicit`：自动识别结果是否覆盖 CSV 显式机制。

要求：

- 机制值必须是 profile 明确支持的值。
- 自动识别只能作为 profile 明确声明的能力，不应隐藏覆盖用户 CSV。
- 同名图层查找应优先限制在当前机制组内，避免跨机制误开图层。

### `personTemplateSwitch`

人物切换配置。

建议结构：

```js
personTemplateSwitch: {
  enabled: true,
  legacyName: "img.person",
  variants: {
    cuiyutao: {
      names: ["img.person.cuiyutao"],
      tokens: ["cuiyutao", "崔玉涛"]
    }
  }
}
```

要求：

- CSV 值或素材名只能用于选择已声明 variant。
- 未命中时应使用默认图层或关闭人物，而不是临时推断新图层名。

### `layerVisibilitySwitches`

普通图层显隐开关。

建议结构：

```js
layerVisibilitySwitches: [
  {
    columns: ["icon.612", "pdd.icon.612"],
    names: ["6-12icon"],
    label: "12 icon",
    defaultVisible: false
  }
]
```

要求：

- `columns` 是 CSV 控制字段。
- `names` 是 PSD 图层名或别名。
- 默认状态必须明确，避免沿用模板打开状态导致串图。

### `backgroundSwitch`

背景切换配置。

要求：

- 每个背景 variant 必须声明图层名和 token。
- 未匹配时使用 `defaultVariant`，不要从产品名自由推断。

### `productAssetPriority`

产品素材选择优先级。

常见用途：

- 默认正面图。
- 角度图和正面图 fallback。
- 禁用某些素材目录。

要求：

- 产品身份仍以 `产品名称.csv` 为权威。
- profile 可以定义默认 view，但不应覆盖 CSV 里的明确指定，除非配置显式声明。

### `productLayout`

产品区排版配置。

相关 CSV 字段：

- `product.count`
- `product.layout`
- `product.heightRatio`
- `product.scale`
- `product.gap`
- `product.zOrder`
- `img.product`
- `img.productSet`

要求：

- 默认优先读取 `product.area`。
- 尺寸例外必须写得足够窄，包含品类、单位、规格等条件。
- 视觉结论必须通过 Photoshop 导出验证。

### `giftLayout`

赠品区排版配置。

相关 CSV 字段：

- `giftLeft.count`
- `giftLeft.layout`
- `giftLeft.heightRatio`
- `giftLeft.scale`
- `giftLeft.gap`
- `giftLeft.align`
- `img.giftLeft`
- `img.giftLeftSet`

要求：

- `align`、`areaAlign`、`imageAlign` 这类字段应在目标框计算和最终移动阶段保持一致。
- 赠品类型切换和赠品图片替换要分开，不能让图片名隐式决定机制。

### `titleStyle`

标题样式配置。

现有关键规则：

- `txt.title` 保留模板字号、颜色和样式。
- 只有 CJK 字符使用中文字体。
- 英文、数字、空格和符号使用 LINE Seed。

要求：

- 标题字体规则属于通用能力，不应写成某个模板私有逻辑。
- 符号不能被归为 CJK。

### `productShadow`

产品阴影配置。

要求：

- 阴影策略应由 profile 显式声明，例如 `mirror`、`right`、`none`。
- 生成阴影、复制阴影和隐藏阴影应分别有清晰日志。

### `export`

导出配置。

相关字段：

- `export.format`
- `exportFormat`
- `导出格式`
- `mergeExportedPsds`

要求：

- 支持 `jpg`、`psd`、`jpg+psd`。
- PSD 清理、PSD 合并必须以真实 Photoshop 导出日志和产物为准。
- 不能只用 `node --check` 宣称视觉或 PSD 清理成功。

## Template Instance 字段

### `profile`

引用某个 profile。

要求：

- 一个 template instance 必须声明它属于哪个 profile。
- 新 PSD 优先选择已有 profile；只有结构确实不同，才新增 profile。

### `overrides`

对 profile 的少量覆盖。

适合放：

- 具体路径。
- 具体 PSD 图层别名。
- 当前模板支持的机制数量。
- 当前模板的默认导出字段。
- 当前模板的特殊区域名。

不适合放：

- 大段复制的通用渲染逻辑。
- 只为一个历史问题写死的素材判断。
- 可以通过 CSV 或标准图层命名表达的行为。

## CSV 行级覆盖

### `template.profile`

当前 CSV 行可以指定 profile 或 template instance。

要求：

- 行级 profile 必须在处理该行前生效。
- 行处理结束后必须清空，避免影响下一行。
- 如果指定值不存在，应记录错误或回退到面板选择，不能静默误用默认 profile。

### 优先级

建议优先级从高到低：

1. CSV 行显式字段。
2. 当前 template instance 覆盖项。
3. 当前 profile 默认值。
4. 基础 profile 默认值。
5. 插件硬编码保底值。

## 新模板接入流程

1. 判断 PSD 属于哪类模板结构。
2. 选择已有 profile。
3. 按标准图层命名整理 PSD。
4. 仅为历史命名添加 `layerAliases`。
5. 准备最小 CSV 样例。
6. 跑模板预检。
7. 跑 1 行 Photoshop 导出。
8. 检查 JPG 视觉、PSD 图层和日志。
9. 再批量运行。

## 不做无限大 profile

不要把所有平台、所有模板、所有历史例外都塞进一个 profile。一个 profile 应该代表稳定结构，而不是无限兜底。

判断标准：

- 如果只是图层名不同，用 `layerAliases`。
- 如果只是默认路径不同，用 template instance。
- 如果只是机制数量不同，用 override。
- 如果排版结构、控制字段和视觉逻辑都不同，才新增 profile。

## 当前代码迁移建议

第一阶段不改行为，只建立映射：

- `BASE_TEMPLATE_CONFIG` -> `baseCommerceProfile`
- `pddDailyMain`、`tmallFlashSaleMain` -> 候选 `mechanismMainProfile`
- `jddaily750`、`tianmao88`、`pddPopMain` -> 候选 `popMechanismProfile`
- `pddSku`、`pddSkuGift`、`tmallAddOn` -> 候选 `skuProfile`

第二阶段再把路径和实例覆盖从 profile 中拆出。

第三阶段才移动渲染函数。

