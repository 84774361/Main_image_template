let templateFile = null;
let csvFile = null;
let assetsFolder = null;
let outputFolder = null;
let photoshop = null;
let uxpStorage = null;
let fs = null;
const SCRIPT_VERSION = "20260609-line-split-ampoule-set";

const TITLE_FONT_RULE = {
  latin: {
    postScriptName: "LINESeedSansApp-Bold",
    fontName: "LINE Seed Sans App Bold"
  },
  chinese: {
    postScriptName: "FZLanTingZhongHei_GBK",
    fontName: "方正兰亭中黑_GBK"
  }
};

const TITLE_SUPERSCRIPT_FONT = {
  postScriptName: "LINESeedSansApp-Regular",
  fontName: "LINE Seed Sans App Regular"
};

const BASE_TEMPLATE_CONFIG = {
  id: "base",
  label: "Base",
  filePrefixPlaceholder: "",
  paths: {
    template: "",
    csv: "",
    assets: "",
    output: ""
  },
  exportNameColumns: ["exportName", "sku", "id", "goodsId"],
  ignoredDataColumns: ["export.format", "exportFormat", "导出格式"],
  giftRightBox: {
    left: 390,
    top: 595,
    width: 350,
    height: 117
  },
  giftRightTemplateSwitch: null,
  personTemplateSwitch: null,
  keepPersonOnTop: true,
  productNameToSubtitle: false,
  subtitleRectangle: null,
  bottomTextMixedStyle: null,
  productShadow: null
};

const TEMPLATE_CONFIGS = {
  jd618: {
    ...BASE_TEMPLATE_CONFIG,
    id: "jd618",
    label: "JD618 POP",
    filePrefixPlaceholder: "jd_618_",
    paths: {
      template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\京东pop612\\sample\\jingdongpop612sample.psd",
      csv: "F:\\NEWPAGE\\AI生图\\批量生图测试\\京东pop612\\sample\\sample-data.csv",
      assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\京东pop612\\sample",
      output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\京东pop612\\sample\\export"
    },
    giftRightTemplateSwitch: {
      enabled: true,
      right178Names: ["img.giftRight.178", "img.giftRight178"],
      right298Names: ["img.giftRight.298", "img.giftRight.289", "img.giftRight298", "img.giftRight289"],
      middleNames: ["img.giftMiddle.178", "img.giftMiddle178", "img.giftMiddle"],
      dividerNames: ["gift.Leftdivideline", "gift.LeftDivideLine", "gift.LeftDividerLine"]
    },
    personTemplateSwitch: {
      enabled: true,
      legacyName: "img.person",
      variants: {
        cuiyutao: {
          names: ["img.person.cuiyutao", "img.personCuiyutao"],
          tokens: ["cuiyutao", "cui", "崔玉涛"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "章子怡"]
        }
      }
    }
  },
  pddSku: {
    ...BASE_TEMPLATE_CONFIG,
    id: "pddSku",
    label: "PDD SKU",
    filePrefixPlaceholder: "pdd_sku_",
    paths: {
      template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDDSKU\\PDD_SKU_Template.psd",
      csv: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDDSKU\\sample-data-pdd-sku.csv",
      assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
      output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDDSKU\\export"
    },
    exportNameColumns: ["exportName", "PDD_SKU", "pddSku", "pdd_sku", "sku", "id", "goodsId"],
    ignoredDataColumns: ["template.profile", "templateProfile"],
    keepPersonOnTop: false,
    productNameToSubtitle: true,
    subtitleRectangle: {
      layerName: "txt.subtitle.rectangle",
      paddingX: 30,
      paddingY: 10,
      minWidth: 220,
      minHeight: 44,
      maxTextWidth: 560,
      radius: 28,
      color: { red: 197, green: 39, blue: 20 }
    },
    subtitleTextStyle: {
      fontSize: 30,
      color: { red: 255, green: 255, blue: 255 }
    },
    bottomTextMixedStyle: {
      preserveFontSize: true,
      chinese: {
        postScriptName: "FZLanTingHei_GBK",
        fontName: "方正兰亭黑_GBK",
        color: { red: 0, green: 0, blue: 0 }
      },
      latin: {
        postScriptName: "LINESeedSansApp-Regular",
        fontName: "LINE Seed Sans App Regular",
        color: { red: 197, green: 39, blue: 20 }
      }
    },
    productShadow: {
      enabled: true,
      sourceGroupName: "PRODUCT",
      targetGroupName: "PROJECT",
      name: "PRODUCT.shadow",
      top: 740,
      opacity: 32
    }
  }
};

let activeTemplateId = "pddSku";

const state = {
  rows: [],
  busy: false,
  giftTargets: {},
  groupAreaBoxes: {},
  placedImageLayers: {},
  templateLayerBoxes: {},
  productNameMap: null,
  productNameRows: []
};

function ensureModules() {
  if (!photoshop) {
    photoshop = require("photoshop");
  }

  if (!uxpStorage) {
    uxpStorage = require("uxp").storage;
    fs = uxpStorage.localFileSystem;
  }
}

function $(id) {
  return document.getElementById(id);
}

function setLabel(id, entry) {
  $(id).textContent = entry ? entry.name : "Not selected";
}

function scrollLogToBottom() {
  const el = $("log");
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

function log(message) {
  const el = $("log");
  el.textContent += `${message}\n`;
  scrollLogToBottom();
  setTimeout(scrollLogToBottom, 0);
}

function formatError(error) {
  if (!error) return "Unknown error";
  return error.message || error.toString ? error.toString() : String(error);
}

function setSummary(message) {
  $("summary").textContent = message;
}

function setProgress(done, total) {
  const progress = $("progress");
  progress.max = Math.max(total, 1);
  progress.value = done;
}

function getTemplateConfig(id = activeTemplateId) {
  return TEMPLATE_CONFIGS[id] || TEMPLATE_CONFIGS.pddSku || TEMPLATE_CONFIGS.jd618;
}

function getCurrentTemplateConfig() {
  const selector = $("templateProfile");
  if (selector && selector.value && TEMPLATE_CONFIGS[selector.value]) {
    activeTemplateId = selector.value;
  }
  return getTemplateConfig();
}

function getConfiguredPath(kind) {
  const config = getCurrentTemplateConfig();
  return config && config.paths ? config.paths[kind] : "";
}

function getConfiguredExportName(row, index) {
  const config = getCurrentTemplateConfig();
  const columns = config.exportNameColumns || BASE_TEMPLATE_CONFIG.exportNameColumns;
  for (const column of columns) {
    const value = row && row[column];
    if (String(value || "").trim()) return String(value).trim();
  }
  return `image_${index + 1}`;
}

function isIdentifierColumn(column) {
  const config = getCurrentTemplateConfig();
  const columns = new Set([
    ...BASE_TEMPLATE_CONFIG.exportNameColumns,
    ...(config.exportNameColumns || []),
    ...(config.ignoredDataColumns || [])
  ]);
  return columns.has(column);
}

function syncTemplateProfileUi() {
  const selector = $("templateProfile");
  if (selector && TEMPLATE_CONFIGS[activeTemplateId]) {
    selector.value = activeTemplateId;
  }

  const config = getCurrentTemplateConfig();
  const prefix = $("filePrefix");
  if (prefix && config.filePrefixPlaceholder) {
    prefix.setAttribute("placeholder", config.filePrefixPlaceholder);
  }
}

function shouldAutoFitImages() {
  const el = $("autoFitImages");
  return !el || el.checked;
}

function shouldUseTrimmedAssets() {
  const el = $("useTrimmedAssets");
  return !el || el.checked;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value.trim());
      value = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
      continue;
    }

    value += char;
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);

  const headers = rows.shift() || [];
  return rows.map((items) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = items[index] || "";
    });
    return record;
  });
}

async function readCsvRows(file) {
  ensureModules();
  const text = await file.read({ format: uxpStorage.formats.utf8 });
  return parseCsv(text.replace(/^\uFEFF/, ""));
}

async function loadProductNameMap() {
  ensureModules();
  if (!assetsFolder) return null;

  const candidates = [
    "产品名称.csv",
    "products/product-name-map.csv"
  ];

  let file = null;
  let sourceName = "";
  for (const name of candidates) {
    try {
      file = await assetsFolder.getEntry(name);
      sourceName = name;
      break;
    } catch (error) {
      // Optional mapping file.
    }
  }

  if (!file) {
    log("Product name map not found. Chinese product name auto-mapping disabled.");
    return null;
  }

  const rows = await readCsvRows(file);
  state.productNameRows = rows;
  const buckets = new Map();
  const put = (key, value) => {
    const normalized = normalizeProductNameKey(key);
    if (!normalized || !value) return;
    if (/body-lotion/i.test(String(value)) && normalized.includes("安心霜")) return;
    addProductNameMapBucket(buckets, normalized, value);

    const compact = compactSpecHyphenKey(normalized);
    if (compact && compact !== normalized) {
      addProductNameMapBucket(buckets, compact, value);
    }

    const matchKey = compactProductNameMatchKey(normalized);
    if (matchKey && matchKey !== normalized && matchKey !== compact) {
      addProductNameMapBucket(buckets, matchKey, value);
    }
  };

  rows.forEach((row) => {
    const fileName = String(row.file || row.filename || row["文件"] || "").trim();
    if (!fileName) return;
    const imagePath = fileName.includes("/") || fileName.includes("\\") ? fileName : `products/${fileName}`;
    const fullName = row.standard_cn || row["标准中文名"] || row["中文标准名"];
    const age = row.age_cn || row["年龄段"];
    const product = row.product_cn || row["产品名"];
    const category = row.category_cn || row["品类"];
    const spec = row.spec || row["规格"];
    const productEn = row.product_en || row["product_en"] || "";
    const fullParts = String(fullName || "").split("-").map((part) => part.trim()).filter(Boolean);
    const standardProduct = fullParts.length >= 2 ? fullParts[1] : "";
    const fullCategory = fullParts.length >= 3 ? fullParts[2] : "";
    const fullSpecTail = fullParts.length >= 4 ? fullParts.slice(3).join("-") : "";
    const ageAliases = getAgeCnAliases(age);
    const productAliases = getChineseProductAliases({ age, product, standardProduct, productEn });
    const englishDerived = getEnglishDerivedChineseProductAliases(row, fileName);
    const englishAgeAliases = getAgeCnAliases(englishDerived.age);

    put(fullName, imagePath);
    put([age, product, category, spec].filter(Boolean).join("-"), imagePath);
    put([age, product, spec].filter(Boolean).join("-"), imagePath);
    put([product, category, spec].filter(Boolean).join("-"), imagePath);
    put([product, spec].filter(Boolean).join("-"), imagePath);
    put([age, standardProduct, category, spec].filter(Boolean).join("-"), imagePath);
    put([age, standardProduct, spec].filter(Boolean).join("-"), imagePath);
    put([standardProduct, category, spec].filter(Boolean).join("-"), imagePath);
    put([standardProduct, spec].filter(Boolean).join("-"), imagePath);
    if (fullSpecTail) {
      put([standardProduct, fullSpecTail].filter(Boolean).join("-"), imagePath);
      put([standardProduct, fullCategory, fullSpecTail].filter(Boolean).join("-"), imagePath);
    }
    ageAliases.forEach((ageAlias) => {
      put([ageAlias, product, category, spec].filter(Boolean).join("-"), imagePath);
      put([ageAlias, product, spec].filter(Boolean).join("-"), imagePath);
      put([ageAlias, standardProduct, category, spec].filter(Boolean).join("-"), imagePath);
      put([ageAlias, standardProduct, spec].filter(Boolean).join("-"), imagePath);
      if (fullSpecTail) {
        put([ageAlias, standardProduct, fullCategory, fullSpecTail].filter(Boolean).join("-"), imagePath);
        put([ageAlias, standardProduct, fullSpecTail].filter(Boolean).join("-"), imagePath);
      }
    });
    productAliases.forEach((alias) => {
      put([age, alias, category, spec].filter(Boolean).join("-"), imagePath);
      put([age, alias, spec].filter(Boolean).join("-"), imagePath);
      put([alias, category, spec].filter(Boolean).join("-"), imagePath);
      put([alias, spec].filter(Boolean).join("-"), imagePath);
      ageAliases.forEach((ageAlias) => {
        put([ageAlias, alias, category, spec].filter(Boolean).join("-"), imagePath);
        put([ageAlias, alias, spec].filter(Boolean).join("-"), imagePath);
        put(`${ageAlias || ""}${alias || ""}${spec ? `-${spec}` : ""}`, imagePath);
      });
      if (fullSpecTail) {
        put([alias, fullSpecTail].filter(Boolean).join("-"), imagePath);
        put([alias, fullCategory, fullSpecTail].filter(Boolean).join("-"), imagePath);
        ageAliases.forEach((ageAlias) => {
          put([ageAlias, alias, fullCategory, fullSpecTail].filter(Boolean).join("-"), imagePath);
          put([ageAlias, alias, fullSpecTail].filter(Boolean).join("-"), imagePath);
        });
      }
      put(`${age || ""}${alias || ""}${spec ? `-${spec}` : ""}`, imagePath);
    });
    englishDerived.productAliases.forEach((alias) => {
      put([englishDerived.age, alias, englishDerived.category, spec].filter(Boolean).join("-"), imagePath);
      put([englishDerived.age, alias, spec].filter(Boolean).join("-"), imagePath);
      put([alias, englishDerived.category, spec].filter(Boolean).join("-"), imagePath);
      put([alias, spec].filter(Boolean).join("-"), imagePath);
      englishAgeAliases.forEach((ageAlias) => {
        put([ageAlias, alias, englishDerived.category, spec].filter(Boolean).join("-"), imagePath);
        put([ageAlias, alias, spec].filter(Boolean).join("-"), imagePath);
        put(`${ageAlias || ""}${alias || ""}${spec ? `-${spec}` : ""}`, imagePath);
      });
      put(`${englishDerived.age || ""}${alias || ""}${spec ? `-${spec}` : ""}`, imagePath);
    });
    put(fileName.replace(/\.[^.]+$/, ""), imagePath);
  });

  const map = new Map();
  let ambiguous = 0;
  let resolvedAmbiguous = 0;
  buckets.forEach((values, key) => {
    if (values.size === 1) {
      map.set(key, Array.from(values)[0]);
    } else {
      const preferred = choosePreferredProductImageForKey(key, values);
      if (preferred) {
        map.set(key, preferred);
        resolvedAmbiguous += 1;
      } else {
        ambiguous += 1;
      }
    }
  });

  log(`Product name map loaded from ${sourceName}: ${rows.length} rows, ${map.size} keys${resolvedAmbiguous ? `, ${resolvedAmbiguous} ambiguous keys resolved` : ""}${ambiguous ? `, ${ambiguous} ambiguous keys skipped` : ""}.`);
  return map;
}

function addProductNameMapBucket(buckets, key, value) {
  if (!buckets.has(key)) buckets.set(key, new Set());
  buckets.get(key).add(value);
}

function compactSpecHyphenKey(key) {
  return String(key || "").replace(/-(\d+(?:\.\d+)?(?:g|ml|kg|l)(?:-[a-z0-9]+)?)$/i, "$1");
}

function compactProductNameMatchKey(key) {
  return String(key || "")
    .replace(/[＊*×Ｘｘ]/g, "x")
    .replace(/((?:kg|ml|g|l))x(?=\d)/gi, "$1")
    .replace(/[\\/_\-\s]+/g, "")
    .toLowerCase();
}

function getAgeCnAliases(age) {
  const normalized = normalizeProductNameKey(age);
  if (normalized === "婴童" || normalized === "一页") return ["婴童", "一页"];
  if (normalized === "学龄") return ["学龄"];
  return age ? [String(age)] : [];
}

function getAgeCnCanonicalFromText(value) {
  const normalized = normalizeProductNameKey(value);
  if (normalized.includes("婴童") || normalized.includes("一页")) return "婴童";
  if (normalized.includes("学龄")) return "学龄";
  return "";
}

function choosePreferredProductImageForKey(key, values) {
  const items = Array.from(values);
  const normalizedKey = normalizeProductNameKey(key);
  const specMatch = String(key || "").match(/(\d+(?:\.\d+)?(?:g|ml|kg|l))/i);
  if (specMatch) {
    const spec = specMatch[1].toLowerCase();
    const matched = items.filter((item) => normalizeProductNameKey(item).includes(spec));
    if (matched.length === 1) return matched[0];
    if (matched.length > 1) {
      const categoryPreferred = choosePreferredProductByCategory(normalizedKey, matched);
      if (categoryPreferred) return categoryPreferred;

      if (/安心霜|学龄霜|修护霜|舒缓霜|夏季安心霜|冰沙霜/.test(normalizedKey) && /^(50g|60g)$/i.test(spec)) {
        const jar = matched.filter((item) => /[-/]jar[-/]/i.test(String(item).replace(/\\/g, "/")));
        if (jar.length === 1) return jar[0];
      }
    }
  }
  return choosePreferredProductByCategory(normalizedKey, items);
}

function choosePreferredProductByCategory(normalizedKey, items) {
  const categoryRules = [
    { pattern: /瓶装/, token: "bottle" },
    { pattern: /管装/, token: "tube" },
    { pattern: /罐装/, token: "jar" }
  ];
  for (const rule of categoryRules) {
    if (!rule.pattern.test(normalizedKey)) continue;
    const matched = items.filter((item) => new RegExp(`[-/]${rule.token}[-/]`, "i").test(String(item).replace(/\\/g, "/")));
    if (matched.length === 1) return matched[0];
  }
  return "";
}

function normalizeProductNameKey(value) {
  return String(value || "")
    .trim()
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/Ｘ/g, "x")
    .replace(/ｘ/g, "x")
    .replace(/\s+/g, "")
    .replace(/[－–—]/g, "-")
    .toLowerCase();
}

function getChineseProductAliases({ age, product, standardProduct, productEn }) {
  const aliases = new Set();
  const add = (value) => {
    const text = String(value || "").trim();
    if (!text) return;
    aliases.add(text);
    if (age && text.startsWith(age)) {
      aliases.add(text.slice(String(age).length));
    }
  };

  add(product);
  add(standardProduct);

  const english = String(productEn || "").toLowerCase();
  const combined = `${product || ""} ${standardProduct || ""} ${english}`;

  if (/repairing\s*cream/i.test(combined) || /修护霜|学龄霜|安心霜/.test(combined)) {
    add("修护霜");
    add("安心霜");
    add("学龄霜");
  }

  if (/soothing\s*cream/i.test(combined) || /舒缓霜|安心霜/.test(combined)) {
    add("舒缓霜");
    add("安心霜");
  }

  if (/body\s*lotion/i.test(combined) || /身体乳|保湿乳|高保湿乳/.test(combined)) {
    add("身体乳");
    add("保湿乳");
    add("高保湿乳");
    aliases.delete("安心霜");
  }

  return Array.from(aliases).filter(Boolean);
}

