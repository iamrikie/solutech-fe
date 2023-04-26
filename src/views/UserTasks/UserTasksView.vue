<template>
  <div v-if="usertasks">

    <!--  UserTasks Details-->
    <div>
      <h2 class="flex justify-between items-center text-xl font-semibold pb-2 bUserTasks-b bUserTasks-gray-300">
        UserTasks Details
        <UserTasksStatus :UserTasks="UserTasks" />
      </h2>
      <table>
        <tbody>
        <tr>
          <td class="font-bold py-1 px-2">UserTasks #</td>
          <td>{{ usertasks.id }}</td>
        </tr>
        <tr>
          <td class="font-bold py-1 px-2">Tasks Date</td>
          <td>{{ usertasks.created_at }}</td>
        </tr>
        <tr>
          <td class="font-bold py-1 px-2">Tasks Status</td>
          <td>
            <select v-model="usertasks.status" @change="onStatusChange">
              <option v-for="status of UserTasksStatus" :value="status">{{status}}</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--/  UserTask Details-->

    <!--  employee Details-->
    <div>
      <h2 class="text-xl font-semibold mt-6 pb-2 bUserTasks-b bUserTasks-gray-300">employee Details</h2>
      <table>
        <tbody>
        <tr>
          <td class="font-bold py-1 px-2">Full Name</td>
          <td>{{ UserTasks.employee.first_name }} {{ UserTasks.employee.last_name }}</td>
        </tr>
        <tr>
          <td class="font-bold py-1 px-2">Email</td>
          <td>{{ UserTasks.employee.email }}</td>
        </tr>
        <tr>
          <td class="font-bold py-1 px-2">Phone</td>
          <td>{{ UserTasks.employee.phone }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--/  employee Details-->

  
    <!--    UserTasks Items-->
    <div>
      <h2 class="text-xl font-semibold mt-6 pb-2 bUserTasks-b bUserTasks-gray-300">UserTasks Items</h2>
      <div v-for="item of UserTasks.items">
        <!-- UserTasks Item -->
        <div class="flex flex-col sm:flex-row items-center  gap-4">
          <a href="#"
             class="w-36 h-32 flex items-center justify-center overflow-hidden">
            <img :src="item.task.name" class="object-cover" alt=""/>
          </a>
          <div class="flex flex-col justify-between flex-1">
            <div class="flex justify-between mb-3">
              <h3>
                {{ item.task.title }}
              </h3>
            </div>
          
          </div>
        </div>
        <!--/ UserTasks Item -->
        <hr class="my-3"/>
      </div>
    </div>
    <!--/    UserTasks Items-->

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import {useRoute} from "vue-router";
import axiosClient from "../../axios.js";
import UserTasksStatus from "./UserTasksStatus.vue";

const route = useRoute()

const UserTasks = ref(null);
const UserTasksStatuses = ref([]);

onMounted(() => {
  store.dispatch('getUserTask', route.params.id)
    .then(({data}) => {
      usertasks.value = data
    })

  axiosClient.get(`/v1/usertasks`)
    .then(({data}) => UserTasksStatuses.value = data)
})

function onStatusChange() {
  axiosClient.post(`/v1/usertasks/change-status/${usertasks.value.id}/${UserTasks.value.status}`)
    .then(({data}) => {
      store.commit('showToast', `Task status was successfully changed into "${UserTasks.value.status}"`)
    })

}

</script>

<style scoped>

</style>
