import Vue from 'vue'
import App from './App.vue'
import router from './router'

import AppControl from '@/manage/app'

Vue.config.productionTip = false

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

AppControl.setApp(app);
