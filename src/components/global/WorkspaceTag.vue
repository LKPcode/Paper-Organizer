<template>
    <span v-if="workspace!=null"
        @click="goToWorkspace(workspace)"
        class="relative group cursor-pointer inline-block m-1 ml-0 px-3 py-1 font-semibold text-slate-800  leading-tight"
        >
        <span @click.self="workspaceClicked(workspace)" aria-hidden class="absolute group-hover:opacity-80 inset-0 opacity-50 rounded-md"
            :style="{ backgroundColor: workspaceColor(workspace) }"
        ></span>
        <span  @click.self="workspaceClicked(workspace)" class="relative flex items-center">
            {{ workspace.name }}
            <img  v-if="closeButton==true" @click="removeWorkspace(workspace)" class="ml-1 w-3 h-3 rounded-full hover:bg-gray-500/25 cursor-pointer" src="../icons/XIcon.svg" alt="">
        </span>
    </span>


    <span v-else
        class="relative cursor-pointer inline-block m-1 ml-0 px-3 py-1 font-semibold text-slate-800  leading-tight"
        >
        <span aria-hidden class="absolute inset-0 opacity-50 rounded-md"
            :style="{ backgroundColor: workspaceColor(null) }"
        ></span>
        <span   class="relative flex items-center">
            No Workspace
            <img  v-if="closeButton==true"  class="ml-1 w-3 h-3 rounded-full hover:bg-gray-500/25 cursor-pointer" src="../icons/XIcon.svg" alt="">
        </span>
    </span>

</template>

<script setup lang="ts">
import {  defineEmits } from 'vue'
import type { Workspace } from '@/types';
import { useRouter } from 'vue-router';

const router = useRouter()
const goToWorkspace = (workspace: Workspace) => {
    router.push(`/workspace/${workspace.id}`)
}

let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const { workspace } = defineProps<{
    workspace: Workspace|null,
    closeButton: boolean
}>();

const emits = defineEmits(['removeWorkspace', 'workspaceClicked'])

const removeWorkspace = (workspace: Workspace) => {
    emits('removeWorkspace', workspace)
}

const workspaceClicked = (workspace: Workspace) => {
    emits('workspaceClicked', workspace)
}

const workspaceColor = (workspace:Workspace|null) => {
    if(workspace==null) return "#ccc";
    // Calculate hash code
    let hash = 0;
    for (let i = 0; i < workspace.name.length; i++) {
        hash = workspace.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Calculate color
    let index = Math.abs(hash % colors.length);
    return colors[index];
}

</script>