<template>

    
    <div class="relative   h-full w-full p-4 box-border flex flex-col">
        
        <UploadPapersPopup class="z-50" @uploaded="documentsUploaded()" :showUploadPapersPopup="showUploadPapersPopup" />
   

        <div class="mb-2 flex justify-between items-center">



            <div>
                <div class="text-xl font-bold">{{ workspace?.name }}</div>

            </div>

            <div class="flex items-center">

                <!-- Remove Selected Papers -->
                <div v-if="documents_ids_selected_checkboxs.length!=0" @click="removeSelectedPapers" class="flex items-center ml-2 px-2 py-1 rounded-xl  bg-secondary/70 cursor-pointer">
                    <img class="mr-2 w-4 h-4" src="../icons/XIcon.svg" alt="Remove Selected Papers">
                    <span class="text-sm">Remove</span>
                </div>




                <div class="mx-2">
                    <select v-model="selectedTag" class="bg-primary border border-gray-300 rounded-xl px-2 py-2 text-xs">
                        <option value="All Tags">All Tags</option>
                        <option v-for="tag in all_tags" :value="tag">{{ tag }}</option>

                    </select>
                </div>


               <!-- Search Bar  -->
                <div class="flex items-center relative"> 
                    <img src="../icons/SearchIcon.svg" class="absolute left-2 w-5 h-5 mr-2" alt="">  
                    <input v-model="search" type="text" class="w-64 bg-secondary px-4 pl-8 py-2 text-xs text-gray-600  rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50" placeholder="Search by Title">
                </div>

                <!-- Upload Papers -->
                <div @click="toggleUploadPapersPopup" class="flex items-center ml-2 px-2 py-1 rounded-xl  bg-blue-300 cursor-pointer">
                    <img class="" src="../icons/UploadIcon.svg" alt="Upload Papers">
                    <span class="text-sm"></span>
                </div>

                 <!-- Add Papers -->
                 <div @click="goTo('/library/0 ')" class="flex items-center ml-2 px-2 py-1 rounded-xl  bg-blue-300 cursor-pointer">
                    <img class="" src="../icons/AdditionIcon.svg" alt="Add Papers to Workspace">
                    <span class="text-sm"></span>
                </div>


            </div>
        </div>

        <div class="relative rounded-xl inline-block grow w-full overflow-auto">

            <!-- <div class="sticky top-0 bg-black h-full w-full z-50"></div> -->


                <div v-if="library.length == 0" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <!-- Upload Papers -->
                    <button @click="toggleUploadPapersPopup" class="underline text-slate-400">Upload Papers</button>
                </div>
                <div v-else-if="filteredLibrary.length == 0" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <!-- Upload Papers -->
                    <button @click="toggleUploadPapersPopup" class="underline text-slate-400">
                        No papers found with that filter.
                    </button>
                </div>

            <table class="relative leading-normal w-full">

             

                <thead class="sticky top-0 bg-white rounded-xl z-30">
                    <tr>
                        <th
                            class="px-3.5 py-3 border-b-2 border-gray-200  bg-white text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky left-0 z-40">
                            
                                    <p class="text-gray-900 font-medium whitespace-no-wrap  hover:underline cursor-pointer">
                                       <input v-model="globalChecked" @change="globalCheckboxChanged" type="checkbox" name=""
                                          class="" >
                                    </p>
                               
                        </th>
                        <th
                            class="min-w-[400px] px-5 py-3 border-b-2 border-gray-200  bg-white text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky left-8 z-40">
                            Title
                        </th>
                        <th
                            class=" px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                        </th>
                        <th
                        class=" px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tags
                    </th>

                        <th
                            class=" px-5 py-3 border-b-2 border-gray-200  text-left text-xs  bg-white font-semibold text-gray-600 uppercase tracking-wider sticky right-0 z-40">
                           ACTION
                        </th>
                    </tr>
                </thead>
                <tbody >

                       <WorkspaceLibraryItem @checkboxToggled="checkboxToggled"
                                    v-for="doc in filteredLibrary" 
                                    :key="doc._id"
                                    :doc="doc"  />


                </tbody>
            </table>

        </div>

       
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import WorkspaceLibraryItem from './WorkspaceLibraryItem.vue';
import UploadPapersPopup from '../global-library/UploadPapersPopup.vue';
import papers_api from '../../api/library_api';
import workspace_api from '@/api/workspace_api';
import { useRouter } from 'vue-router';

import useLibraryStore from '@/stores/useLibraryStore';

