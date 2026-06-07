# Batch Main Image UXP Plugin

这是一个 Photoshop UXP 插件 MVP，用来把一个 PSD 模板和一份 CSV 数据批量生成电商主图。

## 使用方式

1. 打开 Adobe UXP Developer Tool。
2. 点击 `Add Plugin`，选择本目录的 `manifest.json`。
3. 在 Photoshop 中运行插件面板 `Batch Main Image`。
4. 依次选择 PSD 模板、CSV、素材目录和导出目录。
5. 点击 `开始批量生成`。

## PSD 图层命名约定

CSV 表头会直接匹配 PSD 图层名。

文字图层使用 `txt.` 前缀：

- `txt.title`
- `txt.subtitle`
- `txt.price`
- `txt.bottomText`
- `txt.giftLeftTitle`
- `txt.giftLeftDesc`
- `txt.giftRightTitle`
- `txt.giftRightDesc`

图片智能对象图层使用 `img.` 前缀：

- `img.product`
- `img.person`
- `img.giftLeft`
- `img.giftRight`
- `img.giftLeft.1`
- `img.giftLeft.2`
- `img.giftLeft.3`

图片列的值是相对素材目录的文件路径，例如 `products/body-lotion.png`。

## 赠品多图重叠

如果左侧赠品区需要像 `一页学龄身体乳100g*3` 这样摆 3 支产品，推荐在 PSD 里提前做 3 个重叠好的智能对象占位层：

- `img.giftLeft.1`
- `img.giftLeft.2`
- `img.giftLeft.3`

这 3 个占位层的位置、前后层级和重叠效果都在 PSD 里调好。插件只负责替换图片，并自动等比适配每个占位框。

CSV 有两种写法。

写法一：3 张图分别指定，用 `|` 分隔：

```csv
txt.giftLeftDesc,img.giftLeftSet
一页学龄身体乳100g*3,gifts/lotion-a.png|gifts/lotion-b.png|gifts/lotion-c.png
```

写法二：3 个位置都用同一张图。只填 `img.giftLeft`，并在标题或描述里写 `*3`：

```csv
txt.giftLeftDesc,img.giftLeft
一页学龄身体乳100g*3,gifts/lotion-100g.png
```

插件会自动把它展开到 `img.giftLeft.1`、`img.giftLeft.2`、`img.giftLeft.3`。

如果 PSD 里只有一个基础占位层 `img.giftLeft`，也可以使用自动复制：

```csv
giftLeft.count,giftLeft.layout,img.giftLeft
3,overlap,gifts/body-lotion-100g.png
5,line,gifts/tube-10g.png
```

插件会复制 `img.giftLeft`，生成需要数量的图层，并隐藏原始 `img.giftLeft`。自动布局支持：

- `overlap`：轻微重叠，适合 3-4 支身体乳、学龄霜。
- `line`：均匀横排，适合 5 支管状赠品。
- `stack`：轻微错位堆叠。

自动复制适合快速生成；如果某个 SKU 的赠品组合特别复杂，仍然建议在 PSD 里手动准备编号占位层，把视觉效果调准。

`giftLeft.count` 可以不写。插件会从 `txt.giftLeftDesc` / `txt.giftLeftTitle` 中自动识别 `*3`、`x3`、`X3`：

```csv
txt.giftLeftDesc,giftLeft.layout,img.giftLeft
一页学龄身体乳100g*3,overlap,gifts/body-lotion-100g.png
```

上面会自动识别为 `giftLeft.count = 3`。

自动布局可以用这些 CSV 列控制位置和大小，坐标单位是 PSD 画布像素：

```csv
giftLeft.count,giftLeft.layout,giftLeft.x,giftLeft.y,giftLeft.w,giftLeft.h,giftLeft.itemH,giftLeft.spacing,img.giftLeft
3,overlap,175,585,145,120,112,34,gifts/body-lotion-100g.png
5,line,190,575,185,140,128,28,gifts/tube-10g.png
```

字段含义：

