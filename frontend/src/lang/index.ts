import enUS from './en_us';
import ptBR from './pt_br';

import {UITextS, GEditorTextS} from './skel';

enum LangCode {
    enUS = 0,
    ptBR
}

class LangManager {
    private code: LangCode;
    public uiText: UITextS;
    public EditorText: GEditorTextS;

    setLang(code: LangCode){
        switch(code){
            case LangCode.ptBR:
                this.uiText = ptBR.UIText;
                this.EditorText = ptBR.GEditorText;
                break;
        }
        this.code = code;
    }

    constructor(){
        this.code = LangCode.enUS;
        this.uiText = enUS.UIText;
        this.EditorText = enUS.GEditorText;
    }
}

const gLang = new LangManager();

export default {gLang, LangCode};