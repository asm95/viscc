import { Vue, Component } from 'vue-property-decorator'

import {gLang} from '@/lang'


interface CourseItem {
    slug: string;
    author: string;
    rating: number;
    pctCompleted?: number;
    routerTo: string;
}

interface CourseCategory {
    name: string;
    items: CourseItem[];
}

const courseItems: CourseCategory[] = [
    {name: 'sec-lex', items: []},
    {name: 'sec-syntax', items: [
        {slug: 'introd-syntax-analysis', author: 'Cristiano', rating: 3, routerTo: 'About'},
        {slug: 'sa-ll1-part-one', author: 'VisCC', rating: 5, routerTo: 'CG-Syntax-1'}
    ]},
];

@Component({})
export default class CourseList extends Vue {
    courseItemDisplay: CourseCategory[] = [];
    uiText = gLang.uiText.App.Courses;

    updateCourseCategory(cItems: CourseCategory[]){
        this.courseItemDisplay = [];
        const displayItems =  this.courseItemDisplay;
        const displayText = this.uiText.byName;
        for (const item of cItems){
            const courseDT = displayText[item.name];
            displayItems.push({
                name: courseDT.title,
                items: item.items.map(e => {
                    const f = Object.assign({}, e) as CourseItem;
                    const courseText = displayText[e.slug];
                    f.slug = courseText.title;
                    f.pctCompleted = 0;
                    return f;
                })
            });
        }
    }

    mounted(){
        this.updateCourseCategory(courseItems);
    }

    constructor(){
        super();
    }
}