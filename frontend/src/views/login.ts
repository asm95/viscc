import { Vue, Component } from 'vue-property-decorator'

import {gLang} from '@/lang'

@Component({})
export default class Login extends Vue {
  uiText = gLang.uiText.App.Login;

  constructor(){
    super();
  }
}