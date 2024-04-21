<template>
    <div class="border border-accent bg-secondary rounded-xl shadow-md">
    <div class="m-3 mx-4 flex justify-between items-center">
        <div class="text-xl font-bold">Workspaces</div>
        <button @click="toggleCreateWorkspacePopup()" class="py-2 px-4 w-[200px] rounded-xl bg-primary cursor-pointer text-center text-sm font-medium shadow-md">
                Create Workspace
        </button>
    </div>
    <div class="relative">
        <CreateWorkspacePopup :showCreateWorkspacePopup="showCreateWorkspacePopup" :toggleCreateWorkspacePopup="toggleCreateWorkspacePopup" />
        <div  class="p-4 h-[400px] grid grid-cols-3 grid-rows-2 gap-4">
            <div v-for="workspace in workspace_list"  @dblclick="openWorkspace(workspace.id)" class=" relative border hover:bg-primary h-[150px] rounded-xl text-center cursor-pointer font-bold text-[30px] shadow-lg bg-accent">
            <!-- <div v-for="workspace in [1,2]"  @dblclick="openWorkspace(workspace.toString())" class="bg-primary border hover:bg-primary h-[150px] rounded-xl text-center cursor-pointer shadow-md"> -->

                <div>  {{ workspace?.name   }}</div>
               
                <div @click="deleteWorkspace(workspace.id)" class="absolute right-2 bottom-2">
                    <img src="@/components/icons/DeleteIcon.svg" alt="Delete Workspace">
                </div>


            </div>
            
        </div>
    </div>
    </div>
</template>

<script setup lang="ts" >

import useChromeTabs from '@/stores/useChromeTabsStore';
import CreateWorkspacePopup from './CreateWorkspacePopup.vue';
import type { Tab } from '@/types';
import { onMounted, ref } from 'vue';
import useWorkspace from '@/stores/useWorkspaceStore';
import workspace_api  from '@/api/workspace_api';
import { useRouter } from 'vue-router';


const showCreateWorkspacePopup = ref<boolean>(false)

const toggleCreateWorkspacePopup = () => {
    showCreateWorkspacePopup.value = !showCreateWorkspacePopup.value
}



const router = useRouter();
const openWorkspace = (id:string) => {
    console.log(`Open Workspace ${id}`)
    router.push(`/workspace/${id}`)
}


const {workspace_list} = useWorkspace();

onMounted(() => {
    console.log(`Workspaces Grid was mounted`)
    // Download workspaces and init store
    workspace_api.getAllWorkspaces()
});

const deleteWorkspace = (id:string) => {
    console.log(`Delete Workspace ${id}`)
    workspace_api.deleteWorkspace(id)
}




</script>