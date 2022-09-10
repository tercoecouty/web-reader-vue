<script setup lang="ts">
import { computed } from "vue";

import Line from "./Line.vue";
import Bookmark from "./Bookmark.vue";

import { useBookStore } from "../../store";

interface IPageProps {
    isSecondPage?: boolean;
}

const props = defineProps<IPageProps>();
const bookStore = useBookStore();
const _pageNumber = computed(() => (props.isSecondPage ? bookStore.pageNumber + 1 : bookStore.pageNumber));
const lines = computed(() => bookStore.pages[_pageNumber.value - 1]?.lines);

const hideBookmark = computed(() => bookStore.pageLoading || _pageNumber.value > bookStore.pages.length);
const styleObject = computed(() => {
    const style: any = {
        fontSize: bookStore.fontSize,
        fontFamily: bookStore.fontFamily,
    };

    if (bookStore.pages[0]) {
        style["--line-padding"] = `${bookStore.pages[0].lineSpacing + bookStore.pages[0].spacing / 2}px 0px`;
    }

    return style;
});

function handleClick(e) {
    const noteId = parseInt(e.target.dataset.noteId);
    if (!noteId) {
        bookStore.currentNoteId = null;
        return;
    }

    bookStore.currentNoteId = noteId;
}
</script>

<template>
    <div class="page">
        <div class="page-head">
            <Bookmark v-if="!hideBookmark" :pageNumber="_pageNumber" />
        </div>
        <div class="page-body" :style="{ padding: bookStore.pagePadding }">
            <div class="page-content" id="page-content" :style="styleObject" @click="handleClick">
                <span v-if="!props.isSecondPage" id="char-measurement" class="char-measurement"></span>

                <div v-if="bookStore.pageLoading" class="page-loading">
                    <span>加载中......</span>
                </div>
                <template v-else-if="_pageNumber > bookStore.pages.length"></template>
                <template v-else>
                    <Line v-for="(line, index) in lines" :key="index" :line="line" />
                </template>
            </div>
        </div>
        <div class="page-foot">
            <span v-if="!hideBookmark">{{ _pageNumber }} / {{ bookStore.pages.length }}</span>
        </div>
    </div>
</template>

<style lang="less">
.page {
    width: 50%;

    &:first-child {
        border-right: 1px solid black;
    }

    &:only-child {
        border-left: 1px solid black;
    }

    &:nth-child(2) {
        border-left: 1px solid black;
    }
}

.page-head {
    height: 36px;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: flex-end;
    user-select: none;
}

.page-body {
    height: calc(100vh - 36px * 2);
}

.page-content {
    height: 100%;
    line-height: 1;
    white-space: pre;

    > .char-measurement {
        position: absolute;
        visibility: hidden;
        white-space: pre-wrap;
    }
}

.page-loading {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.page-foot {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    font-size: 14px;
    border-top: 1px solid black;
}
</style>
