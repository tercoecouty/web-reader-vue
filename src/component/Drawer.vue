<script setup lang="ts">
import { computed, ref, watch } from "vue";
interface IDrawerProps {
    visible: Boolean;
    title?: string;
    position: "right" | "left";
    onClose: () => void;
}

const props = defineProps<IDrawerProps>();
const visible = computed(() => props.visible);
const show = ref(false);
const _visible = ref(false);
watch(visible, () => {
    if (visible.value) {
        _visible.value = true;
        requestAnimationFrame(() => (show.value = true));
    } else {
        show.value = false;
    }
});

function handleTransEnd(e) {
    if (!show.value && e.propertyName === "transform") {
        props.onClose();
        _visible.value = false;
    }
}
</script>

<template>
    <div class="drawer" :class="{ show, visible: _visible }" @transitionend="handleTransEnd">
        <div class="drawer-background" @click="() => (show = false)"></div>
        <div class="drawer-container" :class="{ left: props.position === 'left', right: props.position === 'right' }">
            <div v-if="title" class="drawer-header">
                <div>{{ props.title }}</div>
            </div>
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="less">
.drawer {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    visibility: hidden;
    z-index: 1;
}

.drawer-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transition: background-color 0.2s;
    background-color: rgba(0, 0, 0, 0);
}

.drawer-container {
    position: absolute;
    width: 30vw;
    height: 100vh;
    background-color: white;
    overflow-y: auto;
    transition: transform 0.2s;

    &.left {
        left: 0;
        transform: translate(-100%, 0);
        box-shadow: 4px 0 10px rgba(0, 0, 0, 0.18);
    }

    &.right {
        right: 0;
        transform: translate(100%, 0);
        box-shadow: -4px 0 10px rgba(0, 0, 0, 0.18);
    }

    &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: #8c8c8c;
    }
}

.drawer-header {
    padding: 12px;
    border-bottom: 1px solid;
    text-align: center;
}

.drawer.show {
    > .drawer-background {
        background-color: rgba(0, 0, 0, 0.4);
    }

    > .drawer-container {
        transform: translate(0, 0);
    }
}

.drawer.visible {
    visibility: visible;
}
</style>
