# 插件通用化修改概要

## 修改目标

把当前“每个模板一个 profile、profile 里混合路径和行为”的结构，改成“一个主图通用 profile + 多个可选模块 + 多个具体模板实例”。

目标不是重写插件，而是让相似 PSD 能复用同一套渲染流程：

- 模块相同：标题、产品、赠品、机制、人物、角标、券。
- 位置不同：通过 PSD 里的 `.area` 图层读取，不在代码里写死坐标。
- 命名不同：通过 alias 兼容旧 PSD，新 PSD 逐步统一命名。
- 特殊规则：FlashSale 的“赠”字和 AddOn 的券只作为可选模块启用。

## 总体结构

建议整理成三层：

```text
profile
  定义一类模板具备哪些通用模块和默认命名约定

template instance
  定义某个 PSD 的路径、支持机制、图层别名、模块开关

row/runtime
  定义 CSV 当前行的显式控制和面板手动选择的文件
```

第一阶段建议先保留现有 `TEMPLATE_CONFIGS`，但按这个结构重命名和拆分含义。

## 主 profile

新增一个主图通用 profile：

```js
commerceMainProfile: {
  capabilities: {
    title: true,
    product: true,
    gift: true,
    mechanismSwitch: true,
    personSwitch: true,
    giftBadge: false,
    coupon: false,
    productShadow: true,
    export: true
  }
}
```

这个 profile 不绑定天猫、京东或拼多多。只要 PSD 具备相同模块，就可以使用它。

## 标准模块

### TitleModule

负责标题、说明小字、主副标和标题注释。

标准图层：

- `txt.title`
- `txt.titleNote`
- `txt.subtitle`
- `txt.productNote`
- `txt.mainProductLabel`
- `txt.giftProductLabel`

兼容策略：

- 旧 PSD 可通过 alias 兼容 `txt.title.1`、`txt.title.2`、`txt.titleNote.1`、`txt.titleNote.2`。
- 标题混排字体规则继续保留：只有 CJK 用中文字体，英文、数字、空格、符号用 LINE Seed。

### ProductModule

负责产品智能对象替换、产品组合、产品区域对齐。

标准图层：

- `img.product`
- `img.product.1`
- `img.product.2`
- `product.area`
- `product.area.1`
- `product.area.2`

规则：

- 先读取当前机制下的 `product.area.{mechanism}`。
- 找不到时读取通用 `product.area`。
- 仍找不到时才使用原始智能对象边界作为保底。

### GiftModule

负责赠品智能对象替换、赠品组合、赠品区域对齐。

标准图层：

- `img.gift`
- `img.gift.1`
- `img.giftLeft`
- `img.giftLeft.1`
- `gift.area`
- `gift.area.1`
- `giftLeft.area`
- `giftLeft.area.1`

规则：

- 新模板优先使用 `img.gift` 和 `gift.area`。
- 旧模板兼容 `img.giftLeft` 和 `giftLeft.area`。
- 赠品图片替换和机制切换分开处理，不让图片名隐式决定机制。

### MechanismSwitch

负责机制组切换。

新标准：

```js
mechanismSwitch: {
  column: "mechanism",
  legacyColumns: ["daily.mechanism"],
  groups: {
    "1": ["mechanism.1"],
    "2": ["mechanism.2"],
    "3": ["mechanism.3"],
    "4": ["mechanism.4"]
  },
  legacyGroupPattern: "daily.mechanism.{value}"
}
```

规则：

- 新 CSV 使用 `mechanism`。
- 旧 CSV 的 `daily.mechanism` 作为兼容字段读取。
- 新 PSD 使用 `mechanism.1`、`mechanism.2`。
- 旧 PSD 的 `daily.mechanism.1`、`daily.mechanism.2` 通过 alias 兼容。
- 图层查找必须优先限制在当前机制组内，避免跨机制误开同名图层。

### PersonModule

负责人物图层切换和人物素材替换。

标准图层：

- `img.person`
- `img.person.cuiyutao`
- `img.person.zhangziyi`

规则：

- 只选择 profile 明确声明的人物 variant。
- 没有人物时关闭人物相关图层或使用当前机制默认布局。

## 可选模块

### GiftBadgeModule

适用于 FlashSale 里“赠”字这类赠品角标。

配置示例：

```js
giftBadge: {
  enabled: true,
  layerNames: ["gift.badge", "gifttag", "赠"],
  controlColumn: "gift.badge",
  showWhen: {
    giftExists: true
  },
  anchorTo: "gift",
  offsetX: -20,
  offsetY: -36
}
```

规则：

- CSV 写 `gift.badge=1` 时强制显示。
- CSV 写 `gift.badge=0` 时强制隐藏。
- CSV 不写时，根据是否有赠品自动判断。
- 位置锚定到赠品图层，不写死坐标。
- 找不到角标图层时跳过并记录日志，不中断导出。

### CouponModule

适用于 AddOn 和类似有券规则的模板。

配置示例：