function getEnglishDerivedChineseProductAliases(row, fileName) {
  const ageEn = String(row.age_en || row["age_en"] || "").toLowerCase();
  const categoryEn = String(row.category_en || row["category_en"] || "").toLowerCase();
  const productEn = String(row.product_en || row["product_en"] || "").toLowerCase();
  const standardEn = String(row.standard_en || row["standard_en"] || "").toLowerCase();
  const filename = String(fileName || "").toLowerCase();
  const combined = `${ageEn} ${productEn} ${standardEn} ${filename}`;

  let age = "";
  if (/\bbaby\b/.test(combined)) age = "婴童";
  if (/\b(612|kids|schoolchild)\b/.test(combined)) age = "学龄";

  let category = "";
  if (/\bbottle\b/.test(categoryEn) || /-bottle-/.test(filename)) category = "瓶装";
  if (/\btube\b/.test(categoryEn) || /-tube-/.test(filename)) category = "管装";
  if (/\bjar\b/.test(categoryEn) || /-jar-/.test(filename)) category = "罐装";

  const productAliases = new Set();
  const add = (value) => {
    if (value) productAliases.add(value);
  };

  if (/repairing[-\s]*cream|ad[-\s]*cream/.test(combined)) {
    add("修护霜");
    add("安心霜");
    add("学龄霜");
  }
  if (/soothing[-\s]*cream/.test(combined)) {
    add("舒缓霜");
    add("安心霜");
  }
  if (/cooling[-\s]*cream/.test(combined)) {
    add("夏季安心霜");
    add("安心霜");
    add("冰沙霜");
  }
  if (/body[-\s]*lotion/.test(combined)) {
    add("身体乳");
    add("保湿乳");
    add("高保湿乳");
  }
  if (/sunscreen[-\s]*lotion|sunscreen/.test(combined)) {
    add("防晒乳");
  }
  if (/foaming[-\s]*(wash|body[-\s]*wash|shampoo)|body[-\s]*wash|cleansing[-\s]*foam/.test(combined)) {
    add("洁面泡");
    add("泡泡沐浴露");
    add("沐浴露");
  }
  if (/conditioner/.test(combined)) {
    add("护发素");
  }
  if (/spray/.test(combined)) {
    add("喷雾");
  }
  if (/essence|ampoule/.test(combined)) {
    add("精华露");
    add("次抛");
  }

  return { age, category, productAliases: Array.from(productAliases) };
}

function getAllLayers(layers, result = []) {
  for (const layer of layers) {
    result.push(layer);
    if (layer.layers && layer.layers.length) {
      getAllLayers(layer.layers, result);
    }
  }
  return result;
}

function findLayerByName(doc, name) {
  return getAllLayers(doc.layers).find((layer) => layer.name === name);
}

function findLayerByAnyName(doc, names) {
  for (const name of names) {
    const layer = findLayerByName(doc, name);
    if (layer) return layer;
  }
  return null;
}

function setLayerVisibleByAnyName(doc, names, visible, label) {
  const layer = findLayerByAnyName(doc, names);
  if (!layer) {
    log(`  Skip: layer not found: ${label || names[0]}`);
    return null;
  }
  layer.visible = visible;
  return layer;
}

function getBoundsBox(bounds) {
  if (!bounds) return null;

  const left = Number(bounds.left);
  const top = Number(bounds.top);
  const right = Number(bounds.right);
  const bottom = Number(bounds.bottom);
  const width = Number(bounds.width || right - left);
  const height = Number(bounds.height || bottom - top);

  if (![left, top, right, bottom, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
    return null;
  }

  return {
    left,
    top,
    right,
    bottom,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2
  };
}

function makeBox(left, top, width, height) {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2
  };
}

async function moveLayerCenterTo(layer, centerX, centerY) {
  const box = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!box) return;
  await layer.translate(centerX - box.centerX, centerY - box.centerY);
}

function getImageGroupLayout(row, prefix) {
  const layout = String(row[`${prefix}.layout`] || "").trim().toLowerCase();
  if (layout) return layout;
  return prefix === "product" ? "auto" : "overlap";
}

function getImageGroupZOrder(row, prefix) {
  return String(row[`${prefix}.zOrder`] || "leftFront").trim() || "leftFront";
}

function getImageGroupSourceText(row, prefix) {
  return [
    row[`img.${prefix}`],
    row[`img.${prefix}Set`],
    row[`img.${prefix}.1`],
    row[`img.${prefix}.2`],
    row[`img.${prefix}.3`],
    row[`img.${prefix}.4`],
    row[`img.${prefix}.5`],
    row[`img.${prefix}.6`]
  ].filter(Boolean).join("|").toLowerCase();
}

function getImageSourceForIndex(row, prefix, index) {
  return String(row[`img.${prefix}.${index}`] || row[`img.${prefix}`] || "").toLowerCase();
}

function getProductCategoryFromSource(source) {
  const text = String(source || "").toLowerCase();
  if (/(ampoule|次抛|安瓶|set-\d+x|\d+x)/.test(text)) return "ampoule";
  if (/(tube|管)/.test(text)) return "tube";
  if (/(pump|泵|按压)/.test(text)) return "pump";
  if (/(jar|pot|罐)/.test(text)) return "jar";
  if (/(bottle|瓶)/.test(text)) return "bottle";
  if (/(cream|面霜)/.test(text)) return "jar";
  if (/(diaper|repairing|安心霜|学龄霜|冰沙霜|身体乳100g)/.test(text)) return "tube";
  if (/(wash|foam|shampoo|body-lotion|lotion|乳|oil|精油|sunscreen|sun)/.test(text)) return "bottle";
  return "default";
}

function getProductCategory(row, index) {
  const override = String(row[`product.category.${index}`] || row["product.category"] || "").trim().toLowerCase();
  if (override) return override;
  return getProductCategoryFromSource(getImageSourceForIndex(row, "product", index));
}

function getProductCategoryRank(row, index, count = 1) {
  const categories = [];
  for (let i = 1; i <= Math.max(count, index, 1); i += 1) {
    const category = getProductCategory(row, i) || "default";
    if (!categories.includes(category)) {
      categories.push(category);
    }
    if (i === index) {
      return Math.max(1, categories.indexOf(category) + 1);
    }
  }
  return 1;
}

function getProductSpecFromSource(source) {
  const text = String(source || "")
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/_/g, "");
  const specs = { ml: 0, g: 0 };
  const matcher = /(\d+(?:\.\d+)?)\s*(ml|毫升|g|克)/g;
  let match = matcher.exec(text);

  while (match) {
    const value = Number(match[1]);
    const unit = match[2] === "ml" || match[2] === "毫升" ? "ml" : "g";
    if (Number.isFinite(value)) {
      specs[unit] = Math.max(specs[unit], value);
    }
    match = matcher.exec(text);
  }

  return specs;
}

function getProductHeightMode(row, count) {
  const modeOverride = String(row["product.heightMode"] || "").trim().toLowerCase();
  if (modeOverride === "mixed" || modeOverride === "same") return modeOverride;

  const categories = Array.from({ length: Math.max(count, 1) }, (_, index) => getProductCategory(row, index + 1));
  const unique = Array.from(new Set(categories.filter(Boolean)));
  return unique.length > 1 ? "mixed" : "same";
}

function getAutoProductLayout(row, count) {
  const categories = Array.from({ length: count }, (_, index) => getProductCategory(row, index + 1));
  const unique = Array.from(new Set(categories));

  if (count <= 1) return "overlap";
  if (unique.length > 1) return "line";
  if (unique[0] === "jar" && count === 2) return "overlap";
  if (count >= 3) return "line";
  return "line";
}

function resolveImageGroupLayout(row, prefix, count) {
  const layout = getImageGroupLayout(row, prefix);
  if (prefix === "product" && layout === "auto") {
    return getAutoProductLayout(row, count);
  }
  return layout;
}

function getDefaultHeightRatio(row, prefix) {
  const sourceText = getImageGroupSourceText(row, prefix);
  if (prefix === "product" && getProductCategoryFromSource(sourceText) === "jar") {
    return 0.56;
  }
  if (prefix === "giftLeft") {
    const specs = getProductSpecFromSource([
      sourceText,
      row && row.txt && row.txt.giftLeftDesc,
      row && row["txt.giftLeftDesc"]
    ].filter(Boolean).join(" "));
    const maxSpec = Math.max(specs.g || 0, specs.ml || 0);
    if (maxSpec >= 100) return 0.95;
    if (maxSpec >= 50) return 0.9;
    if (maxSpec >= 25) return 0.8;
    if (maxSpec >= 10) return 0.8;
    return 0.68;
  }
  if (prefix === "giftLeft" || prefix === "giftRight") {
    return 0.68;
  }
  return 0.92;
}

function isGiftLeftAmpouleSet(row) {
  const text = [
    getImageGroupSourceText(row, "giftLeft"),
    row && row.txt && row.txt.giftLeftDesc,
    row && row["txt.giftLeftDesc"],
    row && row["giftLeft.type"]
  ].filter(Boolean).join(" ").toLowerCase();

  return /(ampoule|essence|次抛|精华露|5x|x5|set-5)/.test(text);
}

function getGiftLeftAmpouleGroupCount(row) {
  const explicitMatch = String(row && (row["giftLeft.ampouleGroups"] || row["giftLeft.groupCount"]) || "").match(/(\d+)/);
  if (explicitMatch) return Math.max(1, Math.min(Number(explicitMatch[1]), 12));

  const text = [
    row && row["txt.giftLeftDesc"],
    row && row.txt && row.txt.giftLeftDesc,
    row && row["img.giftLeft"],
    row && row["img.giftLeftSet"]
  ].filter(Boolean).join(" ")
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/Ｘ/g, "x")
    .replace(/ｘ/g, "x");

  const groupMatch = text.match(/(?:\*|x)\s*5\s*(?:\*|x)\s*(\d+)/i);
  if (groupMatch) return Math.max(1, Math.min(Number(groupMatch[1]), 12));

  const countMatch = text.match(/(?:ampoule|次抛|精华露).*?(?:\*|x)\s*(\d+)/i);
  if (countMatch && Number(countMatch[1]) > 5) {
    return Math.max(1, Math.min(Number(countMatch[1]), 12));
  }

  return 1;
}

function getGiftLeftAmpouleRows(groupCount) {
  if (groupCount <= 1) return [groupCount];
  const top = Math.floor(groupCount / 2);
  return [top, groupCount - top].filter((count) => count > 0);
}

function getGiftLeftAmpouleImagePath(row) {
  return row["img.giftLeft"] || row["img.giftLeftSet"] || row["img.giftLeft.1"];
}

function clampHeightRatio(value) {
  return Math.max(0.25, Math.min(Number(value), 1.05));
}

function getProductSpecSize(specs) {
  return Math.max(specs.ml || 0, specs.g || 0);
}

function readProductLegacyHeightRatio(row, key) {
  const value = readNumber(row, key, null);
  return Number.isFinite(value) ? clampHeightRatio(value) : null;
}

function readProductHeightRatio(row, key, fallback, aliases = []) {
  const keys = [`product.${key}HeightRatio`, ...aliases];
  for (const candidate of keys) {
    const value = readNumber(row, candidate, null);
    if (Number.isFinite(value)) return clampHeightRatio(value);
  }
  return clampHeightRatio(fallback);
}

function isAmpouleSetSource(source) {
  const text = String(source || "").toLowerCase();
  return /(ampoule[-_\s]*set|set-\d+x|\d+x|\*\s*\d+|次抛.*(?:x|\*)\s*\d+)/.test(text);
}

function getBottleHeightRatioBySpec(row, size, mode, category) {
  const same = mode === "same";
  const pumpBoost = category === "pump" ? 0.04 : 0;

  if (same && category === "pump") {
    const legacySamePump = readProductLegacyHeightRatio(row, "product.samePumpHeightRatio");
    if (legacySamePump !== null) return legacySamePump;
  }
  if (same && (size === 400 || size === 200)) {
    const legacySameLotion = readProductLegacyHeightRatio(row, "product.sameLotionHeightRatio");
    if (legacySameLotion !== null) return legacySameLotion;
  }

  if (size >= 500) return readProductHeightRatio(row, "bottle500", (same ? 0.98 : 0.95) + pumpBoost, ["product.lotion500HeightRatio"]);
  if (size >= 400) return readProductHeightRatio(row, "bottle400", (same ? 0.94 : 0.9) + pumpBoost, ["product.lotion500HeightRatio"]);
  if (size >= 300) return readProductHeightRatio(row, "bottle300", (same ? 0.91 : 0.86) + pumpBoost, ["product.lotion500HeightRatio"]);
  if (size >= 200) return readProductHeightRatio(row, "bottle200", (same ? 0.88 : 0.82) + pumpBoost);
  if (size >= 150) return readProductHeightRatio(row, "bottle150", (same ? 0.86 : 0.8) + pumpBoost);
  if (size >= 100) return readProductHeightRatio(row, "bottle100", same ? 0.8 : 0.72);
  if (size >= 60) return readProductHeightRatio(row, "bottle60", same ? 0.72 : 0.66);
  if (size >= 40) return readProductHeightRatio(row, "bottle40", same ? 0.66 : 0.58);
  if (size >= 10) return readProductHeightRatio(row, "bottle10", same ? 0.58 : 0.5, ["product.lotion5HeightRatio"]);
  if (size > 0) return readProductHeightRatio(row, "bottle5", same ? 0.48 : 0.42, ["product.lotion5HeightRatio"]);
  return readProductHeightRatio(row, "bottleDefault", same ? 0.86 : 0.78);
}

function getJarHeightRatioBySpec(row, size, mode) {
  const same = mode === "same";
  if (same && size > 0 && size <= 60) {
    const legacySameCream = readProductLegacyHeightRatio(row, "product.sameCream50HeightRatio");
    if (legacySameCream !== null) return legacySameCream;
  }

  if (size >= 65) return readProductHeightRatio(row, "jar65", same ? 0.62 : 0.5);
  if (size >= 50) return readProductHeightRatio(row, "jar50", same ? 0.58 : 0.46, ["product.cream50HeightRatio"]);
  if (size >= 30) return readProductHeightRatio(row, "jar30", same ? 0.5 : 0.4);
  if (size >= 25) return readProductHeightRatio(row, "jar25", same ? 0.46 : 0.36);
  if (size > 0) return readProductHeightRatio(row, "jarSmall", same ? 0.42 : 0.32);
  return readProductHeightRatio(row, "jarDefault", same ? 0.56 : 0.46);
}

function getTubeHeightRatioBySpec(row, size, mode) {
  const same = mode === "same";
  if (same && size > 0 && size <= 5) {
    const legacySameSample = readProductLegacyHeightRatio(row, "product.sameSample5HeightRatio");
    if (legacySameSample !== null) return legacySameSample;
  }
  if (same && size > 0) {
    const legacySameTube = readProductLegacyHeightRatio(row, "product.sameTubeHeightRatio");
    if (legacySameTube !== null) return legacySameTube;
  }

  if (size >= 100) return readProductHeightRatio(row, "tube100", same ? 0.92 : 0.88);
  if (size >= 80) return readProductHeightRatio(row, "tube80", same ? 0.86 : 0.82);
  if (size >= 50) return readProductHeightRatio(row, "tube50", same ? 0.78 : 0.72);
  if (size >= 30) return readProductHeightRatio(row, "tube30", same ? 0.68 : 0.62);
  if (size >= 25) return readProductHeightRatio(row, "tube25", same ? 0.62 : 0.58);
  if (size >= 10) return readProductHeightRatio(row, "tube10", same ? 0.5 : 0.42);
  if (size > 0) return readProductHeightRatio(row, "tube5", same ? 0.42 : 0.36);
  return readProductHeightRatio(row, "tubeDefault", same ? 0.84 : 0.7);
}

function getAmpouleHeightRatioBySpec(row, size, mode, source) {
  const same = mode === "same";
  if (isAmpouleSetSource(source)) return readProductHeightRatio(row, "ampouleSet", 0.95);
  if (size >= 60) return readProductHeightRatio(row, "ampoule60", same ? 0.78 : 0.72);
  if (size >= 40) return readProductHeightRatio(row, "ampoule40", same ? 0.72 : 0.66);
  if (size >= 10) return readProductHeightRatio(row, "ampoule10", same ? 0.6 : 0.54);
  if (size > 0) return readProductHeightRatio(row, "ampouleSmall", same ? 0.42 : 0.36);
  return readProductHeightRatio(row, "ampouleDefault", same ? 0.72 : 0.62);
}

function getChartProductHeightRatio(row, category, specs, mode, source) {
  const size = getProductSpecSize(specs);
  if (category === "ampoule") return getAmpouleHeightRatioBySpec(row, size, mode, source);
  if (category === "jar") return getJarHeightRatioBySpec(row, size, mode);
  if (category === "tube") return getTubeHeightRatioBySpec(row, size, mode);
  if (category === "pump" || category === "bottle") return getBottleHeightRatioBySpec(row, size, mode, category);
  return readProductHeightRatio(row, "default", mode === "same" ? 0.86 : 0.76);
}

function getProductHeightRatio(row, index, count = 1) {
  const categoryRank = getProductCategoryRank(row, index, count);
  const explicitCategoryRatio = readNumber(row, `product.heightRatio.${categoryRank}`, null);
  if (Number.isFinite(explicitCategoryRatio)) return explicitCategoryRatio;

  const explicitRatio = readNumber(row, "product.heightRatio", null);
  if (Number.isFinite(explicitRatio)) return explicitRatio;

  const mode = getProductHeightMode(row, count);
  const category = getProductCategory(row, index);
  const source = getImageSourceForIndex(row, "product", index);
  const specs = getProductSpecFromSource(source);
  return getChartProductHeightRatio(row, category, specs, mode, source);
}

function applyProductHeightRatioToBox(row, index, areaBox, box, count = 1) {
  if (!row || !areaBox || !box) return box;

  const ratio = getProductHeightRatio(row, index, count);
  const height = areaBox.height * ratio;
  if (!Number.isFinite(height) || height <= 0) return box;

  const width = height * (box.width / box.height);
  return {
    ...box,
    left: box.centerX - width / 2,
    top: box.bottom - height,
    right: box.centerX + width / 2,
    bottom: box.bottom,
    width,
    height,
    centerY: box.bottom - height / 2
  };
}

function getGiftLeftHeightRatio(row, index) {
  const explicitItemRatio = readNumber(row, `giftLeft.heightRatio.${index}`, null);
  if (Number.isFinite(explicitItemRatio)) return explicitItemRatio;

  const explicitRatio = readNumber(row, "giftLeft.heightRatio", null);
  if (Number.isFinite(explicitRatio)) return explicitRatio;

  const source = getImageSourceForIndex(row, "giftLeft", index);
  const category = getProductCategoryFromSource(source);
  const specs = getProductSpecFromSource(source);

  if (category === "tube" && (specs.ml >= 80 || specs.g >= 80)) {
    return readNumber(row, "giftLeft.tube100HeightRatio", 0.9);
  }

  if (category === "tube" && specs.g > 0 && specs.g <= 30) {
    return readNumber(row, "giftLeft.tube25HeightRatio", 0.85);
  }

  return getDefaultHeightRatio(makeSingleGiftLeftSourceRow(row, source), "giftLeft");
}

