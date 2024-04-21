<template>
                    <tr ref="row" >
                        <td  v-if="document_!=null" class=" border-b border-gray-200 bg-white text-xs sticky left-0 z-20  ">
                            <div class="flex items-center border-r-2">
                                <div class="mx-3">
                                    <p class="text-gray-900 font-medium whitespace-no-wrap truncate hover:underline cursor-pointer">
                                       <input  @change="toggleCheckbox(doc.id)"  class="" type="checkbox" name="" id="">
                                    </p>
                                </div>
                            </div>
                        </td>

                        <td   class="group border-b border-gray-200 bg-white text-xs sticky left-8 z-20  ">
                            <div class="relative flex items-center border-r-2 w-full">
                                <div class="mx-3 w-full">
                                    <p
                                     @click="goToDoc(doc.id)" class="text-gray-900 py-2 font-medium whitespace-no-wrap truncate hover:underline cursor-pointer">
                                        {{ doc.title }}
                                    </p>
                                </div>

                            </div>
                        </td>
                        <td  v-if="document_!=null" class=" px-5  border-b border-gray-200 bg-white text-xs">
                            <p class="text-gray-500 whitespace-no-wrap whitespace-nowrap">
                                {{ doc.publication_date }}
                            </p>
                        </td>

                     
                        <td  v-if="document_!=null" @click.self="toggleTagEditor()" class="relative px-5 border-b border-gray-200 bg-white whitespace-nowrap text-xs">
                           
                            <MultipleSelectTags  v-if="document_.edit_tags==true" 
                                :selectedTags="doc.tags"
                                :doc_id="doc.id"
                                @closeEditor="toggleTagEditor()"
                                @addTag="addTag"
                                @removeTag="removeTag"
                                @createTag="createTag"
                            />
                            
                            <Tag @tag-clicked="toggleTagEditor()" 
                                    v-for="tag in doc.tags" 
                                    :tag="tag"
                                    :close-button="false"
                                    />

                          
                           
                        </td>

                        <td  v-if="document_!=null" class="relative px-5  border-b border-gray-200 bg-white whitespace-nowrap text-xs">
                            
                                <WorkspaceTag
                                    v-for="workspace in doc.workspaces" 
                                    :workspace="workspace"
                                    :close-button="false"
                                    />
                            
                            <WorkspaceTag v-if="doc?.workspaces?.length==0" 
                                    :workspace="null"
                                    :close-button="false"
                                    />
                           
                        </td>
                        <td  v-if="document_!=null" class="max-w-[300px] px-5  border-b border-gray-200 bg-white text-xs">
                            <p class="text-gray-500 whitespace-no-wrap whitespace-nowrap truncate">
                                <span v-for="author in doc.authors">
                                   
                                    <a class="hover:underline" :href="'https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=' + author.name.replace(/ /g, '+') " target=”_blank”>
                                     {{ author.name }} 
                                    </a>
                                    <span>, </span>
                                </span>
                            </p>
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
import { onMounted, ref, defineEmits, watch } from 'vue'
import {useRouter} from 'vue-router'
import MultipleSelectTags from "./MultipleSelectTags.vue"
import Tag from "../global/Tag.vue"
import WorkspaceTag from '../global/WorkspaceTag.vue'
import library_api from "@/api/library_api"
import {toast} from "vue-sonner"
import type { Paper } from '@/types'





const { doc} = defineProps<{
    doc: any,
    checked: boolean
}>();

const emits = defineEmits(['checkboxActive', 'checkboxInactive'])

const document_ = ref<any>({})

const row = ref<any>(null)

const router = useRouter()



onMounted(() => {
    document_.value.checked = false;

    document_.value.edit_tags = false;

});


const goToDoc = (id: string) => {
    router.push(`/viewer/${id}`)
}

// Checkboxes
const toggleCheckbox = (id:string) => {
    document_.value.checked = !document_.value.checked;
    if (document_.value.checked == true) {
        console.log("Checkbox is true")
        emits("checkboxActive", id)
    } else {
        emits("checkboxInactive", id)

    }
}

// TAGS
const addTag = (tag: string) => {
    console.log("Adding Tag", tag)
   
    library_api.addTagToPaper(doc.id , tag).then((res: any) => {
        console.log("Added Tag", tag, res);
        toast.success(`Added ${tag}`)
    }).catch((err: any) => {
        console.log("Error Adding Tag", tag, err);
        toast.error(`Error Adding ${tag}`)
    })

}

const createTag = (tag: string) => {
    console.log("Creating Tag", tag)
    library_api.addTagToPaper(doc.id, tag).then((res: any) => {
        console.log("Created Tag", tag, res);
        toast.success(`Created ${tag}`)
    }).catch((err: any) => {
        console.log("Error Creating Tag", tag, err);
        toast.error(`Error Creating ${tag}`)
    })

    library_api.getAllTags().then((res: any) => {
        console.log("All Tags", res);
    }).catch((err: any) => {
        console.log("Error Getting All Tags", err);
    })
}

const removeTag = (tag: string) => {
    console.log("Removing Tag", tag)
    library_api.removeTagFromPaper(doc.id , tag).then((res: any) => {
        console.log("Removed Tag", tag, res);
        toast.success(`Removed ${tag}`)
    }).catch((err: any) => {
        console.log("Error Removing Tag", tag, err);
        toast.error(`Error Removing ${tag}`)
    })
}



const toggleTagEditor = () => {
    document_.value.edit_tags = !document_.value.edit_tags
    console.log("Toggling Tag Editor")
}

</script>


