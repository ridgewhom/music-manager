import Vue from 'vue'
import App from './App.vue'
import store from "./store"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay,faPause, faAngleRight, faAngleLeft, faMusic, faEraser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router'



library.add(faPlay, faPause, faAngleRight, faAngleLeft, faMusic, faEraser)


Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
