import type {
  GodanTableSpec,
  GrammarSectionSpec,
  InflectionTableSpec,
  PosConversionGroup,
  RuleListItem,
  SystemDifferenceRow
} from '@/modules/grammar/types/changeRules';

export const systemDifferenceRows: SystemDifferenceRow[] = [
  {
    name: '基本語序',
    cn: { content: '主詞＋動詞＋受詞（SVO）', examples: ['我吃蘋果'] },
    jp: { content: '主詞＋受詞＋動詞（SOV）', examples: ['私はリンゴを食べます'] }
  },
  {
    name: '名詞動詞化',
    cn: { content: '名詞可以直接當動詞使用', examples: ['我上班', '我休息'] },
    jp: { content: '名詞不能直接當動詞，需搭配する或固定動詞', examples: ['仕事をします', '休みます'] }
  },
  {
    name: '形容詞分類',
    cn: { content: '形容詞不分類，直接修飾名詞', examples: ['好吃的食物', '漂亮的人'] },
    jp: { content: '分い形容詞與な形容詞；な形容詞修飾名詞需加「な」', examples: ['おいしい料理', 'きれいな人'] }
  },
  {
    name: '助詞系統',
    cn: { content: '幾乎沒有助詞概念，靠語序與語意判斷', examples: ['我去學校'] },
    jp: { content: '使用助詞標記主詞、受詞、地點等', examples: ['私は学校に行きます'] }
  },
  {
    name: '動詞變形',
    cn: { content: '動詞幾乎不變形，靠時間詞判斷時態', examples: ['昨天吃', '明天吃'] },
    jp: { content: '動詞一定變形表示時態與敬體', examples: ['食べました', '食べます'] }
  },
  {
    name: '否定形式',
    cn: { content: '在前面加「不」表示否定', examples: ['不吃', '不好'] },
    jp: { content: '改變語尾表示否定', examples: ['食べない', '高くない'] }
  },
  {
    name: '主詞使用',
    cn: { content: '主詞通常會明確說出', examples: ['我去吃飯'] },
    jp: { content: '主詞常省略，由語境判斷', examples: ['食べます'] }
  },
  {
    name: '單複數',
    cn: { content: '通常不特別標示單複數', examples: ['學生', '書'] },
    jp: { content: '通常不標示複數，必要時加「たち」', examples: ['学生たち'] }
  },
  {
    name: '時態表達',
    cn: { content: '靠時間詞表達時態', examples: ['昨天去', '明天去'] },
    jp: { content: '透過動詞變形表達時態', examples: ['行きました', '行きます'] }
  },
  {
    name: '敬語系統',
    cn: { content: '敬語變化少，主要改變稱呼', examples: ['你', '您'] },
    jp: { content: '動詞本身會依敬語層級改變', examples: ['行きます', 'いらっしゃいます'] }
  }
];

export const conjugationMeaningRules: RuleListItem[] = [
  { rules: '未然形：「還沒發生」的形態，常用於否定、被動、使役等表達' },
  { rules: '連用形：「連接用」的形態，常用於接續助動詞、形容詞等，表達禮貌、完成、進行等' },
  { rules: '辭書形：字典查得到的原形態，常用於表示習慣、未來等、接普通文章、子句結尾(也是終止型的現代名稱)' },
  { rules: '命令形：命令語氣的形態，常用於給予指示、命令等' },
  { rules: '意向形：表示「打算」「讓我們～吧」的形態，常用於表達意圖、建議等' },
  { rules: '假定形：表示「如果」' },
  { rules: '連体形：用於修飾名詞，表示動作或狀態的特徵或屬性。現代日文：連體形 = 辞書形' },
  { rules: '終止形：用於句子結尾，表示陳述或斷定。現代日文：終止形 = 辞書形' },
  { rules: '普通型：辭書形 ＋ 否定 ＋ 過去 ＋ 過去否定' }
];

