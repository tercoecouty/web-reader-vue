<script setup lang="ts">
import { onMounted } from "vue";
import { $ref } from "vue/macros";
import { Icon } from "../../component";
import { ArrowLeftSvg, ArrowRightSvg } from "../../svg";

interface IImagePreviewProps {
    urls: string[];
    currentUrl: string;
}
interface IImagePreviewEmits {
    (e: "close"): void;
}

const emit = defineEmits<IImagePreviewEmits>();
const { urls, currentUrl } = defineProps<IImagePreviewProps>();
let show = $ref(false);
let index = $ref(0);

onMounted(() => {
    const _index = urls.indexOf(currentUrl);
    if (_index !== -1) index = _index;
    requestAnimationFrame(() => (show = true));
});

function handleTransEnd(e) {
    if (!show && e.propertyName === "transform") emit("close");
}

function nextImage() {
    if (index === 0) {
        index = urls.length - 1;
    } else {
        index = index - 1;
    }
}

function prevImage() {
    if (index === urls.length - 1) {
        index = 0;
    } else {
        index = index + 1;
    }
}
</script>

<template>
    <Teleport to="body">
        <div class="image-preview" :class="{ show }" @transitionend="handleTransEnd">
            <div class="image-preview-background" @click="show = false"></div>
            <img :src="urls[index]" />
            <span class="image-preview-arrow left">
                <Icon :svg="ArrowLeftSvg" @click="prevImage" />
            </span>
            <span class="image-preview-arrow right">
                <Icon :svg="ArrowRightSvg" @click="nextImage" />
            </span>
        </div>
    </Teleport>
</template>

<style lang="less">
.image-preview {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 2;

    > .image-preview-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0);
        transition: background-color 0.2s;
    }

    > img {
        position: absolute;
        left: 50%;
        top: 50%;
        max-width: 90%;
        max-height: 100vh;
        object-fit: contain;
        transition: transform 0.2s, opacity 0.2s;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }

    > .image-preview-arrow {
        position: absolute;
        top: 0;
        height: 100%;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;

        > span.icon {
            color: white;
            font-size: 36px;
            cursor: pointer;
        }

        &.left {
            left: 0;
        }

        &.right {
            right: 0;
        }
    }

    &.show {
        > .image-preview-background {
            background-color: rgba(0, 0, 0, 0.4);
        }

        > img {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        > .image-preview-arrow {
            visibility: visible;
        }
    }
}
</style>
