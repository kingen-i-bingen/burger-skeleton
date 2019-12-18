import Vue from 'vue'
import VuejsDialog from 'vuejs-dialog'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(VuejsDialog);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
