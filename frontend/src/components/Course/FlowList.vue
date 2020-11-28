<template>
    <div>
        <div class="title">{{uiText.lblTitle}}</div>
        <progress class="progress is-primary" :value="conf.progress" max="1"></progress>
        <ul class="progressCheck">
            <li v-for="(item, k) in conf.courseItems" :key="k" :class="{active: item.isActive}">{{item.display}}</li>
        </ul>
    </div>
</template>

<script>
import CourseFlowList from './flowList'
export default CourseFlowList
</script>

<style lang="scss" scoped>
    .title {
        font-size: large;
        text-align: center;
    }
    .progressCheck {
        margin-left: 0.5em;
        li:before {
            content: "⭕";
            margin-right: 0.2em;
        }
        li.active:before {
            content: "✔️";
        }
    }
</style>