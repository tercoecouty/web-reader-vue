<script setup lang="ts">
import { computed } from "vue";
import { useAppStore, useBookmarkStore } from "../../store";

import { Icon } from "../../component";
import { BookmarkSvg, BookmarkFilledSvg } from "../../svg";

interface IPageHeadProps {
    pageNumber: number;
}

const props = defineProps<IPageHeadProps>();
const appStore = useAppStore();
const bookmarkStore = useBookmarkStore();

const hide = computed(() => appStore.loginUser?.id !== appStore.noteUser?.id);
const hasBookmark = computed(() => bookmarkStore.bookmarks.includes(props.pageNumber));
</script>

<template>
    <template v-if="hide"></template>
    <div v-else-if="hasBookmark" class="bookmark" @click="bookmarkStore.deleteBookmark(props.pageNumber)">
        <Icon :svg="BookmarkFilledSvg" />
    </div>
    <div v-else class="bookmark" @click="bookmarkStore.addBookmark(props.pageNumber)">
        <Icon :svg="BookmarkSvg" />
    </div>
</template>

<style lang="less">
.bookmark {
    display: inline-block;
    margin-right: 24px;
    margin-top: -2px;
    font-size: 28px;
    color: var(--primary-color);
    cursor: pointer;
}
</style>
