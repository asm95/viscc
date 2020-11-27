<template>
    <div>
        <div class="content">
            <div class="boxTitle">{{uiText.lblTitle}}</div>
            <div>
                {{uiText.lblLang}}
                <select v-on:change="onLangSet" v-model="selectedLangID" class="select is-small">
                    <option v-for="(lang, i) in availLanguages" v-bind:value="lang.code" :key="i">{{lang.title}}</option>
                </select>
            </div>
            <div>
                <p class="secTitle">{{uiText.lblPrivacy}}</p>
                <label class="checkbox">
                    <input @change="onPrivacyCbToggle" v-model="acceptPrivacy" type="checkbox">
                    {{uiText.cbTextPrivacy}}
                </label>
            </div>
            <div>
                <div class="btnActions">
                    <button @click="onSaveBtnClick" :disabled="btnSaveDisabled" class="button is-primary ar">{{uiText.btnSave}}</button>
                    <button @click="onDiscardBtnClick" :disabled="btnDiscardDisabled" class="button is-warning" >{{uiText.btnDiscard}}</button>
                </div>
                <div v-if="savingAppText" class="{textSmall: true, hasError: remoteSaveError}">
                    <i>{{savingAppText}}</i>
                </div>
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

<style lang="scss" scoped>
    .boxTitle {
        font-size: larger;
        font-weight: 700;
        text-align: center;
    }
    .textSmall {
        font-size: small;
    }
    .secTitle{
        font-weight: 700;
    }
    .btnActions {
        text-align: center;
        .ar {
            // margin between buttons
            margin-right: 0.5em;
        }
    }
    .hasError {
        color: red;
    }
</style>