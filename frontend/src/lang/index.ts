import enUS from './en_us';
import ptBR from './pt_br';

import {IUIText, IGEditorText} from './skel';

enum LangCode {
    enUS = 0,
    ptBR
}

class LangManager {
    private code: LangCode;
    public ui_text: IUIText;
    public geditor_text: IGEditorText;

    setLang(code: LangCode){
        switch(code){
            case LangCode.ptBR:
                this.ui_text = ptBR.UIText;
                this.geditor_text = ptBR.GEditorText;
                break;
        }
        this.code = code;
    }

    constructor(){
        this.code = LangCode.enUS;
        this.ui_text = enUS.UIText;
        this.geditor_text = enUS.GEditorText;
    }
}

const gLang = new LangManager();

export default {gLang, LangCode};