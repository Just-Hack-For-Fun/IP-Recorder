<script setup>
import { onMounted, ref } from 'vue';
import BtnGroup from '../utils/BtnGroup.vue';
import apiCards from '@components/settings/contents/apiCard/apiCards.vue';
import { useMessage } from '../../../utils/useMessage';

const messageBox = useMessage()

const apiSource = ref(0)

const testApiSource = async () => {
    // console.log('测试API接口可用性')

    const { code, data, message } = await window.api.testApiSource(apiSource.value)
    if (code === 0) messageBox.info(`接口可用: ${data.ip}`)
    if (code === -1) messageBox.info(`接口不可用`)
}



const saveApiSource = async () => {
    // console.log('保存API接口选择')
    const { code, message } = await window.api.saveApiSource(apiSource.value)
    if (code === 0) {
        messageBox.info('接口设置成功')
        return window.api.updateIPInfo()
    }

    if (code === -1) messageBox.info(message)
}

const selectApiSource = (index) => {
    // console.log('api source', index)
    apiSource.value = index
}

</script>

<template>
    <div class="api-container">
        <div class="api-card">
            <apiCards @api-change="selectApiSource"></apiCards>
        </div>
        <div class="btn-group">
            <BtnGroup @test="testApiSource" @save="saveApiSource"></BtnGroup>
        </div>
        <div>
            <div class="line-row"><svg xmlns="http://www.w3.org/2000/svg" width="297" height="2" viewBox="0 0 297 2"
                    fill="none">
                    <path d="M1 1L296 0.999974" stroke-linecap="round" stroke-dasharray="2 2" />
                </svg></div>
            <div class="line-column">
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="127" viewBox="0 0 2 127" fill="none">
                    <path d="M1 1L1.00001 126" stroke-linecap="round" stroke-dasharray="2 2" />
                </svg>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.api-container {
    width: 380px;
    height: 190px;
    margin: 18px 40px 12px 40px;
    border-radius: 12px;
    // background-color: var(--api-card-bg);

    user-select: none;

    .api-card {
        margin: 17px 42.5px 12px 42.5px;
        // background-color: red;
    }

    .btn-group {
        display: flex;
        justify-content: center;
        margin-top: 14px;
        margin-bottom: 6px;
    }
}

.line-row {
    position: absolute;
    top: 82px;
    right: 82.5px;
    width: 295px;
    height: 0px;
    flex-shrink: 0;
    stroke-width: 1px;
    stroke: var(--api-sep-line);
}

.line-column {
    position: absolute;
    top: 35px;
    right: 105px;
    width: 125px;
    height: 0px;
    // transform: rotate(90deg);
    flex-shrink: 0;
    stroke-width: 1px;
    stroke: var(--api-sep-line);
}
</style>
