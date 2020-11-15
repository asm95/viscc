import { Vue, Component } from 'vue-property-decorator'

import {gLang} from '@/lang'

@Component({})
export default class TopBar extends Vue {
    appName = 'VisCC'
    uiText = gLang.uiText.App
    loggedUser = false;
}