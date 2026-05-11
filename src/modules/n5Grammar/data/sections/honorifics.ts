import type {
  N5GrammarCompareTable,
  N5GrammarSection,
  N5GrammarTableExampleGroup,
} from "@/modules/n5Grammar/types/grammarNotes";

const politeOverviewTable: N5GrammarCompareTable = {
  columns: ["變化項目", "名詞 / な形容詞", "い形容詞", "動詞"],
  rows: [
    {
      id: "present-positive",
      label: "現在肯定",
      values: ["です", "いです", "ます"],
    },
    {
      id: "present-negative",
      label: "現在否定",
      values: ["じゃありません。\nではありません", "くないです", "ません"],
    },
    {
      id: "past-positive",
      label: "過去肯定",
      values: ["でした", "かったです", "ました"],
    },
    {
      id: "past-negative",
      label: "過去否定",
      values: [
        "じゃありませんでした。\nではありませんでした",
        "くなかったです",
        "ませんでした",
      ],
    },
  ],
};

const politeOverviewTableExampleGroups: N5GrammarTableExampleGroup[] = [
  {
    id: "present-positive-nominal",
    rowId: "present-positive",
    columnIndex: 0,
    forms: ["です"],
    examples: [
      {
        id: "polite-overview-present-positive-nominal",
        japanese: "この部屋は静かです。",
        highlightTerms: ["です"],
        reading: "この へや は しずか です。",
        translation: "這個房間很安靜。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "present-negative-nominal",
    rowId: "present-negative",
    columnIndex: 0,
    forms: ["じゃありません", "ではありません"],
    examples: [
      {
        id: "polite-overview-present-negative-nominal",
        japanese: "この店は便利じゃありません。",
        highlightTerms: ["じゃありません"],
        reading: "この みせ は べんり じゃありません。",
        translation: "這間店不方便。",
        origin: "supplemental",
      },
    ],
    note: "名詞與な形容詞的禮貌否定可用「じゃありません」或較正式的「ではありません」。",
  },
  {
    id: "past-positive-nominal",
    rowId: "past-positive",
    columnIndex: 0,
    forms: ["でした"],
    examples: [
      {
        id: "polite-overview-past-positive-nominal",
        japanese: "昨日は休みでした。",
        highlightTerms: ["でした"],
        reading: "きのう は やすみ でした。",
        translation: "昨天是休假日。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "past-negative-nominal",
    rowId: "past-negative",
    columnIndex: 0,
    forms: ["じゃありませんでした", "ではありませんでした"],
    examples: [
      {
        id: "polite-overview-past-negative-nominal",
        japanese: "去年、私は会社員じゃありませんでした。",
        highlightTerms: ["じゃありませんでした"],
        reading: "きょねん、わたし は かいしゃいん じゃありませんでした。",
        translation: "去年我不是公司職員。",
        origin: "supplemental",
      },
    ],
    note: "過去否定同樣有「じゃ」與較正式的「では」兩種常見寫法。",
  },
  {
    id: "present-positive-i-adjective",
    rowId: "present-positive",
    columnIndex: 1,
    forms: ["いです"],
    examples: [
      {
        id: "polite-overview-present-positive-i-adjective",
        japanese: "今日は寒いです。",
        highlightTerms: ["寒いです"],
        reading: "きょう は さむい です。",
        translation: "今天很冷。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "present-negative-i-adjective",
    rowId: "present-negative",
    columnIndex: 1,
    forms: ["くないです"],
    examples: [
      {
        id: "polite-overview-present-negative-i-adjective",
        japanese: "このかばんは重くないです。",
        highlightTerms: ["重くないです"],
        reading: "この かばん は おもくない です。",
        translation: "這個包包不重。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "past-positive-i-adjective",
    rowId: "past-positive",
    columnIndex: 1,
    forms: ["かったです"],
    examples: [
      {
        id: "polite-overview-past-positive-i-adjective",
        japanese: "昨日の海は青かったです。",
        highlightTerms: ["青かったです"],
        reading: "きのう の うみ は あおかった です。",
        translation: "昨天的海很藍。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "past-negative-i-adjective",
    rowId: "past-negative",
    columnIndex: 1,
    forms: ["くなかったです"],
    examples: [
      {
        id: "polite-overview-past-negative-i-adjective",
        japanese: "先月の宿題は難しくなかったです。",
        highlightTerms: ["難しくなかったです"],
        reading: "せんげつ の しゅくだい は むずかしくなかった です。",
        translation: "上個月的作業不難。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "present-positive-verb",
    rowId: "present-positive",
    columnIndex: 2,
    forms: ["ます"],
    examples: [
      {
        id: "polite-overview-present-positive-verb",
        japanese: "毎朝、コーヒーを飲みます。",
        highlightTerms: ["飲みます"],
        reading: "まいあさ、コーヒー を のみます。",
        translation: "每天早上喝咖啡。",
        origin: "supplemental",
      },
    ],
    note: "這裡用日常習慣句示範動詞的敬體基本形。",
  },
  {
    id: "present-negative-verb",
    rowId: "present-negative",
    columnIndex: 2,
    forms: ["ません"],
    examples: [
      {
        id: "polite-overview-present-negative-verb",
        japanese: "今夜はテレビを見ません。",
        highlightTerms: ["見ません"],
        reading: "こんや は テレビ を みません。",
        translation: "今晚不看電視。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "past-positive-verb",
    rowId: "past-positive",
    columnIndex: 2,
    forms: ["ました"],
    examples: [
      {
        id: "polite-overview-past-positive-verb",
        japanese: "さっき駅で友達に会いました。",
        highlightTerms: ["会いました"],
        reading: "さっき えき で ともだち に あいました。",
        translation: "剛剛在車站見到了朋友。",
        origin: "supplemental",
      },
    ],
  },
  {
    id: "past-negative-verb",
    rowId: "past-negative",
    columnIndex: 2,
    forms: ["ませんでした"],
    examples: [
      {
        id: "polite-overview-past-negative-verb",
        japanese: "昨日はパンを買いませんでした。",
        highlightTerms: ["買いませんでした"],
        reading: "きのう は パン を かいませんでした。",
        translation: "昨天沒有買麵包。",
        origin: "supplemental",
      },
    ],
  },
];

export const sections: N5GrammarSection[] = [
    {
      id: "polite-overview",
      title: "敬體變化速覽",
      description: "名詞 / な形容詞、い形容詞與動詞的敬體變化",
      presentationMode: "compare-table",
      order: 1,
      category: "honorifics",
      sharedNotes: [],
      table: politeOverviewTable,
      topics: [],
      tableExampleGroups: politeOverviewTableExampleGroups,
    },
];
