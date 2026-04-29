import { describe, expect, it } from 'vitest';
import { sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar particle-de examples', () => {
  it('keeps the requested transportation examples and the 徒歩 noun reminder', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-de');

    expect(section).toBeDefined();

    const topic = section!.topics.find((entry) => entry.id === 'de-transportation');

    expect(topic).toBeDefined();

    const exampleSentences = topic!.examples.map((example) => example.japanese);

    expect(exampleSentences).toContain('電車で会社へ行きます。');
    expect(exampleSentences).toContain('自転車でここへ来ました。');
    expect(exampleSentences).toContain('飛行機で行きますか。車で行きますか。それとも、バイクで行きますか。');
    expect(exampleSentences).toContain('もう時間がありませんから、タクシーで行きましょう。');
    expect(exampleSentences).toContain('私は大阪から船で行きます。');
    expect(exampleSentences).toContain('駅から学校まで徒歩で行きます。');

    expect(topic!.details.some((detail) => detail.includes('徒歩'))).toBe(true);
    expect(topic!.details.some((detail) => detail.includes('歩いて'))).toBe(true);
  });

  it('keeps the action-place and に / で contrast examples inside particle-de', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-de');

    expect(section).toBeDefined();

    const actionPlaceTopic = section!.topics.find((entry) => entry.id === 'de-action-place');
    const contrastTopic = section!.topics.find((entry) => entry.id === 'de-ni-location-contrast');

    expect(actionPlaceTopic).toBeDefined();
    expect(contrastTopic).toBeDefined();

    expect(actionPlaceTopic!.examples.map((example) => example.japanese)).toContain(
      '明日の6時に有楽町駅の中央口で会いましょう。',
    );

    const niExample = contrastTopic!.examples.find((example) => example.id === 'de-ni-park-car-ni-example');
    const deExample = contrastTopic!.examples.find((example) => example.id === 'de-ni-park-car-de-example');

    expect(niExample?.japanese).toBe('ここに車を止めてください。');
    expect(niExample?.translation).toBe('請把車停在這裡。');
    expect(niExample?.note).toContain('會停留');

    expect(deExample?.japanese).toBe('ここで車を止めてください。');
    expect(deExample?.translation).toBe('請在這裡停車。');
    expect(deExample?.note).toContain('動作進行地點');
  });
});
