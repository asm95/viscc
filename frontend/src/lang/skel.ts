export interface UITextS {
    langTitle: string;
    version: (v: string) => string;
    // deeply nested strings can get pretty complicated
    GEditor: any;
    LLView: any;
    LLSim: any;
    MainConfig: any;
}

export class TextMarkup {
    public static markCode(s: string): string {
        return `<span class="c">${s}</span>`
    }

    public static MarkBold(s: string): string {
        return `<span class="t tb">${s}</span>`;
    }
}
