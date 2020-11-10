import { Component, Vue, Prop } from 'vue-property-decorator';
import { PropType } from 'vue';

import { LLSimStackItem } from '@/sim/ll1';

import lang from '@/lang';


export interface Settings {
    showSuggestions: boolean;
    showLines: boolean;
}

const DefaultSettings: Settings = {
    showSuggestions: true,
    showLines: true
}

interface DisplayableElement {
    display: string;
}

interface LLSimStackItemView extends LLSimStackItem, DisplayableElement {}

interface ErrorMsgView {
    inputCommand: DisplayableElement;
    fatalState: string;
}

@Component({})
export default class Simulator extends Vue {

    @Prop({type: Object as PropType<Settings>, default: DefaultSettings}) readonly conf: Settings | undefined;

    uiText: any;
    stackContent: LLSimStackItemView[];
    inputStream: DisplayableElement;
    availRules: DisplayableElement[];
    commandHistory: DisplayableElement[];
    errMsg: ErrorMsgView;
    userStatus: DisplayableElement;
    inputMaxLength = 16;
    inputDisabled = false;
    curInput = '';

    mounted () {
        //AppControl.registerSimulator(this);
        //this.$on('onEditorSetGrammar', (g: Grammar) => this.onSetGrammar(g));
    }

    onUserInputCommand () {
        console.log(this.curInput);
    }

    constructor(){
        super();
        this.stackContent = [];
        this.uiText = lang.gLang.uiText.LLSim;
        this.inputStream = {display: '&lt;no input&gt;'};
        this.availRules = [];
        this.commandHistory = [];
        this.errMsg = {
            inputCommand: {display: ''},
            fatalState: ''
        };
        this.userStatus = {display: ''};
        this.inputDisabled = true;
    }
}