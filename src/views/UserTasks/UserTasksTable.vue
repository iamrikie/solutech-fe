<template>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <div class="flex justify-between bUserTasks-b-2 pb-3">
      <div class="flex items-center">
        <span class="whitespace-nowrap mr-3">Per Page</span>
        <select @change="getUserTasks(null)" v-model="perPage"
                class="appearance-none relative block w-24 px-3 py-2 bUserTasks bUserTasks-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:bUserTasks-indigo-500 focus:z-10 sm:text-sm">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="ml-3">Found {{ usertasks.total }} usertasks</span>
      </div>
      <div>
        <input v-model="search" @change="getUserTasks(null)"
               class="appearance-none relative block w-48 px-3 py-2 bUserTasks bUserTasks-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:bUserTasks-indigo-500 focus:z-10 sm:text-sm"
               placeholder="Type to Search usertasks">
      </div>
    </div>

    <table class="table-auto w-full">
      <thead>
      <tr>
        <TableHeaderCell field="id" :sort-field="sortField" :sort-direction="sortDirection" @click="sortusertasks('id')">
          ID
        </TableHeaderCell>
        <TableHeaderCell :sort-field="sortField" :sort-direction="sortDirection">
          Customer
        </TableHeaderCell>
        <TableHeaderCell field="status" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortUserTasks('status')">
          Status
        </TableHeaderCell>
        <TableHeaderCell field="total_price" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortUserTasks('total_price')">
          Price
        </TableHeaderCell>
        <TableHeaderCell field="created_at" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortUserTasks('created_at')">
          Date
        </TableHeaderCell>
        <TableHeaderCell field="actions">
          Actions
        </TableHeaderCell>
      </tr>
      </thead>
      <tbody v-if="usertasks.loading || !usertasks.data.length">
      <tr>
        <td colspan="6">
          <Spinner v-if="usertasks.loading"/>
          <p v-else class="text-center py-8 text-gray-700">
            There are no usertasks
          </p>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr v-for="(UserTasks, index) of userstasks.data">
        <td class="bUserTasks-b p-2 ">{{ UserTasks.id }}</td>
        <td class="bUserTasks-b p-2 ">
          {{ UserTasks.customer.first_name }} {{ UserTasks.customer.last_name }}
        </td>
        <td class="bUserTasks-b p-2 ">
          <usertaskstatus :UserTasks="UserTasks" />
        </td>
        <td class="bUserTasks-b p-2">
          {{ $filters.currencyUSD(UserTasks.total_price) }}
        </td>
        <td class="bUserTasks-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ UserTasks.created_at }}
        </td>
        <td class="bUserTasks-b p-2 ">
          <router-link :to="{name: 'app.usertasks.view', params: {id: UserTasks.id}}"
                       class="w-8 h-8 rounded-full text-indigo-700 bUserTasks bUserTasks-indigo-700 flex justify-center items-center
                        hover:text-white hover:bg-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </router-link>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="!usertasks.loading" class="flex justify-between items-center mt-5">
      <div v-if="usertasks.data.length">
        Showing from {{ usertasks.from }} to {{ usertasks.to }}
      </div>
      <nav
        v-if="usertasks.total > usertasks.limit"
        class="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <!-- Current: "z-10 bg-indigo-50 bUserTasks-indigo-500 text-indigo-600", Default: "bg-white bUserTasks-gray-300 text-gray-500 hover:bg-gray-50" -->
        <a
          v-for="(link, i) of usertasks.links"
          :key="i"
          :disabled="!link.url"
          href="#"
          @click="getForPage($event, link)"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 bUserTasks text-sm font-medium whitespace-nowrap"
          :class="[
              link.active
                ? 'z-10 bg-indigo-50 bUserTasks-indigo-500 text-indigo-600'
                : 'bg-white bUserTasks-gray-300 text-gray-500 hover:bg-gray-50',
              i === 0 ? 'rounded-l-md' : '',
              i === usertasks.links.length - 1 ? 'rounded-r-md' : '',
              !link.url ? ' bg-gray-100 text-gray-700': ''
            ]"
          v-html="link.label"
        >
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import Spinner from "../../components/core/Spinner.vue";
import {TASKS_PER_PAGE} from "../../constants";
import TableHeaderCell from "../../components/core/Table/TableHeaderCell.vue";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {DotsVerticalIcon, PencilIcon, TrashIcon} from '@heroicons/vue/outline'
import usertaskstatus from "./usertaskstatus.vue";

const perPage = ref(TASKS_PER_PAGE);
const search = ref('');
const usertasks = computed(() => store.state.usertasks);
const sortField = ref('updated_at');
const sortDirection = ref('desc')
const showUserTasksModal = ref(false);

const emit = defineEmits(['clickEdit'])

onMounted(() => {
  getUserTasks();
})

function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getUserTasks(link.url)
}

function getUserTasks(url = null) {
  store.dispatch("getUserTasks", {
    url,
    search: search.value,
    per_page: perPage.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value
  });
}

function sortusertasks(field) {
  if (field === sortField.value) {
    if (sortDirection.value === 'desc') {
      sortDirection.value = 'asc'
    } else {
      sortDirection.value = 'desc'
    }
  } else {
    sortField.value = field;
    sortDirection.value = 'asc'
  }

  getUserTasks()
}

function showAddNewModal() {
  showUserTasksModal.value = true
}

function deleteUserTaks(UserTasks) {
  if (!confirm(`Are you sure you want to delete the UserTasks?`)) {
    return
  }
  store.dispatch('deleteUserTasks', UserTasks.id)
    .then(res => {
      // TODO Show notification
      store.dispatch('getUserTasks')
    })
}

function showUserTasks(p) {
  emit('clickShow', p)
}
</script>

<style scoped>

</style>
