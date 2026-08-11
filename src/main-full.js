let templateFile = null;
let csvFile = null;
let assetsFolder = null;
let outputFolder = null;
let photoshop = null;
let uxpStorage = null;
let fs = null;
let configuredAssetsFolder = null;
let configuredAssetsFolderPath = "";
const SCRIPT_VERSION = "20260811-reference-height-ratio";

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

const TITLE_SUPERSCRIPT_FONT = TITLE_FONT_RULE.latin;
const TITLE_SUPERSCRIPT_STYLE = {
  sizeRatio: 1,
  shiftRatio: 0.52,
  leadingRatio: 1.08
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
  bottomTextAreaName: "bottomText.area",
  bottomTextShortMaxUnits: 7.0,
  bottomTextShortFitRatio: 0.88,
  productShadow: null,
  productBottomShadow: null,
  addOnCoupon: null,
  dailyMechanismSwitch: null,
  giftDescImageSource: {
    enabled: true,
    sourceColumns: ["txt.giftLeftDesc", "txt.giftDesc", "txt.gift"],
    targetPrefixes: ["gift", "giftLeft"],
    forceProductView: true,
    layout: "overlap"
  },
  backgroundSwitch: null,
  layerVisibilitySwitches: [],
  dynamicIconSwitch: null,
  bottomTextFromProductName: null,
  productOverlapGapRatio: -0.42,
  giftLeftOverlapGapRatio: -0.18
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
          tokens: ["cuiyutao", "cui", "\\u5d14\\u7389\\u6d9b", "崔玉涛"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "\\u7ae0\\u5b50\\u6021", "章子怡"]
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
    defaultProductImageView: "front",
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
    fontStyleName: "Regular",
        color: { red: 0, green: 0, blue: 0 }
      },
      latin: {
        postScriptName: "LINESeedSansApp-Regular",
    fontName: "LINE Seed Sans App Regular",
    fontStyleName: "Regular",
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
  },
  pddSkuGift: {
    ...BASE_TEMPLATE_CONFIG,
    id: "pddSkuGift",
    label: "SKU",
    filePrefixPlaceholder: "sku_",
    paths: {
      template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDDSKU\\02\\PDD_SKU_GIFT_Template.psd",
      csv: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDDSKU\\02\\sku-防晒40ml+叮叮喷雾100ml.csv",
      assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
      output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDDSKU\\02\\export"
    },
    exportNameColumns: ["exportName", "PDD_SKU_GIFT", "pddSkuGift", "pdd_sku_gift", "PDD_SKU", "pddSku", "pdd_sku", "sku", "id", "goodsId"],
    ignoredDataColumns: ["template.profile", "templateProfile"],
    defaultProductImageView: "front",
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
    fontStyleName: "Regular",
        color: { red: 0, green: 0, blue: 0 }
      },
      latin: {
        postScriptName: "LINESeedSansApp-Regular",
    fontName: "LINE Seed Sans App Regular",
    fontStyleName: "Regular",
        color: { red: 197, green: 39, blue: 20 }
      }
    },
    productShadow: {
      enabled: true,
      sourceGroupName: "PRODUCT",
      sourceMode: "items",
      targetGroupName: "PRODUCT.PROJECT",
      name: "PRODUCT.shadow",
      top: 665,
      opacity: 100,
      placeAfterSource: false
    }
  },
  pddDiffMain: {
    ...BASE_TEMPLATE_CONFIG,
    id: "pddDiffMain",
    label: "PDD Main",
    filePrefixPlaceholder: "pdd_main_",
    paths: {
      template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\PDD_DIFF_MAIN_Template.psd",
      csv: "F:\\SOFT\\CODEX\\PROJECT\\Main_image_template\\sample-data-pdd-main.csv",
      assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
      output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\export"
    },
    exportNameColumns: ["exportName", "PDD_MAIN", "pddMain", "pdd_main", "sku", "id", "goodsId"],
    ignoredDataColumns: ["template.profile", "templateProfile"],
    defaultProductImageView: "front",
    keepPersonOnTop: false,
    preserveTemplateTextOnly: true,
    backgroundSwitch: {
      enabled: true,
      column: "pdd.background",
      defaultVariant: "egg",
      variants: {
        egg: {
          names: ["EGG_BG"],
          tokens: ["egg", "eggbg", "egg_bg", "\\u9e21\\u86cb", "\\u86cb"]
        },
        spray: {
          names: ["SPRAY_BG"],
          tokens: ["spray", "spraybg", "spray_bg", "喷雾"]
        }
      }
    },
    layerVisibilitySwitches: [
      {
        column: "pdd.icon.baby0",
        names: ["baby0icon"],
        label: "baby0icon",
        defaultVisible: false
      },
      {
        column: "pdd.icon.612",
        names: ["6-12icon"],
        label: "6-12icon",
        defaultVisible: false
      },
      {
        column: "pdd.icon.cosmetic",
        names: ["cosmeticicon", "cosmeticicon "],
        label: "cosmeticicon",
        defaultVisible: false
      },
      {
        columns: ["pdd.icon.youth12", "pdd.icon.1218", "icon.youth12", "icon.1218"],
        names: ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
        label: "12+icon",
        defaultVisible: false
      }
    ],
    personTemplateSwitch: {
      enabled: true,
      legacyName: "img.person",
      scopeCurrentMechanism: true,
      variants: {
        cuiyutao: {
          names: ["img.person.cuiyutao", "img.personCuiyutao"],
          tokens: ["cuiyutao", "cui", "\\u5d14\\u7389\\u6d9b", "崔玉涛"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "\\u7ae0\\u5b50\\u6021", "章子怡"]
        }
      }
    },
    dailyMechanismSwitch: {
      enabled: true,
      column: "daily.mechanism",
      legacyColumns: ["mechanism", "sheet"],
      fixedMechanism: "4",
      defaultMechanism: "4",
      groups: {
        "1": ["mechanism.1", "daily.mechanism.1"],
        "2": ["mechanism.2", "daily.mechanism.2"],
        "3": ["mechanism.3", "daily.mechanism.3"],
        "4": ["mechanism.4", "daily.mechanism.4"]
      },
      productAreas: {
        "1": { default: "product.area.1" },
        "2": { default: "product.area.2" },
        "3": { default: "product.area.3" },
        "4": { default: "product.area.4" }
      },
      giftAreaName: "gift.area",
      preferredMechanismLayerNames: ["img.product", "txt.bottomText.1", "txt.bottomText.2"],
      giftImageGroupNames: ["GIFT", "giftimage", "giftImage", "gift.image"]
    },
    bottomTextFromProductName: {
      enabled: true,
      sourceColumn: "product.name.cn",
      targetColumn: "txt.bottomText",
      mechanisms: ["4"]
    },
    finalProductBottomAlign: false,
    alignPlacedProductBottomToArea: false,
    productBottomShadow: {
      enabled: true,
      layerName: "img.productshadow",
      opacity: 72,
      widthRatio: 1,
      heightRatio: 0.07,
      offsetXRatio: 0.18,
      bottomOffsetRatio: 0.14
    },
    preferProductNameImages: true
  },
  pddDailyMain: {
    ...BASE_TEMPLATE_CONFIG,
    id: "pddDailyMain",
    label: "PDD Daily",
    filePrefixPlaceholder: "pdd_daily_",
    paths: {
      template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\Daily\\PDD_Daily_MAIN_Template.psd",
      csv: "F:\\SOFT\\CODEX\\PROJECT\\Main_image_template\\sample-data-pdd-daily.csv",
      assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
      output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\Daily\\export"
    },
    exportNameColumns: ["exportName", "PDD_DAILY", "pddDaily", "pdd_daily", "PDD_MAIN", "pddMain", "sku", "id", "goodsId"],
    ignoredDataColumns: ["template.profile", "templateProfile"],
    defaultProductImageView: "front",
    keepPersonOnTop: false,
    preserveTemplateTextOnly: true,
    preferProductNameImages: true,
    giftDescImageSource: {
      enabled: true,
      sourceColumns: ["txt.giftLeftDesc", "txt.giftDesc", "txt.gift"],
      targetPrefixes: ["gift"],
      forceProductView: true,
      layout: "overlap"
    },
    backgroundSwitch: {
      enabled: true,
      column: "pdd.background",
      defaultVariant: "egg",
      variants: {
        egg: {
          names: ["EGG_BG"],
          tokens: ["egg", "eggbg", "egg_bg", "\\u9e21\\u86cb", "\\u86cb"]
        },
        spray: {
          names: ["SPRAY_BG"],
          tokens: ["spray", "spraybg", "spray_bg", "喷雾"]
        }
      }
    },
    layerVisibilitySwitches: [
      {
        column: "pdd.icon.baby0",
        names: ["baby0icon"],
        label: "baby0icon",
        defaultVisible: false
      },
      {
        column: "pdd.icon.612",
        names: ["6-12icon"],
        label: "6-12icon",
        defaultVisible: false
      },
      {
        column: "pdd.icon.cosmetic",
        names: ["cosmeticicon", "cosmeticicon "],
        label: "cosmeticicon",
        defaultVisible: false
      },
      {
        column: "pdd.icon.youth12",
        names: ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
        label: "12+icon",
        defaultVisible: false
      }
    ],
    personTemplateSwitch: {
      enabled: true,
      legacyName: "img.person",
      variants: {
        cuiyutao: {
          names: ["img.person.cuiyutao", "img.personCuiyutao"],
          tokens: ["cuiyutao", "cui", "\\u5d14\\u7389\\u6d9b", "崔玉涛"]
        },
        zhangziyi: {
          names: ["img.person.zhangziyi", "img.personZhangziyi"],
          tokens: ["zhangziyi", "zhang", "\\u7ae0\\u5b50\\u6021", "章子怡"]
        }
      }
    },
    dailyMechanismSwitch: {
      enabled: true,
      column: "daily.mechanism",
      defaultMechanism: "3",
      groups: {
        "1": ["mechanism.1", "daily.mechanism.1"],
        "2": ["mechanism.2", "daily.mechanism.2"],
        "3": ["mechanism.3", "daily.mechanism.3"],
        "4": ["mechanism.4", "daily.mechanism.4"]
      },
      productAreas: {
        "1": { withPerson: "product.area.1", withoutPerson: "product.area.2" },
        "2": { withPerson: "product.area.1", withoutPerson: "product.area.2" },
        "3": { default: "product.area.3" },
        "4": { default: "product.area.4" }
      },
      giftAreaName: "gift.area",
      giftImageGroupNames: ["giftimage", "giftImage", "gift.image", "giftLeftimage", "giftLeftImage", "giftLeft.image"]
    },
    bottomTextFromProductName: {
      enabled: true,
      sourceColumn: "product.name.cn",
      targetColumn: "txt.bottomText",
      mechanisms: ["4"]
    },
    finalProductBottomAlign: true,
    productBottomShadow: {
      enabled: true,
      layerName: "img.productshadow",
      opacity: 72,
      widthRatio: 1,
      heightRatio: 0.07,
      offsetXRatio: 0.18,
      bottomOffsetRatio: 0.14
    },
    bottomTextAreaName: "bottomText.area",
    bottomTextShortMaxUnits: 7.0,
    bottomTextShortFitRatio: 0.88,
    productOverlapGapRatio: -0.5,
    giftLeftOverlapGapRatio: -0.18
  }
};

function createTemplateProfile(baseConfig, overrides = {}) {
  const merged = { ...baseConfig, ...overrides };
  for (const key of ["paths", "mechanismSwitch", "dailyMechanismSwitch", "personTemplateSwitch", "productShadow", "productBottomShadow"]) {
    if (baseConfig[key] || overrides[key]) {
      merged[key] = { ...(baseConfig[key] || {}), ...(overrides[key] || {}) };
    }
  }
  return merged;
}

function defineTemplateProfile(id, config) {
  TEMPLATE_CONFIGS[id] = config;
  return config;
}

const MAIN_PROFILE_AGE_ICON_SWITCHES = [
  { columns: ["daily.icon.baby0", "pdd.icon.baby0", "icon.baby0"], names: ["baby0icon"], label: "baby0icon", defaultVisible: false },
  { columns: ["daily.icon.612", "pdd.icon.612", "icon.612"], names: ["6-12icon"], label: "6-12icon", defaultVisible: false },
  { columns: ["daily.icon.cosmetic", "pdd.icon.cosmetic", "icon.cosmetic"], names: ["cosmeticicon", "cosmeticicon "], label: "cosmeticicon", defaultVisible: false },
  { columns: ["daily.icon.youth12", "pdd.icon.youth12", "icon.youth12"], names: ["12+icon", "12plusicon", "youth12icon", "teen12icon"], label: "12+icon", defaultVisible: false }
];

const PDD_POP_AGE_ICON_SWITCHES = [
  ...MAIN_PROFILE_AGE_ICON_SWITCHES.slice(0, 3),
  { columns: ["daily.icon.youth12", "daily.icon.1218", "pdd.icon.youth12", "pdd.icon.1218", "icon.youth12", "icon.1218"], names: ["12+icon", "12plusicon", "youth12icon", "teen12icon"], label: "12+icon", defaultVisible: false }
];

const DEFAULT_DYNAMIC_ICON_ALIASES = {
  baby0: ["baby0icon"],
  baby0icon: ["baby0icon"],
  "6-12": ["6-12icon"],
  "6-12icon": ["6-12icon"],
  "612": ["6-12icon"],
  "612icon": ["6-12icon"],
  cosmetic: ["cosmeticicon", "cosmeticicon "],
  cosmeticicon: ["cosmeticicon", "cosmeticicon "],
  youth12: ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
  youth12icon: ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "12+": ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "12+icon": ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "1218": ["12+icon", "12plusicon", "youth12icon", "teen12icon"],
  "1218icon": ["12+icon", "12plusicon", "youth12icon", "teen12icon"]
};

defineTemplateProfile("jddaily750", createTemplateProfile(BASE_TEMPLATE_CONFIG, {
  id: "jddaily750",
  label: "JDDaily 750",
  filePrefixPlaceholder: "jd_daily_750_",
  paths: {
    template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\JD\\JDDAILY\\JD_DAILY_750_ALL_MECHANISM.psd",
    csv: "F:\\SOFT\\CODEX\\PROJECT\\Main_image_template\\JDDaily\\sample-data-jddaily750.csv",
    assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
    output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\JD\\JDDAILY\\export"
  },
  exportNameColumns: ["exportName", "SKU", "sku", "id", "goodsId"],
  ignoredDataColumns: ["sheet", "daily.mechanism", "mechanism", "daily.giftMiddleType", "daily.giftRightType", "img.giftMiddle", "template.profile", "templateProfile"],
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
  },
  mechanismSwitch: {
    enabled: true,
    column: "mechanism",
    legacyColumns: ["daily.mechanism", "sheet"],
    defaultMechanism: "2",
    groups: {
      "1": ["mechanism.1", "daily.mechanism.1", "机制-1"],
      "2": ["mechanism.2", "daily.mechanism.2", "机制-2"],
      "3": ["mechanism.3", "daily.mechanism.3", "机制-3"],
      "4": ["mechanism.4", "daily.mechanism.4", "机制-4"]
    },
    middleGiftLayers: {
      "178": ["img.giftMiddle.178"],
      "298": ["img.giftMiddle.298"],
      "378": ["img.giftMiddle.378"]
    },
    left298Layers: ["img.giftLeft.298"],
    giftImageGroupNames: ["giftLeftimage", "giftLeftImage", "giftLeft.image", "giftimage", "giftImage", "gift.image"]
  },
  preserveTemplateTextOnly: true,
  titleVariant2MinLines: 2,
  productAssetPriority: {
    enabled: true,
    folder: "babyproduct_icefrosteffect"
  },
  bottomTextSubscriptSuffixes: ["/"],
  bottomTextCenterX: 500,
  bottomTextAreaName: "bottomText.area",
  bottomTextOverflowScale: 0.8,
  bottomTextShortMaxUnits: 7.0,
  bottomTextShortFitRatio: 0.88,
  productDefaultHeightBoost: 1.08,
  productStackScale: 1.35,
  productOverlapGapRatio: -0.5,
  giftLeftOverlapGapRatio: -0.18
}));

defineTemplateProfile("tianmao88", createTemplateProfile(TEMPLATE_CONFIGS.jddaily750, {
  id: "tianmao88",
  label: "Tmall 88",
  filePrefixPlaceholder: "tmall_88_",
  paths: {
    template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\TIANMAO\\Tmall88_Main_Template\\TM_ALL_MECHANISM_1440X1440_.psd",
    output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\TIANMAO\\Tmall88_Main_Template\\export"
  },
  mechanismSwitch: {
    left298ByMechanism: false,
    middleGiftLayers: {
      "208": ["img.giftMiddle.208"],
      "358": ["img.giftMiddle.358"],
      "449": ["img.giftMiddle.449"]
    }
  },
  layerVisibilitySwitches: MAIN_PROFILE_AGE_ICON_SWITCHES,
  productAssetPriority: {
    enabled: true,
    useFolderFallback: false,
    views: ["angle", "front"]
  }
}));

defineTemplateProfile("pddPopMain", createTemplateProfile(TEMPLATE_CONFIGS.tianmao88, {
  id: "pddPopMain",
  label: "PDD POP",
  filePrefixPlaceholder: "pdd_pop_",
  paths: {
    template: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\POP\\COMMON_MECHANISM\\BABY_COMMON_Main_Template.psd",
    csv: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\POP\\COMMON_MECHANISM\\pdd0720.csv",
    assets: "F:\\NEWPAGE\\AI生图\\批量生图测试\\assets",
    output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\PDD\\POP\\COMMON_MECHANISM\\export"
  },
  exportNameColumns: ["exportName", "PDD_POP", "pddPop", "pdd_pop", "PDD_MAIN", "pddMain", "sku", "id", "goodsId"],
  giftLeftDescPlusWrap: { enabled: true, minDisplayLength: 10 },
  blockedAssetFolders: ["babyproduct_icefrosteffect"],
  productDefaultHeightBoost: 1.08,
  mechanismSwitch: {
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
  layerVisibilitySwitches: PDD_POP_AGE_ICON_SWITCHES
}));

defineTemplateProfile("tmallAddOn", createTemplateProfile(TEMPLATE_CONFIGS.pddSkuGift, {
  id: "tmallAddOn",
  label: "TMall AddOn",
  filePrefixPlaceholder: "tmall_addon_",
  paths: {
    template: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\ADDONE\\TMall_AddOn_MAIN_Template.psd",
    csv: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\ADDONE\\TMADDONE0709.csv",
    assets: TEMPLATE_CONFIGS.pddSkuGift.paths.assets,
    output: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\ADDONE\\export"
  },
  exportNameColumns: ["exportName", "TMall_AddOn", "tmallAddOn", "tmall_addon", "tmallAddOnMain", "tmall_addon_main", "sku", "id", "goodsId"],
  skuGiftCompatible: true,
  addOnCoupon: {
    enabled: true,
    layerName: "img.coupon",
    layerNames: ["img.coupon", "img.coupon.contact", "img.coupon.auto"],
    typeColumn: "coupon.type",
    defaultType: "contact",
    imageColumns: ["img.coupon", "img.repurchaseCoupon", "img.buybackCoupon"],
    variants: {
      contact: {
        tokens: ["contact", "manual", "service", "claim", "lingqu", "\u8054\u7cfb\u9886\u53d6", "\u8054\u7cfb", "\u5ba2\u670d"],
        image: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\\u65b0\u589e\u7d20\u6750\u56fe\\30\u5143\u56de\u8d2d\u5238-\u8054\u7cfb\u9886\u53d6.png"
      },
      auto: {
        tokens: ["auto", "automatic", "send", "issue", "\u81ea\u52a8\u53d1\u653e", "\u81ea\u52a8", "\u7269\u6d41"],
        image: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\\u65b0\u589e\u7d20\u6750\u56fe\\30\u5143\u56de\u8d2d\u5238-\u81ea\u52a8\u53d1\u653e.png"
      }
    }
  },
  productShadow: {
    ...TEMPLATE_CONFIGS.pddSkuGift.productShadow,
    style: "mirror",
    sourceMode: "items",
    excludeLayerNames: ["img.coupon", "img.coupon.contact", "img.coupon.auto"]
  },
  productBottomShadow: {
    enabled: true,
    style: "right",
    layerName: "img.productshadow",
    generateIfMissing: true,
    excludeCoupon: true,
    opacity: 38,
    widthRatio: 0.88,
    heightRatio: 0.055,
    offsetXRatio: 0.22,
    bottomOffsetRatio: 0.12,
    blur: 9
  }
}));

defineTemplateProfile("tmallFlashSaleMain", createTemplateProfile(TEMPLATE_CONFIGS.pddDailyMain, {
  id: "tmallFlashSaleMain",
  label: "TMall FlashSale",
  filePrefixPlaceholder: "tmall_flashsale_",
  paths: {
    template: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\FlashSale\\Tmall_FlashSale_MAIN_Template-800.psd",
    csv: "F:\\SOFT\\CODEX\\PROJECT\\Main_image_template\\sample-data-tmall-flashsale.csv",
    assets: TEMPLATE_CONFIGS.pddDailyMain.paths.assets,
    output: "F:\\NEWPAGE\\AI\u751f\u56fe\\\u6279\u91cf\u751f\u56fe\u6d4b\u8bd5\\TIANMAO\\FlashSale\\export"
  },
  exportNameColumns: ["exportName", "TMall_FlashSale", "tmallFlashSale", "tmall_flashsale", "tmallFlashSaleMain", "tmall_flashsale_main", "sku", "id", "goodsId"],
  skuGiftCompatible: true,
  finalProductBottomAlign: false,
  personTemplateSwitch: {
    scopeCurrentMechanism: true
  },
  dailyMechanismSwitch: {
    byGiftAndPerson: true,
    autoOverridesExplicit: true,
    giftPresenceColumns: ["txt.giftProductLabel", "txt.giftLabel", "txt.giftDesc", "gift.name.cn", "img.gift", "img.giftSet", "img.gift.1"],
    personPresenceColumns: ["img.person"],
    defaultMechanism: "4",
    productAreas: {
      "1": { default: "product.area.1" },
      "2": { default: "product.area.2" },
      "3": { default: "product.area.3" },
      "4": { default: "product.area.4" }
    },
    giftAreas: {
      "1": { default: "gift.area.1" },
      "2": { default: "gift.area.2" },
      "3": { default: "gift.area.3" },
      "4": { default: "gift.area.4" }
    },
    giftMechanisms: ["1", "2"],
    giftAlign: {
      layerName: "img.gift",
      alignX: "center",
      alignY: "center"
    },
    giftImageGroupNames: ["GIFT", "giftimage", "giftImage", "gift.image"]
  },
  giftTagSwitch: {
    enabled: true,
    names: ["gifttag", "gift.tag", "giftTag"],
    columns: ["gift.tag", "gifttag", "showGiftTag"],
    anchorToGift: true,
    offsetX: -20,
    offsetY: -36
  },

  dynamicIconSwitch: {
    enabled: true,
    groupNames: ["ICON", "Icon", "icon"],
    prefixes: ["icon.", "daily.icon.", "pdd.icon."],
    listColumns: ["icon.layers", "icon.names", "icon.list", "daily.icons", "pdd.icons"],
    defaultVisible: false
  }
}));

defineTemplateProfile("baibuMiaoshaMain", createTemplateProfile(BASE_TEMPLATE_CONFIG, {
  id: "baibuMiaoshaMain",
  label: "Baibu Miaosha",
  filePrefixPlaceholder: "baibu_miaosha_",
  paths: {
    template: "",
    csv: "F:\\SOFT\\CODEX\\PROJECT\\Main_image_template\\sample-data-baibu-miaosha.csv",
    assets: TEMPLATE_CONFIGS.pddDailyMain.paths.assets,
    output: "F:\\NEWPAGE\\AI生图\\批量生图测试\\BAIBU_MIAOSHA\\export"
  },
  exportNameColumns: ["exportName", "board.name", "sku", "id", "goodsId"],
  ignoredDataColumns: ["template.profile", "templateProfile"],
  preserveTemplateTextOnly: true,
  preferProductNameImages: true,
  defaultProductImageView: "front",
  productShadow: {
    enabled: true,
    sourceGroupName: "PRODUCT",
    sourceMode: "items",
    targetGroupName: "PRODUCT.PROJECT",
    targetGroupNames: ["PRODUCT.PROJECT", "PROJECT"],
    name: "PRODUCT.shadow",
    style: "mirror",
    opacity: 100,
    placeAfterSource: false,
    giftColumns: ["giftshadow", "giftshadow.enabled", "gift.shadow", "giftShadow", "gift.shadow.enabled", "giftShadow.enabled"],
    includeGiftDefault: false,
    includeGiftCouponShadow: true
  },
  addOnCoupon: {
    ...TEMPLATE_CONFIGS.tmallAddOn.addOnCoupon,
    targetPrefix: "gift",
    placement: "append"
  },
  giftTagSwitch: {
    enabled: true,
    names: ["gifttag", "gift.tag", "giftTag"],
    columns: ["gift.tag", "gifttag", "showGiftTag"],
    anchorToGift: true,
    offsetX: -20,
    offsetY: -36
  },

  dynamicIconSwitch: {
    enabled: true,
    groupNames: ["ICON", "Icon", "icon"],
    prefixes: ["icon.", "daily.icon.", "pdd.icon."],
    listColumns: ["icon.layers", "icon.names", "icon.list", "daily.icons", "pdd.icons"],

    defaultVisible: false
  },
  artboardSwitch: {
    enabled: true,
    required: true,
    columns: {
      type: ["board.type", "canvas.type", "activity.type"],
      size: ["board.size", "canvas.size", "export.size"],
      gift: ["gift.mode", "board.gift", "hasGift"]
    },
    uiDefaults: {
      type: "boardType",
      size: "boardSize",
      gift: "giftMode"
    },
    defaultType: "baibu",
    defaultSize: "800",
    defaultGift: "auto",
    variants: {
      "baibu|800|gift": ["百补800-有赠品"],
      "baibu|800|nogift": ["百补800-无赠品"],
      "baibu|750|gift": ["百补750-有赠品"],
      "baibu|750|nogift": ["百补750-无赠品"],
      "miaosha|800|gift": ["秒杀800-有赠品"],
      "miaosha|800|nogift": ["秒杀800-无赠品"],
      "miaosha|750|gift": ["秒杀750-有赠品"],
      "miaosha|750|nogift": ["秒杀750-无赠品"]
    }
  }
}));
let activeTemplateId = "pddSkuGift";
let rowTemplateOverrideId = "";

const state = {
  rows: [],
  busy: false,
  giftTargets: {},
  groupAreaBoxes: {},
  groupAreaNames: {},
  placedImageLayers: {},
  templateLayerBoxes: {},
  currentRow: null,
  productNameMap: null,
  productNameRows: [],
  exportedPsdEntries: [],
  currentArtboardLayer: null,
  currentArtboardName: "",
  currentArtboardKey: ""
};

function isSkuGiftTemplateConfig(config = getCurrentTemplateConfig()) {
  return !!(config && (config.id === "pddSkuGift" || config.skuGiftCompatible));
}

function getAddOnCouponConfig() {
  const config = getCurrentTemplateConfig();
  if (!config) return null;
  const couponConfig = config.coupon || config.addOnCoupon;
  if (!couponConfig || couponConfig.enabled === false) return null;
  return couponConfig;
}

function getAddOnCouponType(row, config) {
  const typeColumn = config && config.typeColumn || "coupon.type";
  return String(row && (row[typeColumn] || row.couponType || row.coupon || "") || config && config.defaultType || "").trim().toLowerCase();
}

function isAddOnCouponDisabled(row) {
  const disabled = String(row && (row["coupon.enabled"] || row["addOnCoupon.enabled"] || "") || "").trim().toLowerCase();
  return /^(0|false|no|n|off)$/.test(disabled);
}

function getAddOnCouponVariantKey(row, config = getAddOnCouponConfig()) {
  if (!config) return "";
  const type = getAddOnCouponType(row, config);
  const variants = config.variants || {};
  for (const [key, variant] of Object.entries(variants)) {
    const tokens = [key, ...(variant.tokens || [])].map((token) => String(token || "").trim().toLowerCase()).filter(Boolean);
    if (tokens.includes(type)) return key;
  }
  return config.defaultType || Object.keys(variants)[0] || "";
}

function getAddOnCouponVariant(row, config = getAddOnCouponConfig()) {
  const key = getAddOnCouponVariantKey(row, config);
  return key && config && config.variants ? config.variants[key] || null : null;
}

function getAddOnCouponExplicitImage(row, config = getAddOnCouponConfig()) {
  if (!config) return "";
  for (const column of config.imageColumns || ["img.coupon"]) {
    if (hasValue(row, column)) return String(row[column]).trim();
  }
  return "";
}

function resolveAddOnCouponImage(row) {
  const config = getAddOnCouponConfig();
  if (!config || isAddOnCouponDisabled(row)) return "";
  const explicit = getAddOnCouponExplicitImage(row, config);
  if (explicit) return explicit;
  const variant = getAddOnCouponVariant(row, config);
  return variant && variant.image || "";
}

function getAddOnCouponProductToken(row) {
  const config = getAddOnCouponConfig();
  if (!config || isAddOnCouponDisabled(row)) return "";
  const explicit = getAddOnCouponExplicitImage(row, config);
  if (explicit) return explicit;
  const key = getAddOnCouponVariantKey(row, config);
  return key ? `__coupon:${key}` : "";
}

function isAddOnCouponToken(value) {
  return /^__coupon:/i.test(String(value || "").trim());
}

function getAddOnCouponTargetPrefix(config = getAddOnCouponConfig()) {
  const prefix = String(config && (config.targetPrefix || config.layoutPrefix || config.prefix) || "product").trim();
  return prefix || "product";
}

function getAddOnCouponPlacement(config = getAddOnCouponConfig()) {
  const placement = String(config && (config.placement || config.insert || config.position) || "prepend").trim().toLowerCase();
  return /^(append|after|right|last|end)$/.test(placement) ? "append" : "prepend";
}

function getAddOnCouponIndexColumn(prefix = getAddOnCouponTargetPrefix()) {
  return `${prefix}.couponIndex`;
}

function isAddOnCouponImageIndex(row, prefix, index) {
  const config = getAddOnCouponConfig();
  if (!config) return false;
  const targetPrefix = getAddOnCouponTargetPrefix(config);
  if (String(prefix || "") !== targetPrefix) return false;
  const couponIndex = parseCount(row && row[getAddOnCouponIndexColumn(targetPrefix)] || (targetPrefix === "product" ? row && row["product.couponIndex"] : ""));
  return couponIndex > 0 && Number(index) === couponIndex;
}

function isAddOnCouponProductIndex(row, index) {
  return isAddOnCouponImageIndex(row, "product", index);
}

function isAddOnCouponColumn(column) {
  if (!getAddOnCouponConfig()) return false;
  return /^coupon\./.test(String(column || "")) || /^addOnCoupon\./.test(String(column || "")) || column === "img.coupon" || column === "img.repurchaseCoupon" || column === "img.buybackCoupon" || /^(product|gift|giftLeft|giftRight)\.couponIndex$/.test(String(column || ""));
}

function getAddOnCouponLayerNames(row, config = getAddOnCouponConfig()) {
  if (!config) return [];
  const names = [config.layerName, ...(config.layerNames || [])];
  Object.entries(config.variants || {}).forEach(([key, variant]) => {
    names.push(variant.layerName, `img.coupon.${key}`);
  });
  return Array.from(new Set(names.filter(Boolean)));
}

function getSelectedAddOnCouponLayerNames(row, config = getAddOnCouponConfig()) {
  if (!config) return [];
  const key = getAddOnCouponVariantKey(row, config);
  const variant = key && config.variants ? config.variants[key] : null;
  return [variant && variant.layerName, key && `img.coupon.${key}`, config.layerName].filter(Boolean);
}

function hideAddOnCouponTemplateLayers(doc, row, exceptLayer = null) {
  const names = getAddOnCouponLayerNames(row);
  let hidden = 0;
  names.forEach((name) => {
    findLayersByName(doc, name).forEach((layer) => {
      if (layer && layer !== exceptLayer) {
        layer.visible = false;
        hidden += 1;
      }
    });
  });
  if (hidden) log(`  AddOn coupon template layers hidden: ${hidden}.`);
}

function findAddOnCouponTemplateLayer(doc, row) {
  for (const name of getSelectedAddOnCouponLayerNames(row)) {
    const layer = findLayerByName(doc, name);
    if (layer) return layer;
  }
  return null;
}

function getAddOnCouponTargetBox(row, slotBox, templateBox) {
  const width = readNumber(row, "coupon.width", readNumber(row, "addOnCoupon.width", templateBox ? templateBox.width : slotBox.width));
  const height = readNumber(row, "coupon.height", readNumber(row, "addOnCoupon.height", templateBox ? templateBox.height : slotBox.height));
  const centerX = slotBox.centerX + readNumber(row, "coupon.offsetX", readNumber(row, "addOnCoupon.offsetX", 0));
  const bottom = slotBox.bottom + readNumber(row, "coupon.offsetY", readNumber(row, "addOnCoupon.offsetY", 0));
  return makeBox(centerX - width / 2, bottom - height, width, height);
}

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

function getRowTemplateId(row) {
  const id = String(row && (row["template.profile"] || row.templateProfile) || "").trim();
  return TEMPLATE_CONFIGS[id] ? id : "";
}

function getCurrentTemplateConfig() {
  if (rowTemplateOverrideId && TEMPLATE_CONFIGS[rowTemplateOverrideId]) {
    return getTemplateConfig(rowTemplateOverrideId);
  }

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

function getGiftBadgeConfig(config = getCurrentTemplateConfig()) {
  return config && (config.giftBadge || config.giftBadgeSwitch || config.giftTagSwitch) || null;
}

function getArtboardSwitchConfig(config = getCurrentTemplateConfig()) {
  const switchConfig = config && config.artboardSwitch;
  if (!switchConfig || !switchConfig.enabled) return null;
  return {
    columns: {
      type: ["board.type", "canvas.type", "activity.type"],
      size: ["board.size", "canvas.size", "export.size"],
      gift: ["gift.mode", "board.gift", "hasGift"]
    },
    uiDefaults: {
      type: "boardType",
      size: "boardSize",
      gift: "giftMode"
    },
    defaultGift: "auto",
    variants: {},
    ...switchConfig
  };
}

function readUiValue(id) {
  const el = id && $(id);
  return el ? String(el.value || "").trim() : "";
}

function firstConfiguredValue(row, columns) {
  for (const column of columns || []) {
    if (hasValue(row, column)) return String(row[column]).trim();
  }
  return "";
}

function normalizeArtboardType(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (["baibu", "bb", "百补", "百亿补贴", "baiyi", "baiyibutie"].includes(text)) return "baibu";
  if (["miaosha", "ms", "秒杀", "seckill", "flashsale", "flash_sale"].includes(text)) return "miaosha";
  return text;
}

function normalizeArtboardSize(value) {
  const text = String(value || "").trim().toLowerCase();
  const match = text.match(/750|800|\d{3,4}/);
  return match ? match[0] : "";
}

function normalizeArtboardGift(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text || ["auto", "\u81ea\u52a8", "default"].includes(text)) return "auto";
  if (["1", "true", "yes", "y", "gift", "hasgift", "withgift", "\u6709", "\u6709\u8d60", "\u6709\u8d60\u54c1"].includes(text)) return "gift";
  if (["0", "false", "no", "n", "nogift", "no-gift", "withoutgift", "\u65e0", "\u65e0\u8d60", "\u65e0\u8d60\u54c1"].includes(text)) return "nogift";
  return text;
}

function inferArtboardGift(row) {
  return hasGiftContent(row) || getGiftCount(row || {}, "gift") > 0 ? "gift" : "nogift";
}

function getArtboardControlColumns(config = getCurrentTemplateConfig()) {
  const switchConfig = getArtboardSwitchConfig(config);
  if (!switchConfig) return [];
  return [
    ...(switchConfig.columns && switchConfig.columns.type || []),
    ...(switchConfig.columns && switchConfig.columns.size || []),
    ...(switchConfig.columns && switchConfig.columns.gift || []),
    "board.name",
    "artboard.name",
    "canvas.name"
  ];
}

function resolveArtboardSwitch(row) {
  const switchConfig = getArtboardSwitchConfig();
  if (!switchConfig) return null;
  const columns = switchConfig.columns || {};
  const uiDefaults = switchConfig.uiDefaults || {};

  const explicitName = firstConfiguredValue(row, ["board.name", "artboard.name", "canvas.name"]);
  const rawType = firstConfiguredValue(row, columns.type) || readUiValue(uiDefaults.type) || switchConfig.defaultType || "";
  const rawSize = firstConfiguredValue(row, columns.size) || readUiValue(uiDefaults.size) || switchConfig.defaultSize || "";
  const rawGift = firstConfiguredValue(row, columns.gift) || readUiValue(uiDefaults.gift) || switchConfig.defaultGift || "auto";

  const type = normalizeArtboardType(rawType);
  const size = normalizeArtboardSize(rawSize);
  let gift = normalizeArtboardGift(rawGift);
  if (gift === "auto") gift = inferArtboardGift(row);

  const key = [type, size, gift].join("|");
  const names = explicitName ? [explicitName] : (switchConfig.variants && switchConfig.variants[key]) || [];
  return { switchConfig, key, type, size, gift, names };
}

function findArtboardLayerByNames(doc, names) {
  for (const name of names || []) {
    const layer = findLayerByNameUnscoped(doc, name);
    if (layer) return layer;
  }
  return null;
}

function setTopLevelVariantVisibility(doc, switchConfig, activeLayer) {
  const names = new Set(Object.values(switchConfig.variants || {}).flat().map((name) => String(name || "").trim()).filter(Boolean));
  for (const layer of doc.layers || []) {
    if (names.has(String(layer.name || "").trim())) {
      layer.visible = layer === activeLayer;
    }
  }
}

async function deleteInactiveArtboardVariantsAtSwitch(doc, switchConfig, activeLayer, label = "Artboard switch") {
  if (!doc || !doc.layers || !switchConfig || !activeLayer) return 0;
  const variantNames = getConfiguredArtboardVariantNames(switchConfig);
  if (!variantNames.size) return 0;

  const activeName = String(activeLayer.name || "").trim();
  let removed = 0;
  for (const layer of Array.from(doc.layers || [])) {
    const name = String(layer && layer.name || "").trim();
    if (!variantNames.has(name) || name === activeName || isSameLayerReference(layer, activeLayer)) continue;
    if (await deleteLayerTreeBestEffort(layer, `${label} inactive artboard ${name}`)) {
      removed += 1;
    }
  }

  if (removed) {
    log(`  ${label}: deleted ${removed} inactive artboard tree(s).`);
  }
  return removed;
}

async function applyArtboardSwitch(doc, row) {
  state.currentArtboardLayer = null;
  state.currentArtboardName = "";
  state.currentArtboardKey = "";

  const resolved = resolveArtboardSwitch(row);
  if (!resolved) return null;
  const { switchConfig, key, names } = resolved;
  const target = findArtboardLayerByNames(doc, names);
  if (!target) {
    const message = `Artboard switch target not found: key=${key}, names=${names.join(" | ") || "none"}.`;
    if (switchConfig.required) throw new Error(message);
    log(`  ${message}`);
    return null;
  }

  setTopLevelVariantVisibility(doc, switchConfig, target);
  target.visible = true;
  state.currentArtboardLayer = target;
  state.currentArtboardName = target.name;
  state.currentArtboardKey = key;
  log(`  Artboard switch: key=${key}, layer=${target.name}.`);
  await deleteInactiveArtboardVariantsAtSwitch(doc, switchConfig, target, "Artboard switch");
  return target;
}
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
    ...getMechanismControlColumns(config),
    ...getArtboardControlColumns(config)
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
  return true;
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
  const text = await readCsvText(file);
  return parseCsv(text.replace(/^\uFEFF/, ""));
}

