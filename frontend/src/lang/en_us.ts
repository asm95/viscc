import {UITextS, GEditorTextS, TextMarkup} from './skel';

const mc = TextMarkup.markCode;

const UIText: UITextS = {
    version: v => `Version ${v}`,
    about: {
        me: 'hello'
    },
    LLSim: {
        questions: {
            a1: (
                `Given the stack ${mc('$ S')} and input stream ${mc('( )$')} and rules below, 
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