import AdminLayout from '@/layout/AdminLayout.vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import ApplicationsPage from '@/pages/ApplicationsPage.vue'
import PaymentsPage from '@/pages/PaymentsPage.vue'
import TermsPage from '@/pages/TermsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomePage,
        },
        {
          path: '/applications',
          name: 'applications',
          component: ApplicationsPage,
        },
        {
          path: '/payments',
          name: 'payments',
          component: PaymentsPage,
        },
        {
          path: '/terms',
          name: 'terms of use',
          component: TermsPage,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'home2',
          component: HomePage,
        },
      ],
    },
  ],
})

// router.beforeEach((to, _, next) => {
//   const isAuthenticated = localStorage.getItem('isAuthenticated')
//   if (to.name !== 'login' && !isAuthenticated) {
//     next({ name: 'login' })
//   } else {
//     next()
//   }
// })

export default router
