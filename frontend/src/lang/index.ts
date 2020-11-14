import enUS from './en_us';
import ptBR from './pt_br';

import {UITextS} from './skel';

enum LangCode {
    enUS = 0,
    ptBR
}

class LangManager {
    private code: LangCode;
    public uiText: UITextS;

    setLang(code: LangCode){
        switch(code){
            case LangCode.ptBR:
                this.uiText = ptBR.UIText;
                break;
        }
        this.code = code;
    }

    constructor(){
        this.code = LangCode.enUS;
        this.uiText = enUS.UIText;
    }
}

const gLang = new LangManager();

export default {gLang, LangCode};