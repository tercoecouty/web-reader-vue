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
    actions: {
        setShowClasses(show: boolean) {
            this.showClasses = show;
            this.disableShortcut = show;
        },
        setShowBookmarks(show: boolean) {
            this.showBookmarks = show;
            this.disableShortcut = show;
        },
        setShowNotes(show: boolean) {
            this.showBookmarks = show;
            this.disableShortcut = show;
        },
        setShowSearch(show: boolean) {
            this.showSearch = show;
            this.disableShortcut = show;
        },
        setShowBookshelf(show: boolean) {
            this.showBookshelf = show;
            this.disableShortcut = show;
        },
        setShowSettings(show: boolean) {
            this.showSettings = show;
            this.disableShortcut = show;
        },
        setShowNoteInfo(show: boolean) {
            this.showNoteInfo = show;
            this.disableShortcut = show;
        },
    },
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