```js
coupon: {
  enabled: true,
  typeColumn: "coupon.type",
  imageColumns: ["img.coupon", "img.repurchaseCoupon", "img.buybackCoupon"],
  variants: {
    contact: {
      layerNames: ["img.coupon.contact"],
      tokens: ["contact", "manual", "联系客服"]
    },
    auto: {
      layerNames: ["img.coupon.auto"],
      tokens: ["auto", "自动发放"]
    }
  },
  productIndexColumn: "product.couponIndex"
}
```

规则：

- 券不是新 profile，只是 `commerceMainProfile` 的可选模块。
- 券可以作为产品组合中的一项参与排版。
- 券图层要从产品阴影和普通产品素材逻辑里排除。
- 如果模板有现成券图层，优先复制模板图层；找不到时再用图片素材 fallback。

## Template Instance 示例

### JD coolingday

```js
jdCoolingdayM1: {
  profile: "commerceMainProfile",
  paths: {
    template: "JD_coolingday_m1.psd"
  },
  mechanisms: ["1"],
  aliases: {
    "mechanism.1": ["daily.mechanism.1"],
    "gift.area.1": ["giftLeft.area.1"],
    "img.gift": ["img.giftLeft"]
  }
}
```

### Tmall 88

```js
tmall88Main: {
  profile: "commerceMainProfile",
  mechanisms: ["1", "2"],
  aliases: {
    "mechanism.1": ["daily.mechanism.1"],
    "mechanism.2": ["daily.mechanism.2"],
    "gift.area.1": ["giftLeft.area.1"],
    "gift.area.2": ["giftLeft.area.2"]
  }
}
```

### FlashSale

```js
tmallFlashSale: {
  profile: "commerceMainProfile",
  capabilities: {
    giftBadge: true
  },
  mechanisms: ["1", "2", "3", "4"],
  modules: {
    giftBadge: {
      enabled: true,
      layerNames: ["gifttag"],
      anchorTo: "gift"
    }
  }
}
```

### AddOn

```js
tmallAddOn: {
  profile: "commerceMainProfile",
  capabilities: {
    mechanismSwitch: false,
    coupon: true
  },
  modules: {
    coupon: {
      enabled: true,
      typeColumn: "coupon.type"
    }
  }
}
```

## 代码修改顺序

### 第 1 步：新增解析层，不改行为

新增函数：

- `getMechanismValue(row, config)`
- `getModuleConfig(config, moduleName)`
- `resolveLayerNames(config, canonicalName)`
- `findLayerByCanonicalName(doc, canonicalName, options)`
- `getAreaLayerForModule(doc, moduleName, mechanism)`

这一步只让代码能理解新结构，同时继续读取旧 `dailyMechanismSwitch`。

### 第 2 步：建立 alias 兼容

把硬编码图层名逐步改成标准名 + alias 查找：

```text
mechanism.1 -> daily.mechanism.1
img.gift -> img.giftLeft
gift.area -> giftLeft.area
txt.titleNote -> txt.titleNote.1 / txt.titleNote.2
```

这一步要求实际导出验证，因为同名图层可能存在于多个机制组里。

### 第 3 步：抽模块

按风险从低到高抽：

1. `MechanismSwitch`
2. `GiftBadgeModule`
3. `CouponModule`
4. `ProductModule`
5. `GiftModule`
6. `TitleModule`

产品和赠品排版依赖 Photoshop 图层状态，放在后面处理。

### 第 4 步：迁移 profile

先不删除旧 profile。新增新结构并让旧 profile 映射过去：

```js
TEMPLATE_CONFIGS.tmallFlashSaleMain = makeTemplateInstance({
  profile: "commerceMainProfile",
  modules: { giftBadge: { enabled: true } }
});
```

确认输出一致后，再逐步减少旧对象里的重复字段。

### 第 5 步：模板预检

新增预检输出：

- 当前 profile 名。
- 当前 template instance 名。
- 识别到的机制组。
- 缺失的标准图层。
- 使用的 alias。
- 启用的可选模块。
- CSV 中未识别字段。

预检通过后再开始批量导出。

## 兼容原则

- 新字段叫 `mechanism`，旧字段 `daily.mechanism` 继续兼容。
- 新图层叫 `mechanism.1`，旧图层 `daily.mechanism.1` 继续兼容。
- 新赠品模块优先用 `img.gift`，旧 `img.giftLeft` 继续兼容。
- 可选模块找不到图层时跳过，不影响主体导出。
- 涉及视觉位置、PSD 清理、合并 PSD 的修改，必须用 Photoshop 实际导出验证。

## 第一版验收标准

第一版不追求完全重构，只验证架构能跑通：

- JD coolingday m1/m2 能用同一个 `commerceMainProfile` 跑通。
- Tmall 88 1440x1920 和 1440x1440 能只通过 area 差异适配。
- FlashSale 通过 `giftBadge` 模块控制“赠”字。
- AddOn 通过 `coupon` 模块控制券。
- 旧 CSV 仍能读取 `daily.mechanism`。
- 新 CSV 可以改用 `mechanism`。
- `node --check` 通过。
- 至少每类模板各导出 1 张 JPG 做视觉验证。

