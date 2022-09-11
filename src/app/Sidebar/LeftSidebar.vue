<script setup lang="ts">
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
</script>

<template>
    <div class="left-sidebar">
        <Icon :svg="TeamSvg" @click="appStore.setShowClasses(true)" />
        <Icon
            :svg="BarsSvg"
            @click="appStore.setShowNotes(true)"
            :disabled="appStore.noteUser?.id !== appStore.loginUser?.id"
        />
        <Icon
            :svg="BookSvg"
            @click="appStore.setShowBookmarks(true)"
            :disabled="appStore.noteUser?.id !== appStore.loginUser?.id"
        />
        <Icon
            :svg="SearchSvg"
            @click="appStore.setShowSearch(true)"
            :disabled="appStore.noteUser?.id !== appStore.loginUser?.id"
        />
        <Icon
            :svg="BookshelfSvg"
            @click="appStore.setShowBookshelf(true)"
            :disabled="appStore.noteUser?.id !== appStore.loginUser?.id"
        />
        <Icon
            :svg="SettingSvg"
            @click="appStore.setShowSettings(true)"
            :disabled="appStore.noteUser?.id !== appStore.loginUser?.id"
        />
        <Drawer :visible="appStore.showClasses" title="班级列表" position="left" @close="appStore.showClasses = false">
            <Classes />
        </Drawer>
        <Drawer :visible="appStore.showNotes" title="笔记" position="left" @close="appStore.showNotes = false">
            <Notes />
        </Drawer>
        <Drawer :visible="appStore.showBookmarks" title="书签" position="left" @close="appStore.showBookmarks = false">
            <Bookmarks />
        </Drawer>
        <Drawer :visible="appStore.showSearch" title="搜索" position="left" @close="appStore.showSearch = false">
            <Search />
        </Drawer>
        <Drawer
            :visible="appStore.showBookshelf"
            title="班级书架"
            position="left"
            @close="appStore.showBookshelf = false"
        >
            <Bookshelf />
        </Drawer>
        <Drawer :visible="appStore.showSettings" title="搜索" position="left" @close="appStore.showSettings = false">
            <Settings />
        </Drawer>
        <Prompt
            v-if="appStore.noteUser?.id !== appStore.loginUser?.id"
            :userName="appStore.noteUser.name"
            @close="appStore.noteUser = appStore.loginUser"
        />
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
