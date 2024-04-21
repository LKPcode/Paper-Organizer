<template>
    <div ref="editor" class="absolute left-0 top-0 min-w-[200px] w-[120%]  bg-primary z-40 shadow-xl border border-slate-400  ">
        <div class=" border-b pb-[3px] px-2 h-[35px]">
            <Tag v-for="tag in selected_tags"
                    :key="tag"
                    :tag="tag" 
                    :close-button="true"  
                    @removeTag="removeTag"
                    />
        </div>

        
        
        <div class="px-2 flex flex-wrap">
            <Tag 
            v-for="tag in available_tags" 
            :key="tag"
            :tag="tag" 
            :close-button="false"  
            @removeTag="deleteTag"
            @tagClicked="addTag"
            />
        </div>
        
        
        <div class="w-full box-border">
            <input ref="tag_input" v-model="new_tag"  @keyup.enter="createTag(new_tag)" class="w-full p-2 bg-slate-100" type="text" placeholder="Create Tag">
        </div>

    </div>
</template>

<script setup lang="ts" >
import { ref, defineEmits, onMounted, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Tag from '../global/Tag.vue'

import useTagStore from '@/stores/useTagsStore'



const emits = defineEmits(['addTag', 'removeTag','createTag', "closeEditor"])

const props = defineProps<{
    selectedTags: string[],
    doc_id: string 
}>();

const selected_tags = ref<string[]>([])

const available_tags = ref<string[]>([])

const tag_input = ref<HTMLElement>()
const { all_tags } = useTagStore()
onMounted(async() => {
    // next tick to make sure the editor is mounted
    // and the input is focused
    await nextTick()
    tag_input.value!.focus()
    console.log("mounted")
    selected_tags.value = props.selectedTags

    // remove selected tags from all tags
    available_tags.value = all_tags.value.filter((tag) => !selected_tags.value.includes(tag)).sort()


})

const new_tag = ref('')

const editor = ref(null)



const addTag = (tag: string) => {
    // remove from available_tags
    available_tags.value = available_tags.value.filter((t) => t != tag)
    // add to selected_tags
    selected_tags.value.push(tag)
    // add to tag to paper emit
    emits('addTag', tag)
}

// remove tag from selected tags
const removeTag = (tag: string) => {
    // add to available_tags
    available_tags.value.push(tag)
    available_tags.value.sort()

    selected_tags.value = selected_tags.value.filter((t) => t != tag)
    emits('removeTag', tag)
}


// Create a new tag and add it to selected tags
const createTag = (tag:string) => {
    // check if tag name is empty
    if(tag == '') return
    // selected_tags.value.push(tag)
    new_tag.value = ''
    emits('createTag', tag)

}

// Delete a tag from all tags
const deleteTag = (tag:string) => {
    available_tags.value = available_tags.value.filter((t) => t != tag)
}

// When clicked outside the editor, close it
onClickOutside(editor, (event) => {
    console.log(event)
    emits('closeEditor')
})




</script>