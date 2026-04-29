<script setup lang="ts">
import { computed } from 'vue';
import { getN5GrammarHighlightedParts, getN5GrammarTextHighlightedParts } from '@/modules/n5Grammar/utils/highlightParts';
import type {
  N5GrammarSection,
  N5GrammarSharedNote,
  N5GrammarTableExampleGroup,
  N5GrammarTopic
} from '@/modules/n5Grammar/types/grammarNotes';

const props = defineProps<{
  section: N5GrammarSection;
}>();

const notesById = computed(() => new Map(props.section.sharedNotes.map((note) => [note.id, note])));
const columnLabels = computed(() => props.section.table?.columns.slice(1) ?? []);
const rowLabels = computed(() => new Map((props.section.table?.rows ?? []).map((row) => [row.id, row.label])));
const tableExampleGroups = computed(() => props.section.tableExampleGroups ?? []);
const firstTopicIdByNoteId = computed(() => {
  const topicIdByNoteId = new Map<string, string>();

  for (const topic of props.section.topics) {
    for (const id of topic.sharedNoteIds) {
      if (!topicIdByNoteId.has(id)) {
        topicIdByNoteId.set(id, topic.id);
      }
    }
  }

  return topicIdByNoteId;
});

function resolveNotes(topic: N5GrammarTopic) {
  return topic.sharedNoteIds
    .filter((id) => firstTopicIdByNoteId.value.get(id) === topic.id)
    .map((id) => notesById.value.get(id))
    .filter((note): note is N5GrammarSharedNote => Boolean(note));
}

function resolveRowLabel(group: N5GrammarTableExampleGroup) {
  return rowLabels.value.get(group.rowId) ?? group.rowId;
}

function resolveColumnLabel(group: N5GrammarTableExampleGroup) {
  return columnLabels.value[group.columnIndex] ?? `第 ${group.columnIndex + 1} 欄`;
}

</script>

<template>
  <div class="n5-grammar-topic-stack">
    <div v-if="section.table" class="n5-grammar-table-shell">
      <table :data-testid="`n5-grammar-compare-table-${section.id}`" class="n5-grammar-table">
        <thead>
          <tr>
            <th class="n5-grammar-table-head-cell">{{ section.table.columns[0] }}</th>
            <th v-for="column in section.table.columns.slice(1)" :key="column" class="n5-grammar-table-head-cell">
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in section.table.rows" :key="row.id">
            <th class="n5-grammar-table-row-head">{{ row.label }}</th>
            <td v-for="value in row.values" :key="`${row.id}-${value}`" class="n5-grammar-table-body-cell">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="tableExampleGroups.length" class="n5-grammar-table-example-stack">
      <article
        v-for="group in tableExampleGroups"
        :key="group.id"
        :data-testid="`n5-grammar-table-example-${group.id}`"
        class="n5-grammar-table-example-card"
      >
        <div class="n5-grammar-table-example-header">
          <div class="n5-grammar-subheading">對應變化</div>
          <h3 class="n5-grammar-table-example-title">{{ resolveRowLabel(group) }}｜{{ resolveColumnLabel(group) }}</h3>
        </div>

        <div class="n5-grammar-table-example-forms">
          <span v-for="form in group.forms" :key="`${group.id}-${form}`" class="n5-grammar-table-example-form">
            {{ form }}
          </span>
        </div>

        <div v-if="group.note" class="n5-grammar-table-example-note">{{ group.note }}</div>

        <div v-if="group.examples.length" class="n5-grammar-example-box">
          <div class="n5-grammar-subheading">例句</div>
          <div v-for="example in group.examples" :key="example.id" class="n5-grammar-example-card">
            <div class="n5-grammar-example-japanese">
              <span
                v-for="(part, partIndex) in getN5GrammarHighlightedParts(example)"
                :key="`${example.id}-${partIndex}`"
                :class="{ 'n5-grammar-example-highlight': part.highlighted }"
              >
                {{ part.text }}
              </span>
            </div>
            <div v-if="example.reading" class="n5-grammar-example-reading">{{ example.reading }}</div>
            <div class="n5-grammar-example-translation">{{ example.translation }}</div>
            <div v-if="example.note" class="n5-grammar-example-note">{{ example.note }}</div>
          </div>
        </div>
      </article>
    </div>

    <article v-for="topic in section.topics" :key="topic.id" :data-testid="`n5-grammar-topic-${topic.id}`" class="n5-grammar-topic-card">
      <h3 class="n5-grammar-topic-title">{{ topic.title }}</h3>
      <p class="n5-grammar-topic-summary">{{ topic.summary }}</p>

      <ul v-if="topic.details.length" class="n5-grammar-detail-list">
        <li v-for="(detail, detailIndex) in topic.details" :key="`${topic.id}-${detailIndex}`" class="n5-grammar-detail-item">
          <span
            v-for="(part, partIndex) in getN5GrammarTextHighlightedParts(detail, topic.detailHighlightTerms)"
            :key="`${topic.id}-${detailIndex}-${partIndex}`"
            :class="{ 'n5-grammar-detail-highlight': part.highlighted }"
          >
            {{ part.text }}
          </span>
        </li>
      </ul>

      <div v-if="resolveNotes(topic).length" class="n5-grammar-shared-note-box">
        <div class="n5-grammar-subheading">共通提醒</div>
        <div v-for="note in resolveNotes(topic)" :key="note.id" class="n5-grammar-shared-note-line">
          <strong>{{ note.title }}：</strong>{{ note.content }}
        </div>
      </div>

      <div v-if="topic.examples.length" class="n5-grammar-example-box">
        <div class="n5-grammar-subheading">例句</div>
        <div v-for="example in topic.examples" :key="example.id" class="n5-grammar-example-card">
          <div class="n5-grammar-example-japanese">
            <span
              v-for="(part, partIndex) in getN5GrammarHighlightedParts(example)"
              :key="`${example.id}-${partIndex}`"
              :class="{ 'n5-grammar-example-highlight': part.highlighted }"
            >
              {{ part.text }}
            </span>
          </div>
          <div v-if="example.reading" class="n5-grammar-example-reading">{{ example.reading }}</div>
          <div class="n5-grammar-example-translation">{{ example.translation }}</div>
          <div v-if="example.note" class="n5-grammar-example-note">{{ example.note }}</div>
        </div>
      </div>
    </article>
  </div>
</template>
