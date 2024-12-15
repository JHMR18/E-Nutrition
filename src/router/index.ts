import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
import DashBoard from '@/views/DashBoard.vue'
import PatientRecords from '@/views/PatientRecords.vue' 
import ReportsPage from '@/views/ReportsPage.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage,
    },
      {
        path: '/admin',
        name: 'admmin',
        component: HomeView,
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: DashBoard,
          },
          {
            path: 'patient-records',
            name: 'patient-records',
            component: PatientRecords,
          }, 
          {
            path: 'reports',
            name: 'reports',
            component: ReportsPage,
          }
        ]
      }

  ],
})

export default router
