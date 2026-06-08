# Product heightRatio Backup - 2026-06-08

This file records the product height ratio defaults before the size-chart rewrite.
Manual CSV overrides were already supported and remain higher priority than defaults.

## Previous Priority

1. `product.heightRatio.N`
2. `product.heightRatio`
3. Automatic defaults in `getProductHeightRatio`

## Previous Product Defaults

| Condition | Previous default |
|---|---:|
| `bottle` with spec `<=10ml` | `product.lotion5HeightRatio`, default `0.52` |
| same-mode sample `<=5g` | `product.sameSample5HeightRatio`, default `0.9` |
| same-mode `bottle` `200ml` or `400ml` | `product.sameLotionHeightRatio`, default `1` |
| same-mode `jar` `<=60g` | `product.sameCream50HeightRatio`, default `0.7` |
| same-mode `tube` with any spec | `product.sameTubeHeightRatio`, default `0.9` |
| same-mode `pump` | `product.samePumpHeightRatio`, default `0.9` |
| `bottle` `>=300ml` | `product.lotion500HeightRatio`, default `0.92` |
| `jar` `<=60g` | `product.cream50HeightRatio`, default `0.46` |
| `tube` `>=80g/ml` | `product.tube100HeightRatio`, default `0.46` |
| `tube` `<=30g` | `product.tube25HeightRatio`, default `0.3496` |
| fallback `jar` | `0.56` |
| fallback `tube` | `0.92` |
| fallback `pump` | `0.92` |
| fallback `bottle` | `0.95` |
| fallback default | `0.88` |

## Related Previous Default

`getDefaultHeightRatio(row, "product")` returned `0.56` when the whole product source looked like a jar, otherwise `0.92`.
