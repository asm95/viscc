<template>
  <div class="box">
      <div class="title-2x tac">{{courseTitle}}</div>
      <div v-for="(sectionItem,k) in courseItemDisplay" :key="k">
          <div class="title-1x">{{sectionItem.name}}</div>
          <div class="courseItem" v-for="(courseItem,i) in sectionItem.items" :key="k+i">
              {{courseItem.slug}}<br>
              {{uiText.lblCompleteStatus(courseItem.pctCompleted)}} &bullet; {{courseItem.author}} &bullet;
              {{uiText.lblRating(courseItem.rating)}}
              <span class="courseItem Actions">
                  <router-link v-if="courseItem.isAvailable" :to="{name: courseItem.routerTo}">{{uiText.btnView}}</router-link>
                  <span v-else>{{uiText.lblNA}}</span>
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
  .tac {
      text-align: center;
  }
  .title-1x {
      font-weight: bold;
      font-size: 1.2em;
      margin-top: 1.2em;
  }
  .title-2x {
      font-weight: bold;
      font-size: 1.9em;
  }
  .courseItem {
      margin-bottom: 0.6em;
      .Actions {
          float: right;
      }
  }
</style>