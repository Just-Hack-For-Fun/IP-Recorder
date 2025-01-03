<script setup>
</script>

<template>
    <div class="save-btn"><p>保存</p></div>
</template>

<style lang="scss">
.save-btn {
    display: flex;
    width: 70px;
    height: 30px;
    padding: 4px 18px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 15px;
    background-color: var(--set-save-btn);
    @include my-hover;

    p {
        color: var(--set-btn-text);
        font-family: "Source Han Sans CN";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 137.5% */
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }
}
</style>
