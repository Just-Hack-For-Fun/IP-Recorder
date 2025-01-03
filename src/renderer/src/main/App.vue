<script setup>
import IPInfo from '@mainLayout/IPInfo.vue';
import ActionBtn from '@mainLayout/ActionBtn.vue';
import ToolBar from '@mainLayout/ToolBar.vue';
import Header from '@mainLayout/Header.vue';
import { useThemeStore } from '@stores/theme'
import { onMounted } from 'vue';

const themeStore = useThemeStore()

onMounted(() => {
    themeStore.initThemeSync()
})

</script>

<template>
    <div class="container">
        <div class="main-panel">
            <Header class="header"></Header>
            <IPInfo class="ipinfo"></IPInfo>
            <ActionBtn class="action"></ActionBtn>
        </div>
        <div class="side-bar">
            <ToolBar></ToolBar>
        </div>
    </div>

</template>

<style lang="scss" scoped>
html {
    background-color: var(--bg);
}

.container {
    display: flex;

    .main-panel {
        flex: 1;
        // padding-right: 24px;
        display: flex;
        border-radius: 10px 0px 0px 10px;
        background-color: var(--bg);
        border: 1px solid var(--proxy-border);
        // box-shadow: -1px 1px 2px 0px rgba(0, 0, 0, 0.15);

        .ipinfo {
            margin: 25px auto 25px 20px;
            // background-color: pink;
        }

        .action {
            margin: 26px 22px 24px auto;
            // background-color: red;
        }
    }

    .side-bar {
        width: 24px;
    }
}
</style>
