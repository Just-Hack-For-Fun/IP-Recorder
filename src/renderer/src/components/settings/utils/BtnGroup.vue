<script setup>
import TestBtn from './TestBtn.vue';
import SaveBtn from './SaveBtn.vue';

const emit = defineEmits(['test', 'save'])

const handleTest = () => {
  emit('test')
}

const handleSave = () => {
  emit('save')
}

</script>


<template>
    <div class="btn-group">
        <TestBtn @click="handleTest"></TestBtn>
        <SaveBtn @click="handleSave"></SaveBtn>
    </div>
</template>

<style lang="scss">
.btn-group {
    display: flex;
    height: 30px;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
}
</style>
