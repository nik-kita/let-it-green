<script setup lang="ts">
import { RouterView } from 'vue-router';
import Button from './components/Button.vue';
import Placeholder from './components/Placeholder.vue';


</script>

<template>
  <div class="app root">
    <RouterView />
    <Placeholder height="20px" width="100px">
      <Button>
        <RouterLink to="/login">Login</RouterLink>
      </Button>
    </Placeholder>
  </div>
</template>

<style>
.app.root {
  height: 100%;
}
</style>
