<script setup lang="ts">
interface Props {
  msg: String;
}
const props = defineProps<Props>();
</script>

<template>
  <h1>{{ props.msg }}</h1>
  <p>Bank.vue</p>
</template>