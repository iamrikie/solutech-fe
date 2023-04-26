<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Tasks</h1>
    <button type="button"
            @click="showAddNewModal()"
            class="py-2 px-4 bUserTasks bUserTasks-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Add new Task
    </button>
  </div>
  <TasksTable @clickEdit="editTask"/>
  <TaskModal v-model="showTaskModal" :task="taskModel" @close="onModalClose"/>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import TaskModal from "./TaskModal.vue";
import TasksTable from "./TasksTable.vue";

const DEFAULT_TASK = {
  id: '',
  name: '',
  description: '',
  due_date: '',
  status_id: ''
}

const tasks = computed(() => store.state.tasks);

const taskModel = ref({...DEFAULT_TASK})
const showTaskModal = ref(false);

function showAddNewModal() {
  showTaskModal.value = true
}

function editTask(p) {
  store.dispatch('getTask', p.id)
    .then(({data}) => {
      taskModel.value = data
      showAddNewModal();
    })
}

function onModalClose() {
  taskModel.value = {...DEFAULT_TASK}
}
</script>

<style scoped>

</style>
