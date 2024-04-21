<template>
    <div id="listeners">
        <file-pond name="test" ref="filepond" label-idle="Drop or Select Papers" v-bind:allow-multiple="true"
            accepted-file-types="application/pdf" />
    </div>

    <button class="py-2 px-4 mt-2 rounded-xl bg-accent cursor-pointer text-center text-sm font-medium shadow-sm border"
        @click="uploadFiles()">
        <div v-if="uploading" class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
                class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <div v-else >Upload Papers</div>
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import type { Ref } from 'vue';
import papers_api from '../../api/library_api';
import { toast } from 'vue-sonner'
import {supabase} from '@/api/supabase_client';


const emit = defineEmits(["uploaded"]);

const files = ref<File[]>([]);

const filepond = ref<any>();

const uploading  = ref<boolean>(false);

// Import Vue FilePond
import vueFilePond from "vue-filepond";

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';


// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Create components
const FilePond: any = vueFilePond(FilePondPluginFileValidateType);

// console log files when they are added
onMounted(() => {
    console.log("FilePond Mounted for Workspace", filepond.value)

    let listeners = document.getElementById('listeners');


    listeners!.addEventListener('FilePond:addfile', (e) => {
        console.log('addfile');
        files.value = filepond.value.getFiles().map((file: any) => {
            return file.file
        });
    })
    // Listen on remove file
    listeners!.addEventListener('FilePond:removefile', (e) => {
        console.log('removefile');
        files.value = filepond.value.getFiles().map((file: any) => {
            return file.file
        });
    })
})


const uploadFiles = () => {
    uploading.value = true;
    console.log('uploadFiles');


    files.value.forEach( async (file: any) => {

        console.log('uploading file', file);

        const fileName = `${file.name}_(${Date.now()}).pdf`

         supabase
                .storage
                .from('documents')
                .upload(fileName , file)
                .then(({ data, error }) => {
                    if (error) {
                        console.log('error', error);
                        toast.error(error.message);
                    } else {
                        console.log('data', data);
                        toast.success('File uploaded successfully!');
                        emit("uploaded");
                    }
                })
        // if (error) {
        //     console.log('error', error);
        //     toast.error(error.message);
        // } else {
        //     console.log('data', data);
        //     toast.success('File uploaded successfully!');
        // }
    })

}


</script>


<style>
.filepond--root {
    height: 300px;

}


/* use a hand cursor intead of arrow for the action buttons */
.filepond--file-action-button {
    cursor: pointer;
}

/* the text color of the drop label*/
.filepond--drop-label {
    color: #555;
}



/* bordered drop area */
.filepond--panel-root {
    background-color: #a5a5a518;
    border: 2px dashed #b6b6b6;
}
</style>