<script setup lang="ts">
import {content} from '../../public/Bank'

interface Props {
  msg: String;
}
const props = defineProps<Props>();
</script>

<template>
  <h1>{{ props.msg }}</h1>
  <p>Bank.vue</p>
  <p>{{ content }}</p>
</template>