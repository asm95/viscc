import {UITextS, TextMarkup} from './skel';

const mc = TextMarkup.markCode;
const mb = TextMarkup.MarkBold;
type str = string;
type int = number;

const rpw1 = (c: int) => (c>1) ? 'elementos' : 'elemento';

const UIText: UITextS = {
    version: v => `Versão ${v}`,
    about: {
        me: 'olá'
    },
    GEditor: {
        badRule: 'Regra Inválida',
        lblEnterGrammar: 'Digite a gramática...',
        lblSubmit: 'Enviar',
        lblRules: 'Regras',
        lblNonTerm: 'Não terminais',
        lblTerm: 'Terminais'
    },
    LLView: {
        lblGramEditor: 'Editor de Gramática',
        lblLLInfo: 'Informações LL(1)',
        lblSimulator: 'Simulador'
    },
    LLSim: {
        errPrelude: 'Erro:',
        invalidCommand: (c: str) => `Comando ${mc(c)} inválido.`,
        invalidRuleID: (r: str) => `regra ${mc(r)} não existe`,
        invalidToken: (t: str) => `token ${mc(t)} não existe na lista de tokens`,
        commandRepl: (r: string) => `substituir usando a regra ${r}`,
        commandMatch: (t: string) => `casar o token "${mc(t)}" com a entrada`,
        unkCommand: 'comando desconhecido',
        istrEmptyBeforeStack: (s: int) => `a  entrada foi consumida antes da pilha, a qual ainda contém ${s} ${rpw1(s)}`,
        stackEmptyBeforeIstr: (is: int) => `a pilha esvaziou antes da entrada, a qual ainda contém ${is} ${rpw1(is)}`,
        noRulesCanBeApplied: 'estado inválido: nenhuma regra pode ser aplicada de acordo com a tabela de análise LL(1)',
        nextSuggestion: (cmd: string) => `Sugestão: ${cmd}`,
        oopsWeAreDone: `${mb('Oops!')} Parece que você chegou a um estado irreparável. Desfaça as alterações ou reinicie a simulação para continuar`,
        youReDone: 'Você chegou ao fim da simulação. A máquina aceitou a cadeia de entrada',
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
         lblCmd: 'Comando:',
         machine: {
            NoError: 'não há erro',
            InvalidRule: (r: str) => `regra ${r} não encontrada`,
            eofIS: 'não é possível aplicar comandos quando a cadeia esgotou-se',
            StackEmpty: 'não é possível aplicar comandos com a pilha vazia',
            AcReplErr: 'não foi possível executar a ação de substituir',
            AcReplErr1: (t: str) => `topo da pilha ${mc(t)} não é um não-terminal`,
            AcReplErr2: (t: str, s: str) => `topo da pilha ${mc(t)} não casa com o não-terminal ${mc(s)} do lado esquerdo da regra`,
            AcMatchErr1: (t: str, s: str) => `tentativa de casar o token "${mc(t)}" da entrada com o não terminal do topo da pilha "${mc(s)}"`,
            AcMatchErr2: (t: str, s: str) => `tentativa de casar o token "${mc(t)}" da cadeia de entrada com um diferente ("${mc(s)}") presente no topo da pilha`,
            SgCant: 'não foi possível encontrar sugestão',
            SgErr1: 'não há tabela de análise disponível',
            SgErr2: 'nenhuma ação pode ser realizada quando a pilha está vazia',
            SgErr3: () => UIText.LLSim.machine.SgCant + '. Nenhuma regra de casamento pode ser aplicada quando a entrada está totalmente consumida',
            SgErr4: (t: str) => UIText.LLSim.machine.SgCant + `. Não há linha na tabela de análise para o não-terminal ${mc(t)}`,
            SgErr5: (t: str, s: str) => UIText.LLSim.machine.SgCant + `Não há entrada na tabela de análise para o não-terminal "${mc(t)}" e o token atual "${mc(s)}"`
         }
    }
}

export default {UIText};