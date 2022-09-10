<script setup lang="ts">
import { ref, onMounted, onUpdated } from "vue";
interface IIconProps {
    svg: string;
    onClick?: () => void;
    disabled?: boolean;
}
const props = defineProps<IIconProps>();
const spanRef = ref(null);

onMounted(() => {
    spanRef.value.innerHTML = props.svg;
});
onUpdated(() => {
    spanRef.value.innerHTML = props.svg;
});

function handleClick() {
    if (!props.disabled && props.onClick) props.onClick();
}
</script>

<template>
    <span @click="handleClick" class="icon" :class="{ disabled: props.disabled }" ref="spanRef"></span>
</template>

<style lang="less">
.icon {
    > svg {
        height: 1em;
        width: 1em;
        fill: currentColor;
    }
}
</style>
