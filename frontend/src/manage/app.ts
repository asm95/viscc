import Vue from 'vue'

import Lang, { LangCode } from '@/lang'

interface LoggedUser {
    isLogged: boolean;
    prettyName: string;
    orgID: string;
}

interface AppSettings {
    langCode: LangCode;
    acceptPrivacy: boolean;
    userProfile: LoggedUser;
}

const defaultSettings: AppSettings = {
    langCode: LangCode.enUS,
    acceptPrivacy: true,
    userProfile: {
        isLogged: false,
        prettyName: 'Unmaed User',
        orgID: '000'
    }
}


class AppController {
    private app: Vue | null;
    private appID: string;
    private authToken = '';
    conf: AppSettings;
    saveSupported: boolean;
    loadFailed = false;

    saveSettings () {
        if (!this.isSaveSupported){return;}
        const ls = window.localStorage;
        const key = `${this.appID}:conf`;
        ls.setItem(key, JSON.stringify(this.conf));
    }

    setAuthToken(newAuth: string){
        if (!this.isSaveSupported){return;}
        const ls = window.localStorage;
        const key = `${this.appID}:authToken`;
        this.authToken = newAuth;
        ls.setItem(key, this.authToken);
    }
    getAuthToken(){
        return this.authToken;
    }

    private loadSettings (): AppSettings {
        if(!this.isSaveSupported){return defaultSettings;}
        const ls = window.localStorage;
        const key = `${this.appID}:conf`;
        const ds = defaultSettings;
        try{
            const val = JSON.parse(ls.getItem(key) || '') as AppSettings;
            console.log(val);
            if (typeof val.langCode == "undefined"){val.langCode = ds.langCode;}
            if (typeof val.acceptPrivacy == "undefined"){val.acceptPrivacy = ds.acceptPrivacy;}
            return val;
        } catch (e){
            this.conf = Object.assign({}, defaultSettings);
            this.loadFailed = true;
        }
        return defaultSettings;
    }

    appLoadSettings(){
        const ls = window.localStorage;
        const key = `${this.appID}:authToken`;
        this.authToken = ls.getItem(key) || '';
        this.conf = this.loadSettings();
        Lang.gLang.setLang(this.conf.langCode);
    }

    logoutUser () {
        this.conf.userProfile = Object.assign({}, defaultSettings.userProfile);
        this.saveSettings();
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
