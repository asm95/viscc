import Vue from 'vue'
import App from './App.vue'
import router from './router'

import AppC from '@/manage/app'
import Lang from '@/lang'


Vue.config.productionTip = false

AppC.conf = AppC.loadSettings()
Lang.gLang.setLang(AppC.conf.langCode)

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
