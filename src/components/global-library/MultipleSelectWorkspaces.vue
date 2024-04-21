<template>
    <div ref="editor" class="absolute left-0 top-0 min-w-[200px] w-[120%]  bg-primary z-40 shadow-xl border border-slate-400  ">
        <div class=" border-b pb-[3px] px-2 h-[35px]">
            <WorkspaceTag 
                    v-for="workspace in selected_workspaces"
                    :key="workspace.name"
                    :workspace="workspace" 
                    :close-button="true"  
                    @removeTag="removeTag"
                    />
        </div>

        
        
        <div class="px-2 flex flex-wrap">
            <WorkspaceTag 
            v-for="workspace in all_workspaces" 
            :workspace="workspace" 
            :close-button="false"  
            @removeTag="deleteTag"
            @tagClicked="addTag"
            />
        </div>
        
        
        <div class="w-full box-border">
            <input v-model="new_workspace"  @keyup.enter="createTag(new_workspace)" class="w-full p-2 bg-slate-100" type="text" placeholder="Create Workspace">
        </div>

    </div>
</template>

<script setup lang="ts" >
import { ref, defineEmits, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import WorkspaceTag from '../global/WorkspaceTag.vue'
import type { Workspace } from '@/types'
import papers_api from '@/api/library_api'
import useLibraryStore from '@/stores/useLibraryStore'


const emits = defineEmits(['addWorkspace', 'removeWorkspace', "closeEditor"])

const props = defineProps<{
    selectedWorkspaces: Workspace[],
    doc_id: string 
}>();

const selected_workspaces = ref<Workspace[]>([])

const all_workspaces = ref<Workspace[]>([])


const libraryStore = useLibraryStore()
onMounted(() => {
    console.log("mounted")
    selected_workspaces.value = props.selectedWorkspaces

    // all_workspaces.value = libraryStore.getAllTags()

    // remove selected tags from all tags
    all_workspaces.value = all_workspaces.value.filter((t) => !selected_workspaces.value.includes(t))    

})

const new_workspace = ref('')

const editor = ref(null)


const addTag = (workspace:any) => {
    // remove from all_workspaces
    all_workspaces.value = all_workspaces.value.filter((w:any) => w._id != workspace._id)
    selected_workspaces.value.push(workspace)
    emits('addWorkspace', workspace)
    // papers_api.updateTagsOfPaper(props.doc_id as string, {
    //     add: [tag],
    //     remove: []
    // })
}

// remove tag from selected tags
const removeTag = (workspace: any) => {
    // add to all_workspaces
    all_workspaces.value.push(workspace)
    all_workspaces.value.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    selected_workspaces.value = selected_workspaces.value.filter((w:any) => w._id != workspace._id)
    emits('removeWorkspace', workspace)
    // papers_api.updateTagsOfPaper(props.doc_id as string, {
    //     add: [],
    //     remove: [tag]
    // })
}


// // Create a new tag and add it to selected tags
// const createWorkspace = (workspace:Workspace) => {
//     // check if tag name is empty
//     if(workspace.name == '') return
//     selected_workspaces.value.push(workspace)
//     new_workspace.value = ''
//     emits('addTag', tag)
//     papers_api.updateTagsOfPaper(props.doc_id as string, {
//         add: [tag],
//         remove: []
//     })
//     libraryStore.addTag(tag)
//     all_workspaces.value.push(tag)
// }

// Delete a tag from all tags
const deleteTag = (workspace:any) => {
    all_workspaces.value = all_workspaces.value.filter((w:any) => w._id != workspace._id)
}

// When clicked outside the editor, close it
onClickOutside(editor, (event) => {
    console.log(event)
    emits('closeEditor')
})




</script>