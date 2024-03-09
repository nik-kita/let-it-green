<script setup lang="ts">
import { ref } from 'vue';
import Button from './components/Button.vue';

const apiLabRes = ref<object>();

const fetchData = async () => {
  const response = await fetch('http://localhost:3000/api/lab', { method: 'post' });
  apiLabRes.value = await response.json();
};
</script>

<template>
  <div class="app root">
    <Button @click="fetchData">Click me!</Button>
    <pre>{{ apiLabRes }}</pre>
  </div>
</template>

<style>
.app.root {
  height: 100%;
}
</style>
