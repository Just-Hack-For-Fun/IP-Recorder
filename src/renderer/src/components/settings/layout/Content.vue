<script setup>
import { ref, watch, computed } from 'vue'
import proxyIcon from '@image/proxy.png'
import apiIcon from '@image/api.png'
import reqIcon from '@image/request.png'
import themeIcon from '@image/theme.png'
import themeDarkIcon from '@image/theme-dark.png'

import Proxy from '@components/settings/contents/Proxy.vue'
import ApiSource from '@components/settings/contents/ApiSource.vue'
import RequestOpt from '@components/settings/contents/RequestOpt.vue'
import Theme from '@components/settings/contents/Theme.vue'

import { useThemeStore } from '@stores/theme'
const themeStore = useThemeStore()
const theme = computed(() => themeStore.isDark ? themeDarkIcon : themeIcon)

const selectedIndex = ref(0)

const options = computed(() => [
    { name: "代理设置", icon: proxyIcon, component: Proxy },
    { name: "数据接口", icon: apiIcon, component: ApiSource },
    { name: "请求配置", icon: reqIcon, component: RequestOpt },
    { name: "主题模式", icon: theme.value, component: Theme }
])

const clsoeWindow = () => {
    // window.api.hello()
    window.api.close()
}

</script>

<template>
    <div class="settings-container">
        <div class="settings-menu">
            <li v-for="(option, index) in options" :class="{ active: selectedIndex === index }"
                @click="selectedIndex = index">
                <div>
                    <img :src="option.icon" alt="">
                    <p>{{ option.name }}</p>
                </div>
            </li>
        </div>

        <div class="settings-content"></div>
        <component :is="options[selectedIndex].component"></component>
    </div>

    <div class="close-btn" @click="clsoeWindow">
        <img src="@image/close.png" alt="">
    </div>

</template>

<style lang="scss">
.settings-container {
    display: flex;
    background-color: var(--bg);
    border-radius: 12px;
    border: 1px solid var(--proxy-border);
    // box-shadow: -1px 1px 4px 0px rgba(0, 0, 0, 0.25);
}

.settings-menu {
    width: 140px;
    height: 220px;
    flex-shrink: 0;
    // background-color: pink;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px;
    border-radius: 12px 0px 0px 12px;
    border-right: 1px solid var(--set-side-sep);
    background: var(--bg);
    user-select: none;
}

.settings-menu li {
    width: 140px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    transition: background-color 0.2s ease;
    /* 添加过渡效果 */

    &:first-child {
        margin-top: 20px;
    }

    &:hover {
        background-color: var(--set-menu-hover);
    }

    &.active {
        background-color: var(--set-menu-select);
    }


    div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;

        img {
            width: 18px;
            height: 18px;
            object-fit: contain;
            -webkit-user-drag: none;
        }

        p {
            color: var(--set-side-text);
            font-family: "Source Han Sans CN";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 137.5% */
        }

    }
}


.close-btn {
        display: fixed;
        position: absolute;
        width: 20px;
        height: 20px;
        top: 8px;
        right: 8px;
        user-select: none;

        img {
            width: 20px;
            height: 20px;
            object-fit: contain;

            @include my-hover;
        }
    }
</style>
