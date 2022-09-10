import { defineStore } from "pinia";
import api from "../api/Api";

interface IBookmarkState {
    bookmarks: number[];
}

const initialState: IBookmarkState = {
    bookmarks: [],
};

export const useBookmarkStore = defineStore("bookmark", {
    state: () => initialState,
    actions: {
        async addBookmark(pageNumber: number) {
            await api.addBookmark(pageNumber);
            this.bookmarks.push(pageNumber);
        },
        async deleteBookmark(pageNumber: number) {
            await api.deleteBookmark(pageNumber);
            this.bookmarks = this.bookmarks.filter((value) => value !== pageNumber);
        },
        async fetchBookmarks(userId: number) {
            const _bookmarks = await api.getBookmarks(userId);
            this.bookmarks = _bookmarks;
        },
    },
});