async function readCsvText(file) {
  const utf8Text = await file.read({ format: uxpStorage.formats.utf8 });
  if (!looksMojibake(utf8Text)) return utf8Text;

  try {
    const binary = await file.read({ format: uxpStorage.formats.binary });
    const decoder = new TextDecoder("gb18030");
    const decoded = decoder.decode(binary);
    if (decoded && !looksMojibake(decoded)) {
      log(`  CSV decoded as GB18030: ${file.name || ""}`);
      return decoded;
    }
  } catch (error) {
    log(`  CSV GB18030 decode skipped: ${formatError(error)}`);
  }

  return utf8Text;
}

function looksMojibake(text) {
  const raw = String(text || "");
  if (!raw) return false;
  const replacementCount = (raw.match(/\uFFFD/g) || []).length;
  if (replacementCount >= 3) return true;
  const suspiciousCount = (raw.match(/[锟斤拷\u0400-\u04FF\u0590-\u05FF]/g) || []).length;
  return suspiciousCount >= 3;
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
  const configuredFolder = await getConfiguredAssetsFolder();
  const folderCandidates = [];
  if (configuredFolder) {
    folderCandidates.push({ folder: configuredFolder, label: "configured assets" });
  }
  if (assetsFolder && assetsFolder !== configuredFolder) {
    folderCandidates.push({ folder: assetsFolder, label: "selected assets" });
  }

  for (const item of folderCandidates) {
    for (const name of candidates) {
      try {
        file = await item.folder.getEntry(name);
        sourceName = `${item.label}/${name}`;
        break;
      } catch (error) {
        // Optional mapping file.
      }
    }
    if (file) break;
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
    if (/body-lotion/i.test(String(value)) && normalized.includes("\\u5b89\\u5fc3")) return;
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
    const fullName = row.standard_cn || "";
    const age = row.age_cn || "";
    const product = row.product_cn || "";
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
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/((?:kg|ml|g|l))x(?=\d)/gi, "$1")
    .replace(/[\\/_\-\s]+/g, "")
    .toLowerCase();
}

function getAgeCnAliases(age) {
  const normalized = normalizeProductNameKey(age);
  if (normalized === "婴童" || normalized === "一页") return ["婴童", "一页"];
  if (normalized === "儿童" || normalized === "kids") return ["儿童", "kids"];
  if (normalized === "学龄") return ["学龄"];
  if (normalized === "青春" || normalized === "1218") return ["青春", "1218"];
  return age ? [String(age)] : [];
}

function getAgeCnCanonicalFromText(value) {
  const normalized = normalizeProductNameKey(value);
  if (normalized.includes("学龄") || normalized.includes("612")) return "学龄";
  if (normalized.includes("青春") || normalized.includes("1218")) return "青春";
  if (normalized.includes("儿童") || normalized.includes("kids")) return "儿童";
  if (normalized.includes("婴童") || normalized.includes("婴儿") || normalized.includes("新生") || normalized.includes("一页")) return "婴童";
  return "";
}

function getDefaultProductAgeForQuery(value) {
  const normalized = normalizeProductNameKey(value);
  if (/洁面泡/.test(normalized) && !/(儿童|kids|学龄|612|青春|1218|婴童|婴儿|新生儿)/.test(normalized)) {
    return "儿童";
  }
  if (/^一页页洁面泡/.test(normalized)) {
    return "儿童";
  }
  return getAgeCnCanonicalFromText(value) || "婴童";
}

function isProductViewAssetPath(filename, view) {
  const target = normalizeProductImageViewValue(view);
  if (!target) return false;
  const normalized = String(filename || "").replace(/\\/g, "/").toLowerCase();
  if (!normalized) return false;
  if (new RegExp(`(^|/)${target}(/|$)`).test(normalized)) return true;
  if (target === "front") return /(?:^|[-_])(front|face|f)(?=\.[^.]+$|[-_])/i.test(normalized);
  return /(?:^|[-_])(angle|angled|tilt|tilted|side|a)(?=\.[^.]+$|[-_])/i.test(normalized);
}

function choosePreferredProductImageForKey(key, values, options = {}) {
  const allItems = Array.from(values);
  const requestedView = getProductImageViewFromOptions(options);
  const viewItems = requestedView ? allItems.filter((item) => isProductViewAssetPath(item, requestedView)) : [];
  const items = viewItems.length ? viewItems : allItems;
  const normalizedKey = normalizeProductNameKey(key);
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

      if (/安心霜|学龄霜|修护霜|舒缓霜|夏季安心霜|冰沙霜/.test(normalizedKey) && /^(50g|60g)$/i.test(spec)) {
        const jar = matched.filter((item) => /[-/]jar[-/]/i.test(String(item).replace(/\\/g, "/")));
        if (jar.length === 1) return jar[0];
      }
    }
  }
  return choosePreferredProductByCategory(normalizedKey, items);
}

function choosePreferredProductByAge(normalizedKey, items) {
  const targetAge = getDefaultProductAgeForQuery(normalizedKey);
  const ageRules = {
    "婴童": /(?:^|[\\/])(?:products[\\/])?baby[-\\/]/i,
    "儿童": /(?:^|[\\/])(?:products[\\/])?kids[-\\/]/i,
    "学龄": /(?:^|[\\/])(?:products[\\/])?(?:612|kids)[-\\/]/i,
    "青春": /(?:^|[\\/])(?:products[\\/])?(?:1218|youth)[-\\/]/i
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
    { pattern: /瓶装/, token: "bottle" },
    { pattern: /管装/, token: "tube" },
    { pattern: /罐装/, token: "jar" },
    { pattern: /袋包|袋装|补充|替换|refill|sachet|bag/i, token: "refill|sachet|bag" }
  ];
  for (const rule of categoryRules) {
    if (!rule.pattern.test(normalizedKey)) continue;
    const matched = items.filter((item) => new RegExp(`[-/](?:${rule.token})[-/]`, "i").test(String(item).replace(/\\/g, "/")));
    if (matched.length === 1) return matched[0];
  }
  if (!/开盖|open-?cap/i.test(normalizedKey)) {
    const closed = items.filter((item) => !/open-?cap/i.test(String(item)));
    if (closed.length === 1) return closed[0];
  }
  if (!/袋包|袋装|补充|替换|refill|sachet|bag/i.test(normalizedKey)) {
    const bottle = items.filter((item) => /[-/]bottle[-/]/i.test(String(item).replace(/\\/g, "/")));
    if (bottle.length === 1) return bottle[0];
  }
  return "";
}

function normalizeProductNameKey(value) {
  return String(value || "")
    .trim()
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/\s+/g, "")
    .replace(/[－–—―-]/g, "-")
    .toLowerCase();
}

function getProductNameLookupKeys(value) {
  const normalized = normalizeProductNameKey(value);
  const keys = [normalized];
  const withoutBrand = normalized.replace(/^一页(?=婴童|婴儿|新生儿|儿童|学龄|青春)/u, "");
  if (withoutBrand && withoutBrand !== normalized) {
    keys.push(withoutBrand);
  }
  return Array.from(new Set(keys.filter(Boolean)));
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

  const english = String(productEn || "").toLowerCase();
  const combined = `${product || ""} ${standardProduct || ""} ${english}`;

  if (/repairing\s*cream|\u4fee\u62a4\u971c|\u5b66\u9f84\u971c|\u5b89\u5fc3\u971c/i.test(combined)) {
    add("\u4fee\u62a4\u971c");
    add("\u5b89\u5fc3\u971c");
    add("\u5b66\u9f84\u971c");
  }

  if (/soothing\s*cream|\u8212\u7f13\u971c/i.test(combined)) {
    add("\u8212\u7f13\u971c");
    add("\u5b89\u5fc3\u971c");
  }

  if (/body\s*lotion|\u8eab\u4f53\u4e73|\u4fdd\u6e7f\u4e73/i.test(combined)) {
    add("\u8eab\u4f53\u4e73");
    add("\u4fdd\u6e7f\u4e73");
    aliases.delete("\u5b89\u5fc3\u971c");
  }

  if (/foaming\s*(wash|body\s*wash|shampoo)|body\s*wash|cleansing\s*foam|\u6ce1\u6ce1\u6d17\u6c90|\u6ce1\u6ce1\u6c90\u6d74/i.test(combined)) {
    add("\u6ce1\u6ce1\u6d17\u6c90");
    add("\u6ce1\u6ce1\u6c90\u6d74\u9732");
    add("泡泡洗发沐浴");
    add("\u6c90\u6d74\u9732");
  }

  if (/essential\s*oil|stickers?|patch|\u7cbe\u6cb9\u8d34|\u8d34\u7247/i.test(combined)) {
    add("\u7cbe\u6cb9\u8d34\u7247");
    add("\u7cbe\u6cb9\u8d34");
    add("\u8d34\u7247");
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
    add("修护");
    add("安心");
    add("学龄");
  }
  if (/soothing[-\s]*cream/.test(combined)) {
    add("舒缓");
    add("安心");
  }
  if (/cooling[-\s]*cream/.test(combined)) {
    add("夏季安心");
    add("安心");
    add("冰沙");
  }
  if (/body[-\s]*lotion/.test(combined)) {
    add("身体");
    add("保湿");
    add("高保湿乳");
  }
  if (/sunscreen[-\s]*lotion|sunscreen/.test(combined)) {
    add("防晒");
  }
  if (/foaming[-\s]*(wash|body[-\s]*wash|shampoo)|body[-\s]*wash|cleansing[-\s]*foam/.test(combined)) {
    add("洁面");
    add("泡泡洗沐");
    add("泡泡沐浴");
    add("沐浴");
  }
  if (/repellent[-\s]*spray/.test(combined)) {
    add("\u9a71\u868a\u55b7\u96fe");
  }
  if (/floral[-\s]*water|smoothing[-\s]*spray/.test(combined)) {
    add("\u53ee\u53ee\u55b7\u96fe");
  }
  if (/conditioner/.test(combined)) {
    add("护发");
  }
  if (/spray/.test(combined)) {
    add("喷雾");
  }
  if (/essence|ampoule/.test(combined)) {
    add("精华");
    add("次抛");
  }
  if (/essential[-\s]*oil|stickers?|patch/i.test(combined) || /精华贴片|精油贴|贴片/.test(combined)) {
    add("精华贴片");
    add("精油");
    add("贴片");
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

function shouldUseCurrentArtboardScope() {
  const switchConfig = getArtboardSwitchConfig();
  return !!(switchConfig && switchConfig.enabled && state.currentArtboardLayer && state.currentArtboardLayer.layers);
}

function findLayerByNameUnscoped(doc, name) {
  const layers = getAllLayers(doc.layers);
  const exact = layers.find((layer) => layer.name === name);
  if (exact) return exact;

  const normalized = String(name || "").trim().toLowerCase();
  if (!normalized) return null;
  return layers.find((layer) => String(layer.name || "").trim().toLowerCase() === normalized) || null;
}

function findLayerByName(doc, name) {
  if (shouldUseCurrentArtboardScope()) {
    return findLayerByNameInLayer(state.currentArtboardLayer, name) || null;
  }
  return findLayerByNameUnscoped(doc, name);
}

function findLayersByNameUnscoped(doc, name) {
  const normalized = String(name || "").trim().toLowerCase();
  return getAllLayers(doc.layers).filter((layer) => {
    return layer.name === name || String(layer.name || "").trim().toLowerCase() === normalized;
  });
}

function findLayersByName(doc, name) {
  if (shouldUseCurrentArtboardScope()) {
    return findLayersByNameInLayer(state.currentArtboardLayer, name, []);
  }
  return findLayersByNameUnscoped(doc, name);
}

function findLayerByPath(doc, path) {
  const exact = findLayerByName(doc, path);
  if (exact) return exact;

  const parts = String(path || "").split(".").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return null;

  let layers = doc.layers;
  let current = null;
  for (const part of parts) {
    current = Array.from(layers || []).find((layer) => layer.name === part);
    if (!current) return null;
    layers = current.layers || [];
  }
  return current;
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

function setLayersVisibleByAnyName(doc, names, visible, label) {
  const seen = new Set();
  let count = 0;
  for (const name of names || []) {
    const layers = findLayersByName(doc, name);
    for (const layer of layers) {
      if (!layer || seen.has(layer)) continue;
      seen.add(layer);
      setLayerVisibleRecursive(layer, visible);
      count += 1;
    }
  }
  if (!count) {
    log(`  Skip: layer not found: ${label || (names && names[0]) || "layer"}`);
  } else {
    log(`  Layer visibility set: ${label || (names && names[0]) || "layer"}=${visible ? "on" : "off"}, count=${count}.`);
  }
  return count;
}

function setLayerVisibleByAnyName(doc, names, visible, label) {
  const layer = findLayerByAnyName(doc, names);
  if (!layer) {
    log(`  Skip: layer not found: ${label || names[0]}`);
    return null;
  }
  layer.visible = visible;
  if (visible) {
    let parent = layer.parent;
    while (parent && parent !== doc) {
      try {
        parent.visible = true;
      } catch (error) {
        break;
      }
      parent = parent.parent;
    }
  }
  log(`  Layer visibility set: ${layer.name}=${visible ? "on" : "off"}.`);
  return layer;
}

function parseVisibilityValue(value, defaultValue) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return Boolean(defaultValue);
  if (["1", "true", "yes", "y", "on", "show", "visible", "显示", "开", "开启", ""].includes(raw)) return true;
  if (["0", "false", "no", "n", "off", "hide", "hidden", "隐藏", "", "关闭", ""].includes(raw)) return false;
  return Boolean(defaultValue);
}

function normalizeSwitchToken(value) {
  return String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function resolveSwitchVariant(value, variants, defaultVariant) {
  const normalized = normalizeSwitchToken(value || defaultVariant);
  for (const [variantKey, variant] of Object.entries(variants || {})) {
    const tokens = [variantKey, ...(variant.tokens || [])].map(normalizeSwitchToken);
    if (tokens.includes(normalized)) return variantKey;
  }
  return defaultVariant;
}

function applyBackgroundSwitch(doc, row) {
  const switchConfig = getCurrentTemplateConfig().backgroundSwitch;
  if (!switchConfig || !switchConfig.enabled) return;

  const variants = switchConfig.variants || {};
  const selectedKey = resolveSwitchVariant(row && row[switchConfig.column], variants, switchConfig.defaultVariant);
  for (const [variantKey, variant] of Object.entries(variants)) {
    const visible = variantKey === selectedKey;
    setLayerVisibleByAnyName(doc, variant.names || [], visible, variantKey);
  }
  log(`  Background switch: ${switchConfig.column || "background"}=${selectedKey}.`);
}

function applyLayerVisibilitySwitches(doc, row) {
  const switches = getCurrentTemplateConfig().layerVisibilitySwitches || [];
  for (const switchConfig of switches) {
    const columns = switchConfig && (switchConfig.columns || [switchConfig.column]).filter(Boolean);
    if (!columns || !columns.length) continue;
    const explicitColumn = columns.find((column) => hasValue(row, column));
    if (!explicitColumn && switchConfig.preserveWhenMissing) continue;
    const selectedColumn = explicitColumn || columns[0];
    const visible = parseVisibilityValue(row && row[selectedColumn], switchConfig.defaultVisible);
    setLayerVisibleByAnyName(doc, switchConfig.names || [], visible, switchConfig.label || selectedColumn);
    log(`  Layer switch: ${selectedColumn}=${visible ? "on" : "off"}.`);
  }
}

function getDynamicIconSwitchConfig(config = getCurrentTemplateConfig()) {
  const switchConfig = config && config.dynamicIconSwitch;
  if (!switchConfig || !switchConfig.enabled) return null;
  return {
    groupNames: ["ICON"],
    prefixes: ["icon.", "daily.icon.", "pdd.icon."],
    listColumns: ["icon.layers", "icon.names", "icon.list", "daily.icons", "pdd.icons"],
    defaultVisible: false,
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

function hasDynamicIconControls(row, switchConfig) {
  return Object.keys(row || {}).some((column) => {
    return isDynamicIconListColumn(column, switchConfig) || !!getDynamicIconColumnToken(column, switchConfig);
  });
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
  const seen = new Set();
  let groupCount = 0;
  let childCount = 0;
  for (const groupName of switchConfig.groupNames || []) {
    for (const layer of findLayersByName(doc, groupName)) {
      if (!layer || !layer.layers || seen.has(layer)) continue;
      seen.add(layer);
      layer.visible = true;
      groupCount += 1;
      childCount += setChildLayersVisibleRecursive(layer, false);
    }
  }
  if (groupCount) {
    log(`  Dynamic icon reset: groups=${groupCount}, layers=${childCount}.`);
  } else {
    log(`  Dynamic icon reset skipped: ICON group not found.`);
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
  if (!switchConfig || !hasDynamicIconControls(row, switchConfig)) return;

  hideDynamicIconGroups(doc, switchConfig);

  for (const column of switchConfig.listColumns || []) {
    if (!hasValue(row, column)) continue;
    for (const token of splitDynamicIconList(row[column])) {
      const names = getDynamicIconLayerNames(token, switchConfig);
      setLayersVisibleByAnyName(doc, names, true, `dynamic icon ${token}`);
      log(`  Dynamic icon switch: ${column}:${token}=on.`);
    }
  }

  for (const [column, value] of Object.entries(row || {})) {
    const token = getDynamicIconColumnToken(column, switchConfig);
    if (!token) continue;
    const visible = parseVisibilityValue(value, switchConfig.defaultVisible);
    if (!visible) {
      log(`  Dynamic icon switch: ${column}=off.`);
      continue;
    }
    const names = getDynamicIconLayerNames(token, switchConfig);
    setLayersVisibleByAnyName(doc, names, true, `dynamic icon ${token}`);
    log(`  Dynamic icon switch: ${column}=on.`);
  }
}

function hasGiftContent(row) {
  return !!row && (
    hasGiftLeftContent(row) ||
    hasValue(row, "img.gift") ||
    hasValue(row, "img.giftSet") ||
    hasValue(row, "img.gift.1") ||
    hasValue(row, "txt.giftProductLabel") ||
    hasValue(row, "gift.name.cn")
  );
}

function applyGiftTagVisibility(doc, row) {
  const switchConfig = getGiftBadgeConfig();
  if (!switchConfig || !switchConfig.enabled) return;

  const names = switchConfig.layerNames || switchConfig.names || ["gifttag"];
  const columns = switchConfig.columns || [switchConfig.controlColumn, "gift.badge", "gift.tag", "gifttag", "showGiftTag"].filter(Boolean);
  const explicitColumn = columns.find((column) => hasValue(row, column));
  const defaultVisible = hasGiftContent(row) || getGiftCount(row || {}, "gift") > 0;
  const visible = explicitColumn
    ? parseVisibilityValue(row && row[explicitColumn], defaultVisible)
    : defaultVisible;

  setLayersVisibleByAnyName(doc, names, false, "gifttag");
  if (visible) {
    const currentTag = findLayerByAnyNameInCurrentMechanismOnly(doc, row, names) || findLayerByAnyName(doc, names);
    if (currentTag) {
      currentTag.visible = true;
    } else {
      log("  Skip: layer not found: gifttag");
    }
  }
  log("  Gift tag switch: " + (visible ? "on" : "off") + ".");
}
function cleanPddMainProductNameForBottomText(value) {
  return String(value || "")
    .trim()
    .replace(/\s*(?:\*|x|X|\u00d7)\s*1(?=\s*(?:$|[+\uFF0B\/\u3001,\uFF0C;\uFF1B|]))/g, "")
    .replace(/\s*([+\uFF0B\/\u3001,\uFF0C;\uFF1B|])\s*/g, "$1");
}

function applyBottomTextFromProductName(row) {
  const config = getCurrentTemplateConfig().bottomTextFromProductName;
  if (!config || !config.enabled || !row) return row;

  if (Array.isArray(config.mechanisms) && config.mechanisms.length) {
    const switchConfig = getMechanismSwitchConfig() || {};
    const mechanism = getDailyMechanismType(row, switchConfig);
    if (!config.mechanisms.map(String).includes(String(mechanism))) return row;
  }

  const sourceColumn = config.sourceColumn || "product.name.cn";
  const targetColumn = config.targetColumn || "txt.bottomText";
  if (config.overwrite !== true && hasValue(row, targetColumn)) return row;
  const sourceValue = row[sourceColumn];
  if (!hasValue({ value: sourceValue }, "value")) return row;

  const bottomText = cleanPddMainProductNameForBottomText(sourceValue);
  if (!bottomText) return row;

  row[targetColumn] = bottomText;
  log(`  Bottom text sourced from ${sourceColumn}: ${bottomText}`);
  return row;
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
  const layout = String(getImageGroupValue(row, prefix, "layout", "") || "").trim().toLowerCase();
  if (layout) return layout;
  return prefix === "product" ? "auto" : "overlap";
}

function getImageGroupZOrder(row, prefix) {
  return String(getImageGroupValue(row, prefix, "zOrder", "leftFront") || "leftFront").trim() || "leftFront";
}

function getImageGroupAliasPrefix(prefix) {
  return prefix === "gift" ? "giftRight" : "";
}

function getImageGroupValue(row, prefix, key, fallback = "") {
  if (row && row[`${prefix}.${key}`] !== undefined && row[`${prefix}.${key}`] !== null && row[`${prefix}.${key}`] !== "") {
    return row[`${prefix}.${key}`];
  }
  const aliasPrefix = getImageGroupAliasPrefix(prefix);
  if (aliasPrefix && row && row[`${aliasPrefix}.${key}`] !== undefined && row[`${aliasPrefix}.${key}`] !== null && row[`${aliasPrefix}.${key}`] !== "") {
    return row[`${aliasPrefix}.${key}`];
  }
  return fallback;
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
  if (/(ampoule|次抛|安瓶|set-\d+x|\d+x|sticker|stickers|patch|贴片|精油贴)/.test(text)) return "ampoule";
  if (/(tube|管装|软管)/.test(text)) return "tube";
  if (/(pump|泵|按压)/.test(text)) return "pump";
  if (/(jar|pot|罐装)/.test(text)) return "jar";
  if (/(canvas[-_\s]*bag|gift[-_\s]*bag|帆布袋|袋装)/.test(text)) return "bag";
  if (/(bottle|瓶装)/.test(text)) return "bottle";
  if (/(cream|面霜)/.test(text)) return "jar";
  if (/(安心霜|学龄霜|冰沙霜)/.test(text)) return "jar";
  if (/(diaper|repairing|身体乳?00g)/.test(text)) return "tube";
  if (/(wash|foam|shampoo|body-lotion|lotion|乳|oil|精油|sunscreen|sun)/.test(text)) return "bottle";
  return "default";
}

function isSmallBagSachetSource(source) {
  const text = String(source || "")
    .toLowerCase()
    .replace(/\\/g, "/")
    .replace(/[_\s]+/g, "-");
  return /(?:bag|袋包|袋装)[^/]*(?:5g|5ml)|(?:5g|5ml)[^/]*(?:bag|袋包|袋装)|(?:sachet|小袋|片装)[^/]*(?:8g|8ml)|(?:8g|8ml)[^/]*(?:sachet|小袋|片装)|bath-oil-5g/i.test(text);
}

function isStickerPatchSource(source) {
  return /(sticker|stickers|patch|贴片|精油贴)/i.test(String(source || ""));
}

function isFlatAmpoulePacketSource(source) {
  return isSmallBagSachetSource(source) || isStickerPatchSource(source);
}

function isAmpouleCategorySource(source) {
  return getProductCategoryFromSource(source) === "ampoule" || isAmpouleSetSource(source);
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
  if (prefix === "giftLeft" || prefix === "giftRight" || prefix === "gift") {
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
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/[×Ｘｘ]/g, "x");

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

function isYouthSeriesProductSource(source) {
  const text = String(source || "")
    .toLowerCase()
    .replace(/\\/g, "/");
  return /(?:^|[\/_-])(?:1218|youth)(?:[\/_.-]|$)|青春/.test(text);
}

function readYouthProductHeightRatio(row, key, fallback, aliases = []) {
  return readProductHeightRatio(row, `youth${key}`, fallback, [
    `product.1218${key}HeightRatio`,
    ...aliases
  ]);
}

function getYouthBottleHeightRatioBySpec(row, size, mode) {
  const same = mode === "same";
  if (size >= 500) return readYouthProductHeightRatio(row, "Bottle500", same ? 0.98 : 0.95);
  if (size >= 300) return readYouthProductHeightRatio(row, "Bottle300", same ? 0.91 : 0.86);
  if (size >= 150) return readYouthProductHeightRatio(row, "Bottle150", same ? 0.86 : 0.8);
  if (size >= 120) return readYouthProductHeightRatio(row, "Bottle120", same ? 0.82 : 0.76);
  if (size >= 60) return readYouthProductHeightRatio(row, "Bottle60", same ? 0.74 : 0.68);
  if (size >= 50) return readYouthProductHeightRatio(row, "Bottle50", same ? 0.72 : 0.66);
  if (size >= 40) return readYouthProductHeightRatio(row, "Bottle40", same ? 0.7 : 0.64);
  if (size >= 30) return readYouthProductHeightRatio(row, "Bottle30", same ? 0.66 : 0.6);
  if (size >= 15) return readYouthProductHeightRatio(row, "Bottle15", same ? 0.58 : 0.52);
  if (size > 0) return readYouthProductHeightRatio(row, "Bottle5", same ? 0.5 : 0.44);
  return readYouthProductHeightRatio(row, "BottleDefault", same ? 0.86 : 0.78);
}

function getYouthJarHeightRatioBySpec(row, size, mode) {
  const same = mode === "same";
  if (size >= 50) return readYouthProductHeightRatio(row, "Jar50", same ? 0.58 : 0.46);
  if (size >= 30) return readYouthProductHeightRatio(row, "Jar30", same ? 0.52 : 0.42);
  if (size >= 10) return readYouthProductHeightRatio(row, "Jar10", same ? 0.44 : 0.34);
  if (size > 0) return readYouthProductHeightRatio(row, "JarSmall", same ? 0.4 : 0.32);
  return readYouthProductHeightRatio(row, "JarDefault", same ? 0.56 : 0.46);
}

function getYouthTubeHeightRatioBySpec(row, size, mode) {
  const same = mode === "same";
  if (size >= 200) return readYouthProductHeightRatio(row, "Tube200", same ? 0.94 : 0.9);
  if (size >= 100) return readYouthProductHeightRatio(row, "Tube100", same ? 0.88 : 0.82);
  if (size >= 80) return readYouthProductHeightRatio(row, "Tube80", same ? 0.86 : 0.8);
  if (size >= 35) return readYouthProductHeightRatio(row, "Tube35", same ? 0.74 : 0.68);
  if (size >= 30) return readYouthProductHeightRatio(row, "Tube30", same ? 0.7 : 0.64);
  if (size >= 15) return readYouthProductHeightRatio(row, "Tube15", same ? 0.72 : 0.66);
  if (size >= 10) return readYouthProductHeightRatio(row, "Tube10", same ? 0.58 : 0.5);
  if (size > 0) return readYouthProductHeightRatio(row, "Tube5", same ? 0.52 : 0.46);
  return readYouthProductHeightRatio(row, "TubeDefault", same ? 0.84 : 0.72);
}

function getYouthAmpouleHeightRatioBySpec(row, size, mode, source) {
  const same = mode === "same";
  const text = String(source || "").toLowerCase();
  if (isAmpouleSetSource(source)) {
    if (/(?:30x|\*\s*30|x\s*30)/i.test(text)) return readYouthProductHeightRatio(row, "AmpouleSet30", 0.72);
    if (/(?:5x|\*\s*5|x\s*5)/i.test(text)) return readYouthProductHeightRatio(row, "AmpouleSet5", 0.66);
    if (/(?:3x|\*\s*3|x\s*3)/i.test(text)) return readYouthProductHeightRatio(row, "AmpouleSet3", 0.62);
    return readYouthProductHeightRatio(row, "AmpouleSet", 0.66);
  }
  if (isFlatAmpoulePacketSource(source)) return readYouthProductHeightRatio(row, "AmpouleBag", same ? 0.68 : 0.6);
  if (size >= 10) return readYouthProductHeightRatio(row, "Ampoule10", same ? 0.6 : 0.54);
  return readYouthProductHeightRatio(row, "AmpouleDefault", same ? 0.72 : 0.66);
}

function getYouthSeriesProductHeightRatio(row, category, specs, mode, source) {
  const size = getProductSpecSize(specs);
  const text = String(source || "").toLowerCase();
  if (/(?:refill|补充|替换)/i.test(text)) {
    return readYouthProductHeightRatio(row, "Refill300", mode === "same" ? 0.72 : 0.66);
  }
  if (/(?:face[-_\s]*mask[-_\s]*box|面膜盒)/i.test(text)) {
    return readYouthProductHeightRatio(row, "MaskBox", 0.62);
  }
  if (/(?:face[-_\s]*mask|cotton[-_\s]*pad|sachet|片装|袋包|袋装)/i.test(text)) {
    return readYouthProductHeightRatio(row, "Sachet", mode === "same" ? 0.68 : 0.6);
  }
  if (category === "ampoule") return getYouthAmpouleHeightRatioBySpec(row, size, mode, source);
  if (category === "jar") return getYouthJarHeightRatioBySpec(row, size, mode);
  if (category === "tube") return getYouthTubeHeightRatioBySpec(row, size, mode);
  if (category === "pump" || category === "bottle") return getYouthBottleHeightRatioBySpec(row, size, mode);
  if (category === "bag") return readYouthProductHeightRatio(row, "Bag", 0.68);
  return readYouthProductHeightRatio(row, "Default", mode === "same" ? 0.86 : 0.76);
}
function isAmpouleSetSource(source) {
  const text = String(source || "").toLowerCase();
  return /(ampoule[-_\s]*set|set-\d+x|\d+x|\*\s*\d+|次抛.*(?:x|\*)\s*\d+)/.test(text);
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
  if (getCurrentTemplateConfig().id === "pddDailyMain" && size > 0 && size < 10) {
    return readProductHeightRatio(row, "pddDailyBottleSmall", 0.88, ["product.lipBalmHeightRatio", "product.bottle5HeightRatio", "product.lotion5HeightRatio"]);
  }
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
  if (size >= 10) return readProductHeightRatio(row, "tube10", same ? 0.5 : 0.42);
  if (size > 0) return readProductHeightRatio(row, "tube5", same ? 0.42 : 0.36);
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
  if (options.useReference && !isYouthSeriesProductSource(source)) {
    const referenceRatio = getReferenceProductHeightRatio(row, category, specs, source);
    if (Number.isFinite(referenceRatio)) return referenceRatio;
  }
  if (category === "bottle" && specs.g === 200) {
    return readProductHeightRatio(row, "bottle200g", mode === "same" ? 0.92 : 0.88);
  }
  if (category === "bottle" && specs.g === 50) {
    return readProductHeightRatio(row, "bottle50g", mode === "same" ? 0.58 : 0.46);
  }
  if (isYouthSeriesProductSource(source)) return getYouthSeriesProductHeightRatio(row, category, specs, mode, source);
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
  const specs = getProductSpecFromSource(source);
  return getChartProductHeightRatio(row, category, specs, mode, source, {
    useReference: shouldUseReferenceProductHeightRatio(row, count)
  });
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
  const defaultMode = prefix === "product" || prefix === "giftLeft" || prefix === "giftRight" || prefix === "gift" ? "place" : "placeholder";
  const mode = String(getImageGroupValue(row, prefix, "sourceMode", "") || getImageGroupValue(row, prefix, "copyMode", "") || defaultMode).trim().toLowerCase();
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

  if (prefix === "gift") {
    return readNumber(row, "gift.scale", readNumber(row, "giftRight.scale", 1));
  }

  return readNumber(row, `${prefix}.scale`, 1);
}

function getLayerScaleForInitialPlacement(row, prefix) {
  return prefix === "product" ? 1 : getImageGroupScale(row, prefix);
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
  ].some((key) => hasEnabledValue(row, key));
}

function hasEnabledValue(row, key) {
  if (!hasValue(row, key)) return false;
  const raw = String(row[key]).trim().toLowerCase();
  return !["0", "false", "no", "n", "off", "hide", "hidden", "none", "null", "undefined", "", "", "隐藏", "", "关闭"].includes(raw);
}

function hasPersonContent(row) {
  if (!row) return false;
  return [
    "img.person",
    "people",
    "person",
    "人物",
    "达人",
    "代言人"
  ].some((key) => hasEnabledValue(row, key));
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

function normalizeDailyMechanism(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  const match = text.match(/[1-4]/);
  if (match) return match[0];
  if (text.includes("official") || text.includes("flagship") || text.includes("旗舰") || text.includes("官方")) return "2";
  if (text.includes("diff") || text.includes("pddmain") || text.includes("pdd_main") || text === "main") return "4";
  if (text.includes("nogift") || text.includes("no-gift") || text.includes("none") || text.includes("无赠") || text.includes("无礼") || text.includes("无买")) return "3";
  if (text.includes("gift") || text.includes("left") || text.includes("赠品") || text.includes("买即") || text.includes("买即")) return "1";
  return "";
}

function hasAnyConfiguredValue(row, columns) {
  return (columns || []).some((column) => hasEnabledValue(row, column));
}

function getGiftAndPersonMechanismType(row, switchConfig) {
  const giftColumns = switchConfig.giftPresenceColumns || [];
  const personColumns = switchConfig.personPresenceColumns || [];
  const hasGift = giftColumns.length
    ? hasAnyConfiguredValue(row, giftColumns)
    : hasGiftContent(row) || getGiftCount(row || {}, "gift") > 0;
  const hasPerson = personColumns.length
    ? hasAnyConfiguredValue(row, personColumns)
    : hasPersonContent(row);

  if (hasGift && hasPerson) return "1";
  if (hasGift) return "2";
  if (hasPerson) return "3";
  return "4";
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
  if (!switchConfig || !switchConfig.enabled) return "";
  if (switchConfig.fixedMechanism) return String(switchConfig.fixedMechanism);
  if (switchConfig.byGiftAndPerson && switchConfig.autoOverridesExplicit) {
    return getGiftAndPersonMechanismType(row, switchConfig);
  }

  for (const column of getMechanismColumnCandidates(switchConfig)) {
    const explicit = normalizeDailyMechanism(row && row[column]);
    if (explicit) return explicit;
  }

  const sheet = normalizeDailyMechanism(row && row.sheet);
  if (sheet) return sheet;

  if (switchConfig.byGiftAndPerson) {
    return getGiftAndPersonMechanismType(row, switchConfig);
  }

  if (hasGiftLeftContent(row) || hasValue(row, "img.gift") || hasValue(row, "img.gift.1")) return "1";
  return String(switchConfig.defaultMechanism || "3");
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

function setDailyGiftLayerVisibility(doc, switchConfig, position, giftType) {
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
  const opened = setLayersVisibleByAnyName(doc, activeNames, true, `img.gift${position === "right" ? "Right" : "Middle"}.${giftType}`);
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
  const middleType = type === "2" ? "" : requestedMiddleType;
  setDailyGiftLayerVisibility(doc, switchConfig, "middle", middleType);

  const requestedRightType = getDailyGiftRightType(row);
  const rightType = type === "2" ? "" : requestedRightType;
  setDailyGiftLayerVisibility(doc, switchConfig, "right", rightType);

  const showLeft298 = type === "4" || String(row && row["daily.left298"] || "").trim() === "1";
  setLayersVisibleByAnyName(doc, switchConfig.left298Layers || [], showLeft298, "img.giftLeft.298");
  log(`  Daily switch: mechanism=${type}, middleGift=${middleType || "none"}, rightGift=${rightType || "none"}${type === "2" && (requestedMiddleType || requestedRightType) ? `, ignoredGift=${requestedMiddleType || requestedRightType}` : ""}.`);
}

function findGiftImageGroupInLayer(parentLayer) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  return findLayerByAnyNameInLayer(parentLayer, switchConfig.giftImageGroupNames || [
    "giftimage",
    "giftImage",
    "gift.image",
    "giftLeftimage",
    "giftLeftImage",
    "giftLeft.image"
  ]);
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
function scoreMechanismLayerCandidate(layer, switchConfig) {
  if (!layer) return 0;
  const preferredNames = switchConfig.preferredMechanismLayerNames || [];
  return preferredNames.reduce((score, name) => {
    return score + (findLayerByNameInLayer(layer, name) ? 1 : 0);
  }, 0);
}

function choosePreferredMechanismLayerCandidate(candidates, switchConfig) {
  const preferredNames = switchConfig.preferredMechanismLayerNames || [];
  if (!preferredNames.length) return null;
  let best = null;
  const summary = [];
  for (const [index, layer] of (candidates || []).entries()) {
    const score = scoreMechanismLayerCandidate(layer, switchConfig);
    const visibleBonus = layer && layer.visible !== false ? 100 : 0;
    const total = score + visibleBonus;
    summary.push(`#${index}:${layer ? layer.name : "?"}:${layer && layer.visible !== false ? "visible" : "hidden"}:score=${score}:total=${total}`);
    if (!score) continue;
    if (!best || total > best.total) best = { layer, total };
  }
  log(`  Mechanism candidates: ${summary.join(" | ") || "none"}; chosen=${best && best.layer ? best.layer.name : "default"}.`);
  return best ? best.layer : null;
}

function findDailyMechanismLayer(doc, row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (!switchConfig.enabled) return null;
  const type = getDailyMechanismType(row || state.currentRow || {}, switchConfig);
  const names = getMechanismGroupNames(switchConfig, type);
  const candidates = [];
  for (const name of names || []) {
    candidates.push(...findLayersByName(doc, name));
  }
  return choosePreferredMechanismLayerCandidate(candidates, switchConfig) ||
    candidates.find((layer) => layer && layer.visible !== false && findGiftImageGroupInLayer(layer)) ||
    candidates.find((layer) => layer && findGiftImageGroupInLayer(layer)) ||
    candidates.find((layer) => layer && layer.visible !== false) ||
    candidates[0] ||
    null;
}

function findCurrentGiftImageGroup(doc, row) {
  const mechanismLayer = findDailyMechanismLayer(doc, row);
  return mechanismLayer ? findGiftImageGroupInLayer(mechanismLayer) : null;
}

function findCurrentMechanismLayerByName(doc, row, name) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (switchConfig.enabled) {
    const mechanismLayer = findDailyMechanismLayer(doc, row || state.currentRow || {});
    const layer = mechanismLayer && findLayerByNameInLayer(mechanismLayer, name);
    if (layer) return layer;
  }
  return findLayerByName(doc, name);
}

function findLayerByNameInCurrentMechanismOnly(doc, row, name) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (!switchConfig.enabled) return null;
  const mechanismLayer = findDailyMechanismLayer(doc, row || state.currentRow || {});
  return mechanismLayer ? findLayerByNameInLayer(mechanismLayer, name) : null;
}

function findLayerByAnyNameInCurrentMechanismOnly(doc, row, names) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (!switchConfig.enabled) return null;
  const mechanismLayer = findDailyMechanismLayer(doc, row || state.currentRow || {});
  return mechanismLayer ? findLayerByAnyNameInLayer(mechanismLayer, names) : null;
}

function findCurrentProductLayer(doc, row, name = "img.product") {
  return findCurrentMechanismLayerByName(doc, row, name);
}

function findLayerForDataColumn(doc, column, row) {
  if (/^img\.(?:product|gift)(?:\.\d+)?$/.test(column)) {
    return findCurrentMechanismLayerByName(doc, row, column);
  }
  return column.startsWith("txt.") ? findTextLayerForColumn(doc, column, row) : findLayerByName(doc, column);
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
  const mechanismSwitchConfig = getMechanismSwitchConfig(config);
  const scoped = switchConfig.scopeCurrentMechanism && mechanismSwitchConfig && mechanismSwitchConfig.enabled;
  const legacyLayer = scoped
    ? findLayerByNameInCurrentMechanismOnly(doc, row, switchConfig.legacyName || "img.person")
    : findLayerByName(doc, switchConfig.legacyName || "img.person");
  const variantLayers = {};

  for (const [variantType, variant] of Object.entries(switchConfig.variants || {})) {
    const names = variant.names || [];
    if (scoped) setLayersVisibleByAnyName(doc, names, false, `person ${variantType}`);
    variantLayers[variantType] = scoped
      ? findLayerByAnyNameInCurrentMechanismOnly(doc, row, names)
      : findLayerByAnyName(doc, names);
  }

  if (!scoped) {
    Object.values(variantLayers).forEach((layer) => {
      if (layer) layer.visible = false;
    });
  }

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
      fontName: latinName || TITLE_FONT_RULE.latin.fontName,
      fontStyleName: TITLE_FONT_RULE.latin.fontStyleName || "Regular"
    },
    chinese: {
      postScriptName: String(row && (row["txt.titleChineseFontPostScript"] || row["title.chineseFontPostScript"]) || chineseName || TITLE_FONT_RULE.chinese.postScriptName).trim(),
      fontName: chineseName || TITLE_FONT_RULE.chinese.fontName,
      fontStyleName: TITLE_FONT_RULE.chinese.fontStyleName || "Regular"
    }
  };
}

function parseTitleSuperscriptMarkup(value) {
  const input = String(value || "");
  const superscripts = [];
  let output = "";
  let index = 0;
  const pattern = /<sup\s*([0-9A-Za-z*]+)\s*>|<sup>(.*?)<\/sup>|[\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079]/g;
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
    const from = Array.from(output).length;
    output += text;
    const to = Array.from(output).length;
    if (text) superscripts.push({ from, to });
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

function buildMixedTextStyleRanges(text, baseStyle, styleConfig) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = getMixedTextKind(char, styleConfig);
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
    const kind = getMixedTextKind(char, styleConfig);
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
    if (!kind) return;
    if (result[kind] && result[kind] !== fallbackStyle) return;

    const range = getStyleRangeForIndex(ranges, index);
    if (range && range.textStyle) {
      result[kind] = range.textStyle;
    }
  });

  return result;
}

function isTitleTemplateLatinChar(char) {
  return !isCjkTextChar(char);
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
}
function applyLeadingToTemplateTextStyle(style, leadingRatio, fallbackStyle) {
  if (!Number.isFinite(leadingRatio) || leadingRatio <= 0) return style;
  const baseSize = getTextStylePointSize(style) || getTextStylePointSize(fallbackStyle);
  if (!Number.isFinite(baseSize) || baseSize <= 0) return style;
  const leading = baseSize * leadingRatio;
  return {
    ...(style || {}),
    autoLeading: false,
    leading: makePointValue(leading),
    impliedLeading: makePointValue(leading)
  };
}

function buildTitleTemplateTextStyleRanges(text, styleByKind, baseStyle, options = {}) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let currentKind = null;

  chars.forEach((char, index) => {
    const kind = isTitleTemplateLatinChar(char) ? "latin" : "chinese";
    if (currentKind === null) {
      currentKind = kind;
      start = index;
      return;
    }
    if (kind !== currentKind) {
      ranges.push({ from: start, to: index, kind: currentKind });
      currentKind = kind;
      start = index;
    }
  });

  if (currentKind !== null) {
    ranges.push({ from: start, to: chars.length, kind: currentKind });
  }

  const leadingRatio = Number(options.leadingRatio);
  return ranges.map((range) => {
    const style = applyTitleFontToTemplateStyle(styleByKind[range.kind] || baseStyle, range.kind);
    return {
      _obj: "textStyleRange",
      from: range.from,
      to: range.to,
      textStyle: applyLeadingToTemplateTextStyle(style, leadingRatio, baseStyle)
    };
  });
}

