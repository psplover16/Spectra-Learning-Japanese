import type {
  CheckboxOption,
  ExampleRuleRow,
  LoanwordMatrixRow,
  LongVowelRuleRow,
  RomajiHeader,
  SpecialSyllableNote,
  SyllableRomajiRow
} from '@/modules/practice/types/practice';

export const checkboxGroupAOptions: CheckboxOption[] = [
  { id: 'include-hiragana', label: '題目包含：平假名' },
  { id: 'include-katakana', label: '題目包含：片假名' },
  { id: 'select-all', label: '全選／全不選' },
  { id: 'select-dakuon', label: '濁音／半濁音' },
  { id: 'sokuon', label: '促音' },
  { id: 'yoon-choon', label: '拗音／合拗音／長音符' },
  { id: 'archaic', label: '古語假名' }
];

export const hatsuonRows: ExampleRuleRow[] = [
  {
    label: 'ん / ン',
    values: ['さんぽ（sanpo）：散步', 'しんぶん（shinbun）：報紙', 'てんき（tenki）：天氣']
  }
];

export const sokuonRows: ExampleRuleRow[] = [
  {
    label: 'っ / ッ',
    values: ['がっこう（gakkou）：學校', 'きって（kitte）：郵票', 'ざっし（zasshi）：雜誌']
  }
];

export const yoonColumnHeaders: RomajiHeader[] = [
  { key: 'ya', kana: 'や / ヤ', romaji: 'ya' },
  { key: 'yu', kana: 'ゆ / ユ', romaji: 'yu' },
  { key: 'yo', kana: 'よ / ヨ', romaji: 'yo' }
];

export const seionYoonRows: SyllableRomajiRow[] = [
  {
    header: { key: 'ki', kana: 'き / キ', romaji: 'ki' },
    cells: [
      { kana: 'きゃ / キャ', romaji: 'kya' },
      { kana: 'きゅ / キュ', romaji: 'kyu' },
      { kana: 'きょ / キョ', romaji: 'kyo' }
    ]
  },
  {
    header: { key: 'shi', kana: 'し / シ', romaji: 'shi' },
    cells: [
      { kana: 'しゃ / シャ', romaji: 'sha' },
      { kana: 'しゅ / シュ', romaji: 'shu' },
      { kana: 'しょ / ショ', romaji: 'sho' }
    ]
  },
  {
    header: { key: 'chi', kana: 'ち / チ', romaji: 'chi' },
    cells: [
      { kana: 'ちゃ / チャ', romaji: 'cha' },
      { kana: 'ちゅ / チュ', romaji: 'chu' },
      { kana: 'ちょ / チョ', romaji: 'cho' }
    ]
  },
  {
    header: { key: 'ni', kana: 'に / ニ', romaji: 'ni' },
    cells: [
      { kana: 'にゃ / ニャ', romaji: 'nya' },
      { kana: 'にゅ / ニュ', romaji: 'nyu' },
      { kana: 'にょ / ニョ', romaji: 'nyo' }
    ]
  },
  {
    header: { key: 'hi', kana: 'ひ / ヒ', romaji: 'hi' },
    cells: [
      { kana: 'ひゃ / ヒャ', romaji: 'hya' },
      { kana: 'ひゅ / ヒュ', romaji: 'hyu' },
      { kana: 'ひょ / ヒョ', romaji: 'hyo' }
    ]
  },
  {
    header: { key: 'mi', kana: 'み / ミ', romaji: 'mi' },
    cells: [
      { kana: 'みゃ / ミャ', romaji: 'mya' },
      { kana: 'みゅ / ミュ', romaji: 'myu' },
      { kana: 'みょ / ミョ', romaji: 'myo' }
    ]
  },
  {
    header: { key: 'ri', kana: 'り / リ', romaji: 'ri' },
    cells: [
      { kana: 'りゃ / リャ', romaji: 'rya' },
      { kana: 'りゅ / リュ', romaji: 'ryu' },
      { kana: 'りょ / リョ', romaji: 'ryo' }
    ]
  }
];

export const dakuonYoonRows: SyllableRomajiRow[] = [
  {
    header: { key: 'gi', kana: 'ぎ / ギ', romaji: 'gi' },
    cells: [
      { kana: 'ぎゃ / ギャ', romaji: 'gya' },
      { kana: 'ぎゅ / ギュ', romaji: 'gyu' },
      { kana: 'ぎょ / ギョ', romaji: 'gyo' }
    ]
  },
  {
    header: { key: 'ji', kana: 'じ / ジ', romaji: 'ji' },
    cells: [
      { kana: 'じゃ / ジャ', romaji: 'ja' },
      { kana: 'じゅ / ジュ', romaji: 'ju' },
      { kana: 'じょ / ジョ', romaji: 'jo' }
    ]
  },
  {
    header: { key: 'bi', kana: 'び / ビ', romaji: 'bi' },
    cells: [
      { kana: 'びゃ / ビャ', romaji: 'bya' },
      { kana: 'びゅ / ビュ', romaji: 'byu' },
      { kana: 'びょ / ビョ', romaji: 'byo' }
    ]
  },
  {
    header: { key: 'pi', kana: 'ぴ / ピ', romaji: 'pi' },
    cells: [
      { kana: 'ぴゃ / ピャ', romaji: 'pya' },
      { kana: 'ぴゅ / ピュ', romaji: 'pyu' },
      { kana: 'ぴょ / ピョ', romaji: 'pyo' }
    ]
  }
];

