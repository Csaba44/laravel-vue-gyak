<script setup>
const model = defineModel();

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  type: {
    type: String,
    required: false,
    default: "text",
  },
  class: {
    type: String,
    required: false,
    default: '',
  }
});
</script>

<template>
  <div :class="'flex items-center gap-3' + ' ' + props.class">
    <label class="w-20 text-left" :for="props.name">{{ props.label }}</label>
    <input v-model="model" class="bg-gray-300 placeholder-gray-600 p-1 rounded-md outline-none" :type="props.type" :name="props.name" :placeholder="props.placeholder" />
  </div>
</template>
