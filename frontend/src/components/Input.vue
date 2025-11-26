<script setup>
const model = defineModel();

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
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
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  }
});
</script>

<template>
  <div :class="'flex items-center gap-3' + ' ' + props.class">
    <label v-if="props.label" class="w-20 text-left" :for="props.name">{{ props.label }}</label>
    <input :min="min ?? ''" :max="max ?? ''" :disabled="props.disabled" v-model="model" class="bg-gray-300 placeholder-gray-600 p-1 rounded-md outline-none" :type="props.type" :name="props.name" :placeholder="props.placeholder" />
  </div>
</template>
