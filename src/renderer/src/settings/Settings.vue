<script setup>
import DragBar from '../components/settings/layout/DragBar.vue';
import Content from '../components/settings/layout/Content.vue';
import { useThemeStore } from '@stores/theme'
import { onMounted } from 'vue';

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initThemeSync()
})
</script>

<template>
    <div class="settings-panel">
        <DragBar></DragBar>
        <Content></Content>
    </div>

</template>

<style lang="scss">
html {
    // background-color: var(--bg);
}

// .settings-panel {
//     width: 100%;
//     height: 100%;
//     border-radius: 10px;
//     background-color: var(--bg);
// }
</style>
