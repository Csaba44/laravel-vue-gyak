<script setup>
import { ref } from "vue";
import ModifyBasket from "../components/ModifyBasket.vue";
import ConfirmOrderDetails from "../components/ConfirmOrderDetails.vue";

const currStage = ref("ModifyBasket");
</script>

<template>
  <div class="p-5">
    <h1 class="text-2xl font-medium">Vásárlás végelegesítése</h1>

    <ModifyBasket v-if="currStage === 'ModifyBasket'" @next-stage="currStage = 'ConfirmOrderDetails'" />
    <ConfirmOrderDetails v-else-if="currStage === 'ConfirmOrderDetails'" @next-stage="currStage = 'OrderSuccess'" />
    <h1 v-if="currStage === 'OrderSuccess'" class="text-2xl font-bold w-full text-center">Köszönjük! Sikeres rendelés.</h1>
</div>
</template>
