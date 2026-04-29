import { describe, expect, it } from 'vitest';
import { sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar particle-to companion example note', () => {
  it('keeps the mother park walking example and the で / を reminder note', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-to');

    expect(section).toBeDefined();

    const topic = section!.topics.find((entry) => entry.id === 'to-action-partner');

    expect(topic).toBeDefined();

    const example = topic!.examples.find((entry) => entry.id === 'to-mother-park-walk');

    expect(example).toBeDefined();
    expect(example!.japanese).toBe('母と一緒に公園で散歩しました。');
    expect(example!.note).toContain('「で」');
    expect(example!.note).toContain('動作發生的場所');
    expect(example!.note).toContain('「を」');
    expect(example!.note).toContain('移動的路線');
  });

  it('includes the winter vacation skiing example for action partners', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-to');

    expect(section).toBeDefined();

    const topic = section!.topics.find((entry) => entry.id === 'to-action-partner');

    expect(topic).toBeDefined();

    const example = topic!.examples.find((entry) => entry.id === 'to-winter-vacation-ski');

    expect(example).toBeDefined();
    expect(example!.japanese).toBe('冬休みに友達とスキーをします。');
    expect(example!.reading).toBe('ふゆやすみ に ともだち と スキー を します。');
    expect(example!.translation).toBe('寒假要和朋友一起滑雪。');
    expect(example!.origin).toBe('supplemental');
  });
});
