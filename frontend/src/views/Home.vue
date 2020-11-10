<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" width="32px">
    <GEditor/>
    <LL1Info/>
    <LL1Sim :conf="simSettings"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import GEditor from '@/components/GramEditor/GramEditor.vue';
import LL1Info from '@/components/SimLL1/LL1Info.vue';
import LL1Sim from '@/components/SimLL1/LL1Sim.vue';

import {Settings as SimSettings} from '@/components/SimLL1/simulator';

@Component({
  components: {
    LL1Info, LL1Sim, GEditor
  },
})
export default class Home extends Vue {

  simSettings: SimSettings;

  constructor(){
    super();
    this.simSettings = {showSuggestions: true, showLines: true};
  }
}
</script>
