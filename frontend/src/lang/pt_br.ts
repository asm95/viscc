import {IUIText, IGEditorText} from './skel';

const UIText: IUIText = {
    version: v => `Versão ${v}`,
    about: {
        me: 'olá'
    }
}

const GEditorText: IGEditorText = {
    badRule: 'Regra Inválida'
}

export default {UIText, GEditorText};