<script setup lang="ts">
import LeftSidebar from "./Sidebar/LeftSidebar.vue";
import RightSidebar from "./Sidebar/RightSidebar.vue";
import Book from "./Book/Book.vue";
</script>

<template>
    <div class="app theme-default">
        <LeftSidebar />
        <Book />
        <RightSidebar />
    </div>
</template>

<style lang="less">
.theme-default {
    --bg-color: #efebe0;
    --hover-bg-color: #f0f0f0;
    --list-selected-color: #40a9ff;
    --primary-color: #1890ff;
    --primary-light-color: #40a9ff;
    --underline-color: #40a9ff;
    --underline-selected-color: #fa8c16;
    --underline-others-color: #8c8c8c;
    --disabled-color: #bfbfbf;
    --danger-color: #f5222d;
    --danger-light-color: #f5222d;
}

.app {
    background-color: var(--bg-color);
    height: 100vh;
    display: flex;
}
</style>
