<script setup lang="ts">
import { computed } from "vue";
import { Icon, Drawer } from "../../component";
import { TeamSvg, BarsSvg, SearchSvg, BookSvg, SettingSvg, BookshelfSvg } from "../../svg";
import Classes from "../Classes.vue";
import Notes from "../Notes.vue";
import Bookmarks from "../Bookmarks.vue";
import Search from "../Search.vue";
import Bookshelf from "../Bookshelf.vue";
import Settings from "../Settings.vue";
import Prompt from "./Prompt.vue";

import { useAppStore } from "../../store";
const appStore = useAppStore();
const disableIcon = computed(() => appStore.noteUser?.id !== appStore.loginUser?.id);
</script>

<template>
    <div class="left-sidebar">
        <Icon :svg="TeamSvg" @click="appStore.showClasses = true" />
        <Icon :svg="BarsSvg" @click="appStore.showNotes = true" :disabled="disableIcon" />
        <Icon :svg="BookSvg" @click="appStore.showBookmarks = true" :disabled="disableIcon" />
        <Icon :svg="SearchSvg" @click="appStore.showSearch = true" :disabled="disableIcon" />
        <Icon :svg="BookshelfSvg" @click="appStore.showBookshelf = true" :disabled="disableIcon" />
        <Icon :svg="SettingSvg" @click="appStore.showSettings = true" :disabled="disableIcon" />
        <Drawer v-model:visible="appStore.showClasses" title="班级列表" position="left">
            <Classes />
        </Drawer>
        <Drawer v-model:visible="appStore.showNotes" title="笔记" position="left">
            <Notes />
        </Drawer>
        <Drawer v-model:visible="appStore.showBookmarks" title="书签" position="left">
            <Bookmarks />
        </Drawer>
        <Drawer v-model:visible="appStore.showSearch" title="搜索" position="left">
            <Search />
        </Drawer>
        <Drawer v-model:visible="appStore.showBookshelf" title="班级书架" position="left">
            <Bookshelf />
        </Drawer>
        <Drawer v-model:visible="appStore.showSettings" title="搜索" position="left">
            <Settings />
        </Drawer>
        <Prompt v-if="disableIcon" :userName="appStore.noteUser.name" @close="appStore.noteUser = appStore.loginUser" />
    </div>
</template>

<style lang="less">
.left-sidebar {
    width: 48px;
    border-right: 1px solid black;

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
