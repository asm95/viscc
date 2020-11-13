<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" width="32px">
    <GEditor @onGrammarSet="onEditorGrammarSet" />
    <LL1Info :grammar="grammar"/>
    <div>
      <h3>Input String</h3>
      <p v-if="errMsg" class="errMsg">{{errMsg}}</p>
      <input type="text" @change="onInputSet" :disabled="! simulatorEnabled" v-model="inputString" class="input">
    </div>
    <LL1Sim :conf="simSettings" :simulator="parseSimulator"/>
    <Tree/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GEditor from '@/components/GramEditor/GramEditor.vue';
import LL1Info from '@/components/SimLL1/LL1Info.vue';
import LL1Sim from '@/components/SimLL1/LL1Sim.vue';

import Tree from '@/components/Graph/tree';

import lang from '../lang/index'

import {Settings as SimSettings} from '@/components/SimLL1/simulator';
import { Grammar, ParseSimulator, Symbl } from '../sim/ll1';

const langText: any = lang.gLang.uiText.LLSim;

@Component({
  components: {
    LL1Info, LL1Sim, GEditor, Tree
  },
})
export default class Home extends Vue {

  simSettings: SimSettings;
  parseSimulator: ParseSimulator;
  grammar: Grammar;
  simulatorEnabled = false;
  tokensMap: Map<string, Symbl>;
  inputString = '';
  errMsg = '';

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

  onInputSet (ev: Event) {
    // check the input string
    const input = this.inputString;
    const inputStream: Symbl[] = [];
    for (const c of input){
      const s = this.tokensMap.get(c);
      if (! s){
        this.errMsg = langText.invalidInput;
        return;
      }
      inputStream.push(s);
    }
    // clear error message
    this.errMsg = '';
    // set new simulator
    this.parseSimulator = new ParseSimulator(inputStream, this.grammar);
  }

  private getEmptyGrammar(): Grammar {
    const g: Grammar = {
      tokens: [], nterms: [], rules: [],
      emptySymbol: {id: -1, repr: ''}, startSymbol: {id: -1, repr: ''},
      maxSymbolID: 1
    }
    return g;
  }

  constructor(){
    super();
    this.grammar = this.getEmptyGrammar();
    this.parseSimulator = new ParseSimulator([], this.grammar);
    this.simSettings = {showSuggestions: true, showLines: true};
    this.tokensMap = new Map<string, Symbl>();
    lang.gLang.setLang(lang.LangCode.ptBR);
  }
}
</script>

<style scoped>
  .errMsg {
    color: red;
  }
</style>