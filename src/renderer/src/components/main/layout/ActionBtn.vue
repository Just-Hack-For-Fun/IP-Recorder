<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import startIcon from '@image/start.png'
import startDarkIcon from '@image/start-dark.png'
import pauseIcon from '@image/pause.png'
import pauseDarkIcon from '@image/pause-dark.png'
import stopDisabledIcon from '@image/stop.png'
import stopDisabledDarkIcon from '@image/stop-dark.png'
import stopEnabledIcon from '@image/stop-enabled.png'
import stopEnabledDarkIcon from '@image/stop-enabled-dark.png'
import ComfirmBox from '../../utils/ComfirmBox.vue';
import { useMessage } from '../../../utils/useMessage';
import { useThemeStore } from '@stores/theme'

const messageBox = useMessage()
const themeStore = useThemeStore()


const start = computed(() => themeStore.isDark ? startDarkIcon : startIcon)
const pause = computed(() => themeStore.isDark ? pauseDarkIcon : pauseIcon)
const stopDisabled = computed(() => themeStore.isDark ? stopDisabledDarkIcon : stopDisabledIcon)
const stopEnabled = computed(() => themeStore.isDark ? stopEnabledDarkIcon : stopEnabledIcon)

onMounted(() => {
    themeStore.initThemeSync()
})
// 共有 3 种状态
// - init    初始化/已停止
// - logging 正在记录
// - paused  已暂停
const status = ref('init')
const modalVisible = ref(false)
const errorModalVisible = ref(false)
const errorText = ref('')

// 检查是否存在历史记录
const getHistory = async () => {
    const result = await window.api.hasHistory()

    if (result.code === -1) {
        messageBox.info(`获取失败: ${result.message}`)
        // console.log('开机记录操作失败')
    }

    // result.data Boolean
    if (result.code === 0 && result.data) {
        return modalVisible.value = true
    }

    startRecord()
}

// 重置记录
const resetRecord = async () => {
    // console.log('重置记录')
    const { code, message } = await window.api.resetRecord()
    if (code === 0) {
        modalVisible.value = false
        startRecord()
    } else {
        messageBox.info(`重置记录失败`)
    }
}

// 开始记录
const startRecord = async () => {
    // console.log('开始记录')
    let result = await window.api.start()
    const { code, data, message } = result

    modalVisible.value = false
    if (code === 0) status.value = 'logging'
    if (code === -1) {
        errorText.value = message
        errorModalVisible.value = true
    }
}

// 暂停记录
const pauseRecord = async () => {
    // console.log('暂停记录')
    const { code } = await window.api.pause()
    if (code === 0) status.value = 'paused'
}

// 停止记录
const stopRecord = async () => {
    // console.log('停止记录')
    const { code, message } = await window.api.stop()
    if (code === 0) status.value = 'init'
}


const resumeRecord = async () => {
    let result = await window.api.resume()
    const { code, data, message } = result

    modalVisible.value = false
    if (code === 0) status.value = 'logging'
    if (code === -1) {
        errorText.value = message
        errorModalVisible.value = true
    }
}


</script>

<template>
    <div class="ctrl-container">
        <template v-if="status === 'logging'">
            <img class="pause" :src="pause" title="暂停" @click="pauseRecord">
            <img class="stop-enabled" :src="stopEnabled" title="停止记录" @click="stopRecord">
        </template>
        <template v-else-if="status === 'init'">
            <img class="start" :src="start" title="开始/继续记录" @click="getHistory">
            <img class="stop-disabled" :src="stopDisabled">
        </template>
        <template v-else-if="status === 'paused'">
            <img class="start" :src="start" title="开始/继续记录" @click="resumeRecord">
            <img class="stop-enabled" :src="stopEnabled" title="停止记录" @click="stopRecord">
        </template>
        <ComfirmBox
            :visible="modalVisible"
            title="存在历史记录，继续还是开启新记录"
            confirmText="开启新记录"
            cancelText="继续记录"
            :confirmShow="true"
            :cancelShow="true"
            @confirm="resetRecord"
            @cancel="startRecord"
            @close="modalVisible = false">
        </ComfirmBox>
        <!-- 导出文件确认框 -->
        <ComfirmBox
        :visible="errorModalVisible"
        :title="errorText"
        :confirmShow="false"
        :cancelShow="false"
        @close="errorModalVisible=false"
        ></ComfirmBox>
    </div>
</template>

<style lang="scss">
.ctrl-container {
    width: 132px;
    height: 66px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    // gap: 21.45px;

    flex-shrink: 0;
    border-radius: 12px;
    background-color: var(--ctrl-bg);
    user-select: none;
}

.ctrl-container .start,
.pause {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    margin-left: 6px;
    -webkit-user-drag: none;
    // background: transparent;


    @include my-hover;

    // margin-right: 12px;
}

.ctrl-container .stop-disabled,
.stop-enabled {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    margin-right: 6px;
    -webkit-user-drag: none;

    @include my-hover;
}
</style>
