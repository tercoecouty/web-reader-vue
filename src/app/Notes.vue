<script setup lang="ts">
import { computed } from "vue";
import { useAppStore, useNoteStore, useBookStore } from "../store";

const appStore = useAppStore();
const bookStore = useBookStore();
const noteStore = useNoteStore();
const domNotes = computed(() => {
    const domNotes = [];
    for (const note of noteStore.notes) {
        let pageNumber = 1;
        for (let i = 0; i < bookStore.pages.length; i++) {
            const page = bookStore.pages[i];
            const firstCharId = page.lines[0].firstCharId;
            const lastLine = page.lines[page.lines.length - 1];
            const lastCharId = lastLine.firstCharId + lastLine.text.length;
            if (note.firstCharId > firstCharId && note.firstCharId < lastCharId) {
                pageNumber = i + 1;
                break;
            }
        }

        domNotes.push({
            note,
            pageNumber,
        });
    }

    return domNotes;
});
function handleClick(noteId: number, pageNumber: number) {
    bookStore.setPageNumber(pageNumber);
    bookStore.currentNoteId = noteId;
    appStore.showNotes = false;
}
</script>

<template>
    <div class="notes">
        <div v-if="domNotes.length === 0" class="empty-list">没有笔记</div>
        <div
            v-else
            v-for="{ note, pageNumber } in domNotes"
            class="notes-item"
            :key="note.id"
            @click="handleClick(note.id, pageNumber)"
        >
            <div class="notes-item-text">{{ note.text }}</div>
            <div class="notes-item-page">{{ pageNumber }}</div>
        </div>
    </div>
</template>

<style lang="less">
.notes-item {
    font-size: 14px;
    display: flex;
    padding: 16px;
    cursor: pointer;

    &:hover {
        background-color: var(--hover-bg-color);
    }

    > .notes-item-text {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    > .notes-item-page {
        width: 20%;
        text-align: center;
    }
}
</style>
