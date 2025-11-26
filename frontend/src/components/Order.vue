<script setup>
import router from '../router';
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <button @click="router.push('/order/' + props.order.id)" class="bg-slate-100 grid grid-cols-2 items-center p-3">
    <div class="w-full flex items-center">
      <p class="text-xl">Rendelés száma: #{{ props.order.id}}</p>
    </div>
    <div class="w-full flex items-center justify-end gap-3">
      <p class="text-lg">{{ props.order.created_at.split("T")[0] }}</p>
      <span> - </span>
      <p class="text-lg text-green-600 font-medium">{{ props.order.status }}</p>
    </div>
  </button>
</template>
