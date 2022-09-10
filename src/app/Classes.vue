<script setup lang="ts">
import { computed } from "vue";
import { useAppStore, useClassStore } from "../store";

const appStore = useAppStore();
const classStore = useClassStore();
const classItem = computed(() => classStore.classes.find((item) => item.id === classStore.currentClassId));

function handleChange(e: any) {
    classStore.currentClassId = parseInt(e.target.value);
}
function clickUser(user: IUser) {
    appStore.noteUser = user;
    appStore.setShowClasses(false);
}
</script>

<template>
    <div className="classes">
        <div class="classes-select-container">
            <select class="classes-select" :value="classStore.currentClassId" @change="handleChange">
                <option v-for="item in classStore.classes" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
        </div>
        <div class="student-list">
            <div class="student-list-header">
                <div>学号</div>
                <div>姓名</div>
            </div>
            <div
                v-if="classItem"
                v-for="user in classItem.students"
                class="student-list-row"
                :class="{ selected: user.id === appStore.noteUser.id }"
                :key="user.id"
                @click="clickUser(user)"
            >
                <div>{{ user.account }}</div>
                <div>{{ user.name }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
.classes-select {
    width: 100%;
    padding: 4px;
    cursor: pointer;
    outline: none;
}

.classes-select-container {
    padding: 8px;
}

.student-list > div {
    display: flex;
    justify-content: space-between;
    padding: 16px;

    > div {
        width: 50%;
        text-align: center;
    }
}

.student-list-row {
    &:hover {
        cursor: pointer;
        background-color: var(--hover-bg-color);
    }

    &.selected {
        color: var(--list-selected-color);
    }
}
</style>
