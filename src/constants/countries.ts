export const COUNTRIES = {
  // アジア
  JP: { code: 'JP', nameEn: 'Japan', nameJa: '日本', flag: '🇯🇵' },
  KR: { code: 'KR', nameEn: 'South Korea', nameJa: '韓国', flag: '🇰🇷' },
  CN: { code: 'CN', nameEn: 'China', nameJa: '中国', flag: '🇨🇳' },
  TW: { code: 'TW', nameEn: 'Taiwan', nameJa: '台湾', flag: '🇹🇼' },

  // 東南アジア
  TH: { code: 'TH', nameEn: 'Thailand', nameJa: 'タイ', flag: '🇹🇭' },
  VN: { code: 'VN', nameEn: 'Vietnam', nameJa: 'ベトナム', flag: '🇻🇳' },
  SG: { code: 'SG', nameEn: 'Singapore', nameJa: 'シンガポール', flag: '🇸🇬' },
  MY: { code: 'MY', nameEn: 'Malaysia', nameJa: 'マレーシア', flag: '🇲🇾' },
  ID: { code: 'ID', nameEn: 'Indonesia', nameJa: 'インドネシア', flag: '🇮🇩' },
  PH: { code: 'PH', nameEn: 'Philippines', nameJa: 'フィリピン', flag: '🇵🇭' },
  MM: { code: 'MM', nameEn: 'Myanmar', nameJa: 'ミャンマー', flag: '🇲🇲' },
  KH: { code: 'KH', nameEn: 'Cambodia', nameJa: 'カンボジア', flag: '🇰🇭' },
  LA: { code: 'LA', nameEn: 'Laos', nameJa: 'ラオス', flag: '🇱🇦' },
  BN: { code: 'BN', nameEn: 'Brunei', nameJa: 'ブルネイ', flag: '🇧🇳' },

  // 北アメリカ
  US: { code: 'US', nameEn: 'United States', nameJa: 'アメリカ合衆国', flag: '🇺🇸' },
  CA: { code: 'CA', nameEn: 'Canada', nameJa: 'カナダ', flag: '🇨🇦' },
  MX: { code: 'MX', nameEn: 'Mexico', nameJa: 'メキシコ', flag: '🇲🇽' },
  GT: { code: 'GT', nameEn: 'Guatemala', nameJa: 'グアテマラ', flag: '🇬🇹' },
  BZ: { code: 'BZ', nameEn: 'Belize', nameJa: 'ベリーズ', flag: '🇧🇿' },
  SV: { code: 'SV', nameEn: 'El Salvador', nameJa: 'エルサルバドル', flag: '🇸🇻' },
  HN: { code: 'HN', nameEn: 'Honduras', nameJa: 'ホンジュラス', flag: '🇭🇳' },
  NI: { code: 'NI', nameEn: 'Nicaragua', nameJa: 'ニカラグア', flag: '🇳🇮' },
  CR: { code: 'CR', nameEn: 'Costa Rica', nameJa: 'コスタリカ', flag: '🇨🇷' },
  PA: { code: 'PA', nameEn: 'Panama', nameJa: 'パナマ', flag: '🇵🇦' },

  // 南アメリカ
  BR: { code: 'BR', nameEn: 'Brazil', nameJa: 'ブラジル', flag: '🇧🇷' },
  AR: { code: 'AR', nameEn: 'Argentina', nameJa: 'アルゼンチン', flag: '🇦🇷' },
  CL: { code: 'CL', nameEn: 'Chile', nameJa: 'チリ', flag: '🇨🇱' },
  PE: { code: 'PE', nameEn: 'Peru', nameJa: 'ペルー', flag: '🇵🇪' },
  CO: { code: 'CO', nameEn: 'Colombia', nameJa: 'コロンビア', flag: '🇨🇴' },
  VE: { code: 'VE', nameEn: 'Venezuela', nameJa: 'ベネズエラ', flag: '🇻🇪' },
  EC: { code: 'EC', nameEn: 'Ecuador', nameJa: 'エクアドル', flag: '🇪🇨' },
  BO: { code: 'BO', nameEn: 'Bolivia', nameJa: 'ボリビア', flag: '🇧🇴' },
  PY: { code: 'PY', nameEn: 'Paraguay', nameJa: 'パラグアイ', flag: '🇵🇾' },
  UY: { code: 'UY', nameEn: 'Uruguay', nameJa: 'ウルグアイ', flag: '🇺🇾' },
  GY: { code: 'GY', nameEn: 'Guyana', nameJa: 'ガイアナ', flag: '🇬🇾' },
  SR: { code: 'SR', nameEn: 'Suriname', nameJa: 'スリナム', flag: '🇸🇷' },
  GF: { code: 'GF', nameEn: 'French Guiana', nameJa: '仏領ギアナ', flag: '🇬🇫' },
} as const

export const COUNTRY_CODES = Object.keys(COUNTRIES).sort() as (keyof typeof COUNTRIES)[]
