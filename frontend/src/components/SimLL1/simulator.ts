import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { PropType } from 'vue'

import { LLSimInputCommand, cmdType, ParseSimulator, RenderResponseMessage, Rule, itemType } from '@/sim/ll1'
import ComponentTelemetry from './telemetry'
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
    update?: () => string;
}

function updateDE(e: DisplayableElement): DisplayableElement{
    if (e.update){e.display = e.update();} return e;
}

type LLSimStackItemView = DisplayableElement;

interface ErrorMsgView {
    inputCommand: DisplayableElement;
    fatalState: string;
}

enum ObjectState {
    hasError, isOk, isDone
}

interface SimulatorStatus {
    inputStream: ObjectState;
    stack: ObjectState;
}

interface TelemetryAdapter {
    dog: ComponentTelemetry;
}

interface Response {
    hasError: boolean;
    msg: string;
}

function parseCommand (cmdStr: string): LLSimInputCommand | undefined {
    const replaceCmdPtr = /[rR]\s*([+-]?\d+)$/;
    const m1 = replaceCmdPtr.exec(cmdStr);
    if (m1){
        // replace rule matched
        return {type: cmdType.REPL, keyID: (parseInt(m1[1])-1)}
    }
    const matchCmdPtr = /[mM]$/;
    const m2 = matchCmdPtr.exec(cmdStr);
    if (m2){
        // match rule matched
        return {type: cmdType.MATCH, keyID: -1};
    }
    return undefined;
}
function parseRule (s: ParseSimulator, rule: Rule): DisplayableElement {
    // generate .display entry for rules so the viewer can see in
    // . format "A -> b"
    // S → ( S ) S
    const rhsSymbols = rule.rhs.map(e => {
        const rType = s.itemTypeMap.get(e.id);
        if (rType == itemType.NTERM){
            return `<b>${e.repr}</b>`;
        }
        return e.repr;
    });
    return {display: `<b>${rule.lhs.repr}</b> → ${rhsSymbols.join(' ')}`};
}

function makeError(msg: string): Response {
    return {hasError: true, msg: msg};
}

function makeOK(msg: string): Response {
    return {hasError: false, msg: msg};
}

const langText: any = lang.gLang.uiText.LLSim;
const uiNoInput: DisplayableElement = {display: '', update: () => `&lt;${langText.noInputGiven}&gt;`};


@Component({})
export default class Simulator extends Vue {

    @Prop({type: Object as PropType<Settings>, default: DefaultSettings}) readonly conf!: Settings;
    @Prop({type: ParseSimulator}) readonly simulator!: ParseSimulator;

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
    pending: SimulatorStatus;
    questionText = '';

    telemetry: TelemetryAdapter;

    checkCommand(cmd: LLSimInputCommand): Response{
        if (cmd.type == cmdType.REPL){
            if (! this.simulator.rules.get(cmd.keyID)){
                return makeError(this.uiText.invalidRuleID(cmd.keyID+1));
            }
        } else if (cmd.type == cmdType.MATCH){
            // nothing can go wrong with match
        }
        return makeOK('');
    }

    displayCommand(cmd: LLSimInputCommand): DisplayableElement{
        // generate display property for a user command
        let outString = '';
        if (cmd.type == cmdType.REPL){
            outString = this.uiText.commandRepl(cmd.keyID+1);
        } else if (cmd.type == cmdType.MATCH){
            const token = this.simulator.grammar.tokens.find(i => i.id == cmd.keyID) || '&lt;unk&gt;';
            outString = this.uiText.commandMatch(token);
        } else {
            outString = this.uiText.unkCommand;
        }
        return {display: outString};
    }

    setInputError(msg: string | undefined){
        if (!msg){
            this.errMsg.inputCommand = {display: ''};
        } else {
            if (this.conf.showSuggestions && this.pending.inputStream == ObjectState.hasError){
                // when we're in a invalid state on the parser, clear the suggestions
                this.userStatus = {display: ''};
            }
            // todo: this has message
            this.errMsg.inputCommand = {
                display: this.uiText.errPrelude + " " + msg
            }
        }
    }

    setInputEnabled(toggle: boolean){
        this.inputDisabled = ! toggle;
    }

    updateValidState(): Response{
        // update global state to check if we reached any invalid condition state
        // todo: implement
        const status = makeOK('');
        return status;
    }

    displayInput(): string{
        // copy array
        const sim = this.simulator;
        const currentInput = sim.inputStreamIndex;
        const content = sim.inputStream.map(e => e.repr);
        const curClass = 't ' + this.pending.inputStream;
        content[currentInput] = '<span class="sim1 '+curClass+'">' + content[currentInput] + '</span>';
        return content.join(' ');
    }

    updateInputStream(){
        // update token stream visualization
        this.inputStream.display = this.displayInput();
    }

