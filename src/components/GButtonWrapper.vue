<script setup lang="ts">
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login';


const props = defineProps<{
  callback?: CallbackTypes.CredentialCallback,
}>();
const emit = defineEmits<{
  emitCredentials: [res: Credentials],
}>();

const callback: CallbackTypes.CredentialCallback = props.callback || ((response) => {
  console.log(response);
});

</script>

<template>
  <GoogleLogin :callback />
</template>

<script lang="ts">
type Credentials = Parameters<CallbackTypes.CredentialCallback>[0];
</script>