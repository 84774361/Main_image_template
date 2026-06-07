# 产品图视角命名与调用规则

## 推荐命名

主产品图建议统一使用明确视角后缀：

- `-angle`：默认主图，倾斜/斜侧产品图。
- `-front`：正面产品图。

示例：

```text
products/baby-moisturing-body-lotion-bottle-200ml-angle.png
products/baby-moisturing-body-lotion-bottle-200ml-front.png
```

## 默认调用规则

CSV 中主产品列仍然可以写基础产品路径：

```csv
img.product
products/baby-moisturing-body-lotion-bottle-200ml.png
```

插件会默认调用：

```text
products/baby-moisturing-body-lotion-bottle-200ml-angle.png
```

如果 `-angle` 文件不存在，会回退到原文件名：

```text
products/baby-moisturing-body-lotion-bottle-200ml.png
```

## 有备注时调用正面图

需要调用正面图时，可以在 CSV 增加任意一个字段。

写法一：

```csv
product.view
front
```

写法二：

```csv
产品视角
正面
```

写法三：

```csv
备注
正面图
```

插件会调用：

```text
products/baby-moisturing-body-lotion-bottle-200ml-front.png
```

如果 `-front` 文件不存在，会回退到旧命名：

```text
products/baby-moisturing-body-lotion-bottle-200ml-F.png
```

## 支持的备注字段

以下任一字段出现正面相关文字，都会调用正面图：

- `备注`
- `note`
- `remark`
- `remarks`
- `product.note`
- `product.viewNote`
- `product.imageNote`
- `product.assetNote`

如果这些备注字段有内容，但没有写明 `angle` / `倾斜`，也会按正面图处理。

## 支持的显式视角字段

以下字段可以直接控制主产品视角：

- `product.view`
- `product.imageView`
- `product.assetView`
- `product.viewMode`
- `产品视角`

可填写：

- `angle` / `倾斜` / `斜侧`
- `front` / `正面` / `正面图`

显式视角字段优先级高于备注字段。
