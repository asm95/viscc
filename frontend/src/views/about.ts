import { Vue, Component } from 'vue-property-decorator'

import AppC from '@/manage/app'
import {LangCode} from '@/lang'

@Component({})
export default class About extends Vue {
  lang: string;

  private getLang(){
    let lang = 'enUS'
    switch(AppC.conf.langCode){
      case LangCode.ptBR: lang = 'ptBR'; break;
    }
    return lang;
  }

  constructor(){
    super();
    this.lang = this.getLang();
  }
}