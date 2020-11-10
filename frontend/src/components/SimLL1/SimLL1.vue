<template>
    <div>
        <p><b>First Set</b></p>
        <p v-for="(f,i) in firstSet" :key="i">First of ("<span class="c">{{f.symbol}}</span>") = {
            <span v-for="(e,j) in f.items" :key="j">{{ renderListItem(f.items, j) }}</span>
        }
        </p>
        <div>
            <p><b>Follow Set</b></p>
            <p v-for="(f,i) in followSet" :key="i">Follow of ("<span class="c">{{f.symbol}}</span>") = {
                <span v-for="(e,j) in f.items" :key="j">{{ renderListItem(f.items, j) }}</span>
            }
            </p>
        </div>
        <p><b>Nullable Rules</b><br>
            <span v-for="(e,i) in nullableRules" :key="i">{{e}}<br></span>
            <span v-if="!nullableRules.length" class="c">&lt;No Rules&gt;</span>
        </p>
        <div>
            <p><b>Parse Table</b></p>
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
                            <span v-for="(r,k) in renderParseTableEntry(nt.id, t.id)" :key="i+j+k">{{r}} </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import LL1Sim from './index'
export default LL1Sim;
</script>

<style scoped>
    .c {
        font-family: monospace;
    }
</style>