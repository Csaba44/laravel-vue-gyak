<script setup>
const emit = defineEmits(["click"]);

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "button",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <button :disabled="props.disabled" :type="props.type" class="w-min text-nowrap py-2 px-4 rounded-lg font-medium bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed" @click="emit('click')">
    <slot></slot>
  </button>
</template>
