import enUS from './en_us';
import ptBR from './pt_br';

import {UITextS} from './skel';

export enum LangCode {
    enUS = 0,
    ptBR = 1
}

interface LangInfo {
    title: string;
    code: LangCode;
}

class LangManager {
    private code: LangCode;
    private allLang: LangInfo[] = [];
    private _uiText: UITextS;

    setLang(code: LangCode){
        let nv = enUS.UIText;
        switch(code){
            case LangCode.ptBR: nv = ptBR.UIText; break;
        }
        this._uiText = nv;
        this.code = code;
    }

    getCode(): LangCode{
        return this.code;
    }

    getAllLanguages(): LangInfo[] {
        return this.allLang;
    }

    public get uiText(){
        return this._uiText;
    }

    constructor(){
        this.code = LangCode.enUS;
        this._uiText = enUS.UIText;
        this.allLang.push({title: enUS.UIText.langTitle, code: LangCode.enUS});
        this.allLang.push({title: ptBR.UIText.langTitle, code: LangCode.ptBR});
    }
}

export const gLang = new LangManager();

export default {gLang, LangCode};