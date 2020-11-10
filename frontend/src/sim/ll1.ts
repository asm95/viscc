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

export class L1Sim {
    tokens: Symbl[];
    nterm: Symbl[];
    rules: Rule[];
    firstSet: Map<number, Set<number>>;
    followSet: Map<number, Set<number>>;
    emptySymbl: Symbl;
    startSymbl: Symbl;
    endOfInputSymbol: Symbl;
    symbolByID: Map<number, Symbl>;

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
                    } else if (idx == ruleLength-1){
                        // if it's the last element
                        // add follow(A) to follow(Xi)
                        const aF = this.followSet.get(rule.lhs.id); // follow(A)
                        this.setAssign(aF, eF); // add follow(A) to follow(Xi)
                        anyChanged = anyChanged || (eF?.size != oldSize);
                    }
                }
            }
        } while (anyChanged);
    }

    private initSymbols(){
        for (const t of this.tokens){
            this.symbolByID.set(t.id, t);
        }
        for (const nt of this.nterm){
            this.symbolByID.set(nt.id, nt);
        }
    }

    constructor (g: Grammar){
        // this is the grammar itself
        this.emptySymbl = g.emptySymbol;
        this.startSymbl = g.startSymbol;
        this.tokens = g.tokens;
        this.nterm = g.nterms;
        this.rules = g.rules;
        this.firstSet = new Map<number, Set<number>>();
        this.followSet = new Map<number, Set<number>>();
        this.symbolByID = new Map<number, Symbl>();
        this.endOfInputSymbol = {id: g.maxSymbolID++, repr: '$'};
        this.initSymbols();
    }
}
