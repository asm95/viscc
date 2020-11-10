import {IUIText, IGEditorText} from './skel';

const UIText: IUIText = {
    version: v => `Version ${v}`,
    about: {
        me: 'hello'
    }
}

const GEditorText: IGEditorText = {
    badRule: 'Invalid rule'
}

export default {UIText, GEditorText};