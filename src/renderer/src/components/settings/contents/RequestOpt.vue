<script setup>
import { onMounted, ref } from 'vue';
import SaveBtn from '../utils/SaveBtn.vue';
import { useMessage } from '../../../utils/useMessage';

const messageBox = useMessage()

const times = ref(5)
const interval = ref(500)

const saveReqOpt = async () => {
    // console.log('保存请求配置')
    const { code, message } = await window.api.saveReqOptions({
        'times': times.value,
        'interval':interval.value
    })
    if (code === 0) {
        messageBox.info('设置成功')
        return window.api.updateIPInfo()
    }

    if (code === -1) messageBox.info(`设置失败: ${message}`)

}

onMounted(async () => {
    const { code, data } = await window.api.getReqOptions()
    if (code === 0) {
        times.value = data.retryCounts
        interval.value = data.interval
    }
})

</script>

<template>
    <div class="request-card">
        <div class="request-container">
            <div class="options">
                <p>若请求失败，重复尝试</p>
                <div><input class="times" type="text" v-model.number="times"></div>
                <p>次</p>
            </div>

            <div class="options">
                <p>记录状态下的时间间隔</p>
                <div><input class="interval" type="text" v-model.number="interval"></div>
                <p>毫秒</p>
            </div>
            <div class="save-opts">
                <SaveBtn @click="saveReqOpt"></SaveBtn>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.request-card {
    width: 360px;
    height: 174px;
    margin: 24px 55px 22px 45px;

    border-radius: 10px;
    border: 1px solid var(--request-border);
    background: var(--request-card-bg);
    box-shadow: -1px 1px 4px 0px rgba(0, 0, 0, 0.25);

    padding: 46px 32px 72px 32px;
    user-select: none;


    .request-container {
        display: flex;
        flex-direction: column;
        gap: 11px;

        .options {
            display: flex;
            gap: 4px;

            p {
                color: var(--set-content-text);
                font-family: "Source Han Sans CN";
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 137.5% */
            }

            div {
                display: flex;
                justify-content: center;
                align-items: center;

                border-radius: 6px;
                background: var(--set-menu-select);

                .times {
                    width: 40px;
                    height: 22px;
                    line-height: 22px;
                    border-radius: 6px;
                    text-align: center;
                    background: var(--set-menu-select);

                    color: var(--set-content-text);
                    font-family: "Source Han Sans CN";
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                    /* 137.5% */

                }

                .interval {
                    width: 50px;
                    height: 22px;
                    margin-left: 12px;
                    margin-right: 12px;
                    line-height: 22px;
                    border-radius: 6px;
                    text-align: center;
                    background: var(--set-menu-select);

                    color: var(--set-content-text);
                    font-family: "Source Han Sans CN";
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;

                }
            }

        }

        .save-opts {
            display: flex;
            justify-content: center;
            // margin-right: 43px;
            margin-top: 13px;
        }
    }





}
</style>
