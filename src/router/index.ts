import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: '404' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'participants',
        path: 'participants',
        component: () => import('../pages/participants/ParticipantsPage.vue'),
      },
      {
        name: 'transactions',
        path: 'transactions',
        component: () => import('../pages/transactions/TransactionsPage.vue'),
      },
      {
        name: 'theaters',
        path: '/theater',
        redirect: { name: 'theater-list' },
        component: RouteViewComponent,
        children: [
          {
            name: 'theater-list',
            path: 'all',
            component: () => import('../pages/theaters/TheatersPage.vue'),
          },
          {
            name: 'theater-create',
            path: 'create',
            component: () => import('../pages/theaters/TheaterCreate.vue'),
          },
          {
            name: 'theater-update',
            path: 'edit/:id',
            component: () => import('../pages/theaters/TheaterUpdate.vue'),
          },
        ],
      },
      {
        name: 'bundles',
        path: '/bundle',
        redirect: { name: 'bundle-list' },
        component: RouteViewComponent,
        children: [
          {
            name: 'bundle-list',
            path: 'all',
            component: () => import('../pages/bundles/BundlesPage.vue'),
          },
          {
            name: 'bundle-detail',
            path: 'detail/:id',
            component: () => import('../pages/bundles/BundleDetail.vue'),
          },
          {
            name: 'bundle-create',
            path: 'create',
            component: () => import('../pages/bundles/BundleCreate.vue'),
          },
          {
            name: 'bundle-update',
            path: 'edit/:id',
            component: () => import('../pages/bundles/BundleUpdate.vue'),
          },
        ],
      },
      {
        name: 'Attendance',
        path: '/attendance',
        component: RouteViewComponent,
        children: [
          {
            name: 'attendance-list',
            path: 'all',
            component: () => import('../pages/attendances/AttendancesPage.vue'),
          },
          {
            name: 'scan-masuk',
            path: 'scan-masuk',
            component: () => import('../pages/attendances/ScanMasuk.vue'),
          },
          {
            name: 'scan-keluar',
            path: 'scan-keluar',
            component: () => import('../pages/attendances/ScanKeluar.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: 'logout',
    path: '/auth/logout',
    component: () => import('../pages/auth/Logout.vue'), // this not together in auth layout because it make the logout function called twice
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

export default router
