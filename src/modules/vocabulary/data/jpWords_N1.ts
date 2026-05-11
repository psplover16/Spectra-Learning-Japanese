import type {
  RawVocabularyEntry,
  VocabularyEntryTuple
} from '@/modules/vocabulary/types/vocabulary';
import { toEntry } from '@/modules/vocabulary/data/vocabularyEntryMapper';

const STAGE = 'N1' as const;

const jpWords_N1_raw: ReadonlyArray<VocabularyEntryTuple> = [
  ["がいねんか", "ga-i-nen-ka", "概念化", "概念化"],
  ["ちゅうしょうか", "chu-u-sho-u-ka", "抽象化", "抽象化"],
  ["ぐたいか", "gu-ta-i-ka", "具体化", "具體化"],
  ["きはん", "ki-han", "規範", "規範"],
  ["だとう", "da-to-u", "妥当", "妥當"],
  ["ひはん", "hi-han", "批判", "批判"],
  ["かいしゃく", "ka-i-sha-ku", "解釈", "詮釋"],
  ["さいていぎ", "sa-i-te-i-gi", "再定義", "重新定義"],
  ["こうちく", "ko-u-chiku", "構築", "建構"],
  ["かいはつ", "ka-i-ha-tsu", "開発", "開發"],
  ["せいとうか", "se-i-to-u-ka", "正当化", "正當化"],
  ["ごうりか", "go-u-ri-ka", "合理化", "合理化"],
  ["しゅたいせい", "shu-ta-i-se-i", "主体性", "主體性"],
  ["きゃっかんせい", "kyak-kan-se-i", "客観性", "客觀性"],
  ["しゅかんせい", "shu-kan-se-i", "主観性", "主觀性"],
  ["えんえき", "en-e-ki", "演繹", "演繹"],
  ["きのうろん", "ki-no-u-ron", "機能論", "功能論"],
  ["こうぞうろん", "ko-u-zo-u-ron", "構造論", "結構論"],
  ["けいけんろん", "ke-i-ken-ron", "経験論", "經驗論"],
  ["りせいろん", "ri-se-i-ron", "理性論", "理性論"],
  ["ひかくろん", "hi-ka-ku-ron", "比較論", "比較理論"],
  ["てつがく", "te-tsu-ga-ku", "哲学", "哲學"],
  ["りろん", "ri-ron", "理論", "理論"],
  ["じっしょう", "jik-sho-u", "実証", "實證"],
  ["しんり", "shin-ri", "真理", "真理"],
  ["ぎゃくせつ", "gyaku-se-tsu", "逆説", "悖論"],
  ["むじゅん", "mu-jun", "矛盾", "矛盾"],
  ["こうぞうか", "ko-u-zo-u-ka", "構造化", "結構化"],
  ["さいへんせい", "sa-i-hen-se-i", "再編成", "重新編組"],
  ["きてい", "ki-te-i", "規定", "規定"],
  ["がいねんてき", "ga-i-nen-te-ki", "概念的", "概念性的（な形容詞）"],
];

const jpWords_N1: RawVocabularyEntry[] = jpWords_N1_raw.map((tuple) => toEntry(tuple, STAGE));

export default jpWords_N1;
