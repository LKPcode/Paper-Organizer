<template>
    <div class="">
       

        <div v-if="showCreateWorkspacePopup==true" class="absolute z-10 rounded-xl rounded-t-none h-full w-full bg-gray-300/10 backdrop-blur-sm"></div>
        <div v-if="showCreateWorkspacePopup==true" class="absolute z-10  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        
        <div  class="relative ml-2  p-4 bg-primary border rounded-xl w-[400px] shadow-2xl">
            <button @click="toggleCreateWorkspacePopup()" class="absolute bg-gray-500 rounded-full  w-4 h-4 top-4 right-4"></button>
            <div class="mb-2 text-center uppercase font-medium text-sm">Create Workspace</div>
            <div class="mb-2">
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                <div class="relative mt-1 rounded-md shadow-sm">
                    <input v-model="new_workspace.name" type="text" name="name" id="price" class="block outline-none w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Name">
                </div>
            </div>
            <div  class="mb-4">
                <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <div class="relative mt-1 rounded-md shadow-sm">
                    <input v-model="new_workspace.description" type="text" name="description" id="price" class="block outline-none w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Description">
                </div>
            </div>

            <button @click="createWorkspace" class="py-2 px-4 w-full rounded-xl text-center bg-accent hover:bg-blue-400 cursor-pointer text-sm font-medium" >Create</button>

        </div>
    </div>

</div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import workspace_api from '@/api/workspace_api';
import useWorkspace from '@/stores/useWorkspaceStore';
import type { CreateWorkspace } from '@/types';

const {toggleCreateWorkspacePopup, showCreateWorkspacePopup} = defineProps({
    toggleCreateWorkspacePopup: {
        type: Function,
        required: true
    },
    showCreateWorkspacePopup: {
        type: Boolean,
        required: true
    }
})

const new_workspace = ref({
    name: "",
    description: ""
})

const workspace_store = useWorkspace();
const createWorkspace = () => {
    console.log(`Create Workspace`)
    workspace_api.createWorkspace(new_workspace.value)
    .then((data) => {
        console.log(`Created Workspace`, data)
        toggleCreateWorkspacePopup();
    }).catch((err) => {
        console.log(`Error creating workspace`, err)
        // alert(err.message)
    })


}

</script>