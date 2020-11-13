import Stack from './base/stack'

export interface Symbl {
    id: number;
    repr: string;
}

export interface Rule {
    id: number;
    lhs:  Symbl;
    rhs: Symbl[];
}

export interface Grammar {
    tokens: Symbl[];
    nterms: Symbl[];
    rules: Rule[];
    emptySymbol: Symbl;
    startSymbol: Symbl;
    maxSymbolID: number;
}

interface IterParseTableItem {
    rule: Rule;
    token: Symbl;
    entry: Set<number>;
}

export class LL1Set extends Map<number, Set<number>> {}
export class LL1ParseTable extends Map<number, LL1Set> {}

export class L1Sim {
    tokens: Symbl[];
    nterm: Symbl[];
    rules: Rule[];
    firstSet: LL1Set;
    followSet: LL1Set;
    parseTable: LL1ParseTable;
    emptySymbl: Symbl;
    startSymbl: Symbl;
    endOfInputSymbol: Symbl;
    symbolByID: Map<number, Symbl>;
    ruleByID: Map<number, Rule>;

    setAssign<T>(a: Set<T> | undefined, b: Set<T> | undefined){
        if (typeof a == "undefined" || typeof b == "undefined"){return;}
        a.forEach(i => {
            b.add(i);
        });
    }

    isNullable (id: number): boolean {
        // nullable means that exists a derivation A =>* <empty>
        // returns true if the First(A) contains the <empty> symbol
        const s = this.firstSet.get(id);
        if (s){return s.has(this.emptySymbl.id);}
        return false;
    }

    getFirstSet (): void {
        for (const term of this.tokens){
            // which are non-terminals
            // first(X) where X is a terminal = {X}
            const s = new Set<number>();
            s.add(term.id);
            this.firstSet.set(term.id, s);
        }
        for (const nterm of this.nterm){
            // set all first(A) where A is non-terminal as {}
            this.firstSet.set(nterm.id, new Set<number>());
        }
        let anyChanged = false; // has any first set First(A) changed
        do {
            // this algorithm is supposed to be run on grammars with <empty> rules
            anyChanged = false;
            for (const nterm of this.nterm){
                const id = nterm.id;
                const fA = this.firstSet.get(id) || new Set<number>(); // first(A) where A is a non-terminal
                const oldLen = fA.size; // old size to detect any changes
                let mA = false; // indicates if first(A) has changed
                const eS = this.emptySymbl.id; // the empty symbol
                for (const rule of this.rules){
                    // filter all rules that begin with the acutal non-terminal
                    if (rule.lhs.id != id){continue;}
                    let keep = true;
                    for (const e of rule.rhs){
                        if (! keep){break;}
                        const fE = this.firstSet.get(e.id, ) || new Set<number>();
                        this.setAssign<number>(fE, fA);
                        // if we added/removed anything to first(A) from first(Xi) then it has changed
                        mA = mA || (fA.size != oldLen);
                        fA.delete(eS); // if empty is in first(Xi)
                        if (! fE.has(eS)){keep=false;}
                    }
                    if (keep){fA.add(eS)}
                }
                anyChanged = anyChanged || mA;
                this.firstSet.set(id, fA);
            }
        } while(anyChanged);
    }

    getFollowSet (): void {
        for (const nt of this.nterm){
            const s = new Set<number>();
            if (nt.id == this.startSymbl.id){
                // follow of start symbol is $
                s.add(this.endOfInputSymbol.id);
            }
            this.followSet.set(nt.id, s);
        }
        let anyChanged = false; // has any follow set Follow(A), where A is non-terminal, changed
        const eS = this.emptySymbl.id; // the empty symbol ID
        do {
            anyChanged = false;
            for (const rule of this.rules){
                const ruleLength = rule.rhs.length;
                const aF = this.followSet.get(rule.lhs.id); // follow(A)
                for (let idx=0; idx < ruleLength; idx++){
                    const e: Symbl = rule.rhs[idx];
                    const eF = this.followSet.get(e.id); // follow(Xi)
                    const oldSize = eF?.size; // track changes
                    // e must be a non-terminal
                    if(!this.nterm.find((f) => f.id == e.id)){continue;}
                    if (idx+1 <= ruleLength-1){
                        // there still an element after the current
                        const eN = rule.rhs[idx+1];
                        const fN = this.firstSet.get(eN.id); // first(Xi+1)
                        this.setAssign(fN, eF);
                        eF?.delete(eS); // add first(Xi+1) - {<e>} to follow(Xi)
                        anyChanged = anyChanged || (eF?.size != oldSize);
                        // todo: this doesn't look like to be fully correct (check p. 182 Louden)
                        // . missing the if <e> in First(Xi+1...Xn) then {add Follow(A) to follow(Xi)}
                        // . the else case is covering when First(Xi+1...Xn) is <e>*
                        if (fN?.has(eS)){
                            // add follow(A) to follow(Xi)
                            this.setAssign(aF, eF);
                            anyChanged = anyChanged || (eF?.size != oldSize);
                        }
                    } else if (idx == ruleLength-1){
                        // if it's the last element
                        // add follow(A) to follow(Xi)
                        this.setAssign(aF, eF); // add follow(A) to follow(Xi)
                        anyChanged = anyChanged || (eF?.size != oldSize);
                    }
                }
            }
        } while (anyChanged);
    }

