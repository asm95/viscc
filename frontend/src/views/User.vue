<template>
  <div class="box">
    <div v-if="loggedUser" class="boxLogout">
      <a @click="onLogoutBtnClick">{{uiText.lblLogout}}</a>
    </div>
    <UserProfile/>
  </div>
</template>

<script lang="ts">
import UserPage from './user'
export default UserPage
</script>

<style scoped>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }
  .boxLogout {
    text-align: right;
  }
</style>