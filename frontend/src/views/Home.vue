<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" width="32px">
    <GEditor/>
    <LLSim/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import LLSim from '@/components/SimLL1.vue';
import GEditor from '@/components/GramEditor/GramEditor.vue';

@Component({
  components: {
    LLSim, GEditor
  },
})
export default class Home extends Vue {}
</script>
