import { createRouter, createWebHistory } from 'vue-router';
import PracticeView from '@/modules/practice/views/PracticeView.vue';
import GrammarView from '@/modules/grammar/views/GrammarView.vue';
import VocabularyView from '@/modules/vocabulary/views/VocabularyView.vue';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/practice' },
    { path: '/practice', component: PracticeView, meta: { title: '50音' } },
    { path: '/grammar', component: GrammarView, meta: { title: '變化規則' } },
    { path: '/vocabulary', component: VocabularyView, meta: { title: '單字練習' } },
    { path: '/n5-grammar', component: N5GrammarView, meta: { title: 'N5文法' } }
  ]
});
