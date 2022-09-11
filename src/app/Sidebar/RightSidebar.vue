<script setup lang="ts">
import { watch, onMounted } from "vue";
import { Icon, Drawer } from "../../component";
import { ArrowLeftSvg, ArrowRightSvg, UnderlineSvg, EditSvg, DeleteSvg, EyeSvg } from "../../svg";
import { useAppStore, useBookStore, useNoteStore } from "../../store";

import Note from "../Note/Note.vue";

const appStore = useAppStore();
const bookStore = useBookStore();
const noteStore = useNoteStore();
function handleAddNote() {
    if (!bookStore.selection || appStore.noteUser.id !== appStore.loginUser.id) return;

    const isNoteCross = noteStore.notes.some((note) => {
        if (note.lastCharId < bookStore.selection.firstCharId || note.firstCharId > bookStore.selection.lastCharId)
            return false;
        return true;
    });

    if (isNoteCross) {
        alert("当前划线的句子有重叠！");
        return;
    }

    noteStore.addNote(bookStore.selection);
    bookStore.selection = null;
}
function handleDeleteNote() {
    if (appStore.noteUser.id !== appStore.loginUser.id) return;
    if (!window.confirm("您确定要删除笔记吗？")) return;

    noteStore.deleteNote(bookStore.currentNoteId);
    bookStore.currentNoteId = null;
}
function handlePrevPage() {
    if (bookStore.pageNumber === 1) return;
    bookStore.prevPage();
}
function handleNextPage() {
    if (!bookStore.canNextPage) return;
    bookStore.nextPage();
}
function handleWheelEvent(e: WheelEvent) {
    if (appStore.disableShortcut) return;
    if (e.deltaY < 0) handlePrevPage();
    else handleNextPage();
}
function handleKeyEvent(e: KeyboardEvent) {
    if (appStore.disableShortcut) return;

    switch (e.code) {
        case "ArrowUp":
        case "ArrowLeft":
            handlePrevPage();
            break;
        case "ArrowDown":
        case "ArrowRight":
        case "Space":
            handleNextPage();
            break;
        case "Enter":
            if (bookStore.currentNoteId) {
                appStore.setShowNoteInfo(true);
                break;
            }

            handleAddNote();
            document.getSelection().removeAllRanges();
            break;
        case "Delete":
            handleDeleteNote();
            break;
    }
}

onMounted(() => {
    window.onwheel = handleWheelEvent;
    window.onkeydown = handleKeyEvent;
});

watch(
    () => bookStore.currentNoteId,
    () => {
        if (bookStore.currentNoteId && appStore.noteUser.id !== appStore.loginUser.id) {
            appStore.showNoteInfo = true;
        }
    }
);
</script>

<template>
    <div class="right-sidebar">
        <Icon :svg="ArrowLeftSvg" @click="handlePrevPage" :disabled="bookStore.pageNumber === 1" />
        <Icon :svg="ArrowRightSvg" @click="handleNextPage" :disabled="!bookStore.canNextPage" />
        <Icon
            :svg="UnderlineSvg"
            @click="handleAddNote"
            :disabled="!bookStore.selection || appStore.noteUser.id !== appStore.loginUser.id"
        />
        <Icon
            :svg="DeleteSvg"
            @click="handleDeleteNote"
            :disabled="!bookStore.currentNoteId || appStore.noteUser.id !== appStore.loginUser.id"
        />
        <Icon
            :svg="appStore.noteUser?.id === appStore.loginUser?.id ? EditSvg : EyeSvg"
            @click="appStore.setShowNoteInfo(true)"
            :disabled="!bookStore.currentNoteId"
        />
        <Drawer
            v-model:visible="appStore.showNoteInfo"
            position="right"
            @close="bookStore.currentNoteId = null"
            width="30%"
        >
            <Note />
        </Drawer>
    </div>
</template>

<style lang="less">
.right-sidebar {
    width: 48px;
    border-left: 1px solid black;

    > span.icon {
        font-size: 24px;
        display: block;
        padding: 12px 0;
        text-align: center;
        cursor: pointer;
        transition: color 0.2s;

        &.disabled {
            color: var(--disabled-color);
            cursor: auto;
        }
    }
}
</style>