function getGiftLeftEffectiveHeightRatio(row, index) {
  const ratio = getGiftLeftHeightRatio(row, index);
  const hasExplicitRatio = Number.isFinite(readNumber(row, `giftLeft.heightRatio.${index}`, null)) ||
    Number.isFinite(readNumber(row, "giftLeft.heightRatio", null));
  if (hasExplicitRatio) return ratio;

  const minRatio = readNumber(row, "giftLeft.minHeightRatio", 0.42);
  return Math.max(ratio, minRatio);
}

function makeSingleGiftLeftSourceRow(row, source) {
  const single = { ...row };
  single["img.giftLeft"] = source;
  single["img.giftLeftSet"] = "";
  for (let i = 1; i <= 6; i += 1) {
    single[`img.giftLeft.${i}`] = "";
  }
  return single;
}

function applyGiftLeftHeightRatioToBox(row, index, areaBox, box) {
  if (!row || !areaBox || !box) return box;
  if (row["giftLeft.itemH"] || row["giftLeft.itemHeight"]) return box;

  const ratio = getGiftLeftEffectiveHeightRatio(row, index);
  const height = areaBox.height * ratio;
  if (!Number.isFinite(height) || height <= 0) return box;

  const width = height * (box.width / box.height);
  return {
    ...box,
    left: box.centerX - width / 2,
    top: box.bottom - height,
    right: box.centerX + width / 2,
    bottom: box.bottom,
    width,
    height,
    centerY: box.bottom - height / 2
  };
}

function getProductOverlapRatio(row, items) {
  const explicit = readNumber(row, "product.overlapRatio", null);
  if (Number.isFinite(explicit)) {
    return Math.max(-0.8, Math.min(explicit, 0.8));
  }

  const categories = items.map((_, index) => getProductCategory(row, index + 1));
  if (categories.every((category) => category === "jar")) return 0.16;
  if (categories.every((category) => category === "bottle")) return 0.12;
  return 0.08;
}

function getProductOverlapGap(row, items, areaBox) {
  const overlapRatio = getProductOverlapRatio(row, items);
  const minWidth = Math.min(...items.map((item) => item.box.width));

  if (overlapRatio < 0) {
    return areaBox.width * Math.abs(overlapRatio);
  }

  return -minWidth * overlapRatio;
}

function getNegativeOverlapSpan(row, items, areaBox, overlapRatio) {
  const paddingRatio = readNumber(row, "product.edgePaddingRatio", 0.06);
  const maxSpan = areaBox.width * Math.max(0.1, 1 - paddingRatio * 2);
  const minSpan = Math.min(maxSpan, areaBox.width * 0.42);
  const span = areaBox.width * (0.42 + Math.abs(overlapRatio) * 1.45);
  return Math.min(maxSpan, Math.max(minSpan, span));
}

function shouldDuplicateGroupFromBase(row, prefix) {
  const defaultMode = "placeholder";
  const mode = String(row[`${prefix}.sourceMode`] || row[`${prefix}.copyMode`] || defaultMode).trim().toLowerCase();
  return mode !== "placeholder" && mode !== "placeholders";
}

function shouldPlaceGroupFromFiles(row, prefix) {
  const defaultMode = prefix === "product" || prefix === "giftLeft" || prefix === "giftRight" ? "place" : "placeholder";
  const mode = String(row[`${prefix}.sourceMode`] || row[`${prefix}.copyMode`] || defaultMode).trim().toLowerCase();
  return mode === "place" || mode === "placed" || mode === "direct";
}

function readNumber(row, key, fallback) {
  if (!row || row[key] === undefined || row[key] === null || row[key] === "") {
    return fallback;
  }
  const value = Number(row[key]);
  return Number.isFinite(value) ? value : fallback;
}

function getImageGroupScale(row, prefix) {
  if (prefix === "product") {
    return readNumber(row, "product.scale", 1);
  }

  if (prefix === "giftLeft") {
    return readNumber(row, "giftLeft.scale", 1);
  }

  if (prefix === "giftRight") {
    return readNumber(row, "giftRight.scale", 1);
  }

  return readNumber(row, `${prefix}.scale`, 1);
}

function hasValue(row, key) {
  return !!row && row[key] !== undefined && row[key] !== null && row[key] !== "";
}

function hasGiftLeftContent(row) {
  if (!row) return false;
  return [
    "txt.giftLeftTitle",
    "txt.giftLeftDesc",
    "img.giftLeft",
    "img.giftLeftSet",
    "img.giftLeft.1"
  ].some((key) => hasValue(row, key));
}

function getGiftRightTemplateType(row) {
  const value = String(row && row["img.giftRight"] || "").trim().toLowerCase();
  if (value.includes("298") || value.includes("289")) return "298";
  if (value.includes("178")) return "178";
  return "178";
}

function hideGiftLeftTemplateContent(doc) {
  [
    "img.giftLeft",
    "txt.giftLeftTitle",
    "txt.giftLeftDesc"
  ].forEach((name) => {
    const layer = findLayerByName(doc, name);
    if (layer) layer.visible = false;
  });

  for (let i = 1; i <= 6; i += 1) {
    const layer = findLayerByName(doc, `img.giftLeft.${i}`);
    if (layer) layer.visible = false;
  }
}

function applyGiftRightTemplateSwitch(doc, row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = config.giftRightTemplateSwitch;
  if (!switchConfig || !switchConfig.enabled) return;

  const hasLeft = hasGiftLeftContent(row);
  const rightType = getGiftRightTemplateType(row);
  const right178Names = switchConfig.right178Names || [];
  const right298Names = switchConfig.right298Names || [];
  const middleNames = switchConfig.middleNames || [];
  const dividerNames = switchConfig.dividerNames || [];

  setLayerVisibleByAnyName(doc, right178Names, false, "img.giftRight.178");
  setLayerVisibleByAnyName(doc, right298Names, false, "img.giftRight.298");
  setLayerVisibleByAnyName(doc, middleNames, false, "img.giftMiddle");

  if (hasLeft) {
    setLayerVisibleByAnyName(doc, dividerNames, true, "gift.Leftdivideline");
    setLayerVisibleByAnyName(doc, rightType === "298" ? right298Names : right178Names, true, `img.giftRight.${rightType}`);
    log(`  GiftRight template switch: left=on, show img.giftRight.${rightType}.`);
    return;
  }

  hideGiftLeftTemplateContent(doc);
  setLayerVisibleByAnyName(doc, dividerNames, false, "gift.Leftdivideline");
  setLayerVisibleByAnyName(doc, middleNames, true, "img.giftMiddle");
  log("  GiftRight template switch: left=off, show img.giftMiddle.");
}

function getPersonTemplateType(row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = config.personTemplateSwitch;
  if (!switchConfig || !switchConfig.enabled) return "";

  const value = String(row && row["img.person"] || "").trim().toLowerCase();
  if (!value) return "";

  for (const [type, variant] of Object.entries(switchConfig.variants || {})) {
    const tokens = variant.tokens || [];
    if (tokens.some((token) => value.includes(String(token).toLowerCase()))) {
      return type;
    }
  }

  return "";
}

function applyPersonTemplateSwitch(doc, row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = config.personTemplateSwitch;
  if (!switchConfig || !switchConfig.enabled) return;

  const type = getPersonTemplateType(row);
  const legacyLayer = findLayerByName(doc, switchConfig.legacyName || "img.person");
  const variantLayers = {};

  for (const [variantType, variant] of Object.entries(switchConfig.variants || {})) {
    variantLayers[variantType] = findLayerByAnyName(doc, variant.names || []);
  }

  Object.values(variantLayers).forEach((layer) => {
    if (layer) layer.visible = false;
  });

  if (type && variantLayers[type]) {
    if (legacyLayer) legacyLayer.visible = false;
    variantLayers[type].visible = true;
    log(`  Person template switch: show ${type}.`);
    return;
  }

  if (type && legacyLayer) {
    legacyLayer.visible = true;
    log(`  Person template layer for "${type}" not found. Keeping legacy img.person visible.`);
    return;
  }

  if (legacyLayer) legacyLayer.visible = false;
  log("  Person template switch: all person layers hidden.");
}

function toPhotoshopText(value) {
  return String(value).replace(/\r\n/g, "\r").replace(/\n/g, "\r");
}

function getTitleFontConfig(row) {
  const latinName = String(row && (row["txt.titleLatinFont"] || row["title.latinFont"]) || "").trim();
  const chineseName = String(row && (row["txt.titleChineseFont"] || row["title.chineseFont"]) || "").trim();
  return {
    latin: {
      postScriptName: String(row && (row["txt.titleLatinFontPostScript"] || row["title.latinFontPostScript"]) || latinName || TITLE_FONT_RULE.latin.postScriptName).trim(),
      fontName: latinName || TITLE_FONT_RULE.latin.fontName
    },
    chinese: {
      postScriptName: String(row && (row["txt.titleChineseFontPostScript"] || row["title.chineseFontPostScript"]) || chineseName || TITLE_FONT_RULE.chinese.postScriptName).trim(),
      fontName: chineseName || TITLE_FONT_RULE.chinese.fontName
    }
  };
}

function parseTitleSuperscriptMarkup(value) {
  const input = String(value || "");
  const superscripts = [];
  let output = "";
  let index = 0;
  const pattern = /<sup\s*([0-9A-Za-z]+)\s*>|<sup>(.*?)<\/sup>|[⁰¹²³⁴⁵⁶⁷⁸⁹]/g;
  const superscriptMap = {
    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9"
  };
  let match;

  while ((match = pattern.exec(input)) !== null) {
    output += input.slice(index, match.index);
    const text = superscriptMap[match[0]] || (match[1] !== undefined ? match[1] : match[2] || "");
    const from = Array.from(output).length;
    output += text;
    const to = Array.from(output).length;
    if (text) {
      superscripts.push({ from, to });
    }
    index = pattern.lastIndex;
  }

  output += input.slice(index);
  return { text: output, superscripts };
}

function shiftSuperscriptRanges(ranges, originalText, wrappedText) {
  if (!ranges || !ranges.length || originalText === wrappedText) return ranges || [];

  const rawChars = Array.from(toPhotoshopText(originalText));
  const wrappedChars = Array.from(toPhotoshopText(wrappedText));
  const shifted = [];
  let rawIndex = 0;

  for (let wrappedIndex = 0; wrappedIndex < wrappedChars.length; wrappedIndex += 1) {
    const char = wrappedChars[wrappedIndex];
    if (char === "\r") continue;

    const active = ranges.find((range) => rawIndex >= range.from && rawIndex < range.to);
    if (active) {
      const last = shifted[shifted.length - 1];
      if (last && last.source === active) {
        last.to = wrappedIndex + 1;
      } else {
        shifted.push({ from: wrappedIndex, to: wrappedIndex + 1, source: active });
      }
    }

    if (rawChars[rawIndex] === char) {
      rawIndex += 1;
    } else {
      rawIndex += 1;
    }
  }

  return shifted.map(({ from, to }) => ({ from, to }));
}

function isTitleLatinChar(char) {
  return /^[A-Za-z0-9¹²³⁴⁵⁶⁷⁸⁹⁰]$/.test(char);
}

function isIndexInRanges(index, ranges) {
  return (ranges || []).some((range) => index >= range.from && index < range.to);
}

function isIndexInStyleRanges(index, ranges) {
  return (ranges || []).find((range) => index >= range.from && index < range.to);
}

function buildTitleFontRanges(text, superscripts, scaledRanges) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const scaledRange = isIndexInStyleRanges(index, scaledRanges);
    const scaleKey = scaledRange ? `scale-${scaledRange.scale}` : "scale-1";
    const kind = `${isTitleLatinChar(char) ? "latin" : "chinese"}:${isIndexInRanges(index, superscripts) ? "sup" : "normal"}:${scaleKey}`;
    if (current === null) {
      current = kind;
      start = index;
      return;
    }
    if (kind !== current) {
      const [rangeKind, variant, scalePart] = current.split(":");
      ranges.push({ from: start, to: index, kind: rangeKind, superscript: variant === "sup", scale: Number(scalePart.replace("scale-", "")) || 1 });
      current = kind;
      start = index;
    }
  });

  if (current !== null) {
    const [kind, variant, scalePart] = current.split(":");
    ranges.push({ from: start, to: chars.length, kind, superscript: variant === "sup", scale: Number(scalePart.replace("scale-", "")) || 1 });
  }

  return ranges;
}

function getTextStylePointSize(style) {
  const size = style && style.size;
  if (size && typeof size._value === "number") return size._value;
  if (typeof size === "number") return size;
  return 48;
}

function makePointValue(value) {
  return { _unit: "pointsUnit", _value: value };
}

function makeRgbColor(color) {
  return {
    _obj: "RGBColor",
    red: Number(color && color.red) || 0,
    grain: Number(color && (color.green !== undefined ? color.green : color.grain)) || 0,
    blue: Number(color && color.blue) || 0
  };
}

function isLatinDigitChar(char) {
  return /^[A-Za-z0-9]$/.test(char);
}

function buildMixedTextStyleRanges(text, baseStyle, styleConfig) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = isLatinDigitChar(char) ? "latin" : "chinese";
    if (current === null) {
      current = kind;
      start = index;
      return;
    }

    if (kind !== current) {
      ranges.push({ from: start, to: index, kind: current });
      current = kind;
      start = index;
    }
  });

  if (current !== null) {
    ranges.push({ from: start, to: chars.length, kind: current });
  }

  return ranges.map((range) => {
    const config = styleConfig[range.kind] || {};
    const fontSize = styleConfig.preserveFontSize ? NaN : Number(config.fontSize || styleConfig.fontSize);
    const textStyle = {
      ...baseStyle,
      fontPostScriptName: config.postScriptName || baseStyle.fontPostScriptName,
      fontName: config.fontName || baseStyle.fontName,
      color: makeRgbColor(config.color || baseStyle.color)
    };
    if (Number.isFinite(fontSize) && fontSize > 0) {
      textStyle.size = makePointValue(fontSize);
      textStyle.impliedFontSize = makePointValue(fontSize);
    }
    return {
      _obj: "textStyleRange",
      from: range.from,
      to: range.to,
      textStyle
    };
  });
}

function buildMixedTextColorRanges(text, baseStyle, styleConfig) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = isLatinDigitChar(char) ? "latin" : "chinese";
    if (current === null) {
      current = kind;
      start = index;
      return;
    }
    if (kind !== current) {
      ranges.push({ from: start, to: index, kind: current });
      current = kind;
      start = index;
    }
  });

  if (current !== null) {
    ranges.push({ from: start, to: chars.length, kind: current });
  }

  return ranges.map((range) => {
    const config = styleConfig[range.kind] || {};
    return {
      _obj: "textStyleRange",
      from: range.from,
      to: range.to,
      textStyle: {
        ...baseStyle,
        color: makeRgbColor(config.color || baseStyle.color)
      }
    };
  });
}

function getStyleRangeForIndex(ranges, index) {
  if (!Array.isArray(ranges)) return null;
  return ranges.find((range) => index >= range.from && index < range.to) || ranges[0] || null;
}

function getTemplateTextStyleByKind(textKey, fallbackStyle) {
  const text = String(textKey && textKey.textKey || "");
  const chars = Array.from(text);
  const ranges = textKey && textKey.textStyleRange;
  const result = {
    chinese: fallbackStyle,
    latin: fallbackStyle
  };

  chars.forEach((char, index) => {
    const kind = isLatinDigitChar(char) ? "latin" : "chinese";
    if (result[kind] && result[kind] !== fallbackStyle) return;

    const range = getStyleRangeForIndex(ranges, index);
    if (range && range.textStyle) {
      result[kind] = range.textStyle;
    }
  });

  return result;
}

function buildMixedTextTemplateStyleRanges(text, styleByKind, styleConfig) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = isLatinDigitChar(char) ? "latin" : "chinese";
    if (current === null) {
      current = kind;
      start = index;
      return;
    }
    if (kind !== current) {
      ranges.push({ from: start, to: index, kind: current });
      current = kind;
      start = index;
    }
  });

  if (current !== null) {
    ranges.push({ from: start, to: chars.length, kind: current });
  }

  return ranges.map((range) => {
    const config = styleConfig[range.kind] || {};
    return {
      _obj: "textStyleRange",
      from: range.from,
      to: range.to,
      textStyle: {
        ...(styleByKind[range.kind] || styleByKind.chinese),
        color: makeRgbColor(config.color || (styleByKind[range.kind] && styleByKind[range.kind].color))
      }
    };
  });
}

function estimateTextLineWidth(text, fontSize) {
  return Array.from(String(text || "")).reduce((width, char) => {
    if (char === "\r" || char === "\n") return width;
    if (/\s/.test(char)) return width + fontSize * 0.34;
    if (/^[A-Za-z0-9]$/.test(char)) return width + fontSize * 0.56;
    if (/^[+\-*xX/.]$/.test(char)) return width + fontSize * 0.42;
    return width + fontSize;
  }, 0);
}

function estimateMultilineTextWidth(text, fontSize) {
  const lines = String(text || "").split(/\r\n|\r|\n/);
  return Math.max(...lines.map((line) => estimateTextLineWidth(line, fontSize)), 0);
}

function formatPddSubtitleText(value) {
  const text = String(value || "").trim();
  const plusCount = (text.match(/\+/g) || []).length;
  if (plusCount < 3 || text.includes("\n") || text.includes("\r")) return text;

  const parts = text.split("+").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 4) return text;

  const splitIndex = Math.ceil(parts.length / 2);
  return `${parts.slice(0, splitIndex).join("+")}+\n${parts.slice(splitIndex).join("+")}`;
}

