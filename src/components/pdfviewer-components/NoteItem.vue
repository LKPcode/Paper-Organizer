<template>
    <div class="relative bg-primary rounded-lg mx-4 mt-4 p-3 shadow-md hover:shadow-sm ">

       <button @click="toggleMenu()" class="absolute bottom-1 right-0 p-2 group">
           <img src="../icons/MoreIcon.svg" alt="More" class="h-4 w-4 ">

       </button>


       <div class="flex">
           <div class="flex ml-3 text-xs mr-3">
               {{ props.text }}
           </div>
       </div>

       <div class="flex  overflow-hidden transition-height duration-500 "
           :class="showMenu == true ? 'h-4 mt-2' : 'h-0'"
       >
           <button class="flex text-xs pr-2 pl-1 mr-2 font-medium hover:underline rounded-md shadow-sm bg-secondary ">
               <img src="../icons/AdditionIcon.svg" alt="Addition" class="w-4 h-4" >
               Edit
           </button>

           <button class="flex text-xs pr-2 pl-1 mr-2 font-medium hover:underline rounded-md shadow-sm bg-secondary ">
               <img src="../icons/AdditionIcon.svg" alt="Delete" class="w-4 h-4 rotate-45" >
               Delete
           </button>

        
       </div>



   </div>



</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showMenu = ref<boolean>(false)

const toggleMenu = () => {
   showMenu.value = !showMenu.value
}

const props = defineProps({
   text: {
       type: String,
       required: true
   },
   note_id: {
       type: String,
       required: true
   },
})


</script>