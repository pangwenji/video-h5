import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router';

import { useUserStore } from '@/store';
const routes = [
	{
		path: '/',
		redirect: {
			name: 'full-screen',
		},
	},
	{
		path: '/',
		name: 'full-screen',
		component: () => import('@/view/full-screen/full-screen.vue'),
	},
	{
		path: '/home',
		name: 'home',
		component: () => import('@/view/home/home.vue'),
	},
	{
		path: '/table-view',
		name: 'table-view',
		component: () => import('@/view/table-view/TableView.vue'),
	},
	{
		path: '/roulette',
		name: 'roulette',
		component: () => import('@/view/roulette/Roulette.vue'),
	},
	{
		path: '/bull',
		name: 'bull',
		component: () => import('@/view/bull/Bull.vue'),
	}
	
];

const router = createRouter({
	history: createWebHashHistory (),
	routes,
});


export default router;