async function applyTextLayerUniformStyle(layer, styleConfig, label) {
  if (!layer || !layer.textItem || !styleConfig) return;

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "textKey" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );

    const textKey = result && result[0] && result[0].textKey;
    const ranges = textKey && textKey.textStyleRange;
    if (!textKey || !Array.isArray(ranges) || !ranges.length) return;

    const fontSize = Number(styleConfig.fontSize);
    const textStyleRange = ranges.map((range) => {
      const textStyle = { ...(range.textStyle || {}) };
      if (styleConfig.postScriptName) textStyle.fontPostScriptName = styleConfig.postScriptName;
      if (styleConfig.fontName) textStyle.fontName = styleConfig.fontName;
      if (styleConfig.color) textStyle.color = makeRgbColor(styleConfig.color);
      if (Number.isFinite(fontSize) && fontSize > 0) {
        textStyle.size = makePointValue(fontSize);
        textStyle.impliedFontSize = makePointValue(fontSize);
      }
      return {
        ...range,
        textStyle
      };
    });

    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "textLayer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "textLayer",
            ...textKey,
            textStyleRange
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  ${label || layer.name} uniform style applied.`);
  } catch (error) {
    log(`  Uniform text style skipped for ${layer.name}: ${formatError(error)}`);
  }
}

function getTitleLineHeightRatio(row, hasScaledSecondLine) {
  const explicit = readNumber(row, "txt.titleLineHeightRatio", readNumber(row, "title.lineHeightRatio", null));
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return hasScaledSecondLine ? 0.6 : null;
}

function makeTitleStyle(baseStyle, font, superscript, scale, options) {
  const titleTracking = options && Number.isFinite(options.tracking) ? options.tracking : 75;
  const style = {
    _obj: "textStyle",
    ...baseStyle,
    fontPostScriptName: superscript ? TITLE_SUPERSCRIPT_FONT.postScriptName : font.postScriptName,
    fontName: superscript ? TITLE_SUPERSCRIPT_FONT.fontName : font.fontName,
    tracking: titleTracking
  };
  const baseSize = getTextStylePointSize(baseStyle);
  const leadingRatio = options && options.leadingRatio;

  if (Number.isFinite(leadingRatio) && leadingRatio > 0) {
    const leading = baseSize * leadingRatio;
    style.autoLeading = false;
    style.leading = makePointValue(leading);
    style.impliedLeading = makePointValue(leading);
  }

  if (superscript) {
    const supSize = baseSize * 0.56;
    const supShift = baseSize * 0.25;
    style.size = makePointValue(supSize);
    style.impliedFontSize = makePointValue(supSize);
    style.baseline = { _enum: "baseline", _value: "superScript" };
    style.baselineShift = makePointValue(supShift);
    style.baseLineShift = makePointValue(supShift);
    style.impliedBaselineShift = makePointValue(supShift);
  } else if (scale && scale !== 1) {
    const scaledSize = baseSize * scale;
    style.size = makePointValue(scaledSize);
    style.impliedFontSize = makePointValue(scaledSize);
  }

  return style;
}

function getLongSecondTitleLineInfo(text) {
  const lines = String(text || "").split(/\r\n|\r|\n/);
  if (lines.length < 2) return { triggered: false, lines, ranges: [] };

  const secondLine = lines[1] || "";
  const secondLineChars = Array.from(secondLine.replace(/\s/g, "")).length;
  if (secondLineChars <= 10) return { triggered: false, lines, secondLineChars, ranges: [] };

  const firstLineLength = Array.from(toPhotoshopText(lines[0] || "")).length;
  const secondLineLength = Array.from(toPhotoshopText(secondLine)).length;
  const from = firstLineLength + 1;
  return {
    triggered: true,
    lines,
    secondLineChars,
    ranges: [{ from, to: from + secondLineLength, scale: 0.5 }]
  };
}

async function applyTitleMixedFontRule(layer, text, row, superscripts, scaledRanges, options) {
  if (!layer || !layer.textItem || !text) return;

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

  const fontConfig = getTitleFontConfig(row);
  const ranges = buildTitleFontRanges(text, superscripts, scaledRanges);
  if (!ranges.length) return;

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "textKey" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );

    const textKey = result && result[0] && result[0].textKey;
    const baseStyleRange = textKey && textKey.textStyleRange && textKey.textStyleRange[0];
    const baseStyle = baseStyleRange && baseStyleRange.textStyle ? baseStyleRange.textStyle : {};
    const titleOptions = {
      ...(options || {}),
      tracking: readNumber(row, "txt.titleTracking", readNumber(row, "title.tracking", 75))
    };
    const textStyleRange = ranges.map((range) => {
      const font = fontConfig[range.kind];
      return {
        _obj: "textStyleRange",
        from: range.from,
        to: range.to,
        textStyle: makeTitleStyle(baseStyle, font, range.superscript, range.scale, titleOptions)
      };
    });

    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "textLayer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "textLayer",
            ...textKey,
            textKey: toPhotoshopText(text),
            textStyleRange
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );

    const baseSize = getTextStylePointSize(baseStyle);
    const supInfo = (superscripts || []).map((range) => `${range.from}-${range.to}`).join(",");
    const scaleInfo = (scaledRanges || []).map((range) => `${range.from}-${range.to}@${range.scale}`).join(",");
    const leadingInfo = options && Number.isFinite(options.leadingRatio) ? options.leadingRatio : "-";
    log(`  Title mixed font applied: latin=${fontConfig.latin.fontName}, chinese=${fontConfig.chinese.fontName}, superscripts=${(superscripts || []).length}, ranges=${supInfo || "-"}, scaled=${scaleInfo || "-"}, leadingRatio=${leadingInfo}, baseSize=${Math.round(baseSize)}, supSize=${Math.round(baseSize * 0.56)}.`);
  } catch (error) {
    log(`  Title mixed font skipped: ${formatError(error)}`);
  }
}

function getImageGroupAreaBox(row, prefix, fallbackBox) {
  const x = readNumber(row, `${prefix}.x`, null);
  const y = readNumber(row, `${prefix}.y`, null);
  const width = readNumber(row, `${prefix}.w`, readNumber(row, `${prefix}.width`, null));
  const height = readNumber(row, `${prefix}.h`, readNumber(row, `${prefix}.height`, null));

  if ([x, y, width, height].every((value) => Number.isFinite(value)) && width > 0 && height > 0) {
    return {
      left: x,
      top: y,
      right: x + width,
      bottom: y + height,
      width,
      height,
      centerX: x + width / 2,
      centerY: y + height / 2
    };
  }

  return fallbackBox;
}

function getGiftRightAnchorBox(row) {
  const config = getCurrentTemplateConfig();
  const defaultBox = config.giftRightBox || BASE_TEMPLATE_CONFIG.giftRightBox;
  const fallbackBox = makeBox(
    defaultBox.left,
    defaultBox.top,
    defaultBox.width,
    defaultBox.height
  );
  const hasManualBox = ["x", "y", "w", "width", "h", "height"].some((key) => {
    const value = row && row[`giftRight.${key}`];
    return value !== undefined && value !== null && value !== "";
  });

  return hasManualBox ? getImageGroupAreaBox(row, "giftRight", fallbackBox) : fallbackBox;
}

function getImageGroupGap(row, prefix, layout, itemWidth) {
  const gapValue = row[`${prefix}.gap`];
  const legacySpacingValue = row[`${prefix}.spacing`];

  if (layout === "line") {
    if (gapValue !== undefined && gapValue !== "") {
      return Math.max(0, readNumber(row, `${prefix}.gap`, 0));
    }
    return 0;
  }

  if (gapValue !== undefined && gapValue !== "") {
    return readNumber(row, `${prefix}.gap`, 0);
  }

  if (legacySpacingValue !== undefined && legacySpacingValue !== "") {
    return Number(legacySpacingValue) || 0;
  }

  if (layout === "stack" || layout === "overlap") {
    return -itemWidth * 0.42;
  }

  return 0;
}

function hasProductCategoryGap(row) {
  if (!row) return false;
  return Object.keys(row).some((key) => /^product\.gap\.\d+$/.test(key) && row[key] !== "");
}

function getProductGapAt(row, leftIndex, layout, itemWidth, fallbackGap) {
  const categoryRank = getProductCategoryRank(row, leftIndex, Math.max(leftIndex + 1, getGiftCount(row, "product") || 1));
  const categoryGap = readNumber(row, `product.gap.${categoryRank}`, null);
  if (Number.isFinite(categoryGap)) {
    return layout === "line" ? Math.max(0, categoryGap) : categoryGap;
  }
  return fallbackGap;
}

function getProductItemGaps(row, items, layout, itemWidth, fallbackGap) {
  const gaps = [];
  for (let i = 0; i < Math.max(0, items.length - 1); i += 1) {
    gaps.push(getProductGapAt(row, i + 1, layout, itemWidth, fallbackGap));
  }
  return gaps;
}

function shouldTouchProductEdges(row) {
  const value = String(row && (row["product.touchEdges"] || row["product.touch"] || "") || "").trim().toLowerCase();
  return /^(1|true|yes|y|on|贴边)$/.test(value);
}

function getImageGroupTargetBoxes(row, prefix, baseBox, areaFallbackBox, count, layout) {
  const areaBox = getImageGroupAreaBox(row, prefix, areaFallbackBox || baseBox);
  const aspect = baseBox.width / baseBox.height;
  const hasItemHeight = row[`${prefix}.itemH`] || row[`${prefix}.itemHeight`];
  const hasItemWidth = row[`${prefix}.itemW`] || row[`${prefix}.itemWidth`];
  const heightRatio = readNumber(row, `${prefix}.heightRatio`, getDefaultHeightRatio(row, prefix));

  let itemHeight = readNumber(row, `${prefix}.itemH`, readNumber(row, `${prefix}.itemHeight`, areaBox.height * heightRatio));
  let itemWidth = readNumber(row, `${prefix}.itemW`, readNumber(row, `${prefix}.itemWidth`, itemHeight * aspect));

  if (itemHeight > areaBox.height) {
    const shrink = areaBox.height / itemHeight;
    itemHeight *= shrink;
    itemWidth *= shrink;
  }

  let gap = getImageGroupGap(row, prefix, layout, itemWidth);
  let totalWidth = itemWidth * count + gap * (count - 1);
  if (prefix !== "giftLeft" && totalWidth > areaBox.width) {
    const availableItemWidth = Math.max(1, (areaBox.width - gap * (count - 1)) / count);
    const shrink = availableItemWidth / itemWidth;
    itemWidth *= shrink;
    itemHeight *= shrink;
    gap = getImageGroupGap(row, prefix, layout, itemWidth);
    totalWidth = itemWidth * count + gap * (count - 1);
  }

  const bottom = readNumber(row, `${prefix}.bottom`, areaBox.bottom);
  const centerY = bottom - itemHeight / 2;
  const startX = areaBox.centerX - totalWidth / 2 + itemWidth / 2;
  const boxes = [];

  for (let i = 0; i < count; i += 1) {
    const yOffset = layout === "stack" ? (i - (count - 1) / 2) * itemHeight * 0.05 : 0;
    const centerX = startX + i * (itemWidth + gap);
    const itemCenterY = centerY + yOffset;
    boxes.push({
      left: centerX - itemWidth / 2,
      top: itemCenterY - itemHeight / 2,
      right: centerX + itemWidth / 2,
      bottom: itemCenterY + itemHeight / 2,
      width: itemWidth,
      height: itemHeight,
      centerX,
      centerY: itemCenterY
    });
  }

  return boxes;
}

async function prepareGiftLeftAmpouleLayers(doc, row, baseLayer, areaBox) {
  state.placedImageLayers = state.placedImageLayers || {};

  const imagePath = getGiftLeftAmpouleImagePath(row);
  const groupCount = getGiftLeftAmpouleGroupCount(row);
  if (!imagePath || groupCount <= 0) return false;

  for (let i = 1; i <= 12; i += 1) {
    const oldLayer = findLayerByName(doc, `img.giftLeft.${i}`);
    if (oldLayer) {
      oldLayer.visible = false;
      oldLayer.name = `__ignored.img.giftLeft.${i}`;
    }
  }

  const rows = getGiftLeftAmpouleRows(groupCount);
  const rowGap = readNumber(row, "giftLeft.ampouleRowGap", 6);
  const colGap = readNumber(row, "giftLeft.ampouleGap", 0);
  const rowHeight = (areaBox.height - rowGap * Math.max(rows.length - 1, 0)) / rows.length;
  const requestedHeight = readNumber(row, "giftLeft.ampouleGroupHeight", null);
  let groupHeight = Number.isFinite(requestedHeight)
    ? requestedHeight
    : rowHeight * readNumber(row, "giftLeft.ampouleHeightRatio", 0.95);

  const asset = await getAssetEntry(imagePath);
  const layers = [];
  for (let i = 1; i <= groupCount; i += 1) {
    const layer = await placeAssetAsLayer(asset);
    layer.name = `img.giftLeft.${i}`;
    layer.visible = true;
    const box = getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (box) {
      layers.push({ layer, box });
      state.placedImageLayers[layer.name] = true;
    }
  }

  if (!layers.length) return false;

  const aspect = layers[0].box.width / layers[0].box.height;
  const maxRowCount = Math.max(...rows);
  const maxRowWidth = maxRowCount * groupHeight * aspect + Math.max(maxRowCount - 1, 0) * colGap;
  if (maxRowWidth > areaBox.width) {
    groupHeight *= areaBox.width / maxRowWidth;
  }

  const fitScale = getImageGroupScale(row, "giftLeft");
  let index = 0;
  const totalHeight = groupHeight * rows.length + rowGap * Math.max(rows.length - 1, 0);
  if (totalHeight > areaBox.height) {
    groupHeight *= areaBox.height / totalHeight;
  }

  const finalTotalHeight = groupHeight * rows.length + rowGap * Math.max(rows.length - 1, 0);
  let rowTop = areaBox.centerY - finalTotalHeight / 2;

  for (const rowCount of rows) {
    const rowWidth = rowCount * groupHeight * aspect + Math.max(rowCount - 1, 0) * colGap;
    let left = areaBox.centerX - rowWidth / 2;
    const targetBottom = rowTop + groupHeight;

    for (let item = 0; item < rowCount; item += 1) {
      const layer = layers[index].layer;
      const itemWidth = groupHeight * aspect;
      const targetBox = {
        left,
        top: rowTop,
        right: left + itemWidth,
        bottom: targetBottom,
        width: itemWidth,
        height: groupHeight,
        centerX: left + itemWidth / 2,
        centerY: rowTop + groupHeight / 2
      };

      await fitLayerToBox(layer, targetBox, { alignY: "bottom", fitBy: "height" });
      await scaleLayerByFactor(layer, fitScale);
      await clampLayerToBox(layer, areaBox);
      left += itemWidth + colGap;
      index += 1;
    }

    rowTop = targetBottom + rowGap;
  }

  if (baseLayer) baseLayer.visible = false;

  log(`  GiftLeft ampoule layout: groups=${groupCount}, rows=${rows.join("+")}, groupH=${Math.round(groupHeight)}, gap=${colGap}, rowGap=${rowGap}.`);
  return true;
}

async function prepareImageGroupLayers(doc, row, prefix) {
  if (prefix === "giftRight") {
    hideGeneratedGiftRightLayers(doc);
    log("  GiftRight uses template smart object only; skipped group layout.");
    return;
  }

  const count = getGiftCount(row, prefix);
  const baseName = `img.${prefix}`;
  const baseLayer = findLayerByName(doc, baseName);
  const areaLayer = getImageGroupAreaLayer(doc, prefix, count);
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));

  if (areaLayer) {
    areaLayer.visible = false;
  }
  hideImageGroupAreaLayers(doc, prefix);

  if (areaBox) {
    log(`  ${prefix}.area: ${areaLayer.name}, x=${Math.round(areaBox.left)}, y=${Math.round(areaBox.top)}, w=${Math.round(areaBox.width)}, h=${Math.round(areaBox.height)}`);
    state.groupAreaBoxes[prefix] = areaBox;
  } else {
    log(`  ${prefix}.area not found. Using img.${prefix} as layout area.`);
    delete state.groupAreaBoxes[prefix];
  }

  if ((count <= 1 && prefix !== "giftLeft") || !baseLayer) return;

  const baseBox = getBoundsBox(baseLayer.boundsNoEffects || baseLayer.bounds);
  if (!baseBox) return;

  const layout = resolveImageGroupLayout(row, prefix, count);
  const isProductLine = prefix === "product" && layout === "line";
  const targetBoxes = getImageGroupTargetBoxes(row, prefix, baseBox, areaBox, count, layout);

  if (prefix === "giftLeft" && isGiftLeftAmpouleSet(row)) {
    const handled = await prepareGiftLeftAmpouleLayers(doc, row, baseLayer, areaBox || baseBox);
    if (handled) return;
  }

  if ((count > 1 || prefix === "giftLeft") && shouldPlaceGroupFromFiles(row, prefix)) {
    await preparePlacedImageGroupLayers(doc, row, prefix, baseLayer, targetBoxes, areaBox, count, layout);
    return;
  }

  const layers = [];
  const createOrder = prefix === "product" && getImageGroupZOrder(row, prefix) === "leftFront"
    ? Array.from({ length: count }, (_, index) => count - index)
    : Array.from({ length: count }, (_, index) => index + 1);

  for (const i of createOrder) {
    const layerName = `img.${prefix}.${i}`;
    let layer = findLayerByName(doc, layerName);
    const forceDuplicate = shouldDuplicateGroupFromBase(row, prefix);

    if (layer && forceDuplicate) {
      layer.visible = false;
      layer.name = `__ignored.${layerName}`;
      layer = null;
      log(`  Ignored existing ${layerName}; duplicating from ${baseName}.`);
    }

    if (!layer) {
      layer = await baseLayer.duplicate();
      layer.name = layerName;
      log(`  Created ${layerName} from ${baseName}.`);
    }

    layer.visible = true;
    await fitLayerToBox(layer, targetBoxes[i - 1], { alignY: prefix === "product" ? "bottom" : "center" });
    if (areaBox && !isProductLine) {
      await clampLayerToBox(layer, areaBox);
    }
    state.giftTargets[layerName] = {
      prefix,
      targetBox: targetBoxes[i - 1],
      areaBox,
      scale: isProductLine ? 1 : getImageGroupScale(row, prefix),
      alignY: prefix === "product" ? "bottom" : "center",
      fitBy: prefix === "product" && getImageGroupSourceText(row, prefix).includes("cream") ? "height" : "contain",
      skipClamp: isProductLine
    };
    layers.push(layer);
  }

  if (prefix === "product") {
    const productItems = layers.map((layer) => ({
      layer,
      box: getBoundsBox(layer.boundsNoEffects || layer.bounds)
    })).filter((item) => item.box);
    await arrangeProductLayerStacking(productItems, getImageGroupZOrder(row, "product"));
  }

  baseLayer.visible = false;

  for (let i = count + 1; i <= 6; i += 1) {
    const extraLayer = findLayerByName(doc, `img.${prefix}.${i}`);
    if (extraLayer) {
      extraLayer.visible = false;
    }
  }

  log(`  Prepared ${layers.length} ${prefix} image layers with ${layout} layout.`);
}

function getImageGroupAreaLayer(doc, prefix, count) {
  if (prefix === "product") {
    const area1 = findLayerByName(doc, "product.area.1");
    const area2 = findLayerByName(doc, "product.area.2");
    const fallback = findLayerByName(doc, "product.area");
    return count > 2 ? area2 || fallback || area1 : area1 || fallback || area2;
  }

  return findLayerByName(doc, `${prefix}.area`);
}

function hideImageGroupAreaLayers(doc, prefix) {
  if (prefix === "product") {
    ["product.area", "product.area.1", "product.area.2"].forEach((name) => {
      const layer = findLayerByName(doc, name);
      if (layer) layer.visible = false;
    });
    return;
  }

  const layer = findLayerByName(doc, `${prefix}.area`);
  if (layer) layer.visible = false;
}

function hideGeneratedGiftRightLayers(doc) {
  for (let i = 1; i <= 6; i += 1) {
    const layer = findLayerByName(doc, `img.giftRight.${i}`);
    if (layer) {
      layer.visible = false;
      log(`  Hidden generated img.giftRight.${i}.`);
    }
  }
}

async function placeAssetAsLayer(file) {
  ensureModules();
  const token = fs.createSessionToken(file);
  await photoshop.action.batchPlay(
    [
      {
        _obj: "placeEvent",
        null: {
          _kind: "local",
          _path: token
        },
        linked: false,
        _options: {
          dialogOptions: "dontDisplay"
        }
      }
    ],
    { synchronousExecution: false, modalBehavior: "execute" }
  );

  return photoshop.app.activeDocument.activeLayers[0];
}

async function preparePlacedImageGroupLayers(doc, row, prefix, baseLayer, targetBoxes, areaBox, count, layout) {
  state.placedImageLayers = state.placedImageLayers || {};
  const isProductLine = prefix === "product" && layout === "line";

  for (let i = 1; i <= 6; i += 1) {
    const oldLayer = findLayerByName(doc, `img.${prefix}.${i}`);
    if (oldLayer) {
      oldLayer.visible = false;
      oldLayer.name = `__ignored.img.${prefix}.${i}`;
    }
  }

  const layers = [];
  for (let i = 1; i <= count; i += 1) {
    const imagePath = row[`img.${prefix}.${i}`] || row[`img.${prefix}`];
    if (!imagePath) continue;

    const asset = await getAssetEntry(imagePath, {
      disableTrimmed: prefix === "giftRight",
      normalizeGiftRight: prefix === "giftRight"
    });
    const layer = await placeAssetAsLayer(asset);
    layer.name = `img.${prefix}.${i}`;
    layer.visible = true;
    const targetBox = prefix === "product"
      ? applyProductHeightRatioToBox(row, i, areaBox, targetBoxes[i - 1], count)
      : prefix === "giftLeft"
        ? applyGiftLeftHeightRatioToBox(row, i, areaBox, targetBoxes[i - 1])
        : targetBoxes[i - 1];

    const fitByHeight = prefix === "product" && getImageSourceForIndex(row, prefix, i).includes("cream") ||
      prefix === "giftLeft" ||
      prefix === "giftRight";
    await fitLayerToBox(layer, targetBox, {
      alignY: prefix === "product" ? "bottom" : "center",
      fitBy: fitByHeight ? "height" : "contain"
    });
    if (prefix === "product" && areaBox) {
      log(`  Product height rule: ${layer.name}, mode=${getProductHeightMode(row, count)}, category=${getProductCategory(row, i)}, ratio=${getProductHeightRatio(row, i, count)}, targetH=${Math.round(targetBox.height)}`);
    }
    if (!isProductLine) {
      await scaleLayerByFactor(layer, getImageGroupScale(row, prefix), {
        anchor: prefix === "product" ? "bottomCenter" : "center"
      });
    }
    if (areaBox && !isProductLine) {
      await clampLayerToBox(layer, areaBox);
    }
    if (prefix === "product" && areaBox && !isProductLine) {
      await alignLayerBottomToBox(layer, areaBox);
    }
    if (prefix === "giftLeft") {
      const finalBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
      log(`  GiftLeft placed: ${layer.name}, category=${getProductCategoryFromSource(getImageSourceForIndex(row, "giftLeft", i))}, rawRatio=${getGiftLeftHeightRatio(row, i)}, effectiveRatio=${getGiftLeftEffectiveHeightRatio(row, i)}, giftScale=${getImageGroupScale(row, "giftLeft")}, productScale=${getImageGroupScale(row, "product")}, targetH=${Math.round(targetBox.height)}, finalH=${finalBox ? Math.round(finalBox.height) : "?"}`);
    }

    state.placedImageLayers[layer.name] = true;
    layers.push(layer);
  }

  if (baseLayer) {
    baseLayer.visible = false;
  }

  if (prefix === "product") {
    const productItems = layers.map((layer) => ({
      layer,
      box: getBoundsBox(layer.boundsNoEffects || layer.bounds)
    })).filter((item) => item.box);
    await arrangeProductLayerStacking(productItems, getImageGroupZOrder(row, "product"));
  }

  log(`  Placed ${layers.length} independent ${prefix} image layers with ${layout} layout.`);
}

function collectProductItems(doc, count) {
  const items = [];
  for (let i = 1; i <= count; i += 1) {
    const layer = findLayerByName(doc, `img.product.${i}`);
    const box = layer && getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (layer && box) {
      items.push({ layer, box });
    }
  }
  return items;
}

async function scaleProductItemsToHeight(items, row, areaBox) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const ratio = getProductHeightRatio(row, i + 1, items.length);
    const targetHeight = areaBox.height * ratio;
    if (targetHeight > 0 && item.box.height > 0) {
      await scaleLayerByFactor(item.layer, targetHeight / item.box.height, { anchor: "bottomCenter" });
    }
    log(`  Product height rule: ${item.layer.name}, mode=${getProductHeightMode(row, items.length)}, category=${getProductCategory(row, i + 1)}, ratio=${ratio}, targetH=${Math.round(targetHeight)}`);
  }
}

async function applyProductScaleToItems(items, row) {
  const factor = readNumber(row, "product.scale", 1);
  if (!Number.isFinite(factor) || factor <= 0 || factor === 1) return;

  for (const item of items) {
    await scaleLayerByFactor(item.layer, factor, { anchor: "bottomCenter" });
  }
  log(`  Product scale applied: factor=${factor}, items=${items.length}`);
}

async function scaleProductItemsByFactor(items, factor) {
  if (!Number.isFinite(factor) || factor <= 0 || factor >= 1) return;
  for (const item of items) {
    await scaleLayerByFactor(item.layer, factor, { anchor: "bottomCenter" });
  }
}

function getItemsTotalWidth(items, gapsOrGap) {
  const width = items.reduce((sum, item) => sum + item.box.width, 0);
  if (Array.isArray(gapsOrGap)) {
    return width + gapsOrGap.reduce((sum, gap) => sum + gap, 0);
  }
  return width + gapsOrGap * Math.max(0, items.length - 1);
}

function getItemsGroupBox(items) {
  const boxes = items.map((item) => item.box).filter(Boolean);
  if (!boxes.length) return null;

  const left = Math.min(...boxes.map((box) => box.left));
  const top = Math.min(...boxes.map((box) => box.top));
  const right = Math.max(...boxes.map((box) => box.right));
  const bottom = Math.max(...boxes.map((box) => box.bottom));
  return makeBox(left, top, right - left, bottom - top);
}

function refreshProductItems(items) {
  return items.map((item) => ({
    layer: item.layer,
    box: getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds)
  })).filter((item) => item.box);
}

async function translateProductItems(items, dx, dy) {
  if (!dx && !dy) return;
  for (const item of items) {
    await item.layer.translate(dx, dy);
  }
}

async function scaleProductItemsToFitArea(items, areaBox) {
  const groupBox = getItemsGroupBox(items);
  if (!groupBox || !areaBox) return items;

  const factor = Math.min(areaBox.width / groupBox.width, areaBox.height / groupBox.height, 1);
  if (Number.isFinite(factor) && factor > 0 && factor < 1) {
    await scaleProductItemsByFactor(items, factor);
    return refreshProductItems(items);
  }

  return items;
}

async function alignProductGroupBottomCenter(items, areaBox) {
  const groupBox = getItemsGroupBox(items);
  if (!groupBox || !areaBox) return items;

  await translateProductItems(items, areaBox.centerX - groupBox.centerX, areaBox.bottom - groupBox.bottom);
  return refreshProductItems(items);
}

async function arrangeProductLineItems(items, row, areaBox, rawLayout) {
  const touchEdges = shouldTouchProductEdges(row);
  const gap = touchEdges ? 0 : getImageGroupGap(row, "product", "line", 0);
  let freshItems = refreshProductItems(items);
  if (!freshItems.length || !areaBox) return;

  const gaps = touchEdges ? Array(Math.max(0, freshItems.length - 1)).fill(0) : getProductItemGaps(row, freshItems, "line", 0, gap);
  await applyProductScaleToItems(freshItems, row);
  freshItems = refreshProductItems(freshItems);

  let totalWidth = getItemsTotalWidth(freshItems, gaps);
  const maxHeight = Math.max(...freshItems.map((item) => item.box.height));
  const fitFactor = Math.min(areaBox.width / totalWidth, areaBox.height / maxHeight, 1);
  if (Number.isFinite(fitFactor) && fitFactor > 0 && fitFactor < 1) {
    await scaleProductItemsByFactor(freshItems, fitFactor);
    freshItems = refreshProductItems(freshItems);
    totalWidth = getItemsTotalWidth(freshItems, gaps);
  }

  let virtualLeft = 0;
  const groupLeft = areaBox.centerX - totalWidth / 2;
  for (let i = 0; i < freshItems.length; i += 1) {
    const item = freshItems[i];
    const targetCenterX = groupLeft + virtualLeft + item.box.width / 2;
    await item.layer.translate(targetCenterX - item.box.centerX, areaBox.bottom - item.box.bottom);
    virtualLeft += item.box.width + (gaps[i] || 0);
  }

  freshItems = refreshProductItems(freshItems);
  const finalGroupBox = getItemsGroupBox(freshItems);

  await arrangeProductLayerStacking(freshItems, getImageGroupZOrder(row, "product"));
  log(`  Arranged product line after replace. touchEdges=${touchEdges}, gap=${gaps.join("|") || gap}, fit=${Number.isFinite(fitFactor) ? fitFactor.toFixed(3) : "?"}, groupW=${finalGroupBox ? Math.round(finalGroupBox.width) : "?"}, groupH=${finalGroupBox ? Math.round(finalGroupBox.height) : "?"}, items=${freshItems.length}`);
}

async function arrangeProductOverlapItems(items, row, areaBox, layout) {
  const minWidth = Math.min(...items.map((item) => item.box.width));
  const hasManualOverlapRatio = row["product.overlapRatio"] !== undefined && row["product.overlapRatio"] !== "";
  const hasManualGap = !hasManualOverlapRatio && (row["product.gap"] !== undefined && row["product.gap"] !== "" || hasProductCategoryGap(row));
  const overlapRatio = getProductOverlapRatio(row, items);

  if (!hasManualGap && overlapRatio < 0) {
    const slotRow = {
      ...row,
      "product.gap": String(Math.round(areaBox.width * Math.abs(overlapRatio))),
      "product.slotFill": row["product.slotFill"] || "0.86"
    };
    await arrangeProductLineItems(items, slotRow, areaBox, "negative-slot");
    log(`  Arranged product ${layout} using negative slot spread. overlapRatio=${overlapRatio}, slotGap=${slotRow["product.gap"]}`);
    return;
  }

  let gap = hasManualGap
    ? getImageGroupGap(row, "product", layout, minWidth)
    : getProductOverlapGap(row, items, areaBox);
  let gaps = hasManualGap && hasProductCategoryGap(row)
    ? getProductItemGaps(row, items, layout, minWidth, gap)
    : gap;
  const totalWidth = getItemsTotalWidth(items, gaps);

  if (totalWidth > areaBox.width) {
    await scaleProductItemsByFactor(items, areaBox.width / totalWidth);
  }

  const finalItems = items.map((item) => ({
    layer: item.layer,
    box: getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds)
  })).filter((item) => item.box);

  if (!hasManualGap) {
    gap = getProductOverlapGap(row, finalItems, areaBox);
  }

  gaps = hasManualGap && hasProductCategoryGap(row)
    ? getProductItemGaps(row, finalItems, layout, minWidth, gap)
    : gap;
  const finalTotalWidth = getItemsTotalWidth(finalItems, gaps);
  let left = areaBox.centerX - finalTotalWidth / 2;
  const spreadByCenter = !hasManualGap && overlapRatio < 0;
  const centerSpan = spreadByCenter ? getNegativeOverlapSpan(row, finalItems, areaBox, overlapRatio) : 0;
  const centerStart = areaBox.centerX - centerSpan / 2;
  const centerStep = finalItems.length > 1 ? centerSpan / (finalItems.length - 1) : 0;

  for (let i = 0; i < finalItems.length; i += 1) {
    const item = finalItems[i];
    const targetCenterX = spreadByCenter ? centerStart + i * centerStep : left + item.box.width / 2;
    const yOffset = layout === "stack" ? (i - (finalItems.length - 1) / 2) * item.box.height * 0.04 : 0;
    await item.layer.translate(targetCenterX - item.box.centerX, areaBox.bottom - item.box.bottom + yOffset);
    left += item.box.width + (Array.isArray(gaps) ? gaps[i] || 0 : gap);
  }

  await arrangeProductLayerStacking(finalItems, getImageGroupZOrder(row, "product"));
  log(`  Arranged product ${layout} after replace. overlapRatio=${overlapRatio}, gap=${Array.isArray(gaps) ? gaps.map((item) => Math.round(item)).join("|") : Math.round(gap)}, centerSpan=${Math.round(centerSpan)}, totalWidth=${Math.round(finalTotalWidth)}, items=${finalItems.length}`);
}

async function arrangeProductLineAfterReplace(doc, row) {
  const count = getGiftCount(row, "product");
  const rawLayout = getImageGroupLayout(row, "product");
  const layout = resolveImageGroupLayout(row, "product", count);
  log(`  Product arrange check: count=${count}, layout=${layout}${rawLayout === "auto" ? " (auto)" : ""}`);
  if (count <= 1) {
    log("  Product arrange skipped: count <= 1.");
    return;
  }
  if (layout !== "line") {
    log("  Product arrange skipped: using prepared gift-style overlap layout.");
    return;
  }

  const areaBox = state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Product arrange skipped: product.area not found.");
    return;
  }

  const layers = collectProductItems(doc, count);
  if (!layers.length) {
    log("  Product arrange skipped: no product layers found.");
    return;
  }

  await scaleProductItemsToHeight(layers, row, areaBox);
  const refreshed = layers.map((item) => ({
    layer: item.layer,
    box: getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds)
  })).filter((item) => item.box);

  if (layout === "line") {
    await arrangeProductLineItems(refreshed, row, areaBox, rawLayout);
    return;
  }

  await arrangeProductOverlapItems(refreshed, row, areaBox, layout);
}

async function arrangeProductLayerStacking(items, zOrder) {
  if (!items.length) return;

  const leftToRight = [...items].sort((a, b) => a.box.centerX - b.box.centerX);
  const frontToBack = zOrder === "rightFront" ? [...leftToRight].reverse() : leftToRight;

  for (let i = frontToBack.length - 2; i >= 0; i -= 1) {
    const frontLayer = frontToBack[i].layer;
    const behindLayer = frontToBack[i + 1].layer;

    try {
      await frontLayer.move(behindLayer, photoshop.constants.ElementPlacement.PLACEBEFORE);
      log(`  Z-order: ${frontLayer.name} above ${behindLayer.name}`);
    } catch (error) {
      log(`  Warning: product z-order skipped for ${frontLayer.name}: ${formatError(error)}`);
    }
  }
}

async function keepPersonOnTop(doc) {
  const personLayer = findLayerByAnyName(doc, [
    "img.person.cuiyutao",
    "img.personCuiyutao",
    "img.person.zhangziyi",
    "img.personZhangziyi",
    "img.person"
  ]);
  if (!personLayer) return;

  const topLayer = doc.layers.find((layer) => layer !== personLayer);
  if (!topLayer) return;

  try {
    await personLayer.move(topLayer, photoshop.constants.ElementPlacement.PLACEBEFORE);
    log("  Kept img.person above all top-level layers.");
  } catch (error) {
    log(`  Warning: person top z-order skipped: ${formatError(error)}`);
  }
}

async function mergeActiveLayerBestEffort(layer) {
  if (!layer) return layer;
  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "mergeLayers",
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    return photoshop.app.activeDocument.activeLayers[0] || layer;
  } catch (error) {
    log(`  Product shadow merge skipped: ${formatError(error)}`);
    return layer;
  }
}

async function flipLayerVertical(layer) {
  if (!layer) return;
  try {
    await layer.scale(100, -100, photoshop.constants.AnchorPosition.MIDDLECENTER, {
      interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC
    });
  } catch (error) {
    ensureModules();
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "transform",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          freeTransformCenterState: {
            _enum: "quadCenterState",
            _value: "QCSAverage"
          },
          height: {
            _unit: "percentUnit",
            _value: -100
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  }
}

async function applyProductShadow(doc) {
  const config = getCurrentTemplateConfig().productShadow;
  if (!config || !config.enabled) return;

  const productGroup = findLayerByName(doc, config.sourceGroupName || "PRODUCT");
  if (!productGroup) {
    log("  Product shadow skipped: PRODUCT group not found.");
    return;
  }

  try {
    let shadowLayer = await productGroup.duplicate();
    shadowLayer.name = config.name || "PRODUCT.shadow";
    shadowLayer.visible = true;

    shadowLayer = await mergeActiveLayerBestEffort(shadowLayer);
    shadowLayer.name = config.name || "PRODUCT.shadow";
    await flipLayerVertical(shadowLayer);

    let shadowBox = getBoundsBox(shadowLayer.boundsNoEffects || shadowLayer.bounds);
    const top = readNumber(state.currentRow || {}, "productShadow.top", Number(config.top) || 740);
    if (shadowBox && Number.isFinite(top)) {
      await shadowLayer.translate(0, top - shadowBox.top);
    }

    const opacity = readNumber(state.currentRow || {}, "productShadow.opacity", Number(config.opacity) || 32);
    if (Number.isFinite(opacity) && opacity >= 0 && opacity <= 100) {
      try {
        shadowLayer.opacity = opacity;
      } catch (error) {
        log(`  Product shadow opacity skipped: ${formatError(error)}`);
      }
    }

    const projectGroup = findLayerByName(doc, config.targetGroupName || "PROJECT");
    if (projectGroup) {
      const placements = [
        photoshop.constants.ElementPlacement.PLACEINSIDE,
        photoshop.constants.ElementPlacement.PLACEATEND,
        photoshop.constants.ElementPlacement.INSIDE
      ].filter(Boolean);
      for (const placement of placements) {
        try {
          await shadowLayer.move(projectGroup, placement);
          break;
        } catch (error) {
          // Try the next UXP placement constant.
        }
      }
    }

    try {
      await shadowLayer.move(productGroup, photoshop.constants.ElementPlacement.PLACEAFTER);
    } catch (error) {
      log(`  Product shadow z-order skipped: ${formatError(error)}`);
    }

    shadowBox = getBoundsBox(shadowLayer.boundsNoEffects || shadowLayer.bounds);
    log(`  Product shadow applied: top=${shadowBox ? Math.round(shadowBox.top) : "?"}, opacity=${opacity}.`);
  } catch (error) {
    log(`  Product shadow skipped: ${formatError(error)}`);
  }
}

async function fitLayerToBox(layer, targetBox, options = {}) {
  const currentBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!targetBox || !currentBox) return;

  const scaleRatio = options.fitBy === "height"
    ? targetBox.height / currentBox.height
    : Math.min(targetBox.width / currentBox.width, targetBox.height / currentBox.height);
  const scalePct = scaleRatio * 100;
  if (!Number.isFinite(scalePct) || scalePct <= 0) return;

  const anchor = photoshop.constants.AnchorPosition.MIDDLECENTER;
  await layer.scale(scalePct, scalePct, anchor, {
    interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC
  });

  const scaledBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!scaledBox) return;

  const dx = targetBox.centerX - scaledBox.centerX;
  const dy = options.alignY === "bottom"
    ? targetBox.bottom - scaledBox.bottom
    : targetBox.centerY - scaledBox.centerY;

  await layer.translate(dx, dy);
}

async function clampLayerToBox(layer, targetBox) {
  const box = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!box || !targetBox) return;

  const shrink = Math.min(targetBox.width / box.width, targetBox.height / box.height, 1);
  if (Number.isFinite(shrink) && shrink > 0 && shrink < 1) {
    await layer.scale(shrink * 100, shrink * 100, photoshop.constants.AnchorPosition.MIDDLECENTER, {
      interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC
    });
  }

  const clampedBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!clampedBox) return;

  let dx = 0;
  let dy = 0;

  if (clampedBox.left < targetBox.left) dx = targetBox.left - clampedBox.left;
  if (clampedBox.right > targetBox.right) dx = targetBox.right - clampedBox.right;
  if (clampedBox.top < targetBox.top) dy = targetBox.top - clampedBox.top;
  if (clampedBox.bottom > targetBox.bottom) dy = targetBox.bottom - clampedBox.bottom;

  if (dx || dy) {
    await layer.translate(dx, dy);
  }
}

async function alignLayerBottomToBox(layer, targetBox) {
  if (!layer || !targetBox) return;
  const box = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!box) return;
  const dy = targetBox.bottom - box.bottom;
  if (Math.abs(dy) > 0.1) {
    await layer.translate(0, dy);
  }
}

async function scaleLayerByFactor(layer, factor, options = {}) {
  if (!Number.isFinite(factor) || factor <= 0 || factor === 1) return;

  const beforeBox = options.anchor === "bottomCenter"
    ? getBoundsBox(layer.boundsNoEffects || layer.bounds)
    : null;

  await layer.scale(factor * 100, factor * 100, photoshop.constants.AnchorPosition.MIDDLECENTER, {
    interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC
  });

  if (beforeBox && options.anchor === "bottomCenter") {
    const afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (afterBox) {
      await layer.translate(beforeBox.centerX - afterBox.centerX, beforeBox.bottom - afterBox.bottom);
    }
  }
}

async function resizeLayerToBox(layer, targetBox, options = {}) {
  if (!layer || !targetBox) return;
  const currentBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!currentBox || currentBox.width <= 0 || currentBox.height <= 0) return;

  const applyTransform = async (fromBox) => {
    const scaleX = Math.max(targetBox.width / fromBox.width, 0.01);
    const scaleY = options.preserveHeight ? 1 : Math.max(targetBox.height / fromBox.height, 0.01);
    await photoshop.action.batchPlay(
      [
        {
          _obj: "transform",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          freeTransformCenterState: {
            _enum: "quadCenterState",
            _value: "QCSAverage"
          },
          width: {
            _unit: "percentUnit",
            _value: scaleX * 100
          },
          height: {
            _unit: "percentUnit",
            _value: scaleY * 100
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  };

  const scaleX = Math.max(targetBox.width / currentBox.width, 0.01);
  const scaleY = options.preserveHeight ? 1 : Math.max(targetBox.height / currentBox.height, 0.01);
  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

  try {
    await layer.scale(scaleX * 100, scaleY * 100, photoshop.constants.AnchorPosition.MIDDLECENTER, {
      interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC
    });
  } catch (error) {
    await applyTransform(currentBox);
  }

  const afterScaleBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (afterScaleBox && Math.abs(afterScaleBox.width - targetBox.width) > 2) {
    await applyTransform(afterScaleBox);
  }

  const scaledBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!scaledBox) return;
  await layer.translate(targetBox.centerX - scaledBox.centerX, targetBox.centerY - scaledBox.centerY);
}

async function duplicateLayerToBox(sourceLayer, name, targetBox, options = {}) {
  if (!sourceLayer || !targetBox) return null;

  const layer = await sourceLayer.duplicate();
  layer.name = name;
  layer.visible = true;
  await resizeLayerToBox(layer, targetBox, options);
  return layer;
}

async function replaceTextLayer(layer, value) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }
  layer.textItem.contents = toPhotoshopText(value);
}

async function replaceTextLayerPreserveFirstStyle(layer, value) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const textValue = toPhotoshopText(value);

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "textKey" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );

    const textKey = result && result[0] && result[0].textKey;
    const baseRange = textKey && textKey.textStyleRange && textKey.textStyleRange[0];
    const baseStyle = baseRange && baseRange.textStyle;
    if (!textKey || !baseStyle) {
      await replaceTextLayer(layer, value);
      return;
    }

    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "textLayer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "textLayer",
            ...textKey,
            textKey: textValue,
            textStyleRange: [
              {
                _obj: "textStyleRange",
                from: 0,
                to: Array.from(textValue).length,
                textStyle: baseStyle
              }
            ]
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  Preserve text style skipped for ${layer.name}: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}

async function replaceTextLayerMixedStyle(layer, value, styleConfig, label) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const textValue = toPhotoshopText(value);

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "textKey" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );

    const textKey = result && result[0] && result[0].textKey;
    const baseRange = textKey && textKey.textStyleRange && textKey.textStyleRange[0];
    const baseStyle = baseRange && baseRange.textStyle;
    if (!textKey || !baseStyle) {
      await replaceTextLayer(layer, value);
      return;
    }

    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "textLayer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "textLayer",
            ...textKey,
            textKey: textValue,
            textStyleRange: buildMixedTextStyleRanges(textValue, baseStyle, styleConfig)
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  ${label || layer.name} mixed text style applied.`);
  } catch (error) {
    log(`  Mixed text style skipped for ${layer.name}: ${formatError(error)}`);
    await replaceTextLayerPreserveFirstStyle(layer, value);
  }
}

