<script setup lang="ts">
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login';


const callback: CallbackTypes.CredentialCallback = (response) => {
  console.log(response);
};

</script>

<template>
  <GoogleLogin :callback />
</template>
