<script setup>
const props = defineProps({
  type: {
    type: String,
    validator: (value) => {
      return ["warning", "success", "error"].includes(value);
    },
    required: true,
  },
  class: {
    type: String,
    required: false,
    default: '',
  }
});

let divClass = "";
let circleClass = "";

switch (props.type) {
  case "error":
    divClass = "bg-red-500";
    circleClass = "bg-red-400";
    break;
  case "warning":
    divClass = "bg-amber-500";
    circleClass = "bg-amber-300";
    break;
  case "success":
    divClass = "bg-green-600";
    circleClass = "bg-green-300";
    break;
  default:
    divClass = "bg-red-500";
    circleClass = "bg-red-400";
    break;
}
</script>

<template>
  <div :class="'flex items-center p-2 text-slate-900 font-medium rounded-md' + ' ' + divClass + ' ' + props.class">
    <div :class="'rounded-full w-8 h-8 flex justify-center items-center text-black font-bold' + ' ' + circleClass">!</div>
    <span class="ml-2"><slot></slot></span>
  </div>
</template>
