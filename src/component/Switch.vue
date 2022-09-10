<script setup lang="ts">
import { computed } from "vue";

interface ISwitchProps {
    checked?: boolean;
    onChange?: () => void;
}

const props = defineProps<ISwitchProps>();
const checked = computed(() => (props.checked ? true : false));

function handleChange() {
    if (props.onChange) props.onChange();
}
</script>

<template>
    <div class="switch" :class="{ checked }" @click="handleChange">
        <span class="slider"></span>
    </div>
</template>

<style lang="less">
.switch {
    --width: 40px;
    --height: 20px;
    --gap: 4px;
    --slider-size: calc(var(--height) - var(--gap) * 2);
    --translate-x: calc(var(--width) - var(--slider-size) - var(--gap) * 2);
}

.switch {
    position: relative;
    display: inline-block;
    width: var(--width);
    height: var(--height);

    > .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.2s;
        border-radius: var(--height);

        &:before {
            position: absolute;
            content: "";
            height: var(--slider-size);
            width: var(--slider-size);
            left: var(--gap);
            bottom: var(--gap);
            background-color: white;
            transition: 0.2s;
            border-radius: 50%;
        }
    }
}

.switch.checked {
    > .slider {
        background-color: #2196f3;

        &::before {
            transform: translateX(var(--translate-x));
        }
    }
}
</style>
