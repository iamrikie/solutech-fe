<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">UserTaskss</h1>
  </div>
  <UserTaskssTable @clickView="viewUserTasks"/>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import UserTasksTable from "./UserTasksTable.vue";

const UserTaskss = computed(() => store.state.UserTaskss);

function showUserTasks(p) {

}
</script>

<style scoped>

</style>
