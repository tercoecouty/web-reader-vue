<script setup lang="ts">
import { onMounted, onUpdated } from "vue";
import { $ref } from "vue/macros";
interface IIconProps {
    svg: string;
    disabled?: boolean;
}
interface IIconEmits {
    (e: "click"): void;
}

const emit = defineEmits<IIconEmits>();
const { svg, disabled } = defineProps<IIconProps>();
let spanRef = $ref(null);

onMounted(() => {
    spanRef.innerHTML = svg;
});
onUpdated(() => {
    spanRef.innerHTML = svg;
});

function handleClick() {
    if (!disabled) emit("click");
}
</script>

<template>
    <span @click="handleClick" class="icon" :class="{ disabled }" ref="spanRef"></span>
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
