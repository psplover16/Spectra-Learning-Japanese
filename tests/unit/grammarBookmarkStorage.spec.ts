import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearGrammarBookmark,
  readGrammarBookmark,
  writeGrammarBookmark
} from '@/modules/grammar/storage/grammarBookmarkStorage';
import { grammarBookmarkStorageKey } from '@/shared/config/storageKeys';

describe('grammar bookmark storage', () => {
  afterEach(() => {
    window.localStorage.removeItem(grammarBookmarkStorageKey);
    vi.restoreAllMocks();
  });

  describe('Storage schema reserves all JLPT levels', () => {
    it('writes a new level entry without disturbing existing entries on other levels', () => {
      window.localStorage.setItem(
        grammarBookmarkStorageKey,
        JSON.stringify({
          version: 1,
          byLevel: {
            N4: { sectionId: 'tense-overview', updatedAt: '2026-04-30T00:00:00.000Z' }
          }
        })
      );

      expect(writeGrammarBookmark('N5', 'particles-wa', new Date('2026-05-12T00:00:00.000Z'))).toBe(true);

      expect(readGrammarBookmark('N4')).toEqual({
        sectionId: 'tense-overview',
        updatedAt: '2026-04-30T00:00:00.000Z'
      });
      expect(readGrammarBookmark('N5')).toEqual({
        sectionId: 'particles-wa',
        updatedAt: '2026-05-12T00:00:00.000Z'
      });
    });

    it('returns null when reading a level that has no entry', () => {
      expect(readGrammarBookmark('N5')).toBeNull();

      writeGrammarBookmark('N5', 'particles-wa');
      expect(readGrammarBookmark('N4')).toBeNull();
      expect(readGrammarBookmark('N3')).toBeNull();
      expect(readGrammarBookmark('N2')).toBeNull();
      expect(readGrammarBookmark('N1')).toBeNull();
    });

    it('overwrites the existing bookmark for the same level (single-bookmark invariant)', () => {
      writeGrammarBookmark('N5', 'particles-wa', new Date('2026-05-12T00:00:00.000Z'));
      writeGrammarBookmark('N5', 'particles-ga', new Date('2026-05-12T01:00:00.000Z'));

      expect(readGrammarBookmark('N5')).toEqual({
        sectionId: 'particles-ga',
        updatedAt: '2026-05-12T01:00:00.000Z'
      });
    });

    it('clears only the requested level', () => {
      writeGrammarBookmark('N5', 'particles-wa');
      writeGrammarBookmark('N4', 'tense-overview');

      clearGrammarBookmark('N5');

      expect(readGrammarBookmark('N5')).toBeNull();
      expect(readGrammarBookmark('N4')?.sectionId).toBe('tense-overview');
    });

    it('treats clearGrammarBookmark on an absent level as a no-op', () => {
      expect(() => clearGrammarBookmark('N5')).not.toThrow();
      expect(readGrammarBookmark('N5')).toBeNull();
    });

    it('generates an ISO timestamp when updatedAt argument is omitted', () => {
      const before = Date.now();
      expect(writeGrammarBookmark('N5', 'particles-wa')).toBe(true);
      const after = Date.now();

      const entry = readGrammarBookmark('N5');
      expect(entry).not.toBeNull();
      const parsed = Date.parse(entry!.updatedAt);
      expect(parsed).toBeGreaterThanOrEqual(before);
      expect(parsed).toBeLessThanOrEqual(after);
    });

    it('rejects an empty sectionId and does not persist it', () => {
      writeGrammarBookmark('N5', 'particles-wa');
      expect(writeGrammarBookmark('N5', '')).toBe(false);

      expect(readGrammarBookmark('N5')?.sectionId).toBe('particles-wa');
    });
  });

  describe('Storage failures degrade gracefully', () => {
    it('returns null and removes the entry when persisted JSON is unparseable', () => {
      window.localStorage.setItem(grammarBookmarkStorageKey, '{not-valid-json');

      expect(readGrammarBookmark('N5')).toBeNull();
      expect(window.localStorage.getItem(grammarBookmarkStorageKey)).toBeNull();
    });

    it('returns null when persisted snapshot has the wrong shape', () => {
      window.localStorage.setItem(
        grammarBookmarkStorageKey,
        JSON.stringify({ version: 1, byLevel: { n5: { sectionId: 123, updatedAt: '2026-05-12T00:00:00.000Z' } } })
      );

      expect(readGrammarBookmark('N5')).toBeNull();
      expect(window.localStorage.getItem(grammarBookmarkStorageKey)).toBeNull();
    });

    it('returns null when version field is missing', () => {
      window.localStorage.setItem(
        grammarBookmarkStorageKey,
        JSON.stringify({
          byLevel: { n5: { sectionId: 'particles-wa', updatedAt: '2026-05-12T00:00:00.000Z' } }
        })
      );

      expect(readGrammarBookmark('N5')).toBeNull();
      expect(window.localStorage.getItem(grammarBookmarkStorageKey)).toBeNull();
    });

    it('returns null when updatedAt is not a valid ISO timestamp', () => {
      window.localStorage.setItem(
        grammarBookmarkStorageKey,
        JSON.stringify({
          version: 1,
          byLevel: { n5: { sectionId: 'particles-wa', updatedAt: 'not-a-date' } }
        })
      );

      expect(readGrammarBookmark('N5')).toBeNull();
    });

    it('writeGrammarBookmark returns false (no throw) when localStorage.setItem throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => writeGrammarBookmark('N5', 'particles-wa')).not.toThrow();
      expect(writeGrammarBookmark('N5', 'particles-wa')).toBe(false);
    });

    it('clearGrammarBookmark does not throw when localStorage.removeItem throws', () => {
      writeGrammarBookmark('N5', 'particles-wa');

      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => clearGrammarBookmark('N5')).not.toThrow();
    });
  });
});
