<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" width="32px">
    <GEditor/>
    <LL1Info/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import GEditor from '@/components/GramEditor/GramEditor.vue';
import LL1Info from '@/components/SimLL1/LL1Info.vue';

@Component({
  components: {
    LL1Info, GEditor
  },
})
export default class Home extends Vue {}
</script>
