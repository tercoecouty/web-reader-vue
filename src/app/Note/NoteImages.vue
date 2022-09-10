<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "../../component";
import { DeleteSvg, EyeSvg } from "../../svg";

import ImagePreview from "./ImagePreview.vue";

interface INoteImagesProps {
    urls: string[];
    onUpload?: (files: File[]) => void;
    onDelete?: (url: string) => void;
}
const props = defineProps<INoteImagesProps>();
const previewUrl = ref("");
const showPreview = ref(false);

function handleFileChange(e) {
    const files = e.target.files as File[];
    props.onUpload(files);
}

function handleShowPreview(url: string) {
    previewUrl.value = url;
    showPreview.value = true;
}

function clickUpload() {
    document.getElementById("image-file-input").click();
}
</script>

<template>
    <div class="note-edit-images">
        <input
            v-if="props.onUpload"
            class="image-file-input"
            id="image-file-input"
            type="file"
            accept=".jpg,.png"
            @input="handleFileChange"
            multiple
        />
        <div v-for="url in props.urls" class="image-item" :key="url">
            <img :src="url" />
            <div class="image-item-hover">
                <Icon v-if="props.onDelete" :svg="DeleteSvg" :onClick="() => props.onDelete(url)" />
                <Icon :svg="EyeSvg" :onClick="() => handleShowPreview(url)" />
            </div>
        </div>
        <div v-if="props.onUpload && props.urls.length < 9" class="image-upload" @click="clickUpload">
            <span>
                <span></span>
                <span></span>
            </span>
        </div>
        <ImagePreview
            v-if="showPreview"
            :urls="props.urls"
            :currentUrl="previewUrl"
            :onClose="() => (showPreview = false)"
        />
    </div>
</template>

<style lang="less">
.note-edit-images {
    --image-size: 8vw;

    margin: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--image-size));
    row-gap: 16px;
    column-gap: 16px;

    > .image-file-input {
        display: none;
    }

    > .image-upload {
        width: var(--image-size);
        height: var(--image-size);
        border: 2px dashed #8c8c8c;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        > span {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 36px;

            > span {
                display: inline-block;
                background-color: #8c8c8c;
                position: absolute;
            }

            > span:first-child {
                width: 100%;
                height: 2px;
                top: 50%;
            }

            > span:last-child {
                height: 100%;
                width: 2px;
                left: 50%;
            }
        }
    }

    > .image-item {
        width: var(--image-size);
        height: var(--image-size);

        position: relative;

        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        > .image-item-hover {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            color: white;
            font-size: 24px;
            background-color: rgba(0, 0, 0, 0.3);
            opacity: 0;

            &:hover {
                opacity: 1;
            }

            > span.icon {
                cursor: pointer;
            }
        }
    }
}
</style>