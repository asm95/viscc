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
        const conf = AppM.conf;
        const profile = conf.userProfile;
        const remoteData = r.data;
        const prefs = remoteData.prefs;
        profile.prettyName = remoteData.prettyName;
        profile.isLogged = true;
        conf.acceptPrivacy = prefs.acceptPrivacy;
        conf.langCode = prefs.langCode;
        AppM.saveSettings();
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