- `giftLeft.x` / `giftLeft.y`：赠品组区域左上角。
- `giftLeft.w` / `giftLeft.h`：赠品组区域宽高。
- `giftLeft.itemH`：每个赠品图的目标高度，宽度按原图比例自动算。
- `giftLeft.itemW`：可选，强制每个赠品图的目标宽度。
- `giftLeft.gap`：相邻赠品边缘间距。`0` 表示贴边，负数表示重叠，正数表示留缝。
- `giftLeft.bottom`：可选，指定赠品底部对齐到哪条 y 坐标线。
- `giftLeft.heightRatio`：可选，默认 `0.92`，表示单个赠品先按区域高度的 92% 放大，再自动调整间距和整体缩放。

右侧赠品同理，把 `giftLeft` 换成 `giftRight`。

也可以直接在 PSD 里画一个区域框来控制极限范围：

- 左侧赠品区：图层命名为 `giftLeft.area`
- 右侧赠品区：图层命名为 `giftRight.area`

这个区域框可以是矩形形状层或普通像素层，放在你希望赠品出现的最大范围内。插件生成时会自动隐藏 `.area` 图层，只读取它的边界作为排版极限。

当存在 `giftLeft.area` 时，CSV 可以简化为：

```csv
giftLeft.count,giftLeft.layout,img.giftLeft
3,overlap,gifts/body-lotion-100g.png
```

程序会把 3 个赠品自动缩放并居中排进 `giftLeft.area`，不会超过区域边界。需要更细控制时，再额外加 `giftLeft.spacing` 或 `giftLeft.itemH`。

默认策略是先根据 `giftLeft.area` 的高度确定产品大小，再根据数量和布局自动调整间距。如果觉得产品偏小，可以增加：

```csv
giftLeft.heightRatio
0.98
```

如果觉得产品太挤，再单独设置 `giftLeft.gap`。

也可以显式写数量，推荐用分列：

```csv
giftLeft.count,giftLeft.layout,img.giftLeft
3,overlap,gifts/body-lotion-100g.png
```

如果临时把数量、布局、图片路径写在同一个图片单元格里，插件也会兼容：

```csv
img.giftLeft
3,overlap,gifts/body-lotion-100g.png
```

但这种写法在 CSV 里必须用英文双引号包起来：

```csv
img.giftLeft
"3,overlap,gifts/body-lotion-100g.png"
```

## CSV 保留字段

- `sku`、`id`、`goodsId`：可作为导出文件名。
- `exportName`：优先作为导出文件名，不需要写 `.jpg`。

## 模板制作建议

- 把需要替换的产品图、人物图、赠品图都做成智能对象。
- 固定画布尺寸，例如京东主图常用 `800 x 800`。
- 文字图层提前设置好字体、字号、颜色和段落宽度。
- 促销底栏、背景、认证标、装饰心形等不需要批量变化的元素保持普通图层即可。
- 同一个 `img.*` 图层替换用的 PNG 建议保持相同透明画布尺寸，例如 `img.giftRight` 的每张赠品图都做成同样宽高。否则 Photoshop 替换智能对象后会按新素材画布重新显示，看起来会发生位置或大小偏移。
- CSV 建议保存为 `CSV UTF-8`。插件也会尝试自动识别 Excel 常见的 GB18030/GBK 编码。

## 当前版本范围

## 赠品偏小处理

如果生成后赠品仍然偏小，常见原因是素材 PNG 自带较大的透明边。程序缩放的是整张透明画布，肉眼看到的产品就会显得小。

处理方式：

- 最佳做法：先把赠品 PNG 裁掉透明边，只保留紧贴产品的透明画布。
- 快速做法：CSV 里加 `giftLeft.scale`，例如 `1.25` 或 `1.4`。

示例：

```csv
giftLeft.count,giftLeft.layout,giftLeft.heightRatio,giftLeft.scale,img.giftLeft
3,overlap,1,1.35,gifts/body-lotion-100g.png
```

右侧赠品同理使用 `giftRight.scale`。

## 产品区多图组合

产品区也支持和赠品区一样的自动组合逻辑。

PSD 中准备：

