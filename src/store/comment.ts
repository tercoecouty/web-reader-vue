import { defineStore } from "pinia";
import api from "../api/Api";

interface ICommentState {
    comments: IComment[];
}

const initialState: ICommentState = {
    comments: [],
};

export const useCommentStore = defineStore("comment", {
    state: () => initialState,
    actions: {
        async addComment(noteId: number, toUserId: number, toUserName: string, content: string, files: File[]) {
            const _comment = await api.addComment(noteId, toUserId, toUserName, content, files);
            this.comments.push(_comment);
        },
        async deleteComment(commentId: number) {
            await api.deleteComment(commentId);
            this.comments = this.comments.filter((item) => item.id !== commentId);
        },
        async fetchComments(noteId: number) {
            const _comments = await api.getComments(noteId);
            this.comments = _comments;
        },
        updateComment(payload: { commentId: number; content: string }) {
            const { commentId, content } = payload;
            this.comments = this.comments.map((item) => {
                if (item.id === commentId) {
                    return {
                        ...item,
                        content,
                    };
                } else {
                    return item;
                }
            });
        },
    },
});
