import {UITextS, GEditorTextS, TextMarkup} from './skel';

const mc = TextMarkup.markCode;
const mb = TextMarkup.MarkBold;
type str = string;
type int = number;

const rpw1 = (c: number) => (c>1) ? 'elements' : 'element';

const UIText: UITextS = {
    version: v => `Version ${v}`,
    about: {
        me: 'hello'
    },
    LLSim: {
        errPrelude: 'Error:',
        invalidCommand: (c: str) => `Command ${mc(c)} is invalid.`,
        invalidRuleID: (r: str) => `rule ${mc(r)} does not exist`,
        invalidToken: (t: str) => `token ${mc(t)} does not exist in token list`,
        commandRepl: (r: string) => `replace using rule ${r}`,
        commandMatch: (t: string) => `match of token "${mc(t)}" of input stream`,
        unkCommand: 'unknown command',
        istrEmptyBeforeStack: (s: int) => `input stream is empty before stack, which still conatains ${s} ${rpw1(s)}`,
        stackEmptyBeforeIstr: (is: int) => `stack is empty before input stream, which still conatains ${is} ${rpw1(is)}`,
        noRulesCanBeApplied: 'invalid parser state: no rules can be applied according to the LL(1) parse table',
        nextSuggestion: (cmd: str) => `Suggestion: ${cmd}`,
        oopsWeAreDone: `${mb('Oops!')} Looks like you reached an unrecoverable state. Either reset or undo your changes to proceed`,
        youReDone: 'You reached the end of the simulation. The machine accepts the input stream.',
        noInputGiven: 'no input',
        invalidInput: 'Error: invalid input',
        questions: {
            a1: (s: str, i: str) => (
                `Given the stack ${mc(s ? s : '??')} and input stream ${mc(i ? (i+' $') : '??')} and rules below, 
                what steps should be performed in order to accept the input string?`
            )
        },
        stack: {
            tblHeaderPos: 'Position',
            tblHeaderCnt: 'Content',
            lblIsEmpty: 'empty'
         },
         options: {
            lblTitle: 'Settings',
            lblLang: 'Display Language:',
            lblPrivacy: 'Privacy',
            lblUI: 'User Interface',
            cbTextPrivacy: 'I agree to send usage data according to the Terms of Service.',
            lblInfo1: 'Changes are saved automatically',
            lblUpdatP: 'Saving changes...',
            lblUpdatOK: 'Changes were saved',
            lblUpdatNOK: 'Changes couldn\'t be saved',
            lblSimulation: 'Simulation',
            cbTextEnableSuggestions: 'Enable simulation suggestions',
            cbTextEnableMoboVer: 'Enable mobile version'
         },
         help: {
            lblTitle: 'Help',
            content: (
               `Commands: <br> ${mc('r &lt;ruleID&gt;')} - replace by a rule given it's ID` +
               `<br> ${mc('m')} - maches token in the top of the stack with the input stream`
            )
         },
         lblInputS: 'Input Stream:',
         lblRules: 'Rules:',
         lblCmdH: 'Command History:',
         lblCmd: 'Command:'
    }
}

const GEditorText: GEditorTextS = {
    badRule: 'Invalid rule'
}

export default {UIText, GEditorText};