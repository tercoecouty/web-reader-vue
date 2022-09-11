<script setup lang="ts">
import { useAppStore, useBookStore, useBookmarkStore } from "../store";

const appStore = useAppStore();
const bookStore = useBookStore();
const bookmarkStore = useBookmarkStore();

function handleClick(pageNumber: number) {
    bookStore.setPageNumber(pageNumber);
    appStore.showBookmarks = false;
}
</script>

<template>
    <div class="bookmarks">
        <div v-if="bookmarkStore.bookmarks.length === 0" className="empty-list">没有书签</div>
        <div
            v-else
            v-for="pageNumber in [...bookmarkStore.bookmarks].sort()"
            :key="pageNumber"
            class="bookmarks-item"
            @click="handleClick(pageNumber)"
        >
            第 {{ pageNumber }} 页
        </div>
    </div>
</template>

<style lang="less">
.bookmarks-item {
    padding: 16px;
    cursor: pointer;

    &:hover {
        background-color: var(--hover-bg-color);
    }
}
</style>
