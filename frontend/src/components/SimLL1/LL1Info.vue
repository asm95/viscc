<template>
    <div>
        <div class="sec-title">{{uiText.lblFirstSet}}</div>
        <p v-for="(f,i) in firstSet" :key="i">First of ("<span class="c">{{f.symbol}}</span>") = {
            <span v-for="(e,j) in f.items" :key="j">{{ renderListItem(f.items, j) }}</span>
        }
        </p>
        <div>
            <div class="sec-title">{{uiText.lblFollowSet}}</div>
            <p v-for="(f,i) in followSet" :key="i">Follow of ("<span class="c">{{f.symbol}}</span>") = {
                <span v-for="(e,j) in f.items" :key="j">{{ renderListItem(f.items, j) }}</span>
            }
            </p>
        </div>
        <div>
            <div class="sec-title">{{uiText.lblNullableRules}}</div>
            <span v-for="(e,i) in nullableRules" :key="i">{{e}}<br></span>
            <span v-if="!nullableRules.length" class="c">&lt;No Rules&gt;</span>
        </div>
        <div>
            <div class="sec-title">{{uiText.lblParseTable}}</div>
            <table class="table">
                <thead>
                    <tr>
                        <td></td>
                        <td v-for="(e,i) in tokens" :key="i">{{e.repr}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(nt, i) in nterms" :key="i">
                        <td>{{nt.repr}}</td>
                        <td v-for="(t,j) in tokens" :key="i+j">
                            <div v-for="(itm,k) in [renderParseTableEntry(nt.id, t.id)]" :key="i+j+k">
                                <div :class="{'ptConflict': (config.showParseTableConflicts && itm.hasConflict)}">
                                    <span v-for="(r,l) in itm.rules" :key="i+j+k+l">{{r}} </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import LL1Info from './index'
export default LL1Info;
</script>

<style scoped>
    .c {
        font-family: monospace;
    }
    .ptConflict {
        color: red;
    }
    .sec-title {
        font-size: medium;
        font-weight: bold;
    }
</style>