import {UITextS, TextMarkup} from './skel';

const mc = TextMarkup.markCode;
const mb = TextMarkup.MarkBold;
type str = string;
type int = number;

const rpw1 = (c: number) => (c>1) ? 'elements' : 'element';

const UIText: UITextS = {
    langTitle: 'English',
    version: v => `Version ${v}`,
    GEditor: {
        badRule: 'Invalid rule',
        lblEnterGrammar: 'Enter grammar...',
        lblSubmit: 'Submit',
        lblRules: 'Rule',
        lblNonTerm: 'Non-terminals',
        lblTerm: 'Terminals'
    },
    LLView: {
        lblGramEditor: 'Grammar Editor',
        lblLLInfo: 'LL(1) Info',
        lblSimulator: 'Simulator',
        lblFirstSet: 'First Set',
        lblFollowSet: 'Follow Set',
        lblNullableRules: 'Nullable Rules',
        lblParseTable: 'Parse Table'
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
         lblCmd: 'Command:',
         machine: {
            NoError: 'no error',
            InvalidRule: (r: str) => `rule ${r} not found`,
            eofIS: 'cannot apply command when end of input is reached',
            StackEmpty: 'cant apply command when stack is empty',
            AcReplErr1: (t: str) => `top of stack ${mc(t)} is not a non-terminal`,
            AcReplErr2: (t: str, s: str) => `top of stack ${mc(t)} doesn't match rule lefthand side symbol ${mc(s)}`,
            AcMatchErr1: (t: str, s: str) => `attempt to match the token "${mc(t)}" of input stream where top of stack the non-terminal  ${mc(s)}`,
            AcMatchErr2: (t: str, s: str) => `attempt to match a token "${mc(t)}" of input stream where top of stack is a different ("${mc(s)}") one`,
            SgCant: 'can\'t provide any suggestion',
            SgErr1: 'no parse table is available',
            SgErr2: 'no action can be performed when stack is empty',
            SgErr3: () => UIText.LLSim.machine.SgCant + '. No match rule can be applied when input stream is totally consumed',
            SgErr4: (t: str) => UIText.LLSim.machine.SgCant + `. No row entry in parsing table exist for the non-terminal ${mc(t)}`,
            SgErr5: (t: str, s: str) => UIText.LLSim.machine.SgCant + `No entry in the parsing table for non-terminal "${mc(t)}" and current token "${mc(s)}"`
         }
    },
    MainConfig: {
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
        cbTextEnableMoboVer: 'Enable mobile version',
        lblAppRestartInfo: 'Changes will be applied after this application reload',
        btnRestartNow: 'restart now'
    }
}

export default {UIText};