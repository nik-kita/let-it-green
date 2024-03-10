<script setup lang="ts">
import { withDefaults } from 'vue';
const props = withDefaults(defineProps<{
  height?: string;
  width?: string;
  bgColor?: string;
}>(), {
  bgColor: 'grey',
  height: '200px',
  width: '100%',
});
</script>

<template>
  <div class="placeholder" :style="props">
    <slot></slot>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>