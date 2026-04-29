import { describe, expect, it } from 'vitest';
import { n5GrammarSourceCoverage, sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar particle-kara examples', () => {
  it('keeps the requested から topics, examples, and usage notes inside particle-kara', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'particle-kara');

    expect(section).toBeDefined();
    expect(section!.title).toBe('助詞 から：起點、來源與理由');

    const topicIds = section!.topics.map((entry) => entry.id);

    expect(topicIds).toEqual([
      'kara-time-start',
      'kara-place-route-start',
      'kara-entry-point',
      'kara-position-distance',
      'kara-contact-source',
      'kara-reason-and-sorekara',
      'kara-kakaru-usage',
    ]);

    const examples = section!.topics.flatMap((topic) => topic.examples);
    const exampleSentences = examples.map((example) => example.japanese);

    expect(exampleSentences).toContain('朝9時から仕事をします。');
    expect(exampleSentences).toContain('銀行は9時から午後3時までです。');
    expect(exampleSentences).toContain('来月からドイツ語の勉強を始めます。');
    expect(exampleSentences).toContain('東京から沖縄へ行きます。');
    expect(exampleSentences).toContain('東京から沖縄まで飛行機でどのくらいかかりますか。');
    expect(exampleSentences).toContain('あそこのドアから入ってください。');
    expect(exampleSentences).toContain('参加者はあちらのドアから中に入ってください。');
    expect(exampleSentences).toContain('私の家は駅から遠いです。');
    expect(exampleSentences).toContain('先生から電話がかかりました。');
    expect(exampleSentences).toContain('休みは日曜日だけですか。はい。それから残業も多いです。');
    expect(exampleSentences).toContain('この車はお金がかかります。');
    expect(exampleSentences).toContain('親に迷惑がかかる。');
    expect(exampleSentences).toContain('ドアに鍵がかかっています。');
    expect(exampleSentences).toContain('エンジンがかかりません。');
    expect(exampleSentences).toContain('強い圧力がかかっています。');

    const routeExample = examples.find(
      (example) => example.japanese === '東京から沖縄まで飛行機でどのくらいかかりますか。',
    );
    const doorExample = examples.find((example) => example.japanese === 'あそこのドアから入ってください。');
    const phoneExample = examples.find((example) => example.japanese === '先生から電話がかかりました。');
    const sorekaraExample = examples.find(
      (example) => example.japanese === '休みは日曜日だけですか。はい。それから残業も多いです。',
    );
    const nextMonthExample = examples.find(
      (example) => example.japanese === '来月からドイツ語の勉強を始めます。',
    );
    const tokyoOkinawaExample = examples.find((example) => example.japanese === '東京から沖縄へ行きます。');
    const houseDistanceExample = examples.find((example) => example.japanese === '私の家は駅から遠いです。');
    const rightReadExample = examples.find((example) => example.japanese === '右から読んでください。');
    const carMoneyExample = examples.find((example) => example.japanese === 'この車はお金がかかります。');
    const troubleExample = examples.find((example) => example.japanese === '親に迷惑がかかる。');
    const doorLockExample = examples.find((example) => example.japanese === 'ドアに鍵がかかっています。');
    const engineExample = examples.find((example) => example.japanese === 'エンジンがかかりません。');
    const pressureExample = examples.find((example) => example.japanese === '強い圧力がかかっています。');

    expect(routeExample?.note).toContain('まで表示終點');
    expect(routeExample?.note).toContain('で表示交通工具');
    expect(routeExample?.note).toContain('どのくらい');
    expect(routeExample?.note).toContain('かかります');
    expect(doorExample?.note).toContain('入る的て形');
    expect(phoneExample?.note).toContain('聯絡的來源');
    expect(phoneExample?.note).toContain('電話打來');
    expect(sorekaraExample?.note).toContain('固定接續詞');
    expect(nextMonthExample?.note).toContain('從下個月開始');
    expect(tokyoOkinawaExample?.note).toContain('東京是出發點');
    expect(houseDistanceExample?.note).toContain('以車站為起點');
    expect(rightReadExample?.note).toContain('閱讀開始的位置');
    expect(carMoneyExample?.note).toContain('需要費用');
    expect(troubleExample?.note).toContain('負擔加到某人身上');
    expect(doorLockExample?.note).toContain('上鎖的狀態');
    expect(engineExample?.note).toContain('引擎啟動');
    expect(pressureExample?.note).toContain('壓力施加');

    const entryPointTopic = section!.topics.find((topic) => topic.id === 'kara-entry-point')!;
    const kakaruTopic = section!.topics.find((topic) => topic.id === 'kara-kakaru-usage')!;

    expect(entryPointTopic.details.join('\n')).not.toContain('ください在這裡');
    expect(kakaruTopic.details.join('\n')).not.toContain('先生から電話がかかりました');
  });

  it('maps note-v16-ch3-kara coverage to all expanded particle-kara topics', () => {
    expect(n5GrammarSourceCoverage.find((entry) => entry.sourceId === 'note-v16-ch3-kara')).toMatchObject({
      mappedSectionId: 'particle-kara',
      mappedTopicIds: [
        'kara-time-start',
        'kara-place-route-start',
        'kara-entry-point',
        'kara-position-distance',
        'kara-contact-source',
        'kara-reason-and-sorekara',
        'kara-kakaru-usage',
      ],
      status: 'supplemented',
    });
  });
});
