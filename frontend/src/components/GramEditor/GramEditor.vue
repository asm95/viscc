<template>
    <div>
        <p>Grammar Editor</p>
        <Gear style="color:red;" width="32px" />
        <p>Enter the grammar:</p>
        <textarea v-model="inputGram" class="textarea" rows="5"/>
        <p v-if="errorMsg" class="msgErr">{{errorMsg}}</p>
        <button @click="onEvalBtnClick" class="button">Submit</button>
        <div v-if="rules">
            <div><p>Rules</p>
            <p v-for="(r,i) in rules" :key="i">
                {{r.id}}: {{r.lhs.repr}} -> <span v-for="(rhs, j) in r.rhs" :key="j">{{renderListItem(r.rhs, j)}}</span>
            </p></div>
            <div><p><b>Non-Terminals</b></p>
            <p v-for="(t, k) in nterms" :key="k">
                {{t.id}}: {{t.repr}}
            </p></div>
            <div><p><b>Terminals</b></p>
            <p v-for="(nt, l) in terms" :key="l">
                {{nt.id}}: {{nt.repr}}
            </p></div>
        </div>
    </div>
</template>

<script lang="ts">
import GramEditor from './index'

export default GramEditor;
</script>

<style lang="scss">
    .msgErr {
        color: $MsgColorError;
    }
</style>