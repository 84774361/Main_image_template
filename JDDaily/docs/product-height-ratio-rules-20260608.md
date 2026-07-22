# Product heightRatio Rules - 2026-06-08

Default priority:

1. `product.heightRatio.N`, where `N` is the product category order in the row
2. `product.heightRatio`
3. Size-chart defaults below

Same-category product groups use the `same` value. Mixed-category groups use the `mixed` value.

`product.heightRatio.N` is category-based, not image-index-based. If a row contains `jar | jar | bottle`, then:

- `product.heightRatio.1` controls all `jar` products.
- `product.heightRatio.2` controls all `bottle` products.

The same category-order rule applies to `product.gap.N`:

- `product.gap.1` controls the gap after products from the first category.
- `product.gap.2` controls the gap after products from the second category.

`product.scale` is applied after heightRatio sizing. It scales product layers around their bottom-center point so the product bottom stays visually anchored to `product.area`.

For line layout, use edge-touch placement when adjacent products should sit exactly side by side:

```csv
product.layout,product.touchEdges
line,1
```

`product.touchEdges = 1` forces line-layout gaps to `0`, so products are placed by their visible bounding-box edges.

Line-layout placement order:

1. Each product is sized by its category `heightRatio`.
2. Products are arranged left-to-right with the resolved `gap` values.
3. The arranged product group is checked against both `product.area` width and height.
4. If the group exceeds either dimension, the whole group is scaled down just enough to fit.
5. The whole group is aligned to the bottom center of `product.area`.

## 1218 / Youth Product Gap

When both adjacent products are from the 1218/youth series (`1218`, `youth`, or `闈掓槬` in the product image path), automatic category gaps use a PDF-derived youth table before the generic table.

Manual priority is unchanged:

1. `product.gap.leftKey.rightKey` / reverse key
2. `product.gap.N`
3. 1218/youth automatic category gap
4. Generic product gap table

`auto` first resolves through the normal product layout rule, then uses the resolved `line` or `overlap` table below. The resolved ratio is multiplied by `min(leftWidth, rightWidth)` to produce the pixel gap. In `line`, negative-like PDF overlaps are normalized to tight `0` gaps. In `overlap`/`stack`, negative values are allowed.

### 1218 line / auto->line

| Pair group | ratio |
|---|---:|
| jar + jar | 0.03 |
| bottle + bottle | 0.02 |
| bottle + small bottle | 0.03 |
| tube + tube | 0.03 |
| small tube + small tube | 0.05 |
| ampoule set + ampoule set | 0.02 |
| refill + refill | 0.02 |
| sachet + sachet | 0.03 |
| mask box + mask box | 0.03 |
| jar + bottle | 0.21 |
| jar + tube | 0.02 |
| jar + small tube | 0 |
| jar + ampoule set | 0.03 |
| jar + sachet | 0.08 |
| bottle + tube | 0.02 |
| bottle + small tube | 0.01 |
| ampoule set + bottle | 0.07 |
| ampoule set + tube | 0 |
| refill + bottle | 0.03 |
| refill + tube/sachet | 0 |
| mask box + tube | 0.11 |
| mask box + bottle | 0.14 |
| sachet + bottle/tube | 0.01 |

### 1218 overlap / stack / auto->overlap

