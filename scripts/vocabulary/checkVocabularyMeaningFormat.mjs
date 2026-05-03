import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const PROJECT_POS_MARKERS = ['五段動詞', '一段動詞', 'い形容詞', 'な形容詞'];

const FULL_WIDTH_MARKER_PATTERN = /（(五段動詞|一段動詞|い形容詞|な形容詞)）/;
const HALF_WIDTH_MARKER_PATTERN = /\((五段動詞|一段動詞|い形容詞|な形容詞)\)/;
const SHARED_MARKER_PATTERN = /；.+[（(](五段動詞|一段動詞|い形容詞|な形容詞)[）)]$/;

function toArray(value) {
  if (Array.isArray(value)) {
    return value.flatMap(toArray);
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  return [String(value)];
}

function unique(values) {
  return [...new Set(values)];
}

function splitLines(value) {
  return toArray(value)
    .flatMap((item) => item.split('\n'))
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeComparable(value) {
  return String(value).trim();
}

function entryDiagnosticBase(entry, meaning, kanji = entry.kanji) {
  return {
    text: entry.text,
    kanji,
    stage: entry.stage,
    meaning,
  };
}

function extractJmdictReadings(entry) {
  return unique([
    ...toArray(entry.reb),
    ...toArray(entry.reading),
    ...toArray(entry.readings),
    ...toArray(entry.kana),
    ...toArray(entry.r_ele?.map((reading) => reading.reb)),
  ]).map(normalizeComparable);
}

function extractJmdictKanji(entry) {
  return unique([
    ...toArray(entry.keb),
    ...toArray(entry.kanji),
    ...toArray(entry.kanjis),
    ...toArray(entry.k_ele?.map((kanji) => kanji.keb)),
  ]).map(normalizeComparable);
}

function extractJmdictPosCodes(entry) {
  const sensePos = toArray(
    entry.sense?.flatMap((sense) => [
      ...toArray(sense.pos),
      ...toArray(sense.partOfSpeech),
      ...toArray(sense.part_of_speech),
    ]),
  );

  return unique([
    ...toArray(entry.pos),
    ...toArray(entry.partOfSpeech),
    ...toArray(entry.part_of_speech),
    ...sensePos,
  ]).map(normalizeComparable);
}

function normalizeJmdictEntry(entry) {
  return {
    readings: extractJmdictReadings(entry),
    kanji: extractJmdictKanji(entry),
    pos: extractJmdictPosCodes(entry),
  };
}

export function mapJmdictPosToProjectMarker(posCode) {
  if (posCode === 'adj-i') {
    return 'い形容詞';
  }

  if (posCode === 'adj-na') {
    return 'な形容詞';
  }

  if (posCode === 'v1') {
    return '一段動詞';
  }

  if (posCode.startsWith('v5')) {
    return '五段動詞';
  }

  return null;
}

function findCompatibleJmdictEntries(vocabularyEntry, jmdictEntries, kanjiLines) {
  const reading = normalizeComparable(vocabularyEntry.text);
  const expectedKanjiLines = splitLines(kanjiLines);

  return jmdictEntries.filter((entry) => {
    const readingMatches = entry.readings.includes(reading);

    if (!readingMatches) {
      return false;
    }

    if (expectedKanjiLines.length === 0) {
      return true;
    }

    return expectedKanjiLines.some((expectedKanji) => entry.kanji.includes(expectedKanji));
  });
}

function classifyByJmdict(vocabularyEntry, jmdictEntries, kanjiLines) {
  const compatibleEntries = findCompatibleJmdictEntries(vocabularyEntry, jmdictEntries, kanjiLines);
  const jmdictPos = unique(compatibleEntries.flatMap((entry) => entry.pos));
  const markerByPos = jmdictPos
    .map((posCode) => [posCode, mapJmdictPosToProjectMarker(posCode)])
    .filter(([, marker]) => marker !== null);
  const candidateMarkers = unique(markerByPos.map(([, marker]) => marker));

  return {
    candidateMarkers,
    jmdictPos: markerByPos.map(([posCode]) => posCode),
  };
}

function hasProjectMarker(meaningLine, marker) {
  const fullWidthGroups = meaningLine.match(/（[^）]+）/g) ?? [];
  return fullWidthGroups.some((group) => group.includes(marker));
}

function createMissingMarkerDiagnostic(entry, meaning, expectedMarker, jmdictPos, kanji) {
  return {
    ...entryDiagnosticBase(entry, meaning, kanji),
    expectedMarker,
    jmdictPos,
  };
}

function createUnresolvedDiagnostic(entry, meaning, candidateMarkers, jmdictPos, kanji) {
  return {
    ...entryDiagnosticBase(entry, meaning, kanji),
    candidateMarkers,
    jmdictPos,
  };
}

function getAllowlistReason(allowlist, entry, kanji) {
  const normalizedKanji = normalizeComparable(kanji);
  const entryKey = `${entry.stage}|${entry.text}|${normalizedKanji}`;
  return allowlist[entryKey] ?? allowlist[`${entry.stage}|${entry.text}`] ?? null;
}

function analyzeClassifiedLine(entry, meaningLine, classification, kanjiLine, diagnostics, allowlist) {
  if (classification.candidateMarkers.length === 0) {
    return;
  }

  if (classification.candidateMarkers.length > 1) {
    const reason = getAllowlistReason(allowlist, entry, kanjiLine);
    const diagnostic = createUnresolvedDiagnostic(
      entry,
      meaningLine,
      classification.candidateMarkers,
      classification.jmdictPos,
      kanjiLine,
    );

    if (reason) {
      diagnostics.allowlistedUnresolvedEntries.push({ ...diagnostic, reason });
      return;
    }

    diagnostics.unresolvedJmdictEntries.push(diagnostic);
    return;
  }

  const [expectedMarker] = classification.candidateMarkers;

  if (!hasProjectMarker(meaningLine, expectedMarker)) {
    diagnostics.missingPosMarkers.push(
      createMissingMarkerDiagnostic(entry, meaningLine, expectedMarker, classification.jmdictPos, kanjiLine),
    );
  }
}

function analyzeJmdictMarkers(entry, jmdictEntries, diagnostics, allowlist) {
  const meaningLines = splitLines(entry.meaning);
  const kanjiLines = splitLines(entry.kanji);

  if (meaningLines.length === 0) {
    return;
  }

  if (kanjiLines.length > 1 && kanjiLines.length === meaningLines.length) {
    meaningLines.forEach((meaningLine, index) => {
      const kanjiLine = kanjiLines[index] ?? '';
      const classification = classifyByJmdict(entry, jmdictEntries, kanjiLine);
      analyzeClassifiedLine(entry, meaningLine, classification, kanjiLine, diagnostics, allowlist);
    });
    return;
  }

  const classification = classifyByJmdict(entry, jmdictEntries, kanjiLines);
  const diagnosticKanji = kanjiLines.join('\n');

  for (const meaningLine of meaningLines) {
    analyzeClassifiedLine(entry, meaningLine, classification, diagnosticKanji, diagnostics, allowlist);
  }
}

export function analyzeVocabularyMeaningFormat(rawVocabularyEntries, rawJmdictEntries, options = {}) {
  if (!Array.isArray(rawVocabularyEntries)) {
    throw new TypeError('rawVocabularyEntries must be an array');
  }

  if (!Array.isArray(rawJmdictEntries)) {
    throw new TypeError('rawJmdictEntries must be an array');
  }

  const jmdictEntries = rawJmdictEntries.map(normalizeJmdictEntry);
  const unresolvedAllowlist = options.unresolvedAllowlist ?? {};
  const diagnostics = {
    halfWidthMarkerEntries: [],
    sharedMarkerEntries: [],
    missingPosMarkers: [],
    unresolvedJmdictEntries: [],
    allowlistedUnresolvedEntries: [],
  };

  for (const entry of rawVocabularyEntries) {
    if (HALF_WIDTH_MARKER_PATTERN.test(entry.meaning)) {
      diagnostics.halfWidthMarkerEntries.push(entryDiagnosticBase(entry, entry.meaning));
    }

    if (splitLines(entry.meaning).some((meaningLine) => SHARED_MARKER_PATTERN.test(meaningLine))) {
      diagnostics.sharedMarkerEntries.push(entryDiagnosticBase(entry, entry.meaning));
    }

    analyzeJmdictMarkers(entry, jmdictEntries, diagnostics, unresolvedAllowlist);
  }

  return diagnostics;
}

export function hasFullWidthProjectMarker(meaning) {
  return FULL_WIDTH_MARKER_PATTERN.test(meaning);
}

export async function assertJmdictSourceAvailable(sourceDirectoryPath) {
  try {
    const sourceStats = await stat(sourceDirectoryPath);

    if (!sourceStats.isDirectory()) {
      throw new Error();
    }
  } catch {
    throw new Error(`JMdict source data is required at ${sourceDirectoryPath}`);
  }
}

export async function loadJmdictEntriesFromDirectory(sourceDirectoryPath) {
  await assertJmdictSourceAvailable(sourceDirectoryPath);

  const entries = await readdir(sourceDirectoryPath, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(sourceDirectoryPath, entry.name))
    .sort((left, right) => left.localeCompare(right));

  if (jsonFiles.length === 0) {
    throw new Error(`JMdict source data is required at ${sourceDirectoryPath}`);
  }

  const loadedEntries = [];

  for (const jsonFile of jsonFiles) {
    const parsed = JSON.parse(await readFile(jsonFile, 'utf8'));

    if (Array.isArray(parsed)) {
      loadedEntries.push(...parsed);
      continue;
    }

    if (Array.isArray(parsed.words)) {
      loadedEntries.push(...parsed.words);
      continue;
    }

    if (Array.isArray(parsed.entries)) {
      loadedEntries.push(...parsed.entries);
    }
  }

  if (loadedEntries.length === 0) {
    throw new Error(`JMdict source data is required at ${sourceDirectoryPath}`);
  }

  return loadedEntries;
}
