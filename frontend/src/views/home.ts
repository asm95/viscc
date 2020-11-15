import { Component, Vue } from 'vue-property-decorator';
import GEditor from '@/components/GramEditor/GramEditor.vue';
import LL1Info from '@/components/SimLL1/LL1Info.vue';
import LL1Sim from '@/components/SimLL1/LL1Sim.vue';
import MainConfig from '@/components/Config/MainConfig.vue';

import Tree from '@/components/Graph/tree';

import lang, { gLang } from '../lang/index'
import Icons from '@/components/icons'

import {Settings as SimSettings} from '@/components/SimLL1/simulator';
import { Grammar, L1Sim, ParseSimulator, LL1ParseTable, Symbl } from '../sim/ll1';


@Component({
  components: {
    MainConfig, LL1Info, LL1Sim, GEditor, Tree,
    Gear: Icons.Gear
  },
})
export default class Home extends Vue {
  simSettings: SimSettings;
  parseSimulator: ParseSimulator;
  parseTable: LL1ParseTable | undefined;
  grammar: Grammar;
  simulatorEnabled = false;
  tokensMap: Map<string, Symbl>;
  inputString = '';
  errMsg = '';
  uiText = lang.gLang.uiText.LLView;

  showConfigBox = false;

  onEditorGrammarSet (g: Grammar){
    this.grammar = g;
    // build own internal meta-info of grammar
    this.tokensMap = new Map<string, Symbl>();
    for (const t of this.grammar.tokens){
      this.tokensMap.set(t.repr, t);
    }
    // set new simulator (that actually will parse an input)
    this.parseSimulator = new ParseSimulator([], this.grammar);
    // let the user type an input for the simulator
    this.inputString = '';
    this.simulatorEnabled = true;
  }

  onInfoRefresh(info: L1Sim){
    // update parse-table
    // we still have a problem with the interface as it doesn't automatically
    // refresh it
    this.parseTable = info.parseTable;
  }

  onInputSet (ev: Event) {
    // check the input string
    const input = this.inputString;
    const inputStream: Symbl[] = [];
    for (const c of input){
      const s = this.tokensMap.get(c);
      if (! s){
        this.errMsg = lang.gLang.uiText.LLSim.invalidInput;
        return;
      }
      inputStream.push(s);
    }
    // clear error message
    this.errMsg = '';
    // set new simulator
    const sim = new ParseSimulator(inputStream, this.grammar);
    sim.pareseTable = this.parseTable;
    this.parseSimulator = sim;
  }

  onLanguageSet(){
    console.log('changed');
    this.$forceUpdate();
    console.log(this.uiText);
    console.log(gLang.uiText.LLView);
    console.log(this.uiText.LLView === gLang.uiText);
  }

  onConfigBoxClose(){
    this.showConfigBox = false;
  }

  onConfigBtnClick(){
    this.showConfigBox = true;
  }

  private getEmptyGrammar(): Grammar {
    const nullS = {id: -1, repr: ''};
    const g: Grammar = {
      tokens: [], nterms: [], rules: [],
      emptySymbol: nullS, startSymbol: nullS,
      eofSymbol: nullS,
      maxSymbolID: 1
    }
    return g;
  }

  constructor(){
    super();
    this.grammar = this.getEmptyGrammar();
    this.parseSimulator = new ParseSimulator([], this.grammar);
    this.simSettings = {showSuggestions: true, showLines: true, optMoboVer: false};
    this.tokensMap = new Map<string, Symbl>();
    
  }
}
