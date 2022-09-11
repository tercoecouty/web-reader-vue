<script setup lang="ts">
import { watch } from "vue";
import { $toRef, $$ } from "vue/macros";
import { useAppStore, useBookshelfStore } from "../store";

const appStore = useAppStore();
const bookshelfStore = useBookshelfStore();
const bookId = $toRef(appStore, "bookId");

function handleClick(bookId: number) {
    appStore.bookId = bookId;
    appStore.showBookshelf = false;
}
watch($$(bookId), () => {
    for (const book of bookshelfStore.bookshelf) {
        if (book.id === bookId) {
            document.title = book.title;
            return;
        }
    }
});
</script>

<template>
    <div class="bookshelf">
        <div v-for="book in bookshelfStore.bookshelf" className="bookshelf-item">
            <span>{{ book.title }}</span>
            <span v-if="book.id === bookId">正在阅读</span>
            <span v-else class="bookshelf-button" @click="handleClick(book.id)"> 点击阅读 </span>
        </div>
    </div>
    ;
</template>

<style lang="less">
.bookshelf-item {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #d9d9d9;

    > .bookshelf-button {
        color: var(--primary-color);
        cursor: pointer;
    }
}
</style>
