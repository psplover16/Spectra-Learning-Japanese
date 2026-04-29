import { describe, expect, it } from 'vitest';
import {
  conjugationMeaningRules,
  godanTableSpec,
  grammarSections,
  inflectionTableSpecs,
  posConversionSections,
  systemDifferenceRows,
  verbClassificationRules
} from '@/modules/grammar/data/changeRules';

describe('changeRules data', () => {
  it('grammar section 順序與 id 唯一且共 11 個', () => {
    expect(grammarSections).toHaveLength(11);

    const ids = grammarSections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('system-difference');
    expect(ids.at(-1)).toBe('pos-conversion');
  });

  it('關鍵 payload 完整存在', () => {
    expect(systemDifferenceRows).toHaveLength(10);
    expect(conjugationMeaningRules.length).toBeGreaterThanOrEqual(5);
    expect(verbClassificationRules.length).toBeGreaterThanOrEqual(5);
    expect(godanTableSpec.soundChangeRows).toHaveLength(3);
    expect(Object.keys(inflectionTableSpecs)).toEqual(['ichidan', 'sahen', 'kahen', 'iAdjective', 'naiAdjective', 'daAuxiliary']);
    expect(posConversionSections.length).toBeGreaterThanOrEqual(7);
  });

  it('サ變動詞資料含散歩的指定例句，且既有表格資料未被移除', () => {
    const sahen = inflectionTableSpecs.sahen!;
    const examples = sahen.exampleGroups?.flatMap((group) => group.examples) ?? [];

    expect(sahen.mainRows.length).toBeGreaterThan(0);
    expect(sahen.verb).toBe('散歩');
    expect(examples.map((example) => example.form)).toEqual(['しません', 'しませんでした', 'しない', 'した']);
    expect(examples.map((example) => example.japanese)).toContain('雨の日は散歩しません。');
    expect(examples.map((example) => example.japanese)).toContain('昨日は忙しかったので、散歩しませんでした。');
    expect(examples.map((example) => example.japanese)).toContain('今日は散歩しない。');
    expect(examples.map((example) => example.japanese)).toContain('今朝、公園で散歩した。');
  });

  it('カ變與だ助動詞標題和說明分開保存', () => {
    expect(inflectionTableSpecs.kahen!.title).toBe('カ變動詞 (只有来る)');
    expect(inflectionTableSpecs.kahen!.subtitle).toBe('漢字發音會變動，標註在詞尾');
    expect(inflectionTableSpecs.daAuxiliary!.title).toBe('だ助動詞');
    expect(inflectionTableSpecs.daAuxiliary!.subtitle).toContain('名詞＋だ (ex.彼は学生だ)');
  });
});
