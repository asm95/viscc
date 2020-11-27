import { Component, Vue } from 'vue-property-decorator';
import GEditor from '@/components/GramEditor/GramEditor.vue';
import LL1Info from '@/components/SimLL1/LL1Info.vue';
import LL1Sim from '@/components/SimLL1/LL1Sim.vue';
import MainConfig from '@/components/Config/MainConfig.vue';

import Tree from '@/components/Graph/tree';

import lang, { gLang } from '@/lang'
import Icons from '@/components/icons'
import Router from '@/router'

import {Settings as SimSettings} from '@/components/SimLL1/simulator';
import { Grammar, L1Sim, ParseSimulator, LL1ParseTable, Symbl } from '@/sim/ll1';

import CourseFlowInfoBox from '@/components/Course/FlowInfo.vue'
import { InfoBoxSettings, InfoBoxIcon } from '@/components/Course/flowInfo'

import CourseFlowList from '@/components/Course/FlowList.vue'
import { CourseFlowSettings } from '@/components/Course/flowList'

import AppC from '@/manage/app'


interface BoxState {
  isVisible: boolean;
  isClosable: boolean;
}

const tvBoxStates: {[key: string]: BoxState} = {
  config: {isVisible: false, isClosable: true},
  courseProgress: {isVisible: true, isClosable: false},
};
const tvCFConfig: InfoBoxSettings = {
  icon: InfoBoxIcon.warning,
  textID: 'lblInfo2',
  canResume: false,
  canRestart: false,
  canGoBack: true,
}
const tvFLConfig: CourseFlowSettings = {
  showTitle: true,
  progress: 0,
  courseItems: []
};

@Component({
  components: {
    MainConfig, LL1Info, LL1Sim, GEditor, Tree,
    CourseFlowInfoBox, CourseFlowList,
    Gear: Icons.Gear, CircleFill: Icons.CircleFill
  },
})
export default class TestView extends Vue {
  simSettings: SimSettings;
  parseSimulator: ParseSimulator;
  parseTable: LL1ParseTable | undefined;
  grammar: Grammar;
  simulatorEnabled = false;
  tokensMap: Map<string, Symbl>;
  inputString = '';
  errMsg = '';
  uiText = lang.gLang.uiText.LLView;
  cfText = lang.gLang.uiText.App.CourseFlow;

  isSimulatorDisabled = true;
  boxStates = tvBoxStates;
  configCF = tvCFConfig;
  configFL = tvFLConfig;

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
    AppC.saveSettings();
    this.boxStates.config.isVisible = false;
  }

  onConfigBtnClick(){
    this.boxStates.config.isVisible = true;
  }

  onCloseProgressBoxBtnClick(){
    this.boxStates.courseProgress.isVisible = false;
  }

  onCFActionGB(){
    Router.back();
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

  private onInitCourseFlow(){
    this.configFL.progress = 33.3;
    const courseItems = this.configFL.courseItems;
    const compCI = [true, false, false];
    const textCI = lang.gLang.uiText.App.Courses.byName['sa-ll1-part-one'].tasks as string[];
    for (let idx = 0; idx < 3; idx++){
      courseItems.push({display: textCI[idx], isActive: compCI[idx]});
    }
  }

  mounted(){
    this.onInitCourseFlow();
  }

  constructor(){
    super();
    this.grammar = this.getEmptyGrammar();
    this.parseSimulator = new ParseSimulator([], this.grammar);
    this.simSettings = {showSuggestions: true, showLines: true, optMoboVer: false};
    this.tokensMap = new Map<string, Symbl>();
  }
}
