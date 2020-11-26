import Vue from 'vue'
import App from './App.vue'
import router from './router'

import AppC from '@/manage/app'

Vue.config.productionTip = false

AppC.appLoadSettings()

const app = new Vue({
  router,
  render: h => h(App),
  mounted (){
    if (! AppC.loadFailed && AppC.conf.userProfile.isLogged){ 
      // emit logged user info
      this.$emit('onUserLogged')
    }
  }

}).$mount('#app')

AppC.setApp(app)
