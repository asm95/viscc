import { Vue, Component } from 'vue-property-decorator'

import {gLang} from '@/lang'
import AppM from '@/manage/app'

@Component({})
export default class TopBar extends Vue {
    appName = 'VisCC'
    uiText = gLang.uiText.App
    loggedUser = false;
    userName = '';

    onUserLogged(){
        this.loggedUser = true;
        this.userName = AppM.conf.userProfile.prettyName;
    }
    
    cropUserName(userName: string): string {
        // source: profile.ts
        const maxChars = 25;
        const endInfo = ' ...';
        const maxStrLen = maxChars - endInfo.length;
        if (userName.length > maxStrLen){
            return `${userName.substring(0, maxStrLen)}${endInfo}`;
        }
        return userName;
    }
    
    getUserCapital(userName: string): string {
        // source: profile.ts
        return userName[0] || '?';
    }

    mounted(){
        this.$root.$on('onUserLogged', this.onUserLogged);
    }
}