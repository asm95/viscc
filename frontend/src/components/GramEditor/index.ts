import { Vue, Component } from 'vue-property-decorator';
import {Symbl, Grammar, Rule} from '@/sim/ll1'
import lang from '@/lang/index'
import AppControl from '@/manage/app';

import Icons from '@/components/icons';


@Component({
    components: {
        Gear: Icons.Gear
    }
})
export default class GramEdtior extends Vue {
    inputGram = '';
    errorMsg = '';
    rules: Rule[] = [];
    nterms: Symbl[] = [];
    terms: Symbl[] = [];
    emptySymbol: Symbl = {id: -1, repr: '~'};
    eofSymbol: Symbl = {id: -1, repr: '$'};

    UIText = lang.gLang.EditorText;

    private renderListItem(s: Array<any>, i: number){
        return (i < s.length-1) ? s[i].repr + ' ' : s[i].repr;
    }

    onEvalBtnClick(){
        const terms: Symbl[] = [];
        const nterms: Symbl[] = [];
        const rules: Rule[] = [];

        const mSymbols = new Map<string, Symbl>();
        const mNterms = new Map<string, Symbl>();
        const mTerms = new Map<string, Symbl>();
        let startSymbol: Symbl = {id: -1, repr: ''};
        let symblID = 0;
        let ruleID = 0;

        mSymbols.set('~', this.emptySymbol);

        for (const line of this.inputGram.split('\n')){
            // empty line or comment
            if (line.length == 0 || line[0] == '#'){continue;}
            const lrule = line.split('->');
            if (lrule.length != 2){
                this.errorMsg = this.UIText.badRule; return;
            }
            const lhs = lrule[0].trim();
            let lhsSymbl = mNterms.get(lhs);
            if (! lhsSymbl){
                lhsSymbl = mSymbols.get(lhs);
                if ( ! lhsSymbl){
                    lhsSymbl = {id: symblID++, repr: lhs};
                    if (symblID == 1){
                        // assumes start symbol to be the first in grammar
                        startSymbol = lhsSymbl;
                    }
                    mSymbols.set(lhs, lhsSymbl);
                }
                mNterms.set(lhs, lhsSymbl);
                nterms.push(lhsSymbl);
            }

            for (const rhs of lrule[1].split('|')){
                const rhsSymbs: Symbl[] = [];

                for (let symbl of rhs.split(' ')){
                    symbl = symbl.trim();
                    if (symbl == ''){continue;}
                    let rhsSymbl = mSymbols.get(symbl);
                    if (! rhsSymbl){
                        rhsSymbl = {id: symblID++, repr: symbl};
                        mSymbols.set(symbl, rhsSymbl);
                    }
                    rhsSymbs.push(rhsSymbl);
                }
                rules.push({
                    lhs: lhsSymbl, rhs: rhsSymbs, id: ruleID++
                });
            }
        }

        for (const rule of rules){
            for (const rhs of rule.rhs){
                if (! mNterms.get(rhs.repr)){
                    // is a terminal
                    mTerms.set(rhs.repr, rhs);
                }
            }
        }

        this.rules = rules;
        this.terms = [... mTerms.values()];
        this.nterms = [... mNterms.values()];
        this.emptySymbol.id = symblID++;
        this.eofSymbol.id = symblID++;

        // bundle grammar and set it
        const g: Grammar = {
            tokens: this.terms,
            nterms: this.nterms,
            rules: rules,
            emptySymbol: this.emptySymbol,
            eofSymbol: this.eofSymbol,
            startSymbol: startSymbol,
            maxSymbolID: symblID,
        }
        this.$emit('onGrammarSet', g);
    }
    
}