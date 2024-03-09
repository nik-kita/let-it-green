<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/Button.vue';

const mockAuth = ref(false);

const toggleMockAuth = () => {
  mockAuth.value = !mockAuth.value;
};

</script>

<template>
  <Button @click="toggleMockAuth">{{ mockAuth ? 'Set Login = true' : 'Set Login = false' }}</Button>
</template>