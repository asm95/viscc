import Vue from 'vue'

import { LangCode } from '@/lang'

interface AppSettings {
    langCode: LangCode;
    acceptPrivacy: boolean;
}

const defaultSettings: AppSettings = {
    langCode: LangCode.enUS,
    acceptPrivacy: true
}


class AppController {
    private app: Vue | null;
    private appID: string;
    conf: AppSettings;
    saveSupported: boolean;
    loadFailed = false;

    saveSettings () {
        if (!this.isSaveSupported){return;}
        const ls = window.localStorage;
        const key = `${this.appID}:conf`;
        ls.setItem(key, JSON.stringify(this.conf));
    }

    loadSettings (): AppSettings {
        if(!this.isSaveSupported){return defaultSettings;}
        const ls = window.localStorage;
        const key = `${this.appID}:conf`;
        const ds = defaultSettings;
        try{
            const val = JSON.parse(ls.getItem(key) || '{}') as AppSettings;
            console.log(val);
            if (typeof val.langCode == "undefined"){val.langCode = ds.langCode;}
            if (typeof val.acceptPrivacy == "undefined"){val.acceptPrivacy = ds.acceptPrivacy;}
            return val;
        } catch (e){
            this.loadFailed = true;
        }
        return defaultSettings;
    }

    setApp(app: Vue){
        this.app = app;
    }

    isSaveSupported(): boolean {
        if (window.localStorage){return true;}
        return false;
    }

    constructor(){
        this.app = null;
        this.saveSupported = this.isSaveSupported();
        this.appID = 'viscc';
        this.conf = defaultSettings;
    }
}

// signleton
const insAppCntrl = new AppController();

export default insAppCntrl;
