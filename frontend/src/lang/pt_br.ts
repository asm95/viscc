import {UITextS, GEditorTextS, TextMarkup} from './skel';

const mc = TextMarkup.markCode;
const mb = TextMarkup.MarkBold;
type str = string;

const UIText: UITextS = {
    version: v => `Versão ${v}`,
    about: {
        me: 'olá'
    },
    LLSim: {
        errPrelude: 'Erro:',
        commandRepl: (r: string) => `substituir usando a regra ${r}`,
        commandMatch: (t: string) => `casar o token "${mc(t)}" com a entrada`,
        unkCommand: 'comando desconhecido',
        oopsWeAreDone: `${mb('Oops!')} Parece que você chegou a um estado irreparável. Desfaça as alterações ou reinicie a simulação para continuar`,
        youReDone: 'Você chegou ao fim da simulação. A máquina aceitou a cadeia de entrada',
        nextSuggestion: (cmd: string) => `Sugestão: ${cmd}`,
        noInputGiven: 'sem entrada',
        invalidInput: 'Erro: entrada inválida',
        questions: {
            a1: (s: str, i: str) => (
                `Dada a pilha ${mc(s ? s : '??')}, cadeia de entrada ${mc(i ? (i+' $') : '??')} e as regras a seguir, 
                quais passos devem ser executados para que a cadeia seja aceita?`
            )
        },
        stack: {
            tblHeaderPos: 'Posição',
            tblHeaderCnt: 'Conteúdo',
            lblIsEmpty: 'vazio'
         },
         options: {
            lblTitle: 'Configurações',
            lblLang: 'Língua de Interface:',
            lblPrivacy: 'Privacidade',
            lblUI: 'Interface de Usuário',
            cbTextPrivacy: 'Eu concordo em enviar dados de uso segundo descrito nos Termos de Serviço.',
            lblInfo1: 'Alterações são salvas automaticamente',
            lblUpdatP: 'Salvando alterações...',
            lblUpdatOK: 'Alterações foram registradas',
            lblUpdatNOK: 'Alterações não puderam ser registradas',
            lblSimulation: 'Simulação',
            cbTextEnableSuggestions: 'Habilitar sugestões enquanto simula',
            cbTextEnableMoboVer: 'Habilitar versão móvel'
         },
         help: {
            lblTitle: 'Ajuda',
            content: (
               `Comandos: <br>${mc('r &lt;ruleID&gt;')} - substitui por uma regra usando seu ID` +
               `<br> ${mc('m')} - casa um token do topo da pilha com token corrente da entrada`
            )
         },
         lblInputS: 'Entrada:',
         lblRules: 'Regras:',
         lblCmdH: 'Histórico de Comandos:',
         lblCmd: 'Comando:'
    }
}

const GEditorText: GEditorTextS = {
    badRule: 'Regra Inválida'
}

export default {UIText, GEditorText};