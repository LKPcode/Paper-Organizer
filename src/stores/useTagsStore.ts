
import {ref} from "vue"


const all_tags = ref<string[]>([])




export default function useTagStore() {


    const initTags =  (tags:string[]) => {
        all_tags.value = tags
    }

    const addTag =  (tag:string) => {
        // Check if tag already exists
        if (all_tags.value.includes(tag)) {
            return
        }
        all_tags.value.push(tag)
    }

    const removeTag =  (tag:string) => {
        all_tags.value = all_tags.value.filter(t => t !== tag)
    }




    return {
        all_tags,
        initTags,
        addTag,
        removeTag
    }
}