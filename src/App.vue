<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'

</script>

<template>
  <RouterView />
  
  <Toaster position="bottom-center" :duration="1500" closeButton richColors  />
</template>


