<template>
  <div class="box">
    <div v-if="lang == 'enUS'" class="content">
      <div id="sec-privacy">
        <div class="secTitle">Privacy Terms</div>
      </div>
    </div>
    <div v-if="lang == 'ptBR'" class="content">
      <div id="sec-privacy">
        <div class="secTitle">Termos de Privacidade</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import About from './about'
export default About
</script>

<style scoped>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }

  .secTitle{
    font-weight: bold;
    font-size: x-large;
  }
</style>