import { describe, expect, it, vi } from 'vitest';
import { useN5GrammarSections, type N5GrammarSectionsLoader } from '@/modules/n5Grammar/composables/useN5GrammarSections';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';

function makeSection(id: string, order: number, category: N5GrammarSection['category']): N5GrammarSection {
  return {
    id,
    title: id,
    description: '',
    presentationMode: 'bullet-list',
    order,
    category,
    topics: [],
    sharedNotes: []
  };
}

describe('useN5GrammarSections', () => {
  it('使用注入 loader 時會載入並合併排序', async () => {
    const sections = [
      makeSection('a-particle', 90, 'particles'),
      makeSection('b-fundamentals', 0, 'fundamentals')
    ];
    const loader: N5GrammarSectionsLoader = vi.fn(async () => ({ sortedN5GrammarSections: sections }));
    const session = useN5GrammarSections(loader);

    await session.loadSections();

    expect(loader).toHaveBeenCalledOnce();
    expect(session.sections.value.map((s) => s.id)).toEqual(['a-particle', 'b-fundamentals']);
    expect(session.hasSections.value).toBe(true);
    expect(session.loadError.value).toBeNull();
  });

  it('同一次載入中重複觸發只會跑一次 import', async () => {
    let resolveInner!: (value: { sortedN5GrammarSections: N5GrammarSection[] }) => void;
    const loader = vi.fn<N5GrammarSectionsLoader>(
      () =>
        new Promise<{ sortedN5GrammarSections: N5GrammarSection[] }>((resolve) => {
          resolveInner = resolve;
        })
    );
    const session = useN5GrammarSections(loader);

    const a = session.loadSections();
    const b = session.loadSections();
    resolveInner({ sortedN5GrammarSections: [makeSection('a', 1, 'particles')] });
    await Promise.all([a, b]);

    expect(loader).toHaveBeenCalledOnce();
  });

  it('loader 失敗時 loadError 設為錯誤訊息且 sections 仍為空', async () => {
    const loader: N5GrammarSectionsLoader = vi.fn(async () => {
      throw new Error('one of five files failed');
    });
    const session = useN5GrammarSections(loader);

    await session.loadSections();

    expect(session.sections.value).toEqual([]);
    expect(session.loadError.value).toBe('N5文法資料載入失敗');
  });

  it('預設 loader 並行載入 5 個 sections 子檔並回傳合併後排序', async () => {
    const session = useN5GrammarSections();
    await session.loadSections();

    const sections = session.sections.value;
    expect(sections.length).toBeGreaterThan(0);

    const orders = sections.map((s) => s.order);
    const sortedOrders = [...orders].sort((l, r) => l - r);
    expect(orders).toEqual(sortedOrders);

    const categories = new Set(sections.map((s) => s.category));
    expect(categories.has('particles')).toBe(true);
    expect(categories.has('fundamentals')).toBe(true);
    expect(categories.has('sentence-patterns')).toBe(true);
    expect(categories.has('honorifics')).toBe(true);
  });
});
