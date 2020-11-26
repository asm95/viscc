<template>
    <div class="topBar">
        <span class="appTitle">{{appName}}</span>
        <router-link to="/">{{uiText.lblHome}}</router-link> |
        <router-link to="/about">{{uiText.lblAbout}}</router-link>
        <span class="userBlock">
            <span v-if="loggedUser">
                <router-link to="/user" class="userName">{{cropUserName(userName)}}</router-link>
                <svg class="userProfile" ref="userPicture">
                    <text x="50%" y="70%" text-anchor="middle" class="avatarText">{{getUserCapital(userName)}}</text>
                </svg>
            </span>
            <span v-else>
                <router-link to="/login">{{uiText.lblLogin}}</router-link> |
                <router-link to="/login">{{uiText.lblRegister}}</router-link>
            </span>
            <span class="appTitle">&zwnj;</span>
        </span>
    </div>
</template>

<script lang="ts">
import Topbar from './topbar'
export default Topbar;
</script>

<style lang="scss" scoped>
    .topBar {
        height: 40px;
        background: #5e7272;
        color: white;

        a:link {
            color: #8fdafc;
        }
        a:visited {
            color: pink;
        }
        padding-left: 1em;
        padding-right: 1em;
        .userBlock {
            float: right;
            line-height: x-large;
        }
        box-shadow: rgba(100, 100, 111, 0.2) 0 0.5em 2em;
    }
    .appTitle {
        font-weight: bold;
        font-size: x-large;
        padding-right: 1em;
    }

    .userProfile {
        width: 32px;
        height: 32px;
        background: #d8d8d8;
        border-radius: 50%;
        margin-left: 1em;
        margin-top: 0.25em;
    }
    .userName {
        display: inline-block;
        transform: translate(0, -8px);
    }
</style>