<template>
  <div id="app" class="box">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }
</style>
