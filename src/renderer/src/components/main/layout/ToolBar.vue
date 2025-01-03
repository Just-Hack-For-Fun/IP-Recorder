<script setup>
import { ref } from 'vue';
import selectIcon from '@image/select-button.png'
import selectedIcon from '@image/selected-button.png'
import settingsIcon from '@image/settings.png'
import exportIcon from '@image/export.png'
import minIcon from '@image/minimize.png'
import closeIcon from '@image/close.png'
import linel from '@image/line-l.png'
import lines from '@image/line-s.png'
import ComfirmBox from '../../utils/ComfirmBox.vue';


const isOpen = ref(false)
const quitModalVisible = ref(false)
const exportModalVisible = ref(false)
const exportResultText = ref('')

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const openSetWindow = () => {
    // console.log('点击了设置按钮')
    window.api.openSettings()
}

const exportRecord = async() => {
    // console.log('点击了导出按钮')
    const result = await window.api.export()
    // const { code, data, message } = await window.api.export()

    switch (result?.code) {
        case 0:
            exportResultText.value = `成功导出至: ${result.data}`
            break
        case -1:
            exportResultText.value = `导出失败: ${result.message}`
            break
        default:
            exportResultText.value = `导出遇到未知问题`
            return
    }

    exportModalVisible.value = true
    // 与主进程通信相关代码
}

const minimizeWindow = () => {
    // console.log('点击了最小化')
    window.api.minimize()
}

const closeWindow = () => {
    // console.log('点击了关闭按钮')
    window.api.close()
}

// const menuItems = [
//     { icon: settingsIcon, onClick: openSetWindow },
//     { icon: exportIcon, onClick: exportResult },
//     { icon: minIcon, onClick: minimizeWindow },
//     { icon: closeIcon, onClick: () => modalVisible=true }
// ]

</script>


<template>
    <div class="action-container">
        <!-- 箭头按钮 -->
        <div class="select-button" @click="toggleDropdown">
            <img :src="isOpen ? selectedIcon : selectIcon">
        </div>

        <transition name="slide">
            <div class="menu" v-if="isOpen">
                <img class="line-l" :src="linel">
                <img class="settings" :src="settingsIcon" alt="打开设置窗口" @click="openSetWindow" title="设置">
                <img class="export" :src="exportIcon" alt="导出结果" @click="exportRecord" title="导出结果">
                <img class="line-s" :src="lines">
                <img class="min" :src="minIcon" alt="最小化窗口" @click="minimizeWindow" title="最小化">
                <!-- <img class="close" :src="closeIcon" alt="关闭窗口" @click="quitModalVisible = true" title="退出程序"> -->
                <img class="close" :src="closeIcon" alt="关闭窗口" @click="closeWindow" title="退出程序">
            </div>
        </transition>

        <!-- 退出程序确认框 -->
        <ComfirmBox
        :visible="quitModalVisible"
        title="确定要退出程序吗？"
        confirmText="确定"
        :confirmShow="true"
        :cancelShow="false"
        @confirm="closeWindow"
        @close="quitModalVisible=false"
        ></ComfirmBox>

        <!-- 导出文件确认框 -->
        <ComfirmBox
        :visible="exportModalVisible"
        :title="exportResultText"
        confirmText="确定"
        :confirmShow="false"
        :cancelShow="false"
        @confirm="exportModalVisible=false"
        @close="exportModalVisible=false"
        ></ComfirmBox>
    </div>


</template>

<style lang="scss">
.action-container {
    width: 24px;
    // width: 54px;
    // height: 116px;
    height: 100vh;
    background-color: var(--actions-bg);
    display: fixed;
    position: absolute;
    top: 0px;
    right: 0px;
    border-radius: 0 10px 10px 0;
    user-select: none;

    .select-button {
        width: 16px;
        height: 16px;
        margin-top: 4px;
        margin-left: 4px;
        @include my-hover;
        // background-color: pink;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            @include my-hover;
        }
    }
}


.menu {
    width: 24px;
    height: calc(100% - 25px);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 25px;
    right: 0px;
    border-radius: 0 0 10px 0;
    // background-color: red;

    .line-l {
        width: 18px;
        // height: 0px;
        flex-shrink: 0;
        stroke-width: 0.3px;
        stroke: var(--, rgba(236, 177, 173, 0.90));
    }

    .settings {
        margin-top: 6.5px;
        width: 13px;
        height: 13px;
        @include my-hover;
    }

    .export {
        margin-top: 7px;
        width: 12px;
        height: 12px;
        @include my-hover;
    }

    .line-s {
        margin-top: 10px;
        width: 13px;
        stroke-width: 0.3px;
        stroke: var(--, rgba(236, 177, 173, 0.90));

    }

    .min {
        margin-top: 6px;
        width: 12px;
        height: 12px;
        flex-shrink: 0;
        @include my-hover;
    }

    .close {
        margin-top: 6px;
        width: 12px;
        height: 12px;
        flex-shrink: 0;
        @include my-hover;
    }

}

// 动画样式保持不变
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateY(-21px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateY(-21px);
}

.slide-enter-to,
.slide-leave-from {
    opacity: 1;
    transform: translateY(0px);
}

</style>
