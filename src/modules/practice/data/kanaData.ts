import type { KanaCell, KanaMatrixRow, TableHeaderOption } from '@/modules/practice/types/practice';

function createKanaCell(
  table: 'tableA' | 'tableB',
  rowKey: string,
  columnKey: string,
  romaji: string,
  hiragana: string,
  katakana: string,
  archaic = false
): KanaCell {
  return {
    id: `${table}-${romaji}`,
    table,
    rowKey,
    columnKey,
    romaji,
    hiragana,
    katakana,
    archaic,
    selectable: !archaic
  };
}

function createRow(
  table: 'tableA' | 'tableB',
  rowKey: string,
  label: string,
  cells: Array<[string, string, string, boolean?] | null>
): KanaMatrixRow {
  const columns = ['a-column', 'i-column', 'u-column', 'e-column', 'o-column'];
  return {
    rowKey,
    label,
    cells: cells.map((cell, index) => {
      if (!cell) {
        return null;
      }

      const [romaji, hiragana, katakana, archaic] = cell;
      return createKanaCell(table, rowKey, columns[index] ?? 'extra-column', romaji, hiragana, katakana, archaic ?? false);
    })
  };
}

export const tableAColumnHeaders: TableHeaderOption[] = [
  { key: 'a-column', label: 'あ段' },
  { key: 'i-column', label: 'い段' },
  { key: 'u-column', label: 'う段' },
  { key: 'e-column', label: 'え段' },
  { key: 'o-column', label: 'お段' }
];

export const tableARows: KanaMatrixRow[] = [
  createRow('tableA', 'a-row', 'あ行', [
    ['a', 'あ', 'ア'],
    ['i', 'い', 'イ'],
    ['u', 'う', 'ウ'],
    ['e', 'え', 'エ'],
    ['o', 'お', 'オ']
  ]),
  createRow('tableA', 'k-row', 'か行', [
    ['ka', 'か', 'カ'],
    ['ki', 'き', 'キ'],
    ['ku', 'く', 'ク'],
    ['ke', 'け', 'ケ'],
    ['ko', 'こ', 'コ']
  ]),
  createRow('tableA', 's-row', 'さ行', [
    ['sa', 'さ', 'サ'],
    ['shi', 'し', 'シ'],
    ['su', 'す', 'ス'],
    ['se', 'せ', 'セ'],
    ['so', 'そ', 'ソ']
  ]),
  createRow('tableA', 't-row', 'た行', [
    ['ta', 'た', 'タ'],
    ['chi', 'ち', 'チ'],
    ['tsu', 'つ', 'ツ'],
    ['te', 'て', 'テ'],
    ['to', 'と', 'ト']
  ]),
  createRow('tableA', 'n-row', 'な行', [
    ['na', 'な', 'ナ'],
    ['ni', 'に', 'ニ'],
    ['nu', 'ぬ', 'ヌ'],
    ['ne', 'ね', 'ネ'],
    ['no', 'の', 'ノ']
  ]),
  createRow('tableA', 'h-row', 'は行', [
    ['ha', 'は', 'ハ'],
    ['hi', 'ひ', 'ヒ'],
    ['fu', 'ふ', 'フ'],
    ['he', 'へ', 'ヘ'],
    ['ho', 'ほ', 'ホ']
  ]),
  createRow('tableA', 'm-row', 'ま行', [
    ['ma', 'ま', 'マ'],
    ['mi', 'み', 'ミ'],
    ['mu', 'む', 'ム'],
    ['me', 'め', 'メ'],
    ['mo', 'も', 'モ']
  ]),
  createRow('tableA', 'y-row', 'や行', [
    ['ya', 'や', 'ヤ'],
    null,
    ['yu', 'ゆ', 'ユ'],
    null,
    ['yo', 'よ', 'ヨ']
  ]),
  createRow('tableA', 'r-row', 'ら行', [
    ['ra', 'ら', 'ラ'],
    ['ri', 'り', 'リ'],
    ['ru', 'る', 'ル'],
    ['re', 'れ', 'レ'],
    ['ro', 'ろ', 'ロ']
  ]),
  createRow('tableA', 'w-row', 'わ行', [
    ['wa', 'わ', 'ワ'],
    ['wi', 'ゐ', 'ヰ', true],
    null,
    ['we', 'ゑ', 'ヱ', true],
    ['wo', 'を', 'ヲ']
  ])
];

export const tableBRows: KanaMatrixRow[] = [
  createRow('tableB', 'ga-row', 'ga', [
    ['ga', 'が', 'ガ'],
    ['gi', 'ぎ', 'ギ'],
    ['gu', 'ぐ', 'グ'],
    ['ge', 'げ', 'ゲ'],
    ['go', 'ご', 'ゴ']
  ]),
  createRow('tableB', 'za-row', 'za', [
    ['za', 'ざ', 'ザ'],
    ['ji', 'じ', 'ジ'],
    ['zu', 'ず', 'ズ'],
    ['ze', 'ぜ', 'ゼ'],
    ['zo', 'ぞ', 'ゾ']
  ]),
  createRow('tableB', 'da-row', 'da', [
    ['da', 'だ', 'ダ'],
    ['di', 'ぢ', 'ヂ'],
    ['du', 'づ', 'ヅ'],
    ['de', 'で', 'デ'],
    ['do', 'ど', 'ド']
  ]),
  createRow('tableB', 'ba-row', 'ba', [
    ['ba', 'ば', 'バ'],
    ['bi', 'び', 'ビ'],
    ['bu', 'ぶ', 'ブ'],
    ['be', 'べ', 'ベ'],
    ['bo', 'ぼ', 'ボ']
  ]),
  createRow('tableB', 'pa-row', 'pa', [
    ['pa', 'ぱ', 'パ'],
    ['pi', 'ぴ', 'ピ'],
    ['pu', 'ぷ', 'プ'],
    ['pe', 'ぺ', 'ペ'],
    ['po', 'ぽ', 'ポ']
  ])
];

export const allKanaCells = [...tableARows, ...tableBRows].flatMap((row) =>
  row.cells.filter((cell): cell is KanaCell => cell !== null)
);
