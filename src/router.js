import Vue from 'vue'
import Router from 'vue-router'
import Startpage from './views/Startpage.vue'
import Ordering from './views/Ordering.vue'
import Stockpage from './views/Stockpage.vue'
import VuejsDialog from "vuejs-dialog"

Vue.use(Router)
Vue.use(VuejsDialog);

let router = new Router({
  routes: [

    {
    path: '/',
    meta: {
      title: 'Kraft Burgers',
    },
    name: 'startpage',
    component: Startpage
    },
    {
      path: '/ordering',
      meta: {
        title: 'Kraft Burgers',
      },
      name: 'ordering',
      component: Ordering
    },
    {
      path: '/stockpage',
      meta: {
        title: 'Kraft Burgers',
      },
      name: 'stockpage',
      component: Stockpage
    },
    {
      path: '/kitchen',
      meta: {
        title: 'Kitchen',
      },
      name: 'kitchen',
      // route level code-splitting
      // this generates a separate chunk (read.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "read" */ './views/Kitchen.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router;
