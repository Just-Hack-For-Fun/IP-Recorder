<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';

import BtnGroup from '../utils/BtnGroup.vue';
import radioIcon from '@image/radio.png'
import radioSelectedIcon from '@image/radio-selected.png'
import downIcon from '@image/down.png'
import upIcon from '@image/up.png'

import { useMessage } from '../../../utils/useMessage';
const messageBox = useMessage()


// 代理类型索引

const proxyType = ref(0)
const proxyProtocol = ref(0)
const proxyHost = ref('')
const proxyPort = ref('')
const proxyUsername = ref('')
const proxyPassword = ref('')

// 菜单
const proxyMenu = [
    { name: "无代理", icon: radioIcon, selectIcon: radioSelectedIcon, top: '52px', bottom: '36px', height: '174px' },
    { name: "系统代理", icon: radioIcon, selectIcon: radioSelectedIcon, top: '52px', bottom: '36px', height: '174px' },
    { name: "自定义代理", icon: radioIcon, selectIcon: radioSelectedIcon, top: '10px', bottom: '10px', height: '182px' }
]

const PROXY_PROTOCOLS = {
    0: "SOCKS5",
    1: "HTTP",
    2: "HTTPS"
}

const protocols = [
    { name: "SOCKS5", value: "SOCKS5" },
    { name: "HTTP", value: "HTTP" },
    { name: "HTTPS", value: "HTTPS" }
]

const protocolText = computed(() => {
    if ([0, 1, 2].includes(proxyProtocol.value)) return PROXY_PROTOCOLS[proxyProtocol.value]
    return ''
})

const protocolClick = (index) => {
    proxyProtocol.value = index
    isOpen.value = false
}

// 下拉菜单是否打开
const isOpen = ref(false)

// 测试代理函数
const processProxy = () => {
    // 根据不同的代理类型构建不同的配置对象
    let testConfig = null

    switch (proxyType.value) {
        case 0:  // 无代理
            testConfig = {
                type: 0,
                data: null
            }
            break

        case 1:  // 系统代理
            testConfig = {
                type: 1,
                data: null
            }
            break

        case 2:  // 自定义代理
            let auth = {
                username: proxyUsername.value || '',
                password: proxyPassword.value || '',
            }
            if (!proxyUsername.value && !proxyPassword.value) auth = null

            testConfig = {
                type: 2,
                data: {
                    host: proxyHost.value,
                    port: proxyPort.value,
                    'auth': auth,
                    protocol: proxyProtocol.value
                }
            }
            break
    }

    // console.log('Testing proxy with config:', testConfig)
    return testConfig
    // 这里可以调用 ipcRenderer.invoke 发送到主进程
    // ipcRenderer.invoke('test-proxy', testConfig)
}


const testProxy = async () => {
    let proxy = processProxy()
    // console.log(proxy)
    const { code, data, message } = await window.api.testProxy(proxy)

    // console.log(data)

    if (code === 0) messageBox.info(`代理可用: ${data.ip}`)
    if (code === -1) messageBox.info(`${message}`, 1000)

}

const saveProxy = async () => {
    let proxy = processProxy()
    const { code, message } = await window.api.saveProxy(proxy)

    if (code === 0) {
        messageBox.info('设置成功')
        return window.api.updateIPInfo()
    }

    if (code === -1) messageBox.info(`设置失败: ${message}`)
}

// 点击自定义代理后，页面相关组件的位置相关值
const dynPaddingTop = computed(() => proxyMenu[proxyType.value].top)
const dynPaddingBottom = computed(() => proxyMenu[proxyType.value].bottom)
const pageHeight = computed(() => proxyMenu[proxyType.value].height)


// 页面加载前同步配置
onMounted(async () => {
    const { code, data, message } = await window.api.getProxy()
    if (code === -1) return messageBox.info(message)

    // 提取代理数据的函数
    const extractProxyData = (responseData) => {
        const defaultValues = {
            type: 0,
            host: '',
            port: '',
            protocol: 0,
            username: '',
            password: ''
        }

        return {
            type: responseData?.type ?? defaultValues.type,
            host: responseData?.data?.host ?? defaultValues.host,
            port: responseData?.data?.port ?? defaultValues.port,
            protocol: responseData?.data?.protocol ?? defaultValues.protocol,
            username: responseData?.data?.auth?.username ?? defaultValues.username,
            password: responseData?.data?.auth?.password ?? defaultValues.password
        }
    }

    // 提取数据
    const {
        type,
        host,
        port,
        protocol,
        username,
        password
    } = extractProxyData(data)

    // 赋值
    proxyType.value = type
    proxyHost.value = host
    proxyPort.value = port
    proxyUsername.value = username
    proxyPassword.value = password
    proxyProtocol.value = protocol

})

</script>