async function replaceTextLayerMixedColor(layer, value, styleConfig, label) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const textValue = toPhotoshopText(value);

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "textKey" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );

    const textKey = result && result[0] && result[0].textKey;
    const baseRange = textKey && textKey.textStyleRange && textKey.textStyleRange[0];
    const baseStyle = baseRange && baseRange.textStyle;
    if (!textKey || !baseStyle) {
      await replaceTextLayer(layer, value);
      return;
    }
    const styleByKind = getTemplateTextStyleByKind(textKey, baseStyle);

    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "textLayer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "textLayer",
            ...textKey,
            textKey: textValue,
            textStyleRange: buildMixedTextTemplateStyleRanges(textValue, styleByKind, styleConfig)
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  ${label || layer.name} color style applied.`);
  } catch (error) {
    log(`  Mixed color skipped for ${layer.name}: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}

async function scaleTextLayerFontSize(layer, scale) {
  if (!layer || !layer.textItem || !Number.isFinite(scale) || scale <= 0 || scale === 1) return;

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "textKey" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );

    const textKey = result && result[0] && result[0].textKey;
    const ranges = textKey && textKey.textStyleRange;
    if (!textKey || !Array.isArray(ranges) || !ranges.length) return;

    const textStyleRange = ranges.map((range) => {
      const textStyle = { ...(range.textStyle || {}) };
      const baseSize = getTextStylePointSize(textStyle);
      const scaledSize = baseSize * scale;
      textStyle.size = makePointValue(scaledSize);
      textStyle.impliedFontSize = makePointValue(scaledSize);
      return {
        ...range,
        textStyle
      };
    });

    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "textLayer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "textLayer",
            ...textKey,
            textStyleRange
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  Text font scale skipped for ${layer.name}: ${formatError(error)}`);
  }
}

async function applyBottomTextRules(layer, value) {
  const mixedStyle = getCurrentTemplateConfig().bottomTextMixedStyle;
  if (mixedStyle) {
    await replaceTextLayer(layer, value);
    log("  Bottom text contents only; style writes disabled to preserve PSD geometry.");
  } else {
    await replaceTextLayerPreserveFirstStyle(layer, value);
    const explicitScale = readNumber(state.currentRow || {}, "txt.bottomTextScale", readNumber(state.currentRow || {}, "bottomText.scale", 1));
    if (Number.isFinite(explicitScale) && explicitScale > 0 && explicitScale !== 1) {
      await scaleTextLayerFontSize(layer, explicitScale);
      log(`  Bottom text scaled by CSV: scale=${explicitScale}.`);
    }
  }
}

async function replaceSmartObjectLayer(layer, file) {
  if (!layer || !file) return;

  ensureModules();
  const originalTargetBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  const targetBox = originalTargetBox;
  const personAnchorBox = layer.name === "img.person" ? originalTargetBox : null;
  photoshop.app.activeDocument.activeLayers = [layer];
  const token = fs.createSessionToken(file);

  await photoshop.action.batchPlay(
    [
      {
        _obj: "placedLayerReplaceContents",
        null: {
          _kind: "local",
          _path: token
        },
        _options: {
          dialogOptions: "dontDisplay"
        }
      }
    ],
    { synchronousExecution: false, modalBehavior: "execute" }
  );

  if (layer.name === "img.person") {
    let afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (personAnchorBox && afterBox) {
      const scaleRatio = personAnchorBox.height / afterBox.height;
      if (Number.isFinite(scaleRatio) && scaleRatio > 0 && scaleRatio !== 1) {
        await layer.scale(scaleRatio * 100, scaleRatio * 100, photoshop.constants.AnchorPosition.MIDDLECENTER, {
          interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC
        });
        afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
      }
      if (afterBox) {
        await layer.translate(personAnchorBox.right - afterBox.right, personAnchorBox.bottom - afterBox.bottom);
      }
      log("  Restored img.person template size and right-bottom anchor.");
    } else {
      log("  Preserved img.person template position.");
    }
    return;
  }

  if (layer.name === "img.giftRight") {
    log("  GiftRight replaced only; kept template smart object transform.");
    return;
  }

  const giftTarget = state.giftTargets[layer.name];
  if (giftTarget) {
    await fitLayerToBox(layer, giftTarget.targetBox, {
      alignY: giftTarget.alignY,
      fitBy: giftTarget.fitBy
    });
    await scaleLayerByFactor(layer, giftTarget.scale);
    if (giftTarget.alignY === "bottom") {
      const afterScaleBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
      if (afterScaleBox) {
        await layer.translate(0, giftTarget.targetBox.bottom - afterScaleBox.bottom);
      }
    }
    if (giftTarget.areaBox && !giftTarget.skipClamp) {
      await clampLayerToBox(layer, giftTarget.areaBox);
    }
    return;
  }

  const groupMatch = layer.name.match(/^img\.(product|giftLeft|giftRight)$/);
  const areaBox = groupMatch && state.groupAreaBoxes[groupMatch[1]];
  if (areaBox) {
    const prefix = groupMatch[1];
    const row = state.currentRow || {};
    let targetBox = prefix === "product"
      ? applyProductHeightRatioToBox(row, 1, areaBox, areaBox, 1)
      : areaBox;
    let alignY = "bottom";
    let fitBy = prefix === "product" ? "height" : "contain";

    await fitLayerToBox(layer, targetBox, {
      alignY,
      fitBy
    });
    if (prefix === "product") {
      log(`  Product height rule: ${layer.name}, mode=${getProductHeightMode(row, 1)}, category=${getProductCategory(row, 1)}, ratio=${getProductHeightRatio(row, 1, 1)}, targetH=${Math.round(targetBox.height)}`);
    }
    await scaleLayerByFactor(layer, getImageGroupScale(row, prefix), {
      anchor: prefix === "product" ? "bottomCenter" : "center"
    });
    if (prefix !== "giftRight") {
      await clampLayerToBox(layer, areaBox);
    }
    if (prefix === "product") {
      await alignLayerBottomToBox(layer, areaBox);
      const alignedBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
      log(`  Product bottom aligned: layerBottom=${alignedBox ? Math.round(alignedBox.bottom) : "?"}, areaBottom=${Math.round(areaBox.bottom)}.`);
    }
    return;
  }

  if (shouldAutoFitImages()) {
    await fitLayerToBox(layer, targetBox);
  }

}

async function getAssetEntry(filename, options = {}) {
  if (!filename) return null;

  const normalized = String(filename).replace(/\\/g, "/");
  const productViewFallbacks = getProductImageViewFallbacks(normalized);
  for (const fallback of productViewFallbacks) {
    try {
      const entry = await getAssetEntryWithoutProductViewFallback(fallback, options);
      if (fallback !== normalized) {
        log(`  Product view asset fallback: ${normalized} -> ${fallback}`);
      }
      return entry;
    } catch (error) {
      // Try the next compatible naming style.
    }
  }

  return getAssetEntryWithoutProductViewFallback(normalized, options);
}

function getProductImageViewFallbacks(filename) {
  const normalized = String(filename || "").replace(/\\/g, "/");
  const match = normalized.match(/^(.*?)-(angle|front)(\.[^.]+)$/i);
  if (!match) {
    const baseMatch = normalized.match(/^(.*?)(\.[^.]+)$/);
    if (!baseMatch) return [normalized];

    const base = baseMatch[1];
    const ext = baseMatch[2];
    const withoutProducts = base.replace(/^products\//i, "");
    return Array.from(new Set([
      normalized,
      normalized.replace(/^products\//i, ""),
      `${base}-front${ext}`,
      `${withoutProducts}-front${ext}`,
      `front/${withoutProducts}-front${ext}`,
      `${base}-angle${ext}`,
      `${withoutProducts}-angle${ext}`,
      `angle/${withoutProducts}-angle${ext}`
    ]));
  }

  const base = match[1];
  const view = match[2].toLowerCase();
  const ext = match[3];
  const withoutProducts = base.replace(/^products\//i, "");
  const candidates = [normalized];
  candidates.push(normalized.replace(/^products\//i, ""));
  if (view === "angle") {
    candidates.push(`${base}${ext}`);
    candidates.push(`${base.replace(/(^|\/)angle(\/)/i, "$1$2")}${ext}`);
    candidates.push(`angle/${withoutProducts.replace(/(^|\/)angle(\/)/i, "$1")}-angle${ext}`);
  }
  if (view === "front") {
    candidates.push(`${base}-F${ext}`);
    candidates.push(`${base.replace(/(^|\/)front(\/)/i, "$1$2")}-F${ext}`);
    candidates.push(`${base.replace(/(^|\/)front(\/)/i, "$1$2")}-front${ext}`);
    candidates.push(`front/${withoutProducts.replace(/(^|\/)front(\/)/i, "$1")}-front${ext}`);
  }
  return Array.from(new Set(candidates));
}

async function getAssetEntryWithoutProductViewFallback(normalized, options = {}) {
  if (options.normalizeGiftRight && !normalized.startsWith("__giftRight/")) {
    try {
      const normalizedGiftRight = await assetsFolder.getEntry(`__giftRight/${normalized}`);
      log(`  Using normalized giftRight asset: __giftRight/${normalized}`);
      return normalizedGiftRight;
    } catch (error) {
      log(`  Normalized giftRight asset not found, using original: ${normalized}`);
    }
  }

  if (!options.disableTrimmed && (options.forceTrimmed || shouldUseTrimmedAssets()) && !normalized.startsWith("__trimmed/")) {
    try {
      const trimmed = await assetsFolder.getEntry(`__trimmed/${normalized}`);
      log(`  Using trimmed asset: __trimmed/${normalized}`);
      return trimmed;
    } catch (error) {
      log(`  Trimmed asset not found, using original: ${normalized}`);
    }
  }

  return assetsFolder.getEntry(normalized);
}

function getExportBaseName(row, index) {
  const prefix = $("filePrefix").value || "";
  const base = getConfiguredExportName(row, index);
  return `${prefix}${base}`.replace(/\.(?:jpe?g|psd)$/i, "");
}

function getExportName(row, index, format = "jpg") {
  const extension = format === "psd" ? "psd" : "jpg";
  return `${getExportBaseName(row, index)}.${extension}`;
}

function normalizeExportFormats(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/jpeg/g, "jpg")
    .replace(/both|all|jpg\s*\+\s*psd|psd\s*\+\s*jpg/g, "jpg,psd");
  const formats = raw
    .split(/[,+|/;；、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item === "jpeg" ? "jpg" : item)
    .filter((item) => item === "jpg" || item === "psd");
  const unique = Array.from(new Set(formats));
  return unique.length ? unique : ["jpg"];
}

function getExportFormats(row) {
  const rowFormat = row && (row["export.format"] || row.exportFormat || row["导出格式"]);
  const uiFormat = $("exportFormat") && $("exportFormat").value;
  return normalizeExportFormats(rowFormat || uiFormat || "jpg");
}

function splitImageList(value) {
  return String(value || "")
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap(expandRepeatedImageToken);
}

function expandRepeatedImageToken(token) {
  const normalized = token
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/Ｘ/g, "x")
    .replace(/ｘ/g, "x");
  const match = normalized.match(/^(.*?)(?:\s*(?:\*|x)\s*(\d+))$/i);
  if (!match) return [token];

  const image = match[1].trim();
  const count = Math.max(1, Math.min(Number(match[2]), 6));
  if (!image || !/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(image)) {
    return [token];
  }

  return Array.from({ length: count }, () => image);
}

const PRODUCT_NAME_COLUMNS = [
  "product.name.cn",
  "productName.cn",
  "product.cn",
  "productName",
  "product.names",
  "product.names.cn",
  "productSet.cn",
  "产品名称",
  "中文产品名称",
  "产品中文名",
  "产品组合"
];

function getProductNameField(row) {
  for (const key of PRODUCT_NAME_COLUMNS) {
    if (hasValue(row, key)) {
      return { key, value: row[key] };
    }
  }
  return { key: "", value: "" };
}

function splitProductNameList(value) {
  return String(value || "")
    .split(/[|+;；、\n\r]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function expandRepeatedProductNameToken(token) {
  const normalized = token
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/Ｘ/g, "x")
    .replace(/ｘ/g, "x");

  const match = normalized.match(/^(.*?)(?:\s*(?:\*|x)\s*(\d+))$/i);
  if (!match) return [token];

  const name = match[1].trim();
  const count = Math.max(1, Math.min(Number(match[2]), 6));
  if (!name) return [token];
  return Array.from({ length: count }, () => name);
}

function resolveProductNameToImage(name, options = {}) {
  const raw = String(name || "").trim();
  if (!raw) return "";
  if (/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(raw)) return raw;
  if (!state.productNameMap) return "";
  const normalized = normalizeProductNameKey(raw);
  const compact = compactSpecHyphenKey(normalized);
  const matchKey = compactProductNameMatchKey(normalized);
  const mapped = state.productNameMap.get(normalized)
    || state.productNameMap.get(compact)
    || state.productNameMap.get(matchKey);
  if (mapped) return mapped;
  if (options.allowRows === false) return "";
  return resolveProductNameByRows(raw);
}

function resolveProductNameTokenToImages(token) {
  const directImage = resolveProductNameToImage(token, { allowRows: false });
  if (directImage) {
    return { images: [directImage], missing: [] };
  }

  const images = [];
  const missing = [];
  expandRepeatedProductNameToken(token).forEach((name) => {
    const image = resolveProductNameToImage(name);
    if (image) {
      images.push(image);
    } else {
      missing.push(name);
    }
  });
  return { images, missing };
}

const PRODUCT_VIEW_COLUMNS = [
  "product.view",
  "product.imageView",
  "product.assetView",
  "product.viewMode",
  "产品视角"
];

const PRODUCT_VIEW_NOTE_COLUMNS = [
  "product.viewNote",
  "product.imageNote",
  "product.assetNote",
  "product.note",
  "note",
  "remark",
  "remarks",
  "备注"
];

function getProductImageView(row) {
  const explicit = String(firstTextValue(row, PRODUCT_VIEW_COLUMNS) || "").toLowerCase();
  if (/^(front|face|f|正面|正面图)$/.test(explicit)) return "front";
  if (/^(angle|angled|tilt|tilted|side|a|斜侧|倾斜|斜侧图|倾斜图)$/.test(explicit)) return "angle";

  const note = firstTextValue(row, PRODUCT_VIEW_NOTE_COLUMNS);
  if (!note) return "angle";
  if (/front|face|正面|正面图/i.test(note)) return "front";
  if (/angle|angled|tilt|tilted|side|斜侧|倾斜|斜侧图|倾斜图/i.test(note)) return "angle";
  return "front";
}

function withProductImageView(filename, view) {
  const raw = String(filename || "").trim();
  if (!raw || !/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(raw)) return raw;

  const match = raw.match(/^(.*?)(\.[^.]+)$/);
  if (!match) return raw;

  const base = match[1]
    .replace(/(^|[\\/])(?:angle|front)([\\/])/i, `$1${view}$2`)
    .replace(/-(?:angle|angled|tilt|tilted|front|face|f)$/i, "");
  return `${base}-${view}${match[2]}`;
}

function applyProductImageView(row) {
  const expanded = { ...row };
  const view = getProductImageView(expanded);
  const convert = (value) => {
    const spec = parseImageSpec(value);
    const images = spec.images.map((image) => withProductImageView(image, view)).join(" | ");
    if (spec.count || spec.layout) {
      return [spec.count || "", spec.layout || "", images].join(",");
    }
    return images;
  };

  ["img.product", "img.productSet"].forEach((key) => {
    if (hasValue(expanded, key)) {
      expanded[key] = convert(expanded[key]);
    }
  });

  Object.keys(expanded).forEach((key) => {
    if (/^img\.product\.\d+$/.test(key) && hasValue(expanded, key)) {
      expanded[key] = withProductImageView(expanded[key], view);
    }
  });

  expanded["product.view"] = view;
  return expanded;
}

function resolveProductNameByRows(name) {
  const raw = String(name || "").trim();
  const normalized = normalizeProductNameKey(raw);
  if (!normalized || !state.productNameRows || !state.productNameRows.length) return "";

  const querySpec = extractProductSpec(normalized);
  const queryAge = getAgeCnCanonicalFromText(normalized);
  const queryCategory = normalized.includes("瓶装") ? "瓶装" : normalized.includes("管装") ? "管装" : normalized.includes("罐装") ? "罐装" : "";
  const candidates = new Set();

  state.productNameRows.forEach((row) => {
    const fileName = String(row.file || row.filename || row["文件"] || "").trim();
    if (!fileName) return;

    const imagePath = fileName.includes("/") || fileName.includes("\\") ? fileName : `products/${fileName}`;
    const fullName = row.standard_cn || row["标准中文名"] || row["中文标准名"] || "";
    const age = row.age_cn || row["年龄段"] || "";
    const product = row.product_cn || row["产品名"] || "";
    const category = row.category_cn || row["品类"] || "";
    const spec = row.spec || row["规格"] || "";
    const productEn = row.product_en || row["product_en"] || "";
    const fullParts = String(fullName || "").split("-").map((part) => part.trim()).filter(Boolean);
    const standardProduct = fullParts.length >= 2 ? fullParts[1] : "";

    if (queryAge && age && !getAgeCnAliases(age).some((alias) => normalizeProductNameKey(alias) === normalizeProductNameKey(queryAge))) return;
    if (queryCategory && category && normalizeProductNameKey(category) !== normalizeProductNameKey(queryCategory)) return;
    if (querySpec && normalizeProductNameKey(spec) !== normalizeProductNameKey(querySpec)) return;
    if (/body-lotion/i.test(imagePath) && normalized.includes("安心霜")) return;

    const aliases = [
      fullName,
      product,
      standardProduct,
      ...getChineseProductAliases({ age, product, standardProduct, productEn })
    ].map(normalizeProductNameKey).filter(Boolean);

    if (aliases.some((alias) => normalized.includes(alias))) {
      candidates.add(imagePath);
    }
  });

  if (candidates.size === 1) return Array.from(candidates)[0];
  return choosePreferredProductImageForKey(normalized, candidates);
}

function extractProductSpec(value) {
  const match = String(value || "").match(/(\d+(?:\.\d+)?(?:g|ml|kg|l))/i);
  return match ? match[1] : "";
}

function expandProductNamesToSet(row) {
  const expanded = { ...row };
  if (hasValue(expanded, "img.productSet")) return expanded;

  const source = getProductNameField(expanded);
  if (!source.value) return expanded;

  const images = [];
  const missing = [];
  const tokens = splitProductNameList(source.value);
  if (!tokens.length) return expanded;

  tokens.forEach((token) => {
    const resolved = resolveProductNameTokenToImages(token);
    images.push(...resolved.images);
    missing.push(...resolved.missing);
  });

  if (images.length) {
    expanded["img.productSet"] = images.join(" | ");
    if (!expanded["product.count"]) {
      expanded["product.count"] = String(images.length);
    }
    log(`  Product CN mapped from ${source.key}: ${images.join(" | ")}`);
  }

  if (missing.length) {
    log(`  Product CN not found: ${missing.join(" | ")}`);
  }

  return expanded;
}

function parseImageSpec(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { images: [] };
  }

  const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return {
      count: parseCount(parts[0]),
      layout: parts[1],
      images: splitImageList(parts.slice(2).join(","))
    };
  }

  return {
    images: splitImageList(raw)
  };
}

function parseCount(value) {
  const match = String(value || "").match(/(\d+)/);
  return match ? Math.max(1, Math.min(Number(match[1]), 6)) : 0;
}

function getGiftCount(row, prefix) {
  const explicitCount = parseCount(row[`${prefix}.count`]);
  if (explicitCount) {
    return explicitCount;
  }

  const text = [
    row[`txt.${prefix}Title`],
    row[`txt.${prefix}Desc`],
    row[`txt.${prefix}`]
  ].filter(Boolean).join(" ");

  const normalized = text
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/Ｘ/g, "x")
    .replace(/ｘ/g, "x");
  const match = normalized.match(/(?:\*|x|X)\s*(\d+)/);
  return match ? Math.max(1, Math.min(Number(match[1]), 6)) : 0;
}

function expandGiftImageSet(row, prefix) {
  const expanded = { ...row };
  const setColumn = `img.${prefix}Set`;
  const baseColumn = `img.${prefix}`;
  const setSpec = parseImageSpec(row[setColumn]);
  const baseSpec = parseImageSpec(row[baseColumn]);
  const setImages = setSpec.images;

  if (setSpec.count && !expanded[`${prefix}.count`]) {
    expanded[`${prefix}.count`] = String(setSpec.count);
  }

  if (!setSpec.count && setImages.length && !expanded[`${prefix}.count`]) {
    expanded[`${prefix}.count`] = String(setImages.length);
  }

  if (setSpec.layout && !expanded[`${prefix}.layout`]) {
    expanded[`${prefix}.layout`] = setSpec.layout;
  }

  if (baseSpec.count && !expanded[`${prefix}.count`]) {
    expanded[`${prefix}.count`] = String(baseSpec.count);
  }

  if (baseSpec.layout && !expanded[`${prefix}.layout`]) {
    expanded[`${prefix}.layout`] = baseSpec.layout;
  }

  if (setImages.length) {
    if (!expanded[baseColumn]) {
      expanded[baseColumn] = setImages[0];
    }
    setImages.forEach((image, index) => {
      expanded[`img.${prefix}.${index + 1}`] = image;
    });
    return expanded;
  }

  const baseImage = baseSpec.images[0];
  if (baseImage && row[baseColumn] !== baseImage) {
    expanded[baseColumn] = baseImage;
  }

  const count = getGiftCount(row, prefix);
  if (baseImage && count > 1) {
    for (let i = 1; i <= count; i += 1) {
      if (!expanded[`img.${prefix}.${i}`]) {
        expanded[`img.${prefix}.${i}`] = baseImage;
      }
    }
  }

  return expanded;
}

function normalizeImageAliases(row) {
  const expanded = { ...row };
  Object.keys(row).forEach((key) => {
    const aliasMatch = key.match(/^(?:imag|image)\.(.+)$/);
    if (!aliasMatch) return;

    const canonical = `img.${aliasMatch[1]}`;
    if (!expanded[canonical] && row[key]) {
      expanded[canonical] = row[key];
    }
  });
  return expanded;
}

function expandRow(row) {
  let expanded = normalizeImageAliases(row);
  expanded = expandProductNamesToSet(expanded);
  expanded = applyProductImageView(expanded);
  expanded = expandGiftImageSet(expanded, "giftLeft");
  expanded = expandGiftImageSet(expanded, "giftRight");
  expanded = expandGiftImageSet(expanded, "product");
  expanded = applyTitleTextRules(expanded);
  return expanded;
}

function getDisplayLength(text) {
  return Array.from(String(text || "")).reduce((sum, char) => {
    return sum + (char.charCodeAt(0) <= 0x7f ? 0.5 : 1);
  }, 0);
}

function findWrapIndex(chars, wrapAt) {
  let width = 0;
  let lastSpaceIndex = -1;

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];
    width += char.charCodeAt(0) <= 0x7f ? 0.5 : 1;
    if (/\s/.test(char)) {
      lastSpaceIndex = i;
    }
    if (width >= wrapAt) {
      return lastSpaceIndex > 0 ? lastSpaceIndex : i + 1;
    }
  }

  return chars.length;
}

function wrapTitle(title, wrapAt) {
  const raw = String(title || "").trim();
  if (!raw || raw.includes("\n") || getDisplayLength(raw) <= wrapAt) {
    return raw;
  }

  const chars = Array.from(raw);
  const index = findWrapIndex(chars, wrapAt);
  const first = chars.slice(0, index).join("").trim();
  const second = chars.slice(index).join("").trim();
  return second ? `${first}\n${second}` : first;
}

function wrapTitleAtBestSpace(title) {
  const raw = String(title || "").replace(/[ \t]+/g, " ").trim();
  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return raw;

  const totalLength = getDisplayLength(raw);
  let best = null;
  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const score = Math.abs(getDisplayLength(first) - getDisplayLength(second));
    if (!best || score < best.score) {
      best = { text: `${first}\n${second}`, score, totalLength };
    }
  }
  return best ? best.text : raw;
}

function firstTextValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return undefined;
}

async function getLayerBox(layer) {
  return getBoundsBox(layer && (layer.boundsNoEffects || layer.bounds));
}

async function setTextAndMeasure(layer, contents) {
  layer.textItem.contents = toPhotoshopText(contents);
  return getLayerBox(layer);
}

function getTitleMaxWidth(row, titleLayer) {
  const explicit = readNumber(row, "txt.titleMaxWidth", readNumber(row, "title.maxWidth", null));
  if (Number.isFinite(explicit) && explicit > 0) return explicit;

  const titleBox = getBoundsBox(titleLayer && (titleLayer.boundsNoEffects || titleLayer.bounds));
  if (titleBox && titleBox.left < 620) {
    return Math.max(260, 650 - titleBox.left);
  }

  return 620;
}

async function wrapTitleToMeasuredWidth(layer, title, maxWidth, options = {}) {
  const raw = String(title || "").replace(/[ \t]+/g, " ").trim();
  if (!raw || raw.includes("\n")) {
    await setTextAndMeasure(layer, raw);
    return raw;
  }

  const row = state.currentRow || {};
  const forceMaxWidth = !!options.forceMaxWidth;
  const hasExplicitWrap = hasValue(row, "title.wrapAt") || hasValue(row, "txt.titleWrapAt");
  const hasExplicitMaxWidth = hasValue(row, "txt.titleMaxWidth") || hasValue(row, "title.maxWidth");
  const wrapAt = readNumber(row, "title.wrapAt", readNumber(row, "txt.titleWrapAt", null));
  if (hasExplicitWrap && /\s/.test(raw) && getDisplayLength(raw) > wrapAt) {
    const spaceWrapped = wrapTitleAtBestSpace(raw);
    await setTextAndMeasure(layer, spaceWrapped);
    log(`  Title wrapped at space: wrapAt=${wrapAt}`);
    return spaceWrapped;
  }

  const singleLineBox = await setTextAndMeasure(layer, raw);
  if ((!forceMaxWidth && !hasExplicitMaxWidth) || !singleLineBox || singleLineBox.width <= maxWidth) {
    return raw;
  }

  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    const displayLength = Math.max(getDisplayLength(raw), 1);
    const dynamicWrapAt = singleLineBox && singleLineBox.width > 0
      ? Math.max(8, Math.floor(displayLength * maxWidth / singleLineBox.width))
      : readNumber(state.currentRow || {}, "title.wrapAt", 13);
    const fallback = wrapTitle(raw, readNumber(state.currentRow || {}, "title.wrapAt", dynamicWrapAt));
    await setTextAndMeasure(layer, fallback);
    return fallback;
  }

  let best = null;
  for (let index = 1; index < words.length; index += 1) {
    const candidate = `${words.slice(0, index).join(" ")}\n${words.slice(index).join(" ")}`;
    const box = await setTextAndMeasure(layer, candidate);
    if (!box) continue;

    const overflow = Math.max(0, box.width - maxWidth);
    const score = overflow * 10000 + Math.abs(maxWidth - box.width);
    if (!best || score < best.score) {
      best = { text: candidate, score, width: box.width };
    }
  }

  if (best) {
    await setTextAndMeasure(layer, best.text);
    return best.text;
  }

  await setTextAndMeasure(layer, raw);
  return raw;
}

function applyTitleTextRules(row) {
  const expanded = { ...row };
  const hasExplicitWrap = hasValue(expanded, "title.wrapAt") || hasValue(expanded, "txt.titleWrapAt");
  const wrapAt = readNumber(expanded, "title.wrapAt", readNumber(expanded, "txt.titleWrapAt", null));

  if (expanded["txt.title"] && hasExplicitWrap && Number.isFinite(wrapAt) && getDisplayLength(expanded["txt.title"]) > wrapAt) {
    expanded["txt.title"] = wrapTitle(expanded["txt.title"], wrapAt);
  }

  if (getCurrentTemplateConfig().productNameToSubtitle) {
    const hasExplicitNote = ["txt.productNote", "txt.note", "txt.description", "txt.subtitle"].some((key) => hasValue(expanded, key));
    const productName = getProductNameField(expanded).value;
    if (!hasExplicitNote && productName) {
      expanded["txt.subtitle"] = productName;
      log("  PDD subtitle sourced from product.name.cn.");
    }
  }

  const productNote = expanded["txt.productNote"] || expanded["txt.note"] || expanded["txt.description"] || expanded["txt.subtitle"];
  if (productNote !== undefined && productNote !== null) {
    expanded["txt.productNote"] = productNote;
  }

  return expanded;
}

async function resizeSubtitleRectangle(doc, textLayer, textValue) {
  const config = getCurrentTemplateConfig().subtitleRectangle;
  if (!config || !textLayer) return;

  const rectangleLayer = findLayerByName(doc, config.layerName || "txt.subtitle.rectangle");
  if (!rectangleLayer) {
    log("  Subtitle rectangle not found.");
    return;
  }
  if (rectangleLayer.textItem) {
    log("  Subtitle rectangle resize skipped: target layer is text.");
    return;
  }

  const textBox = getBoundsBox(textLayer.boundsNoEffects || textLayer.bounds);
  if (!textBox) return;

  const paddingX = readNumber(state.currentRow || {}, "subtitle.rectanglePaddingX", Number(config.paddingX) || 0);
  const paddingY = readNumber(state.currentRow || {}, "subtitle.rectanglePaddingY", Number(config.paddingY) || 0);
  const subtitleStyle = getCurrentTemplateConfig().subtitleTextStyle || {};
  const fontSize = readNumber(state.currentRow || {}, "subtitle.fontSize", Number(subtitleStyle.fontSize) || 30);
  const estimatedTextWidth = estimateMultilineTextWidth(textValue || textLayer.textItem && textLayer.textItem.contents || "", fontSize);
  const measuredTextWidth = estimatedTextWidth > 0 ? estimatedTextWidth : textBox.width;
  const maxWidth = readNumber(state.currentRow || {}, "subtitle.rectangleMaxWidth", Number(config.maxWidth) || 680);
  const targetWidth = Math.min(
    Math.max(measuredTextWidth + paddingX * 2, Number(config.minWidth) || 0),
    maxWidth
  );
  const currentBox = getBoundsBox(rectangleLayer.boundsNoEffects || rectangleLayer.bounds);
  const targetHeight = currentBox
    ? currentBox.height
    : Math.max(textBox.height + paddingY * 2, Number(config.minHeight) || 0);
  const targetBox = makeBox(
    textBox.centerX - targetWidth / 2,
    textBox.centerY - targetHeight / 2,
    targetWidth,
    targetHeight
  );

  try {
    rectangleLayer.visible = false;
    const newRectangle = await duplicateLayerToBox(
      rectangleLayer,
      config.layerName || "txt.subtitle.rectangle",
      targetBox,
      { preserveHeight: true }
    );
    if (newRectangle) {
      try {
        await newRectangle.move(textLayer, photoshop.constants.ElementPlacement.PLACEAFTER);
      } catch (error) {
        log(`  Subtitle rectangle z-order skipped: ${formatError(error)}`);
      }
    }
    log(`  Subtitle rectangle duplicated: textW=${Math.round(measuredTextWidth)}, w=${Math.round(targetWidth)}, h=${Math.round(targetHeight)}.`);
  } catch (error) {
    log(`  Subtitle rectangle duplicate skipped: ${formatError(error)}`);
  }
}

async function applyTitleAndProductNote(doc, row) {
  const handled = {};
  const titleLayer = findLayerByName(doc, "txt.title");
  const titleText = row["txt.title"];
  const titleOriginalBox = await getLayerBox(titleLayer);
  let titleLineCount = 1;
  let titleLongSecondLine = false;

  if (titleLayer && titleText !== undefined && titleText !== null) {
    const parsedTitle = parseTitleSuperscriptMarkup(titleText);
    const maxWidth = getTitleMaxWidth(row, titleLayer);
    const wrapped = await wrapTitleToMeasuredWidth(titleLayer, parsedTitle.text, maxWidth);
    const secondLineInfo = getLongSecondTitleLineInfo(wrapped);
    const superscripts = shiftSuperscriptRanges(parsedTitle.superscripts, parsedTitle.text, wrapped);
    const titleLeadingRatio = getTitleLineHeightRatio(row, secondLineInfo.triggered);
    await applyTitleMixedFontRule(titleLayer, wrapped, row, superscripts, secondLineInfo.ranges, { leadingRatio: titleLeadingRatio });
    titleLineCount = String(wrapped).split(/\r\n|\r|\n/).length;
    titleLongSecondLine = secondLineInfo.triggered;
    const titleAfterBox = await getLayerBox(titleLayer);
    if (titleOriginalBox && titleAfterBox) {
      await titleLayer.translate(titleOriginalBox.left - titleAfterBox.left, titleOriginalBox.top - titleAfterBox.top);
      log("  Restored txt.title top-left anchor.");
    }
    handled["txt.title"] = true;
    log(`  Title applied: maxWidth=${Math.round(maxWidth)}, lines=${titleLineCount}`);
    if (titleLongSecondLine) {
      log(`  Title second line scaled: chars=${secondLineInfo.secondLineChars}, scale=0.5.`);
    }
  }

  const noteText = firstTextValue(row, ["txt.productNote", "txt.note", "txt.description", "txt.subtitle"]);
  const productNoteLayer1 = findLayerByName(doc, "txt.productNote.1");
  const productNoteLayer2 = findLayerByName(doc, "txt.productNote.2");
  const productNoteLayer3 = findLayerByName(doc, "txt.productNote.3");
  const productNoteLayer = titleLongSecondLine && productNoteLayer3
    ? productNoteLayer3
    : titleLineCount > 1 && productNoteLayer2
      ? productNoteLayer2
      : productNoteLayer1 || findLayerByName(doc, "txt.productNote");
  const subtitleLayer = findLayerByName(doc, "txt.subtitle");
  const forceSubtitleLayer = getCurrentTemplateConfig().productNameToSubtitle && hasValue(row, "txt.subtitle");
  const fallbackNoteLayer = forceSubtitleLayer
    ? subtitleLayer || productNoteLayer
    : productNoteLayer || subtitleLayer;

  if (fallbackNoteLayer && noteText !== undefined) {
    [productNoteLayer1, productNoteLayer2, productNoteLayer3].forEach((layer) => {
      if (layer && layer !== fallbackNoteLayer) layer.visible = false;
    });
    fallbackNoteLayer.visible = true;
    const noteOriginalBox = getBoundsBox(fallbackNoteLayer.boundsNoEffects || fallbackNoteLayer.bounds);
    const subtitleConfig = getCurrentTemplateConfig().subtitleRectangle;
    const maxSubtitleWidth = fallbackNoteLayer.name === "txt.subtitle" && subtitleConfig
      ? readNumber(row, "subtitle.maxTextWidth", Number(subtitleConfig.maxTextWidth) || null)
      : null;
    const pddSubtitle = fallbackNoteLayer.name === "txt.subtitle" && getCurrentTemplateConfig().productNameToSubtitle;
    let finalNoteText = pddSubtitle ? formatPddSubtitleText(noteText) : noteText;
    if (pddSubtitle) {
      await replaceTextLayerPreserveFirstStyle(fallbackNoteLayer, finalNoteText);
      await applyTextLayerUniformStyle(fallbackNoteLayer, getCurrentTemplateConfig().subtitleTextStyle, "Subtitle");
      log(`  Subtitle plus-wrap rule applied: plusCount=${(String(noteText).match(/\+/g) || []).length}.`);
    } else if (fallbackNoteLayer.name === "txt.subtitle" && Number.isFinite(maxSubtitleWidth) && maxSubtitleWidth > 0) {
      await replaceTextLayerPreserveFirstStyle(fallbackNoteLayer, noteText);
      finalNoteText = await wrapTitleToMeasuredWidth(fallbackNoteLayer, noteText, maxSubtitleWidth, { forceMaxWidth: true });
    } else {
      await replaceTextLayerPreserveFirstStyle(fallbackNoteLayer, noteText);
    }
    const noteAfterBox = getBoundsBox(fallbackNoteLayer.boundsNoEffects || fallbackNoteLayer.bounds);
    if (fallbackNoteLayer.name === "txt.subtitle" && noteOriginalBox && noteAfterBox) {
      await fallbackNoteLayer.translate(noteOriginalBox.centerX - noteAfterBox.centerX, noteOriginalBox.top - noteAfterBox.top);
      log("  Subtitle anchor restored.");
    }
    if (fallbackNoteLayer.name === "txt.subtitle") {
      await resizeSubtitleRectangle(doc, fallbackNoteLayer, finalNoteText);
    }
    handled["txt.productNote"] = true;
    handled["txt.note"] = true;
    handled["txt.description"] = true;
    handled["txt.subtitle"] = true;
    log(`  Product note variant used: ${fallbackNoteLayer.name}, lines=${titleLineCount}`);
  }

  return handled;
}

function isGiftControlColumn(column) {
  return PRODUCT_NAME_COLUMNS.includes(column) ||
    /^(giftLeft|giftRight|product)\.(count|layout|zOrder|x|y|w|h|width|height|itemW|itemWidth|itemH|itemHeight|spacing|gap|bottom|heightRatio|scale|slotFill|category|overlapRatio|edgePaddingRatio|sourceMode|copyMode|ampouleGroups|groupCount|ampouleGap|ampouleRowGap|ampouleGroupHeight|ampouleHeightRatio)(\.\d+)?$/.test(column) ||
    /^product\.gap\.\d+$/.test(column) ||
    /^giftLeft\.(tube100HeightRatio|tube25HeightRatio|minHeightRatio)$/.test(column) ||
    /^product\.([a-zA-Z0-9]+HeightRatio|heightMode|view|imageView|assetView|viewMode|viewNote|imageNote|assetNote|note|touchEdges|touch)$/.test(column) ||
    /^productShadow\.(top|opacity)$/.test(column) ||
    /^person\.(offsetX|offsetY)$/.test(column) ||
    /^(title|txt)\.(wrapAt|titleWrapAt|titleMaxWidth|maxWidth|productNoteGap|productNoteOffsetY|titleLineHeight|lineHeight|titleLineHeightRatio|lineHeightRatio|titleTracking|tracking|bottomTextScale)$/.test(column) ||
    /^bottomText\.maxWidth$/.test(column) ||
    /^subtitle\.(rectanglePadding[XY]|rectangleMaxWidth|rectangleRadius|maxTextWidth|fontSize)$/.test(column) ||
    /^productNote\.(gap|offsetY)$/.test(column) ||
    /^(note|remark|remarks|备注|产品视角)$/.test(column);
}

async function exportJpg(doc, row, index) {
  const quality = Number($("jpgQuality").value || 10);
  const outputName = getExportName(row, index, "jpg");
  log(`  Saving JPG as: ${outputName}`);
  const jpgFile = await outputFolder.createFile(outputName, { overwrite: true });

  if (doc.saveAs && doc.saveAs.jpg) {
    await doc.saveAs.jpg(jpgFile, { quality }, true);
    return outputName;
  }

  const token = fs.createSessionToken(jpgFile);
  await photoshop.action.batchPlay(
    [
      {
        _obj: "save",
        as: {
          _obj: "JPEG",
          extendedQuality: quality,
          matteColor: { _enum: "matteColor", _value: "none" }
        },
        in: {
          _kind: "local",
          _path: token
        },
        copy: true,
        lowerCase: true,
        _options: {
          dialogOptions: "dontDisplay"
        }
      }
    ],
    { synchronousExecution: false, modalBehavior: "execute" }
  );

  return outputName;
}

async function exportPsd(doc, row, index) {
  const outputName = getExportName(row, index, "psd");
  log(`  Saving PSD as: ${outputName}`);
  const psdFile = await outputFolder.createFile(outputName, { overwrite: true });

  if (doc.saveAs && doc.saveAs.psd) {
    await doc.saveAs.psd(psdFile, { maximizeCompatibility: true }, true);
    return outputName;
  }

  const token = fs.createSessionToken(psdFile);
  await photoshop.action.batchPlay(
    [
      {
        _obj: "save",
        as: {
          _obj: "photoshop35Format",
          maximizeCompatibility: true
        },
        in: {
          _kind: "local",
          _path: token
        },
        copy: true,
        lowerCase: true,
        _options: {
          dialogOptions: "dontDisplay"
        }
      }
    ],
    { synchronousExecution: false, modalBehavior: "execute" }
  );

  return outputName;
}

async function exportDocument(doc, row, index) {
  const formats = getExportFormats(row);
  log(`  Exporting ${formats.map((format) => format.toUpperCase()).join(" + ")}...`);
  const outputNames = [];
  for (const format of formats) {
    if (format === "psd") {
      outputNames.push(await exportPsd(doc, row, index));
    } else {
      outputNames.push(await exportJpg(doc, row, index));
    }
  }
  return outputNames.join(", ");
}

async function closeDocWithoutSaving(doc) {
  if (doc.closeWithoutSaving) {
    await doc.closeWithoutSaving();
    return;
  }
  ensureModules();
  await doc.close(photoshop.constants.SaveOptions.DONOTSAVECHANGES);
}

async function applyRowToDocument(doc, row) {
  const expandedRow = expandRow(row);
  state.currentRow = expandedRow;

  const productCount = getGiftCount(expandedRow, "product");
  const productImages = Array.from({ length: Math.max(productCount, 1) }, (_, index) => {
    return expandedRow[`img.product.${index + 1}`] || expandedRow["img.product"] || "";
  }).filter(Boolean);
  log(`  Product expanded: count=${productCount || 1}, layout=${resolveImageGroupLayout(expandedRow, "product", productCount || 1)}, images=${productImages.join(" | ")}`);

  const handledTextColumns = await applyTitleAndProductNote(doc, expandedRow);

  await prepareImageGroupLayers(doc, expandedRow, "product");
  await prepareImageGroupLayers(doc, expandedRow, "giftLeft");
  await prepareImageGroupLayers(doc, expandedRow, "giftRight");
  applyGiftRightTemplateSwitch(doc, expandedRow);
  applyPersonTemplateSwitch(doc, expandedRow);

  for (const [column, value] of Object.entries(expandedRow)) {
    if (
      !value ||
      isIdentifierColumn(column) ||
      column.startsWith("imag.") ||
      column.startsWith("image.") ||
      column === "img.person" ||
      column === "img.giftRight" ||
      /^img\.giftRight\.\d+$/.test(column) ||
      /^img\.giftLeft\.\d+$/.test(column) ||
      handledTextColumns[column] ||
      state.placedImageLayers[column] ||
      column.endsWith("Set") ||
      column.endsWith(".count") ||
      column.endsWith(".layout") ||
      isGiftControlColumn(column) ||
      (column === "img.product" && getGiftCount(expandedRow, "product") > 1) ||
      column === "img.giftLeft"
    ) {
      continue;
    }

    const layer = findLayerByName(doc, column);
    if (!layer) {
      if (column === "txt.productNote" || column === "txt.note" || column === "txt.description" || column === "txt.subtitle") {
        continue;
      }
      log(`  Skip: layer not found: ${column}`);
      continue;
    }

    if (column.startsWith("txt.")) {
      if (column === "txt.bottomText") {
        await applyBottomTextRules(layer, value);
      } else {
        await replaceTextLayer(layer, value);
      }
      continue;
    }

    if (column.startsWith("img.")) {
      const asset = await getAssetEntry(value, {
        disableTrimmed: column === "img.giftRight",
        normalizeGiftRight: column === "img.giftRight"
      });
      await replaceSmartObjectLayer(layer, asset);
      continue;
    }

    log(`  Skip: column needs txt. or img. prefix: ${column}`);
  }

  log("  Before product arrange.");
  await arrangeProductLineAfterReplace(doc, expandedRow);
  log("  After product arrange.");
  await applyProductShadow(doc);
  if (getCurrentTemplateConfig().keepPersonOnTop) {
    await keepPersonOnTop(doc);
  }
}

async function processOne(row, index) {
  ensureModules();
  state.giftTargets = {};
  state.groupAreaBoxes = {};
  state.placedImageLayers = {};
  state.templateLayerBoxes = {};
  state.currentRow = null;

  const doc = await photoshop.app.open(templateFile);
  try {
    log("  Applying row data...");
    await applyRowToDocument(doc, row);
    return await exportDocument(doc, row, index);
  } finally {
    await closeDocWithoutSaving(doc);
  }
}

async function runBatch() {
  if (state.busy) return;
  if (!templateFile || !csvFile || !assetsFolder || !outputFolder) {
    setSummary("Please select PSD, CSV, assets folder, and output folder.");
    return;
  }

  state.busy = true;
    state.giftTargets = {};
    state.groupAreaBoxes = {};
    state.placedImageLayers = {};
    state.templateLayerBoxes = {};
    state.currentRow = null;
  $("runBatch").disabled = true;
  $("log").textContent = "";

  try {
    state.rows = await readCsvRows(csvFile);
    setProgress(0, state.rows.length);
    log(`Script version: ${SCRIPT_VERSION}`);
    log(`Loaded ${state.rows.length} rows.`);
    state.productNameMap = await loadProductNameMap();

    ensureModules();
    let successCount = 0;
    let failureCount = 0;
    const rowResults = [];
    await photoshop.core.executeAsModal(
      async () => {
        for (let i = 0; i < state.rows.length; i += 1) {
          const row = state.rows[i];
          const rowName = getConfiguredExportName(row, i) || `row_${i + 1}`;
          setSummary(`Generating ${i + 1}/${state.rows.length}`);
          log(`[${i + 1}] ${rowName}`);
          try {
            const outputName = await processOne(row, i);
            successCount += 1;
            rowResults.push({
              index: i + 1,
              name: rowName,
              ok: true,
              outputName
            });
            log(`  Exported: ${outputName}`);
          } catch (error) {
            failureCount += 1;
            rowResults.push({
              index: i + 1,
              name: rowName,
              ok: false,
              error: formatError(error)
            });
            console.error(error);
            log(`  Row failed: ${formatError(error)}`);
          }
          setProgress(i + 1, state.rows.length);
        }
        log(`Finished rows. Success: ${successCount}/${state.rows.length}`);
      },
      { commandName: "Batch generate main images" }
    );

    log("Result summary:");
    rowResults.forEach((result) => {
      if (result.ok) {
        log(`  [${result.index}] OK ${result.name} -> ${result.outputName}`);
      } else {
        log(`  [${result.index}] FAILED ${result.name}: ${result.error}`);
      }
    });

    const failed = rowResults.find((result) => !result.ok);
    if (failed) {
      setSummary(`Done: ${successCount} exported, ${failureCount} failed. Last error: ${failed.error}`);
    } else {
      setSummary(`Done: ${successCount} exported, ${failureCount} failed.`);
    }
  } catch (error) {
    console.error(error);
    setSummary("Failed. See log.");
    log(`Error: ${formatError(error)}`);
  } finally {
    state.busy = false;
    $("runBatch").disabled = false;
  }
}

async function pickTemplate() {
  ensureModules();
  templateFile = await fs.getFileForOpening({ types: ["psd", "psb"] });
  setLabel("templateName", templateFile);
}

async function pickCsv() {
  ensureModules();
  csvFile = await fs.getFileForOpening({ types: ["csv"] });
  setLabel("csvName", csvFile);
}

async function pickAssets() {
  ensureModules();
  assetsFolder = await fs.getFolder();
  setLabel("assetsName", assetsFolder);
}

async function pickOutput() {
  ensureModules();
  outputFolder = await fs.getFolder();
  setLabel("outputName", outputFolder);
}

function pathToFileUrl(path) {
  return encodeURI(`file:///${String(path).replace(/\\/g, "/")}`);
}

