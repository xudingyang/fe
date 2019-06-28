import Vue from 'vue'
import Router from 'vue-router'
import VGoods from '@/components/goods/VGoods'
import VSeller from '@/components/seller/VSeller'
import VRatings from '@/components/ratings/VRatings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      component: VGoods
    },
    {
      path: '/seller',
      component: VSeller
    },
    {
      path: '/ratings',
      component: VRatings
    }
  ]
})
