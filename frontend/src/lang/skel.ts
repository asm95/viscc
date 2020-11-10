export interface IUIText {
    version: (v: string) => string;
    about: {
        me: string
    }
}

export interface IGEditorText {
    badRule: string;
}