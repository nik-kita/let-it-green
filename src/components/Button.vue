<script setup lang="ts">
import { computed, withDefaults } from 'vue';

const props = withDefaults(defineProps<{
  sticky?: ('left' | 'right' | 'top' | 'bottom')[];
  disabled?: boolean;
}>(), {});
const clazz = computed(() => {
  return [
    props.sticky?.map((position) => `sticky-${position}`),
  ];
});
</script>
<template>
  <button class="btn" :class="clazz">
    <slot></slot>
  </button>
</template>

<style>
.btn {
  cursor: pointer;
}

.btn.sticky-top {
  position: sticky;
  top: 1rem;
}

.btn.sticky-bottom {
  position: sticky;
  bottom: 1rem;
}

.btn.sticky-left {
  position: sticky;
  left: 1rem;
}

.btn.sticky-right {
  position: sticky;
  right: 1rem;
}
</style>