export const loanwordColumnHeaders: RomajiHeader[] = [
  { key: 'a', kana: 'ア', romaji: 'a' },
  { key: 'i', kana: 'イ', romaji: 'i' },
  { key: 'u', kana: 'ウ', romaji: 'u' },
  { key: 'e', kana: 'エ', romaji: 'e' },
  { key: 'o', kana: 'オ', romaji: 'o' }
];

export const loanwordRows: LoanwordMatrixRow[] = [
  {
    header: { key: 'f', kana: 'フ系', romaji: 'f' },
    cells: [
      { kana: 'ファ', romaji: 'fa' },
      { kana: 'フィ', romaji: 'fi' },
      { kana: 'フ', romaji: 'fu' },
      { kana: 'フェ', romaji: 'fe' },
      { kana: 'フォ', romaji: 'fo' }
    ]
  },
  {
    header: { key: 'v', kana: 'ヴ系', romaji: 'v' },
    cells: [
      { kana: 'ヴァ', romaji: 'va' },
      { kana: 'ヴィ', romaji: 'vi' },
      { kana: 'ヴ', romaji: 'vu' },
      { kana: 'ヴェ', romaji: 've' },
      { kana: 'ヴォ', romaji: 'vo' }
    ]
  },
  {
    header: { key: 'ty', kana: 'ティ系', romaji: 'ty' },
    cells: [
      { kana: 'テャ', romaji: 'tya' },
      { kana: 'ティ', romaji: 'ti' },
      { kana: 'テュ', romaji: 'tyu' },
      { kana: 'テェ', romaji: 'tye' },
      { kana: 'テョ', romaji: 'tyo' }
    ]
  },
  {
    header: { key: 'dy', kana: 'ディ系', romaji: 'dy' },
    cells: [
      { kana: 'デャ', romaji: 'dya' },
      { kana: 'ディ', romaji: 'di' },
      { kana: 'デュ', romaji: 'dyu' },
      { kana: 'デェ', romaji: 'dye' },
      { kana: 'デョ', romaji: 'dyo' }
    ]
  },
  {
    header: { key: 't', kana: 'ト系', romaji: 't' },
    cells: [
      { kana: '-', available: false },
      { kana: 'ティ', romaji: 'ti' },
      { kana: 'トゥ', romaji: 'tu' },
      { kana: '-', available: false },
      { kana: '-', available: false }
    ]
  },
  {
    header: { key: 'sh', kana: 'シ系', romaji: 'sh' },
    cells: [
      { kana: 'シャ', romaji: 'sha' },
      { kana: 'シィ', romaji: 'shi' },
      { kana: 'シュ', romaji: 'shu' },
      { kana: 'シェ', romaji: 'she' },
      { kana: 'ショ', romaji: 'sho' }
    ]
  },
  {
    header: { key: 'j', kana: 'ジ系', romaji: 'j' },
    cells: [
      { kana: 'ジャ', romaji: 'ja' },
      { kana: 'ジィ', romaji: 'ji' },
      { kana: 'ジュ', romaji: 'ju' },
      { kana: 'ジェ', romaji: 'je' },
      { kana: 'ジョ', romaji: 'jo' }
    ]
  },
  {
    header: { key: 'ch', kana: 'チェ系', romaji: 'ch' },
    cells: [
      { kana: 'チャ', romaji: 'cha' },
      { kana: 'チィ', romaji: 'chi' },
      { kana: 'チュ', romaji: 'chu' },
      { kana: 'チェ', romaji: 'che' },
      { kana: 'チョ', romaji: 'cho' }
    ]
  },
  {
    header: { key: 'ts', kana: 'ツ系', romaji: 'ts' },
    cells: [
      { kana: 'ツァ', romaji: 'tsa' },
      { kana: 'ツィ', romaji: 'tsi' },
      { kana: 'ツ', romaji: 'tsu' },
      { kana: 'ツェ', romaji: 'tse' },
      { kana: 'ツォ', romaji: 'tso' }
    ]
  },
  {
    header: { key: 'w', kana: 'ウ系', romaji: 'w' },
    cells: [
      { kana: 'ワ', romaji: 'wa' },
      { kana: 'ウィ', romaji: 'wi' },
      { kana: 'ウ', romaji: 'wu' },
      { kana: 'ウェ', romaji: 'we' },
      { kana: 'ウォ', romaji: 'wo' }
    ]
  }
];

