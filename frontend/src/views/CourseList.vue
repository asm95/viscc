<template>
  <div class="box">
      <div v-for="(sectionItem,k) in courseItemDisplay" :key="k">
          <div class="title-1x">{{sectionItem.name}}</div>
          <div class="courseItem" v-for="(courseItem,i) in sectionItem.items" :key="k+i">
              {{courseItem.slug}}<br>
              {{courseItem.pctCompleted}}% Complete &bullet; {{courseItem.author}} &bullet; {{courseItem.rating}} stars rating
              <span class="courseItem Actions">
                  <router-link :to="{name: courseItem.routerTo}">View</router-link>
              </span>
          </div>

      </div>
  </div>
</template>

<script lang="ts">
import CourseList from './courseList'
export default CourseList
</script>

<style lang="scss" scoped>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }
  .title-1x {
      font-weight: bold;
      font-size: 1.2em;
      margin-top: 1em;
  }
  .courseItem {
      margin-bottom: 0.3em;
      .Actions {
          float: right;
      }
  }
</style>