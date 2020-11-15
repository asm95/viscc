<template>
  <div>
    <div v-if="showConfigBox" class="box">
      <MainConfig @close="onConfigBoxClose" @onLanguageChange="onLanguageSet"/>
    </div>
    <div class="box">
      <div class="ct tar">
        <Gear @click="onConfigBtnClick" class="icn sm anm" />
      </div>
      <img alt="Vue logo" src="../assets/logo.png" width="32px">
      <div>
        <div class="title">{{uiText.lblGramEditor}}</div>
        <GEditor @onGrammarSet="onEditorGrammarSet" />
      </div>
      <div>
        <div class="title">{{uiText.lblLLInfo}}</div>
        <LL1Info @onInfoProcess="onInfoRefresh" :grammar="grammar"/>
      </div>
      <div>
        <div class="title">{{uiText.lblSimulator}}</div>
        <p v-if="errMsg" class="errMsg">{{errMsg}}</p>
        <input type="text" placeholder="input stream" @change="onInputSet" :disabled="! simulatorEnabled" v-model="inputString" class="input">
        <LL1Sim :conf="simSettings" :simulator="parseSimulator"/>
      </div>
      <Tree/>
    </div>
  </div>
</template>

<script lang="ts">
import Home from './home';
export default Home;
</script>

<style scoped>
  .errMsg {
    color: red;
  }
  .title {
    font-size: large;
    text-align: center;
  }
</style>