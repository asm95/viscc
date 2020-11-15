<template>
  <div class="box">
      <div class="secTitle">{{uiText.lblLogin}}</div>
      <div>
        <div class="field">
            <label class="label">{{uiText.lblUser}}</label>
            <div class="control">
                <input class="input" type="text" maxlength="255" placeholder="">
            </div>
        </div>
        <div class="field">
            <label class="label">{{uiText.lblPassword}}</label>
            <div class="control">
                <input class="input" type="password" maxlength="255" placeholder="">
            </div>
        </div>
        <div class="field">
            <div class="control">
                <button class="button is-primary">{{uiText.btnSubmit}}</button>
            </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Login from './login'
export default Login
</script>

<style scoped>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }

  .secTitle{
    font-weight: bold;
    font-size: x-large;
  }
</style>