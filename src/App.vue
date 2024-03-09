<script setup lang="ts">
import Button from './components/Button.vue';
</script>

<template>
  <div class="app root">
    <Button :sticky="['top', 'left']">Click me!</Button>
  </div>
</template>

<style>
.app.root {
  height: 100%;
  background-color: greenyellow;
}
</style>