<template>
    <div class="proxy-container">
        <div class="proxy-opt">
            <li v-for="(proxy, index) in proxyMenu">
                <img :src="proxyType === index ? proxy.selectIcon : proxy.icon" @click="proxyType = index">
                <p @click="proxyType = index">{{ proxy.name }}</p>
            </li>
        </div>
        <div class="custom-proxy" v-if="proxyType === 2">
            <div class="select-container">
                <div class="select" @click="isOpen = !isOpen">
                    <p>{{ protocolText }}</p>
                    <img :src="isOpen ? upIcon : downIcon" alt="">
                </div>

                <Transition name="proxy">
                    <div class="select-shadow" v-if="isOpen">
                        <li v-for="(type, index) in protocols" @click="protocolClick(index)">
                            <p>{{ type.name }}</p>
                        </li>
                    </div>
                </Transition>
            </div>
            <div class="proxy-input">
                <div class="addr"><input v-model="proxyHost" type="text" placeholder="地址"></div>
                <div class="port"><input v-model="proxyPort" type="text" placeholder="端口"></div>
            </div>
            <div class="proxy-input">
                <input class="username" v-model="proxyUsername" type="text" placeholder="账号">
                <input class="password" v-model="proxyPassword" type="password" placeholder="密码">
            </div>
        </div>
        <div class="btn-group">
            <BtnGroup @test="testProxy" @save="saveProxy"></BtnGroup>
        </div>


    </div>


</template>

<style lang="scss">
.proxy-container {
    padding-top: v-bind(dynPaddingTop);
    display: flex;
    width: 360px;
    height: v-bind(pageHeight);
    margin: 24px 55px 14px 45px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    // gap: 34px;

    border-radius: 10px;
    border: 1px solid var(--proxy-border);
    background: var(--proxy-bg);
    box-shadow: -1px 1px 4px 0px rgba(0, 0, 0, 0.25);
    // background-color: pink;

    user-select: none;
    // background-color: pink;


    .proxy-opt {
        display: flex;
        width: 313px;
        height: 22px;
        justify-content: center;
        align-items: center;
        gap: 20px;
        // background-color: pink;

        li {
            display: flex;
            // width: 70px;
            height: 22px;
            align-items: center;
            gap: 6px;
            // background-color: pink;

            img {
                width: 16px;
                height: 16px;
                @include my-hover;
                // border: 1px solid;
            }

            p {
                color: var(--set-content-text);
                font-family: "Source Han Sans CN";
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 137.5% */
            }
        }
    }

    .btn-group {
        padding-bottom: v-bind(dynPaddingBottom);
    }

    .custom-proxy {
        width: 260px;
        flex: 1;
        // background-color: pink;

        .select-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 10px;

            .select {
                width: 260px;
                height: 24px;

                @include proxy-input;

                // background-color: pink;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 4px 4px 0px;
                // background-color: var(--proxy-input-bg);

                p {
                    margin-left: 8px;
                    color: var(--set-content-text);
                    font-family: "Source Han Sans CN";
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                    /* 183.333% */
                }

                img {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
            }

            .select-shadow {
                width: 256px;
                display: fixed;
                position: absolute;
                top: 92px;
                left: 237px;
                background-color: var(--proxy-select-bg);
                // background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 10%);
                box-shadow: 1px 0px 4px 0px rgba(0, 0, 0, 0.25), -1px 0px 4px 0px rgba(0, 0, 0, 0.25);
            }

            li {
                height: 20px;
                margin-top: 2px;


                &:last-child {
                    margin-bottom: 2px;
                }

                &:hover {
                    // background-color: #F3F3F5;
                    background-color: var(--proxy-select-hover);
                }

                p {
                    margin-left: 6px;
                    margin-right: 6px;
                    color: var(--set-content-text);
                    font-family: "Source Han Sans CN";
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                    /* 183.333% */
                }
            }
        }

        .proxy-input {
            // height: 24px;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;

            .addr {
                width: 185px;
                height: 24px;
                @include indent-6px;
                @include proxy-input;

                input {
                    background-color: rgba(0, 0, 0, 0);
                    color: var(--set-content-text);
                }
            }

            .port {
                width: 60px;
                height: 24px;
                @include indent-6px;
                @include proxy-input;
                // background-color: red;

                input {
                    width: 50px;
                    background-color: rgba(0, 0, 0, 0);
                    color: var(--set-content-text);
                    // @include proxy-input
                }
            }


            .username {
                width: 120px;
                height: 22px;
                @include indent-6px;
                @include proxy-input;
            }

            .password {
                width: 120px;
                height: 22px;
                @include indent-6px;
                @include proxy-input;
            }
        }
    }

    // 动画样式保持不变
    .proxy-enter-active,
    .proxy-leave-active {
        transition: all 0.3s ease;
    }

    .proxy-enter-from {
        opacity: 0;
        transform: translateY(-24px);
    }

    .proxy-leave-to {
        opacity: 0;
        transform: translateY(-24px);
    }

    .proxy-enter-to {
        opacity: 0.8;
        transform: translateY(0px);
    }

    .proxy-leave-from {
        opacity: 0;
        transform: translateY(0px);
    }
}
</style>
