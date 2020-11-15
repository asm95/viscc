<template>
  <div id="app">
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

  /*icons*/
  .icn.sm{width: 16px; height: 16px;}
  .icn.anm:hover{transform: scale(1.2);}

  /*align; c = container, tar = text align right*/
  .ct.tar{text-align: right;}
</style>
