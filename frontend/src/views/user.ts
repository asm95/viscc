import { Vue, Component } from 'vue-property-decorator';

import UserProfile from '@/components/User/Profile.vue'
@Component({
    components: {UserProfile}
})
export default class UserPage extends Vue {}