    setDeadlineOptsEnabled(toggle: boolean){
        // user did something terribly wrong, either reset the machine or undo
        if (toggle == true){
            this.errMsg.fatalState = this.uiText.oopsWeAreDone;
        } else {
            this.errMsg.fatalState = '';
        }
    }

    showSuccessInfo(){
        this.userStatus = {display: this.uiText.youReDone};
        this.setInputEnabled(false);
    }

    updateSuggestions(){
        if (! this.conf.showSuggestions){
            this.userStatus.display = '';
        }
        const nextCmd = this.simulator.getNextCommand();
        if (nextCmd.hasError){
            // means either parsing table is not set or no command can be applied
            return;
        } else {
            this.userStatus.display = this.uiText.nextSuggestion(this.displayCommand(nextCmd.value).display);
        }
    }

    onUserInputCommand (ev: KeyboardEvent) {
        // 13 is <enter>
        // todo: may fix de deprecated property keyCode
        // . more info: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        if (ev.keyCode != 13){return;}
        const userInput = this.curInput;
        const sim = this.simulator;
        const cmd = parseCommand(userInput);
        let simEnded = false;
        if (! cmd){
            // input is invalid, let's warn the user
            this.setInputError(this.uiText.invalidCommand(userInput));
            // log a invalid command
            this.telemetry.dog.logCommand('<' + userInput);
        } else {
            // clear any error messages
            this.setInputError(undefined);
            // log a valid command
            this.telemetry.dog.logCommand(userInput);
            // apply command
            const status = this.checkCommand(cmd);
            if (status.hasError){
                this.setInputError(status.msg);
            } else {
                // command is valid
                const status = this.simulator.applyCommand(cmd);
                if (status.hasError){
                    this.setInputError(RenderResponseMessage(status));
                } else {
                    // successful command
                    // add to command history
                    this.commandHistory.push(this.displayCommand(cmd));
                    // we have to update entire UI if some special
                    // . condition has reached
                    const status = this.updateValidState();
                    if (status.hasError){
                        // we need to either to undo or reset the machine
                        this.setInputError(status.msg);
                        this.setDeadlineOptsEnabled(true);
                        simEnded = true;
                    } else {
                        if (this.pending.inputStream == ObjectState.isDone){
                        this.showSuccessInfo();
                        simEnded = true;
                        } else {
                        // no special cases were reached, so we 
                        // . provide suggestions for the next round
                        // . if enabled
                        this.updateSuggestions();
                        }
                    }
                    this.updateInputStream();
                    // also clear the input
                    this.curInput = '';
                }
            }
        }
        if (simEnded){
        // log we reached the end of simulation
        this.telemetry.dog.logCommand('e');
        }
    }

    private updateStack(){
        // should be called at each simulator step
        const s = this.simulator.stack;
        const sz = s.size();
        const sv = this.stackContent; // sv = stack view
        if (sz > sv.length){
            // element pushed
            const e = s.getTop();
            sv.push({display: e ? e.value.repr : '??'});
        } else if (sz < sv.length) {
            sv.pop();
        }
    }

    private onReset (){
        const inputStream = this.simulator.inputStream;
        let inputDisplay = '';
        if (inputStream.length == 0){
            this.inputStream = updateDE(uiNoInput);
        } else {
            inputDisplay = inputStream.map(i => i.repr).join('');
            this.inputStream = {display: inputDisplay}
            this.updateInputStream();
        }
        this.questionText = this.uiText.questions.a1('$ S', inputDisplay);
        this.updateStack();
        this.pending = {
            inputStream: ObjectState.isOk,
            stack: ObjectState.isOk
        }
        // fill rule list
        this.availRules = this.simulator.grammar.rules.map(r => parseRule(this.simulator, r));
        // get the first suggestion
        this.updateSuggestions();
        // clear command history
        this.commandHistory = [];
        // allow user to input and reset any error messages
        this.setDeadlineOptsEnabled(false);
        this.setInputError(undefined);
        // we decide only based on the input-string (for now)
        const canEnableInput = inputStream.length > 0;
        this.setInputEnabled(canEnableInput);
    }

    @Watch('simulator')
    onSimulatorSet(nV: ParseSimulator, oV: ParseSimulator){
        this.onReset();
    }

    constructor(){
        super();
        this.stackContent = [];
        this.uiText = lang.gLang.uiText.LLSim;
        this.inputStream = updateDE(uiNoInput);
        this.availRules = [];
        this.commandHistory = [];
        this.errMsg = {
            inputCommand: {display: ''},
            fatalState: ''
        };
        this.userStatus = {display: ''};
        this.inputDisabled = true;
        //this.conf = DefaultSettings;
        this.pending = {
            inputStream: ObjectState.isOk,
            stack: ObjectState.isOk
        }
        this.telemetry = {dog: new ComponentTelemetry()};
    }
}