<script setup lang="ts">
import { ref, onMounted } from "vue";

interface IPromptProps {
    userName: string;
}
interface IPromptEmits {
    (e: "close"): void;
}

const emit = defineEmits<IPromptEmits>();
const props = defineProps<IPromptProps>();
const show = ref(false);

onMounted(() => {
    requestAnimationFrame(() => (show.value = true));
});

function handleTransEnd() {
    if (!show.value) emit("close");
}
</script>

<template>
    <div class="view-others-prompt" :class="{ show }" @transitionend="handleTransEnd">
        <span>
            正在查看 <span>{{ userName }}</span> 的笔记，点击 <button @click="show = false">退出</button>
        </span>
    </div>
</template>

<style lang="less">
.view-others-prompt {
    display: inline-block;
    position: fixed;
    top: 0;
    left: 50%;
    padding: 6px 0;
    transform: translate(-50%, -100%);

    transition: transform 0.2s;

    &.show {
        transform: translate(-50%, 0);
    }

    > span {
        display: inline-block;
        font-size: 12px;
        padding: 4px 8px;
        background-color: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.18);

        > button {
            font-size: 12px;
            padding: 0;
            background: none;
            border: none;
            color: var(--primary-light-color);
            cursor: pointer;
        }
    }
}
</style>
