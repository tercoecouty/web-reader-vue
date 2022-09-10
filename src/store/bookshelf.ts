import { defineStore } from "pinia";
import api from "../api/Api";

interface IBookshelfState {
    bookshelf: IBookshelfItem[];
}

const initialState: IBookshelfState = {
    bookshelf: [],
};

export const useBookshelfStore = defineStore("bookshelf", {
    state: () => initialState,
    actions: {
        async fetchBookshelf() {
            const _bookshelf = await api.getBookshelf();
            this.bookshelf = _bookshelf;
        },
    },
});
