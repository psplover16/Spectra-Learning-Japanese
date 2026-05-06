import { createRouter, createWebHistory } from 'vue-router';
import { routeComponentLoaders } from '@/app/routePreload';

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/practice' },
    { path: '/practice', component: routeComponentLoaders['/practice'], meta: { title: '50音' } },
    { path: '/grammar', component: routeComponentLoaders['/grammar'], meta: { title: '變化規則' } },
    { path: '/vocabulary', component: routeComponentLoaders['/vocabulary'], meta: { title: '單字練習' } },
    { path: '/n1-grammar', component: routeComponentLoaders['/n1-grammar'], meta: { title: 'N1文法' } },
    { path: '/n2-grammar', component: routeComponentLoaders['/n2-grammar'], meta: { title: 'N2文法' } },
    { path: '/n3-grammar', component: routeComponentLoaders['/n3-grammar'], meta: { title: 'N3文法' } },
    { path: '/n4-grammar', component: routeComponentLoaders['/n4-grammar'], meta: { title: 'N4文法' } },
    { path: '/n5-grammar', component: routeComponentLoaders['/n5-grammar'], meta: { title: 'N5文法' } }
  ]
});
