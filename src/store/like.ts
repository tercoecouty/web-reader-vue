import { defineStore } from "pinia";
import api from "../api/Api";

interface ILikeState {
    likes: ILike[];
}

const initialState: ILikeState = {
    likes: [],
};

export const useLikeStore = defineStore("like", {
    state: () => initialState,
    actions: {
        async like(noteId: number) {
            const _like = await api.addLike(noteId);
            this.likes.push(_like);
        },
        async unlike(likeId: number) {
            await api.deleteLike(likeId);
            this.likes = this.likes.filter((item) => item.id !== likeId);
        },
        async fetchLikes(noteId: number) {
            const _likes = await api.getLikes(noteId);
            this.likes = _likes;
        },
    },
});
