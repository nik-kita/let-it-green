<script setup lang="ts">
import { GoogleLogin } from 'vue3-google-login';
import type { Credentials } from '../../shared/gbutton-types.ts';

defineEmits<{
  emitCredentials: [res: Credentials],
}>();


</script>

<template>
  <GoogleLogin :callback="(arg: Credentials) => $emit('emitCredentials', arg)" />
</template>
