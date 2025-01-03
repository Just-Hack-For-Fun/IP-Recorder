<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const ip = ref('获取IP地址中...')
const location = ref('获取归属地中...')
// 存储定时器ID
let timer = null

const refreshIPInfo = async () => {
    try {
        // const { code, data, message } = await window.api.getCurrentIP()
        const result = await window.api.updateIPInfo()

        if (result && result.code === -1) {
            // console.log('未成功获取到IP: ', result.message)
            ip.value = '暂未获取到IP地址信息'
            location.value = '暂未获取到归属地信息'
        }

    } catch (err) {
        console.error(err)
    }
}

const handleIPUpdate = (event) => {
    ip.value = event.detail?.ip || '获取IP地址中...'
    location.value = event.detail?.location || '获取归属地中...'
}

onMounted(() => {
    refreshIPInfo()
    window.addEventListener('ip-update', handleIPUpdate)
    timer = setInterval(() => {
        refreshIPInfo()
    }, 60000) // 60000毫秒 = 1分钟
})

onBeforeUnmount(() => {
    window.removeEventListener('ip-update', handleIPUpdate)
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})

</script>

<template>
    <div class="ip-info">
        <!-- 装饰图片 -->
        <div class="ipinfo-pic">
            <img src="@image/ipinfo.png" alt="">
        </div>
        <div class="ipinfo-container">
            <div class="ip-addr">
                <p>{{ ip }}</p>
            </div>
            <div class="ip-location">
                <p>{{ location }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.ip-info {
    max-width: 256px;
    height: 66px;
    display: flex;
    align-items: flex-start;
    flex-shrink: 0;
    gap: 8px;
    // background-color: pink;
}

.ipinfo-pic img {
    width: 60px; // 根据需要调整图片大小
    height: 60px;
    object-fit: contain; // 保持图片比例
    user-select: none;
    -webkit-user-drag: none;

    @include my-hover;
}

.ip-info .ipinfo-container {
    display: flex;
    flex-direction: column; // 改为纵向排列
    align-items: flex-start;
    gap: 8px; // 设置间距
    flex: 1;
    min-width: 0;
}

.ip-info .ipinfo-container .ip-addr {
    max-width: 100%;
    height: 30px;
    display: inline-flex;
    align-items: center; // 垂直居中
    padding: 4px 11px;
    border-radius: 8px;
    background-color: var(--ip-addr-fill);
    white-space: nowrap;
    user-select: contain;

    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.03);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
}

.ip-info .ipinfo-container .ip-addr p {
    color: var(--ip-addr-text);
    display: inline-flex;
    font-family: "Source Han Sans CN";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    user-select: all;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}

.ip-info .ipinfo-container .ip-location {
    max-width: 100%;
    height: 28px;
    display: flex; // 改用 flex
    align-items: center; // 垂直居中
    padding: 2px 11px;
    border-radius: 8px;
    background-color: var(--ip-location-fill);
    user-select: contain;

    &:hover {
        transform: scale(1.03);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
}

.ip-info .ipinfo-container .ip-location p {
    color: var(--ip-location-text);
    text-align: center;
    font-family: "Source Han Sans CN";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    user-select: text;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
</style>