export const verbClassificationRules: RuleListItem[] = [
  { rules: '非る結尾，一定是 五段動詞' },
  {
    rules: '固定的不規則動詞，只有兩個',
    examples: [
      { verb: 'する', meaning: '做' },
      { verb: '来(く)る', meaning: '來' }
    ]
  },
  { rules: 'る結尾的看 る 前一個音，如果前一個音是母音1/3/5 (あ/う/お) 屬於五段動詞' },
  {
    rules: '不在上述規則的五段動詞',
    examples: [
      { verb: '帰る（かえる）', meaning: '回去／回家' },
      { verb: '入る（はいる）', meaning: '進入' },
      { verb: '走る（はしる）', meaning: '跑' },
      { verb: '切る（きる）', meaning: '切' },
      { verb: '知る（しる）', meaning: '知道' }
    ]
  },
  { rules: '其他則是一段動詞' }
];

export const godanTableSpec: GodanTableSpec = {
  title: '五段動詞表(詞尾母音變化)',
  subtitle: '音便 (詞尾接尾一起改變)',
  verb: '飲む',
  columns: ['形態', '詞幹\n範例', '詞尾', '接尾', '含意'],
  mainRows: [
    {
      base: '未然形',
      baseEnding: 'ま',
      suffixAndMeaning: [
        { suffix: 'ない', meaning: '否定' },
        { suffix: 'れる', meaning: '被動' },
        { suffix: 'せる', meaning: '使役' }
      ]
    },
    {
      base: '連用形',
      baseEnding: 'み',
      suffixAndMeaning: [
        { suffix: 'ます', meaning: '禮貌' },
        { suffix: 'て', meaning: '句子並列與接續' },
        { suffix: 'た', meaning: '表達動作行為完結' }
      ]
    },
    {
      base: '辭書形',
      baseEnding: 'む',
      suffixAndMeaning: [{ suffix: '', meaning: '習慣/未來' }]
    },
    {
      base: '命令形',
      baseEnding: 'め',
      suffixAndMeaning: [{ suffix: '', meaning: '命令' }]
    },
    {
      base: '意向形',
      baseEnding: 'も',
      suffixAndMeaning: [{ suffix: 'う', meaning: '勸誘' }]
    }
  ],
  footerRows: [
    {
      base: '派生可能',
      baseEnding: 'め',
      suffixAndMeaning: [{ suffix: 'る', meaning: '' }]
    },
    {
      base: '派生被動',
      baseEnding: 'ま',
      suffixAndMeaning: [{ suffix: 'れる', meaning: '' }]
    },
    {
      base: '派生使役',
      baseEnding: 'ま',
      suffixAndMeaning: [{ suffix: 'せる', meaning: '' }]
    },
    {
      base: '假定形',
      baseEnding: 'め',
      suffixAndMeaning: [{ suffix: 'ば', meaning: '' }]
    }
  ],
  soundChangeColumns: ['', '辭書形', '連用(て)', '連用(た)'],
  soundChangeRows: [
    { base: 'い音便', jisho: [['く'], ['ぐ']], renyouTe: ['いて', 'いで'], renyouTa: ['いた', 'いだ'] },
    { base: '促音便', jisho: [['行く'], ['つ', 'る', 'う']], renyouTe: ['行って', 'って'], renyouTa: ['行った', 'った'] },
    { base: '撥音便', jisho: [['む', 'ぶ', 'ぬ']], renyouTe: ['んで'], renyouTa: ['んだ'] }
  ],
  soundChangeNotes: [
    '1.書く→書き→書い(い音便)→書いて/書いた',
    '2.買う→買い→買っ(促音便)→買って/買った',
    '3.飲む→飲み→飲ん(撥音便)→飲んで/飲んだ'
  ],
  soundChangeFooter: '以「す」做辭書型詞尾的五段動詞，不發生音便。ex.探す'
};

