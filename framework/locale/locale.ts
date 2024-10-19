import localeNames from './localeConfig'
import { serverSideTranslations } from '@/framework/locale/serverSideTranslations'
import { globalI18n } from '@/framework/locale/i18n'

export enum AVAILABLE_LOCALES {
  en = 'en', // 英语
  cs = 'cs', // 捷克语
  fr = 'fr', // 法语
  de = 'de', // 德语
  es = 'es', // 西班牙语
  it = 'it', // 意大利语
  ja = 'ja', // 日语
  ko = 'ko', // 韩语
  nl = 'nl', // 荷兰语
  ptBR = 'pt-BR', // 巴西葡萄牙语
  ru = 'ru', // 俄语
  uk = 'uk', // 乌克兰语
  vi = 'vi', // 越南语
  zhTW = 'zh-TW', // 繁体中文
  pt = 'pt', // 葡萄牙语
  da = 'da', // 丹麦语
  el = 'el', // 希腊语
  no = 'no', // 挪威语
  fi = 'fi', // 芬兰语
  sv = 'sv', // 瑞典语
  th = 'th', // 泰语
  id = 'id', // 印度尼西亚语
  hi = 'hi', // 印地语
  bn = 'bn', // 孟加拉语
  ms = 'ms', // 马来语
  tr = 'tr', // 土耳其语
}


export const DEFAULT_LOCALE = AVAILABLE_LOCALES.en
export const locales = Object.keys(localeNames)

export function isAcceptedLocale(locale: unknown): locale is AVAILABLE_LOCALES {
  if (typeof locale !== 'string') {
    return false
  }

  return locales.includes(locale)
}

export function selectFirstAcceptedLocale(
  ...mayBeLocales: Array<unknown>
): AVAILABLE_LOCALES {
  for (const mayBeLocale of mayBeLocales) {
    if (isAcceptedLocale(mayBeLocale)) {
      return mayBeLocale
    }
  }

  return DEFAULT_LOCALE
}

export function metadataLanguages(subPath:string){
  const langKeys = Object.values(AVAILABLE_LOCALES)
  const path = process.env.UE_WEB_API_URL
  const languages: any = {}
  langKeys.forEach((lang) => {
    languages[lang] = `${path}/${lang}${subPath}`
  })
  return languages
}


export async function activateLocale(lang: AVAILABLE_LOCALES) {
  const i18n = await serverSideTranslations(
    lang
  )
  const locale = i18n._i18nPropsNamespace.initialLocale
  const messages = i18n._i18nPropsNamespace.initialMessages
  globalI18n.loadAndActivate({ locale, messages })
  globalI18n.activate(lang)
}
