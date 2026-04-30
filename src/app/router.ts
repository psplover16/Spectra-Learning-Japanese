import { createRouter, createWebHistory } from 'vue-router';

const PracticeView = () => import('@/modules/practice/views/PracticeView.vue');
const GrammarView = () => import('@/modules/grammar/views/GrammarView.vue');
const VocabularyView = () => import('@/modules/vocabulary/views/VocabularyView.vue');
const N1GrammarView = () => import('@/modules/grammar/views/N1GrammarView.vue');
const N2GrammarView = () => import('@/modules/grammar/views/N2GrammarView.vue');
const N3GrammarView = () => import('@/modules/grammar/views/N3GrammarView.vue');
const N4GrammarView = () => import('@/modules/grammar/views/N4GrammarView.vue');
const N5GrammarView = () => import('@/modules/n5Grammar/views/N5GrammarView.vue');

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/practice' },
    { path: '/practice', component: PracticeView, meta: { title: '50音' } },
    { path: '/grammar', component: GrammarView, meta: { title: '變化規則' } },
    { path: '/vocabulary', component: VocabularyView, meta: { title: '單字練習' } },
    { path: '/n1-grammar', component: N1GrammarView, meta: { title: 'N1文法' } },
    { path: '/n2-grammar', component: N2GrammarView, meta: { title: 'N2文法' } },
    { path: '/n3-grammar', component: N3GrammarView, meta: { title: 'N3文法' } },
    { path: '/n4-grammar', component: N4GrammarView, meta: { title: 'N4文法' } },
    { path: '/n5-grammar', component: N5GrammarView, meta: { title: 'N5文法' } }
  ]
});
