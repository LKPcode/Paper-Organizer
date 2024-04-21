<template>
    <div>
      
        <div @click.self="toggleUploadPapersPopup()" v-if="showUploadPapersPopup==true" 
            class="absolute z-50 rounded-xl rounded-t-none h-full w-full bg-gray-300/10 backdrop-blur-sm">
         

        <div v-if="showUploadPapersPopup==true" class="absolute z-50  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%]  ">
        
        <div  class="relative h-full flex flex-col   ml-2  p-4 bg-primary border rounded-xl  shadow-2xl">
            <button @click="toggleUploadPapersPopup()" class="absolute bg-gray-500 rounded-full  w-4 h-4 top-4 right-4"></button>
            <div class="mb-2 text-center uppercase font-medium text-sm">Upload Papers</div>
            
            <!-- <label class="flex justify-center items-center grow border-gray-300
             border-4 rounded-xl border-dashed ">
                <div class="text-center text-gray-400">
                    <div class="">Drag and Drop files</div>
                    <div>or</div>
                    <label for="file_upload" class="py-1 px-4 mt-1 bg-blue-400 hover:bg-blue-500 text-white rounded-xl">Select Files</label>
                </div>
                <input type="file" name="file_upload" class="hidden">
            </label> -->
            <FileUploader @uploaded="toggleUploadPapersPopup()" />



        </div>
    </div>
</div>


</div>
</template>


<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue'
import FileUploader from './FileUploader.vue';



onMounted(() => {
    console.log(`Upload Papers Popup was mounted`)
  
})

const emit = defineEmits(['uploaded'])


const { showUploadPapersPopup} = defineProps({
    showUploadPapersPopup: {
        type: Boolean,
        required: true
    }
})

const toggleUploadPapersPopup = () => {
    console.log(`toggleUploadPapersPopup`)
    emit('uploaded')
}

</script>