import type { Workspace } from '@/types';
import { toast } from 'vue-sonner';


const props = defineProps({
    workspace_id: {
        type: String,
        required: true
    }
})

const showUploadPapersPopup = ref(false);
const toggleUploadPapersPopup = () => {
    showUploadPapersPopup.value = !showUploadPapersPopup.value;
}

const library = ref<any[]>([]);
const selectedWorkspace = ref("All Workspaces");
const selectedTag = ref("All Tags");
const globalChecked = ref(false);
const search = ref("");

// List of documents ids that are selected
const documents_ids_selected_checkboxs = ref<string[]>([]);

// List of all tags
const all_tags = ref<string[]>([]);

const workspace = ref<Workspace>();

const router = useRouter();
const goTo = (path: string) => {
    router.push(path);
}


// Get the global library, all tags and all workspaces
const libraryStore = useLibraryStore();
onMounted(async () => {
    let data = [0]//await papers_api.getWorkspaceDocLibrary(props.workspace_id);
    console.log(data);
    data = [0]
    
    library.value.forEach((doc) => {
        doc.checked = false;
    })

    workspace.value = await workspace_api.getWorkspace(props.workspace_id);


    all_tags.value = await papers_api.getAllTags();
    libraryStore.setAllTags(all_tags.value);
    console.log("All Tags",all_tags.value);


})

// filtering logic, computed property
let filteredLibrary = computed(() => {
    let filteredLibrary_ = library.value;

    // Filter by workspace
    if (selectedWorkspace.value === "All Workspaces") {
        filteredLibrary_ = library.value;
    }
    else{
        filteredLibrary_ =  filteredLibrary_.filter((doc) => {
            return doc.workspaces.map((workspace:Workspace)=>workspace.name).includes(selectedWorkspace.value);
        })
    }
    // Filter by tags
    if (selectedTag.value === "All Tags") {
        filteredLibrary_ = filteredLibrary_;
    }
    else{
        console.log(selectedTag.value, filteredLibrary_ );
        filteredLibrary_ =  filteredLibrary_.filter((doc) => {
            console.log("LOUAKS",doc.title,doc.tags, selectedTag.value,doc.tags.includes(selectedTag.value));

            return doc.tags.includes(selectedTag.value);
        })
    }
    // Filter by search
    if (search.value === "") {
        filteredLibrary_ = filteredLibrary_;
    }
    else{
        filteredLibrary_ =  filteredLibrary_.filter((doc) => {
            return doc.title.toLowerCase().includes(search.value.toLowerCase());
        })
    }

    console.log("Filtered Library",filteredLibrary_);
    return filteredLibrary_;
})

// Updates the list of documents when documents have been uploaded
const documentsUploaded = async () => {
    console.log("Documents Uploaded");
    toggleUploadPapersPopup();
    console.log("Getting Global Library");
    library.value = await  papers_api.getWorkspaceDocLibrary(props.workspace_id);
}


const checkboxToggled = (doc_id:string) => {
    console.log("Checkbox Toggled", doc_id);
    const index = documents_ids_selected_checkboxs.value.indexOf(doc_id);
    if (index === -1) {
        documents_ids_selected_checkboxs.value.push(doc_id);
    }
    else{
        documents_ids_selected_checkboxs.value.splice(index, 1);
    }
    console.log(documents_ids_selected_checkboxs.value);
}

const globalCheckboxChanged = () => {
    console.log("Global Checkbox Changed");
    if (globalChecked.value) {
        library.value.forEach((doc) => {
            doc.checked = true;
            if (!documents_ids_selected_checkboxs.value.includes(doc._id)) {
                documents_ids_selected_checkboxs.value.push(doc._id);
            }
        })
    }
    else{
        library.value.forEach((doc) => {
            doc.checked = false;
        })
        documents_ids_selected_checkboxs.value = [];
    }
}

const removeSelectedPapers = async () => {
    console.log("Remove Selected Papers");
    workspace_api.removePapersFromWorkspace(props.workspace_id, documents_ids_selected_checkboxs.value)
        .then((res) => {
        console.log(res);
        toast.success("Documents removed from workspace");
        globalChecked.value = false;
        library.value = library.value.filter((doc) => {
            return !documents_ids_selected_checkboxs.value.includes(doc._id);
        })
        documents_ids_selected_checkboxs.value = [];
    }).catch((err) => {
        console.log(err);
        toast.error("Error removing documents from workspace");
    })
   
}



</script>