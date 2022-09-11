<script setup lang="ts">
import { watch } from "vue";
import { $ref, $$ } from "vue/macros";
import { useAppStore } from "../store";

interface IDrawerProps {
    visible: Boolean;
    title?: string;
    position: "right" | "left";
}
interface IDrawerEmits {
    (e: "close"): void;
    (e: "update:visible", value: boolean): void;
}

const appStore = useAppStore();
const emit = defineEmits<IDrawerEmits>();
let { visible } = defineProps<IDrawerProps>();
let show = $ref(false);
let _visible = $ref(false);

watch($$(visible), () => {
    if (visible) {
        _visible = true;
        appStore.disableShortcut = true;
        requestAnimationFrame(() => (show = true));
    } else {
        show = false;
    }
});

function handleTransEnd(e) {
    if (!show && e.propertyName === "transform") {
        emit("close");
        emit("update:visible", false);
        _visible = false;
        appStore.disableShortcut = false;
    }
}
</script>

<template>
    <div class="drawer" :class="{ show, visible: _visible }" @transitionend="handleTransEnd">
        <div class="drawer-background" @click="() => (show = false)"></div>
        <div class="drawer-container" :class="{ left: position === 'left', right: position === 'right' }">
            <div v-if="title" class="drawer-header">
                <div>{{ title }}</div>
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
