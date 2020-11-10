import Vue from 'vue'

import { Grammar } from '@/sim/ll1'

import SimLL1 from '@/components/SimLL1.vue'


class AppController{
    app: Vue | null;
    gSimStore: SimLL1[];

    public editorSetGrammar(g: Grammar){
        // well this seems to not work for componentes themselves
        // we don't how multiple simulators would work yet
        const selectedID = 0;
        if (selectedID <= this.gSimStore.length-1){
            this.gSimStore[selectedID].$emit('onEditorSetGrammar', g);
        }
    }

    public registerSimulator(ins: SimLL1): number {
        this.gSimStore.push(ins);
        return this.gSimStore.length-1;
    }

    public setApp(app: Vue){
        this.app = app;
    }

    constructor(){
        this.app = null;
        this.gSimStore = [];
    }
}

// signleton
const insAppCntrl = new AppController();

export default insAppCntrl;
