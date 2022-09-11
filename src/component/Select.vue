<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "./index";
import { DownSvg } from "../svg";

interface ISelectProps {
    options: number[];
    value: number;
}
interface ISelectEmits {
    (e: "update:value", value: number): void;
}

const emit = defineEmits<ISelectEmits>();
const props = defineProps<ISelectProps>();
const showOptions = ref(false);

function handleChange(value: number) {
    emit("update:value", value);
    showOptions.value = false;
}
</script>

<template>
    <div class="select">
        <div class="select-face" @click="showOptions = !showOptions">
            <span class="select-value">{{ value }}</span>
            <Icon :svg="DownSvg" />
        </div>
        <div v-if="showOptions" class="select-options">
            <div v-for="option in options" class="select-options-item" :key="option" @click="handleChange(option)">
                {{ option }}
            </div>
        </div>
    </div>
</template>

<style lang="less">
.select {
    position: relative;

    .select-face {
        display: flex;
        align-items: center;
        padding: 4px 8px;

        cursor: pointer;
        border: 1px solid #bfbfbf;
        border-radius: 2px;

        > .select-value {
            margin-right: 4px;
        }

        > span.icon {
            font-size: 14px;
        }
    }

    > .select-options {
        z-index: 1;
        position: absolute;
        background-color: white;
        width: 100%;
        left: 0;
        top: 110%;

        box-shadow: 0 0 5px rgba(0, 0, 0, 0.18);
        user-select: none;

        > .select-options-item {
            padding: 8px;
            cursor: pointer;

            &:hover {
                background-color: var(--hover-bg-color);
            }
        }
    }
}
</style>
