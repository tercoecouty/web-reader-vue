<script setup lang="ts">
import { ref, watch } from "vue";
import { useAppStore, useBookStore } from "../store";

const appStore = useAppStore();
const bookStore = useBookStore();
const value = ref("");
const searchResult = ref<Generator>(null);
const done = ref(false);
const domResults = ref([]);

function indexOf(text, chars, index) {
    for (let i = index; i < text.length; i++) {
        for (const char of chars) {
            if (char === text[i]) {
                return i;
            }
        }
    }

    return -1;
}
function lastIndexOf(text, chars, index) {
    for (let i = index; i >= 0; i--) {
        for (const char of chars) {
            if (char === text[i]) {
                return i;
            }
        }
    }

    return -1;
}
function* getParas(pages: IPage[]) {
    let firstCharId = 1;
    let text = "";
    for (const page of pages) {
        for (const line of page.lines) {
            if (line.isFirstLine) {
                if (text) yield { firstCharId, text };
                text = line.text;
                firstCharId = line.firstCharId;
            } else {
                text += line.text;
            }
        }
    }

    yield { firstCharId, text };
}
function* search(keyword: string) {
    for (const para of getParas(bookStore.pages)) {
        for (const match of para.text.matchAll(new RegExp(keyword, "g"))) {
            const paraText = match.input as string;
            const index = match.index;
            let leftIndex = lastIndexOf(paraText, "。？.;", index);
            let rightIndex = indexOf(paraText, "。？.;", index);
            leftIndex = leftIndex === -1 ? 0 : leftIndex + 1;
            rightIndex = rightIndex === -1 ? paraText.length : rightIndex + 1;

            yield {
                keyword,
                firstCharId: para.firstCharId + index,
                left: paraText.slice(leftIndex, index),
                right: paraText.slice(index + keyword.length, rightIndex),
            };
        }
    }
}
function loadMore() {
    if (!searchResult.value) return null;

    const _domResults = [];
    let count = 1;
    while (true) {
        if (count++ > 10) break;

        const next = searchResult.value.next();
        if (next.done) {
            done.value = true;
            break;
        }

        const { keyword, firstCharId, left, right } = next.value;

        let pageNumber = 1;
        for (let i = 0; i < bookStore.pages.length; i++) {
            const page = bookStore.pages[i];
            const paraFirstCharId = page.lines[0].firstCharId;
            const lastLine = page.lines[page.lines.length - 1];
            const paraLastCharId = lastLine.firstCharId + lastLine.text.length;
            if (firstCharId > paraFirstCharId && firstCharId < paraLastCharId) {
                pageNumber = i + 1;
                break;
            }
        }

        _domResults.push({ firstCharId, pageNumber, keyword, left, right });
    }

    domResults.value = [...domResults.value, ..._domResults];
}

watch(searchResult, () => {
    if (searchResult.value) loadMore();
    else domResults.value = [];
});

function handleSearch() {
    if (value.value === "") {
        appStore.searchRange = null;
        searchResult.value = null;
    } else {
        appStore.searchRange = null;
        const _searchResult = search(value.value);
        searchResult.value = _searchResult;
    }

    done.value = false;
    domResults.value = [];
}

function handleClick(pageNumber: number, firstCharId: number, lastCharId: number) {
    appStore.searchRange = { firstCharId, lastCharId: lastCharId - 1 };
    bookStore.setPageNumber(pageNumber);
    appStore.setShowSearch(false);
}

function handleInput(e) {
    const _value = e.target.value;
    if (_value.length > 10) return;
    value.value = _value;
}

function handleClear() {
    appStore.searchRange = null;
    value.value = "";
    done.value = false;
    searchResult.value = null;
}
</script>

<template>
    <div class="search">
        <div class="search-header">
            <input type="text" :value="value" @change="handleInput" />
            <button @click="handleClear">清空</button>
            <button @click="handleSearch">搜索</button>
        </div>
        <div class="search-result">
            <div
                v-for="{ firstCharId, pageNumber, keyword, left, right } in domResults"
                :key="firstCharId"
                class="search-result-item"
                @click="handleClick(pageNumber, firstCharId, firstCharId + keyword.length)"
            >
                <div class="search-result-text">
                    <span>{{ left }}</span>
                    <span class="search-keyword">{{ keyword }}</span>
                    <span>{{ right }}</span>
                </div>
                <div class="search-result-pageNumber">{{ pageNumber }}</div>
            </div>
        </div>
        <div v-if="searchResult && done" class="search-footer">
            <span class="no-more">没有更多</span>
        </div>
        <div v-if="searchResult && !done" class="search-footer">
            <span class="load-more" @click="loadMore">加载更多</span>
        </div>
    </div>
</template>

<style lang="less">
.search {
    padding: 16px;
}

.search-header {
    display: flex;

    > input {
        width: 100%;
        outline: none;
        padding: 8px;
        margin-right: 8px;
        border-radius: 3px;
        border: 1px solid #bfbfbf;
    }

    > button {
        width: 64px;
        cursor: pointer;
        background: none;
        border: none;
        background-color: var(--primary-color);
        color: white;
        border-radius: 3px;

        &:hover {
            background-color: var(--primary-light-color);
        }

        &:last-child {
            margin-left: 8px;
        }
    }
}

.search-result {
    font-size: 14px;
    text-align: justify;
    padding: 16px 0;

    > .search-result-item {
        padding: 8px 0;
        border-bottom: 1px solid #bfbfbf;
        display: flex;
        align-items: center;
        cursor: pointer;

        > .search-result-text {
            width: 100%;
        }

        > .search-result-pageNumber {
            padding: 0 16px;
        }

        &:hover {
            background-color: var(--hover-bg-color);
        }
    }

    .search-keyword {
        padding: 2px;
        background-color: #ffc069;
    }
}

.highlight {
    background-color: #ffc069;
}

.search-footer {
    text-align: center;
    font-size: 14px;

    > .no-more {
        color: #bfbfbf;
    }

    > .load-more {
        color: var(--primary-color);
        cursor: pointer;
    }
}
</style>