export const inflectionTableSpecs: Record<string, InflectionTableSpec> = {
  ichidan: {
    title: '一段動詞 (辭書型 結尾必定是 る)',
    verb: '見',
    columns: ['形態', '詞幹', '詞尾', '接尾', '含意'],
    mainRows: [
      { base: '未然形', baseEnding: '', suffixAndMeaning: [{ suffix: 'ない', meaning: '否定' }, { suffix: 'られる', meaning: '被動' }, { suffix: 'させる', meaning: '使役' }] },
      { base: '連用形', baseEnding: '', suffixAndMeaning: [{ suffix: 'ます', meaning: '禮貌' }, { suffix: 'て', meaning: '句子並列與接續' }, { suffix: 'た', meaning: '表達動作行為完結' }] },
      { base: '辭書形', baseEnding: 'る', suffixAndMeaning: [{ suffix: '', meaning: '習慣/未來' }] },
      { base: '命令形', baseEnding: 'ろ', suffixAndMeaning: [{ suffix: '', meaning: '命令' }] },
      { base: '意向形', baseEnding: 'よ', suffixAndMeaning: [{ suffix: 'う', meaning: '勸誘' }] }
    ],
    footerRows: [
      { base: '派生可能', baseEnding: 'ら', suffixAndMeaning: [{ suffix: 'れる', meaning: '' }] },
      { base: '派生被動', baseEnding: 'ら', suffixAndMeaning: [{ suffix: 'れる', meaning: '與未然形同' }] },
      { base: '派生使役', baseEnding: 'さ', suffixAndMeaning: [{ suffix: 'せる', meaning: '與未然形同' }] },
      { base: '假定形', baseEnding: 'れ', suffixAndMeaning: [{ suffix: 'ば', meaning: '' }] }
    ]
  },
  sahen: {
    title: 'サ變動詞 (する動詞為結尾的動詞)',
    verb: '散歩',
    columns: ['形態', '詞幹', '詞尾', '接尾', '含意'],
    mainRows: [
      { base: '未然形', baseEnding: 'し', suffixAndMeaning: [{ suffix: 'ない', meaning: '否定' }] },
      { base: '連用形', baseEnding: 'し', suffixAndMeaning: [{ suffix: 'ます', meaning: '禮貌' }, { suffix: 'て', meaning: '句子並列與接續' }, { suffix: 'た', meaning: '表達動作行為完結' }] },
      { base: '辭書形', baseEnding: 'する', suffixAndMeaning: [{ suffix: '', meaning: '習慣/未來' }] },
      { base: '命令形', baseEnding: 'しろ', suffixAndMeaning: [{ suffix: '', meaning: '命令' }] },
      { base: '意向形', baseEnding: 'しよ', suffixAndMeaning: [{ suffix: 'う', meaning: '勸誘' }] },
      { base: '派生可能', baseEnding: '', suffixAndMeaning: [{ suffix: 'できる', meaning: '' }] },
      { base: '派生被動', baseEnding: 'さ', suffixAndMeaning: [{ suffix: 'れる', meaning: '' }] },
      { base: '派生使役', baseEnding: 'さ', suffixAndMeaning: [{ suffix: 'せる', meaning: '' }] },
      { base: '假定形', baseEnding: 'すれ', suffixAndMeaning: [{ suffix: 'ば', meaning: '' }] }
    ],
    exampleGroups: [
      {
        id: 'sahen-sanpo-examples',
        title: '散歩する的常用否定與過去例句',
        examples: [
          {
            id: 'sahen-sanpo-shimasen',
            form: 'しません',
            japanese: '雨の日は散歩しません。',
            reading: 'あめ の ひ は さんぽ しません。',
            translation: '下雨天不散步。',
            note: 'ます形否定，語氣禮貌。'
          },
          {
            id: 'sahen-sanpo-shimasendeshita',
            form: 'しませんでした',
            japanese: '昨日は忙しかったので、散歩しませんでした。',
            reading: 'きのう は いそがしかった ので、さんぽ しませんでした。',
            translation: '昨天因為很忙，所以沒有散步。',
            note: '敬體過去否定。'
          },
          {
            id: 'sahen-sanpo-shinai',
            form: 'しない',
            japanese: '今日は散歩しない。',
            reading: 'きょう は さんぽ しない。',
            translation: '今天不散步。',
            note: '普通形現在否定。'
          },
          {
            id: 'sahen-sanpo-shita',
            form: 'した',
            japanese: '今朝、公園で散歩した。',
            reading: 'けさ、こうえん で さんぽ した。',
            translation: '今天早上在公園散步了。',
            note: '普通形過去肯定。'
          }
        ]
      }
    ]
  },
  kahen: {
    title: 'カ變動詞 (只有来る)',
    subtitle: '漢字發音會變動，標註在詞尾',
    verb: '来',
    columns: ['形態', '詞幹', '詞尾', '接尾', '含意'],
    mainRows: [
      { base: '未然形', baseEnding: 'こ', suffixAndMeaning: [{ suffix: 'ない', meaning: '否定' }] },
      { base: '連用形', baseEnding: 'き', suffixAndMeaning: [{ suffix: 'ます', meaning: '禮貌' }, { suffix: 'て', meaning: '句子並列與接續' }, { suffix: 'た', meaning: '表達動作行為完結' }] },
      { base: '辭書形', baseEnding: 'くる', suffixAndMeaning: [{ suffix: '', meaning: '習慣/未來' }] },
      { base: '命令形', baseEnding: 'こい', suffixAndMeaning: [{ suffix: '', meaning: '命令' }] },
      { base: '意向形', baseEnding: 'こよ', suffixAndMeaning: [{ suffix: 'う', meaning: '勸誘' }] },
      { base: '派生可能', baseEnding: 'こ', suffixAndMeaning: [{ suffix: 'られる', meaning: '' }] },
      { base: '派生被動', baseEnding: 'こ', suffixAndMeaning: [{ suffix: 'られる', meaning: '' }] },
      { base: '派生使役', baseEnding: 'こ', suffixAndMeaning: [{ suffix: 'させる', meaning: '' }] },
      { base: '假定形', baseEnding: 'くれ', suffixAndMeaning: [{ suffix: 'ば', meaning: '' }] }
    ]
  },
  iAdjective: {
    title: 'い形容詞',
    verb: '優し',
    columns: ['形態', '詞幹', '詞尾', '接尾', '含意'],
    mainRows: [
      { base: '未然形', baseEnding: 'く', suffixAndMeaning: [{ suffix: 'ない', meaning: '否定' }] },
      { base: '連用(表)', baseEnding: 'く', suffixAndMeaning: [{ suffix: 'て', meaning: '句子並列與接續' }] },
      { base: '連用(裏)', baseEnding: 'かっ', suffixAndMeaning: [{ suffix: 'た', meaning: '描述過去的人事物' }] },
      { base: '辭書形', baseEnding: 'い', suffixAndMeaning: [{ suffix: '', meaning: '描述現在的人事物' }] },
      { base: '假定形', baseEnding: 'けれ', suffixAndMeaning: [{ suffix: 'ば', meaning: '' }] }
    ]
  },
  naiAdjective: {
    title: 'ない形容詞',
    prefix: '優しく',
    verb: 'な',
    columns: ['形態', '前置詞', '詞幹', '詞尾', '接尾', '含意'],
    mainRows: [
      { base: '未然形', baseEnding: 'く', suffixAndMeaning: [{ suffix: 'ない', meaning: '雙重否定' }] },
      { base: '連用(表)', baseEnding: 'く', suffixAndMeaning: [{ suffix: 'て', meaning: '否定前置詞後接續' }] },
      { base: '連用(裏)', baseEnding: 'かっ', suffixAndMeaning: [{ suffix: 'た', meaning: '過去否定' }] },
      { base: '辭書形', baseEnding: 'い', suffixAndMeaning: [{ suffix: '', meaning: '否定前置詞' }] },
      { base: '假定形', baseEnding: 'けれ', suffixAndMeaning: [{ suffix: 'ば', meaning: '否定條件' }] }
    ]
  },
  daAuxiliary: {
    title: 'だ助動詞',
    subtitle: '名詞＋だ (ex.彼は学生だ)\nな形容詞＋だ (ex.静かな場所だ)',
    prefix: '好き',
    columns: ['形態', '前置詞', '詞尾', '接尾', '含意'],
    mainRows: [
      { base: '未然形', baseEnding: 'では', suffixAndMeaning: [{ suffix: 'ない', meaning: '否定' }] },
      { base: '連用(表)', baseEnding: 'で', suffixAndMeaning: [{ suffix: '', meaning: '用於接續' }] },
      { base: '連用(裏)', baseEnding: 'だっ', suffixAndMeaning: [{ suffix: 'た', meaning: '描述過去的人事物' }] },
      { base: '辭書形', baseEnding: 'だ', suffixAndMeaning: [{ suffix: '', meaning: '描述現在時態的人事物' }] },
      { base: '連体形', baseEnding: 'な', suffixAndMeaning: [{ suffix: '被修飾\n的名詞', meaning: '修飾名詞\nex.好きな人' }] },
      { base: '假定形', baseEnding: 'なら', suffixAndMeaning: [{ suffix: 'ば', meaning: '用於條件句' }] }
    ]
  }
};

