<script setup>
const emit = defineEmits(['click']);

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'button'
  }
});
</script>

<template>
  <button :type="props.type" class="bg-sky-500 w-min text-nowrap py-2 px-4 rounded-lg hover:bg-sky-600 font-medium" @click="emit('click')"><slot></slot></button>
</template>