import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { PropType } from 'vue'

import { LLSimInputCommand, LLParseError, cmdType, ParseSimulator, RenderResponseMessage, Rule, itemType, Symbl } from '@/sim/ll1'
import ComponentTelemetry from './telemetry'
import lang from '@/lang';

import icons from '@/components/icons';

export interface Settings {
    showSuggestions: boolean;
    showLines: boolean;
    optMoboVer: boolean;
}

const DefaultSettings: Settings = {
    showSuggestions: true,
    showLines: true,
    optMoboVer: false
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
    hasError, isOk, isDone, isPending
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
        // then it is a token
        else if (e.id == s.grammar.emptySymbol.id){
            // if it's a empty symbol
            return `ε`;
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


@Component({
    components: {Arrow: icons.Arrow}
})
export default class Simulator extends Vue {

    @Prop({type: Object as PropType<Settings>, default: DefaultSettings}) readonly conf!: Settings;
    @Prop({type: ParseSimulator}) readonly simulator!: ParseSimulator;
    @Ref('inputCommand') readonly inputCommandElement!: HTMLInputElement;
    @Ref('commandBoxBottom') readonly inputCommandBottom!: HTMLElement;

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

    displayCommand(cmd: LLSimInputCommand, token: Symbl): DisplayableElement{
        // generate display property for a user command
        let outString = '';
        if (cmd.type == cmdType.REPL){
            outString = this.uiText.commandRepl(cmd.keyID+1);
        } else if (cmd.type == cmdType.MATCH){
            outString = this.uiText.commandMatch(token.repr);
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

    focusOnInput(scroll: boolean, focus: boolean){
        this.$nextTick(() => {
            // todo: check compatibility in
            // . https://developer.mozilla.org/pl/docs/Web/API/Element/scrollIntoView#Browser_compatibility
            if (scroll){
                this.inputCommandBottom.scrollIntoView();
            }
            if (focus){
                this.inputCommandElement.focus();
            }
        });
    }

    updateValidState(): Response {
        // update global state to check if we reached any invalid condition state
        // todo: implement
        let status = makeOK('');
        const sim = this.simulator;
        const stackIsEmpty = sim.stackIsEmpty();
        const inputString = sim.inputStream;
        const inputStringIndex = sim.inputStreamIndex;
        const istrIsComsumed = (inputStringIndex == inputString.length-1);
        let state = ObjectState.isOk;
        // first we check if we can use the LL(1) parse table which always tells us
        // . the next step - or returns an error if the parser reached an invalid
        // . state which is just a combination of invalid commands or the grammar
        // . is not LL(1)
        const nextCmd = sim.getNextCommand();
        if (stackIsEmpty && istrIsComsumed){
            // we reached the accept state with empty stack
            state = ObjectState.isDone;
            this.$emit('onState', 'done');
        }
        else if (nextCmd.hasError == LLParseError.SgErr1){
            // we don't have our LL(1) parse table to help, so we have test some
            // . corner cases
            if (stackIsEmpty && !istrIsComsumed){
                // dead end: the user can't apply any operation and there are
                // . still tokens to be consumed
                state = ObjectState.hasError;
                const remainCount = inputString.length - inputStringIndex - 1;
                status = makeError(this.uiText.stackEmptyBeforeIstr(remainCount));
            } else if (!stackIsEmpty && istrIsComsumed){
                // without the parse table we can still check for a specific case
                const stackTop = sim.getStackTop();
                if (stackTop){
                    if (stackTop.type == itemType.TOKEN){
                        // this is the only case we have certain there's nothing to do
                        // . because there's a terminal to be matched when there's no
                        // . tokens yet to be consumed
                        state = ObjectState.hasError;
                        const remainCount = sim.stack.size();
                        status = makeError(this.uiText.istrEmptyBeforeStack(remainCount));
                    } else {
                        // this is the case we have a non-terminal, no parsing table
                        // . to rely on so probrably something with the input itself
                        // . is wrong: either the grammar is not LL(1), or has
                        // . illegal rules or else. In this case we leave the user
                        // . on his/her own
                        state = ObjectState.isPending;
                    }
                }
                
            }
        }
        else if (nextCmd.hasError){
            // the simulator couldn't predict next step, so probrably we 
            // . ended in a inconsistent state because the parse table always
            // . tells the correct step to perform, given a particular parse 
            // . state (assuming the gramar is in fact LL1)
            state = ObjectState.hasError;
            status = makeError(this.uiText.noRulesCanBeApplied);
        }
        this.pending.inputStream = state;
        return status;
    }

    displayInput(): string{
        // copy array
        const sim = this.simulator;
        const currentInput = sim.inputStreamIndex;
        const content = sim.inputStream.map(e => e.repr);
        let c = 'o';
        switch(this.pending.inputStream){
            case ObjectState.hasError: c = 'e'; break;
            case ObjectState.isDone: c = 'd'; break;
            case ObjectState.isPending: c = 'p'; break;
        }
        content[currentInput] = `<span class="sim1 t ${c}">${content[currentInput]}</span>`;
        return content.join(' ');
    }

    updateInputStream(){
        // update token stream visualization
        if (!this.simulator.inputStream.length){return;}
        this.inputStream.display = this.displayInput();
    }

    setDeadlineOptsEnabled(toggle: boolean){
        // user did something terribly wrong, either reset the machine or undo
        if (toggle == true){
            this.errMsg.fatalState = this.uiText.oopsWeAreDone;
            this.setInputEnabled(false);
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
            const de = this.displayCommand(nextCmd.value, this.simulator.getCurrentToken());
            this.userStatus.display = this.uiText.nextSuggestion(de.display);
        }
    }

    onUserInputCommand (ev: KeyboardEvent) {
        // 13 is <enter>
        // todo: may fix de deprecated property keyCode
        // . more info: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        if (ev.keyCode != 13){return;}
        const userInput = this.curInput;
        if (userInput == ""){return;}
        const cmd = parseCommand(userInput);
        const token = this.simulator.getCurrentToken();
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
                    this.commandHistory.push(this.displayCommand(cmd, token));
                    this.$emit('onState', 'onCommandExecuted');
                    // we have to update entire UI if some special
                    // . condition has reached
                    const status = this.updateValidState();
                    console.log(status);
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
                    this.updateStack();
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

    onResetBtnClick(ev: MouseEvent){
        this.onReset(false);
        // log we reset the machine
        this.telemetry.dog.logCommand('r');
    }

    private updateStack(){
        // should be called at each simulator step
        const s = this.simulator.stack;
        const sz = s.size();
        const sv = this.stackContent; // sv = stack view
        this.stackContent = s.s.map(e => {
            return {display: e.value.repr}
        });
    }

    private onReset (isFirstReset: boolean){
        const inputStream = this.simulator.inputStream;
        const simGrammar = this.simulator.grammar;
        let inputDisplay = '';
        if (inputStream.length == 0){
            this.inputStream = updateDE(uiNoInput);
        } else {
            if (isFirstReset){
                // if it's the frist time the machine is booting then
                // . we have to append <eof> symbol to the input stream
                // subsequent boots doesn't need to do that
                inputStream.push(simGrammar.eofSymbol);
            }
            const tokenStream = inputStream.map(i => i.repr);
            tokenStream.pop(); // remove '$' for avoid duplicated <eof> symbol
            inputDisplay = tokenStream.join('');
            this.inputStream = {display: inputDisplay};
        }
        const stackDisplay = `${simGrammar.eofSymbol.repr} ${simGrammar.startSymbol.repr}`;
        this.questionText = this.uiText.questions.a1(stackDisplay, inputDisplay);
        this.updateStack();
        this.pending = {
            inputStream: ObjectState.isOk,
            stack: ObjectState.isOk
        }
        // reset simulator
        this.simulator.reset();
        // fill rule list
        this.availRules = simGrammar.rules.map(r => parseRule(this.simulator, r));
        // get the first suggestion
        this.updateSuggestions();
        // clear command history
        this.commandHistory = [];
        // reset any error messages
        this.setDeadlineOptsEnabled(false);
        this.setInputError(undefined);
        // we decide only based on the input-string (for now)
        const canEnableInput = inputStream.length > 0;
        // update input stream view
        this.updateInputStream();
        // allow user to input
        this.setInputEnabled(canEnableInput);
    }

    @Watch('simulator')
    onSimulatorSet(nV: ParseSimulator, oV: ParseSimulator){
        this.onReset(true);
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