import { describe, expect, it } from 'vitest';
import { n5GrammarSourceCoverage, sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar particle-ni examples', () => {
  it('keeps the requested action landing-point example inside particle-ni', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-ni');

    expect(section).toBeDefined();
    expect(section!.title).toBe('助詞 に：時間點與動作落點');

    const topic = section!.topics.find((entry) => entry.id === 'ni-action-landing-point');

    expect(topic).toBeDefined();
    expect(topic!.summary).toContain('結果到達');
    expect(topic!.sourceRefs).toContain('user-request-ni-landing');

    const example = topic!.examples.find((entry) => entry.id === 'ni-paper-name-phone');

    expect(example).toBeDefined();
    expect(example!.japanese).toBe('この紙に名前と電話番号を書いてください。');
    expect(example!.translation).toBe('請在這張紙上寫姓名和電話號碼。');
    expect(example!.note).toContain('動作的落點');
    expect(example!.note).toContain('結果到達');
    expect(`${topic!.details.join('\n')}\n${example!.note}`).toContain('紙に名前を書く');

    expect(n5GrammarSourceCoverage.find((entry) => entry.sourceId === 'user-request-ni-landing')).toMatchObject({
      mappedSectionId: 'particle-ni',
      mappedTopicIds: ['ni-action-landing-point'],
      status: 'supplemented',
    });
  });
});