    private setGet(s: LL1Set, id: number): Set<number> {
        const e = s.get(id);
        if (typeof e == "undefined"){return new Set<number>();}
        return e;
    }

    private addParseTable (rule: Rule, tokenID: number): void {
        const nt = rule.lhs; // non-terminal A
        let s1 = this.parseTable.get(nt.id);
        if (! s1){
            s1 = new Map<number, Set<number>>();
        }
        let s2 = s1.get(tokenID);
        if (! s2){
            s2 = new Set<number>();
        }
        s2.add(rule.id);
        s1.set(tokenID, s2);
        this.parseTable.set(nt.id, s1);
    }

    getParseTableEntry (ntID: number, tokenID: number): Set<number>{
        const s1 = this.parseTable.get(ntID);
        if (s1){
            const s2 = s1.get(tokenID);
            if (s2){
                return s2;
            }
        }
        return new Set<number>();
    }

    *iterParseTableEntry (){
        for (const rule of this.rules){
            for (const token of this.tokens){
                const i: IterParseTableItem = {
                    rule: rule, token: token,
                    entry: this.getParseTableEntry(rule.lhs.id, token.id)
                };
                yield i;
            }
        }
    }

    buildParseTable (): void {
        for (const rule of this.rules){
            let addFollow = true;
            for (const e of rule.rhs){
                const fE = this.setGet(this.firstSet, e.id);
                let hasEmpty = false;
                fE.forEach(i => {
                    // if it's a empty symbol
                    if (this.emptySymbl.id == i){hasEmpty = true;}
                    // check if it's a token
                    if (!this.tokens.find(f => f.id == i)){return;}
                    // for each element i of first(Xi) of rule A -> x add M[A, i]
                    this.addParseTable(rule, i);
                });
                addFollow = addFollow && hasEmpty;
                // break here because looks like First(x) is First(X1), the same applies to
                // calculating the follow set (see todo)
                break;
            }
            if (addFollow){
                const foE = this.setGet(this.followSet, rule.lhs.id); // follow(A)
                // for each element j (token or <eof>) of follow(A) add M[A, j]
                foE.forEach(j => {
                    this.addParseTable(rule, j);
                });
            }
        }
    }

    private initSymbols(){
        for (const t of this.tokens){
            this.symbolByID.set(t.id, t);
        }
        for (const nt of this.nterm){
            this.symbolByID.set(nt.id, nt);
        }
        for (const r of this.rules){
            this.ruleByID.set(r.id, r);
        }
    }

    constructor (g: Grammar){
        // this is the grammar itself
        this.emptySymbl = g.emptySymbol;
        this.startSymbl = g.startSymbol;
        this.tokens = g.tokens;
        this.nterm = g.nterms;
        this.rules = g.rules;
        this.firstSet = new LL1Set();
        this.followSet = new LL1Set();
        this.parseTable = new LL1ParseTable();
        this.symbolByID = new Map<number, Symbl>();
        this.ruleByID = new Map<number, Rule>();
        this.endOfInputSymbol = {id: g.maxSymbolID++, repr: '$'};
        this.initSymbols();
    }
}

export enum cmdType { REPL, MATCH }
export enum itemType { TOKEN, NTERM, NONE }

enum LLParseError {
    NoError,
    AcReplErr1, AcReplErr2,
    AcMatchErr1, AcMatchErr2,
    SgErr1, SgErr2, SgErr3, SgErr4, SgErr5,
    InvalidRule
}

interface LLResponse {
    hasError: LLParseError;
    args: any[];
    value: any | undefined;
}

export interface LLSimInputCommand {
    type: cmdType;
    keyID: number;
}

export interface LLSimStackItem {
    type: itemType;
    value: Symbl;
}

type LLSimStack = Stack<LLSimStackItem>;

export function RenderResponseMessage(res: LLResponse): string{
    return '&lt;warning: implement&gt;';
}

export class ParseSimulator {
    pareseTable: LL1ParseTable | undefined;
    inputStream: Symbl[];
    inputStreamIndex: number;
    rules: Map<number, Rule>;
    stack: LLSimStack;
    grammar: Grammar;
    private itemTypeMap: Map<number, itemType>;

    getCurrentToken(): Symbl {
        return this.inputStream[this.inputStreamIndex];
    }

    getStackTop(): LLSimStackItem | undefined {
        return this.stack.getTop();
    }
    stackIsEmpty(): boolean {
        return (this.stack.size() == 0);
    }