export const posConversionSections: PosConversionGroup[] = [
  {
    title: '互轉有兩個層級',
    contents: [
      {
        subTitle: '語法性的轉換(規則固定、幾乎都能套)',
        subContents: ['屬於文法結構：只要符合句型就成立', '例如：動詞名詞化(～こと／～の)、形容詞副詞化(～く／～に)等'],
        examples: ['行くこと', '行くの', '早く行く', '静かに話す']
      },
      {
        subTitle: '詞彙性的派生(有規律但不保證每個詞都常用)',
        subContents: ['屬於詞彙慣用：形式上可推測，但『是否自然／是否常用』要看字典與慣用法'],
        examples: ['働く→働き(常用)', '食べる→食べ(通常不作一般名詞用)']
      }
    ]
  },
  {
    title: '動詞 → 名詞(規則固定)',
    contents: [
      {
        subTitle: 'V(普通形)＋こと：把『動作／事情』名詞化',
        subContents: ['幾乎所有動詞都可用(規則非常穩)', '語感：偏抽象概念、習慣、事情、規則、能力等'],
        examples: ['日本へ行くこと', '毎日運動すること', '働くことは大切だ']
      },
      {
        subTitle: 'V(普通形)＋の：名詞化(口語更常見)',
        subContents: ['規則穩定，常用於口語或較直接的表達', '語感：更像『那件事／那個行為』'],
        examples: ['早く寝るのが好き', '料理するのは楽しい', '見るのをやめた']
      },
      {
        subTitle: 'V連用形(＝ます形去ます)→ 名詞(⚠️詞彙派生：常見但非必然)',
        subContents: ['形式：把動詞的連用形當作名詞使用(常見於五段動詞)', '是否能『單獨當名詞』與『常用程度』屬詞彙慣用(不是所有動詞都自然)', '最穩的名詞化仍是「V＋こと／の」；連用形名詞化屬語言習慣'],
        examples: ['働く→働き(工作／作用)', '休む→休み(休假)', '動く→動き(動作／動向)', '話す→話し(多見於複合：話し合い)']
      },
      {
        subTitle: 'V連用形＋方(かた)：做法／方式',
        subContents: ['規則固定、非常常用', '語意：『怎麼做』、『使用方法』、『走法』等'],
        examples: ['読み方', '使い方', '行き方', '作り方']
      },
      {
        subTitle: 'V＋ところ：表示『正要／正在／剛做完』的時間點(形式名詞)',
        subContents: ['規則固定(但屬句型用法)', '三種常見：V辞書形＋ところだ(正要)、Vている＋ところだ(正在)、Vた＋ところだ(剛做完)', 'Vたところだ帶有『就在剛剛』的感覺'],
        examples: ['今から出かけるところだ', 'いま食べているところだ', '帰ったところだ']
      }
    ]
  },
  {
    title: '名詞 → 動詞(規則固定 / 部分詞彙)',
    contents: [
      {
        subTitle: '名詞＋する：サ変動詞(規則固定、最重要)',
        subContents: ['名詞＋する → 動詞(規則穩、常見)', '學習上：看到『〜する』幾乎可直接判定為動詞(サ変)'],
        examples: ['勉強する', '電話する', '運動する', '確認する', '説明する']
      },
      {
        subTitle: '名詞/外來語＋る：口語造語 → 五段動詞(⚠️詞彙派生)',
        subContents: ['現象正確，但不是文法規則：不能看見名詞就亂加『る』', '多見於口語、新語、網路用語，是否自然要看慣用'],
        examples: ['サボる', 'ググる', 'メモる', 'パクる']
      }
    ]
  },
  {
    title: 'い形容詞 ↔ 副詞 / 名詞 / 動詞化',
    contents: [
      {
        subTitle: 'い形容詞 → 副詞：〜く(規則固定)',
        subContents: ['語法規則：去い＋く', '用途：修飾動詞／表變化(〜くなる／〜くする)等'],
        examples: ['早い→早く行く', '高い→高くなる', 'おいしい→おいしく食べる']
      },
      {
        subTitle: 'い形容詞 → 名詞：〜さ(高生產力，幾乎可用)',
        subContents: ['語意：程度、性質的『程度量』', '非常常用(但仍屬派生後綴)'],
        examples: ['高い→高さ', '強い→強さ', 'うれしい→うれしさ']
      },
      {
        subTitle: 'い形容詞 → 名詞：〜み(⚠️有限定：常見於感受/味道/深度等)',
        subContents: ['不是每個い形容詞都能自然用〜み', '常見語意：味道、手感、深度、體感的『那種感覺』', '熟讀常見詞即可，不建議亂套用'],
        examples: ['苦い→苦み', '甘い→甘み', '深い→深み']
      },
      {
        subTitle: 'い形容詞 → 動詞：〜がる(⚠️限定：情感/感覺/欲求)',
        subContents: ['主要用在『第三者看起來…／表現出…』的樣子', '限定類型：欲求(ほしい)、情緒(うれしい)、恐懼(こわい)等', '不是所有い形容詞都能＋がる'],
        examples: ['ほしい→ほしがる', 'うれしい→うれしがる', 'こわい→こわがる']
      }
    ]
  },
  {
    title: 'な形容詞 ↔ 副詞 / 名詞化',
    contents: [
      {
        subTitle: 'な形容詞 → 副詞：〜に(規則固定)',
        subContents: ['語法規則：な形容詞＋に', '用途：修飾動詞(怎麼做)'],
        examples: ['静かだ→静かに話す', '便利だ→便利に使う', '上手だ→上手にできる']
      },
      {
        subTitle: 'な形容詞 → 名詞：〜さ(常見)',
        subContents: ['語意：性質/程度的名詞化', '常用但仍屬派生'],
        examples: ['便利だ→便利さ', '大切だ→大切さ', '静かだ→静かさ']
      },
      {
        subTitle: '名詞類語幹 → な形容詞用法(⚠️詞彙成立才行)',
        subContents: ['很多な形容詞本質上是名詞/漢語詞，能用『〜な』修飾名詞', '不是所有名詞都能變成『〜な』：是否成立看詞彙慣用', '像『安全・健康・可能』這類偏抽象/狀態的漢語詞很常可用『〜な』'],
        examples: ['安全→安全な場所', '健康→健康な生活', '可能→可能な範囲']
      }
    ]
  },
  {
    title: '名詞 ↔ 形容詞(常見後綴與結構)',
    contents: [
      {
        subTitle: '名詞＋的(てき)→ な形容詞(常用)',
        subContents: ['生產力高，常用於漢語詞', '形式：〜的だ／〜的な＋名詞／〜的に＋動詞'],
        examples: ['科学→科学的', '一般→一般的', '具体→具体的']
      },
      {
        subTitle: '5-2) 名詞＋らしい／っぽい：像…／有…感(⚠️語感差異、接法不只名詞)',
        subContents: ['らしい：更偏『符合其本質、很像那個身份』，常接名詞(子供らしい)', 'っぽい：更偏『有那種感覺/傾向』(口語感更強，也可帶貶義)', 'っぽい不只接名詞，也常接形容詞語幹(白っぽい)等，屬派生接尾語'],
        examples: ['子供らしい', '大人っぽい', '安っぽい', '白っぽい']
      },
      {
        subTitle: '5-3) 名詞＋の：名詞修飾名詞(規則固定，但不是把名詞變形容詞)',
        subContents: ['助詞『の』讓前面名詞成為後面名詞的修飾語', '屬於『連體修飾』而不是『名詞變形容詞』'],
        examples: ['日本の文化', '私の本', '会社のルール']
      }
    ]
  },
  {
    title: '名詞 / 語幹 → 副詞 (部分規則固定 / 多為慣用搭配)',
    contents: [
      {
        subTitle: '時間名詞直接當副詞用(規則非常穩)',
        subContents: ['今日／明日／毎日／先週 等時間名詞常直接修飾動詞', '學習上可當作『副詞功能的名詞』來理解'],
        examples: ['今日行きます', '明日働きます', '毎日勉強します']
      },
      {
        subTitle: '6-2) 名詞/な形容詞語幹＋に → 副詞用法(⚠️常見但不等於可任意套用)',
        subContents: ['語意常見：時間點、順序、方式、狀態', '『最後に』『一緒に』：名詞＋に(常見且穩)', '『急に』：多作『急だ(な形容詞)→ 急に』的副詞用法', '『直ちに』：屬慣用副詞搭配，不能當成『所有名詞都能＋に』的規則'],
        examples: ['最後に', '一緒に', '急に', '直ちに']
      }
    ]
  },
  {
    title: '總結：固定規則 vs 要查慣用』',
    contents: [
      {
        subTitle: '固定規則(幾乎所有詞都能套用)',
        subContents: ['V普通形＋こと／の(動詞名詞化)', 'い形容詞→副詞：〜く', 'な形容詞→副詞：〜に', '名詞＋する(サ変動詞)', 'V連用形＋方(かた)', 'V＋ところ(句型：正要/正在/剛)'],
        examples: ['行くこと', '行くの', '早く行く', '静かに話す', '勉強する', '読み方']
      },
      {
        subTitle: '要查慣用(形式可推，但不保證常用/可逆)',
        subContents: ['V連用形→名詞(働き、休み等)', '〜み 名詞化(苦み、深み等)', '名詞＋る(口語造語：ググる等)', '〜がる(情感/感覺限定)', '名詞→な形容詞(安全な 等，非所有名詞都可)', '名詞/語幹＋に的副詞(尤其是慣用搭配)'],
        examples: ['働き(常用)', '苦み(常用)', 'ググる(口語)', 'ほしがる(限定)', '直ちに(慣用)']
      }
    ]
  }
];

