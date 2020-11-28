import { Vue, Component } from 'vue-property-decorator'

import {gLang} from '@/lang'


interface CourseItem {
    slug: string;
    author: string;
    rating: number;
    pctCompleted?: number;
    routerTo: string;
    isAvailable: boolean;
}

interface CourseCategory {
    name: string;
    items: CourseItem[];
}

const courseItems: CourseCategory[] = [
    {name: 'sec-lex', items: [
        {slug: 'introd-lex-analysis', author: 'VisCC', rating: 5, routerTo: 'About', isAvailable: false},
        {slug: 'la-nfa2dfa', author: 'VisCC', rating: -1, routerTo: 'About', isAvailable: false},
    ]},
    {name: 'sec-syntax', items: [
        {slug: 'introd-syntax-analysis', author: 'Cristiano', rating: 3, routerTo: 'About', isAvailable: false},
        {slug: 'sa-ll1-part-one', author: 'VisCC', rating: 5, routerTo: 'CG-Syntax-1', isAvailable: true}
    ]},
];

@Component({})
export default class CourseList extends Vue {
    courseItemDisplay: CourseCategory[] = [];
    uiText = gLang.uiText.App.CourseList;
    courseTitle = 'Course Title';

    updateCourseCategory(cItems: CourseCategory[]){
        const text = gLang.uiText.App.Courses;
        this.courseItemDisplay = [];
        this.courseTitle = text.title;
        const displayItems =  this.courseItemDisplay;
        const displayText = text.byName;
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