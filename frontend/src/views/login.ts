import { Vue, Component } from 'vue-property-decorator'

import {gLang} from '@/lang'

import {UserA} from '@/manage/api'
import router from '@/router'
import AppM from '@/manage/app'


@Component({})
export default class Login extends Vue {
  uiText = gLang.uiText.App.Login;
  user: UserA;

  inptUser = ''
  inptPwd = ''
  errMsg = ''

  onSubmit(){
    this.user.login(this.inptUser, this.inptPwd, (r) => {
      if (!r.ok){
        this.errMsg = this.uiText.msgLoginFailed
      } else {
        // update local user data
        const remoteData = r.data;
        const prefs = remoteData.prefs;
        prefs.userProfile.isLogged = true;
        AppM.conf = prefs;
        AppM.saveSettings();
        AppM.setAuthToken(remoteData.auth_token);
        AppM.appLoadSettings();
        this.$root.$emit('onUserLogged');
        router.push({name: 'User'});
      }
    });
  }

  constructor(){
    super();
    this.user = new UserA();
  }
}