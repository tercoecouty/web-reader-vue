<script setup lang="ts">
import { $computed } from "vue/macros";
import { useBookStore, useNoteStore, useAppStore } from "../../store";

interface ILineProps {
    line: ILine;
}

interface ISpan {
    text: string;
    noteId?: number;
    firstCharId?: number;
}

interface IDomSpan {
    attrs: any;
    text: string;
}

const { line } = defineProps<ILineProps>();
const bookStore = useBookStore();
const appStore = useAppStore();
const noteStore = useNoteStore();

const currentNoteId = $computed(() => bookStore.getCurrentNoteIdByLine(line));
const searchRange = $computed(() => JSON.parse(appStore.getSearchRangeByLine(line)));
const styleObject = $computed(() => {
    const style: any = {};
    if (line.spacingType === "letter") {
        style.letterSpacing = line.spacing + "px";
    } else {
        style.wordSpacing = line.spacing + "px";
    }

    if (line.indent) {
        style.marginLeft = bookStore.indent + "em";
    }

    if (line.text === "") {
        style.height = "1.2em";
        style.boxSizing = "content-box";
    }

    return style;
});
function renderSpans() {
    const spans: ISpan[] = [];
    let text = "";
    let noteId = null;
    let lastNoteId = null;
    let index = 0;
    let isLastNoteChar = undefined;
    for (; index < line.text.length; index++) {
        const char = line.text[index];
        const charId = line.firstCharId + index;

        let isNoteChar = false;
        for (const note of noteStore.notes) {
            if (note.firstCharId <= charId && charId <= note.lastCharId) {
                isNoteChar = true;
                lastNoteId = noteId;
                noteId = note.id;
                break;
            }
        }

        if (!isLastNoteChar && isNoteChar) {
            if (isLastNoteChar === undefined) {
                // 第一个字符是划线句
                text += char;
            } else {
                // 由普通句子进入划线句子
                spans.push({ text: text.slice(), noteId: null, firstCharId: charId - text.length });
                text = char;
            }
        } else if (isLastNoteChar && !isNoteChar) {
            // 由划线句子进入普通句子
            spans.push({ text: text.slice(), noteId, firstCharId: charId - text.length });
            text = char;
            noteId = null;
            lastNoteId = null;
        } else if (isLastNoteChar && isNoteChar) {
            // 两个字符都是划线句子，但是要检查是否属于同一个笔记
            if (lastNoteId && lastNoteId !== noteId) {
                // 不属于同一个笔记
                spans.push({ text: text.slice(), noteId: lastNoteId, firstCharId: charId - text.length });
                text = char;
            } else {
                // 属于同一个笔记
                text += char;
            }
        } else {
            // 两个字符都是普通句子
            text += char;
        }

        isLastNoteChar = isNoteChar;
    }
    spans.push({ text: text.slice(), noteId, firstCharId: line.firstCharId + index - text.length });

    const domSpans: IDomSpan[] = [];
    for (const span of spans) {
        const { noteId, firstCharId, text } = span;
        const selected = noteId && currentNoteId === noteId;
        const others = !selected && appStore.loginUser.id !== appStore.noteUser.id;
        if (noteId) {
            const classObject = { underline: true, selected, others };
            domSpans.push({
                text,
                attrs: {
                    "data-note-id": noteId,
                    "data-first-char-id": firstCharId,
                    key: firstCharId,
                    class: classObject,
                },
            });
        } else {
            domSpans.push({
                text,
                attrs: {
                    "data-first-char-id": firstCharId,
                    key: firstCharId,
                },
            });
        }
    }

    return domSpans;
}
function renderSpansWithHighlight() {
    const domSpans: IDomSpan[] = [];
    for (let index = 0; index < line.text.length; index++) {
        const char = line.text[index];
        const charId = line.firstCharId + index;

        let isNoteChar = false;
        let noteId = null;
        for (const note of noteStore.notes) {
            if (note.firstCharId <= charId && charId <= note.lastCharId) {
                isNoteChar = true;
                noteId = note.id;
                break;
            }
        }

        let isHighlightChar = false;
        if (searchRange && searchRange.firstCharId <= charId && charId <= searchRange.lastCharId) {
            isHighlightChar = true;
        }

        if (isNoteChar) {
            const selected = noteId && currentNoteId === noteId;
            const others = !selected && appStore.loginUser.id !== appStore.noteUser.id;

            domSpans.push({
                text: char,
                attrs: {
                    "data-note-id": noteId,
                    "data-first-char-id": charId,
                    key: charId,
                    class: { underline: true, selected, others, highlight: isHighlightChar },
                },
            });
        } else {
            domSpans.push({
                text: char,
                attrs: {
                    "data-first-char-id": charId,
                    key: charId,
                    class: { highlight: isHighlightChar },
                },
            });
        }
    }

    return domSpans;
}

const domSpans = $computed(() => {
    return searchRange ? renderSpansWithHighlight() : renderSpans();
});
</script>

<template>
    <div class="line" :style="styleObject">
        <span v-for="domSpan in domSpans" v-bind="domSpan.attrs">{{ domSpan.text }}</span>
    </div>
</template>

<style lang="less">
.line {
    overflow: hidden;
    padding: var(--line-padding);
}

.underline {
    border-bottom: 2px solid var(--underline-color);
    margin-bottom: -2px;
    cursor: pointer;
    transition: border-color 0.2s;

    &.selected {
        border-color: var(--underline-selected-color);
    }

    &.others {
        border-color: var(--underline-others-color);
    }
}
</style>
