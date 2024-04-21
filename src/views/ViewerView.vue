<template>

<div id="application" class="h-screen w-screen fixed bg-lighter">
      <Sidebar />
      <ChromeTabs/>

      <div class="fixed"  
        style="left:50px;top:46px;height:calc(100% - 46px);width:calc(100% - 50px);"
      >
          <MainColumn />
      </div>

  </div>
   
</template>

<script setup lang="ts">

import MainColumn from '@/components/MainColumn.vue'
import Sidebar from '../components/global/Sidebar.vue';
import ChromeTabs from '../components/global/ChromeTabs.vue';






</script>

<style scoped>



</style>