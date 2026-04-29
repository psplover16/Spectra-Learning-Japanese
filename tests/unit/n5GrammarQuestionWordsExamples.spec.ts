import { describe, expect, it } from 'vitest';
import { n5GrammarSourceCoverage, sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar question-words examples', () => {
  it('keeps every requested common question-word sentence inside question-words', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'question-words');

    expect(section).toBeDefined();
    expect(section!.topics.map((topic) => topic.id)).toEqual([
      'question-what-where-when',
      'question-reason-state-method',
      'question-person',
      'question-choice-price-count',
      'question-degree-duration',
    ]);

    const examples = section!.topics.flatMap((topic) => topic.examples);
    const exampleSentences = examples.map((example) => example.japanese);

    expect(exampleSentences).toEqual(expect.arrayContaining([
      'これは何ですか。',
      '何回日本へ行きましたか。',
      'トイレはどこですか。',
      'どこに住んでいますか。',
      'いつ日本へ来ましたか。',
      'どうして日本語を勉強しますか。',
      '体の調子はどうですか。',
      '体の調子はいかがですか。',
      'どんな音楽を聞きますか。',
      'どうやってここへ行きましたか。',
      'あの人は誰ですか。',
      '部屋の中に誰かいますか。',
      'あの人はどなたですか。',
      'あなたの傘はどれですか。',
      'どの傘があなたのですか。',
      'うちはどちらですか。',
      '野球とサッカーとどちらが好きですか。',
      'そのカバンはいくらですか。',
      'この時計はいくらでしたか。',
      'りんごがいくつありますか。',
      'りんごが何個ありますか。',
      '東京から大阪まで新幹線でどのくらいかかりますか。',
      '東京から大阪まで新幹線でどれくらいかかりますか。',
    ]));
  });

  it('keeps meanings, usage notes, ている explanation, and default-open preference', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'question-words')!;
    const examples = section.topics.flatMap((topic) => topic.examples);

    const liveExample = examples.find((example) => example.id === 'question-where-live-example');
    const teiruNote = section.sharedNotes.find((note) => note.id === 'question-teiru-note');
    const ikutsuExample = examples.find((example) => example.id === 'question-apple-how-many-ikutsu-example');
    const nankoExample = examples.find((example) => example.id === 'question-apple-how-many-nanko-example');
    const watchExample = examples.find((example) => example.id === 'question-watch-price-past-example');
    const durationExample = examples.find((example) => example.id === 'question-tokyo-osaka-donokurai-example');

    expect(liveExample?.note).toContain('に標示存在場所');
    expect(liveExample?.note).toContain('持續居住');
    expect(teiruNote?.content).toContain('補助動詞');
    expect(teiruNote?.content).toContain('住む的て形');
    expect(teiruNote?.content).toContain('食べている');
    expect(teiruNote?.content).toContain('結婚している');
    expect(ikutsuExample?.note).toContain('無生命物體');
    expect(nankoExample?.note).toContain('猫がいます');
    expect(watchExample?.note).toContain('でしたか');
    expect(durationExample?.note).toContain('新幹線で標示交通工具');

    expect(n5GrammarSourceCoverage.find((entry) => entry.sourceId === 'note-v16-ch5-question-words')).toMatchObject({
      mappedSectionId: 'question-words',
      mappedTopicIds: [
        'question-what-where-when',
        'question-reason-state-method',
        'question-person',
        'question-choice-price-count',
        'question-degree-duration',
      ],
      status: 'supplemented',
    });
  });
});
