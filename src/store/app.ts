import { defineStore } from "pinia";

interface ISearchRange {
    firstCharId: number;
    lastCharId: number;
}

interface IAppState {
    noteUser: IUser;
    loginUser: IUser;
    showClasses: boolean;
    showBookmarks: boolean;
    showNotes: boolean;
    showSearch: boolean;
    showBookshelf: boolean;
    showSettings: boolean;
    showNoteInfo: boolean;
    disableShortcut: boolean;
    searchRange: ISearchRange;
    bookId: number;
}

const initialState: IAppState = {
    noteUser: null,
    loginUser: null,
    showClasses: false,
    showBookmarks: false,
    showNotes: false,
    showSearch: false,
    showBookshelf: false,
    showSettings: false,
    showNoteInfo: false,
    disableShortcut: false,
    searchRange: null,
    bookId: null,
};

export const useAppStore = defineStore("app", {
    state: () => initialState,
    actions: {},
    getters: {
        getSearchRangeByLine: (state) => {
            return (line: ILine) => {
                const searchRange = state.searchRange;
                if (!searchRange) return JSON.stringify(null);
                if (
                    searchRange.lastCharId < line.firstCharId ||
                    searchRange.firstCharId > line.firstCharId + line.text.length
                ) {
                    return JSON.stringify(null);
                }

                return JSON.stringify(searchRange);
            };
        },
    },
});
