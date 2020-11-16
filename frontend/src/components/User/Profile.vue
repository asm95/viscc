<template>
    <div>
        <div>
            <svg class="userProfile" ref="userPicture">
                <text x="50%" y="80%" text-anchor="middle" class="avatarText">{{getUserCapital(userName)}}</text>
            </svg>
            <span class="userName">{{cropUserName(userName)}}</span>
        </div>
        <div>
            <div class="boxTitle">{{uiText.lblProfile}}</div>
            <div class="field">
                <label class="label">{{uiText.lblName}}</label>
                <div class="control">
                    <input class="input" v-model="userName" type="text" maxlength="255">
                </div>
            </div>
            <div class="field">
                <label class="label">{{uiText.lblID}}</label>
                <div class="control">
                    <input class="input" type="text" value="0000" disabled>
                    <span class="inputInfo">{{uiText.lblFieldInfo}}</span>
                </div>
            </div>
        </div>
        <div>
            <MainConfig/>
        </div>
    </div>
</template>

<script lang="ts">
import Profile from './profile'
export default Profile
</script>

<style scoped>
    .userProfile {
        width: 64px;
        height: 64px;
        background: #d8d8d8;
        border-radius: 50%;
        margin-right: 1em;
    }
    .userName {
        font-size: 2em;
        font-weight: 600;
        color: #848484;
        display: inline-block;
        transform: translate(0, -16px);
    }
    .avatarText {
        font-size: 55px;
        fill: #a8a8a8;
        font-weight: 600;
    }

    .boxTitle {
        font-size: larger;
        font-weight: 700;
        text-align: center;
    }

    .inputInfo {
        font-size: small;
        font-style: italic;
    }
</style>