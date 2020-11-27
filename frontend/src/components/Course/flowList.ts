import { Component, Vue, Prop } from 'vue-property-decorator';
import { PropType } from 'vue'

import { gLang } from '@/lang'

export interface CourseItemView {
    display: string;
    isActive: boolean;
}

export interface CourseFlowSettings {
    showTitle: boolean;
    progress: number;
    courseItems: CourseItemView[];
}

@Component({})
export default class CourseFlowList extends Vue {
    uiText = gLang.uiText.App.CourseFlow;

    @Prop({type: Object as PropType<CourseFlowSettings>}) readonly conf!: CourseFlowSettings;
}