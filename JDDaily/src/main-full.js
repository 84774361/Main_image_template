let templateFile = null;
let csvFile = null;
let assetsFolder = null;
let outputFolder = null;
let photoshop = null;
let uxpStorage = null;
let fs = null;
const SCRIPT_VERSION = "20260825-gift-left-quantity-expand";

const TITLE_FONT_RULE = {
  latin: {
    postScriptName: "LINESeedSansApp-Regular",
    fontName: "LINE Seed Sans App Regular",
    fontStyleName: "Regular"
  },
  chinese: {
    postScriptName: "FZLanTingHei_GBK",
    fontName: "\u65b9\u6b63\u5170\u4ead\u9ed1_GBK",
    fontStyleName: "Regular"
  }
};

const TITLE_SUPERSCRIPT_FONT = {
  postScriptName: "LINESeedSansApp-Regular",
  fontName: "LINE Seed Sans App Regular",
  fontStyleName: "Regular"
};

const SUBTITLE_FONT_RULE = {
  preserveFontSize: true,
  chinese: {
    postScriptName: "FZLanTingHei_GBK",
    fontName: "方正兰亭黑_GBK"
  },
  latin: {
    postScriptName: "LINESeedSansApp-Regular",
    fontName: "LINE Seed Sans App Regular"
  }
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
  productShadow: null,
  dailyMechanismSwitch: null,
  layerVisibilitySwitches: [],
  dynamicIconSwitch: {
    enabled: true,
    groupNames: ["ICON", "Icon", "icon"],
    prefixes: ["icon.", "daily.icon.", "pdd.icon."],
    listColumns: ["icon.layers", "icon.names", "icon.list", "daily.icons", "pdd.icons"],
    defaultVisible: false,
    directColumnMatching: true
  },
  blockedAssetFolders: [],
  productOverlapGapRatio: -0.42,
  giftLeftOverlapGapRatio: -0.18
};

const TEMPLATE_CONFIGS = {
  jddaily750: {
    ...BASE_TEMPLATE_CONFIG,
    id: "jddaily750",
    label: "JDDaily 750",
    filePrefixPlaceholder: "jd_daily_750_",
    paths: {
      template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\JDDAILY\\JD_DAILY_750_ALL_MECHANISM.psd",
      csv: "F:\\SOFT\\CODEX\\PROJECT\\Main_image_template\\JDDaily\\sample-data-jddaily750.csv",
      assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
      output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\JDDAILY\\export"
    },
    exportNameColumns: ["exportName", "SKU", "sku", "id", "goodsId"],
    ignoredDataColumns: ["sheet", "daily.mechanism", "daily.giftMiddleType", "daily.giftRightType", "img.giftMiddle", "template.profile", "templateProfile"],
    giftRightTemplateSwitch: null,
    personTemplateSwitch: {
      enabled: true,
      legacyName: "img.person",
      variants: {
        cuiyutao: {
          names: ["img.person.cuiyutao", "img.personCuiyutao"],
          tokens: ["cuiyutao", "cui", "\u5d14\u7389\u6d9b"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "\u7ae0\u5b50\u6021"]
        }
      }
    },
    dailyMechanismSwitch: {
      enabled: true,
      column: "daily.mechanism",
      defaultMechanism: "2",
      groups: {
        "1": ["daily.mechanism.1", "机制-1"],
        "2": ["daily.mechanism.2", "机制-2"],
        "3": ["daily.mechanism.3", "机制-3"],
        "4": ["daily.mechanism.4", "机制-4"]
      },
      middleGiftLayers: {
        "178": ["img.giftMiddle.178"],
        "298": ["img.giftMiddle.298"],
        "378": ["img.giftMiddle.378"]
      },
      left298Layers: ["img.giftLeft.298"]
    },
    dynamicIconSwitch: {
      enabled: true,
      groupNames: ["ICON", "Icon", "icon"],
      prefixes: ["icon.", "daily.icon.", "pdd.icon."],
      listColumns: ["icon.layers", "icon.names", "icon.list", "daily.icons", "pdd.icons"],
      defaultVisible: false,
      directColumnMatching: true
    },
    productAssetPriority: {
      enabled: true,
      folder: "babyproduct_icefrosteffect"
    },
    giftLeftAssetSource: {
      enabled: true,
      sourceColumn: "txt.giftLeftDesc",
      forceFront: true
    },
    preserveTemplateTextStyle: true,
    bottomTextSubscriptSuffixes: ["/\u74f6"],
    bottomTextCenterX: 500,
    bottomTextAreaName: "bottomText.area",
    preserveBottomTextTemplatePosition: true,
    finalProductBottomAlign: true,
    bottomTextOverflowScale: 0.8,
    bottomTextShortMaxUnits: 7.0,
    bottomTextShortFitRatio: 0.88,
    bottomTextStyle: {
      chinese: {
        postScriptName: "FZLanTingHei_GBK",
        fontName: "方正兰亭黑_GBK",
        fontSize: 47
      },
      latin: {
        postScriptName: "LINESeedSansApp-Regular",
        fontName: "LINE Seed Sans App Regular",
        fontSize: 57
      }
    },
    productDefaultHeightBoost: 1.08,
    productStackScale: 1.35,
    productOverlapGapRatio: -0.5,
    giftLeftOverlapGapRatio: -0.18
  },
  jddaily: {
    ...BASE_TEMPLATE_CONFIG,
    id: "jddaily",
    label: "JDDaily POP",
    filePrefixPlaceholder: "jd_daily_",
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
          tokens: ["cuiyutao", "cui", "\u5d14\u7389\u6d9b"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "\u7ae0\u5b50\u6021"]
        }
      }
    }
  },
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
          tokens: ["cuiyutao", "cui", "\u5d14\u7389\u6d9b"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "\u7ae0\u5b50\u6021"]
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

TEMPLATE_CONFIGS.tianmao88 = {
  ...TEMPLATE_CONFIGS.jddaily750,
  id: "tianmao88",
  label: "Tmall 88",
  filePrefixPlaceholder: "tmall_88_",
  paths: {
    ...TEMPLATE_CONFIGS.jddaily750.paths,
    template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\TIANMAO\\天猫88主图.psd",
    output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\TIANMAO\\export"
  },
  dailyMechanismSwitch: {
    ...TEMPLATE_CONFIGS.jddaily750.dailyMechanismSwitch,
    left298ByMechanism: false,
    middleGiftLayers: {
      "208": ["img.giftMiddle.208"],
      "358": ["img.giftMiddle.358"],
      "449": ["img.giftMiddle.449"]
    }
  },
  layerVisibilitySwitches: [
    {
      columns: ["daily.icon.baby0", "pdd.icon.baby0", "icon.baby0"],
      names: ["baby0icon"],
      label: "baby0icon",
      defaultVisible: false
    },
    {
      columns: ["daily.icon.612", "pdd.icon.612", "icon.612"],
      names: ["6-12icon"],
      label: "6-12icon",
      defaultVisible: false
    },
    {
      columns: ["daily.icon.cosmetic", "pdd.icon.cosmetic", "icon.cosmetic"],
      names: ["cosmeticicon", "cosmeticicon "],
      label: "cosmeticicon",
      defaultVisible: false
    },
    {
      columns: ["daily.icon.youth12", "pdd.icon.youth12", "icon.youth12"],
      names: ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
      label: "12+icon",
      defaultVisible: false
    }
  ],
  productAssetPriority: {
    enabled: true,
    useFolderFallback: false,
    views: ["angle", "front"]
  }
};

TEMPLATE_CONFIGS.pddPopMain = {
  ...TEMPLATE_CONFIGS.tianmao88,
  id: "pddPopMain",
  label: "PDD POP",
  filePrefixPlaceholder: "pdd_pop_",
  paths: {
    ...TEMPLATE_CONFIGS.tianmao88.paths,
    template: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\PDD\\POP\\COMMON_MECHANISM\\BABY_COMMON_Main_Template.psd",
    csv: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\PDD\\POP\\COMMON_MECHANISM\\pdd0720.csv",
    assets: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\assets",
    output: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\PDD\\POP\\COMMON_MECHANISM\\export"
  },
  exportNameColumns: ["exportName", "PDD_POP", "pddPop", "pdd_pop", "PDD_MAIN", "pddMain", "sku", "id", "goodsId"],
  giftLeftDescPlusWrap: {
    enabled: true,
    minDisplayLength: 10
  },
  blockedAssetFolders: ["babyproduct_icefrosteffect"],
  productDefaultHeightBoost: 1.08,
  dailyMechanismSwitch: {
    ...TEMPLATE_CONFIGS.tianmao88.dailyMechanismSwitch,
    middleGiftLayers: {
      "178": ["img.giftMiddle.178"],
      "298": ["img.giftMiddle.298"],
      "378": ["img.giftMiddle.378"]
    },
    rightGiftLayers: {
      "178": ["img.giftRight178", "img.giftRight.178"],
      "298": ["img.giftRight.298"],
      "378": ["img.giftRight.378"]
    },
    left298Layers: []
  },
  layerVisibilitySwitches: [
    {
      columns: ["daily.icon.baby0", "pdd.icon.baby0", "icon.baby0"],
      names: ["baby0icon"],
      label: "baby0icon",
      defaultVisible: false
    },
    {
      columns: ["daily.icon.612", "pdd.icon.612", "icon.612"],
      names: ["6-12icon"],
      label: "6-12icon",
      defaultVisible: false
    },
    {
      columns: ["daily.icon.cosmetic", "pdd.icon.cosmetic", "icon.cosmetic"],
      names: ["cosmeticicon", "cosmeticicon "],
      label: "cosmeticicon",
      defaultVisible: false
    },
    {
      columns: ["daily.icon.youth12", "daily.icon.1218", "pdd.icon.youth12", "pdd.icon.1218", "icon.youth12", "icon.1218"],
      names: ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
      label: "12+icon",
      defaultVisible: false
    }
  ]
};
let activeTemplateId = "pddPopMain";
let activeRowTemplateId = "";

const state = {
  rows: [],
  busy: false,
  giftTargets: {},
  groupAreaBoxes: {},
  groupAreaNames: {},
  placedImageLayers: {},
  templateLayerBoxes: {},
  exportedPsdEntries: [],
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
  return TEMPLATE_CONFIGS[id] || TEMPLATE_CONFIGS.jddaily || TEMPLATE_CONFIGS.pddSku || TEMPLATE_CONFIGS.jd618;
}

function getCurrentTemplateConfig() {
  if (activeRowTemplateId && TEMPLATE_CONFIGS[activeRowTemplateId]) {
    return getTemplateConfig(activeRowTemplateId);
  }

  const selector = $("templateProfile");
  if (selector && selector.value && TEMPLATE_CONFIGS[selector.value]) {
    activeTemplateId = selector.value;
  }
  return getTemplateConfig();
}

function getRowTemplateProfileId(row) {
  const id = String(row && (row["template.profile"] || row.templateProfile) || "").trim();
  return id && TEMPLATE_CONFIGS[id] ? id : "";
}