export const grammarSections: GrammarSectionSpec[] = [
  { id: 'system-difference', title: '語法系統差異', kind: 'system-difference', payloadKey: 'systemDifferenceRows', dataTestId: 'grammar-section-system-difference' },
  { id: 'conjugation-meaning', title: '各活用型意義', kind: 'rule-list', payloadKey: 'conjugationMeaningRules', dataTestId: 'grammar-section-conjugation-meaning' },
  { id: 'verb-classification', title: '動詞型態分辨: 一段/五段/不規則', kind: 'rule-list', payloadKey: 'verbClassificationRules', dataTestId: 'grammar-section-verb-classification' },
  { id: 'godan-table', title: '五段動詞表(詞尾母音變化)', kind: 'godan-table', payloadKey: 'godanTableSpec', dataTestId: 'grammar-section-godan-table' },
  { id: 'ichidan-table', title: '一段動詞 (辭書型 結尾必定是 る)', kind: 'inflection-table', payloadKey: 'ichidan', dataTestId: 'grammar-section-ichidan-table' },
  { id: 'sahen-table', title: 'サ變動詞 (する動詞為結尾的動詞)', kind: 'inflection-table', payloadKey: 'sahen', dataTestId: 'grammar-section-sahen-table' },
  { id: 'kahen-table', title: 'カ變動詞 (只有来る)', kind: 'inflection-table', payloadKey: 'kahen', dataTestId: 'grammar-section-kahen-table' },
  { id: 'i-adjective-table', title: 'い形容詞', kind: 'inflection-table', payloadKey: 'iAdjective', dataTestId: 'grammar-section-i-adjective-table' },
  { id: 'nai-adjective-table', title: 'ない形容詞', kind: 'inflection-table', payloadKey: 'naiAdjective', dataTestId: 'grammar-section-nai-adjective-table' },
  { id: 'da-auxiliary-table', title: 'だ助動詞', kind: 'inflection-table', payloadKey: 'daAuxiliary', dataTestId: 'grammar-section-da-auxiliary-table' },
  { id: 'pos-conversion', title: '詞性變化規則', kind: 'pos-conversion', payloadKey: 'posConversionSections', dataTestId: 'grammar-section-pos-conversion' }
];
