import { Component, Vue, Prop } from 'vue-property-decorator';
import { PropType } from 'vue'

import { gLang } from '@/lang'

export enum InfoBoxIcon {
    info, warning, erorr
}

export interface InfoBoxSettings {
    icon: InfoBoxIcon;
    textID: string;
    canResume: boolean;
    canRestart: boolean;
    canGoBack: boolean;
}

@Component({})
export default class CourseFlowInfoBox extends Vue {
    uiText = gLang.uiText.App.CourseFlow;

    @Prop({type: Object as PropType<InfoBoxSettings>}) readonly conf!: InfoBoxSettings;
    infoIconTypes = InfoBoxIcon;

    onBtnContinueClick(){
        this.$emit('onContinue');
    }
    onBtnRestartClick(){
        this.$emit('onRestart');
    }
    onBtnGBClick(){
        this.$emit('onGoBack');
    }
}