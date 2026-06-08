# Product heightRatio Rules - 2026-06-08

Default priority is unchanged:

1. `product.heightRatio.N`
2. `product.heightRatio`
3. Size-chart defaults below

Same-category product groups use the `same` value. Mixed-category groups use the `mixed` value.

## Bottle and Pump

Pump products use the bottle table with a `+0.04` default boost, capped by the normal heightRatio clamp.

| Spec | same | mixed | Override field |
|---|---:|---:|---|
| `>=500ml/g` | `0.98` | `0.95` | `product.bottle500HeightRatio` |
| `>=400ml/g` | `0.94` | `0.90` | `product.bottle400HeightRatio` |
| `>=300ml/g` | `0.91` | `0.86` | `product.bottle300HeightRatio` |
| `>=200ml/g` | `0.88` | `0.82` | `product.bottle200HeightRatio` |
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