async function replaceTitleLayerKeepTemplateStyle(layer, value, options = {}) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const textValue = toPhotoshopText(value);
  const textLength = Array.from(textValue).length;

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
      await replaceTextLayerPreserveFirstStyle(layer, value);
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
            textStyleRange: applySuperscriptsToTextStyleRanges(buildTitleTemplateTextStyleRanges(textValue, styleByKind, baseStyle, options), options.superscripts || [], { styleByKind })
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
    log(`  Title text replaced; template title font/style preserved, superscripts=${(options.superscripts || []).length}.`);
  } catch (error) {
    log(`  Title template style replace skipped: ${formatError(error)}`);
    await replaceTextLayerPreserveFirstStyle(layer, value);
  }
}
function buildMixedTextTemplateStyleRanges(text, styleByKind, styleConfig) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = getMixedTextKind(char, styleConfig);
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

function getBottomTextTemplateTextStyle(style, fallbackStyle) {
  return { ...(style || fallbackStyle || {}) };
}

function buildBottomTextTemplateStyleRanges(text, styleByKind, scale = 1, options = {}) {
  const chars = Array.from(toPhotoshopText(text));
  const ranges = [];
  let start = 0;
  let current = null;

  chars.forEach((char, index) => {
    const kind = getMixedTextKind(char, { symbolsAsLatin: true, ...(options || {}) });
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

  const chineseStyle = styleByKind.chinese || styleByKind.latin;
  const latinStyle = getBottomTextTemplateTextStyle(styleByKind.latin, chineseStyle);
  return ranges.map((range) => ({
    _obj: "textStyleRange",
    from: range.from,
    to: range.to,
    textStyle: scaleTemplateTextStyle(range.kind === "latin" ? latinStyle : chineseStyle, scale)
  }));
}

async function applyBottomTextTemplateStyle(layer, value, options = {}) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const parsed = parseTitleSuperscriptMarkup(value);
  const textValue = toPhotoshopText(parsed.text);

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
    let textStyleRange = buildBottomTextTemplateStyleRanges(textValue, styleByKind, Number(options.scale) || 1, { symbolsAsLatin: true });
    if (parsed.superscripts.length) {
      textStyleRange = applySuperscriptsToTextStyleRanges(textStyleRange, parsed.superscripts, { styleByKind });
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
    log("  Bottom text template font styles reused from PSD layer.");
  } catch (error) {
    log(`  Bottom text template style skipped: ${formatError(error)}`);
    await replaceTextLayer(layer, value);
  }
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
  if (!shouldUseSubtitleCompactVariant(text)) return text;
  return splitSubtitleByPlusBalanced(text);
}

function splitSubtitleByPlusBalanced(text) {
  const source = String(text || "").trim();
  if (!source.includes("+")) return source;

  const parts = source.split("+").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return source;

  let best = null;
  let bestFirstNotShorter = null;
  for (let splitIndex = 1; splitIndex < parts.length; splitIndex += 1) {
    const firstLine = parts.slice(0, splitIndex).join("+");
    const secondLine = `+${parts.slice(splitIndex).join("+")}`;
    const firstLen = getDisplayLength(firstLine);
    const secondLen = getDisplayLength(secondLine);
    const maxLen = Math.max(firstLen, secondLen);
    const score = Math.abs(firstLen - secondLen);
    if (!best || score < best.score || (score === best.score && maxLen < best.maxLen)) {
      best = { firstLine, secondLine, score, maxLen };
    }
    if (firstLen >= secondLen && (!bestFirstNotShorter || score < bestFirstNotShorter.score || (score === bestFirstNotShorter.score && maxLen < bestFirstNotShorter.maxLen))) {
      bestFirstNotShorter = { firstLine, secondLine, score, maxLen };
    }
  }

  const result = bestFirstNotShorter || best;
  return result ? `${result.firstLine}\n${result.secondLine}` : source;
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

function applyFontConfigToTextStyle(style, config = {}) {
  const textStyle = { ...(style || {}) };
  if (config.postScriptName) textStyle.fontPostScriptName = config.postScriptName;
  if (config.fontName) textStyle.fontName = config.fontName;
  if (config.color) textStyle.color = makeRgbColor(config.color);
  const fontSize = Number(config.fontSize);
  if (Number.isFinite(fontSize) && fontSize > 0) {
    textStyle.size = makePointValue(fontSize);
    textStyle.impliedFontSize = makePointValue(fontSize);
  }
  return textStyle;
}

async function replaceTextLayerPddSkuGiftSubtitleStyle(layer, value, styleConfig, label) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const textValue = toPhotoshopText(value);
  const textLength = Array.from(textValue).length;

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
      await replaceTextLayerPreserveFirstStyle(layer, value);
      return;
    }

    const white = styleConfig && styleConfig.color;
    const styleByKind = getTemplateTextStyleByKind(textKey, baseStyle, { symbolsAsLatin: true });
    styleByKind.chinese = applyFontConfigToTextStyle(styleByKind.chinese || baseStyle, {
      color: white
    });
    styleByKind.latin = applyFontConfigToTextStyle(styleByKind.latin || baseStyle, {
      postScriptName: "LINESeedSansApp-Regular",
    fontName: "LINE Seed Sans App Regular",
    fontStyleName: "Regular",
      color: white
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
            textKey: textValue,
            textStyleRange: buildMixedTextTemplateStyleRanges(textValue, styleByKind, {
              symbolsAsLatin: true,
              chinese: { color: white },
              latin: { color: white }
            })
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    log(`  ${label || layer.name} mixed font style applied.`);
  } catch (error) {
    log(`  ${label || layer.name} mixed font style skipped: ${formatError(error)}`);
    await replaceTextLayerPreserveFirstStyle(layer, value);
  }
}

function getTitleLineHeightRatio(row, hasScaledSecondLine) {
  const explicit = readNumber(row, "txt.titleLineHeightRatio", readNumber(row, "title.lineHeightRatio", null));
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return hasScaledSecondLine ? 0.6 : null;
}

function makeTitleStyle(baseStyle, font, superscript, scale, options) {
  const titleTracking = options && Number.isFinite(options.tracking) ? options.tracking : 75;
  const appliedFont = font;
  const style = {
    _obj: "textStyle",
    ...baseStyle,
    fontPostScriptName: appliedFont.postScriptName,
    fontName: appliedFont.fontName,
    fontStyleName: appliedFont.fontStyleName || "Regular",
    impliedFontPostScriptName: appliedFont.postScriptName,
    impliedFontName: appliedFont.fontName,
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
    style.baseline = { _enum: "baseline", _value: "superScript" };
  } else if (scale && scale !== 1) {
    const scaledSize = baseSize * scale;
    style.size = makePointValue(scaledSize);
    style.impliedFontSize = makePointValue(scaledSize);
  }

  return style;
}

function getTitleSuperscriptShift(baseSize) {
  const size = Number(baseSize) || 0;
  return Math.max(0, size * TITLE_SUPERSCRIPT_STYLE.shiftRatio);
}

function makeSuperscriptTextStylePreserveFont(baseStyle, metricStyle = baseStyle) {
  const style = { ...(baseStyle || {}) };
  const baseSize = Math.max(getTextStylePointSize(style), getTextStylePointSize(metricStyle || style));
  const supSize = baseSize * TITLE_SUPERSCRIPT_STYLE.sizeRatio;
  const supLeading = baseSize * TITLE_SUPERSCRIPT_STYLE.leadingRatio;
  const supShift = getTitleSuperscriptShift(baseSize);
  style.fontPostScriptName = TITLE_SUPERSCRIPT_FONT.postScriptName;
  style.fontName = TITLE_SUPERSCRIPT_FONT.fontName;
  style.fontStyleName = TITLE_SUPERSCRIPT_FONT.fontStyleName || "Regular";
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

function applySuperscriptsToTextStyleRanges(textStyleRanges, superscripts, options = {}) {
  const baseRanges = Array.isArray(textStyleRanges) ? textStyleRanges.filter((range) => range && range.textStyle) : [];
  const supRanges = Array.isArray(superscripts)
    ? superscripts
      .map((range) => ({
        from: Number.isFinite(Number(range && range.from)) ? Number(range.from) : Number(range && range.start),
        to: Number.isFinite(Number(range && range.to)) ? Number(range.to) : Number(range && range.end)
      }))
      .filter((range) => Number.isFinite(range.from) && Number.isFinite(range.to) && range.to > range.from)
      .sort((a, b) => a.from - b.from || a.to - b.to)
    : [];
  if (!baseRanges.length || !supRanges.length) return baseRanges;

  const total = Math.max(
    ...baseRanges.map((range) => Number(range.to) || 0),
    ...supRanges.map((range) => Number(range.to) || 0),
    0
  );
  const points = new Set([0, total]);
  baseRanges.forEach((range) => {
    points.add(Math.max(0, Number(range.from) || 0));
    points.add(Math.max(0, Number(range.to) || 0));
  });
  supRanges.forEach((range) => {
    points.add(Math.max(0, range.from));
    points.add(Math.max(0, range.to));
  });

  const sortedPoints = Array.from(points).filter((point) => Number.isFinite(point)).sort((a, b) => a - b);
  const styleForIndex = (index) => {
    return baseRanges.find((range) => index >= (Number(range.from) || 0) && index < (Number(range.to) || 0)) || baseRanges[0];
  };
  const isSuperscriptSegment = (from, to) => supRanges.some((range) => from >= range.from && to <= range.to);
  const styleByKind = options && options.styleByKind || {};
  const result = [];

  for (let i = 0; i < sortedPoints.length - 1; i += 1) {
    const from = sortedPoints[i];
    const to = sortedPoints[i + 1];
    if (to <= from) continue;
    const source = styleForIndex(from);
    const baseStyle = source && source.textStyle || baseRanges[0].textStyle;
    const textStyle = isSuperscriptSegment(from, to)
      ? makeSuperscriptTextStylePreserveFont(baseStyle)
      : baseStyle;
    const last = result[result.length - 1];
    if (last && last.to === from && last.textStyle === textStyle) {
      last.to = to;
    } else {
      result.push({ _obj: "textStyleRange", from, to, textStyle });
    }
  }

  return result;
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
    log(`  Title mixed font applied: latin=${fontConfig.latin.fontName}, chinese=${fontConfig.chinese.fontName}, superscripts=${(superscripts || []).length}, ranges=${supInfo || "-"}, scaled=${scaleInfo || "-"}, leadingRatio=${leadingInfo}, baseSize=${Math.round(baseSize)}, superscript=ps-tool.`);
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

function getYouthProductGapGroup(row, index) {
  const source = getImageSourceForIndex(row, "product", index);
  if (!isYouthSeriesProductSource(source)) return "";

  const text = String(source || "").toLowerCase();
  const category = normalizeProductCategory(getProductCategory(row, index));
  const specs = getProductSpecFromSource(source);
  const size = getProductSpecSize(specs);

  if (/(?:refill|补充|替换)/i.test(text)) return "refill";
  if (/(?:face[-_\s]*mask[-_\s]*box|面膜盒)/i.test(text)) return "maskBox";
  if (/(?:face[-_\s]*mask|cotton[-_\s]*pad|sachet|片装|袋包|袋装)/i.test(text)) return "sachet";
  if (category === "jar") return "jar";
  if (category === "tube") {
    if (size > 0 && size <= 15) return "smallTube";
    return "tube";
  }
  if (category === "bottle") {
    if (size >= 300) return "largeBottle";
    if (size > 0 && size <= 50) return "smallBottle";
    return "bottle";
  }
  if (category === "ampoule") {
    if (isAmpouleSetSource(source)) {
      if (/(?:30x|\*\s*30|x\s*30)/i.test(text)) return "ampouleSet30";
      if (/(?:5x|\*\s*5|x\s*5)/i.test(text)) return "ampouleSet5";
      if (/(?:3x|\*\s*3|x\s*3)/i.test(text)) return "ampouleSet3";
      return "ampouleSet";
    }
    if (isFlatAmpoulePacketSource(source)) return "ampouleBag";
    return "ampoule";
  }
  if (category === "bag") return "sachet";
  return category || "default";
}

function getYouthProductGapGroupCandidates(row, index) {
  const group = getYouthProductGapGroup(row, index);
  if (!group) return [];
  const category = normalizeProductCategory(getProductCategory(row, index));
  const candidates = [group];
  if (/Bottle$/.test(group)) candidates.push("bottle");
  if (/Tube$/.test(group)) candidates.push("tube");
  if (/^ampouleSet/.test(group)) candidates.push("ampouleSet", "ampoule");
  if (group === "ampouleBag") candidates.push("sachet", "ampoule");
  if (category && !candidates.includes(category)) candidates.push(category);
  return candidates;
}

function getYouthProductPairGapRatio(row, leftIndex, rightIndex, layout = "overlap") {
  const leftGroups = getYouthProductGapGroupCandidates(row, leftIndex);
  const rightGroups = getYouthProductGapGroupCandidates(row, rightIndex);
  if (!leftGroups.length || !rightGroups.length) return null;

  const lineRatios = {
    "jar|jar": 0.03,
    "bottle|bottle": 0.02,
    "bottle|largeBottle": 0.02,
    "bottle|smallBottle": 0.03,
    "largeBottle|largeBottle": 0.02,
    "largeBottle|smallBottle": 0.02,
    "smallBottle|smallBottle": 0.03,
    "tube|tube": 0.03,
    "smallTube|smallTube": 0.05,
    "smallTube|tube": 0.02,
    "ampoule|ampoule": 0.02,
    "ampouleSet|ampouleSet": 0.02,
    "ampouleSet3|ampouleSet": 0,
    "ampouleSet3|ampouleSet3": 0.03,
    "ampouleSet5|ampouleSet": 0.08,
    "refill|refill": 0.02,
    "sachet|sachet": 0.03,
    "maskBox|maskBox": 0.03,
    "bottle|jar": 0.21,
    "jar|tube": 0.02,
    "jar|smallTube": 0,
    "ampouleSet3|jar": 0.03,
    "ampouleSet|jar": 0.03,
    "jar|sachet": 0.08,
    "bottle|tube": 0.02,
    "bottle|smallTube": 0.01,
    "smallBottle|tube": 0.01,
    "smallBottle|smallTube": 0.02,
    "largeBottle|tube": 0.02,
    "ampouleSet|bottle": 0.07,
    "ampouleSet|smallBottle": 0.07,
    "ampouleSet|tube": 0,
    "ampouleSet|smallTube": 0,
    "ampouleBag|ampouleSet": 0,
    "ampouleBag|tube": 0.02,
    "ampouleBag|smallTube": 0.02,
    "ampouleSet30|largeBottle": 0,
    "ampouleSet30|smallBottle": 0,
    "ampouleSet30|sachet": 0,
    "largeBottle|refill": 0,
    "refill|tube": 0,
    "refill|smallTube": 0,
    "refill|sachet": 0,
    "ampouleSet30|refill": 0,
    "ampouleSet|refill": 0.03,
    "bottle|refill": 0.03,
    "refill|smallBottle": 0.03,
    "maskBox|tube": 0.11,
    "bottle|maskBox": 0.14,
    "maskBox|smallBottle": 0.14,
    "maskBox|sachet": 0.03,
    "bottle|sachet": 0.01,
    "sachet|smallBottle": 0.01,
    "sachet|smallTube": 0.01,
    "sachet|tube": 0.01,
    "ampouleSet|sachet": 0,
    "ampouleSet3|sachet": 0
  };

  const overlapRatios = {
    "jar|jar": 0.03,
    "bottle|bottle": -0.08,
    "bottle|largeBottle": -0.04,
    "bottle|smallBottle": -0.05,
    "largeBottle|largeBottle": -0.02,
    "largeBottle|smallBottle": -0.05,
    "smallBottle|smallBottle": -0.05,
    "tube|tube": -0.08,
    "smallTube|smallTube": -0.10,
    "smallTube|tube": -0.06,
    "ampoule|ampoule": -0.12,
    "ampouleSet|ampouleSet": -0.12,
    "ampouleSet3|ampouleSet": -0.11,
    "ampouleSet3|ampouleSet3": -0.03,
    "ampouleSet5|ampouleSet": 0.08,
    "refill|refill": -0.02,
    "sachet|sachet": -0.05,
    "maskBox|maskBox": 0.03,
    "bottle|jar": 0.12,
    "jar|tube": -0.05,
    "jar|smallTube": -0.05,
    "ampouleSet3|jar": 0.03,
    "ampouleSet|jar": 0.03,
    "jar|sachet": 0.08,
    "bottle|tube": -0.02,
    "bottle|smallTube": 0.01,
    "smallBottle|tube": 0.01,
    "smallBottle|smallTube": 0.02,
    "largeBottle|tube": 0.02,
    "ampouleSet|bottle": -0.03,
    "ampouleSet|smallBottle": -0.27,
    "ampouleSet|tube": -0.03,
    "ampouleSet|smallTube": -0.03,
    "ampouleBag|ampouleSet": -0.20,
    "ampouleBag|tube": 0.02,
    "ampouleBag|smallTube": 0.02,
    "ampouleSet30|largeBottle": -0.21,
    "ampouleSet30|smallBottle": -0.42,
    "ampouleSet30|sachet": -0.12,
    "largeBottle|refill": -0.02,
    "refill|tube": -0.05,
    "refill|smallTube": -0.05,
    "refill|sachet": -0.12,
    "ampouleSet30|refill": -0.21,
    "ampouleSet|refill": 0.03,
    "bottle|refill": 0.03,
    "refill|smallBottle": 0.03,
    "maskBox|tube": 0.11,
    "bottle|maskBox": 0.14,
    "maskBox|smallBottle": 0.14,
    "maskBox|sachet": 0.03,
    "bottle|sachet": 0.01,
    "sachet|smallBottle": 0.01,
    "sachet|smallTube": 0.01,
    "sachet|tube": 0.01,
    "ampouleSet|sachet": -0.11,
    "ampouleSet3|sachet": -0.11
  };

  const ratios = layout === "line" ? lineRatios : overlapRatios;
  for (const left of leftGroups) {
    for (const right of rightGroups) {
      const pair = [left, right].sort().join("|");
      if (ratios[pair] !== undefined) return ratios[pair];
    }
  }

  const left = leftGroups[0];
  const right = rightGroups[0];
  if (left === right) return layout === "line" ? 0.02 : left === "jar" ? 0.03 : -0.06;
  if (left.startsWith("ampoule") || right.startsWith("ampoule")) return layout === "line" ? 0 : -0.08;
  if (left === "jar" || right === "jar") return layout === "line" ? 0.08 : 0.03;
  return layout === "line" ? 0.02 : -0.02;
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
    jar: 0.46,
    jar25g: 0.40,
    jar30g: 0.44,
    jar50g: 0.50,
    jar65g: 0.56,
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
    if (spec.size >= 65) return 0.56;
    if (spec.size >= 50) return 0.50;
    if (spec.size >= 30) return 0.44;
    return 0.40;
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
    "jar25g|jar25g": 0.40,
    "jar25g|jar30g": 0.44,
    "jar25g|jar50g": 0.50,
    "jar30g|jar30g": 0.44,
    "jar30g|jar50g": 0.52,
    "jar50g|jar50g": 0.50,
    "jar50g|jar65g": 0.58,
    "jar65g|jar65g": 0.56,
    "tube5g|tube5g": -0.1,
    "tube10g|tube5g": -0.10,
    "tube15g|tube5g": -0.10,
    "tube10g|tube10g": -0.16,
    "tube10g|tube15g": -0.08,
    "tube15g|tube15g": -0.15,
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

  const youthRatio = getYouthProductPairGapRatio(row, leftIndex, rightIndex, layout);
  const specRatio = layout === "line" ? getProductLineSpecPairGapRatio(row, leftIndex, rightIndex) : null;
  const ratio = Number.isFinite(youthRatio)
    ? youthRatio
    : Number.isFinite(specRatio)
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
  const baseLayer = prefix === "product" || prefix === "gift"
    ? findCurrentMechanismLayerByName(doc, row, baseName)
    : findLayerByName(doc, baseName);
  const areaLayer = getImageGroupAreaLayer(doc, prefix, count, row);
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));

  if (areaLayer) {
    areaLayer.visible = false;
  }
  hideImageGroupAreaLayers(doc, prefix);

  log(`  ${prefix} group prep: count=${count}, base=${baseLayer ? baseLayer.name : "none"}, sourceMode=${shouldPlaceGroupFromFiles(row, prefix) ? "place" : "placeholder"}.`);
  if (areaBox) {
    log(`  ${prefix}.area: ${areaLayer.name}, x=${Math.round(areaBox.left)}, y=${Math.round(areaBox.top)}, w=${Math.round(areaBox.width)}, h=${Math.round(areaBox.height)}`);
    state.groupAreaBoxes[prefix] = areaBox;
    state.groupAreaNames[prefix] = areaLayer.name;
  } else {
    log(`  ${prefix}.area not found. Using img.${prefix} as layout area.`);
    delete state.groupAreaBoxes[prefix];
    delete state.groupAreaNames[prefix];
  }

  const hasSingleCouponSource = count === 1 && isAddOnCouponImageIndex(row, prefix, 1);
  if ((count <= 1 && prefix !== "giftLeft" && !hasSingleCouponSource) || !baseLayer) return;

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

  if (["product", "gift", "giftLeft", "giftRight"].includes(prefix)) {
    const stackedItems = layers.map((layer, index) => ({
      layer,
      box: getBoundsBox(layer.boundsNoEffects || layer.bounds),
      source: getImageSourceForIndex(row, prefix, index + 1)
    })).filter((item) => item.box);
    await arrangeImageGroupLayerStacking(stackedItems, prefix === "product" ? getImageGroupZOrder(row, "product") : "leftFront", prefix);
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

function getImageGroupAreaLayer(doc, prefix, count, row) {
  if (prefix === "product") {
    const config = getCurrentTemplateConfig();
    const switchConfig = getMechanismSwitchConfig(config) || {};
    const productAreas = switchConfig.productAreas || null;
    if (switchConfig.enabled && productAreas) {
      const type = getDailyMechanismType(row || state.currentRow || {}, switchConfig);
      const areaConfig = productAreas[type] || {};
      const rowForArea = row || state.currentRow || {};
      const usePersonArea = hasPersonContent(rowForArea);
      const desiredName = usePersonArea
        ? areaConfig.withPerson || areaConfig.default
        : areaConfig.withoutPerson || areaConfig.default;
      const desiredLayer = desiredName ? findLayerByName(doc, desiredName) : null;
      if (desiredLayer) return desiredLayer;
    }

    const area1 = findLayerByName(doc, "product.area.1");
    const area2 = findLayerByName(doc, "product.area.2");
    const area3 = findLayerByName(doc, "product.area.3");
    const area4 = findLayerByName(doc, "product.area.4");
    const fallback = findLayerByName(doc, "product.area");
    return count > 2 ? area2 || fallback || area1 || area3 || area4 : area1 || fallback || area2 || area4 || area3;
  }

  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (prefix === "gift" && switchConfig.enabled) {
    const type = getDailyMechanismType(row || state.currentRow || {}, switchConfig);
    const areaConfig = switchConfig.giftAreas && switchConfig.giftAreas[type];
    const desiredName = typeof areaConfig === "string" ? areaConfig : areaConfig && areaConfig.default;
    const desiredLayer = desiredName ? findLayerByName(doc, desiredName) : null;
    if (desiredLayer) return desiredLayer;
    if (switchConfig.giftAreaName) {
      return findLayerByName(doc, switchConfig.giftAreaName) || findLayerByName(doc, `${prefix}.area`);
    }
  }

  if (prefix === "gift") {
    return findLayerByName(doc, "gift.area") ||
      findLayerByName(doc, "gift.area.2") ||
      findLayerByName(doc, "gift.area.1") ||
      findLayerByName(doc, "gift.area.3") ||
      findLayerByName(doc, "gift.area.4");
  }

  return findLayerByName(doc, `${prefix}.area`);
}

function hideImageGroupAreaLayers(doc, prefix) {
  if (prefix === "product") {
    ["product.area", "product.area.1", "product.area.2", "product.area.3", "product.area.4"].forEach((name) => {
      const layer = findLayerByName(doc, name);
      if (layer) layer.visible = false;
    });
    return;
  }

  const areaNames = prefix === "gift"
    ? ["gift.area", "gift.area.1", "gift.area.2", "gift.area.3", "gift.area.4"]
    : [`${prefix}.area`];
  areaNames.forEach((name) => {
    const layer = findLayerByName(doc, name);
    if (layer) layer.visible = false;
  });
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

function hideUnusedTemplateImageLayers(doc, row) {
  const placedNames = state.placedImageLayers || {};
  let hiddenCount = 0;

  ["product", "gift", "giftLeft"].forEach((prefix) => {
    const count = getGiftCount(row, prefix);
    const baseLayer = findLayerByName(doc, `img.${prefix}`);
    if (count > 1 && baseLayer && !placedNames[baseLayer.name]) {
      baseLayer.visible = false;
      hiddenCount += 1;
      log(`  Hidden template base image: img.${prefix}.`);
    }

    for (let i = Math.max(count, 1) + 1; i <= 6; i += 1) {
      const extraLayer = findLayerByName(doc, `img.${prefix}.${i}`);
      if (extraLayer && !placedNames[extraLayer.name]) {
        extraLayer.visible = false;
        hiddenCount += 1;
      }
    }
  });

  getAllLayers(doc.layers).forEach((layer) => {
    const name = String(layer.name || "");
    if (/^__ignored\.img\.(product|gift|giftLeft)(?:\.\d+)?$/.test(name)) {
      layer.visible = false;
      hiddenCount += 1;
    }
  });

  if (hiddenCount) {
    log(`  Hidden unused template image layers: ${hiddenCount}.`);
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

function findCurrentGiftLeftImageGroup(doc, row) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  const type = getDailyMechanismType(row || state.currentRow || {}, switchConfig);
  const mechanismNames = getMechanismGroupNames(switchConfig, type);
  const mechanismLayer = findDailyMechanismLayerForGiftLeft(doc, mechanismNames);
  return mechanismLayer ? findGiftLeftImageGroupInLayer(mechanismLayer) : null;
}
async function moveLayerByOffset(layer, dx, dy, label) {
  if (!layer || (!dx && !dy)) return;
  try {
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
  for (let i = 1; i <= count; i += 1) {
    const rawImagePath = row[`img.${prefix}.${i}`] || row[`img.${prefix}`];
    const isCoupon = isAddOnCouponImageIndex(row, prefix, i);
    let imagePath = rawImagePath;
    let layer = null;
    let templateBox = null;

    if (isCoupon && isAddOnCouponToken(rawImagePath)) {
      const templateLayer = findAddOnCouponTemplateLayer(doc, row);
      if (templateLayer) {
        hideAddOnCouponTemplateLayers(doc, row, templateLayer);
        templateLayer.visible = true;
        templateBox = getBoundsBox(templateLayer.boundsNoEffects || templateLayer.bounds);
        layer = await duplicateLayerBestEffort(templateLayer, `img.${prefix}.${i}`, `AddOn coupon ${templateLayer.name}`);
        if (layer) {
          templateLayer.visible = false;
          await moveLayerBesideReferenceBestEffort(layer, baseLayer, `${layer.name} -> ${baseLayer.name}`);
          log(`  AddOn coupon template layer used: ${rawImagePath} -> ${layer.name}.`);
        } else {
          imagePath = resolveAddOnCouponImage(row);
          log(`  AddOn coupon template duplicate failed; fallback image=${imagePath || "none"}.`);
        }
      } else {
        imagePath = resolveAddOnCouponImage(row);
        log(`  AddOn coupon template layer not found; fallback image=${imagePath || "none"}.`);
      }
    }

    if (!layer) {
      if (!imagePath || isAddOnCouponToken(imagePath)) continue;
      log(`  ${prefix} place source ${i}: ${imagePath}`);
      const asset = await getAssetEntry(imagePath, {
        disableTrimmed: prefix === "giftRight",
        normalizeGiftRight: prefix === "giftRight",
        productFallbackPriority: prefix === "product",
        view: prefix === "product" ? getProductImageView(row) : ""
      });
      log(`  ${prefix} asset entry ${i}: ${asset && asset.name ? asset.name : imagePath}`);
      layer = await placeAssetAsLayer(asset);
      layer.name = `img.${prefix}.${i}`;
      layer.visible = true;
      if (prefix === "gift") {
        const giftImageGroup = findCurrentGiftImageGroup(doc, row);
        const movedInside = await moveLayerInsideGroup(layer, giftImageGroup, "current giftimage");
        if (!movedInside) {
          await moveLayerBesideReferenceBestEffort(layer, baseLayer, `${layer.name} -> ${baseLayer.name}`);
        }
      } else if (prefix === "giftLeft") {
        const giftLeftImageGroup = findCurrentGiftLeftImageGroup(doc, row);
        const movedInside = await moveLayerInsideGroup(layer, giftLeftImageGroup, "current giftLeftimage");
        if (!movedInside) {
          const referenceLayer = giftLeftImageGroup || baseLayer;
          await moveLayerBesideReferenceBestEffort(layer, referenceLayer, `${layer.name} -> ${(referenceLayer || {}).name || "giftLeft reference"}`);
        }
      } else {
        await moveLayerBesideReferenceBestEffort(layer, baseLayer, `${layer.name} -> ${baseLayer.name}`);
      }
    }

    const sourceForFit = getImageSourceForIndex(row, prefix, i);
    if (isCoupon && !templateBox) {
      templateBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
    }
    const targetBox = isCoupon
      ? getAddOnCouponTargetBox(row, targetBoxes[i - 1], templateBox)
      : prefix === "product"
        ? applyProductHeightRatioToBox(row, i, areaBox, targetBoxes[i - 1], count)
        : prefix === "giftLeft"
          ? applyGiftLeftHeightRatioToBox(row, i, areaBox, targetBoxes[i - 1])
          : targetBoxes[i - 1];
    const fitByHeight = !isCoupon && ((prefix === "product" && shouldFitProductByHeight(row, i, sourceForFit)) ||
      prefix === "giftLeft" ||
      prefix === "giftRight" ||
      prefix === "gift");
    await fitLayerToBox(layer, targetBox, {
      alignY: prefix === "product" ? "bottom" : "center",
      fitBy: fitByHeight ? "height" : "contain"
    });
    if (prefix === "product" && areaBox) {
      if (isCoupon) {
        log(`  AddOn coupon fixed size: ${layer.name}, target=${Math.round(targetBox.width)}x${Math.round(targetBox.height)}.`);
      } else {
        log(`  Product height rule: ${layer.name}, mode=${getProductHeightMode(row, count)}, category=${getProductCategory(row, i)}, ratio=${getProductHeightRatio(row, i, count)}, targetH=${Math.round(targetBox.height)}`);
      }
    }
    if (areaBox) {
      await clampLayerToBox(layer, areaBox);
    }
    if (prefix === "product" && areaBox && !isCoupon && getCurrentTemplateConfig().alignPlacedProductBottomToArea !== false) {
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

  if (getAddOnCouponConfig() && prefix === getAddOnCouponTargetPrefix()) {
    hideAddOnCouponTemplateLayers(doc, row);
  }

  const getPlacedLayerIndex = (layer) => {
    const match = String(layer && layer.name || "").match(/\.(\d+)$/);
    return match ? Number(match[1]) : 0;
  };
  const giftTagAnchorLayer = prefix === "gift"
    ? layers.slice().reverse().find((layer) => layer && !isAddOnCouponImageIndex(row, prefix, getPlacedLayerIndex(layer)))
    : null;
  if (giftTagAnchorLayer) {
    await alignGiftTagToGiftLayer(doc, row, giftTagAnchorLayer);
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

async function alignCurrentProductLayersToArea(doc, row) {
  const config = getCurrentTemplateConfig();
  if (!config.finalProductBottomAlign) return;

  const areaBox = state.groupAreaBoxes && state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Final product bottom align skipped: product.area not found.");
    return;
  }

  const count = Math.max(getGiftCount(row || {}, "product") || 1, 1);
  let items = collectProductItems(doc, count, row);
  if (!items.length) {
    const layer = findCurrentProductLayer(doc, row, "img.product");
    const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (layer && box) items = [{ layer, box }];
  }
  if (!items.length) {
    log("  Final product bottom align skipped: no product layers found.");
    return;
  }

  for (const item of items) {
    const box = getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds);
    if (!box) continue;
    await item.layer.translate(areaBox.centerX - box.centerX, areaBox.bottom - box.bottom);
  }
  const aligned = items.map((item) => {
    const box = getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds);
    return `${item.layer.name}:${box ? `${Math.round(box.centerX)},${Math.round(box.bottom)}` : "?"}`;
  }).join(", ");
  log(`  Final product center-bottom aligned to ${state.groupAreaNames.product || "product.area"}: ${aligned}, areaCenterBottom=${Math.round(areaBox.centerX)},${Math.round(areaBox.bottom)}.`);
}

async function alignGiftTagToGiftLayer(doc, row, giftLayer) {
  const tagConfig = getGiftBadgeConfig() || {};
  const anchorEnabled = tagConfig.anchorToGift || tagConfig.anchorTo === "gift" || tagConfig.anchorTo === "img.gift";
  if (!tagConfig.enabled || !anchorEnabled || !giftLayer) return;

  const tagNames = tagConfig.layerNames || tagConfig.names || ["gifttag"];
  const tagLayer = findLayerByAnyNameInCurrentMechanismOnly(doc, row, tagNames) || findLayerByAnyName(doc, tagNames);
  if (!tagLayer || tagLayer.visible === false) return;

  const giftBox = getBoundsBox(giftLayer.boundsNoEffects || giftLayer.bounds);
  const tagBox = getBoundsBox(tagLayer.boundsNoEffects || tagLayer.bounds);
  if (!giftBox || !tagBox) return;

  const offsetX = readNumber(row || {}, "gift.tag.offsetX", Number(tagConfig.offsetX));
  const offsetY = readNumber(row || {}, "gift.tag.offsetY", Number(tagConfig.offsetY));
  const dx = giftBox.left + (Number.isFinite(offsetX) ? offsetX : 0) - tagBox.left;
  const dy = giftBox.top + (Number.isFinite(offsetY) ? offsetY : 0) - tagBox.top;
  await moveLayerByOffset(tagLayer, dx, dy, tagLayer.name);
  log(`  Gift tag anchored: dx=${Math.round(dx)}, dy=${Math.round(dy)}.`);
}
async function alignGiftTagToPlacedGiftLayer(doc, row) {
  const tagConfig = getGiftBadgeConfig() || {};
  if (!tagConfig.enabled) return;
  const mechanismConfig = getMechanismSwitchConfig() || {};
  if (mechanismConfig.enabled) return;

  const count = Math.max(getGiftCount(row || {}, "gift") || 0, 0);
  for (let i = count; i >= 1; i -= 1) {
    if (isAddOnCouponImageIndex(row, "gift", i)) continue;
    const layer = findCurrentMechanismLayerByName(doc, row, `img.gift.${i}`);
    if (layer && layer.visible !== false) {
      await alignGiftTagToGiftLayer(doc, row, layer);
      return;
    }
  }

  const fallbackLayer = findCurrentMechanismLayerByName(doc, row, "img.gift");
  if (fallbackLayer && fallbackLayer.visible !== false) {
    await alignGiftTagToGiftLayer(doc, row, fallbackLayer);
  }
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
  if (!mechanismLayer) {
    log(`  GiftLeft group align skipped: active mechanism.${type} group not found.`);
    return;
  }

  const targetLayer = findGiftLeftImageGroupInLayer(mechanismLayer);
  if (!targetLayer) {
    log(`  GiftLeft group align skipped: giftLeftimage not found under ${mechanismLayer.name}.`);
    return;
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
  const childBoxes = collectVisibleChildBoxes(targetLayer);
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
  ) : getBoundsBox(targetLayer.boundsNoEffects || targetLayer.bounds);
  if (!box) {
    log(`  GiftLeft group align skipped: ${targetLayer.name} has no visible child bounds.`);
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
  } else {
    await moveLayerByOffset(targetLayer, dx, dy, targetLayer.name);
  }
  const alignedItems = alignItems.length ? alignItems.map((item) => {
    const box = getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds);
    return box ? { layer: item.layer, box } : null;
  }).filter(Boolean) : collectVisibleChildBoxes(targetLayer);
  const alignedBox = alignedItems.length ? makeBox(
    Math.min(...alignedItems.map((item) => item.box.left)),
    Math.min(...alignedItems.map((item) => item.box.top)),
    Math.max(...alignedItems.map((item) => item.box.right)) - Math.min(...alignedItems.map((item) => item.box.left)),
    Math.max(...alignedItems.map((item) => item.box.bottom)) - Math.min(...alignedItems.map((item) => item.box.top))
  ) : getBoundsBox(targetLayer.boundsNoEffects || targetLayer.bounds);
  log(`  GiftLeft align: area=${areaName}, moved=${alignItems.length ? alignItems.map((item) => item.layer.name).join("+") : targetLayer.name}, dx=${Math.round(dx)}, dy=${Math.round(dy)}, after=${alignedBox ? `${Math.round(alignedBox.left)},${Math.round(alignedBox.bottom)}` : "?"}, target=${Math.round(areaBox.left)},${Math.round(areaBox.bottom)}.`);
}
async function alignGiftImageGroupToArea(doc) {
  const config = getCurrentTemplateConfig();
  const switchConfig = getMechanismSwitchConfig(config) || {};
  if (!switchConfig.enabled) return;

  const row = state.currentRow || {};
  const type = getDailyMechanismType(row, switchConfig);
  const giftMechanisms = switchConfig.giftMechanisms || ["1"];
  const hasGift = hasGiftContent(row) || getGiftCount(row || {}, "gift") > 0;
  if (!hasGift || !giftMechanisms.includes(type)) return;

  const areaBox = state.groupAreaBoxes && state.groupAreaBoxes.gift;
  const areaName = state.groupAreaNames && state.groupAreaNames.gift || switchConfig.giftAreaName || (type ? `gift.area.${type}` : "gift.area");
  if (!areaBox) {
    log("  Gift group align skipped: gift.area not found.");
    return;
  }

  const alignConfig = switchConfig.giftAlign || {};
  const targetLayer = alignConfig.layerName
    ? findCurrentMechanismLayerByName(doc, row, alignConfig.layerName)
    : findCurrentGiftImageGroup(doc, row) || findCurrentMechanismLayerByName(doc, row, "img.gift");
  if (!targetLayer) {
    log("  Gift group align skipped: giftimage/img.gift not found.");
    return;
  }

  const collectVisibleChildBoxes = (layer, result = []) => {
    if (!layer || layer.visible === false) return result;
    if (!alignConfig.layerName && layer.layers && layer.layers.length) {
      layer.layers.forEach((child) => collectVisibleChildBoxes(child, result));
      return result;
    }
    const childBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (childBox) {
      result.push({ layer, box: childBox });
    }
    return result;
  };
  const childBoxes = collectVisibleChildBoxes(targetLayer);
  const box = childBoxes.length ? makeBox(
    Math.min(...childBoxes.map((item) => item.box.left)),
    Math.min(...childBoxes.map((item) => item.box.top)),
    Math.max(...childBoxes.map((item) => item.box.right)) - Math.min(...childBoxes.map((item) => item.box.left)),
    Math.max(...childBoxes.map((item) => item.box.bottom)) - Math.min(...childBoxes.map((item) => item.box.top))
  ) : getBoundsBox(targetLayer.boundsNoEffects || targetLayer.bounds);
  if (!box) {
    log(`  Gift group align skipped: ${targetLayer.name} has no visible bounds.`);
    return;
  }

  const alignX = alignConfig.alignX || "right";
  const alignY = alignConfig.alignY || "bottom";
  const dx = alignX === "center" ? areaBox.centerX - box.centerX : areaBox.right - box.right;
  const dy = alignY === "center" ? areaBox.centerY - box.centerY : areaBox.bottom - box.bottom;
  if (childBoxes.length) {
    for (const item of childBoxes) {
      await moveLayerByOffset(item.layer, dx, dy, item.layer.name);
    }
  } else {
    await moveLayerByOffset(targetLayer, dx, dy, targetLayer.name);
  }
  await alignGiftTagToGiftLayer(doc, row, targetLayer);
  const targetPoint = alignX === "center" || alignY === "center"
    ? `${Math.round(areaBox.centerX)},${Math.round(areaBox.centerY)}`
    : `${Math.round(areaBox.right)},${Math.round(areaBox.bottom)}`;
  log(`  Gift align: area=${areaName}, mode=${alignX}/${alignY}, moved=${childBoxes.length ? childBoxes.map((item) => item.layer.name).join("+") : targetLayer.name}, dx=${Math.round(dx)}, dy=${Math.round(dy)}, target=${targetPoint}.`);
}


async function applyGiftCouponGapFromProduct(doc, row) {
  const config = getAddOnCouponConfig();
  if (!config || getAddOnCouponTargetPrefix(config) !== "gift") return;

  const gapValue = readNumber(row, "coupon.gap", readNumber(row, "addOnCoupon.gap", NaN));

  const couponIndex = parseCount(row && row[getAddOnCouponIndexColumn("gift")]);
  if (couponIndex <= 0 || !isAddOnCouponImageIndex(row, "gift", couponIndex)) return;

  const couponLayer = findCurrentMechanismLayerByName(doc, row, `img.gift.${couponIndex}`) ||
    findAddOnCouponTemplateLayer(doc, row) ||
    findCurrentMechanismLayerByName(doc, row, "img.gift") ||
    findCurrentGiftImageGroup(doc, row);
  const couponBox = couponLayer && couponLayer.visible !== false && getBoundsBox(couponLayer.boundsNoEffects || couponLayer.bounds);
  if (!couponBox) {
    log("  Gift coupon gap skipped: coupon layer not found.");
    return;
  }

  const productItems = collectProductGroupItems(doc, row, { excludeCoupon: true });
  const productBox = getItemsGroupBox(productItems);
  if (!productBox) return;

  await alignGiftCouponAndProductToProductArea(doc, row, couponLayer, {
    productItems,
    productBox,
    couponBox,
    gapValue
  });
}

function collectProductShadowFollowLayers(doc) {
  const config = getCurrentTemplateConfig();
  const names = new Set([
    config && config.productShadow && (config.productShadow.name || "PRODUCT.shadow"),
    "PRODUCT.shadow"
  ].filter(Boolean));
  const bottomConfig = config && config.productBottomShadow;
  const bottomName = bottomConfig && (bottomConfig.layerName || "img.productshadow");
  if (bottomName) {
    names.add(bottomName);
    for (let i = 1; i <= 12; i += 1) {
      names.add(`${bottomName}.${i}`);
    }
  }

  const layers = [];
  names.forEach((name) => {
    findLayersByName(doc, name).forEach((layer) => {
      if (layer && layer.visible !== false && !layers.includes(layer)) {
        layers.push(layer);
      }
    });
  });
  return layers;
}

async function alignGiftCouponAndProductToProductArea(doc, row, couponLayer, geometry = {}) {
  const areaBox = state.groupAreaBoxes && state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Product+coupon center align skipped: product.area not found.");
    return;
  }

  const productItems = geometry.productItems && geometry.productItems.length
    ? geometry.productItems
    : collectProductGroupItems(doc, row, { excludeCoupon: true });
  const productBox = geometry.productBox || getItemsGroupBox(productItems);
  const couponBox = geometry.couponBox || (couponLayer && couponLayer.visible !== false && getBoundsBox(couponLayer.boundsNoEffects || couponLayer.bounds));
  if (!productItems.length || !productBox || !couponBox) {
    log("  Product+coupon center align skipped: product or coupon bounds not found.");
    return;
  }

  const gapValue = geometry.gapValue;
  const hasGap = Number.isFinite(gapValue);
  const targetCouponLeft = hasGap ? productBox.right + gapValue : couponBox.left;
  const targetCouponBox = makeBox(targetCouponLeft, couponBox.top, couponBox.width, couponBox.height);
  const combinedBox = getItemsGroupBox([
    { layer: null, box: productBox },
    { layer: couponLayer, box: targetCouponBox }
  ]);
  if (!combinedBox) return;

  const productMoveX = areaBox.centerX - combinedBox.centerX;
  const couponMoveX = productMoveX + (targetCouponLeft - couponBox.left);

  if (Number.isFinite(productMoveX) && Math.abs(productMoveX) >= 0.5) {
    await translateProductItems(productItems, productMoveX, 0);
    for (const shadowLayer of collectProductShadowFollowLayers(doc)) {
      await moveLayerByOffset(shadowLayer, productMoveX, 0, shadowLayer.name);
    }
  }
  if (Number.isFinite(couponMoveX) && Math.abs(couponMoveX) >= 0.5) {
    await moveLayerByOffset(couponLayer, couponMoveX, 0, couponLayer.name);
  }

  const expectedGap = hasGap ? gapValue : targetCouponLeft - productBox.right;
  log(`  Product+coupon center aligned to ${state.groupAreaNames.product || "product.area"}: productDx=${Math.round(productMoveX)}, couponDx=${Math.round(couponMoveX)}, couponGap=${Number.isFinite(expectedGap) ? Math.round(expectedGap) : "?"}, targetCenter=${Math.round(areaBox.centerX)}.`);
}

function collectProductItems(doc, count, row = null, options = {}) {
  const items = [];
  for (let i = 1; i <= count; i += 1) {
    const fixedSize = isAddOnCouponProductIndex(row || {}, i);
    if (options.excludeCoupon && fixedSize) continue;
    const layer = findCurrentProductLayer(doc, row, `img.product.${i}`);
    const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (layer && box) {
      items.push({ layer, box, index: i, fixedSize, source: getImageSourceForIndex(row || {}, "product", i) });
    }
  }
  return items;
}

function collectProductGroupItems(doc, row, options = {}) {
  const count = Math.max(getGiftCount(row, "product") || 1, 1);
  const items = collectProductItems(doc, count, row, options);
  if (items.length) return items;

  const layer = findCurrentProductLayer(doc, row, "img.product");
  const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
  return layer && box ? [{ layer, box }] : [];
}

function getProductShadowGiftColumns(config = {}) {
  return config.giftColumns || ["giftshadow", "giftshadow.enabled", "gift.shadow", "giftShadow", "gift.shadow.enabled", "giftShadow.enabled"];
}

function shouldIncludeGiftInProductShadow(row, config = {}) {
  const columns = getProductShadowGiftColumns(config);
  const explicitColumn = columns.find((column) => hasValue(row || {}, column));
  if (!explicitColumn) return Boolean(config.includeGiftDefault);
  return parseVisibilityValue(row && row[explicitColumn], Boolean(config.includeGiftDefault));
}

function collectGiftShadowItems(doc, row, options = {}) {
  const count = Math.max(getGiftCount(row || {}, "gift") || 0, 0);
  const items = [];
  for (let i = 1; i <= count; i += 1) {
    if (options.excludeCoupon && isAddOnCouponImageIndex(row || {}, "gift", i)) continue;
    const layer = findCurrentMechanismLayerByName(doc, row, `img.gift.${i}`);
    const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (layer && box) {
      items.push({ layer, box, index: i, source: getImageSourceForIndex(row || {}, "gift", i) });
    }
  }

  if (!options.excludeCoupon) {
    const couponIndex = parseCount(row && row[getAddOnCouponIndexColumn("gift")]);
    const hasCouponItem = items.some((item) => Number(item.index) === couponIndex);
    if (couponIndex > 0 && isAddOnCouponImageIndex(row || {}, "gift", couponIndex) && !hasCouponItem) {
      const couponLayer = findAddOnCouponTemplateLayer(doc, row);
      const couponBox = couponLayer && couponLayer.visible !== false && getBoundsBox(couponLayer.boundsNoEffects || couponLayer.bounds);
      if (couponLayer && couponBox) {
        items.push({ layer: couponLayer, box: couponBox, index: couponIndex, source: getAddOnCouponProductToken(row) || resolveAddOnCouponImage(row) });
      }
    }
  }

  if (items.length) return items;

  if (count <= 1 && !(options.excludeCoupon && isAddOnCouponImageIndex(row || {}, "gift", 1))) {
    const layer = findCurrentMechanismLayerByName(doc, row, "img.gift");
    const box = layer && layer.visible !== false && getBoundsBox(layer.boundsNoEffects || layer.bounds);
    if (layer && box) return [{ layer, box, index: 1, source: getImageSourceForIndex(row || {}, "gift", 1) }];
  }
  return [];
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
}

async function scaleProductItemsByFactor(items, factor) {
  if (!Number.isFinite(factor) || factor <= 0 || factor >= 1) return;
  for (const item of items) {
    if (item.fixedSize) continue;
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
    if (item.fixedSize) continue;
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
    index: item.index,
    fixedSize: !!item.fixedSize,
    source: item.source,
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

  const hasFixedSizeProduct = freshItems.some((item) => item.fixedSize);
  const couponLineGap = Math.max(1, readNumber(row, "coupon.gap", readNumber(row, "addOnCoupon.gap", 12)));
  const useCategoryGaps = !touchEdges && shouldUseProductCategoryPairGaps(row);
  let gaps = [];
  if (touchEdges) {
    gaps = Array(Math.max(0, freshItems.length - 1)).fill(hasFixedSizeProduct ? 1 : 0);
  } else if (hasFixedSizeProduct) {
    for (let i = 0; i < Math.max(0, freshItems.length - 1); i += 1) {
      const leftItem = freshItems[i];
      const rightItem = freshItems[i + 1];
      if (leftItem.fixedSize || rightItem.fixedSize) {
        gaps.push(couponLineGap);
      } else if (useCategoryGaps) {
        gaps.push(getProductCategoryPairGap(
          row,
          leftItem.index || i + 1,
          rightItem.index || i + 2,
          leftItem.box.width,
          rightItem.box.width,
          gap,
          "line"
        ));
      } else {
        gaps.push(getProductGapAt(row, leftItem.index || i + 1, "line", 0, gap));
      }
    }
  } else {
    gaps = useCategoryGaps
      ? getProductCategoryPairGaps(row, freshItems.map((item) => item.box), gap, "line")
      : getProductItemGaps(row, freshItems, "line", 0, gap);
  }
  gaps = normalizeProductLineGaps(gaps);

  if (hasFixedSizeProduct) {
    let totalWidth = getItemsTotalWidth(freshItems, gaps);
    if (totalWidth > areaBox.width) {
      const fixedWidth = freshItems.reduce((sum, item) => sum + (item.fixedSize ? item.box.width : 0), 0);
      const scalableWidth = freshItems.reduce((sum, item) => sum + (item.fixedSize ? 0 : item.box.width), 0);
      const gapWidth = gaps.reduce((sum, item) => sum + item, 0);
      const availableWidth = areaBox.width - fixedWidth - gapWidth;
      const factor = scalableWidth > 0 ? availableWidth / scalableWidth : 1;
      if (factor > 0 && factor < 1) {
        await scaleProductItemsByFactor(freshItems, factor);
        freshItems = refreshProductItems(freshItems);
        totalWidth = getItemsTotalWidth(freshItems, gaps);
      }
    }

    let left = areaBox.centerX - totalWidth / 2;
    for (let i = 0; i < freshItems.length; i += 1) {
      const item = freshItems[i];
      const targetCenterX = left + item.box.width / 2;
      await item.layer.translate(targetCenterX - item.box.centerX, areaBox.bottom - item.box.bottom);
      left += item.box.width + (gaps[i] || 0);
    }

    freshItems = refreshProductItems(freshItems);
    const finalGroupBox = getItemsGroupBox(freshItems);
    await arrangeProductLayerStacking(freshItems, getImageGroupZOrder(row, "product"));
    log(`  Arranged product line after replace. touchEdges=${touchEdges}, gapMode=fixed, gap=${gaps.join("|") || gap}, groupW=${finalGroupBox ? Math.round(finalGroupBox.width) : "?"}, groupH=${finalGroupBox ? Math.round(finalGroupBox.height) : "?"}, items=${freshItems.length}`);
    return;
  }

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
  const finalGroupBox = getItemsGroupBox(freshItems);

  await arrangeProductLayerStacking(freshItems, getImageGroupZOrder(row, "product"));
  log(`  Arranged product line after replace. touchEdges=${touchEdges}, gapMode=${useCategoryGaps ? "category" : "manual"}, gap=${gaps.join("|") || gap}, groupW=${finalGroupBox ? Math.round(finalGroupBox.width) : "?"}, groupH=${finalGroupBox ? Math.round(finalGroupBox.height) : "?"}, items=${freshItems.length}`);
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
  const hasFixedSizeProduct = Array.from({ length: count }, (_, index) => isAddOnCouponProductIndex(row, index + 1)).some(Boolean);
  if (!hasFixedSizeProduct && !shouldTouchProductEdges(row) && shouldUseProductCategoryPairGaps(row)) {
    const preparedLayers = collectProductItems(doc, count, row);
    await arrangeProductLayerStacking(preparedLayers, getImageGroupZOrder(row, "product"));
    log(`  Product arrange skipped: using prepared category-gap ${layout} layout.`);
    return;
  }
  const areaBox = state.groupAreaBoxes.product;
  if (!areaBox) {
    log("  Product arrange skipped: product.area not found.");
    return;
  }

  const layers = collectProductItems(doc, count, row);
  if (!layers.length) {
    log("  Product arrange skipped: no product layers found.");
    return;
  }

  await scaleProductItemsToHeight(layers, row, areaBox);
  const refreshed = refreshProductItems(layers);

  if (layout === "line") {
    await arrangeProductLineItems(refreshed, row, areaBox, rawLayout);
    return;
  }

  await arrangeProductOverlapItems(refreshed, row, areaBox, layout);
}

async function arrangeImageGroupLayerStacking(items, zOrder, label = "product") {
  if (!items.length) return;

  const leftToRight = [...items].sort((a, b) => a.box.centerX - b.box.centerX);
  let frontToBack = zOrder === "rightFront" ? [...leftToRight].reverse() : leftToRight;
  const hasAmpoule = frontToBack.some((item) => isAmpouleCategorySource(item.source));
  if (hasAmpoule) {
    frontToBack = [
      ...frontToBack.filter((item) => !isAmpouleCategorySource(item.source)),
      ...frontToBack.filter((item) => isAmpouleCategorySource(item.source))
    ];
  }

  for (let i = frontToBack.length - 2; i >= 0; i -= 1) {
    const frontLayer = frontToBack[i].layer;
    const behindLayer = frontToBack[i + 1].layer;

    try {
      await frontLayer.move(behindLayer, photoshop.constants.ElementPlacement.PLACEBEFORE);
      log(`  Z-order: ${frontLayer.name} above ${behindLayer.name}`);
    } catch (error) {
      log(`  Warning: ${label} z-order skipped for ${frontLayer.name}: ${formatError(error)}`);
    }
  }

  if (hasAmpoule) {
    log(`  ${label} z-order rule: non-ampoule layers placed above ampoule layers.`);
  }
}

async function arrangeProductLayerStacking(items, zOrder) {
  const enrichedItems = items.map((item, index) => ({
    ...item,
    source: item.source || getImageSourceForIndex(state.currentRow || {}, "product", index + 1)
  }));
  await arrangeImageGroupLayerStacking(enrichedItems, zOrder, "product");
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
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    return photoshop.app.activeDocument.activeLayers[0] || layer;
  } catch (error) {
    log(`  Product shadow merge skipped: ${formatError(error)}`);
    return null;
  }
}

async function mergeLayersBestEffort(layers, label) {
  const activeLayers = (layers || []).filter(Boolean);
  if (!activeLayers.length) return null;
  if (activeLayers.length === 1) return activeLayers[0];

  ensureModules();
  photoshop.app.activeDocument.activeLayers = activeLayers;
  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "mergeLayers",
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    return photoshop.app.activeDocument.activeLayers[0] || activeLayers[0];
  } catch (error) {
    log(`  ${label || "Layer"} merge skipped: ${formatError(error)}`);
    return activeLayers[0];
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

function isProtectedMainProductLabelLayer(layer) {
  const config = getCurrentTemplateConfig();
  return !!(config && config.id === "baibuMiaoshaMain" && hasValue(state.currentRow || {}, "txt.mainProductLabel") && String(layer && layer.name || "").trim() === "txt.mainProductLabel");
}

function layerTreeContainsProtectedMainProductLabel(layer) {
  if (!layer) return false;
  if (isProtectedMainProductLabelLayer(layer)) return true;
  return isLayerGroup(layer) && Array.from(layer.layers || []).some(layerTreeContainsProtectedMainProductLabel);
}

function protectMainProductLabelVisibility(layer, label = "PSD cleanup") {
  if (!layerTreeContainsProtectedMainProductLabel(layer)) return false;
  try {
    layer.visible = true;
  } catch (error) {
    log(`  ${label} main label visibility skipped: ${formatError(error)}`);
  }
  return true;
}

async function pruneLayerCollectionForPsd(layers, ancestorsVisible) {
  const result = { hidden: 0, empty: 0 };
  const snapshot = Array.from(layers || []);

  for (const layer of snapshot) {
    if (!layer) continue;
    let effectivelyVisible = ancestorsVisible && isLayerDisplayedForFinalPsd(layer);

    if (!effectivelyVisible && protectMainProductLabelVisibility(layer, "PSD cleanup")) {
      effectivelyVisible = ancestorsVisible && isLayerDisplayedForFinalPsd(layer);
      log(`  PSD cleanup: protected txt.mainProductLabel from deletion in ${layer.name}.`);
    }

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

async function deleteLayerTreeBestEffort(layer, label = "PSD layer tree") {
  if (!layer) return false;
  if (isLayerGroup(layer)) {
    for (const child of Array.from(layer.layers || [])) {
      await deleteLayerTreeBestEffort(child, `${label} child ${child.name || "layer"}`);
    }
  }
  return deleteLayerBestEffort(layer, label);
}

function getConfiguredArtboardVariantNames(config = getArtboardSwitchConfig()) {
  if (!config || !config.variants) return new Set();
  return new Set(Object.values(config.variants)
    .flat()
    .map((name) => String(name || "").trim())
    .filter(Boolean));
}

function getCurrentArtboardLayerName() {
  return String(state.currentArtboardName || state.currentArtboardLayer && state.currentArtboardLayer.name || "").trim();
}

function refreshCurrentArtboardLayer(doc, label = "PSD export") {
  const switchConfig = getArtboardSwitchConfig();
  const name = getCurrentArtboardLayerName();
  if (!doc || !doc.layers || !switchConfig || !name) return state.currentArtboardLayer || null;

  const refreshed = Array.from(doc.layers || []).find((layer) => String(layer && layer.name || "").trim() === name) || findArtboardLayerByNames(doc, [name]);
  if (!refreshed) return state.currentArtboardLayer || null;

  if (!isSameLayerReference(refreshed, state.currentArtboardLayer)) {
    state.currentArtboardLayer = refreshed;
    state.currentArtboardName = refreshed.name;
    log(`  ${label} artboard reference refreshed: ${refreshed.name}.`);
  }
  return refreshed;
}

async function removeInactiveArtboardVariantLayersForPsd(doc, label = "PSD export") {
  const switchConfig = getArtboardSwitchConfig();
  if (!doc || !doc.layers || !switchConfig || !state.currentArtboardLayer) return 0;

  const activeLayer = refreshCurrentArtboardLayer(doc, label);
  const activeName = getCurrentArtboardLayerName();
  const variantNames = getConfiguredArtboardVariantNames(switchConfig);
  if (!variantNames.size) return 0;

  let removed = 0;
  for (const layer of Array.from(doc.layers || [])) {
    const name = String(layer && layer.name || "").trim();
    if (!variantNames.has(name) || name === activeName || isSameLayerReference(layer, activeLayer)) continue;
    if (await deleteLayerTreeBestEffort(layer, `${label} inactive artboard ${name}`)) {
      removed += 1;
    }
  }

  if (removed) {
    log(`  ${label} cleanup: removed ${removed} inactive artboard layer(s).`);
  }
  return removed;
}

async function ungroupLayerBestEffort(layer, label = "PSD artboard") {
  if (!layer) return [];
  ensureModules();

  try {
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "ungroupLayersEvent",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    return Array.from(photoshop.app.activeDocument.activeLayers || []).filter(Boolean);
  } catch (error) {
    log(`  ${label} ungroup skipped: ${formatError(error)}`);
  }

  return [];
}

async function liftGroupChildrenToTopLevelBestEffort(group, label = "PSD artboard") {
  if (!group || !group.layers) return [];
  const children = Array.from(group.layers || []).filter(Boolean);
  const moved = [];

  for (const child of children) {
    try {
      await child.move(group, photoshop.constants.ElementPlacement.PLACEBEFORE);
      moved.push(child);
    } catch (error) {
      log(`  ${label} child lift skipped: ${child.name || "layer"}: ${formatError(error)}`);
    }
  }

  if (moved.length && Array.from(group.layers || []).length === 0) {
    await deleteLayerBestEffort(group, `${label} empty artboard`);
  }
  return moved;
}

function findTopLevelGroupByName(doc, name) {
  const normalized = String(name || "").trim().toLowerCase();
  if (!normalized) return null;
  return Array.from(doc && doc.layers || []).find((layer) => {
    return isLayerGroup(layer) && String(layer.name || "").trim().toLowerCase() === normalized;
  }) || null;
}

function isSameLayerReference(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  return typeof a.id !== "undefined" && typeof b.id !== "undefined" && a.id === b.id;
}

function getLayerPackSnapshot(layer) {
  return {
    id: typeof layer.id !== "undefined" ? layer.id : null,
    name: String(layer.name || ""),
    bounds: getBoundsBox(layer.boundsNoEffects || layer.bounds)
  };
}

function layerBoundsMatchSnapshot(layer, snapshot) {
  const box = getBoundsBox(layer && (layer.boundsNoEffects || layer.bounds));
  const snapBox = snapshot && snapshot.bounds;
  if (!box || !snapBox) return true;
  return Math.abs(box.left - snapBox.left) <= 2 &&
    Math.abs(box.top - snapBox.top) <= 2 &&
    Math.abs(box.right - snapBox.right) <= 2 &&
    Math.abs(box.bottom - snapBox.bottom) <= 2;
}

function findTopLevelLayersByPackSnapshots(doc, snapshots = []) {
  const candidates = Array.from(doc && doc.layers || []).filter((layer) => layer && isLayerDisplayedForFinalPsd(layer));
  const used = new Set();
  const layers = [];

  snapshots.forEach((snapshot) => {
    const found = candidates.find((layer, index) => {
      if (used.has(index)) return false;
      if (snapshot.id !== null && typeof layer.id !== "undefined" && layer.id === snapshot.id) return true;
      return String(layer.name || "") === snapshot.name && layerBoundsMatchSnapshot(layer, snapshot);
    });
    if (found) {
      used.add(candidates.indexOf(found));
      layers.push(found);
    }
  });

  return layers;
}

async function packCurrentArtboardForPsd(doc, groupName, label = "PSD export") {
  const switchConfig = getArtboardSwitchConfig();
  if (!doc || !doc.layers || !switchConfig) return null;

  await activateDocumentBestEffort(doc);
  const artboard = refreshCurrentArtboardLayer(doc, label);
  if (!artboard || !artboard.layers) return null;
  const packLayersBeforeUngroup = Array.from(artboard.layers || []).filter((layer) => layer && isLayerDisplayedForFinalPsd(layer));
  const snapshots = packLayersBeforeUngroup.map(getLayerPackSnapshot);
  if (!packLayersBeforeUngroup.length) {
    log(`  ${label} artboard pack skipped: current artboard has no visible layers.`);
    return null;
  }

  await ungroupLayerBestEffort(artboard, `${label} ${state.currentArtboardName || artboard.name}`);
  const protectedMainLabel = findTopLevelLayersByPackSnapshots(doc, snapshots).find((layer) => String(layer.name || "") === "txt.mainProductLabel");
  if (protectedMainLabel) ensureLayerVisibleForDataReplacement(protectedMainLabel, "txt.mainProductLabel");

  let packLayers = packLayersBeforeUngroup;
  let group = await groupSelectedLayersBestEffort(packLayers, groupName, `${label} group ${groupName}`);
  if (!group) {
    packLayers = findTopLevelLayersByPackSnapshots(doc, snapshots);
    if (!packLayers.length) {
      packLayers = await liftGroupChildrenToTopLevelBestEffort(artboard, `${label} ${state.currentArtboardName || artboard.name}`);
    }
    group = await groupSelectedLayersBestEffort(packLayers, groupName, `${label} group ${groupName}`);
  }
  if (!group) {
    log(`  ${label} artboard pack skipped: group creation failed.`);
    return null;
  }

  state.currentArtboardLayer = group;
  state.currentArtboardName = group.name;
  log(`  ${label} artboard packed as group: ${group.name}.`);
  return group;
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

  if (typeof doc.id === "undefined" || doc.id === null) {
    log("  Activate document action skipped: document id unavailable.");
    return false;
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
  await activateDocumentBestEffort(doc);
  await pruneNonDisplayedLayersForPsd(doc, `Merge source ${groupName}`);
  await removeAreaGroups(doc);
  if (keepBg) {
    await moveBgToBottom(doc);
  } else {
    await removeBgLayers(doc);
  }

  const existingGroup = findTopLevelGroupByName(doc, groupName);
  if (existingGroup && Array.from(doc.layers || []).filter((layer) => layer && !isBgLayerName(layer.name)).length === 1) {
    existingGroup.visible = true;
    log(`  Merge source already packed: ${groupName}.`);
    return existingGroup;
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

async function removeExistingProductShadowLayers(doc, config) {
  const shadowName = config.name || "PRODUCT.shadow";
  const existing = getAllLayers(doc.layers).filter((layer) => layer.name === shadowName);
  if (!existing.length) return;

  let removed = 0;
  for (const layer of existing) {
    if (await deleteLayerBestEffort(layer, `Existing ${shadowName}`)) {
      removed += 1;
    }
  }

  if (removed) {
    log(`  Product shadow cleanup: removed ${removed} existing ${shadowName} layer(s).`);
  }
}

async function duplicateLayerBestEffort(layer, name, label) {
  if (!layer) return null;
  ensureModules();

  try {
    const duplicated = await layer.duplicate();
    duplicated.name = name;
    duplicated.visible = true;
    return duplicated;
  } catch (error) {
    log(`  ${label || layer.name} DOM duplicate skipped: ${formatError(error)}`);
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
          name,
          version: 5,
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    const duplicated = photoshop.app.activeDocument.activeLayers[0];
    if (duplicated) {
      duplicated.name = name;
      duplicated.visible = true;
      return duplicated;
    }
  } catch (error) {
    log(`  ${label || layer.name} action duplicate skipped: ${formatError(error)}`);
  }

  return null;
}

async function cleanupProductShadowTempGroups(doc, config = {}) {
  const sourceName = String(config.sourceGroupName || "PRODUCT").trim().toLowerCase();
  const shadowName = String(config.name || "PRODUCT.shadow").trim().toLowerCase();
  const copyMarkers = ["copy", "\u62f7\u8d1d", "\u526f\u672c"];
  const layers = getAllLayers(doc.layers).filter((layer) => {
    const name = String(layer && layer.name || "").trim().toLowerCase();
    if (!name || name === sourceName || name === shadowName) return false;
    return copyMarkers.some((marker) => name === `${sourceName} ${marker}` || name.startsWith(`${sourceName} ${marker} `));
  });
  let removed = 0;
  for (const layer of layers) {
    if (await deleteLayerBestEffort(layer, `Product shadow temp group ${layer.name}`)) {
      removed += 1;
    }
  }
  if (removed) log(`  Product shadow cleanup: removed ${removed} temp PRODUCT copy group(s).`);
}

async function createProductShadowSourceLayer(doc, productGroup, config) {
  const shadowName = config.name || "PRODUCT.shadow";
  const sourceMode = String(config.sourceMode || "").trim().toLowerCase();
  const useItemSource = ["items", "item", "layers", "productitems", "product-items"].includes(sourceMode);
  if (!useItemSource) {
    const groupCopy = await duplicateLayerBestEffort(productGroup, shadowName, "Product shadow PRODUCT group");
    if (groupCopy) {
      const merged = await mergeActiveLayerBestEffort(groupCopy);
      if (merged) {
        merged.name = shadowName;
        return merged;
      }
    }
  }

  if (sourceMode === "group" || sourceMode === "productgroup" || sourceMode === "product-group") {
    log("  Product shadow item fallback skipped: PRODUCT group source is required by profile.");
    return null;
  }

  const row = state.currentRow || {};
  const productItems = collectProductGroupItems(doc, row, { excludeCoupon: true });
  const giftItems = shouldIncludeGiftInProductShadow(row, config)
    ? collectGiftShadowItems(doc, row, { excludeCoupon: !config.includeGiftCouponShadow })
    : [];
  const shadowItems = [...productItems, ...giftItems];
  if (!shadowItems.length) {
    log("  Product shadow item fallback skipped: no visible product or gift image layers.");
    return null;
  }
  if (giftItems.length) {
    log(`  Product shadow gift items included: ${giftItems.map((item) => item.layer.name).join(" + ")}.`);
  }

  const copies = [];
  for (let i = 0; i < shadowItems.length; i += 1) {
    const copy = await duplicateLayerBestEffort(
      shadowItems[i].layer,
      `${shadowName}.${i + 1}`,
      `Product shadow ${shadowItems[i].layer.name}`
    );
    if (copy) copies.push(copy);
  }

  const merged = await mergeLayersBestEffort(copies, "Product shadow item fallback");
  if (!merged) return null;
  merged.name = shadowName;
  return merged;
}

function findProductShadowTargetGroup(doc, config) {
  const targetGroupNames = [
    config.targetGroupName,
    ...(config.targetGroupNames || []),
    "PROJECT"
  ].filter(Boolean);

  for (const name of targetGroupNames) {
    const layer = findLayerByPath(doc, name) || findLayerByName(doc, name);
    if (layer) return layer;
  }
  return null;
}

async function moveLayerToGroupBestEffort(layer, group) {
  if (!layer || !group) return false;
  const placements = [
    photoshop.constants.ElementPlacement.PLACEINSIDE,
    photoshop.constants.ElementPlacement.PLACEATBEGINNING,
    photoshop.constants.ElementPlacement.PLACEATEND,
    photoshop.constants.ElementPlacement.INSIDE
  ].filter(Boolean);

  let lastError = null;
  for (const placement of placements) {
    try {
      await layer.move(group, placement);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  const childLayers = Array.from(group.layers || []).filter((child) => child && child !== layer);
  const childTargets = [
    childLayers[0] && { layer: childLayers[0], placement: photoshop.constants.ElementPlacement.PLACEBEFORE },
    childLayers[childLayers.length - 1] && { layer: childLayers[childLayers.length - 1], placement: photoshop.constants.ElementPlacement.PLACEAFTER }
  ].filter((item) => item && item.layer && item.placement);

  for (const item of childTargets) {
    try {
      await layer.move(item.layer, item.placement);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  log(`  Product shadow target move skipped: ${formatError(lastError)}`);
  return false;
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

function findLayersByAnyNameInLayer(parentLayer, names, result = []) {
  if (!parentLayer || !parentLayer.layers) return result;
  const normalizedNames = (names || []).map((name) => String(name || "").trim().toLowerCase()).filter(Boolean);
  for (const layer of parentLayer.layers) {
    const layerName = String(layer.name || "").trim().toLowerCase();
    if (normalizedNames.includes(layerName)) {
      result.push(layer);
    }
    findLayersByAnyNameInLayer(layer, names, result);
  }
  return result;
}

function hideTemplateProductShadowLayers(doc, row, config) {
  const names = config.hideTemplateNames || ["img.productshadow"];
  const mechanismLayer = findDailyMechanismLayer(doc, row || state.currentRow || {});
  const layers = mechanismLayer
    ? findLayersByAnyNameInLayer(mechanismLayer, names)
    : getAllLayers(doc.layers).filter((layer) => names.some((name) => String(layer.name || "").trim().toLowerCase() === String(name || "").trim().toLowerCase()));
  let hidden = 0;
  layers.forEach((layer) => {
    if (layer) {
      layer.visible = false;
      hidden += 1;
    }
  });
  if (hidden) {
    log(`  Template product shadow hidden: ${hidden}.`);
  }
}

function findCurrentProductBottomShadowLayer(doc, row, config) {
  const name = config.layerName || "img.productshadow";
  const mechanismLayer = findDailyMechanismLayer(doc, row || state.currentRow || {});
  const current = mechanismLayer && findLayerByNameInLayer(mechanismLayer, name);
  const all = findLayersByName(doc, name);
  all.forEach((layer) => {
    if (layer && layer !== current) layer.visible = false;
  });
  return current || all[0] || null;
}

function normalizeProductShadowStyle(row, config = getCurrentTemplateConfig()) {
  const raw = String(
    row && (row["productShadow.style"] || row["shadow.style"] || row.shadowStyle || row.shadow) ||
    config && config.productShadow && config.productShadow.style ||
    ""
  ).trim().toLowerCase();

  if (/^(0|none|off|false|no|n|hide|hidden|无|关闭)$/.test(raw)) return "none";
  if (/^(2|right|black|drop|bottom|pdd|pdddaily|投影2|黑色|右侧|右侧投影)$/.test(raw)) return "right";
  if (/^(1|mirror|reflection|reflect|image|current|default|投影1|镜像|镜像投影)$/.test(raw)) return "mirror";
  return "";
}

async function rasterizeLayerBestEffort(layer, label) {
  if (!layer) return;
  ensureModules();
  try {
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "rasterizeLayer",
          _target: [
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }
          ],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  ${label || layer.name} rasterize skipped: ${formatError(error)}`);
  }
}

async function gaussianBlurLayerBestEffort(layer, radius, label) {
  if (!layer || !Number.isFinite(radius) || radius <= 0) return;
  ensureModules();
  try {
    photoshop.app.activeDocument.activeLayers = [layer];
    await photoshop.action.batchPlay(
      [
        {
          _obj: "gaussianBlur",
          radius: { _unit: "pixelsUnit", _value: radius },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  ${label || layer.name} blur skipped: ${formatError(error)}`);
  }
}

async function createGeneratedProductBottomShadowLayer(targetBox, name, opacity, blurRadius) {
  if (!targetBox) return null;
  ensureModules();
  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "make",
          _target: [
            { _ref: "contentLayer" }
          ],
          using: {
            _obj: "contentLayer",
            type: {
              _obj: "solidColorLayer",
              color: { _obj: "RGBColor", red: 0, grain: 0, blue: 0 }
            },
            shape: {
              _obj: "ellipse",
              top: { _unit: "pixelsUnit", _value: targetBox.top },
              left: { _unit: "pixelsUnit", _value: targetBox.left },
              bottom: { _unit: "pixelsUnit", _value: targetBox.bottom },
              right: { _unit: "pixelsUnit", _value: targetBox.right }
            }
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    const layer = photoshop.app.activeDocument.activeLayers[0];
    if (!layer) return null;
    layer.name = name;
    layer.visible = true;
    if (Number.isFinite(opacity) && opacity >= 0 && opacity <= 100) {
      try {
        layer.opacity = opacity;
      } catch (error) {
        log(`  Generated product shadow opacity skipped: ${formatError(error)}`);
      }
    }
    await rasterizeLayerBestEffort(layer, name);
    await gaussianBlurLayerBestEffort(layer, blurRadius, name);
    return layer;
  } catch (error) {
    log(`  Generated product bottom shadow skipped: ${formatError(error)}`);
    return null;
  }
}
async function resizeLayerToBox(layer, targetBox) {
  const box = getBoundsBox(layer && (layer.boundsNoEffects || layer.bounds));
  if (!box || !targetBox || box.width <= 0 || box.height <= 0) return false;

  await layer.scale(
    targetBox.width / box.width * 100,
    targetBox.height / box.height * 100,
    photoshop.constants.AnchorPosition.MIDDLECENTER,
    { interpolation: photoshop.constants.InterpolationMethod.AUTOMATIC }
  );

  const resizedBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!resizedBox) return false;
  await layer.translate(targetBox.centerX - resizedBox.centerX, targetBox.centerY - resizedBox.centerY);
  return true;
}

async function prepareProductBottomShadowLayers(doc, row, config, count) {
  const baseLayer = findCurrentProductBottomShadowLayer(doc, row, config);
  const baseName = config.layerName || "img.productshadow";
  if (!baseLayer) {
    return config.generateIfMissing ? Array.from({ length: count }, () => null) : [];
  }

  const layers = [baseLayer];
  for (let i = 2; i <= count; i += 1) {
    const layerName = `${baseName}.${i}`;
    let layer = findCurrentMechanismLayerByName(doc, row, layerName);
    if (!layer) {
      layer = await baseLayer.duplicate();
      layer.name = layerName;
      log(`  Created ${layerName} from ${baseLayer.name}.`);
    }
    layers.push(layer);
  }

  let extraIndex = count + 1;
  while (true) {
    const extra = findCurrentMechanismLayerByName(doc, row, `${baseName}.${extraIndex}`);
    if (!extra) break;
    extra.visible = false;
    extraIndex += 1;
  }

  return layers;
}

function getProductItemSourceForShadow(item, row, fallbackIndex) {
  const name = String(item && item.layer && item.layer.name || "");
  const match = name.match(/^img\.product(?:\.(\d+))?$/);
  const index = match && match[1] ? Number(match[1]) : fallbackIndex + 1;
  return item.source || getImageSourceForIndex(row || state.currentRow || {}, "product", index);
}

function getBackmostProductLayerForShadow(items, row) {
  if (!items.length) return null;

  const currentRow = row || state.currentRow || {};
  const leftToRight = [...items].sort((a, b) => a.box.centerX - b.box.centerX);
  let frontToBack = getImageGroupZOrder(currentRow, "product") === "rightFront" ? [...leftToRight].reverse() : leftToRight;
  const hasAmpoule = frontToBack.some((item, index) => isAmpouleCategorySource(getProductItemSourceForShadow(item, currentRow, index)));
  if (hasAmpoule) {
    const nonAmpoule = [];
    const ampoule = [];
    frontToBack.forEach((item, index) => {
      if (isAmpouleCategorySource(getProductItemSourceForShadow(item, currentRow, index))) {
        ampoule.push(item);
      } else {
        nonAmpoule.push(item);
      }
    });
    frontToBack = [...nonAmpoule, ...ampoule];
  }

  return frontToBack[frontToBack.length - 1] && frontToBack[frontToBack.length - 1].layer || null;
}
async function applyProductBottomShadow(doc, row) {
  const config = getCurrentTemplateConfig().productBottomShadow;
  if (!config || !config.enabled) return;

  const items = collectProductGroupItems(doc, row || state.currentRow || {}, { excludeCoupon: !!config.excludeCoupon });
  if (!items.length) {
    log("  Product bottom shadow skipped: no current product layer found.");
    return;
  }

  const shadowLayers = await prepareProductBottomShadowLayers(doc, row, config, items.length);
  if (!shadowLayers.length) {
    log("  Product bottom shadow skipped: img.productshadow not found.");
    return;
  }

  const opacity = readNumber(row || {}, "productBottomShadow.opacity", Number(config.opacity) || 72);
  const widthRatio = readNumber(row || {}, "productBottomShadow.widthRatio", Number(config.widthRatio) || 1);
  const heightRatio = readNumber(row || {}, "productBottomShadow.heightRatio", Number(config.heightRatio) || 0.07);
  const offsetXRatio = readNumber(row || {}, "productBottomShadow.offsetXRatio", Number(config.offsetXRatio) || 0.18);
  const bottomOffsetRatio = readNumber(row || {}, "productBottomShadow.bottomOffsetRatio", Number(config.bottomOffsetRatio) || 0.14);
  const blurRadius = readNumber(row || {}, "productBottomShadow.blur", Number(config.blur) || 0);
  const baseName = config.layerName || "img.productshadow";

  const summaries = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const productBox = getBoundsBox(item.layer.boundsNoEffects || item.layer.bounds) || item.box;
    if (!productBox) continue;

    const width = Math.max(8, productBox.width * widthRatio);
    const height = Math.max(4, productBox.height * heightRatio);
    const centerX = productBox.centerX + productBox.width * offsetXRatio;
    const bottom = productBox.bottom + height * bottomOffsetRatio;
    const targetBox = makeBox(centerX - width / 2, bottom - height, width, height);

    let shadowLayer = shadowLayers[i];
    if (!shadowLayer && config.generateIfMissing) {
      shadowLayer = await createGeneratedProductBottomShadowLayer(targetBox, `${baseName}.${i + 1}`, opacity, blurRadius);
      if (shadowLayer) shadowLayers[i] = shadowLayer;
    }
    if (!shadowLayer) continue;

    shadowLayer.visible = true;
    if (Number.isFinite(opacity) && opacity >= 0 && opacity <= 100) {
      try {
        shadowLayer.opacity = opacity;
      } catch (error) {
        log(`  Product bottom shadow opacity skipped: ${formatError(error)}`);
      }
    }
    if (!config.generateIfMissing || shadowLayer !== shadowLayers[i] || !String(shadowLayer.name || "").startsWith(`${baseName}.`)) {
      await resizeLayerToBox(shadowLayer, targetBox);
    }
    summaries.push(`${shadowLayer.name}->${item.layer.name}:${Math.round(width)}x${Math.round(height)}@${Math.round(centerX)},${Math.round(bottom)}`);
  }

  const visibleShadowLayers = shadowLayers.filter((layer) => layer && layer.visible !== false);
  const backmostProductLayer = getBackmostProductLayerForShadow(items, row || state.currentRow || {});
  if (backmostProductLayer) {
    for (const shadowLayer of visibleShadowLayers) {
      try {
        await shadowLayer.move(backmostProductLayer, photoshop.constants.ElementPlacement.PLACEAFTER);
      } catch (error) {
        log(`  Product shadow block z-order skipped: ${formatError(error)}`);
      }
    }
    log(`  Product shadow block placed below ${backmostProductLayer.name}.`);
  }

  log(`  Product bottom shadows aligned: ${summaries.join("; ")}.`);
}

async function applyProductShadow(doc) {
  const config = getCurrentTemplateConfig().productShadow;
  if (!config || !config.enabled) return;

  const productGroup = findLayerByName(doc, config.sourceGroupName || "PRODUCT");
  const sourceMode = String(config.sourceMode || "").trim().toLowerCase();
  const canUseItemSource = ["items", "item", "layers", "productitems", "product-items"].includes(sourceMode);
  if (!productGroup && !canUseItemSource) {
    log("  Product shadow skipped: PRODUCT group not found.");
    return;
  }
  if (!productGroup && canUseItemSource) {
    log("  Product shadow source group not found; using visible product item layers.");
  }

  try {
    await removeExistingProductShadowLayers(doc, config);
    await cleanupProductShadowTempGroups(doc, config);
    const shadowLayer = await createProductShadowSourceLayer(doc, productGroup, config);
    if (!shadowLayer) {
      log("  Product shadow skipped: could not duplicate product source.");
      return;
    }
    shadowLayer.name = config.name || "PRODUCT.shadow";
    try {
      await flipLayerVertical(shadowLayer);
    } catch (error) {
      log(`  Product shadow flip skipped: ${formatError(error)}`);
    }

    let shadowBox = getBoundsBox(shadowLayer.boundsNoEffects || shadowLayer.bounds);
    const productAreaBox = state.groupAreaBoxes && state.groupAreaBoxes.product;
    const top = productAreaBox && Number.isFinite(productAreaBox.bottom)
      ? productAreaBox.bottom
      : readNumber(state.currentRow || {}, "productShadow.top", Number(config.top) || 740);
    if (shadowBox && Number.isFinite(top)) {
      try {
        await shadowLayer.translate(0, top - shadowBox.top);
        if (productAreaBox) {
          log(`  Product shadow top aligned to product.area bottom: y=${Math.round(top)}.`);
        }
      } catch (error) {
        log(`  Product shadow top align skipped: ${formatError(error)}`);
      }
    }

    const opacity = readNumber(state.currentRow || {}, "productShadow.opacity", Number(config.opacity) || 32);
    if (Number.isFinite(opacity) && opacity >= 0 && opacity <= 100) {
      try {
        shadowLayer.opacity = opacity;
      } catch (error) {
        log(`  Product shadow opacity skipped: ${formatError(error)}`);
      }
    }

    const projectGroup = findProductShadowTargetGroup(doc, config);
    const movedToTargetGroup = await moveLayerToGroupBestEffort(shadowLayer, projectGroup);

    if (productGroup && (config.placeAfterSource !== false || !movedToTargetGroup)) {
      try {
        await shadowLayer.move(productGroup, photoshop.constants.ElementPlacement.PLACEAFTER);
      } catch (error) {
        log(`  Product shadow z-order skipped: ${formatError(error)}`);
      }
    }

    await cleanupProductShadowTempGroups(doc, config);
    shadowBox = getBoundsBox(shadowLayer.boundsNoEffects || shadowLayer.bounds);
    log(`  Product shadow applied: top=${shadowBox ? Math.round(shadowBox.top) : "?"}, opacity=${opacity}, target=${projectGroup ? projectGroup.name : "none"}.`);
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

async function replaceTextLayerPreserveFirstStyle(layer, value) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const textValue = toPhotoshopText(value);
  const textLength = Array.from(textValue).length;

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
  const textLength = Array.from(textValue).length;

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
  const textLength = Array.from(textValue).length;

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
async function applyBottomTextRules(layer, value) {
  const mixedStyle = getCurrentTemplateConfig().bottomTextMixedStyle;
  if (mixedStyle) {
    await replaceTextLayer(layer, value);
    log("  Promo title contents only; style writes disabled to preserve PSD geometry.");
  } else {
    await replaceTextLayerPreserveFirstStyle(layer, value);
    const explicitScale = readNumber(
      state.currentRow || {},
      "txt.promoTitleScale",
      readNumber(
        state.currentRow || {},
        "promoTitle.scale",
        readNumber(state.currentRow || {}, "txt.bottomTextScale", readNumber(state.currentRow || {}, "bottomText.scale", 1))
      )
    );
    if (Number.isFinite(explicitScale) && explicitScale > 0 && explicitScale !== 1) {
      await scaleTextLayerFontSize(layer, explicitScale);
      log(`  Promo title scaled by CSV: scale=${explicitScale}.`);
    }
  }
}

async function replaceSmartObjectLayer(layer, file) {
  if (!layer || !file) return;

  log(`  Replace smart object: ${layer.name} <= ${file.name || "entry"}`);
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

  const groupMatch = layer.name.match(/^img\.(product|giftLeft|giftRight|gift)$/);
  const areaBox = groupMatch && state.groupAreaBoxes[groupMatch[1]];
  if (areaBox) {
    const prefix = groupMatch[1];
    const row = state.currentRow || {};
    let targetBox = prefix === "product"
      ? applyProductHeightRatioToBox(row, 1, areaBox, areaBox, 1)
      : areaBox;
    let alignY = prefix === "product" ? "bottom" : "center";
    let fitBy = prefix === "product" || prefix === "gift" ? "height" : "contain";

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

  ensureModules();
  const rawFilename = String(filename).trim();
  if (/^file:\/\//i.test(rawFilename) && fs.getEntryWithUrl) {
    return fs.getEntryWithUrl(rawFilename);
  }
  if (/^[a-zA-Z]:[\\/]/.test(rawFilename) && fs.getEntryWithUrl) {
    return fs.getEntryWithUrl(pathToFileUrl(rawFilename));
  }
  const normalized = normalizeImagePathForTemplate(String(filename).replace(/\\/g, "/"), options);
  const productViewFallbacks = getProductImageViewFallbacks(normalized, options);
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

function getProductImageViewFallbacks(filename, options = {}) {
  const normalized = normalizeImagePathForTemplate(String(filename || "").replace(/\\/g, "/"), options);
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
    ].map((item) => normalizeImagePathForTemplate(item, options))));
  }

  const base = match[1];
  const view = match[2].toLowerCase();
  const ext = match[3];
  const withoutProducts = base.replace(/^products\//i, "");
  const candidates = [normalized];
  candidates.push(normalized.replace(/^products\//i, ""));
  if (view === "angle") {
    const baseWithoutAngleFolder = base.replace(/(^|\/)angle(\/)/i, "$1$2");
    const withoutProductsNoAngle = withoutProducts.replace(/(^|\/)angle(\/)/i, "$1");
    candidates.push(`${base}${ext}`);
    candidates.push(`${baseWithoutAngleFolder}${ext}`);
    candidates.push(`angle/${withoutProductsNoAngle}-angle${ext}`);
    candidates.push(`${baseWithoutAngleFolder}-front${ext}`);
    candidates.push(`front/${withoutProductsNoAngle}-front${ext}`);
  }
  if (view === "front") {
    candidates.push(`${base}-F${ext}`);
    candidates.push(`${base.replace(/(^|\/)front(\/)/i, "$1$2")}-F${ext}`);
    candidates.push(`${base.replace(/(^|\/)front(\/)/i, "$1$2")}-front${ext}`);
    candidates.push(`front/${withoutProducts.replace(/(^|\/)front(\/)/i, "$1")}-front${ext}`);
  }
  return Array.from(new Set(candidates.map((item) => normalizeImagePathForTemplate(item, options))));
}

async function getAssetEntryWithoutProductViewFallback(normalized, options = {}) {
  normalized = normalizeImagePathForTemplate(normalized, options);
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

  try {
    return await assetsFolder.getEntry(normalized);
  } catch (error) {
    const configuredFallback = await getConfiguredAssetEntry(normalized);
    if (configuredFallback) return configuredFallback;
    throw error;
  }
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
  const priorityEnabled = !!config.enabled;
  const folder = config.folder || "babyproduct_icefrosteffect";
  const useFolderFallback = priorityEnabled && config.useFolderFallback !== false;
  const relative = removeProductAssetFolders(raw);
  const ext = getAssetExtension(relative);
  const base = stripAssetExtension(relative).replace(/-(?:angle|front)$/i, "");
  const bases = getProductSpecUnitAliasBases(base);
  const configuredViews = Array.isArray(config.views)
    ? config.views.map((view) => normalizeProductImageViewValue(view)).filter(Boolean)
    : [];
  const rawView = /^(?:products\/)?front\//i.test(raw) ? "front" : /^(?:products\/)?angle\//i.test(raw) ? "angle" : "";
  const requestedView = getProductImageViewFromOptions(options) || rawView;
  const fallbackViews = configuredViews.length ? configuredViews : ["angle", "front"];
  const orderedViews = requestedView
    ? [requestedView, ...fallbackViews.filter((view) => view !== requestedView)]
    : fallbackViews;
  const folderCandidates = (item) => useFolderFallback ? [
    `${folder}/${item}-ice${ext}`,
    `${folder}/${item}-water${ext}`,
    `${folder}/${item}${ext}`
  ] : [];
  const viewCandidates = (item) => orderedViews.flatMap((view) => [
    `${view}/${item}-${view}${ext}`,
    `products/${view}/${item}-${view}${ext}`
  ]);

  if (!options.productFallbackPriority) {
    if (!/^(?:front|angle)\//i.test(raw)) return [];
    return Array.from(new Set(bases.flatMap((item) => [
      raw,
      ...viewCandidates(item),
      ...folderCandidates(item),
      `products/${item}${ext}`,
      `${item}${ext}`
    ])));
  }

  const candidates = bases.flatMap((item) => [
    raw,
    ...viewCandidates(item),
    ...folderCandidates(item),
    `products/${item}${ext}`,
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
    const configuredEntry = await getConfiguredAssetEntry(candidate, candidate !== normalized ? `Unified asset configured fallback: ${normalized} -> ${candidate}` : "");
    if (configuredEntry) return configuredEntry;
  }
  return null;
}

function getExportBaseName(row, index) {
  const prefix = $("filePrefix").value || "";
  const base = sanitizeFileBaseName(getConfiguredExportName(row, index), `image_${index + 1}`);
  return sanitizeFileBaseName(`${prefix}${base}`.replace(/\.(?:jpe?g|psd)$/i, ""), `image_${index + 1}`);
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
  if (isSkuGiftTemplateConfig()) {
    return normalizeExportFormats(uiFormat || rowFormat || "jpg");
  }
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
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/[×Ｘｘ]/g, "x");
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
  "产品中文",
  "产品组合"
];

const GIFT_NAME_COLUMNS = [
  "gift.name.cn",
  "giftName.cn",
  "gift.cn",
  "giftName",
  "gift.names",
  "gift.names.cn",
  "赠品名称",
  "赠品中文",
  "赠品组合"
];

function getProductNameField(row) {
  for (const key of PRODUCT_NAME_COLUMNS) {
    if (hasValue(row, key)) {
      return { key, value: row[key] };
    }
  }
  return { key: "", value: "" };
}

function getGiftNameField(row) {
  for (const key of GIFT_NAME_COLUMNS) {
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
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/[×Ｘｘ]/g, "x");

  const match = normalized.match(/^(.*?)(?:\s*(?:\*|x)\s*(\d+))$/i);
  if (!match) return [token];

  const name = match[1].trim();
  const count = Math.max(1, Math.min(Number(match[2]), 6));
  if (!name) return [token];
  return Array.from({ length: count }, () => name);
}

function shouldExpandProductRepeatBeforeDirectLookup(token) {
  const normalized = String(token || "")
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/[×Ｘｘ]/g, "x");
  if (!/(?:\*|x)\s*\d+\s*$/i.test(normalized)) return false;

  const multipliers = normalized.match(/(?:\*|x)\s*\d+/gi) || [];
  if (multipliers.length >= 2 && /(精华露|次抛|安瓶|ampoule|essence)/i.test(normalized)) {
    return false;
  }
  return true;
}

function resolveKnownProductAliasImage(name) {
  const normalized = normalizeProductNameKey(name);
  const hasSpec = (spec) => new RegExp(String(spec).replace(".", "\\."), "i").test(normalized);
  const bySpec = (rules) => {
    for (const [spec, image] of rules) {
      if (hasSpec(spec)) return image;
    }
    return "";
  };

  if (/安心霜|舒缓霜/.test(normalized)) {
    return bySpec([
      ["65g", "products/baby-soothing-cream-jar-65g.png"],
      ["50g", "products/baby-soothing-cream-jar-50g.png"],
      ["30g", "products/baby-soothing-cream-jar-30g.png"],
      ["25g", "products/baby-soothing-cream-tube-25g.png"],
      ["10g", "products/baby-soothing-cream-tube-10g.png"],
      ["5g", "products/baby-soothing-cream-tube-5g.png"],
      ["1g", "products/baby-soothing-cream-sachet-1g.png"]
    ]);
  }
  if (/冰沙霜|夏季安心霜/.test(normalized)) {
    return bySpec([
      ["65g", "products/baby-cooling-cream-jar-65g.png"],
      ["50g", "products/baby-cooling-cream-jar-50g.png"],
      ["30g", "products/baby-cooling-cream-jar-30g.png"],
      ["25g", "products/baby-cooling-cream-tube-25g.png"],
      ["10g", "products/baby-cooling-cream-tube-10g.png"],
      ["5g", "products/baby-cooling-cream-tube-5g.png"],
      ["1g", "products/baby-cooling-cream-sachet-1g.png"]
    ]);
  }
  if (/护臀膏/.test(normalized)) {
    return bySpec([
      ["50g", "products/baby-diaper-cream-tube-50g.png"],
      ["5g", "products/baby-diaper-cream-tube-5g.png"]
    ]);
  }
  if (/泡泡洗沐|泡泡沐浴露|泡泡洗发沐浴露/.test(normalized)) {
    return bySpec([
      ["500ml", "products/baby-foaming-wash-shampoo-bottle-500ml.png"],
      ["300ml", "products/baby-foaming-wash-shampoo-bottle-300ml.png"],
      ["100ml", "products/baby-foaming-wash-shampoo-unscented-bottle-100ml.png"]
    ]);
  }
  if (/身体乳|保湿乳/.test(normalized)) {
    return bySpec([
      ["500ml", "products/baby-moisturing-body-lotion-bottle-500ml.png"],
      ["400ml", "products/baby-moisturing-body-lotion-bottle-400ml.png"],
      ["200ml", "products/baby-moisturing-body-lotion-bottle-200ml.png"],
      ["100g", "products/baby-moisturing-body-lotion-tube-100g.png"],
      ["50g", "products/baby-moisturing-body-lotion-tube-50g.png"],
      ["30g", "products/baby-moisturing-body-lotion-tube-30g.png"],
      ["5g", "products/baby-moisturing-body-lotion-tube-5g.png"]
    ]);
  }
  if (/帆布袋|canvasbag|canvas/.test(normalized)) {
    return "products/canvas-bag.png";
  }
  if (/\u9a71\u868a\u55b7\u96fe/.test(normalized)) {
    return bySpec([
      ["100ml", "products/baby-repellent-spray-bottle-100ml.png"],
      ["30ml", "products/baby-repellent-spray-bottle-30ml.png"]
    ]);
  }
  if (/\u53ee\u53ee\u55b7\u96fe/.test(normalized) && hasSpec("100ml")) {
    return "products/baby-floral-water-bottle-100ml.png";
  }
  if (/精油贴|精华贴片|贴片/.test(normalized)) {
    return "products/essential-oil-stickers.png";
  }
  return "";
}

function resolveProductNameToImage(name, options = {}) {
  const raw = String(name || "").trim();
  if (!raw) return "";
  if (/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(raw)) return raw;

  if (state.productNameMap) {
    const lookupKeys = getProductNameLookupKeys(raw);
    for (const normalized of lookupKeys) {
      const compact = compactSpecHyphenKey(normalized);
      const matchKey = compactProductNameMatchKey(normalized);
      const mapped = state.productNameMap.get(normalized)
        || state.productNameMap.get(compact)
        || state.productNameMap.get(matchKey);
      if (mapped) return normalizeImagePathForTemplate(mapped, options);
    }
    if (options.allowRows !== false) {
      const rowMapped = resolveProductNameByRows(raw, options);
      if (rowMapped) return normalizeImagePathForTemplate(rowMapped, options);
    }
  }

  const knownAlias = resolveKnownProductAliasImage(raw);
  if (knownAlias) return normalizeImagePathForTemplate(knownAlias, options);
  return "";
}

function normalizeProductImageViewValue(value) {
  const text = String(value || "").trim().toLowerCase();
  if (/^(front|face|f|正面|正面图)$/.test(text)) return "front";
  if (/^(angle|angled|tilt|tilted|side|a|斜侧|倾斜|斜侧图|倾斜图)$/.test(text)) return "angle";
  return "";
}

function getProductImageViewFromOptions(options = {}) {
  return normalizeProductImageViewValue(options.view || options.productView || options.imageView);
}

function normalizeImagePathForTemplate(filename, options = {}) {
  const normalized = stripBlobPathPrefix(String(filename || "").replace(/\\/g, "/"));
  const view = getProductImageViewFromOptions(options) || getDefaultProductImageViewForTemplate();
  if (!view) return normalized;
  if (!/\.(png|jpe?g|webp|tif?f|psd|psb)$/i.test(normalized)) return normalized;
  if (isExplicitProductViewAssetPath(normalized, view)) return normalized;
  if (!looksLikeProductAssetPath(normalized)) return normalized;
  return toProductViewAssetPath(normalized, view);
}

function stripBlobPathPrefix(filename) {
  return String(filename || "")
    .replace(/^blob:(?:\/\/)?blob-\d+\//i, "")
    .replace(/^blob:\/+/i, "");
}

function toFrontAssetPath(filename) {
  return toProductViewAssetPath(filename, "front");
}

function getDefaultProductImageViewForTemplate() {
  const view = String(getCurrentTemplateConfig().defaultProductImageView || "").trim().toLowerCase();
  return /^(front|angle)$/.test(view) ? view : "";
}

function looksLikeProductAssetPath(filename) {
  const normalized = stripBlobPathPrefix(String(filename || "").replace(/\\/g, "/"));
  if (/^(?:products\/)?(?:angle|front)\//i.test(normalized)) return true;
  if (/^products\//i.test(normalized)) return true;
  const base = normalized.split("/").pop() || "";
  return /^(?:baby|612|1218|youth)-/i.test(base);
}

function isExplicitProductViewAssetPath(filename, view) {
  const normalized = stripBlobPathPrefix(String(filename || "").replace(/\\/g, "/"));
  return new RegExp(`^(?:products/)?${view}/`, "i").test(normalized);
}

function toProductViewAssetPath(filename, view) {
  const normalized = stripBlobPathPrefix(String(filename || "").replace(/\\/g, "/"));
  const match = normalized.match(/^(?:(?:products\/)?(?:angle|front)\/|products\/)?(.+?)(?:-(?:angle|front|angled|tilt|tilted|face|f))?(\.[^.]+)$/i);
  if (!match) return withProductImageView(normalized, view);
  return `${view}/${match[1]}-${view}${match[2]}`;
}

function resolveProductNameTokenToImages(token, options = {}) {
  if (!shouldExpandProductRepeatBeforeDirectLookup(token)) {
    const directImage = resolveProductNameToImage(token, { allowRows: false, view: options.view });
    if (directImage) {
      return { images: [directImage], missing: [] };
    }
  }

  const images = [];
  const missing = [];
  expandRepeatedProductNameToken(token).forEach((name) => {
    const image = resolveProductNameToImage(name, { view: options.view });
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
  const config = getCurrentTemplateConfig();
  const defaultView = getDefaultProductImageViewForTemplate() || "angle";
  if (config && (config.id === "pddSku" || config.id === "pddSkuGift")) return defaultView;

  const explicit = String(firstTextValue(row, PRODUCT_VIEW_COLUMNS) || "").toLowerCase();
  if (/^(front|face|f|正面|正面图)$/.test(explicit)) return "front";
  if (/^(angle|angled|tilt|tilted|side|a|斜侧|倾斜|斜侧图|倾斜图)$/.test(explicit)) return "angle";

  const note = firstTextValue(row, PRODUCT_VIEW_NOTE_COLUMNS);
  if (!note) return defaultView;
  if (/front|face|正面|正面图/i.test(note)) return "front";
  if (/angle|angled|tilt|tilted|side|斜侧|倾斜|斜侧图|倾斜图/i.test(note)) return "angle";
  return defaultView;
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

function resolveProductNameByRows(name, options = {}) {
  const raw = String(name || "").trim();
  const normalized = getProductNameLookupKeys(raw)[0] || "";
  if (!normalized || !state.productNameRows || !state.productNameRows.length) return "";

  const querySpec = extractProductSpec(normalized);
  const queryAge = getDefaultProductAgeForQuery(normalized);
  const queryCategory = getProductCategoryHint(normalized);
  const candidates = new Set();

  state.productNameRows.forEach((row) => {
    const fileName = String(row.file || row.filename || row["文件"] || "").trim();
    if (!fileName) return;

    const imagePath = fileName.includes("/") || fileName.includes("\\") ? fileName : `products/${fileName}`;
    const fullName = row.standard_cn || row["标准中文"] || row["中文标准"] || "";
    const age = row.age_cn || row["年龄"] || "";
    const product = row.product_cn || row["产品"] || "";
    const category = row.category_cn || row["品类"] || "";
    const spec = row.spec || row["规格"] || "";
    const productEn = row.product_en || row["product_en"] || "";
    const fullParts = String(fullName || "").split("-").map((part) => part.trim()).filter(Boolean);
    const standardProduct = fullParts.length >= 2 ? fullParts[1] : "";

    if (queryAge && age && !getAgeCnAliases(age).some((alias) => normalizeProductNameKey(alias) === normalizeProductNameKey(queryAge))) return;
    if (queryCategory && category && getProductCategoryHint(category) !== queryCategory) return;
    if (querySpec && normalizeProductNameKey(spec) !== normalizeProductNameKey(querySpec)) return;
    if (/body-lotion/i.test(imagePath) && normalized.includes("安心")) return;

    const aliases = [
      fullName,
      product,
      standardProduct,
      ...getChineseProductAliases({ age, product, standardProduct, productEn })
    ].map(normalizeProductNameKey).filter(Boolean);

    const lookupKeys = getProductNameLookupKeys(raw);
    if (aliases.some((alias) => lookupKeys.some((key) => key.includes(alias) || isLooseProductAliasMatch(key, alias)))) {
      candidates.add(imagePath);
    }
  });

  if (candidates.size === 1) return Array.from(candidates)[0];
  return choosePreferredProductImageForKey(normalized, candidates, options);
}

function isLooseProductAliasMatch(query, alias) {
  const normalizedQuery = normalizeProductNameKey(query);
  const normalizedAlias = normalizeProductNameKey(alias);
  if (!normalizedQuery || !normalizedAlias) return false;
  if (normalizedQuery.includes(normalizedAlias) || normalizedAlias.includes(normalizedQuery)) return true;

  const strippedAlias = normalizedAlias.replace(/(乳液|乳霜|乳|霜|露|水|膏)$/u, "");
  if (["婴童", "婴儿", "新生", "学龄", "青春", "儿童", "一页"].includes(strippedAlias)) {
    return false;
  }
  if (strippedAlias.length >= 2 && normalizedQuery.includes(strippedAlias)) {
    return true;
  }

  return false;
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

  const productView = getProductImageView(expanded);
  const resolvedSet = resolveProductNameTokensToImages(tokens, { view: productView });
  images.push(...resolvedSet.images);
  missing.push(...resolvedSet.missing);

  if (images.length) {
    expanded["img.productSet"] = images.join(" | ");
    expanded["product.view"] = productView;
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

function shouldIgnoreProductPlaceholder(value) {
  const normalized = normalizeImagePathForTemplate(value).toLowerCase();
  return normalized === "img/product.png" || normalized === "product/example-product.png";
}

function preferProductNameImages(row) {
  const config = getCurrentTemplateConfig();
  if (!config.preferProductNameImages || !hasValue(row, "product.name.cn")) return row;

  const expanded = { ...row };
  if (shouldIgnoreProductPlaceholder(expanded["img.product"])) {
    delete expanded["img.product"];
  }
  return expanded;
}

function resolveProductNameTokensToImages(tokens, options = {}) {
  const sourceText = tokens.join("+");
  const images = [];
  const missing = [];

  tokens.forEach((token) => {
    const resolved = resolveProductNameTokenToImages(token, options);
    images.push(...resolved.images);

    resolved.missing.forEach((name) => {
      const contextualName = buildContextualProductNameToken(name, sourceText);
      const contextualImage = contextualName && contextualName !== name
        ? resolveProductNameToImage(contextualName, { view: options.view })
        : "";
      if (contextualImage) {
        images.push(contextualImage);
        log(`  Product CN context mapped: ${name} -> ${contextualName}`);
      } else {
        missing.push(name);
      }
    });
  });

  return { images, missing };
}

function buildContextualProductNameToken(name, sourceText) {
  const raw = String(name || "").trim();
  if (!raw) return raw;
  const family = getKnownProductFamilyFromText(sourceText);
  if (!family) return raw;

  const age = getAgeCnCanonicalFromText(sourceText);
  const agePrefix = age && !getAgeCnCanonicalFromText(raw) ? age : "";
  const specMatch = raw.match(/(\d+(?:\.\d+)?(?:g|ml|kg|l).*)$/i);
  const tail = specMatch ? specMatch[1] : raw;
  const normalizedFamily = normalizeProductNameKey(family);
  const normalizedRaw = normalizeProductNameKey(raw);

  if (normalizedFamily && normalizedRaw.includes(normalizedFamily)) {
    return `${agePrefix}${raw}`;
  }
  return `${agePrefix}${family}${tail}`;
}

function getKnownProductFamilyFromText(value) {
  const normalized = normalizeProductNameKey(value);
  const families = [
    "净护洗发沐浴露",
    "净护洗发水",
    "冰雪精华",
    "舒缓精华露"
  ];
  return families.find((family) => normalized.includes(normalizeProductNameKey(family))) || "";
}

function extractProductNamesFromLabel(value) {
  return String(value || "")
    .replace(/^[^:：]*[:：]\s*/, "")
    .trim();
}

function expandGiftNameToSet(row) {
  const expanded = { ...row };
  if (hasValue(expanded, "img.giftSet") || hasValue(expanded, "img.gift")) return expanded;

  const source = getGiftNameField(expanded);
  if (!source.value) return expanded;

  const resolvedSet = resolveProductNameTokensToImages(splitProductNameList(source.value), { view: getProductImageView(expanded) });
  const images = Array.from(new Set(resolvedSet.images.filter(Boolean)));

  if (images.length === 1) {
    expanded["img.gift"] = images[0];
    expanded["gift.count"] = expanded["gift.count"] || "1";
    log(`  Gift CN mapped from ${source.key}: ${images[0]}`);
  } else if (images.length > 1) {
    expanded["img.giftSet"] = images.join(" | ");
    expanded["gift.count"] = expanded["gift.count"] || String(images.length);
    log(`  Gift CN mapped from ${source.key}: ${images.join(" | ")}`);
  }

  if (resolvedSet.missing.length) {
    log(`  Gift CN not found: ${resolvedSet.missing.join(" | ")}`);
  }

  return expanded;
}

function expandLabelToImageSet(row, prefix, labelColumns, targetNameColumn) {
  const expanded = { ...row };
  if (hasValue(expanded, `img.${prefix}Set`) || hasValue(expanded, `img.${prefix}`)) return expanded;

  const label = firstTextValue(expanded, labelColumns);
  const names = extractProductNamesFromLabel(label);
  if (!names) return expanded;

  if (targetNameColumn && !hasValue(expanded, targetNameColumn)) {
    expanded[targetNameColumn] = names;
  }

  const images = [];
  const missing = [];
  const resolvedSet = resolveProductNameTokensToImages(splitProductNameList(names));
  images.push(...resolvedSet.images);
  missing.push(...resolvedSet.missing);

  if (images.length) {
    expanded[`img.${prefix}Set`] = images.join(" | ");
    if (!expanded[`${prefix}.count`]) {
      expanded[`${prefix}.count`] = String(images.length);
    }
    log(`  ${prefix} label mapped: ${images.join(" | ")}`);
  }

  if (missing.length) {
    log(`  ${prefix} label product not found: ${missing.join(" | ")}`);
  }

  return expanded;
}

function applySkuGiftLabelSources(row) {
  let expanded = { ...row };
  if (isSkuGiftTemplateConfig() && !hasValue(expanded, "product.view")) {
    expanded["product.view"] = "front";
  }

  if (!hasValue(expanded, "product.name.cn")) {
    const mainNames = extractProductNamesFromLabel(expanded["txt.mainProductLabel"]);
    if (mainNames) {
      expanded["product.name.cn"] = mainNames;
    }
  }

  expanded = expandGiftNameToSet(expanded);
  expanded = expandLabelToImageSet(expanded, "gift", [
    "txt.giftProductLabel",
    "txt.giftLabel",
    "txt.giftDesc"
  ], "gift.name.cn");

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

function extractCountLabelText(row, prefix) {
  if (!row) return "";
  if (prefix === "product") {
    return extractProductNamesFromLabel(row["txt.mainProductLabel"]) || row["product.name.cn"] || "";
  }
  if (prefix === "gift" || prefix === "giftRight") {
    return extractProductNamesFromLabel(row["txt.giftProductLabel"]) || row["gift.name.cn"] || "";
  }
  return [
    row[`txt.${prefix}Title`],
    row[`txt.${prefix}Desc`],
    row[`txt.${prefix}`]
  ].filter(Boolean).join(" ");
}

function countItemsFromLabel(value) {
  const tokens = splitProductNameList(value);
  if (!tokens.length) return 0;
  const count = tokens
    .flatMap((token) => expandRepeatedProductNameToken(token))
    .filter(Boolean)
    .length;
  return Math.max(1, Math.min(count, 6));
}

function getGiftCount(row, prefix) {
  const explicitCount = parseCount(getImageGroupValue(row, prefix, "count", ""));
  const aliasPrefix = getImageGroupAliasPrefix(prefix);
  const setSpec = parseImageSpec(
    row[`img.${prefix}Set`] ||
    (aliasPrefix && row[`img.${aliasPrefix}Set`]) ||
    ""
  );
  const setCount = Math.max(setSpec.count || 0, setSpec.images ? setSpec.images.length : 0);
  const labelCount = countItemsFromLabel(extractCountLabelText(row, prefix));

  if (isSkuGiftTemplateConfig()) {
    return Math.max(labelCount, setCount, 0);
  }

  if (explicitCount || setCount) {
    return Math.max(explicitCount, setCount);
  }

  const text = [
    row[`txt.${prefix}Title`],
    row[`txt.${prefix}Desc`],
    row[`txt.${prefix}`]
  ].filter(Boolean).join(" ");

  const normalized = text
    .replace(/×/g, "x")
    .replace(/＊/g, "*")
    .replace(/[×Ｘｘ]/g, "x")
    .replace(/[×Ｘｘ]/g, "x");
  const match = normalized.match(/(?:\*|x|X)\s*(\d+)/);
  return match ? Math.max(1, Math.min(Number(match[1]), 6)) : 0;
}

function expandGiftImageSet(row, prefix) {
  const expanded = { ...row };
  const setColumn = `img.${prefix}Set`;
  const baseColumn = `img.${prefix}`;
  const aliasPrefix = getImageGroupAliasPrefix(prefix);
  const aliasSetColumn = aliasPrefix ? `img.${aliasPrefix}Set` : "";
  const aliasBaseColumn = aliasPrefix ? `img.${aliasPrefix}` : "";
  const setSpec = parseImageSpec(row[setColumn] || (aliasSetColumn && row[aliasSetColumn]));
  const baseSpec = parseImageSpec(row[baseColumn] || (aliasBaseColumn && row[aliasBaseColumn]));
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

  ["count", "layout", "scale", "heightRatio", "gap", "spacing", "x", "y", "w", "h"].forEach((key) => {
    const value = getImageGroupValue(row, prefix, key, "");
    if (value !== "" && !expanded[`${prefix}.${key}`]) {
      expanded[`${prefix}.${key}`] = value;
    }
  });

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

function applyAddOnCouponToImageSet(row) {
  const config = getAddOnCouponConfig();
  const couponSource = getAddOnCouponProductToken(row);
  if (!config || !couponSource) return row;

  const prefix = getAddOnCouponTargetPrefix(config);
  const expanded = { ...row };
  const setColumn = `img.${prefix}Set`;
  const baseColumn = `img.${prefix}`;
  const setSpec = parseImageSpec(expanded[setColumn] || "");
  let images = setSpec.images.slice();
  if (!images.length && expanded[baseColumn]) {
    images = splitImageList(expanded[baseColumn]);
  }
  if (!images.length) {
    for (let i = 1; i <= 6; i += 1) {
      if (expanded[`img.${prefix}.${i}`]) images.push(expanded[`img.${prefix}.${i}`]);
    }
  }

  const normalize = (value) => String(value || "").replace(/\\/g, "/").trim().toLowerCase();
  images = images.filter((image) => !isAddOnCouponToken(image) && normalize(image) !== normalize(couponSource));
  const placement = getAddOnCouponPlacement(config);
  const couponIndex = placement === "append" ? images.length + 1 : 1;
  if (placement === "append") {
    images.push(couponSource);
  } else {
    images.unshift(couponSource);
  }

  if (placement !== "append") {
    for (let i = 6; i >= 1; i -= 1) {
      const key = `${prefix}.category.${i}`;
      if (hasValue(expanded, key)) {
        expanded[`${prefix}.category.${i + 1}`] = expanded[key];
      }
    }
  }

  expanded[setColumn] = images.join(" | ");
  expanded[`${prefix}.count`] = String(images.length);
  expanded[getAddOnCouponIndexColumn(prefix)] = String(couponIndex);
  expanded[`${prefix}.category.${couponIndex}`] = "coupon";
  if (setSpec.layout && !hasValue(expanded, `${prefix}.layout`)) {
    expanded[`${prefix}.layout`] = setSpec.layout;
  } else if (!hasValue(expanded, `${prefix}.layout`)) {
    expanded[`${prefix}.layout`] = "line";
  }

  log(`  AddOn coupon ${placement === "append" ? "appended" : "prepended"} to ${prefix} layout: index=${couponIndex}, source=${couponSource}`);
  return expanded;
}

function applyAddOnCouponToProductSet(row) {
  return applyAddOnCouponToImageSet(row);
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

function normalizeGiftAliases(row) {
  const expanded = { ...row };
  const aliases = [
    ["img.giftRight", "img.gift"],
    ["img.giftRightSet", "img.giftSet"],
    ["txt.giftRightTitle", "txt.giftTitle"]
  ];

  aliases.forEach(([from, to]) => {
    if (!hasValue(expanded, to) && hasValue(expanded, from)) {
      expanded[to] = expanded[from];
    }
  });

  Object.keys(row).forEach((key) => {
    const match = key.match(/^giftRight\.(.+)$/);
    if (!match) return;
    const target = `gift.${match[1]}`;
    if (!hasValue(expanded, target) && hasValue(expanded, key)) {
      expanded[target] = expanded[key];
    }
  });

  Object.keys(row).forEach((key) => {
    const match = key.match(/^img\.giftRight\.(\d+)$/);
    if (!match) return;
    const target = `img.gift.${match[1]}`;
    if (!hasValue(expanded, target) && hasValue(expanded, key)) {
      expanded[target] = expanded[key];
    }
  });

  return expanded;
}

function getGiftDescImageSourceConfig() {
  const base = BASE_TEMPLATE_CONFIG.giftDescImageSource || {};
  const config = getCurrentTemplateConfig().giftDescImageSource;
  if (config === false || config && config.enabled === false) return null;
  return { ...base, ...(config || {}) };
}

function cleanGiftDescImageSourceText(value) {
  return String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\uFF08[^\uFF09]*\uFF09/g, " ")
    .replace(/\u3010[^\u3011]*\u3011/g, " ")
    .trim();
}

function hasImageGroupSourceForPrefix(row, prefix) {
  return hasValue(row, "img." + prefix) ||
    hasValue(row, "img." + prefix + "Set") ||
    hasValue(row, "img." + prefix + ".1");
}

function applyGiftDescImageSource(row) {
  const config = getGiftDescImageSourceConfig();
  if (!config) return row;

  const sourceColumns = config.sourceColumns || ["txt.giftLeftDesc", "txt.giftDesc", "txt.gift"];
  const sourceColumn = sourceColumns.find((column) => hasValue(row, column));
  if (!sourceColumn) return row;

  const targetPrefixes = config.targetPrefixes || ["gift", "giftLeft"];
  if (!targetPrefixes.length || targetPrefixes.some((prefix) => hasImageGroupSourceForPrefix(row, prefix))) {
    return row;
  }

  const sourceText = cleanGiftDescImageSourceText(row[sourceColumn]);
  const tokens = splitProductNameList(sourceText);
  if (!tokens.length) return row;

  const resolved = resolveProductNameTokensToImages(tokens);
  let images = resolved.images.filter(Boolean);
  if (config.forceProductView !== false) {
    const view = getProductImageView(row);
    images = images.map((image) => withProductImageView(image, view));
  }
  images = Array.from(new Set(images));

  if (!images.length) {
    if (resolved.missing.length) log("  Gift desc CN not found: " + resolved.missing.join(" | "));
    return row;
  }

  const expanded = { ...row };
  targetPrefixes.forEach((prefix) => {
    if (hasImageGroupSourceForPrefix(expanded, prefix)) return;
    if (images.length > 1) {
      expanded["img." + prefix + "Set"] = images.join(" | ");
      if (!hasValue(expanded, prefix + ".layout") && config.layout) expanded[prefix + ".layout"] = config.layout;
    } else {
      expanded["img." + prefix] = images[0];
    }
    if (!hasValue(expanded, prefix + ".count")) expanded[prefix + ".count"] = String(images.length);
  });

  log("  Gift desc mapped from " + sourceColumn + ": " + images.join(" | "));
  if (resolved.missing.length) log("  Gift desc CN not found: " + resolved.missing.join(" | "));
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
function expandRow(row) {
  let expanded = normalizeImageAliases(row);
  expanded = normalizeGiftAliases(expanded);
  expanded = expandDailyGiftMiddleImage(expanded);
  expanded = applySkuGiftLabelSources(expanded);
  expanded = applyBottomTextFromProductName(expanded);
  expanded = preferProductNameImages(expanded);
  expanded = expandProductNamesToSet(expanded);
  expanded = applyGiftDescImageSource(expanded);
  expanded = applyProductImageView(expanded);
  expanded = applyAddOnCouponToProductSet(expanded);
  expanded = expandGiftImageSet(expanded, "giftLeft");
  expanded = expandGiftImageSet(expanded, "giftRight");
  expanded = expandGiftImageSet(expanded, "gift");
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

function getTextAnchorXByJustification(box, justification) {
  if (!box) return NaN;
  const raw = String(justification === undefined || justification === null ? "" : justification).toLowerCase();
  if (/center|centre|middle|居中/.test(raw)) return box.centerX;
  if (/right|右/.test(raw)) return box.right;
  return box.left;
}

async function restoreTextLayerOriginalAnchor(layer, originalBox, label = "text", justification = null) {
  if (!layer || !originalBox) return;
  const afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!afterBox) return;
  const dx = getTextAnchorXByJustification(originalBox, justification) - getTextAnchorXByJustification(afterBox, justification);
  const dy = originalBox.top - afterBox.top;
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)) return;
  await layer.translate(dx, dy);
  log(`  Text anchor restored: ${label}, dx=${Math.round(dx)}, dy=${Math.round(dy)}.`);
}

async function restoreTextLayerAnchor(doc, layer, originalBox, label = "text", justification = null) {
  if (!layer || !originalBox) return;
  const afterBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!afterBox) return;

  const areaLayer = getTextAreaLayerNames(layer.name)
    .map((name) => findLayerByName(doc, name))
    .find(Boolean);
  if (areaLayer) {
    const areaBox = getBoundsBox(areaLayer.boundsNoEffects || areaLayer.bounds);
    if (areaBox) {
      const dx = areaBox.centerX - afterBox.centerX;
      const dy = areaBox.top - afterBox.top;
      if (Number.isFinite(dx) && Number.isFinite(dy) && (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5)) {
        await layer.translate(dx, dy);
      }
      areaLayer.visible = false;
      log(`  Text anchored to template area: ${label} -> ${areaLayer.name}.`);
      return;
    }
  }

  await restoreTextLayerOriginalAnchor(layer, originalBox, label, justification);
}

function getTextAreaLayerNames(textLayerName) {
  const rawName = String(textLayerName || "");
  const baseName = rawName.replace(/\.\d+$/, "");
  const suffix = rawName.replace(/^txt\./, "");
  const baseSuffix = baseName.replace(/^txt\./, "");
  const names = [
    `TEXT.${suffix}.area`,
    `${suffix}.area`,
    `${rawName}.area`,
    `ttxt.${suffix}.area`,
    `ttxt.${rawName}.area`,
    `TEXT.${baseSuffix}.area`,
    `${baseSuffix}.area`,
    `${baseName}.area`,
    `ttxt.${baseSuffix}.area`,
    `ttxt.${baseName}.area`
  ];
  if (isPromoTitleName(textLayerName)) {
    names.push(
      "TEXT.promoTitle.area",
      "txt.promoTitle.area",
      "TEXT.bottomText.area",
      "txt.bottomText.area"
    );
  }
  return Array.from(new Set(names));
}

function getProductCategoryHint(value) {
  const normalized = normalizeProductNameKey(value);
  if (/瓶装|bottle/.test(normalized)) return "bottle";
  if (/管装|软管|tube/.test(normalized)) return "tube";
  if (/罐装|jar/.test(normalized)) return "jar";
  if (/袋包|袋装|补充|替换|refill|sachet|bag/.test(normalized)) return "refill";
  return "";
}

function isPromoTitleName(name) {
  return /^txt\.(promoTitle|promoText|bottomText)(?:\.\d+)?$/.test(String(name || ""));
}

function findTextLayerForColumn(doc, column, row = null) {
  if (isPromoTitleName(column)) {
    const names = getPromoTitleLayerNames(null, column);
    return findLayerByAnyNameInCurrentMechanismOnly(doc, row, names) || findLayerByAnyName(doc, names);
  }
  if (getCurrentTemplateConfig().id === "baibuMiaoshaMain" && column === "txt.mainProductLabel") {
    return findLayerByNameInLayer(state.currentArtboardLayer, column) || findLayerByName(doc, column);
  }
  return findLayerByNameInCurrentMechanismOnly(doc, row, column) || findLayerByName(doc, column);
}

function getPromoTitleLayerNames(variant = null, column = "") {
  const suffix = variant ? `.${variant}` : "";
  const wantsPromo = /^txt\.promo(?:Title|Text)/.test(String(column || ""));
  const primary = wantsPromo ? "txt.promoTitle" : "txt.bottomText";
  const secondary = wantsPromo ? "txt.bottomText" : "txt.promoTitle";
  if (variant) return [`${primary}${suffix}`, `${secondary}${suffix}`];
  return [
    `${primary}.1`,
    `${secondary}.1`,
    primary,
    secondary,
    `${primary}.2`,
    `${secondary}.2`,
    `${primary}.3`,
    `${secondary}.3`,
    `${primary}.4`,
    `${secondary}.4`
  ];
}

function getPromoTitleAreaBox(doc) {
  const areaLayer = findPromoTitleAreaLayer(doc);
  return getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));
}

function findPromoTitleAreaLayer(doc) {
  const names = [
    "TEXT.promoTitle.area",
    "txt.promoTitle.area",
    "TEXT.bottomText.area",
    "txt.bottomText.area"
  ];
  return names.map((name) => findLayerByName(doc, name)).find(Boolean);
}

function hideAlternatePromoTitleLayers(doc, activeLayer) {
  const activeId = activeLayer && activeLayer.id;
  const names = [
    ...getPromoTitleLayerNames(null, "txt.promoTitle"),
    ...getPromoTitleLayerNames(null, "txt.bottomText")
  ];
  Array.from(new Set(names)).forEach((name) => {
    findLayersByName(doc, name).forEach((layer) => {
      const isActive = layer && ((activeId && layer.id === activeId) || layer === activeLayer);
      if (layer && !isActive) layer.visible = false;
    });
  });
  if (activeLayer) activeLayer.visible = true;
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
  const value = readNumber(row || {}, "bottomText.shortMaxUnits", readNumber(row || {}, "txt.bottomText.shortMaxUnits", NaN));
  return Number.isFinite(value) ? value : Number(config.bottomTextShortMaxUnits || 0);
}

function getBottomTextShortFitRatio(row) {
  const config = getCurrentTemplateConfig();
  const value = readNumber(row || {}, "bottomText.shortFitRatio", readNumber(row || {}, "txt.bottomText.shortFitRatio", NaN));
  const ratio = Number.isFinite(value) ? value : Number(config.bottomTextShortFitRatio || 1);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
}

async function applyBottomTextLayerTemplateContents(doc, layer, value, options = {}) {
  const isBottomTextLayer = /^txt\.bottomText(?:\.\d+)?$/.test(String(layer && layer.name || ""));
  if (isBottomTextLayer || options.forceLineSeedSymbols) {
    await applyBottomTextTemplateStyle(layer, value, options);
    return;
  }

  const parsed = parseTitleSuperscriptMarkup(value);
  await replaceTextLayerPreserveTemplateParagraph(layer, parsed.text, doc, {
    superscripts: parsed.superscripts,
    justificationSourceLayer: options.justificationSourceLayer || null
  });
  if (parsed.superscripts.length) {
    log(`  Promo title superscripts applied: ${parsed.superscripts.length}.`);
  }
}


async function applyBottomTextVariantRules(doc, value, row = {}, column = "txt.bottomText") {
  const config = getCurrentTemplateConfig();
  const areaLayer = findLayerByName(doc, config.bottomTextAreaName || "bottomText.area") || findPromoTitleAreaLayer(doc);
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));
  const wantsPromo = /^txt\.promo(?:Title|Text)/.test(String(column || ""));
  const primaryName = wantsPromo ? "txt.promoTitle" : "txt.bottomText";
  const secondaryName = wantsPromo ? "txt.bottomText" : "txt.promoTitle";
  const collectLayers = (names) => names.flatMap((name) => findLayersByName(doc, name)).filter((layer) => layer && layer.textItem);
  const baseLayers = collectLayers([primaryName, secondaryName]);
  const shortLayers = collectLayers([`${primaryName}.1`, `${secondaryName}.1`]);
  const longLayers = collectLayers([`${primaryName}.2`, `${secondaryName}.2`]);
  const tinyLayers = wantsPromo ? [] : collectLayers(["txt.bottomText.3"]);
  const microLayers = wantsPromo ? [] : collectLayers(["txt.bottomText.4"]);
  const shortLayer = shortLayers.find((layer) => layer.visible !== false) || shortLayers[0] || null;
  const longLayer = longLayers.find((layer) => layer.visible !== false) || longLayers[0] || null;
  const tinyLayer = tinyLayers.find((layer) => layer.visible !== false) || tinyLayers[0] || null;
  const microLayer = microLayers.find((layer) => layer.visible !== false) || microLayers[0] || null;

  if (!shortLayer && !longLayer && !tinyLayer && !microLayer) {
    const fallbackLayer = baseLayers.find((layer) => layer.visible !== false) || baseLayers[0] || null;
    if (!fallbackLayer) return false;
    await applyBottomTextLayerTemplateContents(doc, fallbackLayer, value, { justificationSourceLayer: wantsPromo ? shortLayer || fallbackLayer : null });
    await fitPromoTitleLayerToArea(doc, fallbackLayer);
    await alignPromoTitleLayerToArea(doc, fallbackLayer);
    return true;
  }

  [...baseLayers, ...shortLayers, ...longLayers, ...tinyLayers, ...microLayers].forEach((layer) => {
    layer.visible = false;
  });

  const parsedForLineCount = parseTitleSuperscriptMarkup(value);
  const promoTitleLineCount = String(parsedForLineCount.text || "").split(/\r\n|\r|\n/).length;
  const forceCompactLayer = wantsPromo && promoTitleLineCount >= 3 && longLayer;
  const fitRatio = wantsPromo
    ? readNumber(row || {}, "promoTitle.shortFitRatio", readNumber(row || {}, "txt.promoTitle.shortFitRatio", 1))
    : getBottomTextShortFitRatio(row);
  const safeWidth = areaBox && Number.isFinite(areaBox.width) ? areaBox.width * fitRatio : null;

  let selectedLayer = forceCompactLayer ? longLayer : shortLayer || longLayer || tinyLayer || microLayer;
  if (forceCompactLayer) {
    log(`  Promo title line count=${promoTitleLineCount}; using ${longLayer.name}.`);
  } else if (shortLayer) {
    shortLayer.visible = true;
    await applyBottomTextLayerTemplateContents(doc, shortLayer, value, { justificationSourceLayer: wantsPromo ? shortLayer : null });
    const shortBox = await getLayerBox(shortLayer);
    const shortMaxUnits = wantsPromo ? 0 : getBottomTextShortMaxUnits(row);
    const visualUnits = getBottomTextVisualUnits(value);
    const fitsWidth = !safeWidth || !shortBox || shortBox.width <= safeWidth;
    const fitsUnits = wantsPromo || !Number.isFinite(shortMaxUnits) || shortMaxUnits <= 0 || visualUnits <= shortMaxUnits;
    if (fitsWidth && fitsUnits || !longLayer && !tinyLayer && !microLayer) {
      selectedLayer = shortLayer;
      log(`  Promo/bottom variant selected: ${shortLayer.name}${areaBox && shortBox ? `, width=${Math.round(shortBox.width)}/${Math.round(safeWidth || areaBox.width)}` : ""}${wantsPromo ? "" : `, units=${visualUnits.toFixed(1)}/${shortMaxUnits || "auto"}`}.`);
    } else {
      shortLayer.visible = false;
      selectedLayer = longLayer || tinyLayer || microLayer;
      log(`  Promo/bottom variant overflow: ${shortLayer.name}${areaBox && shortBox ? ` width=${Math.round(shortBox.width)}/${Math.round(safeWidth || areaBox.width)}` : ""}${wantsPromo ? "" : `, units=${visualUnits.toFixed(1)}/${shortMaxUnits || "auto"}`}, using ${selectedLayer ? selectedLayer.name : "none"}.`);
    }
  }

  if (selectedLayer && selectedLayer !== shortLayer) {
    selectedLayer.visible = true;
    await applyBottomTextLayerTemplateContents(doc, selectedLayer, value, { justificationSourceLayer: wantsPromo ? shortLayer || selectedLayer : null });
    log(`  Bottom text variant selected: ${selectedLayer.name}.`);
  }

  if (!wantsPromo && selectedLayer === longLayer && tinyLayer && safeWidth) {
    const longBox = await getLayerBox(longLayer);
    if (longBox && longBox.width > safeWidth) {
      longLayer.visible = false;
      tinyLayer.visible = true;
      await applyBottomTextLayerTemplateContents(doc, tinyLayer, value);
      const tinyBox = await getLayerBox(tinyLayer);
      selectedLayer = tinyLayer;
      log(`  Bottom text .2 overflow: width=${Math.round(longBox.width)}/${Math.round(safeWidth)}, using ${tinyLayer.name}${tinyBox ? `, w3=${Math.round(tinyBox.width)}` : ""}.`);

      if (microLayer && tinyBox && tinyBox.width > safeWidth) {
        tinyLayer.visible = false;
        microLayer.visible = true;
        await applyBottomTextLayerTemplateContents(doc, microLayer, value);
        const microBox = await getLayerBox(microLayer);
        selectedLayer = microLayer;
        log(`  Bottom text .3 overflow: width=${Math.round(tinyBox.width)}/${Math.round(safeWidth)}, using ${microLayer.name}${microBox ? `, w4=${Math.round(microBox.width)}` : ""}.`);
      }
    }
  }

  [...baseLayers, ...shortLayers, ...longLayers, ...tinyLayers, ...microLayers].forEach((layer) => {
    if (layer !== selectedLayer) layer.visible = false;
  });
  if (selectedLayer) {
    await fitPromoTitleLayerToArea(doc, selectedLayer);
    await alignPromoTitleLayerToArea(doc, selectedLayer);
  }
  return !!selectedLayer;
}

async function selectPromoTitleLayerForValue(doc, value, fallbackLayer = null) {
  const primaryLayer =
    findLayerByAnyName(doc, getPromoTitleLayerNames(1)) ||
    findLayerByAnyName(doc, ["txt.promoTitle", "txt.bottomText"]) ||
    fallbackLayer;
  const compactLayer = findLayerByAnyName(doc, getPromoTitleLayerNames(2));
  const areaBox = getPromoTitleAreaBox(doc);

  if (!primaryLayer) return compactLayer || fallbackLayer;
  if (!areaBox || !compactLayer) {
    hideAlternatePromoTitleLayers(doc, primaryLayer);
    if (!areaBox) log("  Promo title area not found; using primary title layer.");
    if (!compactLayer) log("  Promo title compact layer not found; using primary title layer.");
    return primaryLayer;
  }

  try {
    const templateBox = getBoundsBox(primaryLayer.boundsNoEffects || primaryLayer.bounds);
    const fontSize = await getTextLayerFontSize(primaryLayer, templateBox ? templateBox.height : 48);
    const estimatedWidth = estimateMultilineTextWidth(value, fontSize);
    const widthScale = readNumber(state.currentRow || {}, "promoTitle.widthScale", readNumber(state.currentRow || {}, "txt.promoTitleWidthScale", 1.22));
    const compactAt = readNumber(state.currentRow || {}, "promoTitle.compactAt", readNumber(state.currentRow || {}, "txt.promoTitleCompactAt", 9.5));
    const measuredWidth = estimatedWidth * widthScale;
    const displayLength = getDisplayLength(value);
    const exceeds = measuredWidth > areaBox.width || displayLength > compactAt;
    const selected = exceeds ? compactLayer : primaryLayer;
    selected.visible = true;
    try {
      selected.opacity = 100;
    } catch (error) {
      log(`  Promo title opacity skipped: ${formatError(error)}`);
    }
    hideAlternatePromoTitleLayers(doc, selected);
    log(`  Promo title layer selected: ${selected.name}, chars=${displayLength}, compactAt=${compactAt}, rawW=${Math.round(estimatedWidth)}, scaledW=${Math.round(measuredWidth)}, areaW=${Math.round(areaBox.width)}, overflow=${exceeds}.`);
    return selected;
  } catch (error) {
    log(`  Promo title variant check skipped: ${formatError(error)}`);
    hideAlternatePromoTitleLayers(doc, primaryLayer);
    return primaryLayer;
  }
}

async function fitPromoTitleLayerToArea(doc, layer) {
  if (!doc || !layer || !layer.textItem) return;
  const areaLayer = findPromoTitleAreaLayer(doc);
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));
  const textBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!areaBox || !textBox || textBox.width <= 0) return;

  const maxWidth = areaBox.width * 0.98;
  if (textBox.width <= maxWidth) return;

  const factor = maxWidth / textBox.width;
  try {
    await scaleLayerByFactor(layer, factor);
    log(`  Promo title fitted to area: ${layer.name}, scale=${factor.toFixed(3)}, textW=${Math.round(textBox.width)}, maxW=${Math.round(maxWidth)}.`);
  } catch (error) {
    log(`  Promo title fit skipped: ${formatError(error)}`);
  }
}

async function alignPromoTitleLayerToArea(doc, layer) {
  if (!doc || !layer || !layer.textItem) return;
  const areaLayer = findPromoTitleAreaLayer(doc);
  const areaBox = getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));
  const textBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!areaBox || !textBox) return;

  try {
    await layer.translate(areaBox.centerX - textBox.centerX, areaBox.top - textBox.top);
    if (areaLayer) areaLayer.visible = false;
    log(`  Promo title aligned to area: ${layer.name} -> ${areaLayer ? areaLayer.name : "promoTitle.area"}.`);
  } catch (error) {
    log(`  Promo title align skipped: ${formatError(error)}`);
  }
}

async function applyGeneratedBottomTextIfNeeded(doc, row) {
  const config = getCurrentTemplateConfig().bottomTextFromProductName;
  if (!config || !config.enabled || !row) return;

  const targetColumn = config.targetColumn || "txt.bottomText";
  const value = row[targetColumn];
  if (!value) {
    hideAlternatePromoTitleLayers(doc, null);
    return;
  }

  if (isPromoTitleName(targetColumn)) {
    if (await applyBottomTextVariantRules(doc, value, row, targetColumn)) {
      log(`  Generated bottom text applied: ${value}`);
      return;
    }
  }

  const targetLayer = findTextLayerForColumn(doc, targetColumn);
  if (!targetLayer) return;
  await replaceTextLayerPreserveTemplateParagraphWithSuperscripts(targetLayer, value, doc);
  log(`  Generated bottom text applied: ${value}`);
}

function shouldReplaceTextOnlyWithoutMove(layerName) {
  return String(layerName || "").trim() === "txt.mainProductLabel";
}

function ensureLayerVisibleForDataReplacement(layer, column) {
  if (!layer) return;
  try {
    layer.visible = true;
  } catch (error) {
    log(`  Text visibility restore skipped for ${column || layer.name}: ${formatError(error)}`);
  }
}

function ensureBaibuMainProductLabelVisible(doc, row, label = "Export") {
  const config = getCurrentTemplateConfig();
  if (!config || config.id !== "baibuMiaoshaMain" || !hasValue(row || state.currentRow || {}, "txt.mainProductLabel")) return;
  const layer = findLayerByNameInLayer(state.currentArtboardLayer, "txt.mainProductLabel") || findLayerByName(doc, "txt.mainProductLabel");
  if (!layer) {
    log(`  ${label}: txt.mainProductLabel not found before export.`);
    return;
  }
  ensureLayerVisibleForDataReplacement(layer, "txt.mainProductLabel");
  log(`  ${label}: txt.mainProductLabel visible before export.`);
}
function shouldKeepTemplateTextBox(layerName) {
  if (isPromoTitleName(layerName)) return true;
  const config = getCurrentTemplateConfig();
  if (config.preserveTemplateTextOnly && /^txt\./.test(String(layerName || ""))) return true;
  if (!isSkuGiftTemplateConfig(config)) return false;
  return isPromoTitleName(layerName) || [
    "txt.mainProductLabel",
    "txt.giftProductLabel"
  ].includes(layerName);
}

function shouldUseLineSeedForSymbols(layerName) {
  return isSkuGiftTemplateConfig() && [
    "txt.mainProductLabel",
    "txt.giftProductLabel"
  ].includes(layerName);
}

function getPddSkuGiftLabelWrapConfig(layerName) {
  const name = String(layerName || "").trim().replace(/\.\d+$/, "");
  const config = getCurrentTemplateConfig();
  const supportsLabelWrap = isSkuGiftTemplateConfig(config) || config && config.id === "baibuMiaoshaMain";
  if (!supportsLabelWrap) return null;
  if (name === "txt.mainProductLabel") {
    return { displayLength: 22, fallbackWidth: 360, fontSize: 13 };
  }
  if (name === "txt.giftProductLabel") {
    return { displayLength: 22, fallbackWidth: 260, fontSize: 13 };
  }
  return null;
}

function splitLabelByPlusBalanced(value) {
  const raw = String(value || "").replace(/\n+/g, "").trim();
  if (!raw || !raw.includes("+")) return raw;

  const parts = raw.split("+").map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return raw;

  const total = getDisplayLength(raw);
  let best = null;
  for (let index = 1; index < parts.length; index += 1) {
    const first = parts.slice(0, index).join("+");
    const second = parts.slice(index).join("+");
    const score = Math.abs(getDisplayLength(first) - getDisplayLength(second));
    const maxLine = Math.max(getDisplayLength(first), getDisplayLength(second));
    if (!best || score < best.score || (score === best.score && maxLine < best.maxLine)) {
      best = { text: `${first}\n${second}`, score, maxLine };
    }
  }
  return best && best.maxLine < total ? best.text.replace("\n", "+\n") : raw;
}

function getTextStyleFontSize(textKey, fallback) {
  const style = textKey && textKey.textStyleRange && textKey.textStyleRange[0] && textKey.textStyleRange[0].textStyle;
  const size = style && (style.size && style.size._value || style.impliedFontSize && style.impliedFontSize._value);
  const numeric = Number(size);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

async function getTextLayerFontSize(layer, fallback) {
  if (!layer || !layer.textItem) return fallback;
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
    return getTextStyleFontSize(result && result[0] && result[0].textKey, fallback);
  } catch (error) {
    return fallback;
  }
}

function getTextAreaBoxForLayer(doc, layerName) {
  if (!doc || !layerName) return null;
  const areaLayer = getTextAreaLayerNames(layerName)
    .map((name) => findLayerByName(doc, name))
    .find(Boolean);
  return getBoundsBox(areaLayer && (areaLayer.boundsNoEffects || areaLayer.bounds));
}

function isBaibuMainProductLabelLayer(layerName) {
  const config = getCurrentTemplateConfig();
  const name = String(layerName || "").trim().replace(/\.\d+$/, "");
  return !!(config && config.id === "baibuMiaoshaMain" && name === "txt.mainProductLabel");
}

function getCurrentArtboardBoundsBox() {
  const layer = state.currentArtboardLayer;
  return getBoundsBox(layer && (layer.boundsNoEffects || layer.bounds));
}

function getMainProductLabelMaxWidth(row, areaBox) {
  const artboardBox = getCurrentArtboardBoundsBox();
  const baseWidth = areaBox && Number.isFinite(areaBox.width) && areaBox.width > 0
    ? areaBox.width
    : artboardBox && Number.isFinite(artboardBox.width) && artboardBox.width > 0
      ? artboardBox.width * 0.92
      : 740;
  return readNumber(
    row || {},
    "txt.mainProductLabel.maxWidth",
    readNumber(row || {}, "mainProductLabel.maxWidth", baseWidth * 0.98)
  );
}

function wrapPddSkuGiftLabelIfNeeded(doc, layer, value, textKey) {
  const config = getPddSkuGiftLabelWrapConfig(layer && layer.name);
  const raw = String(value || "");
  if (!config || raw.includes("\n") || !raw.includes("+")) return raw;

  const fontSize = getTextStyleFontSize(textKey, config.fontSize);
  const areaBox = getTextAreaBoxForLayer(doc, layer.name);
  const maxWidth = areaBox ? areaBox.width : config.fallbackWidth;
  const estimatedWidth = estimateMultilineTextWidth(raw, fontSize);
  const displayLength = getDisplayLength(raw);
  const hasAreaBox = !!areaBox;
  const forceBaibuMainWrap = isBaibuMainProductLabelLayer(layer && layer.name) && displayLength > config.displayLength;
  if (!forceBaibuMainWrap && hasAreaBox && estimatedWidth <= maxWidth) return raw;
  if (!forceBaibuMainWrap && !hasAreaBox && displayLength <= config.displayLength) return raw;

  const wrapped = splitLabelByPlusBalanced(raw);
  if (wrapped !== raw) {
    log(`  Text wrapped by plus: ${layer.name}, displayLength=${displayLength}, textW=${Math.round(estimatedWidth)}, maxW=${Math.round(maxWidth)}.`);
  }
  return wrapped;
}

async function wrapMainProductLabelToAreaIfOverflow(doc, layer, value, label = "txt.mainProductLabel") {
  if (!isBaibuMainProductLabelLayer(layer && layer.name)) return false;
  const raw = String(value || "");
  if (!raw || raw.includes("\n") || !raw.includes("+")) return false;

  const areaBox = getTextAreaBoxForLayer(doc, layer.name);
  const textBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!textBox || !Number.isFinite(textBox.width) || textBox.width <= 0) return false;

  const maxWidth = getMainProductLabelMaxWidth(state.currentRow || {}, areaBox);
  if (!Number.isFinite(maxWidth) || maxWidth <= 0 || textBox.width <= maxWidth) return false;

  const wrapped = splitLabelByPlusBalanced(raw);
  if (wrapped === raw) return false;

  await replaceTextLayerPreserveTemplateParagraphWithSuperscripts(layer, wrapped, doc);

  const wrappedBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (wrappedBox && Number.isFinite(wrappedBox.width) && wrappedBox.width > maxWidth) {
    const scale = Math.max(0.55, Math.min(1, maxWidth / wrappedBox.width));
    await scaleTextLayerFontSize(layer, scale);
    log(`  Main product label scaled after width wrap: ${label}, scale=${scale.toFixed(3)}, textW=${Math.round(wrappedBox.width)}, maxW=${Math.round(maxWidth)}.`);
  }

  log(`  Main product label wrapped by actual width: ${label}, textW=${Math.round(textBox.width)}, maxW=${Math.round(maxWidth)}.`);
  return true;
}

async function centerTextLayerParagraph(layer) {
  if (!layer || !layer.textItem) return;
  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];

  try {
    const justification = photoshop.constants && photoshop.constants.Justification;
    const candidates = [
      justification && (justification.CENTER || justification.CENTERED || justification.center),
      "center",
      "CENTER"
    ].filter(Boolean);
    for (const candidate of candidates) {
      try {
        layer.textItem.justification = candidate;
        break;
      } catch (error) {
        // Try the next DOM justification value.
      }
    }

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
    if (!textKey) return;

    const textLength = Array.from(String(textKey.textKey || layer.textItem.contents || "")).length;
    const paragraphStyleRange = Array.isArray(textKey.paragraphStyleRange) && textKey.paragraphStyleRange.length
      ? textKey.paragraphStyleRange.map((range) => ({
        ...range,
        paragraphStyle: {
          ...(range.paragraphStyle || {}),
          justification: { _enum: "justification", _value: "center" }
        }
      }))
      : [
        {
          _obj: "paragraphStyleRange",
          from: 0,
          to: textLength,
          paragraphStyle: {
            _obj: "paragraphStyle",
            justification: { _enum: "justification", _value: "center" }
          }
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
            paragraphStyleRange
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    log(`  Text paragraph centered: ${layer.name}.`);
  } catch (error) {
    log(`  Text paragraph center skipped for ${layer.name}: ${formatError(error)}`);
  }
}

function clonePlainObject(value) {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => clonePlainObject(item));
  return Object.keys(value).reduce((copy, key) => {
    copy[key] = clonePlainObject(value[key]);
    return copy;
  }, {});
}

function getParagraphStyleForTextIndex(sourceRanges, index) {
  if (!Array.isArray(sourceRanges) || !sourceRanges.length) return null;
  return sourceRanges.find((range) => {
    const from = Number(range && range.from) || 0;
    const to = Number(range && range.to);
    return index >= from && (!Number.isFinite(to) || index < to);
  }) || sourceRanges[0] || null;
}

function buildTemplateParagraphStyleRanges(textKey, textValue) {
  const sourceRanges = Array.isArray(textKey && textKey.paragraphStyleRange)
    ? textKey.paragraphStyleRange.filter((range) => range && range.paragraphStyle)
    : [];
  if (!sourceRanges.length) return undefined;

  const chars = Array.from(String(textValue || ""));
  const textLength = chars.length;
  if (textLength <= 0) {
    return [
      {
        _obj: "paragraphStyleRange",
        from: 0,
        to: 0,
        paragraphStyle: clonePlainObject(sourceRanges[0].paragraphStyle || { _obj: "paragraphStyle" })
      }
    ];
  }

  const ranges = [];
  let start = 0;
  chars.forEach((char, index) => {
    if (char !== "\r" && char !== "\n") return;
    const source = getParagraphStyleForTextIndex(sourceRanges, Math.min(start, Math.max(0, (textKey.textKey || "").length - 1))) || sourceRanges[0];
    ranges.push({
      _obj: "paragraphStyleRange",
      from: start,
      to: index + 1,
      paragraphStyle: clonePlainObject(source.paragraphStyle || sourceRanges[0].paragraphStyle || { _obj: "paragraphStyle" })
    });
    start = index + 1;
  });

  if (start <= textLength) {
    const source = getParagraphStyleForTextIndex(sourceRanges, Math.min(start, Math.max(0, (textKey.textKey || "").length - 1))) || sourceRanges[0];
    ranges.push({
      _obj: "paragraphStyleRange",
      from: start,
      to: textLength,
      paragraphStyle: clonePlainObject(source.paragraphStyle || sourceRanges[0].paragraphStyle || { _obj: "paragraphStyle" })
    });
  }

  return ranges;
}

function getTextLayerJustificationValue(layer) {
  try {
    const value = layer && layer.textItem && layer.textItem.justification;
    return value === undefined || value === null ? null : value;
  } catch (error) {
    return null;
  }
}

async function restoreTextLayerJustification(layer, justification) {
  if (!layer || justification === undefined || justification === null) return;
  try {
    layer.textItem.justification = justification;
    log(`  Text paragraph justification restored from template: ${layer.name}.`);
  } catch (error) {
    log(`  Text paragraph justification restore skipped for ${layer.name}: ${formatError(error)}`);
  }
}

async function replaceTextLayerPreserveTemplateParagraphWithSuperscripts(layer, value, doc = null, options = {}) {
  const parsed = parseTitleSuperscriptMarkup(value);
  await replaceTextLayerPreserveTemplateParagraph(layer, parsed.text, doc, {
    ...options,
    superscripts: parsed.superscripts
  });
  if (parsed.superscripts.length) {
    log(`  Text superscripts applied: ${layer.name}, count=${parsed.superscripts.length}.`);
  }
}
async function replaceTextLayerPreserveTemplateParagraph(layer, value, doc = null, options = {}) {
  if (!layer || value === undefined || value === null) return;
  if (!layer.textItem) {
    throw new Error(`Layer "${layer.name}" is not a text layer`);
  }

  ensureModules();
  photoshop.app.activeDocument.activeLayers = [layer];
  const originalJustification = getTextLayerJustificationValue(options.justificationSourceLayer || layer);

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
    const baseStyle = textKey && textKey.textStyleRange && textKey.textStyleRange[0] && textKey.textStyleRange[0].textStyle;
    if (!textKey || !baseStyle) {
      await replaceTextLayerPreserveFirstStyle(layer, value);
      return;
    }

    const textValue = toPhotoshopText(wrapPddSkuGiftLabelIfNeeded(doc, layer, value, textKey));
    const textLength = Array.from(textValue).length;
    const paragraphStyleRange = buildTemplateParagraphStyleRanges(textKey, textValue);
    const symbolsAsLatin = shouldUseLineSeedForSymbols(layer.name);
    const styleByKind = getTemplateTextStyleByKind(textKey, baseStyle, { symbolsAsLatin });
    let textStyleRange = buildMixedTextTemplateStyleRanges(textValue, styleByKind, { symbolsAsLatin });
    if (Array.isArray(options.superscripts) && options.superscripts.length) {
      textStyleRange = applySuperscriptsToTextStyleRanges(textStyleRange, options.superscripts, { styleByKind });
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
            textStyleRange,
            ...(paragraphStyleRange ? { paragraphStyleRange } : {})
          },
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    await restoreTextLayerJustification(layer, originalJustification);
  } catch (error) {
    log(`  Preserve template paragraph skipped for ${layer.name}: ${formatError(error)}`);
    await replaceTextLayerPreserveFirstStyle(layer, value);
  }
}

async function alignTextLayerToArea(doc, layer) {
  if (!layer || !layer.name || !layer.textItem) return;
  if (shouldKeepTemplateTextBox(layer.name)) {
    log(`  Text box kept from PSD: ${layer.name}.`);
    return;
  }

  const areaLayer = getTextAreaLayerNames(layer.name)
    .map((name) => findLayerByName(doc, name))
    .find(Boolean);
  if (!areaLayer) return;

  const areaBox = getBoundsBox(areaLayer.boundsNoEffects || areaLayer.bounds);
  if (!areaBox) return;

  const textBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
  if (!textBox) return;
  await layer.translate(areaBox.centerX - textBox.centerX, areaBox.top - textBox.top);
  areaLayer.visible = false;
  log(`  Text aligned to area: ${layer.name} -> ${areaLayer.name}.`);
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
    const hasExplicitNote = ["txt.productNote", "txt.note", "txt.description", "txt.subtitle"].some((key) => Object.prototype.hasOwnProperty.call(expanded, key));
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

async function resizeSubtitleRectangle(doc, textLayer, textValue, variantSourceText = textValue) {
  const config = getCurrentTemplateConfig().subtitleRectangle;
  if (!config || !textLayer) return;

  const variant = getSubtitleLayerVariant(variantSourceText);
  const rectangleLayer = findSubtitleRectangleLayer(doc, variant, config, state.currentRow || {});
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
  const measuredTextWidth = getSubtitleRectangleTextWidth(textValue, fontSize, variant);
  const maxWidth = readNumber(
    state.currentRow || {},
    `subtitle.rectangleMaxWidth.${variant}`,
    readNumber(state.currentRow || {}, "subtitle.rectangleMaxWidth", getDefaultSubtitleRectangleMaxWidth(variant, textValue))
  );
  const widthScale = readNumber(
    state.currentRow || {},
    `subtitle.rectangleWidthScale.${variant}`,
    readNumber(state.currentRow || {}, "subtitle.rectangleWidthScale", Number(config.widthScale) || 1)
  );
  const targetWidth = Math.min(
    Math.max(measuredTextWidth * widthScale + paddingX * 2, Number(config.minWidth) || 0),
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
    rectangleLayer.visible = true;
    await resizeLayerToBox(rectangleLayer, targetBox, { preserveHeight: true });
    try {
      await rectangleLayer.move(textLayer, photoshop.constants.ElementPlacement.PLACEAFTER);
    } catch (error) {
      log(`  Subtitle rectangle z-order skipped: ${formatError(error)}`);
    }
    log(`  Subtitle rectangle resized: variant=${variant}, boundsW=${Math.round(textBox.width)}, estimateW=${Math.round(estimatedTextWidth)}, textW=${Math.round(measuredTextWidth)}, maxW=${Math.round(maxWidth)}, w=${Math.round(targetWidth)}, h=${Math.round(targetHeight)}.`);
  } catch (error) {
    log(`  Subtitle rectangle resize skipped: ${formatError(error)}`);
  }
}

function getSubtitleRectangleTextWidth(textValue, fontSize, variant) {
  const lines = String(textValue || "")
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const textWidth = Math.max(...(lines.length ? lines : [""]).map((line) => estimateTextLineWidth(line, fontSize)), 0);
  const charCount = getSubtitleCharCount(textValue);
  const scale = getSubtitleRectangleWidthScaleByLength(variant, charCount);
  return textWidth * scale;
}

function getSubtitleRectangleWidthScaleByLength(variant, charCount) {
  if (variant <= 1) return charCount >= 22 ? 1.38 : 1.32;
  if (charCount >= 39) return 1.18;
  if (charCount >= 36) return 1.12;
  if (charCount >= 30) return 1.06;
  return 0.98;
}

function getDefaultSubtitleRectangleMaxWidth(variant, textValue = "") {
  const charCount = getSubtitleCharCount(textValue);
  if (variant <= 1) return 760;
  if (charCount >= 39) return 760;
  if (charCount >= 36) return 740;
  return 700;
}

function getSubtitleLayerVariant(textValue) {
  return shouldUseSubtitleCompactVariant(textValue) ? 2 : 1;
}

function getSubtitleCharCount(textValue) {
  return Array.from(String(textValue || "").replace(/\r\n|\r|\n/g, "")).length;
}

function shouldUseSubtitleCompactVariant(textValue) {
  const text = String(textValue || "").replace(/\r\n|\r|\n/g, "");
  const charCount = getSubtitleCharCount(text);
  if (charCount > 24) return true;
  const style = getCurrentTemplateConfig().subtitleTextStyle || {};
  const fontSize = readNumber(state.currentRow || {}, "subtitle.fontSize", Number(style.fontSize) || 30);
  const maxWidth = readNumber(state.currentRow || {}, "subtitle.maxTextWidth", Number(getCurrentTemplateConfig().subtitleRectangle && getCurrentTemplateConfig().subtitleRectangle.maxTextWidth) || 560);
  return estimateTextLineWidth(text, fontSize) > maxWidth;
}

function isSubtitleTextLayer(layer) {
  return !!(layer && /^txt\.subtitle(?:\.\d+)?$/.test(String(layer.name || "")));
}

function findSubtitleTextLayer(doc, finalText, variantSourceText = finalText, row = null) {
  const variant = getSubtitleLayerVariant(variantSourceText);
  const preferredName = `txt.subtitle.${variant}`;
  const scopedPreferred = findLayerByNameInCurrentMechanismOnly(doc, row, preferredName);
  const scopedFallback = findLayerByNameInCurrentMechanismOnly(doc, row, "txt.subtitle");
  const preferred = scopedPreferred || findLayerByName(doc, preferredName);
  const fallback = scopedFallback || findLayerByName(doc, "txt.subtitle");
  const layer = scopedPreferred || scopedFallback || preferred || fallback;
  hideAlternateSubtitleLayers(doc, layer, row);
  if (layer) {
    log(`  Subtitle layer selected: ${layer.name}, chars=${getSubtitleCharCount(variantSourceText)}.`);
  }
  return layer;
}

function hideAlternateSubtitleLayers(doc, activeLayer, row = null) {
  const names = ["txt.subtitle", "txt.subtitle.1", "txt.subtitle.2"];
  const mechanismLayer = findDailyMechanismLayer(doc, row || state.currentRow || {});
  names.forEach((name) => {
    const layer = mechanismLayer ? findLayerByNameInLayer(mechanismLayer, name) : findLayerByName(doc, name);
    if (layer && layer !== activeLayer) {
      layer.visible = false;
    }
  });
}

function hideSubtitleModule(doc) {
  hideAlternateSubtitleLayers(doc, null);
  hideAlternateSubtitleRectangleLayers(doc, null);
  log("  Subtitle hidden: empty txt.subtitle.");
}
function findSubtitleRectangleLayer(doc, variant, config, row = null) {
  const names = [
    `txt.subtitle.rectangle.${variant}`,
    config.layerName || "txt.subtitle.rectangle"
  ];
  const layer = names
    .map((name) => findLayerByNameInCurrentMechanismOnly(doc, row, name))
    .find(Boolean) || names.map((name) => findLayerByName(doc, name)).find(Boolean);
  if (layer) {
    hideAlternateSubtitleRectangleLayers(doc, layer);
    if (layer.name !== (config.layerName || "txt.subtitle.rectangle")) {
      log(`  Subtitle rectangle layer selected: ${layer.name}.`);
    }
  }
  return layer;
}

function hideAlternateSubtitleRectangleLayers(doc, activeLayer) {
  ["txt.subtitle.rectangle", "txt.subtitle.rectangle.1", "txt.subtitle.rectangle.2"].forEach((name) => {
    const layer = findLayerByName(doc, name);
    if (layer && layer !== activeLayer) {
      layer.visible = false;
    }
  });
}

function getTitleNoteLayerNames() {
  return [
    "txt.titleNote.1", "txt.titleNote.2", "txt.titleNote.3", "txt.titleNote.4", "txt.titleNote",
    "txt.textNote.1", "txt.textNote.2", "txt.textNote.3", "txt.textNote.4", "txt.textNote",
    "text.note.1", "text.note.2", "text.note.3", "text.note.4", "text.note"
  ];
}

function getTitleNoteColumnKeys(variantIndex = null) {
  const variant = Number(variantIndex);
  const keyed = Number.isFinite(variant) && variant > 0
    ? [`txt.titleNote.${variant}`, `txt.textNote.${variant}`, `text.note.${variant}`]
    : [];
  return [
    ...keyed,
    "txt.titleNote",
    "txt.textNote",
    "text.note"
  ];
}

function getTitleNotePreferredNames(variantIndex) {
  const variant = Math.min(Math.max(Number(variantIndex) || 1, 1), 4);
  const base = ["txt.titleNote", "txt.textNote", "text.note"];
  const namesFor = (index) => [`txt.titleNote.${index}`, `txt.textNote.${index}`, `text.note.${index}`];
  const ordered = [
    ...namesFor(variant),
    ...base
  ];
  [1, 2, 3, 4].forEach((index) => {
    if (index !== variant) ordered.push(...namesFor(index));
  });
  return ordered;
}

function getUniqueLayersByNames(doc, names) {
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

function findPreferredLayerByNames(doc, row, names) {
  for (const name of names || []) {
    const layer = findLayerByNameInCurrentMechanismOnly(doc, row, name);
    if (layer) return layer;
  }
  for (const name of names || []) {
    const layer = findLayersByName(doc, name)[0];
    if (layer) return layer;
  }
  return null;
}

function getTitleNoteVariantLayer(doc, variantIndex, row = null) {
  return findPreferredLayerByNames(doc, row, getTitleNotePreferredNames(variantIndex));
}

function getExplicitTitleNoteVariant(row) {
  const explicit = firstTextValue(row || {}, [
    "txt.titleNoteLayer",
    "txt.titleNote.layer",
    "titleNote.layer",
    "txt.titleNoteVariant",
    "titleNote.variant",
    "txt.textNoteLayer",
    "txt.textNote.layer",
    "text.noteLayer",
    "text.note.layer",
    "text.noteVariant",
    "text.note.variant"
  ]);
  const text = String(explicit || "").trim().toLowerCase();
  if (!text) return null;
  const match = text.match(/(?:title|text)?\.?note\.?([1-4])$|^([1-4])$/);
  const variant = Number(match && (match[1] || match[2]));
  return Number.isFinite(variant) && variant >= 1 && variant <= 4 ? variant : null;
}

function inferTitleNoteVariantIndex(row, titleLineCount, titleLayer = null) {
  const explicit = getExplicitTitleNoteVariant(row);
  if (explicit) return explicit;

  const titleLayerName = String(titleLayer && titleLayer.name || "").trim();
  if (/^txt\.title\.bold$/i.test(titleLayerName)) return 3;
  if (!hasValue(row || {}, "txt.title") && !hasValue(row || {}, "txt.tile") && !hasValue(row || {}, "title") && hasValue(row || {}, "txt.title.bold")) {
    return 3;
  }
  return Math.min(Math.max(Number(titleLineCount) || 1, 1), 4);
}

async function applyTitleNoteLayer(doc, row, titleLineCount, options = {}) {
  const keys = getTitleNoteColumnKeys()
    .concat(getTitleNoteColumnKeys(1), getTitleNoteColumnKeys(2), getTitleNoteColumnKeys(3), getTitleNoteColumnKeys(4));
  const hasTitleNoteColumn = keys.some((key) => Object.prototype.hasOwnProperty.call(row || {}, key));
  if (!hasTitleNoteColumn) return false;

  const variantIndex = inferTitleNoteVariantIndex(row, titleLineCount, options.titleLayer);
  const titleNoteText = firstTextValue(row, getTitleNoteColumnKeys(variantIndex));
  const layerNames = getTitleNoteLayerNames();
  const layers = getUniqueLayersByNames(doc, layerNames);
  if (!layers.length) return false;

  const selectedLayer = getTitleNoteVariantLayer(doc, variantIndex, row);
  if (titleNoteText === undefined || titleNoteText === null || titleNoteText === "" || !selectedLayer) {
    layers.forEach((layer) => { layer.visible = false; });
    log(`  Title note hidden: empty or missing layer, hiddenAlternates=${layers.length}, variant=${variantIndex}.`);
    return true;
  }

  layers.forEach((layer) => {
    layer.visible = layer === selectedLayer;
  });
  selectedLayer.visible = true;
  await replaceTextLayerPreserveTemplateParagraphWithSuperscripts(selectedLayer, titleNoteText, doc);
  log(`  Title note variant used: ${selectedLayer.name}, hiddenAlternates=${Math.max(layers.length - 1, 0)}, titleLines=${titleLineCount}, variant=${variantIndex}.`);
  return true;
}
function getTitleLayerVariantNames() {
  return ["txt.title.1", "txt.title.2", "txt.title", "txt.title.bold"];
}

function normalizeTitleLayerSwitch(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (/^(bold|b|special|txt\.title\.bold|title\.bold|\u52a0\u7c97|\u7c97\u4f53)$/.test(text)) return "bold";
  if (/^(2|small|compact|long|txt\.title\.2|title\.2|title2)$/.test(text)) return "2";
  if (/^(1|large|normal|big|txt\.title\.1|title\.1|title1)$/.test(text)) return "1";
  const match = text.match(/(?:title\.)?([12])\b/);
  return match ? match[1] : "";
}

function getTitleLayerSwitch(row) {
  const explicit = firstTextValue(row || {}, [
    "txt.titleLayer",
    "txt.title.layer",
    "title.layer",
    "titleLayer",
    "txt.titleVariant",
    "title.variant",
    "titleVariant"
  ]);
  const explicitVariant = normalizeTitleLayerSwitch(explicit);
  if (explicitVariant) return { variant: explicitVariant, reason: "explicit" };

  const hasMainTitle = hasValue(row, "txt.title") || hasValue(row, "txt.tile") || hasValue(row, "title");
  if (!hasMainTitle) {
    if (hasValue(row, "txt.title.bold")) return { variant: "bold", reason: "column=txt.title.bold" };
    if (hasValue(row, "txt.title.2")) return { variant: "2", reason: "column=txt.title.2" };
    if (hasValue(row, "txt.title.1")) return { variant: "1", reason: "column=txt.title.1" };
  }
  return null;
}

function getTitleTextForRow(row, switchInfo) {
  const variant = switchInfo && switchInfo.variant;
  if (variant === "bold") return firstTextValue(row, ["txt.title.bold", "txt.title", "txt.tile", "title"]);
  if (variant === "2") return firstTextValue(row, ["txt.title.2", "txt.title", "txt.tile", "title"]);
  if (variant === "1") return firstTextValue(row, ["txt.title.1", "txt.title", "txt.tile", "title"]);
  return firstTextValue(row, ["txt.title", "txt.tile", "title", "txt.title.1", "txt.title.2", "txt.title.bold"]);
}

function getTitleVariantInfo(row, text, options = {}) {
  const switchInfo = options.switchInfo || getTitleLayerSwitch(row);
  if (switchInfo && switchInfo.variant === "2") return { variant: 2, reason: switchInfo.reason || "explicit" };
  if (switchInfo && switchInfo.variant === "1") return { variant: 1, reason: switchInfo.reason || "explicit" };
  if (switchInfo && switchInfo.variant === "bold") return { variant: "bold", reason: switchInfo.reason || "explicit" };

  const explicit = String(firstTextValue(row || {}, ["txt.titleVariant", "title.variant", "titleVariant"]) || "").trim();
  const explicitVariant = normalizeTitleLayerSwitch(explicit);
  if (explicitVariant === "2") return { variant: 2, reason: "explicit" };
  if (explicitVariant === "1") return { variant: 1, reason: "explicit" };

  const raw = String(text || "");
  const lineCount = raw.split(/\r\n|\r|\n/).length;
  const configuredMinLines = readNumber(row || {}, "title.variant2MinLines", Number(getCurrentTemplateConfig().titleVariant2MinLines));
  const minLines = Number.isFinite(configuredMinLines) && configuredMinLines > 0 ? configuredMinLines : 3;
  if (lineCount >= minLines) return { variant: 2, reason: `lines=${lineCount}/${minLines}` };

  const minUnits = readNumber(row || {}, "title.variant2MinUnits", readNumber(row || {}, "txt.titleVariant2MinUnits", 24));
  const units = getDisplayLength(raw.replace(/\s+/g, ""));
  if (Number.isFinite(minUnits) && minUnits > 0 && units >= minUnits) {
    return { variant: 2, reason: `units=${units.toFixed(1)}/${minUnits}` };
  }
  return { variant: 1, reason: `units=${units.toFixed(1)}/${minUnits || "auto"}` };
}

function findTitleLayerForRow(doc, row, text, options = {}) {
  const switchInfo = options.switchInfo || getTitleLayerSwitch(row);
  const variantInfo = getTitleVariantInfo(row, text, { switchInfo });
  const titleLayerNames = getTitleLayerVariantNames();
  const titleLayers = getUniqueLayersByNames(doc, titleLayerNames);
  const preferredNames = variantInfo.variant === "bold"
    ? ["txt.title.bold", "txt.title", "txt.title.1", "txt.title.2"]
    : variantInfo.variant === 2
      ? ["txt.title.2", "txt.title", "txt.title.1", "txt.title.bold"]
      : ["txt.title.1", "txt.title", "txt.title.2", "txt.title.bold"];
  const selectedLayer = findPreferredLayerByNames(doc, row, preferredNames);

  titleLayers.forEach((layer) => {
    if (layer && layer !== selectedLayer) layer.visible = false;
  });
  if (selectedLayer) {
    selectedLayer.visible = true;
    log(`  Title layer selected: ${selectedLayer.name}, hiddenAlternates=${Math.max(titleLayers.length - 1, 0)}, ${variantInfo.reason}.`);
  }
  return selectedLayer;
}
async function applyTitleAndProductNote(doc, row) {
  const handled = {};
  const titleSwitch = getTitleLayerSwitch(row);
  const titleText = getTitleTextForRow(row, titleSwitch);
  const titlePreviewText = titleText !== undefined && titleText !== null ? parseTitleSuperscriptMarkup(titleText).text : "";
  const titleLayer = titleText !== undefined && titleText !== null
    ? findTitleLayerForRow(doc, row, titlePreviewText, { switchInfo: titleSwitch })
    : findTextLayerForColumn(doc, "txt.title", row);
  const titleOriginalBox = await getLayerBox(titleLayer);
  let titleLineCount = 1;
  let titleLongSecondLine = false;

  if (titleLayer && titleText !== undefined && titleText !== null) {
    const parsedTitle = parseTitleSuperscriptMarkup(titleText);
    if (getCurrentTemplateConfig().preserveTemplateTextOnly) {
      titleLineCount = String(parsedTitle.text).split(/\r\n|\r|\n/).length;
      await replaceTitleLayerKeepTemplateStyle(titleLayer, parsedTitle.text, { superscripts: parsedTitle.superscripts });
      handled["txt.title"] = true;
      handled["txt.title.1"] = true;
      handled["txt.title.2"] = true;
      handled["txt.title.bold"] = true;
      handled["txt.tile"] = true;
      log(`  Title text-only replace: template box/style kept, lines=${titleLineCount}`);
    } else {
      const maxWidth = getTitleMaxWidth(row, titleLayer);
      const wrapped = await wrapTitleToMeasuredWidth(titleLayer, parsedTitle.text, maxWidth);
      const secondLineInfo = getLongSecondTitleLineInfo(wrapped);
      const superscripts = shiftSuperscriptRanges(parsedTitle.superscripts, parsedTitle.text, wrapped);
      const titleLeadingRatio = getTitleLineHeightRatio(row, secondLineInfo.triggered);
      await replaceTitleLayerKeepTemplateStyle(titleLayer, wrapped, Number.isFinite(titleLeadingRatio) && titleLeadingRatio > 0 ? { superscripts, leadingRatio: titleLeadingRatio } : { superscripts });
      titleLineCount = String(wrapped).split(/\r\n|\r|\n/).length;
      titleLongSecondLine = secondLineInfo.triggered;
      const titleAfterBox = await getLayerBox(titleLayer);
      if (titleOriginalBox && titleAfterBox) {
        await titleLayer.translate(titleOriginalBox.left - titleAfterBox.left, titleOriginalBox.top - titleAfterBox.top);
        log("  Restored txt.title top-left anchor.");
      }
      handled["txt.title"] = true;
      handled["txt.title.1"] = true;
      handled["txt.title.2"] = true;
      handled["txt.title.bold"] = true;
      handled["txt.tile"] = true;
      log(`  Title applied: maxWidth=${Math.round(maxWidth)}, lines=${titleLineCount}`);
      if (titleLongSecondLine) {
        log(`  Title second line scaled: chars=${secondLineInfo.secondLineChars}, scale=0.5.`);
      }
    }
  }

  if (await applyTitleNoteLayer(doc, row, titleLineCount, { titleLayer })) {
    handled["txt.titleNote"] = true;
    handled["txt.titleNote.1"] = true;
    handled["txt.titleNote.2"] = true;
    handled["txt.titleNote.3"] = true;
    handled["txt.titleNote.4"] = true;
    handled["txt.textNote"] = true;
    handled["txt.textNote.1"] = true;
    handled["txt.textNote.2"] = true;
    handled["txt.textNote.3"] = true;
    handled["txt.textNote.4"] = true;
    handled["text.note"] = true;
    handled["text.note.1"] = true;
    handled["text.note.2"] = true;
    handled["text.note.3"] = true;
    handled["text.note.4"] = true;
  }

  if (Object.prototype.hasOwnProperty.call(row || {}, "txt.subtitle") && !hasValue(row, "txt.subtitle")) {
    hideSubtitleModule(doc);
    handled["txt.subtitle"] = true;
  }

  const promoTitleKey = ["txt.promoTitle", "txt.promoText"].find((key) => hasValue(row, key));
  if (promoTitleKey) {
    if (await applyBottomTextVariantRules(doc, row[promoTitleKey], row, promoTitleKey)) {
      handled["txt.promoTitle"] = true;
      handled["txt.promoTitle.1"] = true;
      handled["txt.promoTitle.2"] = true;
      handled["txt.promoText"] = true;
      handled["txt.promoText.1"] = true;
      handled["txt.promoText.2"] = true;
      log(`  Promo title applied from ${promoTitleKey}.`);
    } else {
      log(`  Promo title layer not found: ${promoTitleKey}.`);
    }
  }

  const noteSourceKey = ["txt.productNote", "txt.note", "txt.description", "txt.subtitle"].find((key) => hasValue(row, key));
  const noteText = noteSourceKey ? row[noteSourceKey] : undefined;
  const productNoteLayer1 = findLayerByName(doc, "txt.productNote.1");
  const productNoteLayer2 = findLayerByName(doc, "txt.productNote.2");
  const productNoteLayer3 = findLayerByName(doc, "txt.productNote.3");
  const productNoteLayer = titleLongSecondLine && productNoteLayer3
    ? productNoteLayer3
    : titleLineCount > 1 && productNoteLayer2
      ? productNoteLayer2
      : productNoteLayer1 || findLayerByName(doc, "txt.productNote");
  const forceSubtitleLayer = (getCurrentTemplateConfig().productNameToSubtitle && hasValue(row, "txt.subtitle")) || noteSourceKey === "txt.subtitle";
  const subtitlePreviewText = forceSubtitleLayer && getCurrentTemplateConfig().productNameToSubtitle ? formatPddSubtitleText(noteText) : noteText;
  const subtitleLayer = forceSubtitleLayer
    ? findSubtitleTextLayer(doc, subtitlePreviewText, noteText, row)
    : findCurrentMechanismLayerByName(doc, row, "txt.subtitle");
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
    const isSubtitleLayer = isSubtitleTextLayer(fallbackNoteLayer);
    const maxSubtitleWidth = isSubtitleLayer && subtitleConfig
      ? readNumber(row, "subtitle.maxTextWidth", Number(subtitleConfig.maxTextWidth) || null)
      : null;
    const pddSubtitle = isSubtitleLayer && getCurrentTemplateConfig().productNameToSubtitle;
    let finalNoteText = pddSubtitle ? formatPddSubtitleText(noteText) : noteText;
    if (pddSubtitle) {
      await replaceTextLayerPddSkuGiftSubtitleStyle(fallbackNoteLayer, finalNoteText, getCurrentTemplateConfig().subtitleTextStyle, "Subtitle");
      log(`  Subtitle text applied: chars=${getSubtitleCharCount(finalNoteText)}, lines=${String(finalNoteText || "").split(/\r\n|\r|\n/).filter(Boolean).length}.`);
    } else if (isSubtitleLayer && Number.isFinite(maxSubtitleWidth) && maxSubtitleWidth > 0) {
      await replaceTextLayerPreserveFirstStyle(fallbackNoteLayer, noteText);
      finalNoteText = await wrapTitleToMeasuredWidth(fallbackNoteLayer, noteText, maxSubtitleWidth, { forceMaxWidth: true });
    } else {
      await replaceTextLayerPreserveFirstStyle(fallbackNoteLayer, noteText);
    }
    const noteAfterBox = getBoundsBox(fallbackNoteLayer.boundsNoEffects || fallbackNoteLayer.bounds);
    if (isSubtitleLayer && noteOriginalBox && noteAfterBox) {
      await fallbackNoteLayer.translate(noteOriginalBox.centerX - noteAfterBox.centerX, noteOriginalBox.top - noteAfterBox.top);
      log("  Subtitle anchor restored.");
    }
    if (isSubtitleLayer) {
      await resizeSubtitleRectangle(doc, fallbackNoteLayer, finalNoteText, noteText);
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
    GIFT_NAME_COLUMNS.includes(column) ||
    /^(giftLeft|giftRight|gift|product)\.(count|layout|zOrder|x|y|w|h|width|height|itemW|itemWidth|itemH|itemHeight|spacing|gap|bottom|heightRatio|scale|slotFill|slotSpan|category|categoryGapMode|categoryGap|overlapRatio|edgePaddingRatio|sourceMode|copyMode|ampouleGroups|groupCount|ampouleGap|ampouleRowGap|ampouleGroupHeight|ampouleHeightRatio)(\.\d+)?$/.test(column) ||
    /^product\.gap\.\d+$/.test(column) ||
    /^product\.gap\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(column) ||
    /^giftLeft\.(tube100HeightRatio|tube25HeightRatio|minHeightRatio)$/.test(column) ||
    /^product\.([a-zA-Z0-9]+HeightRatio|heightMode|view|imageView|assetView|viewMode|viewNote|imageNote|assetNote|note|touchEdges|touch|ampouleSetSlotSpan|ampouleSetSlots)$/.test(column) ||
    /^productShadow\.(top|opacity|style|gift|giftShadow|includeGift|includeGiftShadow)$/.test(column) ||
    /^productBottomShadow\.(opacity|widthRatio|heightRatio|offsetXRatio|bottomOffsetRatio|blur)$/.test(column) ||
    /^(giftshadow|giftshadow\.enabled|gift\.shadow|giftShadow|gift\.shadow\.enabled|giftShadow\.enabled)$/.test(column) ||
    /^(shadow\.style|shadowStyle)$/.test(column) ||
    isAddOnCouponColumn(column) ||
    /^pdd\.background$/.test(column) ||
    /^(?:icon|daily\.icon|pdd\.icon)\..+$/.test(column) ||
    /^(?:daily\.icons|pdd\.icons)$/.test(column) ||
    /^(mechanism|daily\.(mechanism|giftMiddleType|left298))$/.test(column) ||
    /^person\.(offsetX|offsetY)$/.test(column) ||
    /^(txt\.titleLayer|txt\.title\.layer|title\.layer|titleLayer|txt\.titleStyle|title\.style|titleStyle)$/.test(column) ||
    /^(title|txt)\.(wrapAt|titleWrapAt|titleMaxWidth|maxWidth|titleVariant|variant|titleVariant2MinUnits|variant2MinUnits|productNoteGap|productNoteOffsetY|titleLineHeight|lineHeight|titleLineHeightRatio|lineHeightRatio|titleTracking|tracking|bottomTextScale|promoTitleScale|promoTitleWidthScale)$/.test(column) ||
    /^(bottomText|promoTitle)\.maxWidth$/.test(column) ||
    /^promoTitle\.widthScale$/.test(column) ||
    /^subtitle\.(rectanglePadding[XY]|rectangleMaxWidth|rectangleWidthScale|rectangleRadius|maxTextWidth|fontSize)(\.\d+)?$/.test(column) ||
    /^productNote\.(gap|offsetY)$/.test(column) ||
    /^(note|remark|remarks|备注|产品视角)$/.test(column);
}

function readDescriptorUnitValue(value) {
  if (typeof value === "number") return value;
  if (value && typeof value._value === "number") return value._value;
  if (value && typeof value.value === "number") return value.value;
  return Number(value);
}

function makePixelUnit(value) {
  return { _unit: "pixelsUnit", _value: Number(value) };
}

async function getCurrentArtboardExportRect() {
  const layer = state.currentArtboardLayer;
  if (!layer || typeof layer.id === "undefined") return null;

  try {
    const result = await photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [{ _ref: "layer", _id: layer.id }],
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: true, modalBehavior: "execute" }
    );
    const rect = result && result[0] && result[0].artboard && result[0].artboard.artboardRect;
    if (!rect) return null;
    const left = readDescriptorUnitValue(rect.left);
    const top = readDescriptorUnitValue(rect.top);
    const right = readDescriptorUnitValue(rect.right);
    const bottom = readDescriptorUnitValue(rect.bottom);
    if (![left, top, right, bottom].every(Number.isFinite) || right <= left || bottom <= top) return null;
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  } catch (error) {
    log(`  Artboard rect read skipped: ${formatError(error)}`);
    return null;
  }
}

async function cropDocumentToCurrentArtboard(doc) {
  const switchConfig = getArtboardSwitchConfig();
  if (!switchConfig || !switchConfig.enabled || !state.currentArtboardLayer) return false;

  const rect = await getCurrentArtboardExportRect(doc);
  if (!rect) {
    log(`  Artboard export crop skipped: rect not found for ${state.currentArtboardName || "current artboard"}.`);
    return false;
  }

  try {
    await photoshop.action.batchPlay(
      [
        {
          _obj: "crop",
          to: {
            _obj: "rectangle",
            top: makePixelUnit(rect.top),
            left: makePixelUnit(rect.left),
            bottom: makePixelUnit(rect.bottom),
            right: makePixelUnit(rect.right)
          },
          angle: { _unit: "angleUnit", _value: 0 },
          delete: true,
          _options: { dialogOptions: "dontDisplay" }
        }
      ],
      { synchronousExecution: false, modalBehavior: "execute" }
    );
  } catch (error) {
    log(`  Artboard export crop failed: ${formatError(error)}`);
    return false;
  }

  log(`  Artboard export crop: ${state.currentArtboardName || "current"}, ${Math.round(rect.width)}x${Math.round(rect.height)}.`);
  return true;
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
  const groupName = sanitizeFileBaseName(String(outputName || "").replace(/\.psd$/i, ""), `image_${index + 1}`);
  refreshCurrentArtboardLayer(doc, `PSD export ${outputName}`);
  await removeInactiveArtboardVariantLayersForPsd(doc, `PSD export ${outputName}`);
  await pruneNonDisplayedLayersForPsd(doc, `PSD export ${outputName}`);
  refreshCurrentArtboardLayer(doc, `PSD export ${outputName}`);
  await packCurrentArtboardForPsd(doc, groupName, `PSD export ${outputName}`);

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

async function openDocumentForMerge(file, label = "Merge PSD") {
  ensureModules();
  const opened = await photoshop.app.open(file);
  const active = photoshop.app.activeDocument || null;
  const doc = opened && opened.layers ? opened : active && active.layers ? active : opened || active;
  if (!doc || !doc.layers) {
    throw new Error(`${label} open failed: document not available after opening ${file && file.name || "PSD"}.`);
  }
  log(`  ${label} opened: ${file && file.name || "PSD"}, docId=${typeof doc.id === "undefined" ? "active" : doc.id}.`);
  return doc;
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
  const master = await openDocumentForMerge(first.file, "Merge master");
  const firstGroupName = sanitizeFileBaseName(String(first.name || first.file.name || "1").replace(/\.psd$/i, ""), `sku_${first.index || 1}`);
  await packDocumentLayersForMerge(master, firstGroupName, true);

  let imported = 1;
  for (let i = 1; i < psdEntries.length; i += 1) {
    const entry = psdEntries[i];
    const groupName = sanitizeFileBaseName(String(entry.name || entry.file.name || `sku_${i + 1}`).replace(/\.psd$/i, ""), `sku_${entry.index || i + 1}`);
    let srcDoc = null;
    try {
      log(`  Merge opening: ${entry.name || entry.file.name}`);
      srcDoc = await openDocumentForMerge(entry.file, "Merge source");
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
      await activateDocumentBestEffort(master);
    }
  }

  await activateDocumentBestEffort(master);
  await moveBgToBottom(master);
  const outputName = `merged_psd_groups_${makeTimestampForFileName()}.psd`;
  const mergedFile = await outputFolder.createFile(outputName, { overwrite: true });
  await savePsdDocumentAsFile(master, mergedFile, { collapseGroups: true });
  log(`Merge PSD saved: ${outputName}, groups=${imported}.`);
  return outputName;
}

function ensureProductProjectVisibleBeforeExport(doc) {
  const config = getCurrentTemplateConfig().productShadow || {};
  const projectGroupName = config.targetGroupName || "PRODUCT.PROJECT";
  const projectGroup = findLayerByName(doc, projectGroupName) || findLayerByName(doc, "PRODUCT.PROJECT");
  if (projectGroup) {
    projectGroup.visible = true;
    log(`  Product project group visible before export: ${projectGroup.name}.`);
  }

  const shadowLayer = findLayerByName(doc, config.name || "PRODUCT.shadow") || findLayerByName(doc, "PRODUCT.shadow");
  if (shadowLayer) {
    shadowLayer.visible = true;
    log(`  Product shadow visible before export: ${shadowLayer.name}.`);
  }
}

async function exportDocument(doc, row, index) {
  const formats = getExportFormats(row);
  log(`  Exporting ${formats.map((format) => format.toUpperCase()).join(" + ")}...`);
  ensureProductProjectVisibleBeforeExport(doc);
  ensureBaibuMainProductLabelVisible(doc, row, "Export");
  await cropDocumentToCurrentArtboard(doc);
  ensureBaibuMainProductLabelVisible(doc, row, "Export crop");
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
  if (doc.closeWithoutSaving) {
    await doc.closeWithoutSaving();
    return;
  }
  if (!doc.close) return;
  ensureModules();
  await doc.close(photoshop.constants.SaveOptions.DONOTSAVECHANGES);
}

async function applyConfiguredProductShadows(doc, row) {
  const config = getCurrentTemplateConfig();
  const style = normalizeProductShadowStyle(row, config);

  if (style === "none") {
    log("  Product shadow skipped: style=none.");
    return;
  }

  if (style === "right") {
    await applyProductBottomShadow(doc, row);
    log("  Product shadow style applied: right.");
    return;
  }

  if (style === "mirror") {
    await applyProductShadow(doc);
    log("  Product shadow style applied: mirror.");
    return;
  }

  await applyProductBottomShadow(doc, row);
  await applyProductShadow(doc);
}
async function applyRowToDocument(doc, row) {
  const expandedRow = expandRow(row);
  state.currentRow = expandedRow;
  await applyArtboardSwitch(doc, expandedRow);

  const productCount = getGiftCount(expandedRow, "product");
  const productImages = Array.from({ length: Math.max(productCount, 1) }, (_, index) => {
    return expandedRow[`img.product.${index + 1}`] || expandedRow["img.product"] || "";
  }).filter(Boolean);
  log(`  Active template: ${getCurrentTemplateConfig().id}, product.view=${getProductImageView(expandedRow)}, mechanism=${getDailyMechanismType(expandedRow, getMechanismSwitchConfig() || {}) || "none"}.`);
  log(`  Product expanded: count=${productCount || 1}, layout=${resolveImageGroupLayout(expandedRow, "product", productCount || 1)}, set=${expandedRow["img.productSet"] || ""}, images=${productImages.join(" | ")}`);

  const handledTextColumns = await applyTitleAndProductNote(doc, expandedRow);

  applyDailyMechanismSwitch(doc, expandedRow);
  await prepareImageGroupLayers(doc, expandedRow, "product");
  await prepareImageGroupLayers(doc, expandedRow, "giftLeft");
  await prepareImageGroupLayers(doc, expandedRow, "giftRight");
  await prepareImageGroupLayers(doc, expandedRow, "gift");
  applyBackgroundSwitch(doc, expandedRow);
  applyLayerVisibilitySwitches(doc, expandedRow);
  applyDynamicIconSwitch(doc, expandedRow);
  applyGiftTagVisibility(doc, expandedRow);
  applyGiftRightTemplateSwitch(doc, expandedRow);
  applyPersonTemplateSwitch(doc, expandedRow);

  for (const [column, value] of Object.entries(expandedRow)) {
    if (
      !value ||
      isIdentifierColumn(column) ||
      column.startsWith("imag.") ||
      column.startsWith("image.") ||
      column === "img.person" ||
      /^(shadow\.style|shadowStyle)$/.test(column) ||
      isAddOnCouponColumn(column) ||
      isAddOnCouponToken(value) ||
      column === "img.giftRight" ||
      /^img\.giftRight\.\d+$/.test(column) ||
      /^img\.giftLeft\.\d+$/.test(column) ||
      /^img\.gift\.\d+$/.test(column) ||
      handledTextColumns[column] ||
      state.placedImageLayers[column] ||
      column.endsWith("Set") ||
      column.endsWith(".count") ||
      column.endsWith(".layout") ||
      isGiftControlColumn(column) ||
      (column === "img.product" && getGiftCount(expandedRow, "product") > 1) ||
      (column === "img.gift" && getGiftCount(expandedRow, "gift") > 1) ||
      column === "img.giftLeft"
    ) {
      continue;
    }

    let layer = findLayerForDataColumn(doc, column, expandedRow);
    if (!layer) {
      if (column === "txt.productNote" || column === "txt.note" || column === "txt.description" || column === "txt.subtitle") {
        continue;
      }
      log(`  Skip: layer not found: ${column}`);
      continue;
    }

    if (column.startsWith("txt.")) {
      ensureLayerVisibleForDataReplacement(layer, column);
      if (isPromoTitleName(column)) {
        if (await applyBottomTextVariantRules(doc, value, expandedRow, column)) {
          continue;
        }
      }
      if (shouldReplaceTextOnlyWithoutMove(layer.name) || shouldReplaceTextOnlyWithoutMove(column)) {
        const originalTextBox = getBoundsBox(layer.boundsNoEffects || layer.bounds);
        const originalJustification = getTextLayerJustificationValue(layer);
        await replaceTextLayerPreserveTemplateParagraphWithSuperscripts(layer, value, doc);
        if (isBaibuMainProductLabelLayer(layer.name) || isBaibuMainProductLabelLayer(column)) {
          await wrapMainProductLabelToAreaIfOverflow(doc, layer, value, column);
          log(`  Main product label kept at PSD text origin: ${column}.`);
        } else {
          await restoreTextLayerOriginalAnchor(layer, originalTextBox, column, originalJustification);
        }
        log(`  Text content replaced only; position kept: ${column}.`);
        continue;
      }
      if (column === "txt.price" || layer.name === "txt.price") {
        await replacePriceLayerWithDecimalTailStyle(layer, value);
        log(`  Price content replaced; decimal tail kept small: ${column}.`);
        continue;
      }
      if (shouldKeepTemplateTextBox(layer.name) || shouldKeepTemplateTextBox(column)) {
        await replaceTextLayerPreserveTemplateParagraphWithSuperscripts(layer, value, doc);
        if (isPromoTitleName(layer.name) || isPromoTitleName(column)) {
          await fitPromoTitleLayerToArea(doc, layer);
          await alignPromoTitleLayerToArea(doc, layer);
        }
        log(`  Text content replaced; PSD paragraph kept: ${column}.`);
        continue;
      }
      if (isPromoTitleName(column)) {
        await applyBottomTextRules(layer, value);
      } else {
        await replaceTextLayer(layer, value);
      }
      await alignTextLayerToArea(doc, layer);
      continue;
    }

    if (column.startsWith("img.")) {
      const asset = await getAssetEntry(value, {
        disableTrimmed: column === "img.giftRight",
        normalizeGiftRight: column === "img.giftRight",
        productFallbackPriority: column.startsWith("img.product"),
        view: column.startsWith("img.product") ? getProductImageView(expandedRow) : ""
      });
      await replaceSmartObjectLayer(layer, asset);
      continue;
    }

    log(`  Skip: column needs txt. or img. prefix: ${column}`);
  }

  hideUnusedTemplateImageLayers(doc, expandedRow);
  applyDailyMechanismSwitch(doc, expandedRow);
  applyGiftTagVisibility(doc, expandedRow);
  await alignGiftTagToPlacedGiftLayer(doc, expandedRow);
  await applyGeneratedBottomTextIfNeeded(doc, expandedRow);
  log("  Before product arrange.");
  await arrangeProductLineAfterReplace(doc, expandedRow);
  log("  After product arrange.");
  await applyProductGroupScale(doc, expandedRow);
  await alignCurrentProductLayersToArea(doc, expandedRow);
  await alignGiftLeftImageGroupToArea(doc);
  await alignGiftImageGroupToArea(doc);
  await applyGiftCouponGapFromProduct(doc, expandedRow);
  await applyConfiguredProductShadows(doc, expandedRow);
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
  state.currentArtboardLayer = null;
  state.currentArtboardName = "";
  state.currentArtboardKey = "";

  const previousTemplateId = activeTemplateId;
  const previousOverrideId = rowTemplateOverrideId;
  const rowTemplateId = getRowTemplateId(row);
  if (rowTemplateId) {
    activeTemplateId = rowTemplateId;
    rowTemplateOverrideId = rowTemplateId;
    log(`  Row template profile: ${rowTemplateId}`);
  }

  const doc = await photoshop.app.open(templateFile);
  try {
    log("  Applying row data...");
    await applyRowToDocument(doc, row);
    return await exportDocument(doc, row, index);
  } finally {
    activeTemplateId = previousTemplateId;
    rowTemplateOverrideId = previousOverrideId;
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
    state.groupAreaNames = {};
    state.placedImageLayers = {};
    state.templateLayerBoxes = {};
    state.currentRow = null;
    state.currentArtboardLayer = null;
    state.currentArtboardName = "";
    state.currentArtboardKey = "";
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

async function getConfiguredAssetsFolder() {
  const assetsPath = getConfiguredPath("assets");
  if (!assetsPath) return null;
  if (configuredAssetsFolder && configuredAssetsFolderPath === assetsPath) {
    return configuredAssetsFolder;
  }

  try {
    configuredAssetsFolder = await getDefaultEntry(assetsPath);
    configuredAssetsFolderPath = assetsPath;
    return configuredAssetsFolder;
  } catch (error) {
    log(`Configured assets unavailable: ${formatError(error)}`);
    return null;
  }
}

async function getConfiguredAssetEntry(relativePath, message = "") {
  const configuredFolder = await getConfiguredAssetsFolder();
  if (!configuredFolder || configuredFolder === assetsFolder || !relativePath) return null;

  try {
    const entry = await configuredFolder.getEntry(relativePath);
    log(message || `Configured assets fallback: ${relativePath}`);
    return entry;
  } catch (error) {
    return null;
  }
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
