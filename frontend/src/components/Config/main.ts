import { Vue, Component } from 'vue-property-decorator'

import {LangCode, gLang} from '@/lang'
import AppC from '@/manage/app'
import {UserA} from '@/manage/api'

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
    savingAppText = '';
    acceptPrivacy = AppC.conf.acceptPrivacy;

    btnSaveDisabled = true;
    btnDiscardDisabled = true;

    remoteSaveError = false;

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
        AppC.saveSettings();
        this.$emit('close');
    }

    onPrivacyCbToggle(){
        AppC.conf.acceptPrivacy = this.acceptPrivacy;
        this.onConfigChanged();
    }

    onConfigChanged(){
        this.btnSaveDisabled = false;
        this.btnDiscardDisabled = false;
    }

    requestOnlineSave(){
        const userApi = new UserA();
        userApi.pushChanges((r) => {
            if (!r.ok){
                this.savingAppText = this.uiText.lblUpdatNOK;
                this.remoteSaveError = true;
            } else {
                this.savingAppText = this.uiText.lblUpdatOK;
                this.remoteSaveError = false;
            }
        });
    }

    onSaveBtnClick(){
        // disable UI while saving
        this.btnSaveDisabled = true;
        this.btnDiscardDisabled = true;
        this.savingAppText = this.uiText.lblUpdatP;
        this.requestOnlineSave();
        // also save changes locally
        AppC.saveSettings();
    }
    
    onDiscardBtnClick(){
        // only reload window
        window.location.reload();
    }

    onLangSet(ev: Event) {
        const langID = this.selectedLangID;
        gLang.setLang(langID);
        this.uiText = gLang.uiText.MainConfig;
        AppC.conf.langCode = langID;
        this.requestAppReload(true);
        this.onConfigChanged();
    }

    constructor(){
        super();
        this.availLanguages = gLang.getAllLanguages();
    }
}