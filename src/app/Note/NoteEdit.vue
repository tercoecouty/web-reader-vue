<script setup lang="ts">
import { onMounted } from "vue";
import { $ref, $computed } from "vue/macros";
import { Icon } from "../../component";
import { ArrowLeftSvg, SendSvg } from "../../svg";
import NoteImages from "./NoteImages.vue";

interface INoteEditProps {
    initialText?: string;
    headerText?: string;
    imagesUrls?: string[];
}
interface INoteEditEmits {
    (e: "close"): void;
    (e: "submit", text: string, files: File[]): void;
}

const emit = defineEmits<INoteEditEmits>();
const props = defineProps<INoteEditProps>();
const { initialText, imagesUrls } = props;
let headerText = $computed(() => props.headerText || "返回");
let show = $ref(false);
let text = $ref(initialText || "");
let fileMap = $ref<Map<string, File>>(new Map(imagesUrls.map((url) => [url, null])));
let hasChange = $ref(false);

onMounted(() => {
    requestAnimationFrame(() => {
        show = true;
    });
});

function handleTransEnd() {
    if (show) {
        const dom = document.getElementById("note-edit-textarea") as HTMLInputElement;
        dom.focus();
        dom.setSelectionRange(text.length, text.length);
    } else {
        emit("close");
    }
}
function handleChange(e) {
    if (e.target.value.length > 200) return;
    text = e.target.value;
    hasChange = true;

    // 文本框随着输入文字的改变自动伸长或缩短
    // 参考 https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
    const dom = document.getElementById("note-edit-textarea");
    dom.style.height = "auto";
    dom.style.height = dom.scrollHeight + "px";
}
function handleUpload(files: File[]) {
    if (fileMap.size + files.length > 9) {
        alert("图片数量不能超过九张");
        return;
    }

    for (const file of files) {
        const url = URL.createObjectURL(file);
        fileMap.set(url, file);
    }

    fileMap = new Map(fileMap);
    hasChange = true;
}
function deleteImage(url: string) {
    fileMap.delete(url);
    (document.getElementById("image-file-input") as any).value = "";
    fileMap = new Map(fileMap);
    hasChange = true;
}
async function submit() {
    if (!hasChange) return;
    const files: File[] = [];
    for (const url of fileMap.keys()) {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], "");
        URL.revokeObjectURL(url);
        files.push(file);
    }
    emit("submit", text, files);
    show = false;
}
</script>

<template>
    <div class="note-edit" :class="{ show }" @transitionend="handleTransEnd">
        <div class="note-edit-header">
            <Icon :svg="ArrowLeftSvg" @click="show = false" />
            <span class="header-text">{{ headerText }}</span>
        </div>
        <div class="scroll-container">
            <textarea id="note-edit-textarea" :value="text" @input="handleChange" placeholder="在这里输入……"></textarea>
            <NoteImages
                :urls="[...fileMap.keys()]"
                @delete="deleteImage"
                @upload="handleUpload"
                showUpload
                showDelete
            />
        </div>
        <div class="note-edit-submit">
            <span class="letter-count">{{ text.length }} / 200</span>
            <Icon :svg="SendSvg" @click="submit" :disabled="!hasChange" />
        </div>
    </div>
</template>

<style lang="less">
.note-edit {
    position: absolute;
    top: 0;
    transition: transform 0.2s;
    transform: translate(0, 100vh);
    background-color: #f5f5f5;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    &.show {
        transform: translate(0, 0);
    }

    > .scroll-container {
        overflow-y: auto;
        height: 100%;

        > textarea {
            width: 100%;
            min-height: 150px;
            border: none;
            outline: none;
            padding: 16px;
            font-size: 16px;
            font-family: Arial;
            resize: none;
            overflow: hidden;
            background-color: #f5f5f5;
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
}

.note-edit-header {
    border-bottom: 1px solid #d9d9d9;
    padding: 8px 16px;
    display: flex;
    align-items: center;

    > span.icon {
        font-size: 24px;
        cursor: pointer;
        margin-right: 8px;
    }
}

.note-edit-submit {
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: right;
    background-color: #ffffff;

    display: flex;
    justify-content: space-between;
    align-items: center;

    > span.icon {
        cursor: pointer;
        font-size: 24px;

        &.disabled {
            cursor: auto;
            color: var(--disabled-color);
        }
    }

    > span.letter-count {
        font-size: 14px;
    }
}
</style>
