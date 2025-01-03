<script setup>
// defineEmits(['click'])
</script>

<template>
    <div class="test-btn" >
        <p>测试</p>
    </div>
</template>

<style lang="scss">
.test-btn {
    display: flex;
    width: 70px;
    height: 30px;
    padding: 4px 18px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 15px;
    background-color: var(--set-test-btn);
    @include my-hover;

    p {
        color: var(--set-btn-text);
        font-family: "Source Han Sans CN";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        /* 137.5% */
    }
}
</style>
