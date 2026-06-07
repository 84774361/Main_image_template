# PDD SKU template profile

This project now keeps platform/template differences in `TEMPLATE_CONFIGS` inside `src/main-full.js`.

## Profile

`pddSku` is the default active profile.

Default entries:

- PSD: `F:\NEWPAGE\AI生图\批量生图测试\PDDSKU\sku模板.psd`
- CSV: `F:\SOFT\CODEX\PROJECT\Main_image_template\sample-data-pdd-sku.csv`
- Assets: `F:\NEWPAGE\AI生图\批量生图测试\PDDSKU`
- Output: `F:\NEWPAGE\AI生图\批量生图测试\PDDSKU\export`

## CSV fields

Identifier/export fields:

- `exportName`
- `PDD_SKU`
- `pddSku`
- `pdd_sku`
- `sku`
- `id`
- `goodsId`

The first non-empty value is used for the exported JPG file name. These fields are ignored when matching PSD layers, so the PSD does not need a `PDD_SKU` layer.

Layer fields still use the base plugin convention:

- Text layers: `txt.*`
- Smart object image layers: `img.*`
- Product group controls: `product.*`
- Gift group controls: `giftLeft.*`, `giftRight.*`

## JD618 compatibility

The original JD618 behavior remains under the `jd618` profile:

- JD618 default PSD/CSV/assets/output paths
- Gift-right 178/298/middle template switch
- Person template switch for Cui Yutao/Zhang Ziyi
- Person layer final top-order adjustment

The PDD profile disables those JD618-only switches by default.
