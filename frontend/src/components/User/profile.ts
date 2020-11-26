import { Vue, Component, Watch, Ref } from 'vue-property-decorator'

import MainConfig from '@/components/Config/MainConfig.vue'
import MainConfigC from '@/components/Config/main'
import {gLang} from '@/lang'
import AppM from '@/manage/app'


@Component({
    components: {MainConfig}
})
export default class UserProfile extends Vue {
    userName = 'Named User'
    uiText = gLang.uiText.App.User

    @Ref('config') readonly CConfig!: MainConfigC;

    cropUserName(userName: string): string {
        const maxChars = 25;
        const endInfo = ' ...';
        const maxStrLen = maxChars - endInfo.length;
        if (userName.length > maxStrLen){
            return `${userName.substring(0, maxStrLen)}${endInfo}`;
        }
        return userName;
    }
    getUserCapital(userName: string): string {
        return userName[0] || '?';
    }

    mounted (){
        const el = this.$refs['userPicture'];
    }

    @Watch('userName')
    onNameChanged(nv: string, ov: string){
        const profile = AppM.conf.userProfile;
        profile.prettyName = nv;
        this.CConfig.onConfigChanged();
    }

    constructor (){
        super();
        const profile = AppM.conf.userProfile;
        this.userName = profile.prettyName;
    }
}