import { Vue, Component } from 'vue-property-decorator'

import MainRouter from '@/router'

@Component({})
export default class Home extends Vue {
    constructor(){
        super();
        MainRouter.push({name: 'CourseList'});
    }
}