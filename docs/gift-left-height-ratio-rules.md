# 左赠品高度比例规则

记录日期：2026-06-07

左赠品区 `giftLeft` 现在支持按每个赠品图片自己的类型和规格计算默认高度比例。

## 优先级

1. `giftLeft.heightRatio.1` / `.2` / `.3` 等单个赠品指定。
2. `giftLeft.heightRatio` 全局指定。
3. 默认逐项规则。

如果 CSV 显式填写了 `giftLeft.itemH` 或 `giftLeft.itemHeight`，插件会尊重固定高度，不再按逐项 `heightRatio` 自动调整。

## 默认逐项规则

目前重点规则：

| 条件 | 默认 heightRatio |
|---|---:|
| `tube` 且规格 `<=30g` | 原始比例 `0.276` |
| 其他左赠品 | 沿用原有 `giftLeft` 默认规则 |

`0.276` 等于 `0.92 * 0.3`，用于让 25g、10g 等小管赠品在混合赠品组里明显小于 100g 身体乳等大规格赠品。

为了避免 `giftLeft.area` 本身偏小时，小规格赠品突然缩得过小，自动规则还会应用一个面积适配下限：

| 字段 | 默认值 | 说明 |
|---|---:|---|
| `giftLeft.minHeightRatio` | `0.42` | 自动规则下，单个左赠品高度不低于 `giftLeft.area` 高度的 42% |

如果显式填写 `giftLeft.heightRatio.1` 或 `giftLeft.heightRatio`，插件会尊重手动比例，不再套用这个自动下限。

## 可手动覆盖

统一覆盖左赠品：

```csv
giftLeft.heightRatio
0.8
```

单独覆盖第 1、2、3 个左赠品：

```csv
giftLeft.heightRatio.1,giftLeft.heightRatio.2,giftLeft.heightRatio.3
0.9,0.276,0.276
```

只调整小管默认比例：

```csv
giftLeft.tube25HeightRatio
0.3
```

调整自动下限：

```csv
giftLeft.minHeightRatio
0.46
```
