import { Messages } from '@lingui/core'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE, isAcceptedLocale,locales } from './locale'
// 静态导入所有语言文件
import enMessages from '@/translations/en/messages.json'
import csMessages from '@/translations/cs/messages.json'
import frMessages from '@/translations/fr/messages.json'
import deMessages from '@/translations/de/messages.json'
import esMessages from '@/translations/es/messages.json'
import itMessages from '@/translations/it/messages.json'
import jaMessages from '@/translations/ja/messages.json'
import koMessages from '@/translations/ko/messages.json'
import nlMessages from '@/translations/nl/messages.json'
import ptBRMessages from '@/translations/pt-BR/messages.json'
import ruMessages from '@/translations/ru/messages.json'
import ukMessages from '@/translations/uk/messages.json'
import viMessages from '@/translations/vi/messages.json'
import zhTWMessages from '@/translations/zh-TW/messages.json'
import ptMessages from '@/translations/pt/messages.json'
import daMessages from '@/translations/da/messages.json'
import elMessages from '@/translations/el/messages.json'
import noMessages from '@/translations/no/messages.json'
import fiMessages from '@/translations/fi/messages.json'
import svMessages from '@/translations/sv/messages.json'
import thMessages from '@/translations/th/messages.json'
import idMessages from '@/translations/id/messages.json'
import hiMessages from '@/translations/hi/messages.json'
import bnMessages from '@/translations/bn/messages.json'
import msMessages from '@/translations/ms/messages.json'
import trMessages from '@/translations/tr/messages.json'

// 定义一个类型来匹配实际的消息格式
type RawMessages = Record<string, {
  message: string;
  translation?: string;
  comments?: string[];
  origin?: (string | number)[][];
}>

// 创建一个函数来转换 RawMessages 为 Messages
function convertToMessages(rawMessages: RawMessages): Messages {
  return Object.entries(rawMessages.messages).reduce((acc, [key, value]) => {
   if (typeof value === 'string') {
      // 处理直接是字符串的情况（虽然在您的示例中没有出现）
      acc[key] = value;
    } else {
      // 对于其他情况，使用空字符串
      acc[key] = '';
    }
    // console.log("###转换语言文件", key, acc[key]);
    return acc;
  }, {} as Messages);
}

// 创建 messagesMap
export const messagesMap: Record<string, Messages> = {
  "en": convertToMessages(enMessages as RawMessages),
  "cs": convertToMessages(csMessages as RawMessages),
  "fr": convertToMessages(frMessages as RawMessages),
  "de": convertToMessages(deMessages as RawMessages),
  "es": convertToMessages(esMessages as RawMessages),
  "it": convertToMessages(itMessages as RawMessages),
  "ja": convertToMessages(jaMessages as RawMessages),
  "ko": convertToMessages(koMessages as RawMessages),
  "nl": convertToMessages(nlMessages as RawMessages),
  "pt-BR": convertToMessages(ptBRMessages as RawMessages),
  "ru": convertToMessages(ruMessages as RawMessages),
  "uk": convertToMessages(ukMessages as RawMessages),
  "vi": convertToMessages(viMessages as RawMessages),
  "zh-TW": convertToMessages(zhTWMessages as RawMessages),
  "pt": convertToMessages(ptMessages as RawMessages),
  "da": convertToMessages(daMessages as RawMessages),
  "el": convertToMessages(elMessages as RawMessages),
  "no": convertToMessages(noMessages as RawMessages),
  "fi": convertToMessages(fiMessages as RawMessages),
  "sv": convertToMessages(svMessages as RawMessages),
  "th": convertToMessages(thMessages as RawMessages),
  "id": convertToMessages(idMessages as RawMessages),
  "hi": convertToMessages(hiMessages as RawMessages),
  "bn": convertToMessages(bnMessages as RawMessages),
  "ms": convertToMessages(msMessages as RawMessages),
  "tr": convertToMessages(trMessages as RawMessages),
}

export const loadTranslationMessagesOnServerSide = async (
  locale: AVAILABLE_LOCALES,
): Promise<Messages> => {
  return messagesMap[locale] || messagesMap[DEFAULT_LOCALE];
}
