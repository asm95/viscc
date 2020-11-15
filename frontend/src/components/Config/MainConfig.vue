<template>
    <div>
        <div class="content">
            <div class="ct tar">
               <CircleFill v-on:click="onCloseBtnClick" class="icn sm anm"  />
            </div>
            <div class="boxTitle">{{uiText.lblTitle}}</div>
            <div>
                {{uiText.lblLang}}
                <select v-on:change="onLangSet" v-model="selectedLangID" class="select is-small">
                    <option v-for="(lang, i) in availLanguages" v-bind:value="lang.code" :key="i">{{lang.title}}</option>
                </select>
            </div>
            <div>
                <div v-if="reloadAppText" class="textSmall">
                    <i>{{reloadAppText}}</i> (<a @click="onReloadAppBtnClick">{{uiText.btnRestartNow}}</a>)
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import MainConfig from './main'
export default MainConfig;
</script>

<style scoped>
    .boxTitle {
        font-size: larger;
        font-weight: 700;
        text-align: center;
    }
    .textSmall {
        font-size: small;
    }
</style>