async function getDefaultEntry(path) {
  ensureModules();
  if (!fs.getEntryWithUrl) {
    throw new Error("UXP getEntryWithUrl is not available");
  }
  return fs.getEntryWithUrl(pathToFileUrl(path));
}

async function loadDefaultPaths() {
  try {
    const templatePath = getConfiguredPath("template");
    const csvPath = getConfiguredPath("csv");
    const assetsPath = getConfiguredPath("assets");
    const outputPath = getConfiguredPath("output");

    if (!templatePath || !csvPath || !assetsPath || !outputPath) {
      throw new Error("Current template profile does not define all default paths.");
    }

    templateFile = await getDefaultEntry(templatePath);
    setLabel("templateName", templateFile);

    csvFile = await getDefaultEntry(csvPath);
    setLabel("csvName", csvFile);

    assetsFolder = await getDefaultEntry(assetsPath);
    setLabel("assetsName", assetsFolder);

    outputFolder = await getDefaultEntry(outputPath);
    setLabel("outputName", outputFolder);

    log(`Default paths loaded: ${getCurrentTemplateConfig().label}.`);
  } catch (error) {
    log(`Default paths not loaded: ${formatError(error)}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  syncTemplateProfileUi();

  const templateProfile = $("templateProfile");
  if (templateProfile) {
    templateProfile.addEventListener("change", () => {
      activeTemplateId = templateProfile.value;
      syncTemplateProfileUi();
      loadDefaultPaths();
    });
  }

  $("toggleSetup").addEventListener("click", () => {
    const setupBox = $("setupBox");
    const collapsed = !setupBox.classList.contains("isCollapsed");
    setupBox.classList.toggle("isCollapsed", collapsed);
    $("toggleSetup").textContent = collapsed ? "展开设置" : "收起设置";
  });
  $("pickTemplate").addEventListener("click", pickTemplate);
  $("pickCsv").addEventListener("click", pickCsv);
  $("pickAssets").addEventListener("click", pickAssets);
  $("pickOutput").addEventListener("click", pickOutput);
  $("runBatch").addEventListener("click", runBatch);
  $("scrollLogBottom").addEventListener("click", scrollLogToBottom);
  loadDefaultPaths();
});
