import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { PropType } from 'vue'

import lang from '@/lang/index'
import {L1Sim, Symbl, Grammar, Rule} from '@/sim/ll1'

interface FsDisplay {
    symbol: string;
    items: string[];
}

enum SetChoice {First, Follow}

interface ParserTableItem {
    rules: string[];
    // if there is more than one rule in a single cell
    // . means grammar is not LL(1)
    hasConflict: boolean;
}

interface ComponentConfig {
    showParseTableConflicts: boolean;
}

@Component({})
export default class LL1Info extends Vue {
  uiText = lang.gLang.uiText.LLView;
  firstSet: FsDisplay[] = [];
  followSet: FsDisplay[] = [];
  tokens: Symbl[] = [];
  nterms: Symbl[] = [];
  eofSymbol: Symbl = {id: -1, repr:'$'};
  private sim: L1Sim | undefined;
  ptDisplayRules = false;
  nullableRules: string[] = [];
  config: ComponentConfig = {showParseTableConflicts: true};

  @Prop({type: Object as PropType<Grammar>}) readonly grammar!: Grammar;

  private setToRepr(s: L1Sim, c: SetChoice, t: Symbl): FsDisplay {
    const fS = c == SetChoice.First ? s.firstSet.get(t.id) : s.followSet.get(t.id); // first(X) or follow(X)
    const items: string[] = [];
    const eS = s.endOfInputSymbol; // <e>mpty symbol
    if (fS){
        fS.forEach(i => {
            const e = s.symbolByID.get(i);
            if (e){items.push(e.repr)}
            else if (i == eS.id){items.push(eS.repr)}
        });
    }
    return {symbol: t.repr, items: items};
  }

  private renderListItem(s: Array<number | string>, i: number){
      return (i < s.length-1) ? s[i] + ', ' : s[i];
  }

  private renderRule(rule: Rule): string {
      const terms: string = rule.rhs.map(i => i.repr).join(' ');
      return `${rule.lhs.repr} -> ${terms}`;
  }

  private renderParseTableEntry(ntID: number, tokenID: number): ParserTableItem {
      const ruleDisplay: string[] = [];
      const s = this.sim;
      if (s){
          s.getParseTableEntry(ntID, tokenID).forEach(rID => {
              const rule = s.ruleByID.get(rID);
              if (!rule){return;}
              const displayString = this.ptDisplayRules ? this.renderRule(rule) : `${rule.id}`;
              ruleDisplay.push(displayString);
          });
      }
      return {rules: ruleDisplay, hasConflict: ruleDisplay.length > 1};
  }

  onSetGrammar(g: Grammar){
    const s = new L1Sim(g);
    this.firstSet = [];
    this.nullableRules = [];
    // add <eof> and remove <e>mpty from parse table view
    const tokens = s.tokens.filter(e => e.id != s.emptySymbl.id);
    tokens.push(s.endOfInputSymbol);
    this.tokens = tokens;
    this.nterms = s.nterm;
    this.eofSymbol = s.endOfInputSymbol;
    this.sim = s;
    s.getFirstSet();
    s.tokens.forEach(t => {
        // <e>mpty symbol is not a token
        if (t.id == s.emptySymbl.id){return;}
        this.firstSet.push(this.setToRepr(s, SetChoice.First, t));
    })
    s.nterm.forEach(nt => {
        this.firstSet.push(this.setToRepr(s, SetChoice.First, nt));
        if (s.isNullable(nt.id)){
            this.nullableRules.push(nt.repr);
        }
    });
    s.getFollowSet();
    s.nterm.forEach(nt => {
        // follow(A) just exists for non-terminals
        this.followSet.push(this.setToRepr(s, SetChoice.Follow, nt));
    });
    s.buildParseTable();
    this.$emit('onInfoProcess', this.sim);
  }

  @Watch('grammar')
  onUserInputGrammar(nV: Grammar, oV: Grammar){
      this.onSetGrammar(nV);
  }
}