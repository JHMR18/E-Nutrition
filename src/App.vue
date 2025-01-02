<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';


</script>

<template>

    <RouterView />
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