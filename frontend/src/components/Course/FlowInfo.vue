<template>
    <div>
        <p>
            <span v-if="conf.icon == infoIconTypes.warning">⚠️</span>
            {{uiText[conf.textID]}}
        </p>
        <div class="tar boxRestartCourseOpts">
            <button v-if="conf.canResume" @click="onBtnContinueClick" class="button is-info mr">{{uiText.btnContinue}}</button>
            <button v-if="conf.canRestart" @click="onBtnRestartClick" class="button is-primary mr">{{uiText.btnRestart}}</button>
            <button v-if="conf.canGoBack" @click="onBtnGBClick" class="button is-warning">{{uiText.btnGB}}</button>
        </div>
    </div>
</template>

<script>
import CourseFlowInfoBox from './flowInfo'
export default CourseFlowInfoBox
</script>

<style lang="scss" scoped>
    .boxRestartCourseOpts {
        margin-top: 0.4em;
        .mr {
            margin-right: 0.3em;
        }
    }
</style>