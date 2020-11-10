import {UITextS, GEditorTextS, TextMarkup} from './skel';

const mc = TextMarkup.markCode;

const UIText: UITextS = {
    version: v => `Versão ${v}`,
    about: {
        me: 'olá'
    },
    LLSim: {
        questions: {
            a1: (
                `Dada a pilha ${mc('$ S')}, cadeia de entrada ${mc('( )$')} e as regras a seguir, 
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