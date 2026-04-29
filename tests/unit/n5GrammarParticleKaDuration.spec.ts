import { describe, expect, it } from 'vitest';
import { n5GrammarSourceCoverage, sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar particle-ka duration topic', () => {
  it('keeps the detailed どれくらい / どのくらい topic and reaction tone note', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-ka');

    expect(section).toBeDefined();

    const note = section!.sharedNotes.find((entry) => entry.id === 'ka-reaction-tone');
    const topic = section!.topics.find((entry) => entry.id === 'ka-how-long-duration');

    expect(note).toBeDefined();
    expect(note!.content).toContain('そうなんですね');
    expect(note!.content).toContain('へえ');

    expect(topic).toBeDefined();
    expect(topic!.sharedNoteIds).toEqual(['ka-scope', 'ka-reaction-tone']);
    expect(topic!.details.length).toBeGreaterThanOrEqual(5);
    expect(topic!.examples.length).toBeGreaterThanOrEqual(5);

    const exampleSentences = topic!.examples.map((example) => example.japanese);

    expect(exampleSentences).toContain('そうなんですね。どれくらい時間がかかりますか。');
    expect(exampleSentences).toContain('へえ、どのくらいかかりますか。');
    expect(exampleSentences).toContain('大阪から東京まで、どのくらい時間がかかりますか。');
    expect(exampleSentences).toContain('この仕事はどれくらい時間がかかりますか。');
    expect(exampleSentences).toContain('この旅行はどれくらいお金がかかりますか。');

    expect(topic!.details.some((detail) => detail.includes('お金'))).toBe(true);
    expect(topic!.details.some((detail) => detail.includes('どのくらいかかりますか'))).toBe(true);

    for (const example of topic!.examples) {
      expect(example.origin).toBe('supplemental');
    }
  });

  it('marks note-ch4-ka as supplemented and maps it to the new topic set', () => {
    const coverage = n5GrammarSourceCoverage.find((entry) => entry.sourceId === 'note-ch4-ka');

    expect(coverage).toBeDefined();
    expect(coverage!.mappedSectionId).toBe('particle-ka');
    expect(coverage!.mappedTopicIds).toEqual(['ka-question', 'ka-question-word', 'ka-how-long-duration']);
    expect(coverage!.status).toBe('supplemented');
  });
});