| Pair group | ratio |
|---|---:|
| jar + jar | 0.03 |
| bottle + bottle | -0.08 |
| large bottle + large bottle | -0.02 |
| small bottle + small bottle | -0.05 |
| tube + tube | -0.08 |
| small tube + small tube | -0.10 |
| ampoule set + ampoule set | -0.12 |
| refill + refill | -0.02 |
| sachet + sachet | -0.05 |
| mask box + mask box | 0.03 |
| jar + bottle | 0.12 |
| jar + tube | -0.05 |
| jar + ampoule set | 0.03 |
| jar + sachet | 0.08 |
| bottle + tube | -0.02 |
| ampoule set + bottle | -0.03 |
| ampoule set + small bottle | -0.27 |
| ampoule set + tube | -0.03 |
| ampoule set + sachet | -0.11 |
| ampoule bag + ampoule set | -0.20 |
| ampoule set 30x + large bottle | -0.21 |
| ampoule set 30x + small bottle | -0.42 |
| refill + large bottle | -0.02 |
| refill + tube/small tube | -0.05 |
| refill + sachet | -0.12 |
| mask box + tube | 0.11 |
| mask box + bottle | 0.14 |
| sachet + bottle/tube | 0.01 |
## Bottle and Pump

Pump products use the bottle table with a `+0.04` default boost, capped by the normal heightRatio clamp.

`bottle200g` has its own product-level default before the generic `>=200ml/g` bottle bucket:

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| `bottle 200g` | `0.92` | `0.88` | `product.bottle200gHeightRatio` |

`bottle50g` has its own product-level default before the generic bottle bucket:

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| `bottle 50g` | `0.58` | `0.46` | `product.bottle50gHeightRatio` |

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| `>=500ml/g` | `0.98` | `0.95` | `product.bottle500HeightRatio` |
| `>=400ml/g` | `0.94` | `0.90` | `product.bottle400HeightRatio` |
| `>=300ml/g` | `0.91` | `0.86` | `product.bottle300HeightRatio` |
| `>=200ml/g` | `0.64` | `0.61` | `product.bottle200HeightRatio` |
| `>=150ml/g` | `0.86` | `0.80` | `product.bottle150HeightRatio` |
| `>=100ml/g` | `0.80` | `0.72` | `product.bottle100HeightRatio` |
| `>=60ml/g` | `0.72` | `0.66` | `product.bottle60HeightRatio` |
| `>=40ml/g` | `0.66` | `0.58` | `product.bottle40HeightRatio` |
| `>=10ml/g` | `0.58` | `0.50` | `product.bottle10HeightRatio` |
| `<10ml/g` | `0.48` | `0.42` | `product.bottle5HeightRatio` |

## Jar

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| `>=65g/ml` | `0.62` | `0.50` | `product.jar65HeightRatio` |
| `>=50g/ml` | `0.58` | `0.46` | `product.jar50HeightRatio` |
| `>=30g/ml` | `0.50` | `0.40` | `product.jar30HeightRatio` |
| `>=25g/ml` | `0.46` | `0.36` | `product.jar25HeightRatio` |
| `<25g/ml` | `0.42` | `0.32` | `product.jarSmallHeightRatio` |

## Tube

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| `>=100g/ml` | `0.92` | `0.88` | `product.tube100HeightRatio` |
| `>=80g/ml` | `0.86` | `0.82` | `product.tube80HeightRatio` |
| `>=50g/ml` | `0.78` | `0.72` | `product.tube50HeightRatio` |
| `>=30g/ml` | `0.68` | `0.62` | `product.tube30HeightRatio` |
| `>=25g/ml` | `0.62` | `0.58` | `product.tube25HeightRatio` |
| `>=15g/ml` | `0.72` | `0.70` | `product.tube15HeightRatio` |
| `>=10g/ml` | `0.50` | `0.42` | `product.tube10HeightRatio` |
| `<10g/ml` | `0.42` | `0.36` | `product.tube5HeightRatio` |

## Ampoule

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| ampoule set | `0.95` | `0.95` | `product.ampouleSetHeightRatio` |
| `>=60ml/g` | `0.78` | `0.72` | `product.ampoule60HeightRatio` |
| `>=40ml/g` | `0.72` | `0.66` | `product.ampoule40HeightRatio` |
| `>=10ml/g` | `0.60` | `0.54` | `product.ampoule10HeightRatio` |
| `<10ml/g` | `0.42` | `0.36` | `product.ampouleSmallHeightRatio` |
