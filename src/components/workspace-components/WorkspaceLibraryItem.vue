<template>

                    <tr ref="row" >
                        <td  v-if="document_!=null" class=" border-b border-gray-200 bg-white text-xs sticky left-0 z-20  ">
                            <div class="flex items-center border-r-2">
                                <div class="mx-3">
                                    <p class="text-gray-900 font-medium whitespace-no-wrap truncate hover:underline cursor-pointer">
                                       <input @change="toggleCheckbox(document_._id)" v-model="document_.checked" class="" type="checkbox" name="" id="">
                                    </p>
                                </div>
                            </div>
                        </td>

                        <td  v-if="document_!=null" class="group border-b border-gray-200 bg-white text-xs sticky left-8 z-20  ">
                            <div class="relative flex items-center border-r-2 w-full">
                                <div class="mx-3 w-full">
                                    <p
                                     v-if="document_.edit_title==false"
                                     @click="goToDoc(document_)" class="text-gray-900 py-2 font-medium whitespace-no-wrap truncate hover:underline cursor-pointer">
                                        {{ document_.title }}
                                    </p>
                                    <input
                                        v-show="document_.edit_title==true"
                                        v-model="document_.title"
                                        @keyup.enter="updateColumn('title')"
                                     class="titleInput text-gray-900 w-full py-2 font-medium whitespace-no-wrap truncate " type="text" >

                                </div>

                            <span @click="toggleEditor('edit_title')" class="absolute right-0 hidden group-hover:inline-block m-1 px-2  font-semibold text-blue-900 leading-tight cursor-pointer">
                                <!-- <span aria-hidden class="absolute inset-0 bg-blue-200 opacity-50 rounded-md"></span> -->
                                <span class="relative">
                                    <img src="../icons/EditIcon.svg" alt="Open" class="w-6 h-6 inline-block mb-[1px] " />
                                </span>
                            </span>


                            </div>
                        </td>
                        <td  v-if="document_!=null" class=" px-5  border-b border-gray-200 bg-white text-xs">
                            <p class="text-gray-500 whitespace-no-wrap whitespace-nowrap">
                                {{ document_.publication_date }}
                            </p>
                        </td>

                     
                        <td @click.self="toggleEditor('edit_tags')"  v-if="document_!=null" class="relative px-5 border-b border-gray-200 bg-white whitespace-nowrap text-xs">
                           
                            <MultipleSelectTags  v-if="document_.edit_tags==true" 
                                :selectedTags="document_.tags"
                                :doc_id="document_._id"
                                @closeEditor="toggleEditor('edit_tags')"
                                @addTag="addTag"
                                @removeTag="removeTag"
                            />
                            
                            <Tag @tag-clicked="toggleEditor('edit_tags')" 
                                    v-for="tag in document_.tags" 
                                    :tag="tag"
                                    :close-button="false"
                                    />

                          
                           
                        </td>



                            <td  v-if="document_!=null" class="px-5  border-b border-gray-200 bg-white whitespace-nowrap sticky right-0 text-xs">
                            
                            <!-- <span class="relative hidden group-hover:inline-block m-1 px-2  font-semibold text-blue-900 leading-tight cursor-pointer">
                                <span aria-hidden class="absolute inset-0 bg-blue-200 opacity-50 rounded-md"></span>
                                <span class="relative">
                                    <img src="../icons/EditIcon.svg" alt="Open" class="w-6 h-6 inline-block mb-[1px] " />
                                </span>
                            </span> -->
                           
                            </td>

                        </tr>


</template>


<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue'
import {useRouter} from 'vue-router'
import MultipleSelectTags from "../global-library/MultipleSelectTags.vue"
import Tag from "../global/Tag.vue"
import papers_api from "@/api/library_api"
import {toast} from "vue-sonner"
import type { Paper } from '@/types'



const { doc } = defineProps<{
    doc: Paper
}>();

const emit = defineEmits(['checkboxToggled'])

const document_ = ref<any>()

const row = ref<any>(null)

const previousColumnValue = ref<any>(null)

const router = useRouter()

const checkboxActive = ref<boolean>(false)


onMounted(() => {
    document_.value = doc;
    console.log("Document_", document_.value)

    document_.value.edit_workspaces = false;
    document_.value.edit_tags = false;
    document_.value.edit_authors = false;
    document_.value.edit_title = false;
    document_.value.edit_publication_date = false;

});






const goToDoc = (doc: any) => {
    router.push(`/viewer/${doc._id}`)
}

const toggleEditor = (column:string) => {
    document_.value[column] = !document_.value[column];
    console.log("Toggling Editor", column, document_.value[column])

  
        // Wait for next tick to focus
        setTimeout(() => {
            if(column == "edit_title"){
                const titleInput = row.value.querySelector(".titleInput")
                titleInput.focus()
                previousColumnValue.value = document_.value.title
            }
        }, 0)
   
}


// Checkboxes
const toggleCheckbox = (id:string) => {
   
        emit("checkboxToggled", id)
}


// TAGS
const addTag = (tag: string) => {
    console.log("Adding Tag", tag)
    // check if tag already exists
    if (document_.value.tags.includes(tag)) {
        return;
    }
    document_.value.tags.push(tag)
    console.log("Added Tags", document_.value.tags)
}

const removeTag = (tag: string) => {
    document_.value.tags = document_.value.tags.filter((t: string) => t != tag)
}

// Update Paper data
const updateColumn = (column: string) => {
    console.log("Updating Column", column);
    

    papers_api.updateDocumentMetadata(document_.value._id, { [column]: document_.value[column] }).then((res: any) => {
        console.log("Updated Column", column, res);
        toast.success(`Updated ${column}`)
        toggleEditor("edit_" + column);
    }).catch((err: any) => {

        console.log("Error Updating Column", column, err);
        toast.error(`Error Updating ${column}`)
        document_.value[column] = previousColumnValue.value;
        toggleEditor("edit_" + column);
    })

}


</script>


