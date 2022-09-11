<script setup lang="ts">
import { watch } from "vue";
import { $ref, $toRef, $$ } from "vue/macros";
import { useAppStore, useBookStore } from "../store";
import { Switch, Select } from "../component";

const appStore = useAppStore();
const bookStore = useBookStore();

let hasChange = $ref(false);
let twoPage = $ref(bookStore.twoPage);
let indent = $ref(bookStore.indent);
let lineSpacing = $ref(bookStore.lineSpacing);

let showSettings = $toRef(appStore, "showSettings");

watch($$(showSettings), () => {
    if (!showSettings) {
        twoPage = bookStore.twoPage;
        indent = bookStore.indent;
        lineSpacing = bookStore.lineSpacing;
        hasChange = false;
    }
});

watch([$$(twoPage), $$(indent), $$(lineSpacing)], () => {
    hasChange = true;
});

function saveSettings() {
    bookStore.twoPage = twoPage;
    bookStore.indent = indent;
    bookStore.lineSpacing = lineSpacing;
    hasChange = false;
}
</script>

<template>
    <div class="settings">
        <div class="settings-item">
            <span>双页显示</span>
            <Switch v-model:checked="twoPage" />
        </div>
        <div class="settings-item">
            <span>缩进</span>
            <Select :options="[0, 1, 2, 4]" v-model:value="indent" />
        </div>
        <div class="settings-item">
            <span>行间距</span>
            <Select :options="[0, 2, 6, 10]" v-model:value="lineSpacing" />
        </div>
        <div v-if="hasChange" class="settings-save" @click="saveSettings">保存设置</div>
    </div>
</template>

<style lang="less">
.settings-item {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #bfbfbf;
}

.settings-save {
    position: absolute;
    bottom: 0;

    width: 100%;
    padding: 16px;
    text-align: center;
    cursor: pointer;

    color: white;
    background-color: var(--primary-color);
}
</style>
