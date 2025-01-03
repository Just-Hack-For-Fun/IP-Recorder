<script setup>
import ipipNetIcon from '@image/ipipnet.png'
import ipipNetLogo from '@image/ipipnet-logo.png'
import ipifyIcon from '@image/ipify.png'
import ipifyLogo from '@image/ipify-logo.png'
import baiduIcon from '@image/baidu.png'
import baiduLogo from '@image/baidu-logo.png'
import ipApiIcon from '@image/ip-api.png'
import ipApiLogo from '@image/ip-api-logo.png'
import apiSelectIcon from '@image/api-select.png'
import { ref, watchEffect, onMounted } from 'vue';

const emit = defineEmits(['api-change'])


const selectedIndex = ref(0)

const cardList = [
    { name: "ipipnet", text: "IPIP.NET", icon: ipipNetLogo, link: "https://myip.ipip.net/" },
    { name: "ipify", text: "Ipify", icon: ipifyLogo, link: "https://api.ipify.org/" },
    { name: "baidu", text: "Baidu", icon: baiduLogo, link: "https://qifu-api.baidubce.com/" },
    { name: "ip-api", text: "ip-api", icon: ipApiLogo, link: "http://demo.ip-api.com/" },
]

watchEffect(() => {
    // console.log(selectedIndex.value)
    emit('api-change', selectedIndex.value)
})

onMounted(async () => {
    const { code, data } = await window.api.getApiSource()
    if (code === 0) selectedIndex.value = data || 0
})


</script>

<template>
    <div class="card-container">
        <div class="card" v-for="(api, index) in cardList" @click="selectedIndex = index">
            <div class="card-image" :class="selectedIndex===index ? 'is-select':''">
                <div class="banner">
                    <img :src="api.icon">
                    <p>{{ api.text }}</p>
                </div>

                <p>{{ api.link }}</p>
            </div>
            <div class="radio" v-if="selectedIndex === index">
                <img :src="apiSelectIcon">
            </div>
        </div>

    </div>
</template>

<style lang="scss">
.card-container {
    width: 295px;
    height: 125px;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 15px;

    .card {
        width: 136px;
        height: 55px;
        border-radius: 8px;
        position: relative;

        // background-color: red;
        .card-image {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            background-color: var(--api-single-card-bg);
            color: var(--api-single-card-text);
            border: 1px solid var(--api-single-card-border);

            @include my-hover;

            &.is-select {
                border-radius: 8px;
                background-color: var(--api-card-selected-bg);
                color: var(--api-card-selected-text);
                border: 1px solid var(--api-card-selected-border);
            }

            .banner {
                display: flex;
                align-items: center;
                padding-top: 8px;
                padding-left: 8px;

                img {
                    width: 20px;
                    height: 20px;
                    // background-color: red;
                    object-fit: contain;
                    @include my-hover;
                    // z-index: 1;
                }

                p {
                    margin-left: 4px;
                    // color: #FFF;
                    font-family: "Source Han Sans CN";
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    // background-color: blue;
                    /* 157.143% */

                }
            }

            p {
                margin-left: 8px;
                // color: rgba(238, 235, 235, 0.90);
                font-family: "Source Han Sans CN";
                font-size: 8px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 275% */
            }

        }

        .radio {
            position: absolute;
            width: 8px;
            height: 8px;
            top: 4px;
            right: 4px;
            // background-color: pink;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                @include my-hover;
            }
        }
    }
}
</style>
