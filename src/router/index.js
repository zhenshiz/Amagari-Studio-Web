import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/LayoutIndex.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/main/MainPage.vue'),
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/map/MapPage.vue'),
      },
      {
        path: 'map/:mapId',
        name: 'map-detail',
        component: () => import('@/views/map/MapDetailPage.vue'),
      },
      {
        path: 'tools',
        name: 'tools',
        component: () => import('@/views/tools/ToolsPage.vue'),
      },
      {
        path: 'install',
        name: 'localization-install',
        component: () => import('@/views/install/InstallPage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/about/AboutPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/NotFound.vue'),
  },
]

const router = createRouter({
  history:
    import.meta.env.MODE === 'offline'
      ? createWebHashHistory()
      : createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
