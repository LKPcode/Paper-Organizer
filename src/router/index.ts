import { createRouter, createWebHistory } from 'vue-router'
// import { deactivateTabs } from '@/composables/global/useChromeTabs'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
   
    {
      // :view can be "viewer" or "workspace" or "starter" , "library"
      path: '/:view/:view_id',
      name: 'view',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ViewerView.vue'),

    }
  ]
})


export default router
