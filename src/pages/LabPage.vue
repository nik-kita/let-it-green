<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/Button.vue';
import GButtonWrapper from '../components/GButtonWrapper.vue';
import Placeholder from '../components/Placeholder.vue';

const mockAuth = ref(false);
const loginRes = ref<object>();
const googleRes = ref({
  clientId: '',
  credential: '',
  select_by: '',
})
const toggleMockAuth = () => {
  mockAuth.value = !mockAuth.value;
};
const handleCredentials = async (res: unknown) => {
  googleRes.value = res as any;
};
const makeLoginApiReq = async () => {
  try {
    const data = await fetch('http://localhost:3000/api/sign-in', {
      method: 'post',
      body: JSON.stringify(googleRes.value),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(data);
    if (!data.ok) {
      loginRes.value = { error: 'Error in API call', data: JSON.parse(JSON.stringify(data)) };
      return;
    }
    const jData = await data.json();
    loginRes.value = jData;
  } catch (e) {
    loginRes.value = { error: String(e) };
  }
}
const hello = ref('...');
const hello_world_api = async () => {
  const res = await fetch('http://localhost:3000');
  console.log(res);
  hello.value = await res.text();
}
</script>

<template>
  <Placeholder height="100px">
    <GButtonWrapper @emit-credentials="handleCredentials" v-if="mockAuth" />
  </Placeholder>
  <hr />
  <Button @click="toggleMockAuth">{{ mockAuth ? 'Set Login = true' : 'Set Login = false' }}</Button>
  <hr />
  <form class="form">
    <label>
      <span>clientId</span>
      <input type="text" placeholder="clientId" v-model="googleRes.clientId" />
    </label>
    <label>
      <span>credential</span>
      <input type="text" placeholder="credential" v-model="googleRes.credential" />
    </label>
    <label>
      <span>select_by</span>
      <input type="text" placeholder="select_by" v-model="googleRes.select_by" />
    </label>
  </form>
  <Placeholder height="50px">
    <Button @click="makeLoginApiReq" v-show="Object.values(googleRes).reduce((a, b) => a + b).length">Make API call with
      credentials
      above</Button>
  </Placeholder>
  <Placeholder height="50px">
    <Button @click="hello_world_api">
      hello world
    </Button>
  </Placeholder>
  <pre>{{ hello }}</pre>
  <pre v-if="loginRes">{{ loginRes }}</pre>
</template>

<style>
.form {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.form label input {
  width: 100%;
}

.form label {
  width: 80%;
  font-weight: lighter;
  font-style: italic;
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
}
</style>
