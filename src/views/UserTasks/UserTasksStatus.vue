<template>
  <span class="text-white py-1 px-2 rounded " :class="{
      'bg-emerald-500': ['paid', 'completed'].includes(UserTasks.status),
      'bg-orange-400': UserTasks.status === 'shipped',
      'bg-red-500': UserTasks.status === 'cancelled',
      'bg-gray-400': UserTasks.status === 'unpaid',
    }">{{ UserTasks.status }}</span>
</template>

<script setup>
const {UserTasks} = defineProps({
  UserTasks: Object
})
</script>

<style scoped>

</style>
