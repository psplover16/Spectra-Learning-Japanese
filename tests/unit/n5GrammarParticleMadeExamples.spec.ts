import { describe, expect, it } from 'vitest';
import { n5GrammarSourceCoverage, sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar particle-made examples', () => {
  it('keeps the requested まで topics, examples, and sentence-level notes inside particle-made', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-made');

    expect(section).toBeDefined();
    expect(section!.title).toBe('助詞 まで：終點、界線與上限');
    expect(section!.topics.map((topic) => topic.id)).toEqual([
      'made-time-end',
      'made-place-end',
      'made-quantity-limit',
    ]);

    const examples = section!.topics.flatMap((topic) => topic.examples);
    const exampleSentences = examples.map((example) => example.japanese);

    expect(exampleSentences).toContain('今晩は朝まで飲みましょう。');
    expect(exampleSentences).toContain('隣りの家の犬が朝から晩まで吠えてうるさいです。');
    expect(exampleSentences).toContain('隣の家の犬が朝から晩まで吠えていて、うるさくてたまりません。');
    expect(exampleSentences).toContain('友達を駅まで車で送ります。');
    expect(exampleSentences).toContain('一人四冊まで本を借りることができます。');

    const morningExample = examples.find((example) => example.id === 'made-drink-morning-example');
    const plainDogExample = examples.find((example) => example.id === 'made-neighbor-dog-plain-example');
    const intenseDogExample = examples.find((example) => example.id === 'made-neighbor-dog-intense-example');
    const stationExample = examples.find((example) => example.id === 'made-send-station-example');
    const bookLimitExample = examples.find((example) => example.id === 'made-book-limit-example');

    expect(morningExample?.note).toContain('時間終點');
    expect(plainDogExample?.note).toContain('隣り與隣意思相同');
    expect(plainDogExample?.note).toContain('朝から晩まで');
    expect(plainDogExample?.note).toContain('語氣直接、平實');
    expect(intenseDogExample?.note).toContain('持續狀態');
    expect(intenseDogExample?.note).toContain('〜てたまらない');
    expect(intenseDogExample?.note).toContain('語氣比うるさいです強很多');
    expect(stationExample?.note).toContain('駅まで標示送達的終點');
    expect(stationExample?.note).toContain('車で標示交通工具');
    expect(bookLimitExample?.note).toContain('每人最多四本');
    expect(bookLimitExample?.note).toContain('可以借');

    const timeTopic = section!.topics.find((topic) => topic.id === 'made-time-end')!;
    const quantityTopic = section!.topics.find((topic) => topic.id === 'made-quantity-limit')!;

    expect(timeTopic.details.join('\n')).not.toContain('うるさくてたまりません');
    expect(quantityTopic.details.join('\n')).not.toContain('一人四冊まで');
  });

  it('maps note-v16-ch4-made coverage to the expanded particle-made topics', () => {
    expect(n5GrammarSourceCoverage.find((entry) => entry.sourceId === 'note-v16-ch4-made')).toMatchObject({
      mappedSectionId: 'particle-made',
      mappedTopicIds: ['made-time-end', 'made-place-end', 'made-quantity-limit'],
      status: 'supplemented',
    });
  });
});
