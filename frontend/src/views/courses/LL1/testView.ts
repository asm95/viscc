import { Component, Vue, Ref } from 'vue-property-decorator';
import GEditor from '@/components/GramEditor/GramEditor.vue';
import LL1Info from '@/components/SimLL1/LL1Info.vue';
import LL1Sim from '@/components/SimLL1/LL1Sim.vue';
import LL1SimC from '@/components/SimLL1/simulator';
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
import { CourseFlowSettings, CourseItemView } from '@/components/Course/flowList'

import AppC from '@/manage/app'


interface BoxState {
  isVisible: boolean;
  isClosable: boolean;
}

const tvBoxStates: {[key: string]: BoxState} = {
  config: {isVisible: false, isClosable: true},
  courseProgress: {isVisible: true, isClosable: false},
  courseInfo: {isVisible: false, isClosable: false},
  courseEndedActions: {isVisible: false, isClosable: false}
};
const tvCFConfig: InfoBoxSettings = {
  icon: InfoBoxIcon.warning,
  text: '',
  canResume: false,
  canRestart: false,
  canGoBack: true,
}
const tvFLConfig: CourseFlowSettings = {
  showTitle: true,
  progress: 0,
  courseItems: []
};
const tvViewStates: {[key: string]: boolean} = {
  BtnACReview: false,
  ActivityBox: true
}

// course flow manager
// . easier interface for setting progress

enum CourseFlowState {
  notStarted, inProgress, finished
}

interface CourseFlowItem {
  id: string;
  index?: string;
  displayTitle: string;
  state: CourseFlowState;
}

class CourseFlowManager {
  flowSettings: CourseFlowSettings;
  onActivityComplatedCallback?: () => void;
  private flowData: CourseItemView[];
  private flowByID: Map<string, CourseFlowItem>;
  private finishedCount = 0;

  setState(id: string, state: CourseFlowState){
    const e = this.flowByID.get(id);
    if (!e || e.state == state){return;}
    if (state == CourseFlowState.finished){
      const idx = parseInt(e.index || '0');
      this.flowData[idx].isActive = true;
      this.finishedCount++;
    } else {
      this.finishedCount--;
    }
    this.updateFlowProgress();
    e.state = state;
  }

  private updateFlowProgress(){
    const progress = this.finishedCount / this.flowData.length;
    this.flowSettings.progress = progress;
    if (progress == 1){
      if (this.onActivityComplatedCallback){
        this.onActivityComplatedCallback();
      }
    }
  }

  setFlowData(flowData: CourseFlowItem[]){
    for (const idx in flowData){
      const e = flowData[idx];
      e.index = idx;
      this.flowByID.set(e.id, e);
      const isFinished = (e.state == CourseFlowState.finished);
      if (isFinished){
        this.finishedCount++;
      }
      this.flowData.push({
        display: e.displayTitle, isActive: isFinished
      });
    }
    this.updateFlowProgress();
  }

  constructor(flowConfig: CourseFlowSettings){
    this.flowData = [];
    this.flowByID = new Map<string, CourseFlowItem>();
    flowConfig.courseItems = this.flowData;
    this.flowSettings = flowConfig;
    this.onActivityComplatedCallback = undefined;
  }
}

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

  isSimulatorDisabled = false;
  boxStates = tvBoxStates;
  configCF = tvCFConfig;
  viewState = tvViewStates;
  flowManager: CourseFlowManager;

  @Ref('SimulatorC') readonly SimulatorC!: LL1SimC;

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
    // let the course activity tracker know that we made progress
    this.flowManager.setState('enter-grammar', CourseFlowState.finished);
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
    // scroll into input directly
    this.SimulatorC.focusOnInput(true, true);
    // let the course activity tracker know we compleated this task
    this.flowManager.setState('gen-input', CourseFlowState.finished);
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
    const textCI = lang.gLang.uiText.App.Courses.byName['sa-ll1-part-one'].tasks as string[];
    const fState = CourseFlowState;
    this.flowManager.setFlowData([
      {id: 'enter-grammar', displayTitle: textCI[0], state: fState.notStarted},
      {id: 'gen-input', displayTitle: textCI[1], state: fState.notStarted},
      {id: 'sim-ended', displayTitle: textCI[2], state: fState.notStarted},
    ]);
    this.flowManager.onActivityComplatedCallback = this.onActivityTaskComplated;

    // reset activity state
    this.viewState.ActivityBox = true;
    this.boxStates.courseEndedActions.isVisible = false;
  }

  setActivityState(state: string){
    if (state == 'ended'){
      const cfText = this.cfText;
      this.configCF.text = `${cfText.lblInfo2}. ${cfText.lblReason}: ${cfText.lblInfo3}.`;
      this.boxStates.courseInfo.isVisible = true;
    }
  }

  onACQuitBtnClick(){
    Router.back();
  }
  onACReviewBtnClick(){
    this.viewState.ActivityBox = false;
    this.viewState.BtnACReview = false;
  }

  onSimulatorStateChange(state: string){
    // when the simulator raches some state
    if (state == 'done'){
      this.flowManager.setState('sim-ended', CourseFlowState.finished);
    } else if (state == 'onCommandExecuted'){
      // when the user successfully enter a valid command and the simulator executes it
      // . we have to adjust the scroll so the user can still type on it
      this.SimulatorC.focusOnInput(true, false);
    }
  }

  onActivityTaskComplated(){
    // callback when the activity detected all tasks were done
    this.viewState.BtnACReview = true;
    this.boxStates.courseEndedActions.isVisible = true;
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
    this.flowManager = new CourseFlowManager(tvFLConfig);
  }
}
