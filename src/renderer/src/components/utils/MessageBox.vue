<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 4000
    }
})

const visible = ref(false)

onMounted(() => {
    visible.value = true
    setTimeout(() => {
        visible.value = false
    }, props.duration)
})
</script>

<template>
    <Transition name="slide-message">
        <div v-if="visible" class="message">
            <p>{{ content }}</p>
        </div>
    </Transition>

</template>

<style lang="scss" scoped>
.message {
    position: fixed;
    top: 20px;
    left: 60%;
    transform: translateX(-50%);
    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
    background: rgba(244, 244, 245, 0.8);
    z-index: 9999;

    p {
        color: rgba(54, 120, 65, 0.90);
        font-family: "Source Han Sans CN";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
    }
}

.slide-message-enter-active,
.slide-message-leave-active {
    transition: all 0.3s ease;
}

.slide-message-enter-from {
    transform: translate(-50%, -100%);
    opacity: 0;
}

.slide-message-enter-to {
    transform: translate(-50%, 0);
    opacity: 1;
}

.slide-message-leave-from {
    transform: translate(-50%, 0);
    opacity: 1;
}

.slide-message-leave-to {
    transform: translate(-50%, -100%);
    opacity: 0;
}
</style>
