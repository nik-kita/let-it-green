<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/Button.vue';
import GButtonWrapper from '../components/GButtonWrapper.vue';


const mockAuth = ref(false);
const loginRes = ref<object>();

const toggleMockAuth = () => {
  mockAuth.value = !mockAuth.value;
};

const handleCredentials = async (res: unknown) => {
  console.log('LoginPage.vue');
  console.log(res);

  await fetch('http://localhost:3000/api/login', {
    method: 'post',
    body: JSON.stringify(res),
  }).then((data) => data.json());


};

</script>

<template>
  <Button @click="toggleMockAuth">{{ mockAuth ? 'Set Login = true' : 'Set Login = false' }}</Button>
  <GButtonWrapper @emit-credentials="handleCredentials" v-if="mockAuth" />
  <pre v-if="loginRes">{{ loginRes }}</pre>
</template>