function setActiveRowTemplateProfile(row) {
  activeRowTemplateId = getRowTemplateProfileId(row);
  if (activeRowTemplateId) {
    log(`  Row template profile: ${activeRowTemplateId}.`);
  }
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

function getMechanismSwitchConfig(config = getCurrentTemplateConfig()) {
  return config && (config.mechanismSwitch || config.dailyMechanismSwitch) || null;
}

function getMechanismColumnCandidates(switchConfig) {
  const columns = [
    switchConfig && switchConfig.column,
    ...((switchConfig && switchConfig.legacyColumns) || []),
    "mechanism",
    "daily.mechanism"
  ].filter(Boolean);
  return [...new Set(columns)];
}

function getMechanismGroupNames(switchConfig, type) {
  if (!type) return [];
  const groups = switchConfig && switchConfig.groups || {};
  return groups[type] || [`mechanism.${type}`, `daily.mechanism.${type}`];
}

function getMechanismControlColumns(config = getCurrentTemplateConfig()) {
  const switchConfig = getMechanismSwitchConfig(config) || {};
  return getMechanismColumnCandidates(switchConfig);
}

const DEFAULT_DYNAMIC_ICON_ALIASES = {
  baby0: ["baby0", "baby0icon"],
  baby0icon: ["baby0", "baby0icon"],
  "6-12": ["612", "6-12icon"],
  "6-12icon": ["612", "6-12icon"],
  "612": ["612", "6-12icon"],
  "612icon": ["612", "6-12icon"],
  cosmetic: ["cosmetic", "cosmeticicon", "cosmeticicon "],
  cosmeticicon: ["cosmetic", "cosmeticicon", "cosmeticicon "],
  youth12: ["12+", "12+icon", "12plusicon", "youth12icon", "teen12icon"],
  youth12icon: ["12+", "12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "12+": ["12+", "12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "12+icon": ["12+", "12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "1218": ["12+", "12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "1218icon": ["12+", "12+icon", "12plusicon", "youth12icon", "teen12icon"]
};

function sanitizeFileBaseName(value, fallback = "image") {
  const cleaned = String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "x")
    .replace(/[\u0000-\u001F]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "");
  return cleaned || fallback;
}

function isIdentifierColumn(column) {
  const config = getCurrentTemplateConfig();
  const columns = new Set([
    ...BASE_TEMPLATE_CONFIG.exportNameColumns,
    ...(config.exportNameColumns || []),
    ...(config.ignoredDataColumns || []),
    ...getMechanismControlColumns(config)
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

function shouldMergeExportedPsds() {
  const el = $("mergeExportedPsds");
  return !!(el && el.checked);
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
    "\u4ea7\u54c1\u540d\u79f0.csv",
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
    if (/body-lotion/i.test(String(value)) && normalized.includes("\u5b89\u5fc3\u971c")) return;
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
    const fileName = String(row.file || row.filename || row["\u6587\u4ef6"] || "").trim();
    if (!fileName) return;
    const imagePath = fileName.includes("/") || fileName.includes("\\") ? fileName : `products/${fileName}`;
    const fullName = row.standard_cn || row["\u6807\u51c6\u4e2d\u6587\u540d"] || row["\u4e2d\u6587\u6807\u51c6\u540d"] || "";
    const age = row.age_cn || row["\u5e74\u9f84\u6bb5"] || "";
    const product = row.product_cn || row["\u4ea7\u54c1\u540d"] || "";
    const category = row.category_cn || row["\u54c1\u7c7b"] || "";
    const spec = row.spec || row["\u89c4\u683c"] || "";
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
    .replace(/[×✕＊*]/g, "x")
    .replace(/(\d+(?:\.\d+)?(?:kg|ml|g|l))x(\d+)$/gi, "$1$2x")
    .replace(/((?:kg|ml|g|l))x(?=\d)/gi, "$1")
    .replace(/[\\/_\-\s]+/g, "")
    .toLowerCase();
}

function getAgeCnAliases(age) {
  const normalized = normalizeProductNameKey(age);
  if (normalized === "\u5a74\u7ae5" || normalized === "\u4e00\u9875") return ["\u5a74\u7ae5", "\u4e00\u9875"];
  if (normalized === "\u5b66\u9f84") return ["\u5b66\u9f84"];
  return age ? [String(age)] : [];
}

function getAgeCnCanonicalFromText(value) {
  const normalized = normalizeProductNameKey(value);
  if (normalized.includes("\u5b66\u9f84") || normalized.includes("\u513f\u7ae5")) return "\u5b66\u9f84";
  if (normalized.includes("\u5a74\u7ae5")) return "\u5a74\u7ae5";
  return "";
}

function isUnprefixedKidsCleansingKey(key) {
  const text = normalizeProductNameKey(key);
  if (!/(?:\u6d01\u9762\u6ce1|\u6d01\u9762\u4e73|\u6d01\u9762)/.test(text)) return false;
  return !/(?:612|1218|\u5b66\u9f84|\u9752\u6625|\u513f\u7ae5)/.test(text);
}

function chooseKidsCleansingProduct(items) {
  const matched = Array.from(items || []).filter((item) => {
    return /kids[-/]cleansing[-/]foam|kids-cleansing-foam/i.test(String(item || "").replace(/\\/g, "/"));
  });
  return matched.length === 1 ? matched[0] : "";
}
function isUnprefixedBathOilBottleKey(key) {
  const text = normalizeProductNameKey(key);
  if (!/\u6c90\u6d74\u6cb9/.test(text)) return false;
  return !/(?:refill|\u8865\u5145\u88c5|\u888b\u88c5|\u888b)/.test(text);
}

function chooseBottleProduct(items) {
  const matched = Array.from(items || []).filter((item) => {
    return /[-/]bottle[-/]/i.test(String(item || "").replace(/\\/g, "/"));
  });
  return matched.length === 1 ? matched[0] : "";
}
function isSoothingCreamSampleKey(key) {
  const text = normalizeProductNameKey(key);
  return /(?:\u5b89\u5fc3\u971c|soothingcream)/.test(text) && /(?:sample|\u975e\u5356\u54c1|\u8bd5\u7528)/.test(text);
}

function isSoothingCreamNonSampleKey(key) {
  const text = normalizeProductNameKey(key);
  return /(?:\u5b89\u5fc3\u971c|soothingcream)/.test(text) && !/(?:sample|\u975e\u5356\u54c1|\u8bd5\u7528)/.test(text);
}

function getSoothingCreamPreferredItems(items) {
  const soothing = Array.from(items || []).filter((item) => /soothing[-_\s]*cream/i.test(String(item || "")));
  return soothing.length ? soothing : Array.from(items || []);
}

function chooseSampleProduct(items) {
  const scoped = getSoothingCreamPreferredItems(items);
  const matched = scoped.filter((item) => /sample/i.test(String(item || "")));
  return matched.length === 1 ? matched[0] : "";
}

function chooseNonSampleProduct(items) {
  const scoped = getSoothingCreamPreferredItems(items);
  const matched = scoped.filter((item) => !/sample/i.test(String(item || "")));
  return matched.length === 1 ? matched[0] : "";
}
function getDefaultProductAgeForQuery(value) {
  const normalized = normalizeProductNameKey(value);
  if (isUnprefixedKidsCleansingKey(normalized)) {
    return "\u513f\u7ae5";
  }
  return getAgeCnCanonicalFromText(value) || "\u5a74\u7ae5";
}

function choosePreferredProductImageForKey(key, values) {
  const items = Array.from(values || []);
  const normalizedKey = normalizeProductNameKey(key);
  if (isUnprefixedKidsCleansingKey(normalizedKey)) {
    const cleansing = chooseKidsCleansingProduct(items);
    if (cleansing) return cleansing;
  }
  if (isUnprefixedBathOilBottleKey(normalizedKey)) {
    const bottle = chooseBottleProduct(items);
    if (bottle) return bottle;
  }
  if (isSoothingCreamSampleKey(normalizedKey)) {
    const sample = chooseSampleProduct(items);
    if (sample) return sample;
  }
  if (isSoothingCreamNonSampleKey(normalizedKey)) {
    const nonSample = chooseNonSampleProduct(items);
    if (nonSample) return nonSample;
  }

  const agePreferred = choosePreferredProductByAge(normalizedKey, items);
  if (agePreferred) return agePreferred;

  const specMatch = String(key || "").match(/(\d+(?:\.\d+)?(?:g|ml|kg|l))/i);
  if (specMatch) {
    const spec = specMatch[1].toLowerCase();
    const matched = items.filter((item) => normalizeProductNameKey(item).includes(spec));
    if (matched.length === 1) return matched[0];
    if (matched.length > 1) {
      const categoryPreferred = choosePreferredProductByCategory(normalizedKey, matched);
      if (categoryPreferred) return categoryPreferred;
    }
  }
  return choosePreferredProductByCategory(normalizedKey, items);
}

function choosePreferredProductByAge(normalizedKey, items) {
  const targetAge = getDefaultProductAgeForQuery(normalizedKey);
  const ageRules = {
    "\u5a74\u7ae5": /(?:^|[\\/])(?:products[\\/])?baby[-\\/]/i,
    "\u5b66\u9f84": /(?:^|[\\/])(?:products[\\/])?(?:612|kids)[-\\/]/i,
    "\u9752\u6625": /(?:^|[\\/])(?:products[\\/])?(?:1218|youth)[-\\/]/i
  };
  const rule = ageRules[targetAge];
  if (!rule) return "";

  const matched = items.filter((item) => rule.test(String(item).replace(/\\/g, "/")));
  if (matched.length === 1) return matched[0];
  if (matched.length > 1) {
    const categoryPreferred = choosePreferredProductByCategory(normalizedKey, matched);
    if (categoryPreferred) return categoryPreferred;
  }
  return "";
}

function choosePreferredProductByCategory(normalizedKey, items) {
  const categoryRules = [
    { pattern: /\u74f6\u88c5|bottle/i, token: "bottle" },
    { pattern: /\u7ba1\u88c5|\u8f6f\u7ba1|tube/i, token: "tube" },
    { pattern: /\u7f50\u88c5|jar/i, token: "jar" },
    { pattern: /\u888b\u5305|\u888b\u88c5|\u8865\u5145|\u66ff\u6362|refill|sachet|bag/i, token: "refill|sachet|bag" }
  ];
  for (const rule of categoryRules) {
    if (!rule.pattern.test(normalizedKey)) continue;
    const regex = new RegExp(rule.token, "i");
    const matched = items.filter((item) => regex.test(String(item)));
    if (matched.length === 1) return matched[0];
  }
  return "";
}
function normalizeProductNameKey(value) {
  return String(value || "")
    .trim()
    .replace(/\u00d7/g, "x")
    .replace(/\uff0a/g, "*")
    .replace(/\uff38/g, "x")
    .replace(/\uff58/g, "x")
    .replace(/\s+/g, "")
    .replace(/[\u2010-\u2015\uff0d]/g, "-")
    .toLowerCase();
}

function getProductNameLookupKeys(value) {
  const normalized = normalizeProductNameKey(value);
  return Array.from(new Set([normalized].filter(Boolean)));
}

function getChineseProductAliases({ age, product, standardProduct, productEn }) {
  const aliases = new Set();
  const add = (value) => {
    const text = String(value || "").trim();
    if (text) aliases.add(text);
  };
  getAgeCnAliases(age).forEach(add);
  add(product);
  add(standardProduct);
  const combined = `${product || ""} ${standardProduct || ""} ${productEn || ""}`.toLowerCase();
  if (/repairing\s*cream|\u4fee\u62a4\u971c|\u5b66\u9f84\u971c|\u5b89\u5fc3\u971c/i.test(combined)) {
    add("\u4fee\u62a4\u971c"); add("\u5b89\u5fc3\u971c"); add("\u5b66\u9f84\u971c");
  }
  if (/soothing\s*cream|\u8212\u7f13\u971c/i.test(combined)) {
    add("\u8212\u7f13\u971c"); add("\u5b89\u5fc3\u971c");
  }
  if (/body\s*lotion|\u8eab\u4f53\u4e73|\u4fdd\u6e7f\u4e73/i.test(combined)) {
    add("\u8eab\u4f53\u4e73"); add("\u4fdd\u6e7f\u4e73"); aliases.delete("\u5b89\u5fc3\u971c");
  }
  if (/cleansing\s*foam|\u6d01\u9762\u6ce1/i.test(combined)) {
    add("\u6d01\u9762\u6ce1");
  }
  if (/foaming\s*(wash|body\s*wash|shampoo)|body\s*wash|cleansing\s*foam|\u6ce1\u6ce1\u6d17\u6c90|\u6ce1\u6ce1\u6c90\u6d74/i.test(combined)) {
    add("\u6ce1\u6ce1\u6d17\u6c90"); add("\u6ce1\u6ce1\u6c90\u6d74\u9732"); add("\u6c90\u6d74\u9732");
  }
  if (/essential\s*oil|stickers?|patch|\u7cbe\u6cb9\u8d34|\u8d34\u7247/i.test(combined)) {
    add("\u7cbe\u6cb9\u8d34\u7247"); add("\u7cbe\u6cb9\u8d34"); add("\u8d34\u7247");
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
  if (/\bbaby\b/.test(combined)) age = "\u5a74\u7ae5";
  if (/\b(612|kids|schoolchild)\b/.test(combined)) age = "\u5b66\u9f84";
  if (/\b(1218|youth|teen)\b/.test(combined)) age = "\u9752\u6625";
  let category = "";
  if (/\bbottle\b/.test(categoryEn) || /-bottle-/.test(filename)) category = "\u74f6\u88c5";
  if (/\btube\b/.test(categoryEn) || /-tube-/.test(filename)) category = "\u7ba1\u88c5";
  if (/\bjar\b/.test(categoryEn) || /-jar-/.test(filename)) category = "\u7f50\u88c5";
  const productAliases = new Set();
  const add = (value) => { if (value) productAliases.add(value); };
  if (/repairing[-\s]*cream|ad[-\s]*cream/.test(combined)) { add("\u4fee\u62a4\u971c"); add("\u5b89\u5fc3\u971c"); add("\u5b66\u9f84\u971c"); }
  if (/soothing[-\s]*cream/.test(combined)) { add("\u8212\u7f13\u971c"); add("\u5b89\u5fc3\u971c"); }
  if (/cooling[-\s]*cream/.test(combined)) { add("\u590f\u5b63\u5b89\u5fc3\u971c"); add("\u5b89\u5fc3\u971c"); add("\u51b0\u6c99\u971c"); }
  if (/body[-\s]*lotion/.test(combined)) { add("\u8eab\u4f53\u4e73"); add("\u4fdd\u6e7f\u4e73"); add("\u9ad8\u4fdd\u6e7f\u4e73"); }
  if (/sunscreen[-\s]*lotion|sunscreen/.test(combined)) add("\u9632\u6652\u4e73");
  if (/cleansing[-\s]*foam/.test(combined)) add("\u6d01\u9762\u6ce1");
  if (/foaming[-\s]*(wash|body[-\s]*wash|shampoo)|body[-\s]*wash|cleansing[-\s]*foam/.test(combined)) { add("\u6ce1\u6ce1\u6d17\u6c90"); add("\u6ce1\u6ce1\u6c90\u6d74\u9732"); add("\u6c90\u6d74\u9732"); }
  if (/repellent[-\s]*spray/.test(combined)) add("\u9a71\u868a\u55b7\u96fe");
  if (/floral[-\s]*water|smoothing[-\s]*spray/.test(combined)) add("\u53ee\u53ee\u55b7\u96fe");
  if (/conditioner/.test(combined)) add("\u62a4\u53d1\u7d20");
  if (/spray/.test(combined)) add("\u55b7\u96fe");
  if (/essence|ampoule/.test(combined)) { add("\u7cbe\u534e\u9732"); add("\u6b21\u629b"); }
  if (/essential[-\s]*oil|stickers?|patch/i.test(combined)) { add("\u7cbe\u6cb9\u8d34\u7247"); add("\u7cbe\u6cb9\u8d34"); add("\u8d34\u7247"); }
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
  const layers = getAllLayers(doc.layers);
  const exact = layers.find((layer) => layer.name === name);
  if (exact) return exact;

  const normalized = String(name || "").trim().toLowerCase();
  if (!normalized) return null;
  return layers.find((layer) => String(layer.name || "").trim().toLowerCase() === normalized) || null;
}

function findLayersByName(doc, name) {
  const normalized = String(name || "").trim().toLowerCase();
  return getAllLayers(doc.layers).filter((layer) => {
    return layer.name === name || String(layer.name || "").trim().toLowerCase() === normalized;
  });
}

function findVisiblePreferredLayerByName(doc, name) {
  const layers = findLayersByName(doc, name);
  return layers.find((layer) => layer.visible !== false) || layers[0] || null;
}

function findLayerByAnyName(doc, names) {
  for (const name of names) {
    const layer = findLayerByName(doc, name);
    if (layer) return layer;
  }
  return null;
}

function findLayerByNameInLayer(parentLayer, name) {
  if (!parentLayer || !parentLayer.layers) return null;
  const normalized = String(name || "").trim().toLowerCase();
  for (const layer of parentLayer.layers) {
    const layerName = String(layer.name || "");
    if (layerName === name || layerName.trim().toLowerCase() === normalized) return layer;
    const child = findLayerByNameInLayer(layer, name);
    if (child) return child;
  }
  return null;
}

function findLayersByNameInLayer(parentLayer, name, result = []) {
  if (!parentLayer || !parentLayer.layers) return result;
  const normalized = String(name || "").trim().toLowerCase();
  for (const layer of parentLayer.layers) {
    const layerName = String(layer.name || "");
    if (layerName === name || layerName.trim().toLowerCase() === normalized) result.push(layer);
    findLayersByNameInLayer(layer, name, result);
  }
  return result;
}

function findLayerByAnyNameInLayer(parentLayer, names) {
  for (const name of names || []) {
    const layer = findLayerByNameInLayer(parentLayer, name);
    if (layer) return layer;
  }
  return null;
}

function findGiftLeftImageGroupInLayer(parentLayer) {
  return findLayerByAnyNameInLayer(parentLayer, [
    "giftLeftimage",
    "giftLeftImage",
    "giftLeft.image"
  ]);
}

function findDailyMechanismLayerForGiftLeft(doc, names) {
  const candidates = [];
  for (const name of names || []) {
    candidates.push(...findLayersByName(doc, name));
  }

  return candidates.find((layer) => {
    return layer && layer.visible !== false && findGiftLeftImageGroupInLayer(layer);
  }) || candidates.find((layer) => {
    return layer && findGiftLeftImageGroupInLayer(layer);
  }) || null;
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

function setLayersVisibleByAnyName(doc, names, visible, label) {
  let count = 0;
  for (const name of names || []) {
    const layers = findLayersByName(doc, name);
    layers.forEach((layer) => {
      layer.visible = visible;
      count += 1;
    });
  }
  if (!count && label) {
    log(`  Skip: layer not found: ${label}`);
  }
  return count;
}

function parseVisibilityValue(value, defaultValue) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return Boolean(defaultValue);
  if (["1", "true", "yes", "y", "on", "show", "visible", "\u663e\u793a", "\u5f00", "\u5f00\u542f", "\u662f"].includes(raw)) return true;
  if (["0", "false", "no", "n", "off", "hide", "hidden", "\u9690\u85cf", "\u5173", "\u5173\u95ed", "\u5426"].includes(raw)) return false;
  return Boolean(defaultValue);
}

function getFirstConfiguredValue(row, columns) {
  for (const column of columns || []) {
    if (hasValue(row, column)) return row[column];
  }
  return "";
}

function applyLayerVisibilitySwitches(doc, row) {
  const switches = getCurrentTemplateConfig().layerVisibilitySwitches || [];
  for (const switchConfig of switches) {
    if (!switchConfig) continue;
    const columns = switchConfig.columns || (switchConfig.column ? [switchConfig.column] : []);
    if (!columns.length) continue;
    const value = getFirstConfiguredValue(row, columns);
    const visible = parseVisibilityValue(value, switchConfig.defaultVisible);
    setLayersVisibleByAnyName(doc, switchConfig.names || [], visible, switchConfig.label || columns[0]);
    log(`  Layer switch: ${columns[0]}=${visible ? "on" : "off"}.`);
  }
}

function normalizeSwitchToken(value) {
  return String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function getDynamicIconSwitchConfig(config = getCurrentTemplateConfig()) {
  const switchConfig = config && config.dynamicIconSwitch;
  if (!switchConfig || !switchConfig.enabled) return null;
  return {
    groupNames: ["ICON"],
    prefixes: ["icon.", "daily.icon.", "pdd.icon."],
    listColumns: ["icon.layers", "icon.names", "icon.list", "daily.icons", "pdd.icons"],
    defaultVisible: false,
    directColumnMatching: true,
    aliases: {},
    ...switchConfig
  };
}

function isDynamicIconListColumn(column, switchConfig) {
  return (switchConfig.listColumns || []).includes(column);
}

function isIgnoredDynamicIconToken(token, switchConfig) {
  const normalized = normalizeSwitchToken(token);
  return (switchConfig.ignoredTokens || [])
    .map((item) => normalizeSwitchToken(item))
    .filter(Boolean)
    .includes(normalized);
}

function getDynamicIconColumnToken(column, switchConfig) {
  if (!column || isDynamicIconListColumn(column, switchConfig)) return "";
  for (const prefix of switchConfig.prefixes || []) {
    if (column.startsWith(prefix)) {
      const token = column.slice(prefix.length).trim();
      return isIgnoredDynamicIconToken(token, switchConfig) ? "" : token;
    }
  }
  return "";
}

function addUnique(items, value) {
  const text = String(value || "");
  if (text && !items.includes(text)) items.push(text);
}

function addDynamicIconAliasKeys(map, key, names) {
  const rawKey = String(key || "").trim().toLowerCase();
  const normalizedKey = normalizeSwitchToken(key);
  if (rawKey) map[rawKey] = names;
  if (normalizedKey) map[normalizedKey] = names;
}

function getDynamicIconAliasMap(switchConfig) {
  const map = {};
  const aliases = { ...DEFAULT_DYNAMIC_ICON_ALIASES, ...(switchConfig.aliases || {}) };
  for (const [key, value] of Object.entries(aliases)) {
    addDynamicIconAliasKeys(map, key, Array.isArray(value) ? value : [value]);
  }
  return map;
}

function getDynamicIconLayerNames(token, switchConfig) {
  const raw = String(token || "").trim();
  if (!raw) return [];

  const names = [];
  const aliases = getDynamicIconAliasMap(switchConfig);
  const rawKey = raw.toLowerCase();
  const normalizedKey = normalizeSwitchToken(raw);
  for (const name of aliases[rawKey] || aliases[normalizedKey] || []) addUnique(names, name);
  addUnique(names, raw);
  if (!/icon$/i.test(raw)) addUnique(names, `${raw}icon`);
  return names;
}

function setLayerVisibleRecursive(layer, visible) {
  if (!layer) return;
  layer.visible = visible;
  if (visible) {
    let parent = layer.parent;
    while (parent && parent.layers) {
      try {
        parent.visible = true;
      } catch (error) {
        break;
      }
      parent = parent.parent;
    }
  }
}

function setLayersVisibleByAnyNameInLayer(parentLayer, names, visible, label) {
  const seen = new Set();
  let count = 0;
  for (const name of names || []) {
    const layers = findLayersByNameInLayer(parentLayer, name, []);
    for (const layer of layers) {
      if (!layer || seen.has(layer)) continue;
      seen.add(layer);
      setLayerVisibleRecursive(layer, visible);
      count += 1;
    }
  }
  if (!count && label) {
    log(`  Skip: scoped layer not found: ${label}`);
  }
  return count;
}

function getDynamicIconGroupLayers(doc, switchConfig) {
  const seen = new Set();
  const groups = [];
  for (const groupName of switchConfig.groupNames || []) {
    for (const layer of findLayersByName(doc, groupName)) {
      if (!layer || !layer.layers || seen.has(layer)) continue;
      seen.add(layer);
      groups.push(layer);
    }
  }
  return groups;
}

function getDynamicIconLayerNameKeys(doc, switchConfig) {
  const keys = new Set();
  for (const group of getDynamicIconGroupLayers(doc, switchConfig)) {
    for (const layer of getAllLayers(group.layers)) {
      const raw = String(layer && layer.name || "").trim();
      if (!raw) continue;
      keys.add(raw.toLowerCase());
      keys.add(normalizeSwitchToken(raw));
    }
  }
  return keys;
}

function getDirectDynamicIconColumnToken(column, iconNameKeys, switchConfig) {
  if (!switchConfig.directColumnMatching || !column || isDynamicIconListColumn(column, switchConfig)) return "";
  if (getDynamicIconColumnToken(column, switchConfig)) return "";
  const raw = String(column || "").trim();
  if (!raw || isIgnoredDynamicIconToken(raw, switchConfig)) return "";
  return iconNameKeys.has(raw.toLowerCase()) || iconNameKeys.has(normalizeSwitchToken(raw)) ? raw : "";
}

function hasDynamicIconControls(doc, row, switchConfig) {
  const iconNameKeys = getDynamicIconLayerNameKeys(doc, switchConfig);
  return Object.keys(row || {}).some((column) => {
    return isDynamicIconListColumn(column, switchConfig) ||
      !!getDynamicIconColumnToken(column, switchConfig) ||
      !!getDirectDynamicIconColumnToken(column, iconNameKeys, switchConfig);
  });
}

function setChildLayersVisibleRecursive(layer, visible) {
  let count = 0;
  for (const child of layer && layer.layers || []) {
    setLayerVisibleRecursive(child, visible);
    count += 1;
    count += setChildLayersVisibleRecursive(child, visible);
  }
  return count;
}

function hideDynamicIconGroups(doc, switchConfig) {
  let childCount = 0;
  const groups = getDynamicIconGroupLayers(doc, switchConfig);
  for (const group of groups) {
    group.visible = true;
    childCount += setChildLayersVisibleRecursive(group, false);
  }
  if (groups.length) {
    log(`  Dynamic icon reset: groups=${groups.length}, layers=${childCount}.`);
  } else {
    log("  Dynamic icon reset skipped: ICON group not found.");
  }
}

function splitDynamicIconList(value) {
  return String(value || "")
    .split(/[,\n\r;|，、；]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyDynamicIconSwitch(doc, row) {
  const switchConfig = getDynamicIconSwitchConfig();
  if (!switchConfig || !hasDynamicIconControls(doc, row, switchConfig)) return;

  hideDynamicIconGroups(doc, switchConfig);
  const iconGroups = getDynamicIconGroupLayers(doc, switchConfig);
  const iconNameKeys = getDynamicIconLayerNameKeys(doc, switchConfig);
  const openIconNames = (names, label) => {
    let opened = 0;
    for (const group of iconGroups) {
      opened += setLayersVisibleByAnyNameInLayer(group, names, true, label);
    }
    return opened;
  };

  for (const column of switchConfig.listColumns || []) {
    if (!hasValue(row, column)) continue;
    for (const token of splitDynamicIconList(row[column])) {
      openIconNames(getDynamicIconLayerNames(token, switchConfig), `dynamic icon ${token}`);
      log(`  Dynamic icon switch: ${column}:${token}=on.`);
    }
  }

  for (const [column, value] of Object.entries(row || {})) {
    const token = getDynamicIconColumnToken(column, switchConfig) ||
      getDirectDynamicIconColumnToken(column, iconNameKeys, switchConfig);
    if (!token) continue;
    const visible = parseVisibilityValue(value, switchConfig.defaultVisible);
    if (!visible) {
      log(`  Dynamic icon switch: ${column}=off.`);
      continue;
    }
    openIconNames(getDynamicIconLayerNames(token, switchConfig), `dynamic icon ${token}`);
    log(`  Dynamic icon switch: ${column}=on.`);
  }
}

function isDynamicIconControlColumn(doc, row, column) {
  const switchConfig = getDynamicIconSwitchConfig();
  if (!switchConfig) return false;
  const iconNameKeys = getDynamicIconLayerNameKeys(doc, switchConfig);
  return isDynamicIconListColumn(column, switchConfig) ||
    !!getDynamicIconColumnToken(column, switchConfig) ||
    !!getDirectDynamicIconColumnToken(column, iconNameKeys, switchConfig);
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
  if (isFlatAmpoulePacketSource(text)) return "ampoule";
  if (/(ampoule|essence|set-\d+x|\d+x|sticker|stickers|patch|\u6b21\u629b|\u5b89\u74f6|\u8d34\u7247|\u7cbe\u6cb9\u8d34)/i.test(text)) return "ampoule";
  if (/(tube|\u7ba1\u88c5|\u8f6f\u7ba1)/i.test(text)) return "tube";
  if (/(pump|\u6309\u538b\u74f6)/i.test(text)) return "pump";
  if (/(jar|pot|\u7f50\u88c5)/i.test(text)) return "jar";
  if (/(canvas[-_\s]*bag|gift[-_\s]*bag|\u5e06\u5e03\u888b)/i.test(text)) return "bag";
  if (/(bottle|\u74f6\u88c5)/i.test(text)) return "bottle";
  if (/(cream|\u971c)/i.test(text)) return "jar";
  if (/(diaper|repairing)/i.test(text)) return "tube";
  if (/(wash|foam|shampoo|body-lotion|lotion|oil|sunscreen|sun)/i.test(text)) return "bottle";
  return "default";
}

function isSmallBagSachetSource(source) {
  const text = String(source || "").toLowerCase().replace(/\\/g, "/").replace(/[_\s]+/g, "-");
  return /(?:bag|sachet|packet|5g|5ml|8g|8ml|\u888b\u5305|\u888b\u88c5|\u7247\u88c5)/i.test(text);
}

function isStickerPatchSource(source) {
  return /(sticker|stickers|patch|\u8d34\u7247|\u7cbe\u6cb9\u8d34)/i.test(String(source || ""));
}

function isFlatAmpoulePacketSource(source) {
  return isSmallBagSachetSource(source) || isStickerPatchSource(source);
}
function getProductCategory(row, index) {
  const override = String(row[`product.category.${index}`] || row["product.category"] || "").trim().toLowerCase();
  if (override) return override;
  return getProductCategoryFromSource(getImageSourceForIndex(row, "product", index));
}

function normalizeProductCategory(category) {
  const value = String(category || "default").trim().toLowerCase();
  if (value === "pump") return "bottle";
  if (["jar", "bottle", "tube", "ampoule", "bag"].includes(value)) return value;
  return "default";
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
  const matcher = /(\d+(?:\.\d+)?)\s*(ml|\u6beb\u5347|g|\u514b)/g;
  let match = matcher.exec(text);

  while (match) {
    const value = Number(match[1]);
    const unit = match[2] === "ml" || match[2] === "\u6beb\u5347" ? "ml" : "g";
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
  if (layout === "auto") {
    return getImageGroupLayout({}, prefix);
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

  return /(ampoule|essence|娆℃姏|绮惧崕闇瞸5x|x5|set-5)/.test(text);
}

function getGiftLeftAmpouleGroupCount(row) {
  const explicitMatch = String(row && (row["giftLeft.ampouleGroups"] || row["giftLeft.groupCount"]) || "").match(/(\d+)/);
  if (explicitMatch) return Math.max(1, Math.min(Number(explicitMatch[1]), 12));

  const imagePath = getGiftLeftAmpouleImagePath(row);
  const text = [
    row && row["txt.giftLeftDesc"],
    row && row.txt && row.txt.giftLeftDesc,
    row && row["img.giftLeft"],
    row && row["img.giftLeftSet"]
  ].filter(Boolean).join(" ")
    .replace(/\u00d7/g, "x")
    .replace(/\uff0a/g, "*")
    .replace(/\uff38/g, "x")
    .replace(/\uff58/g, "x");

  const unitsPerAsset = getAmpouleUnitsFromText(imagePath);
  if (unitsPerAsset > 1) {
    const totalUnits = getGiftLeftAmpouleTotalUnits(text);
    if (totalUnits > 0) {
      return Math.max(1, Math.min(Math.ceil(totalUnits / unitsPerAsset), 12));
    }
    return 1;
  }

  const groupMatch = text.match(/(?:\*|x)\s*5\s*(?:\*|x)\s*(\d+)/i);
  if (groupMatch) return Math.max(1, Math.min(Number(groupMatch[1]), 12));

  const countMatch = text.match(/(?:ampoule|essence).*?(?:\*|x)\s*(\d+)/i);
  if (countMatch && Number(countMatch[1]) > 5) {
    return Math.max(1, Math.min(Number(countMatch[1]), 12));
  }

  return 1;
}

function getAmpouleUnitsFromText(value) {
  const text = String(value || "")
    .toLowerCase()
    .replace(/\u00d7/g, "x")
    .replace(/\uff0a/g, "*")
    .replace(/\uff38/g, "x")
    .replace(/\uff58/g, "x");
  const setMatch = text.match(/(?:set[-_\s]*|[-_\s])(\d+)\s*x/i) || text.match(/(?:\*|x)\s*(\d+)(?:[^0-9]|$)/i);
  return setMatch ? Number(setMatch[1]) || 0 : 0;
}

function getGiftLeftAmpouleTotalUnits(text) {
  const normalized = String(text || "").toLowerCase();
  const groupMatch = normalized.match(/(?:\*|x)\s*5\s*(?:\*|x)\s*(\d+)/i);
  if (groupMatch) return 5 * Number(groupMatch[1]);

  const countMatch = normalized.match(/(?:ampoule|essence).*?(?:\*|x)\s*(\d+)/i);
  if (countMatch) return Number(countMatch[1]) || 0;

  return getAmpouleUnitsFromText(normalized);
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
  return Math.max(0.25, Math.min(Number(value), 1.35));
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

function getProductHeightRatioProfile(row) {
  return String(
    row["product.heightRatioProfile"] ||
    row["product.heightProfile"] ||
    row["product.sizeRatioProfile"] ||
    row["product.referenceHeightRatio"] ||
    getCurrentTemplateConfig().productHeightRatioProfile ||
    ""
  ).trim().toLowerCase();
}

function shouldUseReferenceProductHeightRatio(row, count) {
  const profile = getProductHeightRatioProfile(row);
  if (["reference-all", "front-all", "psd-all", "true-size-all"].includes(profile)) return true;
  if (["reference", "front", "front-reference", "psd", "true-size", "true"].includes(profile)) {
    return Math.max(Number(count) || 1, 1) > 1;
  }
  return false;
}

function readReferenceProductHeightRatio(row, key, fallback, aliases = []) {
  const referenceKey = `reference${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  return readProductHeightRatio(row, referenceKey, fallback, [`product.${key}HeightRatio`, ...aliases]);
}

function getReferenceBottleHeightRatioBySpec(row, size, category) {
  const pumpBoost = category === "pump" ? 0.04 : 0;
  if (size >= 500) return readReferenceProductHeightRatio(row, "bottle500", 0.91 + pumpBoost, ["product.lotion500HeightRatio"]);
  if (size >= 400) return readReferenceProductHeightRatio(row, "bottle400", 0.78 + pumpBoost, ["product.lotion500HeightRatio"]);
  if (size >= 300) return readReferenceProductHeightRatio(row, "bottle300", 0.75 + pumpBoost, ["product.lotion500HeightRatio"]);
  if (size >= 200) return readReferenceProductHeightRatio(row, "bottle200", 0.55 + pumpBoost);
  if (size >= 150) return readReferenceProductHeightRatio(row, "bottle150", 0.55 + pumpBoost);
  if (size >= 120) return readReferenceProductHeightRatio(row, "bottle120", 0.53 + pumpBoost);
  if (size >= 100) return readReferenceProductHeightRatio(row, "bottle100", 0.62 + pumpBoost);
  if (size >= 60) return readReferenceProductHeightRatio(row, "bottle60", 0.46 + pumpBoost);
  if (size >= 50) return readReferenceProductHeightRatio(row, "bottle50", 0.46 + pumpBoost);
  if (size >= 40) return readReferenceProductHeightRatio(row, "bottle40", 0.42 + pumpBoost);
  if (size >= 30) return readReferenceProductHeightRatio(row, "bottle30", 0.36 + pumpBoost);
  if (size >= 15) return readReferenceProductHeightRatio(row, "bottle15", 0.26 + pumpBoost);
  if (size >= 10) return readReferenceProductHeightRatio(row, "bottle10", 0.39 + pumpBoost, ["product.lotion5HeightRatio"]);
  if (size > 0) return readReferenceProductHeightRatio(row, "bottle5", 0.25 + pumpBoost, ["product.lotion5HeightRatio"]);
  return null;
}

function getReferenceJarHeightRatioBySpec(row, size) {
  if (size >= 65) return readReferenceProductHeightRatio(row, "jar65", 0.32);
  if (size >= 50) return readReferenceProductHeightRatio(row, "jar50", 0.26, ["product.cream50HeightRatio"]);
  if (size >= 30) return readReferenceProductHeightRatio(row, "jar30", 0.28);
  if (size > 0) return readReferenceProductHeightRatio(row, "jarSmall", 0.25);
  return null;
}

function getReferenceTubeHeightRatioBySpec(row, size) {
  if (size >= 100) return readReferenceProductHeightRatio(row, "tube100", 0.71);
  if (size >= 60) return readReferenceProductHeightRatio(row, "tube60", 0.68);
  if (size >= 50) return readReferenceProductHeightRatio(row, "tube50", 0.55);
  if (size >= 30) return readReferenceProductHeightRatio(row, "tube30", 0.44);
  if (size >= 25) return readReferenceProductHeightRatio(row, "tube25", 0.41);
  if (size >= 15) return readReferenceProductHeightRatio(row, "tube15", 0.67);
  if (size >= 10) return readReferenceProductHeightRatio(row, "tube10", 0.36);
  if (size > 0) return readReferenceProductHeightRatio(row, "tube5", 0.37);
  return null;
}

function getReferenceAmpouleHeightRatioBySpec(row, size, source) {
  const text = String(source || "").toLowerCase();
  if (isFlatAmpoulePacketSource(source)) return readReferenceProductHeightRatio(row, "ampouleBag", 0.25, ["product.stickerHeightRatio", "product.smallBagHeightRatio"]);
  if (isAmpouleSetSource(source)) {
    if (/packaging|package|box/i.test(text)) return readReferenceProductHeightRatio(row, "ampouleSetPackaging", 0.54);
    return readReferenceProductHeightRatio(row, "ampouleSet", 0.39);
  }
  if (size >= 60) return readReferenceProductHeightRatio(row, "ampoule60", 0.54);
  if (size >= 40) return readReferenceProductHeightRatio(row, "ampoule40", 0.46);
  if (size >= 10) return readReferenceProductHeightRatio(row, "ampoule10", 0.39);
  if (size > 0) return readReferenceProductHeightRatio(row, "ampouleSmall", 0.36);
  return null;
}

function getReferenceProductHeightRatio(row, category, specs, source) {
  const size = getProductSpecSize(specs);
  if (category === "bottle" && specs.g === 200) return readReferenceProductHeightRatio(row, "bottle200g", 0.71);
  if (category === "bottle" && specs.g === 50) return readReferenceProductHeightRatio(row, "bottle50g", 0.55);
  if (category === "ampoule") return getReferenceAmpouleHeightRatioBySpec(row, size, source);
  if (category === "jar") return getReferenceJarHeightRatioBySpec(row, size);
  if (category === "tube") return getReferenceTubeHeightRatioBySpec(row, size);
  if (category === "pump" || category === "bottle") return getReferenceBottleHeightRatioBySpec(row, size, category);
  return null;
}
function isAmpouleSetSource(source) {
  const text = String(source || "").toLowerCase();
  return /(ampoule[-_\s]*set|set-\d+x|\d+x|\*\s*\d+|\u6b21\u629b.*(?:x|\*)\s*\d+)/.test(text);
}

function shouldFitProductByHeight(row, index, source) {
  return true;
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
  if (size >= 200) return readProductHeightRatio(row, "bottle200", (same ? 0.64 : 0.61) + pumpBoost);
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
  if (size >= 15) return readProductHeightRatio(row, "tube15", same ? 0.72 : 0.7);
  if (size >= 10) return readProductHeightRatio(row, "tube10", same ? 0.465 : 0.444);
  if (size > 0) return readProductHeightRatio(row, "tube5", same ? 0.406 : 0.388);
  return readProductHeightRatio(row, "tubeDefault", same ? 0.84 : 0.7);
}

function getAmpouleHeightRatioBySpec(row, size, mode, source) {
  const same = mode === "same";
  if (isFlatAmpoulePacketSource(source)) {
    return readProductHeightRatio(row, "ampouleBag", same ? 0.8 : 0.72, ["product.stickerHeightRatio", "product.smallBagHeightRatio"]);
  }
  if (isAmpouleSetSource(source)) return readProductHeightRatio(row, "ampouleSet", 0.65);
  if (size >= 60) return readProductHeightRatio(row, "ampoule60", same ? 0.78 : 0.72);
  if (size >= 40) return readProductHeightRatio(row, "ampoule40", same ? 0.72 : 0.66);
  if (size >= 10) return readProductHeightRatio(row, "ampoule10", same ? 0.6 : 0.54);
  if (size > 0) return readProductHeightRatio(row, "ampouleSmall", same ? 0.42 : 0.36);
  return readProductHeightRatio(row, "ampouleDefault", same ? 0.8 : 0.72);
}

function getBagHeightRatio(row, mode) {
  return readProductHeightRatio(row, "bag", mode === "same" ? 0.9 : 0.9, ["product.canvasBagHeightRatio"]);
}

function getChartProductHeightRatio(row, category, specs, mode, source, options = {}) {
  const size = getProductSpecSize(specs);
  if (options.useReference) {
    const referenceRatio = getReferenceProductHeightRatio(row, category, specs, source);
    if (Number.isFinite(referenceRatio)) return referenceRatio;
  }
  if (category === "bottle" && specs.g === 200) {
    return readProductHeightRatio(row, "bottle200g", mode === "same" ? 0.92 : 0.88);
  }
  if (category === "bottle" && specs.g === 50) {
    return readProductHeightRatio(row, "bottle50g", mode === "same" ? 0.58 : 0.46);
  }
  if (category === "ampoule") return getAmpouleHeightRatioBySpec(row, size, mode, source);
  if (category === "jar") return getJarHeightRatioBySpec(row, size, mode);
  if (category === "tube") return getTubeHeightRatioBySpec(row, size, mode);
  if (category === "pump" || category === "bottle") return getBottleHeightRatioBySpec(row, size, mode, category);
  if (category === "bag") return getBagHeightRatio(row, mode);
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
  if (/\bstack\b|--stack|-stack-(?:ice|water)/i.test(source)) {
    return 1;
  }
  const specs = getProductSpecFromSource(source);
  const ratio = getChartProductHeightRatio(row, category, specs, mode, source, {
    useReference: shouldUseReferenceProductHeightRatio(row, count)
  });
  if (getCurrentTemplateConfig().id === "jddaily750" && category === "jar") {
    const jarBoost = count <= 1 ? 1.5 : 1.18;
    return clampHeightRatio(ratio * jarBoost);
  }
  const boost = Number(getCurrentTemplateConfig().productDefaultHeightBoost);
  return Number.isFinite(boost) && boost > 0 ? clampHeightRatio(ratio * boost) : ratio;
}

function getProductHeightRatioScale(row, index) {
  const itemScale = readNumber(row, `product.heightRatioscale.${index}`, null);
  if (Number.isFinite(itemScale) && itemScale > 0) return itemScale;

  const itemScaleCamel = readNumber(row, `product.heightRatioScale.${index}`, null);
  if (Number.isFinite(itemScaleCamel) && itemScaleCamel > 0) return itemScaleCamel;

  const scale = readNumber(row, "product.heightRatioscale", readNumber(row, "product.heightRatioScale", 1));
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
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
    return Math.min(Math.abs(explicit), 0.8);
  }

  const categories = items.map((_, index) => getProductCategory(row, index + 1));
  if (categories.every((category) => category === "jar")) return 0.16;
  if (categories.every((category) => category === "bottle")) return 0.12;
  return 0.08;
}

function getProductOverlapGap(row, items, areaBox) {
  const overlapRatio = getProductOverlapRatio(row, items);
  const minWidth = Math.min(...items.map((item) => item.box.width));

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

function readOptionalNumber(row, keys) {
  const list = Array.isArray(keys) ? keys : [keys];
  for (const key of list) {
    if (!row || row[key] === undefined || row[key] === null || row[key] === "") continue;
    const value = Number(row[key]);
    if (Number.isFinite(value)) return value;
  }
  return null;
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

function getLayerScaleForInitialPlacement(row, prefix) {
  if (prefix === "product") {
    const source = getImageGroupSourceText(row, "product");
    if (/\bstack\b|--stack|-stack-(?:ice|water)/i.test(source)) {
      const stackScale = Number(getCurrentTemplateConfig().productStackScale);
      return Number.isFinite(stackScale) && stackScale > 0 ? stackScale : 1;
    }
    return 1;
  }
  return getImageGroupScale(row, prefix);
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
  ].some((key) => hasEnabledContentValue(row[key]));
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

function hideGiftLeftGroupsWhenTitleEmpty(doc, row) {
  const title = String(row && row["txt.giftLeftTitle"] || "").trim();
  if (title) return false;

  const groupNames = [
    "giftLeftimage",
    "giftLeftImage",
    "giftLeft.image",
    "giftLefttext",
    "giftLeftText",
    "giftLeft.text"
  ];
  let hidden = 0;
  for (const name of groupNames) {
    for (const layer of findLayersByName(doc, name)) {
      if (layer.visible !== false) {
        layer.visible = false;
        hidden += 1;
      }
    }
  }

  if (hidden) {
    log(`  GiftLeft groups hidden: txt.giftLeftTitle is empty, hidden=${hidden}.`);
  }
  return hidden > 0;
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

function normalizeDailyMechanism(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  const match = text.match(/[1-4]/);
  if (match) return match[0];
  if (text.includes("none") || text.includes("\u65e0\u4e70\u8d60") || text.includes("\u65e0\u8d60")) return "2";
  if (text.includes("middle") || text.includes("\u4e2d")) return "3";
  if (text.includes("left") || text.includes("\u5de6") || text.includes("\u5de6\u4fa7")) return "1";
  return "";
}

function normalizeDailyGiftLayerType(value, options = {}) {
  const text = String(value || "").trim();
  if (!text) return "";
  const exact = text.match(/^\d+(?:\.\d+)?$/);
  if (exact) return text;
  if (options.exactOnly) return "";
  const number = text.match(/\d+(?:\.\d+)?/);
  return number ? number[0] : "";
}

function getDailyGiftType(row, position) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  const layerMap = position === "right"
    ? switchConfig.rightGiftLayers || {}
    : switchConfig.middleGiftLayers || {};
  const configuredTypes = Object.keys(layerMap);
  const normalizeConfiguredType = (value, mode = "contains") => {
    const text = String(value || "").trim().toLowerCase();
    if (!text) return "";
    for (const type of configuredTypes.sort((a, b) => b.length - a.length)) {
      const normalizedType = String(type).toLowerCase();
      if (mode === "exact" ? text === normalizedType : text.includes(normalizedType)) return type;
    }
    if (mode !== "exact" && text.includes("289") && configuredTypes.includes("298")) return "298";
    return "";
  };

  const typeColumn = position === "right" ? "daily.giftRightType" : "daily.giftMiddleType";
  const imageColumn = position === "right" ? "img.giftRight" : "img.giftMiddle";
  const explicit = normalizeConfiguredType(row && row[typeColumn]) || normalizeDailyGiftLayerType(row && row[typeColumn]);
  if (explicit) return explicit;

  const imageSelector = normalizeConfiguredType(row && row[imageColumn], "exact") || normalizeDailyGiftLayerType(row && row[imageColumn], { exactOnly: true });
  if (imageSelector) return imageSelector;

  for (const type of configuredTypes) {
    if (hasValue(row, `img.gift${position === "right" ? "Right" : "Middle"}.${type}`)) return type;
  }
  return "";
}

function getDailyGiftMiddleType(row) {
  return getDailyGiftType(row, "middle");
}

function getDailyGiftRightType(row) {
  return getDailyGiftType(row, "right");
}

function getDailyMechanismType(row, switchConfig) {
  for (const column of getMechanismColumnCandidates(switchConfig)) {
    const explicit = normalizeDailyMechanism(row && row[column]);
    if (explicit) return explicit;
  }

  const sheet = normalizeDailyMechanism(row && row.sheet);
  if (sheet) return sheet;

  if (hasGiftLeftContent(row)) return "1";
  return String(switchConfig.defaultMechanism || "2");
}

function isDailyTypedGiftLayerName(name, position) {
  const prefix = position === "right" ? "img.giftRight" : "img.giftMiddle";
  return new RegExp(`^${prefix.replace(".", "\\.")}(?:\\.|\\d|$)`).test(String(name || ""));
}

function getDailyGiftLayerCandidateNames(position, type, configuredNames) {
  const prefix = position === "right" ? "img.giftRight" : "img.giftMiddle";
  const cleanType = String(type || "").trim();
  if (!cleanType) return configuredNames || [];
  return Array.from(new Set([
    ...(configuredNames || []),
    `${prefix}.${cleanType}`,
    `${prefix}${cleanType}`
  ]));
}

function setDailyGiftLayerVisibility(doc, switchConfig, position, giftType, row = null) {
  const giftLayers = position === "right"
    ? switchConfig.rightGiftLayers || {}
    : switchConfig.middleGiftLayers || {};
  const configuredNames = new Set(Object.values(giftLayers).flat());
  const giftLayerList = getAllLayers(doc.layers).filter((layer) => {
    return layer && (configuredNames.has(layer.name) || isDailyTypedGiftLayerName(layer.name, position));
  });

  giftLayerList.forEach((layer) => {
    layer.visible = false;
  });

  const label = position === "right" ? "GiftRight" : "GiftMiddle";
  if (!giftType) {
    log(`  ${label} switch: closed ${giftLayerList.length}, active=none.`);
    return;
  }

  const activeNames = getDailyGiftLayerCandidateNames(position, giftType, giftLayers[giftType]);
  const activeMechanismLayer = row ? findDailyMechanismLayer(doc, row) : null;
  const opened = activeMechanismLayer
    ? setLayersVisibleByAnyNameInLayer(activeMechanismLayer, activeNames, true, `img.gift${position === "right" ? "Right" : "Middle"}.${giftType}`)
    : setLayersVisibleByAnyName(doc, activeNames, true, `img.gift${position === "right" ? "Right" : "Middle"}.${giftType}`);
  log(`  ${label} switch: closed ${giftLayerList.length}, active=${giftType}, opened=${opened}.`);
}

function applyDailyMechanismSwitch(doc, row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config);
  if (!switchConfig || !switchConfig.enabled) return;

  const type = getDailyMechanismType(row, switchConfig);
  const groups = switchConfig.groups || {};
  Object.entries(groups).forEach(([groupType, names]) => {
    setLayersVisibleByAnyName(doc, names, groupType === type, `daily mechanism ${groupType}`);
  });

  const requestedMiddleType = getDailyGiftMiddleType(row);
  const middleType = requestedMiddleType;
  setDailyGiftLayerVisibility(doc, switchConfig, "middle", middleType, row);

  const requestedRightType = getDailyGiftRightType(row);
  const rightType = requestedRightType;
  setDailyGiftLayerVisibility(doc, switchConfig, "right", rightType, row);

  const showLeft298 = type === "4" || String(row && row["daily.left298"] || "").trim() === "1";
  setLayersVisibleByAnyName(doc, switchConfig.left298Layers || [], showLeft298, "img.giftLeft.298");
  log(`  Daily switch: mechanism=${type}, middleGift=${middleType || "none"}, rightGift=${rightType || "none"}.`);
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
  const legacyLayers = findLayersByName(doc, switchConfig.legacyName || "img.person");
  const variantLayers = {};

  for (const [variantType, variant] of Object.entries(switchConfig.variants || {})) {
    variantLayers[variantType] = (variant.names || []).flatMap((name) => findLayersByName(doc, name));
  }  Object.values(variantLayers).flat().forEach((layer) => {
    if (layer) layer.visible = false;
  });
  legacyLayers.forEach((layer) => {
    if (layer) layer.visible = false;
  });

  if (type && variantLayers[type] && variantLayers[type].length) {
    variantLayers[type].forEach((layer) => {
      if (layer) layer.visible = true;
    });
    log(`  Person template switch: show ${type}, hidden other person layers.`);
    return;
  }

  if (type && legacyLayers.length) {
    legacyLayers.forEach((layer) => {
      if (layer) layer.visible = true;
    });
    log(`  Person template layer for "${type}" not found. Keeping legacy img.person visible.`);
    return;
  }

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
  const pattern = /<sup\s*([0-9A-Za-z]+)\s*>|<sup>(.*?)<\/sup>|[\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079]/g;
  const superscriptMap = {
    "\u2070": "0",
    "\u00b9": "1",
    "\u00b2": "2",
    "\u00b3": "3",
    "\u2074": "4",
    "\u2075": "5",
    "\u2076": "6",
    "\u2077": "7",
    "\u2078": "8",
    "\u2079": "9"
  };
  let match;

  while ((match = pattern.exec(input)) !== null) {
    output += input.slice(index, match.index);
    const text = match[1] || match[2] || superscriptMap[match[0]] || match[0];
    const start = Array.from(output).length;
    output += text;
    superscripts.push({ start, end: start + Array.from(text).length });
    index = match.index + match[0].length;
  }

  output += input.slice(index);
  return { text: output, superscripts };
}

function isCjkTitleChar(char) {
  return /[\u3400-\u9fff\uf900-\ufaff]/.test(String(char || ""));
}

function isTitleFootnoteChar(char) {
  return /^[1-9*]$/.test(String(char || ""));
}

function addAutoTitleFootnoteSuperscripts(text, superscripts) {
  const chars = Array.from(String(text || ""));
  const ranges = (superscripts || []).slice();
  const hasRangeAt = (index) => ranges.some((range) => index >= range.from && index < range.to);

  chars.forEach((char, index) => {
    if (!isTitleFootnoteChar(char) || hasRangeAt(index)) return;

    const prev = chars[index - 1] || "";
    const next = chars[index + 1] || "";
    if (!isCjkTitleChar(prev)) return;
    if (/^[0-9A-Za-z]$/.test(next)) return;

    ranges.push({ from: index, to: index + 1 });
  });

  return ranges.sort((a, b) => a.from - b.from || a.to - b.to);
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
  return !isCjkTextChar(char);
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

function isCjkTextChar(char) {
  const code = String(char || "").codePointAt(0);
  if (!Number.isFinite(code)) return false;
  return (
    (code >= 0x3400 && code <= 0x4DBF) ||
    (code >= 0x4E00 && code <= 0x9FFF) ||
    (code >= 0xF900 && code <= 0xFAFF) ||
    (code >= 0x20000 && code <= 0x2A6DF) ||
    (code >= 0x2A700 && code <= 0x2B73F) ||
    (code >= 0x2B740 && code <= 0x2B81F) ||
    (code >= 0x2B820 && code <= 0x2CEAF)
  );
}

function getMixedTextKind(char, options = {}) {
  if (options.symbolsAsLatin) {
    return isCjkTextChar(char) ? "chinese" : "latin";
  }
  return isLatinDigitChar(char) ? "latin" : "chinese";
}

function getTemplateStyleSourceKind(char, options = {}) {
  if (isLatinDigitChar(char)) return "latin";
  if (isCjkTextChar(char)) return "chinese";
  return options.symbolsAsLatin ? "" : "chinese";
}
function isSubtitleLatinChar(char) {
  return /^[A-Za-z0-9.,:;!?'"()&+\-/%\s]$/.test(char);
}

function applyTitleFontToTemplateStyle(style, kind) {
  if (kind !== "latin") {
    return { ...(style || {}) };
  }
  const font = TITLE_FONT_RULE.latin;
  return {
    ...(style || {}),
    fontPostScriptName: font.postScriptName,
    fontName: font.fontName,
    fontStyleName: font.fontStyleName || "Regular",
    impliedFontPostScriptName: font.postScriptName,
    impliedFontName: font.fontName
  };
}function isTitleLatinStyleChar(char) {
  return !isCjkTextChar(char);
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
      color: makeRgbColor(config.color || baseStyle.color),
      tracking: baseStyle.tracking || 0
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

function makeMixedTextStyle(baseStyle, styleConfig, kind) {
  const config = styleConfig[kind] || {};
  const fontSize = styleConfig.preserveFontSize ? NaN : Number(config.fontSize || styleConfig.fontSize);
  const textStyle = {
    ...baseStyle,
    fontPostScriptName: config.postScriptName || baseStyle.fontPostScriptName,
    fontName: config.fontName || baseStyle.fontName,
    color: makeRgbColor(config.color || baseStyle.color),
    tracking: baseStyle.tracking || 0
  };
  if (Number.isFinite(fontSize) && fontSize > 0) {
    textStyle.size = makePointValue(fontSize);
    textStyle.impliedFontSize = makePointValue(fontSize);
  }
  return textStyle;
}

function buildMixedTextStyleRangesWithSuperscripts(text, baseStyle, styleConfig, superscripts) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = isIndexInRanges(index, superscripts)
      ? "superscript"
      : isLatinDigitChar(char)
        ? "latin"
        : "chinese";
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
    const normalKind = range.kind === "superscript" ? "latin" : range.kind;
    const normalStyle = makeMixedTextStyle(baseStyle, styleConfig, normalKind);
    return {
      _obj: "textStyleRange",
      from: range.from,
      to: range.to,
      textStyle: range.kind === "superscript"
        ? makeSuperscriptTextStylePreserveFont(normalStyle)
        : normalStyle
    };
  });
}

function buildBottomTextStyleRanges(text, baseStyle, styleConfig, scale = 1) {
  const preserveChinese = !!(styleConfig && styleConfig.chinese && styleConfig.chinese.preserveTemplate);
  const config = {
    chinese: preserveChinese ? {} : {
      ...(styleConfig && styleConfig.chinese || {}),
      fontSize: Number(styleConfig && styleConfig.chinese && styleConfig.chinese.fontSize || 47) * scale
    },
    latin: {
      ...(styleConfig && styleConfig.latin || {}),
      fontSize: Number(styleConfig && styleConfig.latin && styleConfig.latin.fontSize || 57) * scale
    }
  };
  return buildMixedTextStyleRanges(text, baseStyle, config);
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

function getTemplateTextStyleByKind(textKey, fallbackStyle, options = {}) {
  const text = String(textKey && textKey.textKey || "");
  const chars = Array.from(text);
  const ranges = textKey && textKey.textStyleRange;
  const result = {
    chinese: fallbackStyle,
    latin: fallbackStyle
  };

  chars.forEach((char, index) => {
    const kind = getTemplateStyleSourceKind(char, options);
    if (!kind || result[kind] && result[kind] !== fallbackStyle) return;

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

function getTemplateStyleOrConfiguredFallback(styleByKind, baseStyle, styleConfig, kind) {
  const templateStyle = styleByKind && styleByKind[kind];
  const config = styleConfig && styleConfig[kind] || {};
  const templateFont = templateStyle && (templateStyle.fontPostScriptName || templateStyle.fontName);
  const baseFont = baseStyle && (baseStyle.fontPostScriptName || baseStyle.fontName);
  if (kind === "latin" && (!templateStyle || templateFont === baseFont)) {
    return {
      ...(baseStyle || {}),
      fontPostScriptName: config.postScriptName || (baseStyle && baseStyle.fontPostScriptName),
      fontName: config.fontName || (baseStyle && baseStyle.fontName)
    };
  }
  const fallbackStyle = {
    ...(baseStyle || {}),
    fontPostScriptName: config.postScriptName || (baseStyle && baseStyle.fontPostScriptName),
    fontName: config.fontName || (baseStyle && baseStyle.fontName)
  };
  return templateStyle || fallbackStyle;
}

function buildSubtitleTemplateFontStyleRanges(text, textKey, baseStyle, styleConfig, superscripts = []) {
  const styleByKind = getTemplateTextStyleByKind(textKey, baseStyle);
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = isIndexInRanges(index, superscripts)
      ? "superscript"
      : isSubtitleLatinChar(char)
        ? "latin"
        : "chinese";
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
    const normalKind = range.kind === "superscript" ? "latin" : range.kind;
    const templateStyle = getTemplateStyleOrConfiguredFallback(styleByKind, baseStyle, styleConfig, normalKind);
    return {
      _obj: "textStyleRange",
      from: range.from,
      to: range.to,
      textStyle: range.kind === "superscript"
        ? makeSuperscriptTextStylePreserveFont(templateStyle)
        : { ...templateStyle }
    };
  });
}

function scaleTemplateTextStyle(style, scale = 1) {
  const result = { ...(style || {}) };
  if (scale && scale !== 1) {
    const size = getTextStylePointSize(result);
    if (Number.isFinite(size) && size > 0) {
      result.size = makePointValue(size * scale);
      result.impliedFontSize = makePointValue(size * scale);
    }
    const leading = result.leading && typeof result.leading._value === "number"
      ? result.leading._value
      : typeof result.leading === "number"
        ? result.leading
        : null;
    if (Number.isFinite(leading) && leading > 0) {
      result.leading = makePointValue(leading * scale);
      result.impliedLeading = makePointValue(leading * scale);
    }
  }
  return result;
}

function buildBottomTextTemplateStyleRanges(text, styleByKind, scale = 1, options = {}) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = getMixedTextKind(char, options);
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

  return ranges.map((range) => ({
    _obj: "textStyleRange",
    from: range.from,
    to: range.to,
    textStyle: scaleTemplateTextStyle(styleByKind[range.kind] || styleByKind.chinese, scale)
  }));
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

function getTitleSuperscriptShift(baseSize) {
  const size = Number(baseSize) || 0;
  return Math.max(0, size * 0.96);
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
    const supSize = baseSize;
    const supShift = getTitleSuperscriptShift(baseSize);
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
    log(`  Title mixed font applied: latin=${fontConfig.latin.fontName}, chinese=${fontConfig.chinese.fontName}, superscripts=${(superscripts || []).length}, ranges=${supInfo || "-"}, scaled=${scaleInfo || "-"}, leadingRatio=${leadingInfo}, baseSize=${Math.round(baseSize)}, supSize=${Math.round(baseSize)}.`);
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
      return readNumber(row, `${prefix}.gap`, 0);
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
    const config = getCurrentTemplateConfig();
    const configuredRatio = prefix === "product"
      ? Number(config.productOverlapGapRatio)
      : prefix === "giftLeft"
        ? Number(config.giftLeftOverlapGapRatio)
        : NaN;
    if (Number.isFinite(configuredRatio)) {
      return itemWidth * configuredRatio;
    }
    return -itemWidth * 0.42;
  }

  return 0;
}

function hasProductCategoryGap(row) {
  if (!row) return false;
  return Object.keys(row).some((key) => /^product\.gap\.\d+$/.test(key) && row[key] !== "");
}

function isProductCategoryGapEnabled(row) {
  const mode = String(row && (row["product.categoryGapMode"] || row["product.categoryGap"] || "") || "").trim().toLowerCase();
  return !/^(0|false|no|off|disable|disabled|关闭)$/.test(mode);
}

function getProductCategoryPairGapRatio(leftCategory, rightCategory, layout = "overlap") {
  const left = normalizeProductCategory(leftCategory);
  const right = normalizeProductCategory(rightCategory);
  const pair = [left, right].sort().join("|");
  const lineRatios = {
    "jar|jar": 0.50,
    "bottle|bottle": 0,
    "tube|tube": -0.08,
    "ampoule|ampoule": -0.3,
    "bottle|jar": 0.72,
    "jar|tube": 0.78,
    "ampoule|jar": 0.84,
    "bottle|tube": 0.01,
    "ampoule|bottle": 0.02,
    "ampoule|tube": 0.02,
    "default|jar": 0.72
  };
  const ratios = {
    "jar|jar": 1.10,
    "bottle|bottle": -0.16,
    "tube|tube": -0.10,
    "ampoule|ampoule": 0.14,
    "bottle|jar": 0.62,
    "jar|tube": 0.68,
    "ampoule|jar": 0.72,
    "bottle|tube": -0.20,
    "ampoule|bottle": 0.12,
    "ampoule|tube": 0.16,
    "default|jar": 0.62
  };
  if (layout === "line") {
    return lineRatios[pair] !== undefined ? lineRatios[pair] : 0.12;
  }

  return ratios[pair] !== undefined ? ratios[pair] : -0.08;
}

function formatProductSpecToken(size) {
  if (!Number.isFinite(size) || size <= 0) return "";
  const rounded = Math.round(size * 10) / 10;
  return String(rounded).replace(".", "p");
}

function getProductSpecGapKey(row, index) {
  const category = normalizeProductCategory(getProductCategory(row, index));
  const source = getImageSourceForIndex(row, "product", index);
  if (category === "ampoule" && isFlatAmpoulePacketSource(source)) return "ampoulePacket";
  if (category === "ampoule" && isAmpouleSetSource(source)) return "ampouleSet";

  const specs = getProductSpecFromSource(source);
  const unit = specs.ml >= specs.g && specs.ml > 0 ? "ml" : specs.g > 0 ? "g" : "";
  const size = unit === "ml" ? specs.ml : unit === "g" ? specs.g : 0;
  const specToken = formatProductSpecToken(size);
  return specToken ? `${category}${specToken}${unit}` : category;
}

function getProductGapKeyCandidates(row, index) {
  const category = normalizeProductCategory(getProductCategory(row, index));
  const specKey = getProductSpecGapKey(row, index);
  return [specKey, category].filter((key, itemIndex, keys) => key && keys.indexOf(key) === itemIndex);
}

function getProductLayoutSlotSpan(row, index) {
  const source = getImageSourceForIndex(row, "product", index);
  const explicit = readNumber(row, `product.slotSpan.${index}`, null);
  if (Number.isFinite(explicit)) return Math.max(1, Math.min(explicit, 4));

  if (isAmpouleSetSource(source)) {
    const ampouleSetSlots = readNumber(row, "product.ampouleSetSlotSpan", readNumber(row, "product.ampouleSetSlots", 2));
    return Math.max(1, Math.min(ampouleSetSlots, 4));
  }

  return 1;
}

function parseProductSpecGapKey(key) {
  const match = String(key || "").match(/^(bottle|jar|tube|ampoule)(\d+(?:p\d+)?)(ml|g)$/);
  if (!match) return null;
  return {
    category: match[1],
    size: Number(match[2].replace("p", ".")),
    unit: match[3]
  };
}

function getProductLineSpecGapWeight(key) {
  const weights = {
    bottle: 0.01,
    bottle25g: 0.01,
    bottle30ml: 0,
    bottle40ml: 0,
    bottle60ml: 0.01,
    bottle100ml: 0.01,
    bottle150ml: 0.01,
    bottle200ml: 0.02,
    bottle300ml: 0.03,
    bottle400ml: 0.04,
    bottle500ml: 0.05,
    jar: 1.10,
    jar25g: 0.96,
    jar30g: 1.08,
    jar50g: 1.22,
    jar65g: 1.36,
    tube: 0.02,
    tube5g: 0,
    tube10g: 0,
    tube25g: 0.01,
    tube30g: 0.02,
    tube50g: 0.02,
    tube80g: 0.03,
    tube100g: 0.04,
    ampoule: 0.02,
    ampoulePacket: 0.03,
    ampouleSet: 0.03,
    ampoule1p8ml: 0.01,
    ampoule3p8g: 0.01,
    ampoule5ml: 0.01,
    ampoule10ml: 0.02,
    ampoule40ml: 0.03,
    ampoule60ml: 0.04
  };
  if (weights[key] !== undefined) return weights[key];

  const spec = parseProductSpecGapKey(key);
  if (!spec) return null;
  if (spec.category === "bottle") {
    if (spec.unit === "g" && spec.size <= 30) return 0.01;
    if (spec.size >= 500) return 0.05;
    if (spec.size >= 300) return 0.03;
    if (spec.size >= 150) return 0.01;
    if (spec.size >= 60) return 0.01;
    return 0;
  }
  if (spec.category === "jar") {
    if (spec.size >= 65) return 1.36;
    if (spec.size >= 50) return 1.22;
    if (spec.size >= 30) return 1.08;
    return 0.96;
  }
  if (spec.category === "tube") {
    if (spec.size >= 100) return 0.04;
    if (spec.size >= 50) return 0.02;
    if (spec.size >= 25) return 0.01;
    return 0;
  }
  if (spec.category === "ampoule") {
    if (spec.size >= 40) return 0.03;
    return 0.01;
  }
  return null;
}

function getProductLineSpecPairGapRatio(row, leftIndex, rightIndex) {
  const leftKey = getProductSpecGapKey(row, leftIndex);
  const rightKey = getProductSpecGapKey(row, rightIndex);
  const pair = [leftKey, rightKey].sort().join("|");
  const ratios = {
    "jar25g|jar25g": 1.32,
    "jar25g|jar30g": 1.38,
    "jar25g|jar50g": 1.46,
    "jar30g|jar30g": 1.42,
    "jar30g|jar50g": 1.50,
    "jar50g|jar50g": 1.62,
    "jar50g|jar65g": 1.70,
    "jar65g|jar65g": 1.80,
    "bottle30ml|jar30g": 0.82,
    "bottle30ml|jar50g": 0.90,
    "bottle40ml|jar30g": 0.82,
    "bottle60ml|jar30g": 0.84,
    "bottle100ml|jar30g": 0.86,
    "bottle25g|bottle500ml": 0.01,
    "bottle25g|bottle400ml": 0.01,
    "bottle25g|bottle300ml": 0.01,
    "bottle25g|jar30g": 0.64,
    "bottle25g|jar50g": 0.74,
    "bottle25g|tube100g": 0.02,
    "bottle500ml|tube100g": 0.02,
    "bottle500ml|jar50g": 0.76,
    "ampoule|ampoule": -0.3,
    "ampoulePacket|ampoulePacket": -0.5,
    "ampoulePacket|ampouleSet": -0.3,
    "ampoule|ampoulePacket": -0.3,
    "ampoulePacket|bottle500ml": 0.03,
    "ampoulePacket|jar50g": 0.78,
    "ampoulePacket|tube100g": 0.03,
    "ampouleSet|bottle500ml": 0.03,
    "ampouleSet|jar50g": 0.78,
    "ampouleSet|tube100g": 0.03
  };
  if (ratios[pair] !== undefined) return ratios[pair];

  const leftWeight = getProductLineSpecGapWeight(leftKey);
  const rightWeight = getProductLineSpecGapWeight(rightKey);
  if (Number.isFinite(leftWeight) && Number.isFinite(rightWeight)) {
    return Math.max(0.08, Math.min((leftWeight + rightWeight) / 2, 0.45));
  }

  return null;
}

function getProductCategoryPairGap(row, leftIndex, rightIndex, leftWidth, rightWidth, fallbackGap, layout = "overlap") {
  const leftCategory = normalizeProductCategory(getProductCategory(row, leftIndex));
  const rightCategory = normalizeProductCategory(getProductCategory(row, rightIndex));
  const leftKeys = getProductGapKeyCandidates(row, leftIndex);
  const rightKeys = getProductGapKeyCandidates(row, rightIndex);
  for (const leftKey of leftKeys) {
    for (const rightKey of rightKeys) {
      const direct = readNumber(row, `product.gap.${leftKey}.${rightKey}`, null);
      const reverse = readNumber(row, `product.gap.${rightKey}.${leftKey}`, null);
      if (Number.isFinite(direct)) return direct;
      if (Number.isFinite(reverse)) return reverse;
    }
  }

  const manual = getProductGapAt(row, leftIndex, layout, Math.min(leftWidth, rightWidth), null);
  if (Number.isFinite(manual)) return manual;

  const specRatio = layout === "line" ? getProductLineSpecPairGapRatio(row, leftIndex, rightIndex) : null;
  const ratio = Number.isFinite(specRatio)
    ? specRatio
    : getProductCategoryPairGapRatio(leftCategory, rightCategory, layout);
  const basisWidth = Math.min(leftWidth, rightWidth);
  if (!Number.isFinite(basisWidth) || basisWidth <= 0) return fallbackGap;
  const gap = Math.round(basisWidth * ratio);
  return layout === "line" ? Math.max(0, gap) : gap;
}

function getProductCategoryPairGaps(row, itemBoxes, fallbackGap, layout = "overlap") {
  const gaps = [];
  for (let i = 0; i < Math.max(0, itemBoxes.length - 1); i += 1) {
    gaps.push(getProductCategoryPairGap(
      row,
      i + 1,
      i + 2,
      itemBoxes[i].width,
      itemBoxes[i + 1].width,
      fallbackGap,
      layout
    ));
  }
  return gaps;
}

function shouldUseProductCategoryPairGaps(row) {
  return !hasValue(row, "product.gap") &&
    !hasValue(row, "product.spacing") &&
    isProductCategoryGapEnabled(row);
}

function fitProductGapsToArea(widths, gaps, areaWidth) {
  const widthTotal = widths.reduce((sum, width) => sum + width, 0);
  const gapTotal = gaps.reduce((sum, gap) => sum + gap, 0);
  const totalWidth = widthTotal + gapTotal;

  if (!Number.isFinite(totalWidth) || totalWidth <= areaWidth || gaps.length <= 0) {
    return gaps;
  }

  const excess = totalWidth - areaWidth;
  const extraOverlap = excess / gaps.length;
  return gaps.map((gap) => Math.round(gap - extraOverlap));
}

function normalizeProductLineGaps(gaps) {
  return (gaps || []).map((gap) => Math.max(0, Number(gap) || 0));
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
  return /^(1|true|yes|y|on|璐磋竟)$/.test(value);
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

  if (
    prefix === "product" &&
    count > 1 &&
    (layout === "overlap" || layout === "stack" || layout === "line") &&
    !hasItemHeight &&
    !hasItemWidth &&
    shouldUseProductCategoryPairGaps(row)
  ) {
    const bottom = readNumber(row, `${prefix}.bottom`, areaBox.bottom);
    const itemBoxes = [];

    for (let i = 0; i < count; i += 1) {
      const ratio = getProductHeightRatio(row, i + 1, count);
      const height = Math.min(areaBox.height, areaBox.height * ratio);
      const width = height * aspect * getProductLayoutSlotSpan(row, i + 1);
      itemBoxes.push({ width, height });
    }

    let gaps = getProductCategoryPairGaps(row, itemBoxes, -itemWidth * 0.42, layout);
    gaps = layout === "line"
      ? normalizeProductLineGaps(gaps)
      : fitProductGapsToArea(itemBoxes.map((box) => box.width), gaps, areaBox.width);
    let totalWidth = itemBoxes.reduce((sum, box) => sum + box.width, 0) + gaps.reduce((sum, value) => sum + value, 0);
    if (layout === "line" && totalWidth > areaBox.width) {
      const shrink = areaBox.width / totalWidth;
      itemBoxes.forEach((box) => {
        box.width *= shrink;
        box.height *= shrink;
      });
      gaps = gaps.map((gap) => Math.max(0, gap * shrink));
      totalWidth = itemBoxes.reduce((sum, box) => sum + box.width, 0) + gaps.reduce((sum, value) => sum + value, 0);
    }
    let left = areaBox.centerX - totalWidth / 2;
    const boxes = [];

    for (let i = 0; i < count; i += 1) {
      const box = itemBoxes[i];
      const yOffset = layout === "stack" ? (i - (count - 1) / 2) * box.height * 0.05 : 0;
      const centerX = left + box.width / 2;
      const centerY = bottom - box.height / 2 + yOffset;
      boxes.push({
        left: centerX - box.width / 2,
        top: centerY - box.height / 2,
        right: centerX + box.width / 2,
        bottom: centerY + box.height / 2,
        width: box.width,
        height: box.height,
        centerX,
        centerY
      });
      left += box.width + (gaps[i] || 0);
    }

    const categories = Array.from({ length: count }, (_, index) => normalizeProductCategory(getProductCategory(row, index + 1)));
    const specKeys = Array.from({ length: count }, (_, index) => getProductSpecGapKey(row, index + 1));
    const slotSpans = Array.from({ length: count }, (_, index) => getProductLayoutSlotSpan(row, index + 1));
    log(`  Product category gap preset: layout=${layout}, categories=${categories.join("+")}, specKeys=${specKeys.join("+")}, slotSpans=${slotSpans.join("+")}, gaps=${gaps.join("|")}, totalWidth=${Math.round(totalWidth)}.`);
    return boxes;
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
    await moveLayerNearTemplateLayer(layer, baseLayer, photoshop.constants.ElementPlacement.PLACEBEFORE);
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
  const baseLayer = findVisiblePreferredLayerByName(doc, baseName);
  const areaLayer = getImageGroupAreaLayer(doc, prefix, count, row);
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));

  if (areaLayer) {
    areaLayer.visible = false;
  }
  hideImageGroupAreaLayers(doc, prefix);

  if (areaBox) {
    log(`  ${prefix}.area: ${areaLayer.name}, x=${Math.round(areaBox.left)}, y=${Math.round(areaBox.top)}, w=${Math.round(areaBox.width)}, h=${Math.round(areaBox.height)}`);
    state.groupAreaBoxes[prefix] = areaBox;
    state.groupAreaNames[prefix] = areaLayer.name;
  } else {
    log(`  ${prefix}.area not found. Using img.${prefix} as layout area.`);
    delete state.groupAreaBoxes[prefix];
    delete state.groupAreaNames[prefix];
  }

  if (!baseLayer) return;
  if (count <= 1 && prefix === "product") {
    const singleBox = getBoundsBox(baseLayer.boundsNoEffects || baseLayer.bounds);
    if (singleBox && areaBox) {
      const singleItems = await scaleProductItemsToAreaHeight([{
        layer: baseLayer,
        box: singleBox
      }], row, areaBox);
      await arrangeProductLayerStacking(singleItems, getImageGroupZOrder(row, "product"));
    }
    return;
  }
  if (count <= 1 && prefix !== "giftLeft") return;

  const baseBox = getBoundsBox(baseLayer.boundsNoEffects || baseLayer.bounds);
  if (!baseBox) return;

  const layout = resolveImageGroupLayout(row, prefix, count);
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
    if (areaBox) {
      await clampLayerToBox(layer, areaBox);
    }
    state.giftTargets[layerName] = {
      prefix,
      targetBox: targetBoxes[i - 1],
      areaBox,
      scale: getLayerScaleForInitialPlacement(row, prefix),
      alignY: prefix === "product" ? "bottom" : "center",
      fitBy: prefix === "product" && getImageGroupSourceText(row, prefix).includes("cream") ? "height" : "contain"
    };
    layers.push(layer);
  }

  if (prefix === "product") {
    let productItems = layers.map((layer) => ({
      layer,
      box: getBoundsBox(layer.boundsNoEffects || layer.bounds)
    })).filter((item) => item.box);
    if (count <= 1 && areaBox) {
      productItems = await scaleProductItemsToAreaHeight(productItems, row, areaBox);
    }
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

function hasEnabledContentValue(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return false;
  return !["0", "false", "no", "n", "off", "none", "null", "hide", "hidden", "\u65e0", "\u5426", "\u5173", "\u5173\u95ed"].includes(text);
}
function hasPersonContent(row) {
  if (!row) return false;
  return [
    "img.person",
    "people",
    "person",
    "\u4eba\u7269",
    "\u8fbe\u4eba",
    "\u4ee3\u8a00\u4eba"
  ].some((key) => hasEnabledContentValue(row[key]));
}

function getTextLineCount(value) {
  const text = String(value || "");
  if (!text) return 0;
  return text.split(/\r\n|\r|\n/).length;
}
function getImageGroupAreaLayer(doc, prefix, count, row) {
  if (prefix === "product") {
    const area1 = findLayerByName(doc, "product.area.1");
    const area2 = findLayerByName(doc, "product.area.2");
    const fallback = findLayerByName(doc, "product.area");
    if (!hasPersonContent(row)) {
      return area2 || fallback || area1;
    }
    return area1 || fallback || area2;
  }

  if (prefix === "giftLeft") {
    const area1 = findLayerByName(doc, "giftLeft.area.1");
    const area2 = findLayerByName(doc, "giftLeft.area.2");
    const fallback = findLayerByName(doc, "giftLeft.area");
    const lineCount = getTextLineCount(row && row["txt.giftLeftDesc"]);
    return lineCount >= 3 ? area2 || fallback || area1 : area1 || fallback || area2;
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

  if (prefix === "giftLeft") {
    ["giftLeft.area", "giftLeft.area.1", "giftLeft.area.2"].forEach((name) => {
      const layer = findLayerByName(doc, name);
      if (layer) layer.visible = false;
    });
    return;
  }

  const layer = findLayerByName(doc, `${prefix}.area`);
  if (layer) layer.visible = false;
}

function hideAreaHelperLayers(doc) {
  const helpers = getAllLayers(doc.layers).filter((layer) => {
    const name = String(layer && layer.name || "").trim();
    return /^AREA$/i.test(name) || /(^|\.|_)area(?:\.|_|$)/i.test(name);
  });

  helpers.forEach((layer) => {
    layer.visible = false;
  });

  if (helpers.length) {
    log(`  Hidden AREA helper layers/groups: ${helpers.map((layer) => layer.name).join(", ")}.`);
  }
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

async function moveLayerNearTemplateLayer(layer, templateLayer, placement) {
  if (!layer || !templateLayer) return;
  try {
    await layer.move(templateLayer, placement || photoshop.constants.ElementPlacement.PLACEBEFORE);
  } catch (error) {
    log(`  Layer z-order move skipped for ${layer.name}: ${formatError(error)}`);
  }
}

async function moveLayerBesideReferenceBestEffort(layer, referenceLayer, label) {
  if (!layer || !referenceLayer) return false;
  const placements = [
    photoshop.constants.ElementPlacement.PLACEBEFORE,
    photoshop.constants.ElementPlacement.PLACEAFTER
  ].filter(Boolean);

  let lastError = null;
  for (const placement of placements) {
    try {
      await layer.move(referenceLayer, placement);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  log(`  ${label || "Layer"} group placement skipped: ${formatError(lastError)}`);
  return false;
}

async function moveLayerInsideGroup(layer, groupLayer, label) {
  if (!layer || !groupLayer) return false;
  const placements = [
    photoshop.constants.ElementPlacement.PLACEINSIDE,
    photoshop.constants.ElementPlacement.PLACEATEND,
    photoshop.constants.ElementPlacement.INSIDE
  ].filter(Boolean);
  for (const placement of placements) {
    try {
      await layer.move(groupLayer, placement);
      log(`  Moved ${layer.name} inside ${label || groupLayer.name}.`);
      return true;
    } catch (error) {
      // Try the next UXP placement constant.
    }
  }
  log(`  Layer group move skipped for ${layer.name}: could not move inside ${label || groupLayer.name}.`);
  return false;
}

async function moveLayerByOffset(layer, dx, dy, label) {
  if (!layer || (!dx && !dy)) return;
  try {
    // GiftLeft alignment relies on Photoshop's native move offset; DOM translate did not move grouped smart-object content reliably.
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "move",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _obj: "offset",
            horizontal: { _unit: "pixelsUnit", _value: dx },
            vertical: { _unit: "pixelsUnit", _value: dy }
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  Action move skipped for ${label || layer.name}: ${formatError(error)}; using DOM translate.`);
    await layer.translate(dx, dy);
  }
}

function findCurrentGiftLeftImageGroup(doc, row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  const type = getDailyMechanismType(row || state.currentRow || {}, switchConfig);
  const mechanismNames = getMechanismGroupNames(switchConfig, type);
  const mechanismLayer = findDailyMechanismLayerForGiftLeft(doc, mechanismNames);
  return mechanismLayer ? findGiftLeftImageGroupInLayer(mechanismLayer) : null;
}

async function preparePlacedImageGroupLayers(doc, row, prefix, baseLayer, targetBoxes, areaBox, count, layout) {
  state.placedImageLayers = state.placedImageLayers || {};

  for (let i = 1; i <= 6; i += 1) {
    const oldLayer = findLayerByName(doc, `img.${prefix}.${i}`);
    if (oldLayer) {
      oldLayer.visible = false;
      oldLayer.name = `__ignored.img.${prefix}.${i}`;
    }
  }

  const layers = [];
  const setImages = parseImageSpec(row[`img.${prefix}Set`]).images;
  for (let i = 1; i <= count; i += 1) {
    const imagePath = row[`img.${prefix}.${i}`] || setImages[i - 1] || row[`img.${prefix}`];
    if (!imagePath || isDisabledImageValue(imagePath)) continue;

    const asset = await getAssetEntry(imagePath, {
      disableTrimmed: prefix === "giftRight",
      normalizeGiftRight: prefix === "giftRight",
      productFallbackPriority: prefix === "product"
    });
    const layer = await placeAssetAsLayer(asset);
    layer.name = `img.${prefix}.${i}`;
    layer.visible = true;
    if (prefix === "product") {
      await moveLayerBesideReferenceBestEffort(layer, baseLayer, `${layer.name} -> ${baseLayer.name}`);
    }
    if (prefix === "giftLeft") {
      const giftLeftImageGroup = findCurrentGiftLeftImageGroup(doc, row);
      const movedInside = await moveLayerInsideGroup(layer, giftLeftImageGroup, "current giftLeftimage");
      if (!movedInside) {
        await moveLayerNearTemplateLayer(layer, giftLeftImageGroup || baseLayer, photoshop.constants.ElementPlacement.PLACEBEFORE);
      }
    }
    const targetBox = prefix === "product"
      ? applyProductHeightRatioToBox(row, i, areaBox, targetBoxes[i - 1], count)
      : prefix === "giftLeft"
        ? applyGiftLeftHeightRatioToBox(row, i, areaBox, targetBoxes[i - 1])
        : targetBoxes[i - 1];

    const sourceForFit = getImageSourceForIndex(row, prefix, i);
    const fitByHeight = (prefix === "product" && shouldFitProductByHeight(row, i, sourceForFit)) ||
      prefix === "giftLeft" ||
      prefix === "giftRight";
    await fitLayerToBox(layer, targetBox, {
      alignY: prefix === "product" ? "bottom" : "center",
      fitBy: fitByHeight ? "height" : "contain"
    });
    if (prefix === "product" && areaBox) {
      log(`  Product height rule: ${layer.name}, mode=${getProductHeightMode(row, count)}, category=${getProductCategory(row, i)}, ratio=${getProductHeightRatio(row, i, count)}, targetH=${Math.round(targetBox.height)}`);
    }
    await scaleLayerByFactor(layer, getLayerScaleForInitialPlacement(row, prefix), {
      anchor: prefix === "product" ? "bottomCenter" : "center"
    });
    if (prefix === "product") {
      const heightRatioScale = getProductHeightRatioScale(row, i);
      if (heightRatioScale !== 1) {
        await scaleLayerByFactor(layer, heightRatioScale, { anchor: "bottomCenter" });
        log(`  Product heightRatioScale applied: ${layer.name}, scale=${heightRatioScale}.`);
      }
    }
    if (areaBox) {
      await clampLayerToBox(layer, areaBox);
    }
    if (prefix === "product" && areaBox) {
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
    let productItems = layers.map((layer) => ({
      layer,
      box: getBoundsBox(layer.boundsNoEffects || layer.bounds)
    })).filter((item) => item.box);
    if (count <= 1 && areaBox) {
      productItems = await scaleProductItemsToAreaHeight(productItems, row, areaBox);
    }
    await arrangeProductLayerStacking(productItems, getImageGroupZOrder(row, "product"));
  }

  log(`  Placed ${layers.length} independent ${prefix} image layers with ${layout} layout.`);
}

async function alignGiftLeftImageGroupToArea(doc) {
  const areaBox = state.groupAreaBoxes && state.groupAreaBoxes.giftLeft;
  const areaName = state.groupAreaNames && state.groupAreaNames.giftLeft || "giftLeft.area";
  if (!areaBox) {
    log("  GiftLeft group align skipped: giftLeft.area not found.");
    return;
  }

  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  const type = getDailyMechanismType(state.currentRow || {}, switchConfig);
  const mechanismNames = getMechanismGroupNames(switchConfig, type);
  const mechanismLayer = findDailyMechanismLayerForGiftLeft(doc, mechanismNames);
  let targetLayer = null;
  if (mechanismLayer) {
    targetLayer = findGiftLeftImageGroupInLayer(mechanismLayer);
  }
  if (!mechanismLayer) {
    log(`  GiftLeft template group not found for mechanism.${type}; generated giftLeft layers will be aligned directly.`);
  } else if (!targetLayer) {
    log(`  GiftLeft group align skipped: giftLeftimage not found under ${mechanismLayer.name}.`);
  }

  const collectVisibleChildBoxes = (layer, result = []) => {
    if (!layer || layer.visible === false) return result;
    if (layer.layers && layer.layers.length) {
      layer.layers.forEach((child) => collectVisibleChildBoxes(child, result));
      return result;
    }
    const childBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (childBox) {
      result.push({ layer, box: childBox });
    }
    return result;
  };
  const childBoxes = targetLayer ? collectVisibleChildBoxes(targetLayer) : [];
  const generatedBoxes = [];
  const giftCount = Math.max(getGiftCount(state.currentRow || {}, "giftLeft") || 0, 0);
  for (let i = 1; i <= giftCount; i += 1) {
    findLayersByName(doc, `img.giftLeft.${i}`).forEach((layer) => {
      const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
      if (box) generatedBoxes.push({ layer, box });
    });
  }
  const alignItems = generatedBoxes.length ? generatedBoxes : childBoxes;
  const box = alignItems.length ? makeBox(
    Math.min(...alignItems.map((item) => item.box.left)),
    Math.min(...alignItems.map((item) => item.box.top)),
    Math.max(...alignItems.map((item) => item.box.right)) - Math.min(...alignItems.map((item) => item.box.left)),
    Math.max(...alignItems.map((item) => item.box.bottom)) - Math.min(...alignItems.map((item) => item.box.top))
  ) : targetLayer ? getBoundsBox(targetLayer.boundsNoEffects || targetLayer.bounds) : null;
  if (!box) {
    log("  GiftLeft group align skipped: no generated giftLeft layers or template group bounds.");
    return;
  }

  const alignX = String(firstTextValue(state.currentRow || {}, [
    "giftLeft.align",
    "giftLeft.alignX",
    "giftLeft.areaAlign",
    "giftLeft.areaAlignX",
    "giftLeft.imageAlign",
    "giftLeft.imageAlignX",
    "giftLeft.xAlign"
  ]) || "left").trim().toLowerCase();
  const dx = /^(center|middle|c|\u5c45\u4e2d)$/.test(alignX)
    ? areaBox.centerX - box.centerX
    : /^(right|r|\u53f3)$/.test(alignX)
      ? areaBox.right - box.right
      : areaBox.left - box.left;
  const dy = areaBox.bottom - box.bottom;
  if (alignItems.length) {
    for (const item of alignItems) {
      await moveLayerByOffset(item.layer, dx, dy, item.layer.name);
    }
  } else if (targetLayer) {
    await moveLayerByOffset(targetLayer, dx, dy, targetLayer.name);
  }
  const alignedItems = alignItems.length ? alignItems.map((item) => {
    const box = getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds);
    return box ? { layer: item.layer, box } : null;
  }).filter(Boolean) : targetLayer ? collectVisibleChildBoxes(targetLayer) : [];
  const alignedBox = alignedItems.length ? makeBox(
    Math.min(...alignedItems.map((item) => item.box.left)),
    Math.min(...alignedItems.map((item) => item.box.top)),
    Math.max(...alignedItems.map((item) => item.box.right)) - Math.min(...alignedItems.map((item) => item.box.left)),
    Math.max(...alignedItems.map((item) => item.box.bottom)) - Math.min(...alignedItems.map((item) => item.box.top))
  ) : targetLayer ? getBoundsBox(targetLayer.boundsNoEffects || targetLayer.bounds) : null;
  const movedLabel = alignItems.length ? alignItems.map((item) => item.layer.name).join("+") : targetLayer ? targetLayer.name : "none";
  log(`  GiftLeft align: area=${areaName}, moved=${movedLabel}, dx=${Math.round(dx)}, dy=${Math.round(dy)}, after=${alignedBox ? `${Math.round(alignedBox.left)},${Math.round(alignedBox.bottom)}` : "?"}, target=${Math.round(areaBox.left)},${Math.round(areaBox.bottom)}.`);
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

function collectProductGroupItems(doc, row) {
  const count = Math.max(getGiftCount(row, "product") || 1, 1);
  const items = collectProductItems(doc, count);
  if (items.length) return items;

  const layer = findLayerByName(doc, "img.product");
  const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
  return layer && box ? [{ layer, box }] : [];
}

async function alignCurrentProductLayersToArea(doc, row) {
  const config = getCurrentTemplateConfig();
  if (!config.finalProductBottomAlign) return;

  const areaBox = state.groupAreaBoxes && state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Final product bottom align skipped: product.area not found.");
    return;
  }

  const items = collectProductGroupItems(doc, row);
  const groupBox = getItemsGroupBox(items);
  if (!items.length || !groupBox) {
    log("  Final product bottom align skipped: no product layers found.");
    return;
  }

  await translateProductItems(items, areaBox.centerX - groupBox.centerX, areaBox.bottom - groupBox.bottom);
  log(`  Final product group center-bottom aligned to ${state.groupAreaNames.product || "product.area"}.`);
}

function shouldFillProductAreaHeight(row) {
  const explicit = firstTextValue(row || {}, [
    "product.fillAreaHeight",
    "product.areaHeightFill",
    "product.maxHeightToArea",
    "product.fillHeight"
  ]);
  if (explicit !== undefined) return parseVisibilityValue(explicit, true);
  return getCurrentTemplateConfig().productFillAreaHeight !== false;
}

function getProductAreaFillHeightRatio(row) {
  const ratio = readNumber(row || {}, "product.fillAreaHeightRatio", readNumber(row || {}, "product.areaHeightFillRatio", 1));
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
}

async function scaleProductItemsToHeight(items, row, areaBox) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.fixedSize) {
      log(`  Product height rule skipped for fixed-size layer: ${item.layer.name}.`);
      continue;
    }
    const ratio = getProductHeightRatio(row, i + 1, items.length);
    const targetHeight = areaBox.height * ratio;
    if (targetHeight > 0 && item.box.height > 0) {
      await scaleLayerByFactor(item.layer, targetHeight / item.box.height, { anchor: "bottomCenter" });
    }
    log(`  Product height rule: ${item.layer.name}, mode=${getProductHeightMode(row, items.length)}, category=${getProductCategory(row, i + 1)}, ratio=${ratio}, targetH=${Math.round(targetHeight)}`);
  }
  return refreshProductItems(items);
}

async function scaleProductItemsToAreaHeight(items, row, areaBox) {
  if (!shouldFillProductAreaHeight(row) || !areaBox) return refreshProductItems(items);

  const freshItems = refreshProductItems(items);
  const scalableItems = freshItems.filter((item) => !item.fixedSize && item.box && item.box.height > 0);
  if (!scalableItems.length) return freshItems;

  const maxHeight = Math.max(...scalableItems.map((item) => item.box.height));
  const groupBox = getItemsGroupBox(freshItems);
  const targetHeight = areaBox.height * getProductAreaFillHeightRatio(row);
  const heightFactor = targetHeight / maxHeight;
  const widthFactor = groupBox && groupBox.width > 0 ? areaBox.width / groupBox.width : heightFactor;
  const factor = Math.min(heightFactor, widthFactor);
  if (!Number.isFinite(factor) || factor <= 0 || Math.abs(factor - 1) <= 0.001) return freshItems;

  const anchorPoint = { x: areaBox.centerX, y: areaBox.bottom };
  for (const item of scalableItems) {
    await scaleLayerAroundPoint(item.layer, factor, anchorPoint);
  }

  const filledItems = refreshProductItems(freshItems);
  const filledBox = getItemsGroupBox(filledItems);
  log(`  Product area fill applied: factor=${factor.toFixed(3)}, anchor=areaCenterBottom, heightFactor=${heightFactor.toFixed(3)}, widthFactor=${widthFactor.toFixed(3)}, maxH=${Math.round(maxHeight)}->${Math.round(targetHeight)}, groupW=${filledBox ? Math.round(filledBox.width) : "?"}/${Math.round(areaBox.width)}, groupH=${filledBox ? Math.round(filledBox.height) : "?"}.`);
  return filledItems;
}

async function scaleProductItemsByFactor(items, factor) {
  if (!Number.isFinite(factor) || factor <= 0 || factor >= 1) return;
  for (const item of items) {
    await scaleLayerByFactor(item.layer, factor, { anchor: "bottomCenter" });
  }
}

async function scaleLayerAroundPoint(layer, factor, anchorPoint) {
  if (!layer || !anchorPoint || !Number.isFinite(factor) || factor <= 0 || factor === 1) return;

  const beforeBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!beforeBox) return;

  await scaleLayerByFactor(layer, factor);

  const afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!afterBox) return;

  const targetCenterX = anchorPoint.x + (beforeBox.centerX - anchorPoint.x) * factor;
  const targetCenterY = anchorPoint.y + (beforeBox.centerY - anchorPoint.y) * factor;
  await layer.translate(targetCenterX - afterBox.centerX, targetCenterY - afterBox.centerY);
}

async function applyProductGroupScale(doc, row) {
  const factor = readNumber(row, "product.scale", 1);
  if (!Number.isFinite(factor) || factor <= 0 || factor === 1) return;

  const areaBox = state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Product group scale skipped: product.area not found.");
    return;
  }

  const items = collectProductGroupItems(doc, row);
  if (!items.length) {
    log("  Product group scale skipped: no product layers found.");
    return;
  }

  const anchorPoint = { x: areaBox.centerX, y: areaBox.bottom };
  log(`  Product group scale layers: ${items.map((item) => item.layer.name).join(", ")}.`);
  for (const item of items) {
    await scaleLayerAroundPoint(item.layer, factor, anchorPoint);
  }

  const scaledItems = collectProductGroupItems(doc, row);
  const groupBox = getItemsGroupBox(scaledItems);
  log(`  Product group scale applied: factor=${factor}, anchor=(${Math.round(anchorPoint.x)},${Math.round(anchorPoint.y)}), groupW=${groupBox ? Math.round(groupBox.width) : "?"}, groupH=${groupBox ? Math.round(groupBox.height) : "?"}, items=${scaledItems.length}.`);
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
    await moveLayerByOffset(item.layer, dx, dy, item.layer.name);
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

  const useCategoryGaps = !touchEdges && shouldUseProductCategoryPairGaps(row);
  const gaps = normalizeProductLineGaps(touchEdges
    ? Array(Math.max(0, freshItems.length - 1)).fill(0)
    : useCategoryGaps
      ? getProductCategoryPairGaps(row, freshItems.map((item) => item.box), gap, "line")
      : getProductItemGaps(row, freshItems, "line", 0, gap));
  let left = 0;

  for (let i = 0; i < freshItems.length; i += 1) {
    const item = freshItems[i];
    const targetCenterX = left + item.box.width / 2;
    await item.layer.translate(targetCenterX - item.box.centerX, -item.box.bottom);
    left += item.box.width + (gaps[i] || 0);
  }

  freshItems = refreshProductItems(freshItems);
  freshItems = await scaleProductItemsToFitArea(freshItems, areaBox);
  freshItems = await alignProductGroupBottomCenter(freshItems, areaBox);
  freshItems = await scaleProductItemsToAreaHeight(freshItems, row, areaBox);
  const finalGroupBox = getItemsGroupBox(freshItems);

  await arrangeProductLayerStacking(freshItems, getImageGroupZOrder(row, "product"));
  log(`  Arranged product line after replace. touchEdges=${touchEdges}, gapMode=${useCategoryGaps ? "category" : "manual"}, gap=${gaps.join("|") || gap}, groupW=${finalGroupBox ? Math.round(finalGroupBox.width) : "?"}, groupH=${finalGroupBox ? Math.round(finalGroupBox.height) : "?"}, items=${freshItems.length}`);
}

async function arrangeProductOverlapItems(items, row, areaBox, layout) {
  const minWidth = Math.min(...items.map((item) => item.box.width));
  const hasManualOverlapRatio = row["product.overlapRatio"] !== undefined && row["product.overlapRatio"] !== "";
  const hasManualGap = !hasManualOverlapRatio && (row["product.gap"] !== undefined && row["product.gap"] !== "" || hasProductCategoryGap(row));
  const overlapRatio = getProductOverlapRatio(row, items);

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

  for (let i = 0; i < finalItems.length; i += 1) {
    const item = finalItems[i];
    const targetCenterX = left + item.box.width / 2;
    const yOffset = layout === "stack" ? (i - (finalItems.length - 1) / 2) * item.box.height * 0.04 : 0;
    await item.layer.translate(targetCenterX - item.box.centerX, areaBox.bottom - item.box.bottom + yOffset);
    left += item.box.width + (Array.isArray(gaps) ? gaps[i] || 0 : gap);
  }

  const filledItems = await scaleProductItemsToAreaHeight(finalItems, row, areaBox);
  const filledBox = getItemsGroupBox(filledItems);
  await arrangeProductLayerStacking(filledItems, getImageGroupZOrder(row, "product"));
  log(`  Arranged product ${layout} after replace. overlapRatio=${overlapRatio}, gap=${Array.isArray(gaps) ? gaps.map((item) => Math.round(item)).join("|") : Math.round(gap)}, totalWidth=${Math.round(finalTotalWidth)}, groupH=${filledBox ? Math.round(filledBox.height) : "?"}, items=${filledItems.length}`);
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
  const areaBox = state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Product arrange skipped: product.area not found.");
    return;
  }
  if (!shouldTouchProductEdges(row) && shouldUseProductCategoryPairGaps(row)) {
    const preparedLayers = collectProductItems(doc, count);
    let preparedItems = await scaleProductItemsToHeight(preparedLayers, row, areaBox);
    preparedItems = await scaleProductItemsToFitArea(preparedItems, areaBox);
    preparedItems = await alignProductGroupBottomCenter(preparedItems, areaBox);
    preparedItems = await scaleProductItemsToAreaHeight(preparedItems, row, areaBox);
    const preparedBox = getItemsGroupBox(preparedItems);
    await arrangeProductLayerStacking(preparedItems, getImageGroupZOrder(row, "product"));
    log(`  Product arrange skipped: using prepared category-gap ${layout} layout, groupH=${preparedBox ? Math.round(preparedBox.height) : "?"}.`);
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

async function deleteLayerBestEffort(layer, label) {
  if (!layer) return false;
  ensureModules();

  try {
    if (typeof layer.delete === "function") {
      await layer.delete();
      return true;
    }
  } catch (error) {
    log(`  ${label || layer.name} DOM delete skipped: ${formatError(error)}`);
  }

  try {
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "delete",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    return true;
  } catch (error) {
    log(`  ${label || layer.name} action delete skipped: ${formatError(error)}`);
  }

  return false;
}

function isLayerGroup(layer) {
  return !!(layer && layer.layers && layer.layers.length !== undefined);
}

function countLayerTree(layer) {
  if (!isLayerGroup(layer)) return 1;
  return 1 + Array.from(layer.layers || []).reduce((total, child) => total + countLayerTree(child), 0);
}

function isLayerDisplayedForFinalPsd(layer) {
  if (!layer || layer.visible === false) return false;
  const opacity = Number(layer.opacity);
  return !Number.isFinite(opacity) || opacity > 0;
}

async function pruneLayerCollectionForPsd(layers, ancestorsVisible) {
  const result = { hidden: 0, empty: 0 };
  const snapshot = Array.from(layers || []);

  for (const layer of snapshot) {
    if (!layer) continue;
    const effectivelyVisible = ancestorsVisible && isLayerDisplayedForFinalPsd(layer);

    if (!effectivelyVisible) {
      const removedCount = countLayerTree(layer);
      if (await deleteLayerBestEffort(layer, `PSD hidden layer ${layer.name}`)) {
        result.hidden += removedCount;
        continue;
      }
    }

    if (isLayerGroup(layer)) {
      const childResult = await pruneLayerCollectionForPsd(layer.layers, effectivelyVisible);
      result.hidden += childResult.hidden;
      result.empty += childResult.empty;

      if (effectivelyVisible && Array.from(layer.layers || []).length === 0) {
        if (await deleteLayerBestEffort(layer, `PSD empty group ${layer.name}`)) {
          result.empty += 1;
        }
      }
    }
  }

  return result;
}

function isBgLayerName(name) {
  return String(name || "").trim().toLowerCase() === "bg";
}

function isAreaGroupName(name) {
  const value = String(name || "").trim();
  return /(^|[._\s-])areas?($|[._\s-])/i.test(value) || /^AREA$/i.test(value);
}

function collectLayerGroupsByPredicate(layers, predicate, result = []) {
  Array.from(layers || []).forEach((layer) => {
    if (!isLayerGroup(layer)) return;
    if (predicate(layer)) {
      result.push(layer);
      return;
    }
    collectLayerGroupsByPredicate(layer.layers, predicate, result);
  });
  return result;
}

function getTopLevelBgLayer(doc) {
  return Array.from(doc && doc.layers || []).find((layer) => isBgLayerName(layer.name));
}

async function removeAreaGroups(doc) {
  const areaGroups = collectLayerGroupsByPredicate(doc.layers, (layer) => isAreaGroupName(layer.name));
  let removed = 0;
  for (const layer of areaGroups) {
    if (await deleteLayerBestEffort(layer, `Merge AREA group ${layer.name}`)) {
      removed += 1;
    }
  }
  if (removed) log(`  Merge cleanup: removed ${removed} AREA group(s).`);
}

async function removeBgLayers(doc) {
  const bgLayers = getAllLayers(doc.layers).filter((layer) => isBgLayerName(layer.name));
  let removed = 0;
  for (const layer of bgLayers) {
    if (await deleteLayerBestEffort(layer, `Merge duplicate BG ${layer.name}`)) {
      removed += 1;
    }
  }
  if (removed) log(`  Merge cleanup: removed ${removed} BG layer(s).`);
}

async function moveBgToBottom(doc) {
  const bgLayer = getTopLevelBgLayer(doc);
  if (!bgLayer) return;
  const topLayers = Array.from(doc.layers || []);
  const bottomLayer = topLayers[topLayers.length - 1];
  if (!bottomLayer || bottomLayer === bgLayer) return;

  try {
    await bgLayer.move(bottomLayer, photoshop.constants.ElementPlacement.PLACEAFTER);
    log("  Merge BG placed at bottom.");
  } catch (error) {
    log(`  Merge BG bottom move skipped: ${formatError(error)}`);
  }
}

async function activateDocumentBestEffort(doc) {
  if (!doc) return false;
  ensureModules();

  try {
    photoshop.app.activeDocument = doc;
    if (photoshop.app.activeDocument === doc || photoshop.app.activeDocument && photoshop.app.activeDocument.id === doc.id) {
      return true;
    }
  } catch (error) {
    log(`  Activate document DOM skipped: ${formatError(error)}`);
  }

  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "select",
          _target: [
            { _ref: "document", _id: doc.id }
          ],
          makeVisible: false,
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    return true;
  } catch (error) {
    log(`  Activate document action skipped: ${formatError(error)}`);
  }

  return false;
}

async function groupSelectedLayersBestEffort(layers, groupName, label) {
  const selectedLayers = (layers || []).filter(Boolean);
  if (!selectedLayers.length) return null;

  ensureModules();
  try {
    photoshop.app.activeDocument.activeLayers = selectedLayers;
    await photoshop.action.batchPlay(
      [
        {
          _obj: "make",
          _target: [
            { _ref: "layerSection" }
          ],
          from: {
            _ref: "layer",
            _enum: "ordinal",
            _value: "targetEnum"
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    const group = photoshop.app.activeDocument.activeLayers[0];
    if (group) {
      group.name = groupName;
      group.visible = true;
      return group;
    }
  } catch (error) {
    log(`  ${label || "Group selected layers"} skipped: ${formatError(error)}`);
  }

  return null;
}

function collectLayerGroups(layers, result = []) {
  for (const layer of layers || []) {
    if (layer && layer.layers && layer.layers.length) {
      result.push(layer);
      collectLayerGroups(layer.layers, result);
    }
  }
  return result;
}

async function collapseLayerGroupBestEffort(layer) {
  if (!layer) return false;
  ensureModules();

  const layerTarget = layer.id
    ? { _ref: "layer", _id: layer.id }
    : { _ref: "layer", _name: layer.name };

  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "set",
          _target: [
            { _ref: "property", _property: "layerSectionExpanded" },
            layerTarget
          ],
          to: false,
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    return true;
  } catch (error) {
    return false;
  }
}

async function collapseAllLayerGroupsBestEffort(doc, label = "Merge PSD") {
  if (!await activateDocumentBestEffort(doc)) return false;
  ensureModules();

  let eventCollapsed = false;
  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "collapseAllGroupsEvent",
          _isCommand: true,
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    eventCollapsed = true;
  } catch (error) {
    log(`  ${label} collapse-all event skipped: ${formatError(error)}`);
  }

  const groups = collectLayerGroups(doc.layers).reverse();
  let collapsed = 0;
  for (const group of groups) {
    if (await collapseLayerGroupBestEffort(group)) collapsed += 1;
  }
  if (collapsed) {
    log(`  ${label} groups collapsed: ${collapsed}.`);
  } else if (eventCollapsed) {
    log(`  ${label} groups collapsed by Photoshop command.`);
  }
  return eventCollapsed || collapsed > 0;
}
async function packDocumentLayersForMerge(doc, groupName, keepBg) {
  if (!await activateDocumentBestEffort(doc)) {
    log(`  Merge skipped ${groupName}: document is no longer available.`);
    return null;
  }
  await removeAreaGroups(doc);
  if (keepBg) {
    await moveBgToBottom(doc);
  } else {
    await removeBgLayers(doc);
  }

  const packLayers = Array.from(doc.layers || []).filter((layer) => {
    return layer && !(keepBg && isBgLayerName(layer.name));
  });
  if (!packLayers.length) {
    log(`  Merge skipped ${groupName}: no non-BG layers to group.`);
    return null;
  }

  const group = await groupSelectedLayersBestEffort(packLayers, groupName, `Merge pack ${groupName}`);
  if (group) log(`  Merge packed group: ${group.name}.`);
  if (keepBg) await moveBgToBottom(doc);
  return group;
}

async function duplicateLayerToDocumentBestEffort(layer, targetDoc, name) {
  if (!layer || !targetDoc) return null;
  ensureModules();
  const placement = photoshop.constants.ElementPlacement.PLACEATBEGINNING;

  try {
    const duplicated = await layer.duplicate(targetDoc, placement);
    if (duplicated) {
      duplicated.name = name;
      duplicated.visible = true;
      return duplicated;
    }
  } catch (error) {
    log(`  Merge DOM duplicate to master skipped: ${formatError(error)}`);
  }

  try {
    const duplicated = await layer.duplicate(targetDoc);
    if (duplicated) {
      duplicated.name = name;
      duplicated.visible = true;
      return duplicated;
    }
  } catch (error) {
    log(`  Merge DOM duplicate target-only skipped: ${formatError(error)}`);
  }

  try {
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "duplicate",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          to: {
            _ref: "document",
            _id: targetDoc.id
          },
          name,
          version: 5,
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    await activateDocumentBestEffort(targetDoc);
    const duplicated = targetDoc.activeLayers && targetDoc.activeLayers[0] || photoshop.app.activeDocument.activeLayers[0];
    if (duplicated) {
      duplicated.name = name;
      duplicated.visible = true;
      return duplicated;
    }
  } catch (error) {
    log(`  Merge action duplicate to master skipped: ${formatError(error)}`);
  }

  return null;
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
  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

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

async function replaceTextLayerKeepTemplateStyle(layer, value, options = {}) {
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

    const textLength = Array.from(textValue).length;
    const superscripts = Array.isArray(options.superscripts) ? options.superscripts : [];
    const preserveKindStyles = !!options.preserveKindStyles;
    const enforceTitleFonts = !!options.enforceTitleFonts;
    const styleByKind = preserveKindStyles ? getTemplateTextStyleByKind(textKey, baseStyle) : null;
    const normalStyleForRange = (from, to) => {
      if (!preserveKindStyles || !styleByKind) return baseStyle;
      const chars = Array.from(textValue).slice(from, to);
      const firstLatin = chars.find((char) => isTitleLatinStyleChar(char));
      const kind = firstLatin ? "latin" : "chinese";
      const style = styleByKind[kind] || baseStyle;
      return enforceTitleFonts ? applyTitleFontToTemplateStyle(style, kind) : style;
    };
    const pushNormalRange = (from, to) => {
      if (to <= from) return;
      if (!preserveKindStyles || !styleByKind) {
        textStyleRange.push({
          _obj: "textStyleRange",
          from,
          to,
          textStyle: baseStyle
        });
        return;
      }

      const chars = Array.from(textValue);
      let start = from;
      let currentKind = isTitleLatinStyleChar(chars[from]) ? "latin" : "chinese";
      for (let index = from + 1; index < to; index += 1) {
        const kind = isTitleLatinStyleChar(chars[index]) ? "latin" : "chinese";
        if (kind !== currentKind) {
          textStyleRange.push({
            _obj: "textStyleRange",
            from: start,
            to: index,
            textStyle: enforceTitleFonts ? applyTitleFontToTemplateStyle(styleByKind[currentKind] || baseStyle, currentKind) : styleByKind[currentKind] || baseStyle
          });
          start = index;
          currentKind = kind;
        }
      }
      textStyleRange.push({
        _obj: "textStyleRange",
        from: start,
        to,
        textStyle: enforceTitleFonts ? applyTitleFontToTemplateStyle(styleByKind[currentKind] || baseStyle, currentKind) : styleByKind[currentKind] || baseStyle
      });
    };
    const textStyleRange = [];
    let cursor = 0;

    superscripts
      .slice()
      .sort((a, b) => a.from - b.from)
      .forEach((range) => {
        const from = Math.max(0, Math.min(Number(range.from) || 0, textLength));
        const to = Math.max(from, Math.min(Number(range.to) || from, textLength));
        if (from > cursor) {
          const tightFrom = Math.max(cursor, from - 1);
          if (tightFrom > cursor) {
            pushNormalRange(cursor, tightFrom);
          }
          textStyleRange.push({
            _obj: "textStyleRange",
            from: tightFrom,
            to: from,
            textStyle: makeBeforeSuperscriptTightStyle(normalStyleForRange(tightFrom, from))
          });
        }
        if (to > from) {
          textStyleRange.push({
            _obj: "textStyleRange",
            from,
            to,
            textStyle: makeSuperscriptTextStylePreserveFont(
              enforceTitleFonts ? applyTitleFontToTemplateStyle(styleByKind && styleByKind.latin || baseStyle, "latin") : styleByKind && styleByKind.latin || baseStyle,
              normalStyleForRange(Math.max(0, from - 1), from)
            )
          });
        }
        cursor = to;
      });

    if (cursor < textLength) {
      pushNormalRange(cursor, textLength);
    }

    if (!textStyleRange.length) {
      pushNormalRange(0, textLength);
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
            textStyleRange
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  Template text replace skipped for ${layer.name}: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}

async function replaceTextLayersByName(doc, name, value, options = {}) {
  if (name === "txt.bottomText" && options.bottomText) {
    return applyBottomTextVariantRules(doc, value, options.row || {});
  }

  const layers = findLayersByName(doc, name).filter((layer) => layer && layer.textItem);
  if (!layers.length) return false;

  for (const layer of layers) {
    const textValue = isPriceLabelColumn(name, layer) ? formatPriceLabelText(value) : value;
    if (name === "txt.price" && options.priceDecimalTail) {
      await replacePriceLayerWithDecimalTailStyle(layer, textValue);
    } else if (options.subscriptSuffixes && options.subscriptSuffixes.length) {
      await replaceTextLayerWithSubscriptSuffix(layer, textValue, options.subscriptSuffixes);
    } else {
      await replaceTextLayer(layer, textValue);
    }
  }
  return true;
}

async function replaceTextLayerWithLeading(layer, value, options = {}) {
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

    const style = { ...baseStyle };
    const baseSize = getTextStylePointSize(baseStyle);
    const leadingRatio = typeof options === "number" ? options : options.leadingRatio;
    const ratio = Number.isFinite(Number(leadingRatio)) && Number(leadingRatio) > 0 ? Number(leadingRatio) : 1.15;
    const leading = baseSize * ratio;
    style.autoLeading = false;
    style.leading = makePointValue(leading);
    style.impliedLeading = makePointValue(leading);
    const textStyleRange = [
      {
        _obj: "textStyleRange",
        from: 0,
        to: Array.from(textValue).length,
        textStyle: style
      }
    ];

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
            textStyleRange
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  Text leading applied for ${layer.name}: ratio=${ratio}.`);
  } catch (error) {
    log(`  Text leading skipped for ${layer.name}: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
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

function shouldPreserveTemplateTextStyle() {
  return !!getCurrentTemplateConfig().preserveTemplateTextStyle;
}

async function replaceTextLayerMixedStyle(layer, value, styleConfig, label, options = {}) {
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
            textStyleRange: options.templateFonts
              ? buildSubtitleTemplateFontStyleRanges(textValue, textKey, baseStyle, styleConfig, options.superscripts || [])
              : Array.isArray(options.superscripts) && options.superscripts.length
                ? buildMixedTextStyleRangesWithSuperscripts(textValue, baseStyle, styleConfig, options.superscripts)
                : buildMixedTextStyleRanges(textValue, baseStyle, styleConfig)
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
    const styleByKind = getTemplateTextStyleByKind(textKey, baseStyle, { symbolsAsLatin: true });

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

function makeSubscriptTextStyle(baseStyle) {
  const style = { ...(baseStyle || {}) };
  const baseSize = getTextStylePointSize(style);
  const subSize = baseSize * 0.58;
  const subShift = -baseSize * 0.22;
  style.size = makePointValue(subSize);
  style.impliedFontSize = makePointValue(subSize);
  style.baseline = { _enum: "baseline", _value: "subScript" };
  style.baselineShift = makePointValue(subShift);
  style.baseLineShift = makePointValue(subShift);
  style.impliedBaselineShift = makePointValue(subShift);
  return style;
}

function makeSuperscriptTextStylePreserveFont(baseStyle, metricStyle = baseStyle) {
  const style = { ...(baseStyle || {}) };
  const baseSize = Math.max(getTextStylePointSize(style), getTextStylePointSize(metricStyle || style));
  const supSize = baseSize;
  const supLeading = baseSize * 1.08;
  const supShift = getTitleSuperscriptShift(baseSize);
  style.fontPostScriptName = TITLE_SUPERSCRIPT_FONT.postScriptName;
  style.fontName = TITLE_SUPERSCRIPT_FONT.fontName;
  style.size = makePointValue(supSize);
  style.impliedFontSize = makePointValue(supSize);
  style.autoLeading = false;
  style.leading = makePointValue(supLeading);
  style.impliedLeading = makePointValue(supLeading);
  style.baseline = { _enum: "baseline", _value: "superScript" };
  style.baselineShift = makePointValue(supShift);
  style.baseLineShift = makePointValue(supShift);
  style.impliedBaselineShift = makePointValue(supShift);
  style.tracking = 0;
  return style;
}

function makeBeforeSuperscriptTightStyle(baseStyle) {
  const style = { ...(baseStyle || {}) };
  return style;
}

function makePriceTailSmallTextStyle(baseStyle) {
  const style = { ...(baseStyle || {}) };
  const baseSize = getTextStylePointSize(style);
  const smallSize = baseSize * 0.7;
  style.size = makePointValue(smallSize);
  style.impliedFontSize = makePointValue(smallSize);
  return style;
}
function getPriceSmallTailSplit(chars) {
  const dotIndex = chars.indexOf(".");
  if (dotIndex >= 0 && dotIndex + 1 < chars.length) {
    return dotIndex;
  }

  const slashIndex = chars.indexOf("/");
  if (slashIndex >= 0 && slashIndex + 1 < chars.length) {
    const unit = chars.slice(slashIndex + 1).join("");
    if (/^[\u3400-\u9fff\uf900-\ufaff]+$/.test(unit)) {
      return slashIndex;
    }
  }

  return -1;
}

async function replacePriceLayerWithDecimalTailStyle(layer, value) {
  if (!layer || value === undefined || value === null) return;
  const textValue = toPhotoshopText(value);
  const chars = Array.from(textValue);
  const split = getPriceSmallTailSplit(chars);
  if (split <= 0 || split >= chars.length) {
    await replaceTextLayer(layer, value);
    return;
  }

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
    const baseRange = ranges && ranges[0];
    const baseStyle = baseRange && baseRange.textStyle;
    if (!textKey || !baseStyle) {
      await replaceTextLayer(layer, value);
      return;
    }

    const templateSmallStyle = ranges.find((range, index) => index > 0 && range && range.textStyle)?.textStyle;
    const smallStyle = templateSmallStyle || makePriceTailSmallTextStyle(baseStyle);
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
                to: split,
                textStyle: baseStyle
              },
              {
                _obj: "textStyleRange",
                from: split,
                to: chars.length,
                textStyle: smallStyle
              }
            ]
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log("  Price tail small style applied.");
  } catch (error) {
    log(`  Price tail style skipped: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}
async function replaceTextLayerWithSubscriptSuffix(layer, value, suffixes) {
  if (!layer || value === undefined || value === null) return;
  const textValue = toPhotoshopText(value);
  const suffix = (suffixes || []).find((item) => String(value).endsWith(item));
  if (!suffix) {
    await replaceTextLayer(layer, value);
    return;
  }

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
    const baseRange = textKey && textKey.textStyleRange && textKey.textStyleRange[0];
    const baseStyle = baseRange && baseRange.textStyle;
    if (!textKey || !baseStyle) {
      await replaceTextLayer(layer, value);
      return;
    }

    const total = Array.from(textValue).length;
    const suffixLength = Array.from(toPhotoshopText(suffix)).length;
    const split = Math.max(0, total - suffixLength);
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
                to: split,
                textStyle: baseStyle
              },
              {
                _obj: "textStyleRange",
                from: split,
                to: total,
                textStyle: makeSubscriptTextStyle(baseStyle)
              }
            ]
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  Bottom text subscript suffix applied: ${suffix}.`);
  } catch (error) {
    log(`  Bottom text subscript skipped: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}

async function replaceTextLayerWithSuperscriptsPreserveStyle(layer, value, superscripts) {
  if (!layer || value === undefined || value === null) return;
  if (!superscripts || !superscripts.length) {
    await replaceTextLayer(layer, value);
    return;
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

    const ranges = [];
    let cursor = 0;
    const sorted = superscripts.slice().sort((a, b) => a.from - b.from);
    sorted.forEach((range) => {
      if (range.from > cursor) {
        ranges.push({ from: cursor, to: range.from, textStyle: baseStyle });
      }
      ranges.push({ from: range.from, to: range.to, textStyle: makeSuperscriptTextStylePreserveFont(baseStyle) });
      cursor = range.to;
    });
    const total = Array.from(textValue).length;
    if (cursor < total) {
      ranges.push({ from: cursor, to: total, textStyle: baseStyle });
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
            textStyleRange: ranges.map((range) => ({
              _obj: "textStyleRange",
              from: range.from,
              to: range.to,
              textStyle: range.textStyle
            }))
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  Title superscripts applied: ${superscripts.length}.`);
  } catch (error) {
    log(`  Title superscript preserve skipped: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}

async function alignTextLayerCenterX(layer, centerX) {
  if (!layer || !Number.isFinite(centerX)) return;
  const box = await getLayerBox(layer);
  if (!box) return;
  await layer.translate(centerX - box.centerX, 0);
}

async function applyBottomTextLayerTemplateContents(layer, value) {
  await applyBottomTextTemplateStyle(layer, value, 1);
}

function getBottomTextVisualUnits(value) {
  const text = String(value || "").replace(/\s+/g, "");
  let units = 0;
  for (const char of text) {
    if (/[\u4e00-\u9fff]/.test(char)) {
      units += 1;
    } else if (/[A-Za-z0-9]/.test(char)) {
      units += 0.55;
    } else {
      units += 0.35;
    }
  }
  return units;
}

function getBottomTextShortMaxUnits(row) {
  const config = getCurrentTemplateConfig();
  const value = readOptionalNumber(row, [
    "bottomText.shortMaxUnits",
    "bottomText.shortMaxChars",
    "txt.bottomText.shortMaxUnits",
    "txt.bottomText.shortMaxChars"
  ]);
  return Number.isFinite(value) ? value : Number(config.bottomTextShortMaxUnits || 0);
}

function getBottomTextShortFitRatio(row) {
  const config = getCurrentTemplateConfig();
  const value = readOptionalNumber(row, [
    "bottomText.shortFitRatio",
    "bottomText.shortWidthRatio",
    "txt.bottomText.shortFitRatio",
    "txt.bottomText.shortWidthRatio"
  ]);
  const ratio = Number.isFinite(value) ? value : Number(config.bottomTextShortFitRatio || 1);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
}

function isPriceLabelColumn(column, layer) {
  return column === "txt.priceLabel" || String(layer && layer.name || "") === "txt.priceLabel";
}

function formatPriceLabelText(value) {
  if (value === undefined || value === null) return value;
  const text = String(value);
  if (!text || /\r|\n/.test(text)) return value;
  const chars = Array.from(text);
  return chars.length > 2 ? `${chars.slice(0, 2).join("")}\n${chars.slice(2).join("")}` : text;
}

async function restoreTextLayerOriginalAnchor(layer, originalBox, label = "text") {
  if (!layer || !originalBox) return;
  const afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!afterBox) return;
  await layer.translate(originalBox.left - afterBox.left, originalBox.top - afterBox.top);
  log(`  Text layer anchor restored: ${label}.`);
}

async function applyBottomTextTemplateStyle(layer, value, scale = 1) {
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
    const styleByKind = getTemplateTextStyleByKind(textKey, baseStyle, { symbolsAsLatin: true });
    const latinConfig = getCurrentTemplateConfig().bottomTextMixedStyle && getCurrentTemplateConfig().bottomTextMixedStyle.latin;
    if (latinConfig) {
      styleByKind.latin = {
        ...(styleByKind.latin || baseStyle),
        fontPostScriptName: latinConfig.postScriptName || (styleByKind.latin && styleByKind.latin.fontPostScriptName),
        fontName: latinConfig.fontName || (styleByKind.latin && styleByKind.latin.fontName),
        fontStyleName: latinConfig.fontStyleName || (styleByKind.latin && styleByKind.latin.fontStyleName),
        impliedFontPostScriptName: latinConfig.postScriptName || (styleByKind.latin && styleByKind.latin.impliedFontPostScriptName),
        impliedFontName: latinConfig.fontName || (styleByKind.latin && styleByKind.latin.impliedFontName),
        ...(latinConfig.color ? { color: makeRgbColor(latinConfig.color) } : {})
      };
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
            textStyleRange: buildBottomTextTemplateStyleRanges(textValue, styleByKind, scale, { symbolsAsLatin: true })
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log("  Bottom text template font styles reused from PSD layer.");
  } catch (error) {
    log(`  Bottom text template style skipped: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
}

async function applyBottomTextVariantRules(doc, value, row = {}) {
  const config = getCurrentTemplateConfig();
  const areaLayer = findLayerByName(doc, config.bottomTextAreaName || "bottomText.area");
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));
  const preserveTemplatePosition = config.preserveBottomTextTemplatePosition;
  const baseLayers = findLayersByName(doc, "txt.bottomText").filter((layer) => layer && layer.textItem);
  const shortLayers = findLayersByName(doc, "txt.bottomText.1").filter((layer) => layer && layer.textItem);
  const longLayers = findLayersByName(doc, "txt.bottomText.2").filter((layer) => layer && layer.textItem);
  const shortLayer = shortLayers.find((layer) => layer.visible !== false) || shortLayers[0] || null;
  const longLayer = longLayers.find((layer) => layer.visible !== false) || longLayers[0] || null;
  const applyVariantLayerContents = async (layer, layerValue) => {
    const originalTextBox = preserveTemplatePosition ? getBoundsBox(layer.boundsNoEffects || layer.bounds) : null;
    await applyBottomTextLayerTemplateContents(layer, layerValue);
    if (preserveTemplatePosition) {
      await restoreTextLayerOriginalAnchor(layer, originalTextBox, layer.name);
    }
  };

  if (!shortLayer && !longLayer) {
    const fallbackLayer = baseLayers.find((layer) => layer.visible !== false) || baseLayers[0] || null;
    if (!fallbackLayer) return false;
    await applyVariantLayerContents(fallbackLayer, value);
    if (preserveTemplatePosition) {
      log(`  Bottom text template position kept: ${fallbackLayer.name}.`);
    }
    return true;
  }

  [...baseLayers, ...shortLayers, ...longLayers].forEach((layer) => {
    layer.visible = false;
  });

  let selectedLayer = shortLayer || longLayer;
  if (shortLayer) {
    shortLayer.visible = true;
    await applyVariantLayerContents(shortLayer, value);
    const shortBox = await getLayerBox(shortLayer);
    const shortMaxUnits = getBottomTextShortMaxUnits(row);
    const visualUnits = getBottomTextVisualUnits(value);
    const fitRatio = getBottomTextShortFitRatio(row);
    const safeWidth = areaBox && Number.isFinite(areaBox.width) ? areaBox.width * fitRatio : null;
    const fitsWidth = !safeWidth || !shortBox || shortBox.width <= safeWidth;
    const fitsUnits = !Number.isFinite(shortMaxUnits) || shortMaxUnits <= 0 || visualUnits <= shortMaxUnits;
    const fits = fitsWidth && fitsUnits;
    if (fits || !longLayer) {
      selectedLayer = shortLayer;
      log(`  Bottom text variant selected: txt.bottomText.1${areaBox && shortBox ? `, width=${Math.round(shortBox.width)}/${Math.round(safeWidth || areaBox.width)}` : ""}, units=${visualUnits.toFixed(1)}/${shortMaxUnits || "auto"}.`);
    } else {
      shortLayer.visible = false;
      selectedLayer = longLayer;
      log(`  Bottom text variant overflow: txt.bottomText.1${areaBox && shortBox ? ` width=${Math.round(shortBox.width)}/${Math.round(safeWidth || areaBox.width)}` : ""}, units=${visualUnits.toFixed(1)}/${shortMaxUnits || "auto"}, using txt.bottomText.2.`);
    }
  }

  if (selectedLayer && selectedLayer !== shortLayer) {
    selectedLayer.visible = true;
    await applyVariantLayerContents(selectedLayer, value);
    log(`  Bottom text variant selected: ${selectedLayer.name}.`);
  }

  [...baseLayers, ...shortLayers, ...longLayers].forEach((layer) => {
    if (layer !== selectedLayer) layer.visible = false;
  });
  if (selectedLayer && preserveTemplatePosition) {
    log(`  Bottom text template position kept: ${selectedLayer.name}.`);
  }
  return !!selectedLayer;
}

async function applyBottomTextRules(layer, value) {
  await applyBottomTextLayerTemplateContents(layer, value);
  log("  Bottom text contents replaced; PSD text layer position preserved.");
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
    if (giftTarget.areaBox) {
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
    await scaleLayerByFactor(layer, getLayerScaleForInitialPlacement(row, prefix), {
      anchor: prefix === "product" ? "bottomCenter" : "center"
    });
    if (prefix === "product") {
      const heightRatioScale = getProductHeightRatioScale(row, 1);
      if (heightRatioScale !== 1) {
        await scaleLayerByFactor(layer, heightRatioScale, { anchor: "bottomCenter" });
        log(`  Product heightRatioScale applied: ${layer.name}, scale=${heightRatioScale}.`);
      }
    }
    if (prefix !== "giftRight") {
      await clampLayerToBox(layer, areaBox);
    }
    if (prefix === "product") {
      await alignLayerBottomToBox(layer, areaBox);
      let productItems = await scaleProductItemsToAreaHeight([{
        layer,
        index: 1,
        box: getBoundsBox(layer.boundsNoEffects || layer.bounds)
      }], row, areaBox);
      productItems = await alignProductGroupBottomCenter(productItems, areaBox);
      const alignedBox = getItemsGroupBox(productItems);
      log(`  Product bottom aligned: layerBottom=${alignedBox ? Math.round(alignedBox.bottom) : "?"}, areaBottom=${Math.round(areaBox.bottom)}, layerH=${alignedBox ? Math.round(alignedBox.height) : "?"}.`);
    }
    return;
  }

  if (shouldAutoFitImages()) {
    await fitLayerToBox(layer, targetBox);
  }

}

async function getAssetEntry(filename, options = {}) {
  if (!filename) return null;

  if (isDisabledImageValue(filename)) return null;
  const normalized = stripBlobPathPrefix(String(filename).replace(/\\/g, "/"));
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
  const dailyProductAsset = await getDailyProductAssetEntry(normalized);
  if (dailyProductAsset) {
    return dailyProductAsset;
  }

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

  const unifiedFallback = await getUnifiedAssetFallbackEntry(normalized, options);
  if (unifiedFallback) return unifiedFallback;

  return assetsFolder.getEntry(normalized);
}

function stripAssetExtension(path) {
  return String(path || "").replace(/\.[^.]+$/, "");
}

function getAssetExtension(path) {
  const match = String(path || "").match(/(\.[^.]+)$/);
  return match ? match[1] : ".png";
}

function removeProductAssetFolders(path) {
  return String(path || "")
    .replace(/\\/g, "/")
    .replace(/^products\//i, "")
    .replace(/^(?:angle|front)\//i, "");
}

function forceAssetToFrontPath(filename) {
  const raw = String(filename || "").trim().replace(/\\/g, "/");
  if (!raw || !/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(raw)) return raw;

  const relative = removeProductAssetFolders(raw);
  const ext = getAssetExtension(relative);
  const base = stripAssetExtension(relative).replace(/-(?:angle|front)$/i, "");
  return `front/${base}-front${ext}`;
}
function getProductSpecUnitAliasBases(base) {
  const raw = String(base || "");
  if (!raw) return [];
  const aliases = [raw];
  const push = (value) => {
    if (value && !aliases.includes(value)) aliases.push(value);
  };

  push(raw.replace(/(\d+(?:\.\d+)?)g(?=$|-)/i, "$1ml"));
  push(raw.replace(/(\d+(?:\.\d+)?)ml(?=$|-)/i, "$1g"));
  return aliases;
}

function getDailyProductAssetCandidates(normalized) {
  const config = getCurrentTemplateConfig().productAssetPriority;
  if (!config || !config.enabled) return [];

  const folder = config.folder || "babyproduct_icefrosteffect";
  const useFolderFallback = config.useFolderFallback !== false;
  const raw = String(normalized || "").replace(/\\/g, "/");
  if (!raw || !/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(raw)) return [];
  if (/^(?:front|angle|gifts?)\//i.test(raw)) return [];

  const relative = raw.startsWith(`${folder}/`) ? raw.slice(folder.length + 1) : removeProductAssetFolders(raw);
  const ext = getAssetExtension(relative);
  const base = stripAssetExtension(relative);
  const baseNoView = base.replace(/-(?:angle|front)$/i, "");
  const bases = Array.from(new Set([base, baseNoView].filter(Boolean).flatMap(getProductSpecUnitAliasBases)));
  const candidates = [];
  const push = (value) => {
    if (value && !candidates.includes(value)) candidates.push(value);
  };

  const views = Array.isArray(config.views) ? config.views.map((view) => String(view || "").trim().toLowerCase()).filter(Boolean) : [];
  bases.forEach((item) => {
    views.forEach((view) => {
      if (view === "angle") {
        push(`angle/${item}-angle${ext}`);
        push(`products/angle/${item}-angle${ext}`);
      }
      if (view === "front") {
        push(`front/${item}-front${ext}`);
        push(`products/front/${item}-front${ext}`);
      }
    });
  });

  if (useFolderFallback) {
    bases.forEach((item) => {
      const countMatch = item.match(/^(.*?)-(\d+)x$/i);
      if (countMatch) {
        push(`${folder}/${item}-stack-ice${ext}`);
        push(`${folder}/${item}-stack-water${ext}`);
        push(`${folder}/${item}${ext}`);
        push(`${folder}/${item}-ice${ext}`);
        push(`${folder}/${item}-water${ext}`);
        return;
      }

      push(`${folder}/${item}-ice${ext}`);
      push(`${folder}/${item}-water${ext}`);
      push(`${folder}/${item}${ext}`);
    });
  }

  push(raw);
  return candidates;
}
async function getDailyProductAssetEntry(normalized) {
  const candidates = getDailyProductAssetCandidates(normalized);
  for (const candidate of candidates) {
    try {
      const entry = await assetsFolder.getEntry(candidate);
      if (candidate !== normalized) {
        log(`  JDDaily product asset fallback: ${normalized} -> ${candidate}`);
      }
      return entry;
    } catch (error) {
      // Try the next priority candidate.
    }
  }
  return null;
}

function getUnifiedAssetFallbackCandidates(normalized, options = {}) {
  const raw = String(normalized || "").replace(/\\/g, "/");
  if (!/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(raw)) return [];

  const config = getCurrentTemplateConfig().productAssetPriority || {};
  const folder = config.folder || "babyproduct_icefrosteffect";
  const useFolderFallback = config.useFolderFallback !== false;
  const relative = removeProductAssetFolders(raw);
  const ext = getAssetExtension(relative);
  const base = stripAssetExtension(relative).replace(/-(?:angle|front)$/i, "");
  const bases = getProductSpecUnitAliasBases(base);
  const folderCandidates = (item) => useFolderFallback ? [
    `${folder}/${item}-ice${ext}`,
    `${folder}/${item}-water${ext}`,
    `${folder}/${item}${ext}`
  ] : [];

  if (!options.productFallbackPriority) {
    if (!/^(?:front|angle)\//i.test(raw)) return [];
    return Array.from(new Set(bases.flatMap((item) => [
      raw,
      `products/angle/${item}-angle${ext}`,
      `products/front/${item}-front${ext}`,
      ...folderCandidates(item),
      `angle/${item}-angle${ext}`,
      `front/${item}-front${ext}`,
      `products/${item}${ext}`,
      `${item}${ext}`
    ])));
  }

  const candidates = bases.flatMap((item) => [
    ...folderCandidates(item),
    `angle/${item}-angle${ext}`,
    `front/${item}-front${ext}`,
    `products/angle/${item}-angle${ext}`,
    `products/front/${item}-front${ext}`,
    `products/${item}${ext}`,
    raw,
    `${item}${ext}`
  ]);
  return Array.from(new Set(candidates));
}
async function getUnifiedAssetFallbackEntry(normalized, options = {}) {
  const candidates = getUnifiedAssetFallbackCandidates(normalized, options);
  for (const candidate of candidates) {
    try {
      const entry = await assetsFolder.getEntry(candidate);
      if (candidate !== normalized) {
        log(`  Unified asset fallback: ${normalized} -> ${candidate}`);
      }
      return entry;
    } catch (error) {
      // Try the next unified asset location.
    }
  }
  return null;
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
    .split(/[,+|\/;\s\uFF1B\u3001]+/)
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
  const selectedFormat = uiFormat && uiFormat !== "jpg" ? uiFormat : rowFormat || uiFormat || "jpg";
  return normalizeExportFormats(selectedFormat);
}

function splitImageList(value) {
  return String(value || "")
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter((item) => item && !isDisabledImageValue(item))
    .flatMap(expandRepeatedImageToken);
}

function isDisabledImageValue(value) {
  const raw = String(value || "").trim().toLowerCase();
  return ["0", "1", "false", "no", "n", "off", "hide", "hidden", "none", "null", "undefined", "否", "关", "关闭", "隐藏", "无"].includes(raw);
}

function stripBlobPathPrefix(filename) {
  return String(filename || "")
    .replace(/^blob:\/+blob-\d+\//i, "")
    .replace(/^blob:(?:\/\/)?blob-\d+\//i, "")
    .replace(/^blob:\/+/i, "");
}

function expandRepeatedImageToken(token) {
  const normalized = token
    .replace(/\u00d7/g, "x")
    .replace(/\uff0a/g, "*")
    .replace(/\uff38/g, "x")
    .replace(/\uff58/g, "x");
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
  "product.name",
  "product.name.cn",
  "productName.cn",
  "product.cn",
  "productName",
  "product.names",
  "product.names.cn",
  "productSet.cn",
  "\u4ea7\u54c1\u540d\u79f0",
  "\u4e2d\u6587\u4ea7\u54c1\u540d\u79f0",
  "\u4ea7\u54c1\u4e2d\u6587\u540d",
  "\u4ea7\u54c1\u7ec4\u5408"
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
    .split(/[|+;\uFF1B\u3001\n\r]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}


function expandRepeatedProductNameToken(token) {
  const normalized = token
    .replace(/\u00d7/g, "x")
    .replace(/\uff0a/g, "*")
    .replace(/\uff38/g, "x")
    .replace(/\uff58/g, "x");

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

  if (state.productNameMap) {
    const normalized = normalizeProductNameKey(raw);
    const compact = compactSpecHyphenKey(normalized);
    const matchKey = compactProductNameMatchKey(normalized);
    const mapped = state.productNameMap.get(normalized)
      || state.productNameMap.get(compact)
      || state.productNameMap.get(matchKey);
    if (mapped) return mapped;
    if (options.allowRows !== false) {
      const rowMapped = resolveProductNameByRows(raw);
      if (rowMapped) return rowMapped;
    }
  }

  const explicitDaily = resolveExplicitJdDailyProductName(raw);
  if (explicitDaily) return explicitDaily;
  return resolveJdDailyProductNameFallback(raw);
}

async function resolveProductNameTokenToImages(token) {
  const directImage = resolveProductNameToImage(token);
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
function resolveExplicitJdDailyProductName(name) {
  return "";
}

function resolveJdDailyProductNameFallback(name) {
  return "";
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
    const fileName = String(row.file || row.filename || row["\u6587\u4ef6"] || "").trim();
    if (!fileName) return;

    const imagePath = fileName.includes("/") || fileName.includes("\\") ? fileName : `products/${fileName}`;
    const fullName = row.standard_cn || row["\u6807\u51c6\u4e2d\u6587\u540d"] || row["\u4e2d\u6587\u6807\u51c6\u540d"] || "";
    const age = row.age_cn || row["\u5e74\u9f84\u6bb5"] || "";
    const product = row.product_cn || row["\u4ea7\u54c1\u540d"] || "";
    const category = row.category_cn || row["\u54c1\u7c7b"] || "";
    const spec = row.spec || row["\u89c4\u683c"] || "";
    const productEn = row.product_en || row["product_en"] || "";
    const fullParts = String(fullName || "").split("-").map((part) => part.trim()).filter(Boolean);
    const standardProduct = fullParts.length >= 2 ? fullParts[1] : "";

    if (queryAge && age && !getAgeCnAliases(age).some((alias) => normalizeProductNameKey(alias) === normalizeProductNameKey(queryAge))) return;
    if (queryCategory && category && normalizeProductNameKey(category) !== normalizeProductNameKey(queryCategory)) return;
    if (querySpec && normalizeProductNameKey(spec) !== normalizeProductNameKey(querySpec)) return;
    if (/body-lotion/i.test(imagePath) && normalized.includes("\u5b89\u5fc3\u971c")) return;

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

async function expandProductNamesToSet(row) {
  const expanded = { ...row };
  if (hasValue(expanded, "img.productSet")) return expanded;

  const source = getProductNameField(expanded);
  if (!source.value) return expanded;


  const images = [];
  const missing = [];
  const tokens = splitProductNameList(source.value);
  if (!tokens.length) return expanded;

  for (const token of tokens) {
    const repeatedNames = expandRepeatedProductNameToken(token);
    const hasExplicitQuantity = repeatedNames.length > 1 || repeatedNames[0] !== token;

    if (!hasExplicitQuantity) {
      const directImage = resolveProductNameToImage(token);
      if (directImage) {
        images.push(directImage);
        continue;
      }
    }

    repeatedNames.forEach((name) => {
      const image = resolveProductNameToImage(name);
      if (image) {
        images.push(image);
      } else {
        missing.push(name);
      }
    });
  }

  if (images.length) {
    expanded["img.productSet"] = images.join(" | ");
    images.forEach((image, index) => {
      expanded[`img.product.${index + 1}`] = image;
    });
    const usesSingleComboImage = images.length === 1 && /(?:-\d+x|--stack|-stack-ice|-stack-water)\./i.test(images[0]);
    if (usesSingleComboImage) {
      expanded["product.count"] = "1";
      if (/-stack-(?:ice|water)\./i.test(images[0]) || /--stack-/.test(images[0])) {
        expanded["product.heightRatio"] = "1";
      }
    } else if (!expanded["product.count"]) {
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

function getGiftLeftDescriptionItemCount(row) {
  const description = cleanGiftLeftDescriptionSourceText(row && row["txt.giftLeftDesc"]);
  if (!description) return 0;

  const tokens = splitProductNameList(description);
  if (!tokens.length) return 0;

  const count = tokens.reduce((total, token) => {
    const match = String(token || "").replace(/\s+/g, "").match(/(?:\*|x)\s*(\d+)$/i);
    return total + (match ? Number(match[1]) || 1 : 1);
  }, 0);
  return Math.max(1, Math.min(count, 6));
}

function getGiftCount(row, prefix) {
  const explicitCount = parseCount(row[`${prefix}.count`]);
  if (explicitCount) {
    return explicitCount;
  }

  if (prefix === "giftLeft") {
    const descriptionCount = getGiftLeftDescriptionItemCount(row);
    if (descriptionCount) return descriptionCount;
  }

  const text = [
    row[`txt.${prefix}Title`],
    row[`txt.${prefix}Desc`],
    row[`txt.${prefix}`]
  ].filter(Boolean).join(" ");

  const normalized = text
    .replace(/\u00d7/g, "x")
    .replace(/\uff0a/g, "*")
    .replace(/\uff38/g, "x")
    .replace(/\uff58/g, "x");
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

function expandDailyGiftMiddleImage(row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (!switchConfig.enabled) return row;

  const expanded = { ...row };
  const middleImage = expanded["img.giftMiddle"];
  const middleType = getDailyGiftMiddleType(expanded);
  const middleTypes = Object.keys(switchConfig.middleGiftLayers || {});
  const middleImageIsSelector = middleTypes.some((type) => {
    return String(middleImage || "").trim().toLowerCase() === String(type).toLowerCase();
  });

  if (middleImageIsSelector) {
    if (!expanded["daily.giftMiddleType"]) {
      expanded["daily.giftMiddleType"] = middleType;
    }
    return expanded;
  }

  if (middleImage && middleType && !expanded[`img.giftMiddle.${middleType}`]) {
    expanded[`img.giftMiddle.${middleType}`] = middleImage;
  }
  return expanded;
}
function cleanGiftLeftDescriptionSourceText(value) {
  return String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\uFF08[^\uFF09]*\uFF09/g, " ")
    .replace(/\u3010[^\u3011]*\u3011/g, " ")
    .trim();
}

function hasGiftLeftImageSource(row) {
  return hasValue(row, "img.giftLeft") ||
    hasValue(row, "img.giftLeftSet") ||
    hasValue(row, "img.giftLeft.1");
}

function expandGiftLeftFromDescription(row) {
  const config = getCurrentTemplateConfig().giftLeftAssetSource;
  if (!config || config.enabled === false || hasGiftLeftImageSource(row)) return row;

  const sourceColumn = config.sourceColumn || "txt.giftLeftDesc";
  if (!hasValue(row, sourceColumn)) return row;

  const tokens = splitProductNameList(cleanGiftLeftDescriptionSourceText(row[sourceColumn]));
  if (!tokens.length) return row;

  const images = [];
  const missing = [];
  tokens.forEach((token) => {
    const repeatedNames = expandRepeatedProductNameToken(token);
    const hasExplicitCount = repeatedNames.length > 1 || repeatedNames[0] !== token;
    if (!hasExplicitCount) {
      const directImage = resolveProductNameToImage(token);
      if (directImage) {
        images.push(directImage);
        return;
      }
    }
    repeatedNames.forEach((name) => {
      const image = resolveProductNameToImage(name);
      if (image) images.push(image);
      else missing.push(name);
    });
  });

  let resolvedImages = images.filter(Boolean);
  if (config.forceFront !== false) {
    resolvedImages = resolvedImages.map(forceAssetToFrontPath);
  }
  if (!resolvedImages.length) {
    if (missing.length) log(`  GiftLeft desc CN not found: ${missing.join(" | ")}`);
    return row;
  }

  const expanded = { ...row };
  if (resolvedImages.length > 1) {
    expanded["img.giftLeftSet"] = resolvedImages.join(" | ");
    resolvedImages.forEach((image, index) => {
      expanded[`img.giftLeft.${index + 1}`] = image;
    });
  } else {
    expanded["img.giftLeft"] = resolvedImages[0];
  }
  if (!hasValue(expanded, "giftLeft.count")) expanded["giftLeft.count"] = String(resolvedImages.length);
  log(`  GiftLeft desc mapped from ${sourceColumn}: ${resolvedImages.join(" | ")}`);
  if (missing.length) log(`  GiftLeft desc CN not found: ${missing.join(" | ")}`);
  return expanded;
}

function formatGiftLeftDescText(row) {
  const config = getCurrentTemplateConfig().giftLeftDescPlusWrap;
  if (!config || config.enabled === false || !hasValue(row, "txt.giftLeftDesc")) return row;

  const value = String(row["txt.giftLeftDesc"] || "").trim();
  if (!value || value.includes("\n") || getDisplayLength(value) <= Number(config.minDisplayLength || 10)) return row;
  if (!value.includes("+")) return row;

  const parts = value.split("+").map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return row;

  const expanded = { ...row };
  expanded["txt.giftLeftDesc"] = parts.join("+\n");
  log("  GiftLeft desc wrapped by '+'.");
  return expanded;
}

function applyProductImageView(row) {
  return row;
}
async function expandRow(row) {
  let expanded = normalizeImageAliases(row);
  expanded = expandDailyGiftMiddleImage(expanded);
  expanded = await expandProductNamesToSet(expanded);
  expanded = expandGiftLeftFromDescription(expanded);
  expanded = formatGiftLeftDescText(expanded);
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

  if (getCurrentTemplateConfig().id !== "jddaily750" && expanded["txt.title"] && hasExplicitWrap && Number.isFinite(wrapAt) && getDisplayLength(expanded["txt.title"]) > wrapAt) {
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

  const productNote = expanded["txt.productNote"] || expanded["txt.note"] || expanded["txt.description"];
  if (productNote !== undefined && productNote !== null) {
    expanded["txt.productNote"] = productNote;
  }

  if (hasValue(expanded, "txt.giftLeftprice")) {
    const price = String(expanded["txt.giftLeftprice"]).trim();
    expanded["txt.giftLeftprice"] = /^\u00a5/.test(price) ? price : `\u00a5${price}`;
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

function getLayersByNames(doc, names) {
  const seen = new Set();
  const layers = [];
  (names || []).forEach((name) => {
    findLayersByName(doc, name).forEach((layer) => {
      const key = layer.id || layer;
      if (seen.has(key)) return;
      seen.add(key);
      layers.push(layer);
    });
  });
  return layers;
}

function findPreferredLayerByNames(doc, names) {
  for (const name of names || []) {
    const layer = findLayersByName(doc, name)[0];
    if (layer) return layer;
  }
  return null;
}

function getTitleLayerVariantInfo(row, text) {
  const explicit = String(firstTextValue(row || {}, ["txt.titleVariant", "title.variant", "titleVariant"]) || "").trim();
  if (/^(2|small|compact|long)$/i.test(explicit)) return { variant: 2, reason: "explicit" };
  if (/^(1|large|normal|big)$/i.test(explicit)) return { variant: 1, reason: "explicit" };

  const raw = String(text || "");
  const lineCount = raw.split(/\r\n|\r|\n/).length;
  if (lineCount > 1) return { variant: 2, reason: `lines=${lineCount}` };

  const minUnits = readNumber(row || {}, "title.variant2MinUnits", readNumber(row || {}, "txt.titleVariant2MinUnits", 24));
  const units = getDisplayLength(raw.replace(/\s+/g, ""));
  if (Number.isFinite(minUnits) && minUnits > 0 && units >= minUnits) {
    return { variant: 2, reason: `units=${units.toFixed(1)}/${minUnits}` };
  }
  return { variant: 1, reason: `units=${units.toFixed(1)}/${minUnits || "auto"}` };
}

function findTitleLayerForRow(doc, row, text, options = {}) {
  const titleLayerNames = ["txt.title.1", "txt.title.2", "txt.title", "txt.title.bold"];
  const titleLayers = getLayersByNames(doc, titleLayerNames);
  const variantInfo = getTitleLayerVariantInfo(row, text);
  const preferredNames = options.useBoldTitle
    ? ["txt.title.bold", "txt.title", "txt.title.1", "txt.title.2"]
    : variantInfo.variant === 2
      ? ["txt.title.2", "txt.title", "txt.title.1", "txt.title.bold"]
      : ["txt.title.1", "txt.title", "txt.title.2", "txt.title.bold"];
  const selectedLayer = findPreferredLayerByNames(doc, preferredNames);

  titleLayers.forEach((layer) => {
    if (layer && layer !== selectedLayer) layer.visible = false;
  });
  if (selectedLayer) {
    selectedLayer.visible = true;
    log(`  Title layer selected: ${selectedLayer.name}, hiddenAlternates=${Math.max(titleLayers.length - 1, 0)}, ${options.useBoldTitle ? "bold" : variantInfo.reason}.`);
  }
  return selectedLayer;
}

function hasSubtitleTextForTitleNote(row) {
  return ["txt.subtitle", "txt.subtitle.1", "txt.subtitle.2", "subtitle"].some((key) => hasValue(row || {}, key));
}

function hasExplicitEmptySubtitle(row) {
  const keys = ["txt.subtitle", "txt.subtitle.1", "txt.subtitle.2", "subtitle"];
  return keys.some((key) => Object.prototype.hasOwnProperty.call(row || {}, key)) &&
    !keys.some((key) => hasValue(row || {}, key));
}

async function applyTitleAndProductNote(doc, row) {
  const handled = {};
  const titleStyle = String(row["txt.titleStyle"] || row["title.style"] || row["titleStyle"] || "").trim().toLowerCase();
  const boldTitleText = firstTextValue(row, ["txt.title.bold"]);
  const titleText = /^(bold|b|加粗|粗体|special)$/i.test(titleStyle) && boldTitleText !== undefined
    ? boldTitleText
    : firstTextValue(row, ["txt.title", "title"]);
  const useBoldTitle = boldTitleText !== undefined && (titleText === boldTitleText || /^(bold|b|加粗|粗体|special)$/i.test(titleStyle));
  const titlePreviewText = titleText !== undefined && titleText !== null ? parseTitleSuperscriptMarkup(titleText).text : "";
  const activeTitleLayer = titleText !== undefined && titleText !== null
    ? findTitleLayerForRow(doc, row, titlePreviewText, { useBoldTitle })
    : null;
  let titleLineCount = 1;

  if (activeTitleLayer && titleText !== undefined && titleText !== null) {
    activeTitleLayer.visible = true;
    const parsedTitle = parseTitleSuperscriptMarkup(titleText);
    await replaceTextLayerKeepTemplateStyle(activeTitleLayer, parsedTitle.text, {
      superscripts: parsedTitle.superscripts,
      preserveKindStyles: true,
      enforceTitleFonts: true
    });
    titleLineCount = String(parsedTitle.text).split(/\r\n|\r|\n/).length;
    handled["txt.title"] = true;
    handled["txt.title.1"] = true;
    handled["txt.title.2"] = true;
    handled["txt.title.bold"] = true;
    log(`  Title text replaced on ${activeTitleLayer.name}; template position/font/size preserved, lines=${titleLineCount}.`);
  }

  const subtitleVariantIndex = titleLineCount > 1 ? 2 : 1;
  const subtitleLayer1 = findLayerByName(doc, "txt.subtitle.1");
  const subtitleLayer2 = findLayerByName(doc, "txt.subtitle.2");
  const subtitleBaseLayer = findLayerByName(doc, "txt.subtitle");
  const subtitleLayer = subtitleVariantIndex === 2 && subtitleLayer2
    ? subtitleLayer2
    : subtitleLayer1 || subtitleBaseLayer || subtitleLayer2;
  const subtitleText = firstTextValue(row, [
    `txt.subtitle.${subtitleVariantIndex}`,
    "txt.subtitle"
  ]);
  const subtitleLayers = [subtitleLayer1, subtitleLayer2, subtitleBaseLayer];
  subtitleLayers.forEach((layer) => {
    if (layer && layer !== subtitleLayer) layer.visible = false;
  });
  let subtitleLineCount = 0;
  if (subtitleLayer && subtitleText !== undefined && subtitleText !== null && String(subtitleText).trim() !== "") {
    subtitleLayer.visible = true;
    const parsedSubtitle = parseTitleSuperscriptMarkup(subtitleText);
    await replaceTextLayerMixedStyle(subtitleLayer, parsedSubtitle.text, SUBTITLE_FONT_RULE, "Subtitle", {
      superscripts: parsedSubtitle.superscripts,
      templateFonts: true
    });
    subtitleLineCount = Math.max(1, String(parsedSubtitle.text).split(/\r\n|\r|\n/).length);
    handled["txt.subtitle"] = true;
    handled["txt.subtitle.1"] = true;
    handled["txt.subtitle.2"] = true;
    log(`  Subtitle variant used: ${subtitleLayer.name}, titleLines=${titleLineCount}, subtitleLines=${subtitleLineCount}; mixed font applied, superscripts=${parsedSubtitle.superscripts.length}.`);
  } else if (hasExplicitEmptySubtitle(row) || subtitleLayer) {
    subtitleLayers.forEach((layer) => {
      if (layer) layer.visible = false;
    });
    handled["txt.subtitle"] = true;
    handled["txt.subtitle.1"] = true;
    handled["txt.subtitle.2"] = true;
  }

  const titleNoteVariantIndex = titleLineCount >= 2 ? 3 : hasSubtitleTextForTitleNote(row) ? 2 : 1;
  const titleNoteText = firstTextValue(row, [
    `txt.titleNote.${titleNoteVariantIndex}`,
    "txt.titleNote"
  ]);
  const titleNoteLayerNames = ["txt.titleNote.1", "txt.titleNote.2", "txt.titleNote.3", "txt.titleNote"];
  const titleNoteLayers = getLayersByNames(doc, titleNoteLayerNames);
  const titleNotePreferredNames = titleNoteVariantIndex >= 3
    ? ["txt.titleNote.3", "txt.titleNote.2", "txt.titleNote", "txt.titleNote.1"]
    : titleNoteVariantIndex > 1
      ? ["txt.titleNote.2", "txt.titleNote", "txt.titleNote.1", "txt.titleNote.3"]
      : ["txt.titleNote.1", "txt.titleNote", "txt.titleNote.2", "txt.titleNote.3"];
  const titleNoteLayer = findPreferredLayerByNames(doc, titleNotePreferredNames);

  titleNoteLayers.forEach((layer) => {
    if (layer && layer !== titleNoteLayer) layer.visible = false;
  });

  if (titleNoteLayer && titleNoteText !== undefined && titleNoteText !== null) {
    titleNoteLayer.visible = true;
    await replaceTextLayerKeepTemplateStyle(titleNoteLayer, titleNoteText);
    handled["txt.titleNote"] = true;
    handled["txt.titleNote.1"] = true;
    handled["txt.titleNote.2"] = true;
    handled["txt.titleNote.3"] = true;
    log(`  Title note variant used: ${titleNoteLayer.name}, hiddenAlternates=${Math.max(titleNoteLayers.length - 1, 0)}, titleLines=${titleLineCount}, subtitle=${hasSubtitleTextForTitleNote(row) ? "yes" : "no"}.`);
  } else {
    titleNoteLayers.forEach((layer) => {
      if (layer) layer.visible = false;
    });
    handled["txt.titleNote"] = true;
    handled["txt.titleNote.1"] = true;
    handled["txt.titleNote.2"] = true;
    handled["txt.titleNote.3"] = true;
  }

  const noteText = firstTextValue(row, ["txt.productNote", "txt.note", "txt.description"]);
  const productNoteLayer1 = findLayerByName(doc, "txt.productNote.1");
  const productNoteLayer2 = findLayerByName(doc, "txt.productNote.2");
  const productNoteLayer3 = findLayerByName(doc, "txt.productNote.3");
  const productNoteLayer = titleLineCount >= 3 && productNoteLayer3
    ? productNoteLayer3
    : titleLineCount > 1 && productNoteLayer2
      ? productNoteLayer2
      : productNoteLayer1 || findLayerByName(doc, "txt.productNote");
  const forceSubtitleLayer = getCurrentTemplateConfig().productNameToSubtitle && hasValue(row, "txt.subtitle");
  const fallbackNoteLayer = forceSubtitleLayer
    ? subtitleLayer || productNoteLayer
    : productNoteLayer;

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
    if (shouldPreserveTemplateTextStyle()) {
      await replaceTextLayer(fallbackNoteLayer, finalNoteText);
    } else if (pddSubtitle) {
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
  } else {
    [productNoteLayer1, productNoteLayer2, productNoteLayer3, findLayerByName(doc, "txt.productNote")].forEach((layer) => {
      if (layer) layer.visible = false;
    });
  }

  return handled;
}

function isGiftControlColumn(column) {
  return PRODUCT_NAME_COLUMNS.includes(column) ||
    /^(giftLeft|giftRight|product)\.(count|layout|zOrder|x|y|w|h|width|height|itemW|itemWidth|itemH|itemHeight|spacing|gap|bottom|heightRatio|heightRatioscale|heightRatioScale|scale|fillAreaHeight|fillHeight|areaHeightFill|maxHeightToArea|slotFill|slotSpan|category|categoryGap|categoryGapMode|overlapRatio|edgePaddingRatio|sourceMode|copyMode|ampouleGroups|groupCount|ampouleGap|ampouleRowGap|ampouleGroupHeight|ampouleHeightRatio|align|alignX|areaAlign|areaAlignX|imageAlign|imageAlignX|xAlign)(\.\d+)?$/.test(column) ||
    /^product\.gap\.\d+$/.test(column) ||
    /^product\.gap\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(column) ||
    /^giftLeft\.(tube100HeightRatio|tube25HeightRatio|minHeightRatio)$/.test(column) ||
    /^product\.([a-zA-Z0-9]+HeightRatio|heightMode|view|imageView|assetView|viewMode|viewNote|imageNote|assetNote|note|touchEdges|touch|fillAreaHeight|fillHeight|areaHeightFill|maxHeightToArea|ampouleSetSlotSpan|ampouleSetSlots)$/.test(column) ||
    /^productShadow\.(top|opacity)$/.test(column) ||
    /^(mechanism|daily\.(mechanism|giftMiddleType|giftRightType|left298))$/.test(column) ||
    /^(?:daily\.icon|pdd\.icon|icon)\.[a-zA-Z0-9.+_-]+$/.test(column) ||
    /^person\.(offsetX|offsetY)$/.test(column) ||
    column === "titleStyle" ||
    /^(title|txt)\.(wrapAt|titleWrapAt|titleMaxWidth|maxWidth|productNoteGap|productNoteOffsetY|titleLineHeight|lineHeight|titleLineHeightRatio|lineHeightRatio|titleTracking|tracking|style|titleStyle|bottomTextScale|bottomTextCenterX|bottomTextOverflowScale)$/.test(column) ||
    /^bottomText\.(maxWidth|centerX|overflowScale|area|shortMaxUnits|shortMaxChars|shortFitRatio|shortWidthRatio)$/.test(column) ||
    /^subtitle\.(rectanglePadding[XY]|rectangleMaxWidth|rectangleRadius|maxTextWidth|fontSize)$/.test(column) ||
    /^productNote\.(gap|offsetY)$/.test(column) ||
    /^(note|remark|remarks|备注|产品视觉)$/.test(column);
}

async function pruneNonDisplayedLayersForPsd(doc, label = "PSD export") {
  if (!doc || !doc.layers) return;
  if (!await activateDocumentBestEffort(doc)) {
    log(`  ${label} cleanup skipped: document is no longer available.`);
    return;
  }

  const removed = await pruneLayerCollectionForPsd(doc.layers, true);
  const total = removed.hidden + removed.empty;
  if (total) {
    log(`  ${label} cleanup: removed ${removed.hidden} hidden/non-displayed layer(s), ${removed.empty} empty group(s).`);
  } else {
    log(`  ${label} cleanup: no hidden/non-displayed layers found.`);
  }
}
async function restoreNonDisplayedLayersForPsd(doc, label = "PSD export") {
  await pruneNonDisplayedLayersForPsd(doc, label);
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
  await pruneNonDisplayedLayersForPsd(doc, `PSD export ${outputName}`);

  if (doc.saveAs && doc.saveAs.psd) {
    await doc.saveAs.psd(psdFile, { maximizeCompatibility: true }, true);
    state.exportedPsdEntries.push({ file: psdFile, name: outputName, row, index });
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

  state.exportedPsdEntries.push({ file: psdFile, name: outputName, row, index });
  return outputName;
}

function makeTimestampForFileName() {
  const now = new Date();
  const pad2 = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad2(now.getMonth() + 1),
    pad2(now.getDate()),
    "_",
    pad2(now.getHours()),
    pad2(now.getMinutes()),
    pad2(now.getSeconds())
  ].join("");
}

async function savePsdDocumentAsFile(doc, file, options = {}) {
  await pruneNonDisplayedLayersForPsd(doc, file && file.name ? `PSD save ${file.name}` : "PSD save");
  if (options.collapseGroups) {
    await collapseAllLayerGroupsBestEffort(doc, "Merge PSD");
  }

  if (doc.saveAs && doc.saveAs.psd) {
    await doc.saveAs.psd(file, { maximizeCompatibility: true }, true);
    return;
  }

  const token = fs.createSessionToken(file);
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
}

async function mergeExportedPsdsAsGroups(entries) {
  const psdEntries = (entries || [])
    .filter((entry) => entry && entry.file && /\.psd$/i.test(entry.name || entry.file.name || ""))
    .sort((a, b) => (a.index || 0) - (b.index || 0));

  if (!psdEntries.length) {
    log("Merge PSD skipped: no PSD files were exported in this run.");
    return "";
  }

  log(`Merge PSD start: ${psdEntries.length} file(s).`);
  const first = psdEntries[0];
  const master = await photoshop.app.open(first.file);
  const firstGroupName = sanitizeFileBaseName(String(first.name || first.file.name || "1").replace(/\.psd$/i, ""), `jddaily_${first.index || 1}`);
  const firstGroup = await packDocumentLayersForMerge(master, firstGroupName, true);
  if (!firstGroup) {
    throw new Error("Merge master PSD could not be packed.");
  }

  let imported = 1;
  for (let i = 1; i < psdEntries.length; i += 1) {
    const entry = psdEntries[i];
    const groupName = sanitizeFileBaseName(String(entry.name || entry.file.name || `jddaily_${i + 1}`).replace(/\.psd$/i, ""), `jddaily_${entry.index || i + 1}`);
    let srcDoc = null;
    try {
      log(`  Merge opening: ${entry.name || entry.file.name}`);
      srcDoc = await photoshop.app.open(entry.file);
      const srcGroup = await packDocumentLayersForMerge(srcDoc, groupName, false);
      if (!srcGroup) continue;
      const duplicated = await duplicateLayerToDocumentBestEffort(srcGroup, master, groupName);
      if (!duplicated) {
        log(`  Merge import skipped: ${groupName}.`);
        continue;
      }
      imported += 1;
      log(`  Merge imported group: ${groupName}.`);
    } finally {
      if (srcDoc) {
        await closeDocWithoutSaving(srcDoc);
      }
      if (!await activateDocumentBestEffort(master)) {
        throw new Error("Merge master document was closed or is no longer available.");
      }
    }
  }

  if (!await activateDocumentBestEffort(master)) {
    throw new Error("Merge master document was closed or is no longer available before save.");
  }
  await moveBgToBottom(master);
  const outputName = `merged_psd_groups_${makeTimestampForFileName()}.psd`;
  const mergedFile = await outputFolder.createFile(outputName, { overwrite: true });
  await savePsdDocumentAsFile(master, mergedFile, { collapseGroups: true });
  log(`Merge PSD saved: ${outputName}, groups=${imported}.`);
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
  if (!doc) return;

  let docName = "";
  try {
    docName = doc.name || "";
  } catch (error) {
    docName = "";
  }

  if (!await activateDocumentBestEffort(doc)) {
    log(`  Close skipped: document is no longer available${docName ? ` (${docName})` : ""}.`);
    return;
  }

  if (doc.closeWithoutSaving) {
    await doc.closeWithoutSaving();
    return;
  }
  ensureModules();
  await doc.close(photoshop.constants.SaveOptions.DONOTSAVECHANGES);
}

async function applyRowToDocument(doc, row) {
  setActiveRowTemplateProfile(row);
  const expandedRow = await expandRow(row);
  state.currentRow = expandedRow;

  const productCount = getGiftCount(expandedRow, "product");
  const productImages = Array.from({ length: Math.max(productCount, 1) }, (_, index) => {
    return expandedRow[`img.product.${index + 1}`] || expandedRow["img.product"] || "";
  }).filter(Boolean);
  log(`  Product expanded: count=${productCount || 1}, layout=${resolveImageGroupLayout(expandedRow, "product", productCount || 1)}, images=${productImages.join(" | ")}`);

  const handledTextColumns = await applyTitleAndProductNote(doc, expandedRow);

  applyDailyMechanismSwitch(doc, expandedRow);
  applyLayerVisibilitySwitches(doc, expandedRow);
  applyDynamicIconSwitch(doc, expandedRow);
  await prepareImageGroupLayers(doc, expandedRow, "product");
  await prepareImageGroupLayers(doc, expandedRow, "giftLeft");
  await prepareImageGroupLayers(doc, expandedRow, "giftRight");
  hideGiftLeftGroupsWhenTitleEmpty(doc, expandedRow);
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
      isDynamicIconControlColumn(doc, expandedRow, column) ||
      (column === "img.product" && getGiftCount(expandedRow, "product") > 1) ||
      column === "img.giftLeft"
    ) {
      continue;
    }

    if (column === "txt.bottomText") {
      const replaced = await replaceTextLayersByName(doc, column, value, {
        bottomText: true,
        row: expandedRow
      });
      if (!replaced) {
        log(`  Skip: layer not found: ${column}`);
      }
      continue;
    }

    const layer = findLayerByName(doc, column);
    if (!layer) {
      if (column === "txt.productNote" || column === "txt.note" || column === "txt.description" || column === "txt.subtitle" || /^txt\.subtitle\.\d+$/.test(column)) {
        continue;
      }
      log(`  Skip: layer not found: ${column}`);
      continue;
    }

    if (column.startsWith("txt.")) {
      const textValue = isPriceLabelColumn(column, layer) ? formatPriceLabelText(value) : value;
      if (shouldPreserveTemplateTextStyle()) {
        const replaced = await replaceTextLayersByName(doc, column, value, {
          bottomText: column === "txt.bottomText",
          priceDecimalTail: column === "txt.price",
          row: expandedRow,
          subscriptSuffixes: getCurrentTemplateConfig().bottomTextSubscriptSuffixes || []
        });
        if (!replaced) {
          log(`  Skip: layer not found: ${column}`);
        }
      } else if (column === "txt.bottomText") {
        await applyBottomTextRules(layer, textValue);
      } else {
        await replaceTextLayer(layer, textValue);
      }
      continue;
    }

    if (column.startsWith("img.")) {
      const asset = await getAssetEntry(value, {
        disableTrimmed: column === "img.giftRight",
        normalizeGiftRight: column === "img.giftRight",
        productFallbackPriority: column === "img.product" || /^img\.product\.\d+$/.test(column)
      });
      await replaceSmartObjectLayer(layer, asset);
      continue;
    }

    log(`  Skip: column needs txt. or img. prefix: ${column}`);
  }

  applyDailyMechanismSwitch(doc, expandedRow);
  applyLayerVisibilitySwitches(doc, expandedRow);
  applyDynamicIconSwitch(doc, expandedRow);
  hideGiftLeftGroupsWhenTitleEmpty(doc, expandedRow);
  log("  Before product arrange.");
  await arrangeProductLineAfterReplace(doc, expandedRow);
  log("  After product arrange.");
  await applyProductGroupScale(doc, expandedRow);
  await alignCurrentProductLayersToArea(doc, expandedRow);
  await applyProductShadow(doc);
  await alignGiftLeftImageGroupToArea(doc);
  if (getCurrentTemplateConfig().keepPersonOnTop) {
    await keepPersonOnTop(doc);
  }
  hideAreaHelperLayers(doc);
}

async function processOne(row, index) {
  ensureModules();
  state.giftTargets = {};
  state.groupAreaBoxes = {};
  state.groupAreaNames = {};
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
    activeRowTemplateId = "";
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
    state.groupAreaNames = {};
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
    state.exportedPsdEntries = [];

    ensureModules();
    let successCount = 0;
    let failureCount = 0;
    let mergedPsdName = "";
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
        if (shouldMergeExportedPsds()) {
          setSummary("Merging exported PSD files...");
          mergedPsdName = await mergeExportedPsdsAsGroups(state.exportedPsdEntries);
        }
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
    } else if (mergedPsdName) {
      setSummary(`Done: ${successCount} exported, ${failureCount} failed. Merged PSD: ${mergedPsdName}`);
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
