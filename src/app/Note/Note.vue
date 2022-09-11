<script setup lang="ts">
import { watch } from "vue";
import { $ref, $toRef, $computed, $$ } from "vue/macros";

import api from "../../api/Api";

import NoteUser from "./NoteUser.vue";
import NoteEdit from "./NoteEdit.vue";
import NoteImages from "./NoteImages.vue";

import { Icon } from "../../component";
import { CommentSvg, LikeSvg, LikeFilledSvg, EditSvg, DeleteSvg } from "../../svg";
import { useBookStore, useAppStore, useNoteStore, useCommentStore, useLikeStore } from "../../store";

const appStore = useAppStore();
const bookStore = useBookStore();
const noteStore = useNoteStore();
const commentStore = useCommentStore();
const likeStore = useLikeStore();

const currentNoteId = $toRef(bookStore, "currentNoteId");
const showNoteInfo = $toRef(appStore, "showNoteInfo");

let commentsLoading = $ref(true);
let likesLoading = $ref(true);
let list = $ref<"comments" | "likes">("comments");
let showEdit = $ref(false);
let editType = $ref<"editNote" | "addComment">("editNote");
let editHeaderText = $ref("");
let editInitialText = $ref("");
let toUserId = $ref<number>(null);
let toUserName = $ref<string>(null);
let editImagesUrls = $ref<string[]>([]);

const note = $computed(() => noteStore.notes.find((item) => item.id === currentNoteId));
const comments = $computed(() => commentStore.comments.filter((item) => item.noteId === currentNoteId));
const likes = $computed(() => likeStore.likes.filter((item) => item.noteId === currentNoteId));
const liked = $computed(() => likes.find((item) => item.userId === appStore.loginUser.id));

function editNote() {
    editType = "editNote";
    editHeaderText = "修改笔记";
    editInitialText = note.content;
    editImagesUrls = note.imageUrls;
    showEdit = true;
}
function handleAddComment() {
    editType = "addComment";
    editHeaderText = "添加评论";
    toUserId = null;
    toUserName = null;
    editInitialText = "";
    editImagesUrls = [];
    showEdit = true;
}

function handleReplyComment(fromUserId: number, fromUserName: string) {
    toUserId = fromUserId;
    toUserName = fromUserName;
    editType = "addComment";
    editInitialText = "";
    editImagesUrls = [];
    editHeaderText = "回复" + fromUserName;
    showEdit = true;
}
async function handleSubmit(text: string, files: File[]) {
    if (editType === "editNote") {
        noteStore.updateNote(currentNoteId, text, files);
    } else if ((editType = "addComment")) {
        commentStore.addComment(currentNoteId, toUserId, toUserName, text, files);
    }
}
watch($$(currentNoteId), async () => {
    const _likes = await api.getLikes(currentNoteId);
    const _comments = await api.getComments(currentNoteId);
    likesLoading = false;
    commentsLoading = false;
    likeStore.likes = _likes;
    commentStore.comments = _comments;
});
watch($$(showNoteInfo), () => {
    if (!showNoteInfo) {
        showEdit = false;
        list = "comments";
    }
});
</script>

