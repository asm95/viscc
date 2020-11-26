import { Vue, Component } from 'vue-property-decorator'

import UserProfile from '@/components/User/Profile.vue'
import AppC from '@/manage/app'

import {gLang} from '@/lang'

@Component({
    components: {UserProfile}
})
export default class UserPage extends Vue {
    loggedUser = false;
    userName = 'Adam';
    uiText = gLang.uiText.App.User;

    onLogoutBtnClick(){
        // when user clicks to logout
        AppC.logoutUser();
        window.location.reload();
    }

    mounted(){
        if (AppC.conf.userProfile.isLogged){
            this.loggedUser = true;
        }
    }
}