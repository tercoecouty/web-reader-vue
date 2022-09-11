<script setup lang="ts">
import { ref, computed, watch } from "vue";

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

const currentNoteId = computed(() => bookStore.currentNoteId);
const showNoteInfo = computed(() => appStore.showNoteInfo);

const commentsLoading = ref(true);
const likesLoading = ref(true);
const list = ref<"comments" | "likes">("comments");
const showEdit = ref(false);
const editType = ref<"editNote" | "addComment">("editNote");
const editHeaderText = ref("");
const editInitialText = ref("");
const toUserId = ref<number>(null);
const toUserName = ref<string>(null);
const editImagesUrls = ref<string[]>([]);

const note = computed(() => noteStore.notes.find((item) => item.id === currentNoteId.value));
const comments = computed(() => commentStore.comments.filter((item) => item.noteId === currentNoteId.value));
const likes = computed(() => likeStore.likes.filter((item) => item.noteId === currentNoteId.value));
const liked = computed(() => likes.value.find((item) => item.userId === appStore.loginUser.id));

function editNote() {
    editType.value = "editNote";
    editHeaderText.value = "修改笔记";
    editInitialText.value = note.value.content;
    editImagesUrls.value = note.value.imageUrls;
    showEdit.value = true;
}
function handleAddComment() {
    editType.value = "addComment";
    editHeaderText.value = "添加评论";
    toUserId.value = null;
    toUserName.value = null;
    editInitialText.value = "";
    editImagesUrls.value = [];
    showEdit.value = true;
}

function handleReplyComment(fromUserId: number, fromUserName: string) {
    toUserId.value = fromUserId;
    toUserName.value = fromUserName;
    editType.value = "addComment";
    editInitialText.value = "";
    editImagesUrls.value = [];
    editHeaderText.value = "回复" + fromUserName;
    showEdit.value = true;
}
async function handleSubmit(text: string, files: File[]) {
    if (editType.value === "editNote") {
        noteStore.updateNote(currentNoteId.value, text, files);
    } else if ((editType.value = "addComment")) {
        commentStore.addComment(currentNoteId.value, toUserId.value, toUserName.value, text, files);
    }
}
watch(currentNoteId, async () => {
    const _likes = await api.getLikes(currentNoteId.value);
    const _comments = await api.getComments(currentNoteId.value);
    likesLoading.value = false;
    commentsLoading.value = false;
    likeStore.likes = _likes;
    commentStore.comments = _comments;
});
watch(showNoteInfo, () => {
    if (!showNoteInfo.value) {
        showEdit.value = false;
        list.value = "comments";
    }
});
</script>

<template>
    <div v-if="note" class="overflow-container">
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
            :onClose="() => (showEdit = false)"
            :onSubmit="handleSubmit"
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
