import { defineStore } from "pinia";
import api from "../api/Api";

interface INoteState {
    notes: INote[];
}

const initialState: INoteState = {
    notes: [],
};

export const useNoteStore = defineStore("note", {
    state: () => initialState,
    actions: {
        async addNote(selection: ISelection) {
            const _note = await api.addNote(selection.firstCharId, selection.lastCharId, selection.text);
            this.notes.push(_note);
        },
        async deleteNote(noteId: number) {
            await api.deleteNote(noteId);
            this.notes = this.notes.filter((note) => note.id !== noteId);
        },
        async fetchNotes(userId: number) {
            const _notes = await api.getNotes(userId);
            this.notes = _notes;
        },
        async updateNote(noteId: number, content: string, files: File[]) {
            const imageUrls = await api.updateNote(noteId, content, files);
            this.notes = this.notes.map((item) => {
                if (item.id === noteId) {
                    return {
                        ...item,
                        content,
                        imageUrls,
                    };
                } else {
                    return item;
                }
            });
        },
    },
});
