import { defineStore } from "pinia";
import api from "../api/Api";

interface IClassState {
    classes: IClass[];
    currentClassId: number;
}

const initialState: IClassState = {
    classes: [],
    currentClassId: 1,
};

export const useClassStore = defineStore("class", {
    state: () => initialState,
    actions: {
        async fetchClasses() {
            const _classes = await api.getClasses();
            this.classes = _classes;
        },
    },
});
