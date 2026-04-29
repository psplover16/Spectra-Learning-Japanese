import { describe, expect, it } from 'vitest';
import { sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';

describe('n5Grammar demonstratives examples', () => {
  it('keeps the here.png demonstrative matrix concise and moves grammar details to notes', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'demonstratives');
    const table = section?.table;
    const objectTopic = section!.topics.find((topic) => topic.id === 'demonstrative-object-place-person');
    const details = objectTopic!.details.join('\n');

    expect(table?.columns).toEqual(['距離 / 用途', '指東西', '接名詞', '指地方', '鄭重說法', '口語說法']);
    expect(table?.rows.map((row) => row.label)).toEqual(['近自己', '近對方', '遠方', '疑問']);

    const allCells = table!.rows.flatMap((row) => row.values);

    expect(allCells).toEqual(
      expect.arrayContaining([
        'これ',
        'この',
        'ここ',
        'こちら',
        'どっち',
      ]),
    );
    expect(allCells.every((cell) => !cell.includes('\n'))).toBe(true);
    expect(allCells.join('\n')).not.toContain('代名詞');
    expect(allCells.join('\n')).not.toContain('連體詞');
    expect(allCells.join('\n')).not.toContain('場所代名詞');
    expect(allCells.join('\n')).not.toContain('特別事項');

    expect(details).toContain('表格只列詞本身');
    expect(details).toContain('これ / それ / あれ / どれ是指物代名詞');
    expect(details).toContain('この / その / あの / どの是連體詞');
    expect(details).toContain('ここ / そこ / あそこ / どこ是場所代名詞');
    expect(details).toContain('後面必須接名詞');
    expect(details).toContain('どっち也可用來問二選一');
  });

  it('keeps sentence-specific demonstrative details in example notes', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'demonstratives');

    expect(section).toBeDefined();

    const dialogueTopic = section!.topics.find((topic) => topic.id === 'demonstrative-choice-dialogue');

    expect(dialogueTopic).toBeDefined();
    expect(dialogueTopic!.details.join('\n')).not.toContain('ここはうるさいから');
    expect(dialogueTopic!.details.join('\n')).not.toContain('そちらは何時から何時まで');

    const noisyMoveExample = dialogueTopic!.examples.find(
      (example) => example.id === 'demonstrative-noisy-move-example',
    );
    const businessHoursExample = dialogueTopic!.examples.find(
      (example) => example.id === 'demonstrative-business-hours-example',
    );
    const coffeeTeaExample = dialogueTopic!.examples.find(
      (example) => example.id === 'demonstrative-coffee-tea-choice',
    );
    const orderExample = dialogueTopic!.examples.find((example) => example.id === 'demonstrative-order-example');
    const petChoiceExample = dialogueTopic!.examples.find(
      (example) => example.id === 'demonstrative-pet-choice-example',
    );
    const wineQuestionExample = dialogueTopic!.examples.find(
      (example) => example.id === 'demonstrative-wine-question',
    );
    const wineAnswerExample = dialogueTopic!.examples.find((example) => example.id === 'demonstrative-wine-answer');
    const wineRequestExample = dialogueTopic!.examples.find((example) => example.id === 'demonstrative-wine-request');

    expect(noisyMoveExample?.japanese).toBe('ここはうるさいから、あっちへ行きましょう。');
    expect(noisyMoveExample?.highlightTerms).toEqual(['ここ', 'あっち']);
    expect(noisyMoveExample?.note).toContain('ここ標示現在位置');
    expect(noisyMoveExample?.note).toContain('から標示原因');
    expect(noisyMoveExample?.note).toContain('あっち標示移動方向');
    expect(noisyMoveExample?.note).toContain('行きましょう是邀約形');

    expect(businessHoursExample?.japanese).toBe('そちらは何時から何時まで開いていますか。');
    expect(businessHoursExample?.highlightTerms).toEqual(['そちら']);
    expect(businessHoursExample?.note).toContain('對方店家');
    expect(businessHoursExample?.note).toContain('から標示起點');
    expect(businessHoursExample?.note).toContain('開著');

    expect(coffeeTeaExample?.japanese).toBe('コーヒーと紅茶とどちらがいいですか。');
    expect(coffeeTeaExample?.note).toContain('疑問詞');
    expect(coffeeTeaExample?.note).toContain('固定用が，不用は');
    expect(coffeeTeaExample?.note).toContain('中意');
    expect(orderExample?.note).toContain('注文する');
    expect(petChoiceExample?.note).toContain('二選一');
    expect(wineQuestionExample?.japanese).toBe('女：これはどこのワインですか。');
    expect(wineQuestionExample?.highlightTerms).toEqual(['これ', 'どこ']);
    expect(wineQuestionExample?.note).toContain('どこの = どこ + の');
    expect(wineAnswerExample?.japanese).toBe('男：それはイタリアのワインです。');
    expect(wineAnswerExample?.highlightTerms).toEqual(['それ']);
    expect(wineAnswerExample?.note).toContain('距離邏輯');
    expect(wineRequestExample?.japanese).toBe('じゃあ、このワインをください。');
    expect(wineRequestExample?.note).toContain('このをください不可以');
  });

  it('keeps object/place/person examples with notes inside the first demonstrative topic', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'demonstratives');
    const objectTopic = section!.topics.find((topic) => topic.id === 'demonstrative-object-place-person');

    expect(objectTopic).toBeDefined();

    const exampleSentences = objectTopic!.examples.map((example) => example.japanese);
    const toiletExample = objectTopic!.examples.find((example) => example.id === 'demonstrative-doko-toilet');
    const accountingExample = objectTopic!.examples.find((example) => example.id === 'demonstrative-achira-accounting');

    expect(exampleSentences).toContain('これは誰の傘ですか。');
    expect(exampleSentences).toContain('この傘はだれのですか。');
    expect(exampleSentences).toContain('トイレはどこですか。');
    expect(exampleSentences).toContain('こちらは山田太郎さんです。');
    expect(exampleSentences).toContain('お会計はあちらでお願いします。');
    expect(toiletExample?.highlightTerms).toEqual(['どこ']);
    expect(accountingExample?.note).toContain('お会計的お是禮貌前綴');
    expect(accountingExample?.note).toContain('お願いのお是詞的一部分');
  });

  it('keeps every requested demonstrative example sentence', () => {
    const section = sortedN5GrammarSections.find((entry) => entry.id === 'demonstratives');
    const exampleSentences = section!.topics.flatMap((topic) => topic.examples.map((example) => example.japanese));

    expect(exampleSentences).toEqual(
      expect.arrayContaining([
        'これは誰の傘ですか。',
        'この傘はだれのですか。',
        'トイレはどこですか。',
        'こちらは山田太郎さんです。',
        'コーヒーと紅茶とどちらがいいですか。',
        'ここはうるさいから、あっちへ行きましょう。',
        'この席は狭いですから、あっちの席に座りましょう。',
        'そちらは何時から何時まで開いていますか。',
        '飲み物はどれを注文しますか。',
        '犬と猫どちらが好きですか。',
        '女：これはどこのワインですか。',
        '男：それはイタリアのワインです。',
        'じゃあ、このワインをください。',
        'お会計はあちらでお願いします。',
      ]),
    );
  });
});