<template>
    <div v-if="note && appStore.showNoteInfo" class="overflow-container">
        <div class="note">
            <NoteUser :name="note.userName" :dateTime="note.dateTime" />
            <div class="note-text">{{ note.text }}</div>
            <div v-if="note.content" class="note-content">
                <div v-for="text in note.content.split('\n')">{{ text }}</div>
            </div>
            <NoteImages v-if="note.imageUrls.length !== 0" :urls="note.imageUrls" />
            <div class="note-buttons">
                <div>
                    <Icon :svg="CommentSvg" @click="handleAddComment" />
                    <Icon v-if="liked" :svg="LikeFilledSvg" @click="likeStore.unlike(liked.id)" />
                    <Icon v-else :svg="LikeSvg" @click="likeStore.like(currentNoteId)" />
                </div>
                <div v-if="appStore.noteUser.id === appStore.loginUser.id">
                    <Icon :svg="EditSvg" @click="editNote" />
                    <Icon
                        :svg="DeleteSvg"
                        @click="noteStore.updateNote(currentNoteId, '', [])"
                        :disabled="note.content === '' && note.imageUrls.length === 0"
                    />
                </div>
            </div>
            <div class="list-header">
                <div :class="{ selected: list === 'comments' }" @click="list = 'comments'">
                    评论（{{ comments.length }}）
                </div>
                <div :class="{ selected: list === 'likes' }" @click="list = 'likes'">点赞（{{ likes.length }}）</div>
            </div>
            <div class="overflow-container">
                <div class="list-container" :class="list">
                    <div class="list">
                        <div v-if="commentsLoading" class="empty-list">加载中……</div>
                        <div v-else-if="comments.length === 0" class="empty-list">没有评论</div>
                        <div v-else v-for="comment in comments" class="list-item" :key="comment.id">
                            <div class="comment-header">
                                <NoteUser
                                    :name="`${comment.fromUserName}${
                                        comment.toUserId ? ' 回复 ' + comment.toUserName : ''
                                    }`"
                                    :dateTime="comment.dateTime"
                                />
                                <div class="comment-buttons">
                                    <Icon
                                        :svg="CommentSvg"
                                        @click="handleReplyComment(comment.fromUserId, comment.fromUserName)"
                                    />
                                    <Icon
                                        v-if="comment.fromUserId === appStore.loginUser.id"
                                        :svg="DeleteSvg"
                                        @click="commentStore.deleteComment(comment.id)"
                                    />
                                </div>
                            </div>
                            <div v-if="comment.content" class="comment-content">{{ comment.content }}</div>
                            <NoteImages v-if="comment.imageUrls.length !== 0" :urls="comment.imageUrls" />
                        </div>
                    </div>
                    <div class="list">
                        <div v-if="likesLoading" class="empty-list">加载中……</div>
                        <div v-else-if="likes.length === 0" class="empty-list">没有点赞</div>
                        <div v-else v-for="item in likes" :key="item.id" class="list-item">
                            <NoteUser :name="item.userName" :dateTime="item.dateTime" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <NoteEdit
            v-if="showEdit"
            :initialText="editInitialText"
            :headerText="editHeaderText"
            :imagesUrls="editImagesUrls"
            @close="showEdit = false"
            @submit="handleSubmit"
        />
    </div>
</template>

<style lang="less">
.overflow-container {
    overflow: hidden;
    position: relative;
}

.note {
    height: 100vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: #8c8c8c;
    }
}

.note-text {
    font-size: 14px;
    font-family: Georgia, Arial, sans-serif;
    text-align: justify;
    padding: 16px;
    background-color: #efebe0;
    line-height: 1.5;
}

.note-content {
    font-size: 14px;
    font-family: Arial;
    text-align: justify;
    line-height: 1.5;
    margin: 16px;
}

.note-buttons {
    display: flex;
    justify-content: space-between;
    margin: 16px;
    font-size: 22px;

    > div > span.icon {
        cursor: pointer;

        &:first-child {
            margin-right: 8px;
        }

        &.danger {
            color: var(--danger-color);
        }

        &.disabled {
            color: var(--disabled-color);
            cursor: auto;
        }
    }
}

.list-header {
    display: flex;

    > div {
        width: 50%;
        padding: 8px 16px;
        text-align: center;
        cursor: pointer;
        color: #8c8c8c;

        &:hover {
            background-color: #f5f5f5;
        }

        &.selected {
            color: inherit;
            border-bottom: 2px solid var(--primary-color);
        }
    }
}

.list-container {
    display: flex;
    width: 200%;
    transition: transform 0.2s;

    > .list {
        width: 100%;
    }

    &.comments {
        transform: translate(0, 0);
    }

    &.likes {
        transform: translate(-50%, 0);
    }
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px;

    > .comment-buttons > span.icon {
        font-size: 22px;
        cursor: pointer;

        &:first-child {
            margin-right: 8px;
        }
    }

    > .note-user {
        padding: 0;
    }
}

.list-item + .list-item {
    border-top: 1px solid #d9d9d9;
}

.comment-content {
    margin: 16px;
    font-size: 14px;
}

.empty-list {
    text-align: center;
    padding: 24px 0;
    color: #8c8c8c;
}
</style>
