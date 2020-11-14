<template>
    <div>
        <p v-html="questionText"></p>
        <!-- component stack and input stream -->
        <div class="columns">
            <div class="column">
                <table class="table stack">
                <thead>
                    <tr>
                        <th v-if="conf.showLines">{{uiText.stack.tblHeaderPos}}</th>
                        <th>{{uiText.stack.tblHeaderCnt}}</th>
                    </tr>
                </thead>
                <tbody v-if="stackContent.length > 0">
                    <tr v-for="(s, idx) in stackContent" :key="idx">
                        <td v-if="conf.showLines">{{idx+1}}</td>
                        <td v-html="s.display"></td>
                    </tr>
                </tbody>
                <tbody v-if="stackContent.length == 0">
                    <tr><td colspan="2"><center><span class="c">&lt;{{uiText.stack.lblIsEmpty}}&gt;</span></center></td></tr>
                </tbody>
                </table>
            </div>
            <div class="column">
                <p>{{uiText.lblInputS}} <span v-html="inputStream.display" class="c"></span></p>
            </div>
        </div>
        <!-- rules -->
        <div>
            <p>{{uiText.lblRules}}</p>
            <p v-for="(r,idx) in availRules" :key="idx"><span class="c">{{idx+1}}: </span><span class="c" v-html="r.display"></span></p>
        </div>
        <!-- command history -->
        <div v-if="commandHistory.length > 0">
            <p>{{uiText.lblCmdH}}</p>
            <p v-for="(cmd, idx) in commandHistory" :key="idx">{{(idx+1)}}: <span v-html="cmd.display"></span></p>
        </div>
        <!-- command box -->
        <div>
            <p>{{uiText.lblCmd}}</p>
            <p v-if="errMsg.inputCommand" v-html="errMsg.inputCommand.display" class="tc err"></p>
            <input @keyup="onUserInputCommand" v-model="curInput" :maxlength="inputMaxLength" :disabled="inputDisabled" type="text" name="" class="input c">
            <div v-if="errMsg.fatalState">
                <p v-html="errMsg.fatalState"></p>
                <div class="btnRestart">
                <button v-on:click="onResetBtnClick" class="button" alt="Restart">
                    <Arrow :class="['icn', conf.optMoboVer ? 'md' : 'sm']" />
                </button>
                </div>
            </div>
            <div v-if="userStatus">
                <p v-html="userStatus.display"></p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Simulator from './simulator'
export default Simulator;
</script>

<style>
    /* text-color error */
    .tc.err {color: #e84622;}
    .c {font-family: monospace;}

    /* buttons that should be in the center */
    .mob .btnRestart {
        text-align: center;
    }

    /* sim1 = simulator type 1 = LL(1); t = token; w = walking; p = pending; o = ok; e = error*/
    .sim1{border: 1px solid;}
    .sim1.t.w {border-color: blue;}
    .sim1.t.p {border-color: yellow;}
    .sim1.t.o {border-color: green;}
    .sim1.t.e {border-color: red;}
</style>