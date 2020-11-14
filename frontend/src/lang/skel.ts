export interface UITextS {
    version: (v: string) => string;
    about: {
        me: string;
    };
    // deeply nested strings can get pretty complicated
    GEditor: any;
    LLView: any;
    LLSim: any;
}

export class TextMarkup {
    public static markCode(s: string): string {
        return `<span class="c">${s}</span>`
    }

    public static MarkBold(s: string): string {
        return `<span class="t tb">${s}</span>`;
    }
}
