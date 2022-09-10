<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import Page from "./Page.vue";
import BookLayout from "./bookLayout";
import api from "../../api/Api";

import {
    useAppStore,
    useBookStore,
    useBookmarkStore,
    useBookshelfStore,
    useNoteStore,
    useClassStore,
} from "../../store";

const appStore = useAppStore();
const bookStore = useBookStore();
const bookmarkStore = useBookmarkStore();
const bookshelfStore = useBookshelfStore();
const noteStore = useNoteStore();
const classStore = useClassStore();

const bookText = ref("");
const resizeTimeoutId = ref(null);
const bookId = computed(() => appStore.bookId);
const noteUser = computed(() => appStore.noteUser);
const lineSpacing = computed(() => bookStore.lineSpacing);
const indent = computed(() => bookStore.indent);

function updatePage(_bookText: string, charId?: number) {
    const domPageContent = document.getElementById("page-content");
    const { width: totalWidth, height: totalHeight } = domPageContent.getBoundingClientRect();
    const domMeasure = document.getElementById("char-measurement");

    const layoutOptions = {
        lineSpacing: lineSpacing.value,
        indent: indent.value,
    };
    const book = new BookLayout(_bookText, totalWidth, totalHeight, domMeasure, layoutOptions);
    const pages = book.pageBreaking();

    bookStore.setPages(pages);
    bookStore.pageLoading = false;

    if (charId) {
        // 窗口尺寸改变导致页面重拍，尽量调整到当前阅读的地方
        let pageNumber = 1;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const lastLine = page.lines[page.lines.length - 1];
            const firstCharId = page.lines[0].firstCharId;
            const lastCharId = lastLine.firstCharId + lastLine.text.length;
            if (firstCharId <= charId && charId <= lastCharId) {
                pageNumber = i + 1;
                break;
            }
        }
        bookStore.setPageNumber(pageNumber);
    } else {
        // 书籍切换导致页面重排
        api.getLastRead().then((lastRead) => {
            bookStore.setPageNumber(lastRead);
        });
    }
}

onMounted(() => {
    api.getCurrentUser().then((user) => {
        appStore.loginUser = user;
        appStore.noteUser = user;
        appStore.bookId = 1;
        classStore.fetchClasses();
        bookshelfStore.fetchBookshelf();
    });
});

onMounted(() => {
    window.onresize = () => {
        clearTimeout(resizeTimeoutId.value);
        const charId = (document.querySelector(".line>span") as HTMLElement)?.dataset.firstCharId;

        bookStore.pageLoading = true;
        const timer = setTimeout(() => updatePage(bookText.value, parseInt(charId)), 1000); // 有意增加加载时间
        resizeTimeoutId.value = timer;
    };
});

watch(bookId, async () => {
    bookStore.pageLoading = true;
    const _bookText = await api.getBookText(bookId.value);
    bookText.value = _bookText;
    setTimeout(() => updatePage(_bookText), 300); // 有意增加一些加载时间
    if (noteUser) {
        noteStore.fetchNotes(noteUser.value.id);
        bookmarkStore.fetchBookmarks(noteUser.value.id);
    }
});

watch(noteUser, async () => {
    await noteStore.fetchNotes(noteUser.value.id);
    await bookmarkStore.fetchBookmarks(noteUser.value.id);
});

watch([lineSpacing, indent], () => {
    const dom = document.querySelector(".line>span") as HTMLElement;
    if (!dom) return;

    const charId = dom.dataset.firstCharId;
    bookStore.pageLoading = true;
    setTimeout(() => updatePage(bookText.value, parseInt(charId)), 1000); // 有意增加加载时间
});

function handleMouseUp() {
    const _selection = document.getSelection();
    const text = _selection.toString();
    if (text === "") {
        if (bookStore.selection) {
            bookStore.selection = null;
        }

        return;
    }

    const range = _selection.getRangeAt(0);
    const startParent = range.startContainer.parentElement;
    const endParent = range.endContainer.parentElement;
    const firstCharId = parseInt(startParent.dataset.firstCharId) + range.startOffset;
    const lastCharId = parseInt(endParent.dataset.firstCharId) + range.endOffset - 1;

    if (!firstCharId || !lastCharId) return;
    bookStore.selection = { firstCharId, lastCharId, text: text.replace(/\n/g, "") };
}
</script>

<template>
    <div class="book" @mouseup="handleMouseUp">
        <Page />
        <Page v-if="bookStore.twoPage" isSecondPage />
    </div>
</template>

<style lang="less">
.book {
    flex: 1;
    display: flex;
}
</style>
