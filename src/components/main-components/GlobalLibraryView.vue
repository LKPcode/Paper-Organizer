<template>

    
    <div class="relative   h-full w-full p-4 box-border flex flex-col">
        
        <UploadPapersPopup class="z-50" @uploaded="documentsUploaded()" :showUploadPapersPopup="showUploadPapersPopup" />

        

        <div class="mb-2 flex justify-between items-center">

            <div>
                <div class="text-xl font-bold">Library</div>
            </div>

            <div class="flex items-center">

                <SelectDropdown  v-if="documents_ids_selected_checkboxs.length!=0"
                 class="mr-4" kind="Workspaces" @change="addPapersToWorkspace" :options="workspace_list" :add_all="false" :key="workspace_list"/>
               

                <!-- Delete Selected Papers -->
                <button v-if="documents_ids_selected_checkboxs.length!=0" @click="deleteSelectedPapers"  type="button" class="mr-4 inline-flex items-center gap-x-1.5 rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <img class="" src="../icons/XIcon.svg" alt="Delete Selected Papers">
                        Delete Selected
                </button>

                <!-- <button  @click="toggleUploadPapersPopup" type="button" class="inline-flex items-center gap-x-1.5 rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <img class="" src="../icons/UploadIcon.svg" alt="Upload Papers">
                    Delete Selected
                </button> -->




                <SelectDropdown class="mr-4" kind="Tags" @change="selectTagToSortBy" :options="all_tags.map((name, i)=>({id:i, name:name}))" :add_all="true" :key="all_tags"/>

                <SelectDropdown class="mr-4" kind="Workspaces" @change="selectWorkspaceToSortBy" :options="workspace_list" :add_all="true" :key="workspace_list"/>


             
                <div class="mr-4">

                    <div class="relative rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                        <img src="../icons/SearchIcon.svg" class="absolute left-2 w-8 h-8 mr-2" alt="">  
                    </div>
                    <input  v-model="search" type="text" name="search"  class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Search Title" />
                    </div>
                </div>

               

                <button @click="toggleUploadPapersPopup" type="button" class="inline-flex items-center gap-x-1.5 rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <img class="" src="../icons/UploadIcon.svg" alt="Upload Papers">
                        Upload
                </button>


            </div>
        </div>

        <div class="relative rounded-xl mt-2 inline-block grow w-full overflow-auto">

            <!-- <div class="sticky top-0 bg-black h-full w-full z-50"></div> -->


                <div v-if="global_library.length == 0" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
                                       <input v-model="globalChecked" @click="globalCheckboxChanged" type="checkbox" name=""
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
                        class=" px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Workspaces
                    </th>
                    <th
                            class="max-w-[300px] px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Authors
                        </th>
                        <th
                            class=" px-5 py-3 border-b-2 border-gray-200  text-left text-xs  bg-white font-semibold text-gray-600 uppercase tracking-wider sticky right-0 z-40">
                           ACTION
                        </th>
                    </tr>
                </thead>
                <tbody >

                       <LibraryItem 
                                    v-for="doc in filteredLibrary" 
                                    :key="doc.id"
                                    :doc="doc" 
                                    :checked="globalChecked"
                                    @checkboxActive="checkboxActivated"
                                    @checkboxInactive="checkboxDeactivated"
                                    />


                </tbody>
            </table>

        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import LibraryItem from '../global-library/LibraryItem.vue';
import UploadPapersPopup from '../global-library/UploadPapersPopup.vue';
import workspace_api from '@/api/workspace_api';
import library_api from '../../api/library_api';

import useLibraryStore from '@/stores/useLibraryStore';
import useTagStore from '@/stores/useTagsStore';
import useWorkspaceStore from '@/stores/useWorkspaceStore';

import type { Workspace } from '@/types';
import { toast } from 'vue-sonner';
import paper_api from '@/api/paper_api';
import SelectDropdown from '../global/SelectDropdown.vue';



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

// Get the global library, all tags and all workspaces
const {global_library} = useLibraryStore();
const {all_tags} = useTagStore();
const {workspace_list} = useWorkspaceStore();
onMounted(async () => {
    await library_api.getAllPapers();
    await library_api.getAllTags();

    await workspace_api.getAllWorkspaces();

})

// filtering logic, computed property
let filteredLibrary = computed(() => {
    let filteredLibrary_ = global_library.value;

    // Filter by workspace
    if (selectedWorkspace.value === "All Workspaces") {
        filteredLibrary_ = global_library.value;
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
}


// Listens to checkbox events from LibraryItem component and updates the list of documents ids that are selected
const checkboxActivated = (doc_id:string) => {
        documents_ids_selected_checkboxs.value.push(doc_id);
        console.log("Checkbox Activated", doc_id);
}
const checkboxDeactivated = (doc_id:string) => {
    documents_ids_selected_checkboxs.value = documents_ids_selected_checkboxs.value.filter((id) => id !== doc_id);
}


// const globalCheckboxChanged = () => {
//     console.log("Global Checkbox Changed");
//     globalChecked.value = !globalChecked.value;
// }

const deleteSelectedPapers = async () => {
    documents_ids_selected_checkboxs.value.forEach(async (doc_id) => {
        paper_api.deletePaper(doc_id);
    })
}

const addPapersToWorkspace = (value:{id:string, name:string}) => {
    console.log("Add Papers To Workspace");
    documents_ids_selected_checkboxs.value.forEach(async (paper_id) => {
        await paper_api.addPaperToWorkspace( value.id ,paper_id);
    })
}

const selectWorkspaceToSortBy = (value:{id:number, name:string}) => {
    selectedWorkspace.value = value.name;
}

const selectTagToSortBy = (value:{id:number, name:string}) => {
    selectedTag.value = value.name;
}



</script>