- `img.product`：基础产品智能对象。
- `product.area`：产品组合的最大显示区域，插件会自动隐藏这个图层。
- 多产品组合时，推荐并要求在 PSD 里预先准备独立智能对象占位层，例如 `img.product.1`、`img.product.2`。不要依赖插件自动复制 `img.product`，因为 Photoshop 复制智能对象后可能共享内容或变换状态，导致多个产品位置和层级不可控。

CSV 示例一：同一个产品放 2 个，适合双罐/双瓶组合。

```csv
product.count,product.layout,product.scale,img.product
2,overlap,1.1,products/cooling-cream.png
```

CSV 示例二：不同品类组合，用 `img.productSet` 分隔多张图。

```csv
product.layout,product.scale,img.productSet
overlap,1.05,products/cream-a.png|products/cream-b.png
```

程序会自动识别 `img.productSet` 中的图片数量，并生成：

- `img.product.1`
- `img.product.2`
- `img.product.3`

注意：产品区不会再自动复制 `img.product`。这些编号图层需要在 PSD 里提前建好，且最好每个都是独立智能对象。赠品区仍支持自动复制。

自动布局字段和赠品区一致：

- `product.layout`：`overlap` / `line` / `stack`
- `product.heightRatio`
- `product.scale`
- `product.spacing`
- `product.itemH`
- `product.x` / `product.y` / `product.w` / `product.h`

如果有 `product.area`，优先使用 PSD 里的区域框；没有时才使用 CSV 坐标或 `img.product` 原始位置。

## 主标题自动换行与说明小字

主标题列仍然使用：

```csv
txt.title
```

当标题超过默认长度时，插件会自动插入换行。默认阈值约为 `13` 个中文字符宽度，可以用 `title.wrapAt` 控制：

```csv
txt.title,title.wrapAt
双重舒缓学龄肌四季安抚干敏红热,9
```

生成效果类似：

```text
双重舒缓学龄肌
四季安抚干敏红热
```

浅色小字产品说明使用：

```csv
txt.productNote
```

示例：

```csv
txt.title,title.wrapAt,txt.productNote
触肤速降温 冰润舒热敏*,13,*数据源自第三方权威检测，指32名受试者使用测试样品1分钟的数据结果，实际使用效果因人而异。
```

PSD 做法：

- 推荐新增 `txt.productNote` 图层，设置成浅灰小字，放在主标题下方。
- 如果没有 `txt.productNote` 图层，插件会把 `txt.productNote` 写入原来的 `txt.subtitle` 图层。
- 当主标题自动换成两行且没有产品说明时，插件会清空 `txt.subtitle`，避免旧副标题残留。
- 如果同时存在 `txt.productNote` 和 `txt.subtitle`，插件只写 `txt.productNote`，不会再同步写入 `txt.subtitle`，避免文字重叠。

产品区品类默认规则：

- `img.product` 或 `img.productSet` 文件名包含 `cream` 时，默认 `product.heightRatio = 0.66`，适合面霜罐这类横向较宽的产品。
- 其他产品默认 `product.heightRatio = 0.92`。
- CSV 里显式填写 `product.heightRatio` 时，以 CSV 为准。

产品区布局：

- `product.layout = overlap`：前后重叠，适合双罐、双瓶，默认第一个产品压在前面。
- `product.layout = line`：不重叠横排，适合多件等距展示。
- `line` 模式下会按 `product.heightRatio` 统一所有产品高度，再横向排版，避免左右产品大小不一致。
- 推荐统一使用 `product.gap` 控制间距。`product.gap = 0` 表示边缘贴边不重叠，正数表示留缝，负数表示重叠。
- `product.zOrder = leftFront`：左侧产品在前，默认值。
- `product.zOrder = rightFront`：右侧产品在前。

示例：

```csv
product.count,product.layout,product.zOrder,img.product
2,overlap,leftFront,products/cooling-cream.png
```

```csv
product.count,product.layout,product.heightRatio,img.product
2,line,0.66,products/cooling-cream.png
```

这个 MVP 先完成本地批量生成主流程。下一步可以继续加：

- 模板预检：检查 CSV 表头对应的图层是否存在。
- 自动缩放/居中：替换智能对象后适配占位框。
- 多模板切换：按 CSV 字段选择不同 PSD。
- 失败重试和错误 CSV 导出。