    private makeResponseErr(errType: LLParseError, args: any[]): LLResponse {
        return {hasError: errType, args: args, value: undefined};
    }
    private makeResponseOK(value: any): LLResponse {
        return {hasError: LLParseError.NoError, args: [], value: value};
    }

    applyCommand(cmd: LLSimInputCommand): LLResponse{
        // when user enter a command
        const stackTop = this.stack.getTop();
        const curToken = this.getCurrentToken();
        const mkErr = this.makeResponseErr;
        const curRule = this.rules.get(cmd.keyID || -1);

        if (! stackTop){return this.makeResponseOK([]);}

        if (cmd.type == cmdType.REPL){
            // can't use switch case with lexical declarations
            // . more info: https://eslint.org/docs/rules/no-case-declarations
            if (stackTop.type != itemType.TOKEN){
                // attempt to replace rule that doesn't match with top of stack
                return mkErr(LLParseError.AcReplErr1, [stackTop.value]);
            }
            if (! curRule){
                // attempt to index invalid rule
                return mkErr(LLParseError.InvalidRule, [cmd.keyID]);
            }
            if (stackTop.value.id != curRule.lhs.id){
                return mkErr(LLParseError.AcReplErr2, [stackTop.value, curRule.lhs]);
            }
            // this should be an atomic operation 
            // . (no calls to "isAccept" method should be done in parallel)
            const outStackValue = this.stack.popItem();
            const toPushItems: LLSimStackItem[] = curRule.rhs.reverse()
                .filter(e => e.id != this.grammar.emptySymbol.id)
                .map((e): LLSimStackItem => {
                    return {type: this.itemTypeMap.get(e.id) || itemType.NONE, value: e}
                });
            this.stack.pushItem(toPushItems);
        } else if (cmd.type == cmdType.MATCH){
            if (stackTop.type != itemType.TOKEN){
                // attempt to match a token of input stream where the top of stack is non-terminal
                return mkErr(LLParseError.AcMatchErr1, [curToken, stackTop.value]);
            }
            if (stackTop.value.id != curToken.id){
                // attempt to match a token which is not the same as the top of stack
                return mkErr(LLParseError.AcMatchErr2, [curToken, stackTop.value]);
            }
            this.stack.popItem();
            // advance on input stream
            this.inputStreamIndex++;
        }
        return mkErr(LLParseError.NoError, []);
    }
    getNextCommand (): LLResponse {
        // based on the parsing table, it will generate a command that
        // . the user needs to apply next if it's desired to parse the
        // . string correctly if it it's part of grammar
        // returns null if no parsing table could be generated
        // returns a command object otherwise
        const mkErr = this.makeResponseErr;
        const mkOK = this.makeResponseOK;
        if (! this.pareseTable){
            // there's no parse table
            return mkErr(LLParseError.SgErr1, []);
        }

        const stackTop = this.getStackTop();
        const curToken = this.getCurrentToken();
        const istrIsComsumed = (this.inputStreamIndex == this.inputStream.length-1);
        if (! stackTop){
            // stack is empty: no action can be performed
            return mkErr(LLParseError.SgErr2, []);
        }
        if (stackTop.type == itemType.TOKEN){
            // only one option here, we must match the string
            if (istrIsComsumed){
                // we reached the end of input, so we can't match anything
                return mkErr(LLParseError.SgErr3, []);
            }
            return mkOK({type: cmdType.MATCH, symbol: curToken});
        } else if (stackTop.type == itemType.NTERM){
            const rowEntry = this.pareseTable.get(stackTop.value.id);
            if (!rowEntry){
                // no entry was found for the given machine state, so we
                // . can't make any correct suggestions
                return mkErr(LLParseError.SgErr4, [stackTop.value]);
            }
            const ruleEntry = rowEntry.get(curToken.id);
            if (!ruleEntry){
                // no entry in the table for symbol and terminal
                return mkErr(LLParseError.SgErr5, [stackTop.value, curToken]);
            }
            const ruleID = ruleEntry.values().next().value;
            return mkOK({type: cmdType.REPL, symbol: ruleID});
        }

        // this cannot be reached but compiler complains
        return mkErr(LLParseError.SgErr1, []);
    }

    private initSim(g: Grammar){
        for (const rule of g.rules){
            this.rules.set(rule.id, rule);
        }
        // map item types
        for (const token of g.tokens){
            this.itemTypeMap.set(token.id, itemType.TOKEN);
        }
        for (const nt of g.nterms){
            this.itemTypeMap.set(nt.id, itemType.NTERM);
        }
    }

    constructor(inputStream: Symbl[], g: Grammar){
        this.inputStream = inputStream;
        this.inputStreamIndex = 0;
        this.rules = new Map<number, Rule>();
        this.stack = new Stack<LLSimStackItem>();
        this.itemTypeMap = new Map<number, itemType>();
        this.grammar = g;
        this.initSim(g);
    }
}