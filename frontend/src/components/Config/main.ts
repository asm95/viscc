import { Vue, Component } from 'vue-property-decorator'

import {LangCode, gLang} from '@/lang'
import AppC from '@/manage/app'

import icon from '@/components/icons'


interface LangInfo {
    title: string;
    code: LangCode;
}

@Component({
    components: {
        CircleFill: icon.CircleFill
    }
})
export default class MainConfig extends Vue {
    selectedLangID = gLang.getCode();
    availLanguages: LangInfo[];
    uiText = gLang.uiText.MainConfig;
    reloadAppText = '';

    requestAppReload(toggle: boolean){
        if (toggle){
            this.reloadAppText = this.uiText.lblAppRestartInfo;
        }
    }

    onReloadAppBtnClick(){
        AppC.saveSettings();
        window.location.reload();
    }

    onCloseBtnClick(){
        this.$emit('close');
    }

    onLangSet(ev: Event) {
        const langID = this.selectedLangID;
        gLang.setLang(langID);
        this.uiText = gLang.uiText.MainConfig;
        AppC.conf.langCode = langID;
        this.requestAppReload(true);
    }

    constructor(){
        super();
        this.availLanguages = gLang.getAllLanguages();
    }
}