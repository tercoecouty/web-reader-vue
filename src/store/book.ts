import { defineStore } from "pinia";
import { useNoteStore } from "./note";
import api from "../api/Api";

interface IBookState {
    pageNumber: number;
    pages: IPage[];
    pageLoading: boolean;
    selection: ISelection;
    currentNoteId: number;
    twoPage: boolean;
    canNextPage: boolean;
    indent: number;
    lineSpacing: number;
    fontSize: number;
    fontFamily: string;
    pagePadding: string;
}

const initialState: IBookState = {
    pageNumber: 1,
    pages: [],
    pageLoading: true,
    selection: null,
    currentNoteId: null,
    twoPage: true,
    canNextPage: true,
    indent: 2,
    lineSpacing: 6,
    fontSize: 16,
    fontFamily: "Georgia, Arial",
    pagePadding: "0 24px",
};

export const useBookStore = defineStore("book", {
    state: () => initialState,
    actions: {
        setPageNumber(pageNumber: number) {
            const totalPage = this.pages.length;
            const lastPageNumber = this.pageNumber;

            if (totalPage === 0) return;

            if (pageNumber < 1) pageNumber = 1;
            else if (pageNumber > totalPage) pageNumber = totalPage;

            if (this.twoPage && totalPage % 2 === 0) {
                this.canNextPage = pageNumber !== totalPage - 1;
            } else {
                this.canNextPage = pageNumber !== totalPage;
            }

            if (pageNumber === lastPageNumber) return;
            if (this.twoPage) {
                if (lastPageNumber % 2 === 1 && pageNumber === lastPageNumber + 1) return;
                if (lastPageNumber % 2 === 0 && pageNumber === lastPageNumber - 1) return;
                if (pageNumber % 2 === 0) pageNumber -= 1;
            }

            this.pageNumber = pageNumber;
            this.currentNoteId = null;
            this.selection = null;
        },
        setPages(pages: IPage[]) {
            this.pages = pages;
            if (this.pageNumber > this.pages.length) this.pageNumber = 1;
        },
        nextPage() {
            const lastPageNumber = this.pageNumber;
            let pageNumber = this.twoPage ? lastPageNumber + 2 : lastPageNumber + 1;
            this.setPageNumber(pageNumber);
            api.setLastRead(pageNumber);
        },
        prevPage() {
            const lastPageNumber = this.pageNumber;
            let pageNumber = this.twoPage ? lastPageNumber - 2 : lastPageNumber - 1;
            this.setPageNumber(pageNumber);
            api.setLastRead(pageNumber);
        },
    },
    getters: {
        getCurrentNoteIdByLine: (state) => {
            return (line: ILine) => {
                const currentNoteId = state.currentNoteId;
                if (currentNoteId === null) return null;

                const noteStore = useNoteStore();
                const notes = noteStore.notes;
                const firstCharId = line.firstCharId;
                const lastCharId = line.firstCharId + line.text.length - 1;
                let notesByLine = notes.filter((note) => {
                    if (note.lastCharId < firstCharId || note.firstCharId > lastCharId) return false;
                    return true;
                });

                for (const note of notesByLine) {
                    if (note.id === currentNoteId) {
                        return currentNoteId;
                    }
                }

                return null;
            };
        },
    },
});
