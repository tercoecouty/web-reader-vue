<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useAppStore, useBookStore } from "../store";
import { Switch, Select } from "../component";

const appStore = useAppStore();
const bookStore = useBookStore();

const hasChange = ref(false);
const twoPage = ref(bookStore.twoPage);
const indent = ref(bookStore.indent);
const lineSpacing = ref(bookStore.lineSpacing);

const showSettings = computed(() => appStore.showSettings);

watch(showSettings, () => {
    if (!showSettings.value) {
        twoPage.value = bookStore.twoPage;
        indent.value = bookStore.indent;
        lineSpacing.value = bookStore.lineSpacing;
        hasChange.value = false;
    }
});

function toggleTwoPage() {
    twoPage.value = !twoPage.value;
    hasChange.value = true;
}
function handleIndentChange(value: number) {
    indent.value = value;
    hasChange.value = true;
}
function handleLineSpacingChange(value: number) {
    lineSpacing.value = value;
    hasChange.value = true;
}
function saveSettings() {
    if (twoPage.value !== bookStore.twoPage) {
        bookStore.twoPage = twoPage.value;
    }
    if (indent.value !== bookStore.indent) {
        bookStore.indent = indent.value;
    }
    if (lineSpacing.value !== bookStore.lineSpacing) {
        bookStore.lineSpacing = lineSpacing.value;
    }
    hasChange.value = false;
}
</script>

<template>
    <div class="settings">
        <div class="settings-item">
            <span>双页显示</span>
            <Switch :checked="twoPage" :onChange="toggleTwoPage" />
        </div>
        <div class="settings-item">
            <span>缩进</span>
            <Select :options="[0, 1, 2, 4]" :value="indent" :onChange="handleIndentChange" />
        </div>
        <div class="settings-item">
            <span>行间距</span>
            <Select :options="[0, 2, 6, 10]" :value="lineSpacing" :onChange="handleLineSpacingChange" />
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