export const longVowelRows: LongVowelRuleRow[] = [
  {
    id: 'loanword-rule',
    kind: 'rule',
    groupTitle: '外來語通常使用長音符ー',
    ruleText: '片假名借詞常用長音符拉長母音，閱讀時可直接把前一個母音延長。'
  },
  {
    id: 'loanword-example-1',
    kind: 'example',
    groupTitle: '外來語通常使用長音符ー',
    example: { kana: 'ケーキ', romaji: 'keki', translation: '蛋糕' }
  },
  {
    id: 'loanword-example-2',
    kind: 'example',
    groupTitle: '外來語通常使用長音符ー',
    example: { kana: 'スーパー', romaji: 'supa', translation: '超市' }
  },
  {
    id: 'loanword-example-3',
    kind: 'example',
    groupTitle: '外來語通常使用長音符ー',
    example: { kana: 'コーヒー', romaji: 'kohi', translation: '咖啡' }
  },
  {
    id: 'ei-rule',
    kind: 'rule',
    groupTitle: 'え段假名 + い',
    ruleText: '很多字會以 え段假名接 い 來表示長音，讀音通常把 e 音拉長。'
  },
  {
    id: 'ei-example-1',
    kind: 'example',
    groupTitle: 'え段假名 + い',
    example: { kana: 'せんせい', romaji: 'sensei', translation: '老師' }
  },
  {
    id: 'ei-example-2',
    kind: 'example',
    groupTitle: 'え段假名 + い',
    example: { kana: 'えいが', romaji: 'eiga', translation: '電影' }
  },
  {
    id: 'ei-example-3',
    kind: 'example',
    groupTitle: 'え段假名 + い',
    example: { kana: 'とけい', romaji: 'tokei', translation: '手錶' }
  },
  {
    id: 'ou-rule',
    kind: 'rule',
    groupTitle: 'お段假名 + う',
    ruleText: '很多字會以 お段假名接 う 表示長音，讀音通常把 o 音拉長。'
  },
  {
    id: 'ou-example-1',
    kind: 'example',
    groupTitle: 'お段假名 + う',
    example: { kana: 'とうきょう', romaji: 'toukyou', translation: '東京' }
  },
  {
    id: 'ou-example-2',
    kind: 'example',
    groupTitle: 'お段假名 + う',
    example: { kana: 'がっこう', romaji: 'gakkou', translation: '學校' }
  },
  {
    id: 'ou-example-3',
    kind: 'example',
    groupTitle: 'お段假名 + う',
    example: { kana: 'どうぶつ', romaji: 'doubutsu', translation: '動物' }
  },
  {
    id: 'same-vowel-rule',
    kind: 'rule',
    groupTitle: '同一母音連續',
    ruleText: '有些字直接讓同一母音連續出現，閱讀時也要把母音自然拉長。'
  },
  {
    id: 'same-vowel-example-1',
    kind: 'example',
    groupTitle: '同一母音連續',
    example: { kana: 'おおきい', romaji: 'ookii', translation: '大的' }
  },
  {
    id: 'same-vowel-example-2',
    kind: 'example',
    groupTitle: '同一母音連續',
    example: { kana: 'にいさん', romaji: 'niisan', translation: '哥哥' }
  },
  {
    id: 'same-vowel-example-3',
    kind: 'example',
    groupTitle: '同一母音連續',
    example: { kana: 'ちいさい', romaji: 'chiisai', translation: '小的' }
  },
  {
    id: 'au-rule',
    kind: 'rule',
    groupTitle: 'あ段 + う 不一定屬於規則長音',
    ruleText: '看到 a 段接 う 時，不要直接當成長音；有些詞其實是兩個音節或歷史假名遣。'
  },
  {
    id: 'au-example-1',
    kind: 'example',
    groupTitle: 'あ段 + う 不一定屬於規則長音',
    example: { kana: 'あう', romaji: 'au', translation: '相遇' }
  },
  {
    id: 'au-example-2',
    kind: 'example',
    groupTitle: 'あ段 + う 不一定屬於規則長音',
    example: { kana: 'うたう', romaji: 'utau', translation: '歌唱' }
  },
  {
    id: 'au-example-3',
    kind: 'example',
    groupTitle: 'あ段 + う 不一定屬於規則長音',
    example: { kana: 'かう', romaji: 'kau', translation: '買（歷史假名遣）' }
  }
];

export const specialSyllableNotes: SpecialSyllableNote[] = [
  {
    kana: 'ゔ / ヴ',
    romaji: 'vu',
    description: '主要出現在外來語與近代記音，日常詞彙中不常見。'
  },
  {
    kana: 'を / ヲ',
    romaji: 'wo',
    description: '現代日語多作助詞使用，實際發音常接近 o。'
  },
  {
    kana: 'ぢ / ヂ、づ / ヅ',
    romaji: 'di / du',
    description: '常見於連濁或固定詞，現代拼寫與讀音需搭配單字一起記。'
  }
];
