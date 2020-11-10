<template>
    <div>
        <p><b>First Set</b></p>
        <p v-for="(f,i) in firstSet" :key="i">First of ("<span class="c">{{f.symbol}}</span>") = {
            <span v-for="(e,j) in f.items" :key="j">{{ renderListItem(f.items, j) }}</span>
        }
        </p>
        <div>
            <p><b>Follow Set</b></p>
            <p v-for="(f,i) in followSet" :key="i">Follow of ("<span class="c">{{f.symbol}}</span>") = {
                <span v-for="(e,j) in f.items" :key="j">{{ renderListItem(f.items, j) }}</span>
            }
            </p>
        </div>
        <p><b>Nullable Rules</b><br>
            <span v-for="(e,i) in nullableRules" :key="i">{{e}}<br></span>
            <span v-if="!nullableRules.length" class="c">&lt;No Rules&gt;</span>
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import lang from '@/lang/index'
import {L1Sim, Symbl, Grammar} from '@/sim/ll1'
import AppControl from '@/manage/app'

interface FsDisplay {
    symbol: string;
    items: string[];
}

enum SetChoice {First, Follow}


@Component({
    methods: {
        shot: () => {
            console.log('out');
        }
    }
})
export default class SimLL1 extends Vue {
  UIText = lang.gLang.ui_text;
  firstSet: FsDisplay[] = [];
  followSet: FsDisplay[] = [];
  nullableRules: string[] = [];

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

  onSetGrammar(g: Grammar){
    const s = new L1Sim(g);
    this.firstSet = [];
    this.nullableRules = [];
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
  }

  mounted () {
      AppControl.registerSimulator(this);
      this.$on('onEditorSetGrammar', (g: Grammar) => this.onSetGrammar(g));
  }
}

</script>

<style scoped>
    .c {
        font-family: monospace;
    }
</style>