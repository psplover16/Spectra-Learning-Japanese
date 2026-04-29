<script setup lang="ts">
import { computed } from 'vue';
import { getN5GrammarHighlightedParts, getN5GrammarTextHighlightedParts } from '@/modules/n5Grammar/utils/highlightParts';
import type { N5GrammarSharedNote, N5GrammarTopic } from '@/modules/n5Grammar/types/grammarNotes';

const props = defineProps<{
  topics: N5GrammarTopic[];
  sharedNotes: N5GrammarSharedNote[];
}>();

const notesById = computed(() => new Map(props.sharedNotes.map((note) => [note.id, note])));
const firstTopicIdByNoteId = computed(() => {
  const topicIdByNoteId = new Map<string, string>();

  for (const topic of props.topics) {
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

</script>

<template>
  <div class="n5-grammar-topic-stack">
    <article v-for="topic in topics" :key="topic.id" :data-testid="`n5-grammar-topic-${topic.id}`" class="n5-grammar-topic-card">
      <h3 class="n5-grammar-topic-title">{{ topic.title }}</h3>

      <ul class="n5-grammar-bullet-summary">
        <li class="n5-grammar-detail-item">{{ topic.summary }}</li>
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
