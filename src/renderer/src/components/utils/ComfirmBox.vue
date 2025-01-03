<script setup>
import closeIcon from '@image/close.png'

defineProps({
    visible: Boolean,       // 是否可见
    title: String,          // 标题/描述
    confirmText: String,    // 确认
    confirmShow: Boolean,  // 是否显示确认按钮
    cancelText: String,     // 取消
    cancelShow: Boolean     // 是否显示取消按钮
})

defineEmits(['close', 'confirm', 'cancel'])
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-body">
                <p>{{ title }}</p>
                <img :src="closeIcon" @click="$emit('close')">
            </div>
            <div class="modal-footer">
                <div class="new" @click="$emit('confirm')" v-if="confirmShow">
                    <p>{{ confirmText }}</p>
                </div>
                <div class="continue" @click="$emit('cancel')" v-if="cancelShow">
                    <p>{{ cancelText }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 13px 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    background: var(--confirm-box-bg);
    // background: rgba(255, 255, 255, 0.60);
    box-shadow: 0px 4px 4px 0px var(--confirm-box-shadow);

    .modal-content {
        width: 350px;
        height: 90px;
        flex-shrink: 0;
        border-radius: 8px;
        border: 1px solid #2C2C2C;
        background: var(--confirm-content-bg);
        /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15); */
        display: flex;
        flex-direction: column;

        .modal-body {
            /* background-color: pink; */
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 12px;

            p {
                color: var(--set-side-text);
                font-family: "Source Han Sans CN";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */
            }

            img {
                width: 20px;
                height: 20px;
                flex-shrink: 0;

                &:hover {
                    @include my-hover;
                }
            }
        }
    }

    .modal-footer {
        height: 24px;
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 12px;

        .new {
            display: flex;
            padding: 2px 8px;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-radius: 4px;
            border: 1px solid rgba(128, 121, 121, 0.50);
            background: #FEFEFE;

            &:hover {
                @include my-hover;
            }

            p {
                color: #000;
                font-family: "Source Han Sans CN";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */
            }
        }

        .continue {
            display: flex;
            padding: 2px 8px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
            background: #FBE090;
            border-radius: 4px;

            &:hover {
                @include my-hover;
            }

            p {
                color: #000;
                font-family: "Source Han Sans CN";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */
            }
        }
    }
}
</style>
