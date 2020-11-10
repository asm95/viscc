export default class Stack<T> {
    s: T[];

    getTop(): T | undefined {
        const idx = this.s.length-1;
        return (idx>=0) ? this.s[idx] : undefined;
    }

    popItem(): T | undefined {
        return this.s.pop();
    }

    pushItem(item: T | T[]) {
        if (Array.isArray(item)){
            for (const e of item){this.s.push(e);}
        } else {
            this.s.push(item);
        }
    }

    size(): number{
        return this.s.length;
    }

    constructor(){
        this.s = [];
    }
}