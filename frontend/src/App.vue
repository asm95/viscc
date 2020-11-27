<template>
  <div id="app">
    <div id="nav">
      <Topbar/>
    </div>
    <router-view/>
  </div>
</template>

<style>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }
  .boxWrapper {
    display: inline-block;
  }

  /*icons*/
  .icn.sm{width: 16px; height: 16px;}
  .icn.anm:hover{transform: scale(1.2);}

  /*align; c = container, tar = text align right*/
  .ct.tar{text-align: right;}
</style>

<script >
import { Vue, Component } from 'vue-property-decorator'

import Topbar from '@/components/App/Topbar.vue'


@Component({
  components: {Topbar}
})
export default class App extends Vue {

}
</script>