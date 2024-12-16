<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const computedproperty = computed(() => {
  const currentproperty = new Date();
  const currentproperty2 = currentproperty.getFullYear();
  const expected = new Date(currentproperty2, 11, 17); 
  return currentproperty > expected;
});
</script>

<template>
  <div v-if="!computedproperty" class="main-content">
    <RouterView />
  </div>
  <div v-else class="message">
    <h1>DEV HAS DISABLED THE APP FOR DEVELOPMENT</h1> 
  </div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column  ;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  color: red;
}
</style>