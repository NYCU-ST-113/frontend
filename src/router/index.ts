import AdminLayout from '@/layout/AdminLayout.vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import AdminApplicationsPage from '@/pages/AdminApplicationsPage.vue'
import AdminDashboardPage from '@/pages/AdminDashboardPage.vue'
import AdminMailPage from '@/pages/AdminMailPage.vue'
import AdminPaymentsPage from '@/pages/AdminPaymentsPage.vue'
import AdminProfilePage from '@/pages/AdminProfilePage.vue'
import ApplicationsPage from '@/pages/ApplicationsPage.vue'
import CallbackPage from '@/pages/CallbackPage.vue'
import CreateApplicationPage from '@/pages/CreateApplicationPage.vue'
import PaymentsPage from '@/pages/PaymentsPage.vue'
import TermsPage from '@/pages/TermsPage.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
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
      path: '/auth/callback',
      name: 'callback',
      component: CallbackPage,
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: DashboardPage,
        },
        {
          path: '/applications',
          name: 'applications',
          component: ApplicationsPage,
        },
        {
          path: 'applications/create',
          name: 'create-application',
          component: CreateApplicationPage,
        },
        {
          path: '/payments',
          name: 'payments',
          component: PaymentsPage,
        },
        {
          path: '/terms',
          name: 'terms-of-use',
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
          name: 'admin-home',
          component: AdminDashboardPage,
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: AdminProfilePage,
        },
        {
          path: 'applications',
          name: 'admin-applications',
          component: AdminApplicationsPage,
        },
        {
          path: 'payments',
          name: 'admin-payments',
          component: AdminPaymentsPage,
        },
        {
          path: 'mail',
          name: 'admin-mail',
          component: AdminMailPage,
        },
      ],
    },
  ],
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()

  if (to.name !== 'login' && to.name !== 'callback' && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
