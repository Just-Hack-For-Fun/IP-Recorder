<script setup>
import { computed, ref } from 'vue';
import round from '@image/theme-round.png'
import { useThemeStore } from '@stores/theme'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDark)

const toggleMove = () => {
    // isDarkMode.value = !isDarkMode.value  // 每次点击切换布尔值
    themeStore.toggleTheme()
}

const toggleBarColor = computed(() => isDarkMode.value ? '#2B947D' : 'linear-gradient(180deg, #FF9940 0%, #FF7D1A 100%)')
</script>

<template>
    <div class="theme-card">
        <p class="title">主题设置</p>
        <div class="toggle-bar">
            <p>亮色模式</p>
            <div class="toggle" @click="toggleMove">
                <div :class="{ dark: isDarkMode }" class="toggle-slider">
                    <p class="toggle-dark">🌙</p>
                    <div class="toggle-handle">
                        <img :src="round">
                    </div>
                    <p class="toggle-light">☀️</p>

                </div>

            </div>
            <p>暗色模式</p>

        </div>
    </div>
</template>

<style lang="scss">
.theme-card {
    width: 360px;
    height: 174px;
    margin: 24px 55px 22px 45px;
    border-radius: 10px;
    border: 1px solid var(--request-border);
    background: var(--theme-card-bg);
    box-shadow: -1px 1px 4px 0px rgba(0, 0, 0, 0.25);

    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
        margin-top: 56px;
        margin-bottom: 26px;
        color: var(--set-content-text);
        text-align: center;
        font-family: "Source Han Sans CN";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        user-select: none;
    }

    .toggle-bar {
        display: flex;
        align-items: center;
        gap: 14px;

        .toggle {
            width: 68px;
            height: 24px;
            flex-shrink: 0;
            border-radius: 12px;
            border: 1px solid #3EC97F;
            background: v-bind(toggleBarColor);
            box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            position: relative;
            user-select: none;
            overflow: hidden;
            line-height: 24px;

            &:hover {
                opacity: 0.9;
            }

            .toggle-slider {
                width: 112px;
                height: 24px;
                position: absolute;
                left: -44px; // 可以调整初始水平位置
                top: 50%; // 垂直居中
                transform: translateY(-50%); // 垂直居中的偏移校正
                transition: transform 0.3s ease;

                display: flex;
                justify-content: space-between;
                align-items: center;

                &.dark {
                    transform: translate(46px, -50%); // 保持垂直居中的同时水平移动
                    transition: transform 0.3s ease;
                }


                .toggle-drak {
                    margin-left: 4px;
                    width: 14px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--set-content-text);
                    font-size: 14px;
                }

                .toggle-handle {
                    width: 20px;
                    height: 20px;
                    transition: all 0.3s ease;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        @include my-hover;
                    }
                }

                .toggle-light {
                    margin-right: 4px;
                    width: 14px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    background: linear-gradient(180deg, #FDF740 0%, #FABF30 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    opacity: 0;
                    animation: fadeIn 0.4s ease forwards;
                }

            }



        }

        p {
            color: var(--set-content-text);
            text-align: center;
            font-family: "Source Han Sans CN";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            user-select: none;
            /* 157.143% */
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
