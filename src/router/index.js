import Vue from 'vue'
import Router from 'vue-router'
import VueLazyload from 'vue-lazyload'
import PhotoStream from '@/components/PhotoStream'
import PhotoSet from '@/components/PhotoSet'
import SinglePage from '@/components/SinglePage'

Vue.use(Router)
Vue.use(VueLazyload)

// todo: scroll previous position when history back
// use 'scrollBehavior' in router?

export default new Router({
  routes: [
    {
      path: '/:index?',
      name: 'PhotoStream',
      component: PhotoStream
    },
    {
      path: '/photoset/:photoset_id/:index?',
      name: 'PhotoSet',
      component: PhotoSet
    },
    {
      path: '/photo/:photoset_id/:photo_id',
      name: 'SinglePage',
      component: SinglePage
    }
  ]
})
