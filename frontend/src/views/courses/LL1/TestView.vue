<template>
  <div>
    <div v-if="boxStates.config.isVisible" class="box">
      <div v-if="boxStates.config.isClosable" class="ct tar">
        <CircleFill v-on:click="onConfigBoxClose" class="icn sm anm" />
      </div>
      <MainConfig @onLanguageChange="onLanguageSet"/>
    </div>
    <div v-if="boxStates.courseInfo.isVisible" class="box isInfo">
      <CourseFlowInfoBox @onGoBack="onCFActionGB" :conf="configCF"/>
    </div>
    <div v-if="boxStates.courseProgress.isVisible" class="box">
      <div v-if="boxStates.courseProgress.isClosable" class="ct tar">
        <CircleFill v-on:click="onCloseProgressBoxBtnClick" class="icn sm anm" />
      </div>
      <CourseFlowList :conf="flowManager.flowSettings"/>
    </div>
    <div v-if="viewState.ActivityBox" :class="{box: true, isDisabled: isSimulatorDisabled}">
      <div class="ct tar">
        <Gear @click="onConfigBtnClick" class="icn sm anm" />
      </div>
      <img alt="Vue logo" src="@/assets/logo.png" width="32px">
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
        <LL1Sim @onState="onSimulatorStateChange" :conf="simSettings" :simulator="parseSimulator"/>
      </div>
      <Tree/>
    </div>
    <div v-if="boxStates.courseEndedActions.isVisible" class="boxNoStyle ActivityOpts tar">
      <button v-if="viewState.BtnACReview" @click="onACReviewBtnClick" class="button mr is-primary">{{cfText.btnReview}}</button>
      <button @click="onACQuitBtnClick" class="button is-warning">{{cfText.btnQuit}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import TestView from './testView';
export default TestView;
</script>

<style lang="scss" scoped>
  .errMsg {
    color: red;
  }
  .title {
    font-size: large;
    text-align: center;
  }

  .isInfo {
    background-color: #ebfffc;
  }
  .isDisabled {
    opacity: 50%;
    pointer-events: none;
  }
  button.mr {
    margin-right: 0.4em;
  }
  .ActivityOpts {
    margin-bottom: 1em;
  }
</style>