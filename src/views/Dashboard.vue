<template>
  <div class="mb-2 flex items-center justify-between">
    <h1 class="text-3xl font-semibold">Dashboard</h1>
    <div class="flex items-center">
      <label class="mr-2">Change Date Period</label>
      <CustomInput type="select" v-model="chosenDate" @change="onDatePickerChange" :select-options="dateOptions"/>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
    <!--    Active Users-->
    <div class="animate-fade-in-down bg-white py-6 px-5 rounded-lg shadow flex flex-col items-center justify-center">
      <label class="text-lg font-semibold block mb-2">Active Users</label>
      <template v-if="!loading.usersCount">
        <span class="text-3xl font-semibold">{{ usersCount }}</span>
      </template>
      <Spinner v-else text="" class=""/>
    </div>
    <!--/    Active Users-->
    <!--    Active Tasks -->
    <div class="animate-fade-in-down bg-white py-6 px-5 rounded-lg shadow flex flex-col items-center justify-center"
         style="animation-delay: 0.1s">
      <label class="text-lg font-semibold block mb-2">Active Tasks</label>
      <template v-if="!loading.tasksCount">
        <span class="text-3xl font-semibold">{{ tasksCount }}</span>
      </template>
      <Spinner v-else text="" class=""/>
    </div>
    <!--/    Active Tasks -->
    <!--    Completed Tasks -->
    <div class="animate-fade-in-down bg-white py-6 px-5 rounded-lg shadow flex flex-col items-center justify-center"
         style="animation-delay: 0.2s">
      <label class="text-lg font-semibold block mb-2">Completed Tasks</label>
      <template v-if="!loading.completedTasks">
        <span class="text-3xl font-semibold">{{ completedTasks }}</span>
      </template>
      <Spinner v-else text="" class=""/>
    </div>
    <!--/    Completed Tasks -->
    <!--    Overdue Tasks -->
    <div class="animate-fade-in-down bg-white py-6 px-5 rounded-lg shadow flex flex-col items-center"
         style="animation-delay: 0.3s">
      <label class="text-lg font-semibold block mb-2">Overdue Tasks</label>
      <template v-if="!loading.overdueTasks">
        <span class="text-3xl font-semibold">{{ overdueTasks }}</span>
      </template>
      <Spinner v-else text="" class=""/>
    </div>
    <!--/    Overdue Income -->
  </div>

  <div class="grid grid-rows-1 md:grid-rows-2 md:grid-flow-col grid-cols-1 md:grid-cols-3 gap-3">
    <div class="col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-white py-6 px-5 rounded-lg shadow">
      <label class="text-lg font-semibold block mb-2">Latest Tasks</label>
      <template v-if="!loading.latestTasks">
        <div v-for="o of latestTasks" :key="o.id" class="py-2 px-3 hover:bg-gray-50">
          <p>
            <router-link :to="{name: 'app.UserTaskss.view', params: {id: o.id}}" class="text-indigo-700 font-semibold">
              Task #{{ o.id }}
            </router-link>
            created {{ o.created_at }}. {{ o.items }} items
          </p>
          <p class="flex justify-between">
            <span>{{ o.first_name }} {{ o.last_name }}</span>
          </p>
        </div>
      </template>
      <Spinner v-else text="" class=""/>
    </div>

    <div class="bg-white py-6 px-5 rounded-lg shadow flex flex-col items-center justify-center">
      <label class="text-lg font-semibold block mb-2">Tasks By Status</label>
      <template v-if="!loading.tasksByStatus">
        <DoughnutChart :width="140" :height="200" :data="tasksByStatus"/>
      </template>
      <Spinner v-else text="" class=""/>
    </div>

    <div class="bg-white py-6 px-5 rounded-lg shadow">
      <label class="text-lg font-semibold block mb-2">Latest Users</label>
      <template v-if="!loading.latestUsers">
        <router-link :to="{name: 'app.users.view', params: {id: c.id}}" v-for="c of latestUsers" :key="c.id"
                     class="mb-3 flex">
          <div class="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full mr-2">
            <UserIcon class="w-5"/>
          </div>
          <div>
            <h3>{{ c.name }}</h3>
            <p>{{ c.email }}</p>
          </div>
        </router-link>
      </template>
      <Spinner v-else text="" class=""/>
    </div>
  </div>

</template>

<script setup>
import {UserIcon} from '@heroicons/vue/outline'
import DoughnutChart from '../components/core/Charts/Doughnut.vue'
import axiosClient from "../axios.js";
import {computed, onMounted, ref} from "vue";
import Spinner from "../components/core/Spinner.vue";
import CustomInput from "../components/core/CustomInput.vue";
import {useStore} from "vuex";

const store = useStore();
const dateOptions = computed(() => store.state.dateOptions);
const chosenDate = ref('all')

const loading = ref({
  usersCount: true,
  tasksCount: true,
  completedTasks: true,
  overdueTasks: true,
  latestTasks: true,
  latestUsers: true,

  tasksByStatus: true
})
const usersCount = ref(0);
const tasksCount = ref(0);
const completedTasks = ref(0);
const overdueTasks = ref(0);
const latestTasks = ref([]);//bnm
const latestUsers = ref([]);

const tasksByStatus = ref([]);

function updateDashboard() {
  const d = chosenDate.value
  loading.value = {
    usersCount: true,
    tasksCount: true,
    completedTasks: true,
    overdueTasks: true,
    latestTasks: true,
    latestUsers: true,

    tasksByStatus: true
  }
  axiosClient.get(`/v1/dashboard/`, {params: {d}}).then(({data}) => {
    usersCount.value = data
    loading.value.usersCount = false;
  })
  axiosClient.get(`/v1/dashboard/`, {params: {d}}).then(({data}) => {
    tasksCount.value = data;
    loading.value.tasksCount = false;
  })
  axiosClient.get(`/v1/dashboard/`, {params: {d}}).then(({data}) => {
    completedTasks.value = data;
    loading.value.completedTasks = false;
  })
  axiosClient.get(`/v1/dashboard/`, {params: {d}}).then(({data}) => {
    overdueTasks.value = data;
    loading.value.overdueTasks = false;
  })
  axiosClient.get(`/v1/tasks-by-status`, {params: {d}}).then(({data: status}) => {
    loading.value.tasksByStatus = false;
    const chartData = {
      labels: [],
      datasets: [{
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: []
      }]
    }
    status.forEach(c => {
      chartData.labels.push(c.name);
      chartData.datasets[0].data.push(c.count);
    })
    tasksByStatus.value = chartData
  })


  axiosClient.get(`/v1/user`, {params: {d}}).then(({data: users}) => {
    latestUsers.value = users;
    loading.value.latestUsers = false;
  })
  
  axiosClient.get(`/v1/dashboard/latest-tasks`, {params: {d}}).then(({data: tasks}) => {
    latestTasks.value = tasks.data;
    loading.value.latestTasks = false;
  })
}

function onDatePickerChange() {
  updateDashboard()
}

onMounted(() => updateDashboard())
</script>

<style scoped>

</style>
