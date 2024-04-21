import {ref} from "vue";
import type { ShowConversationItem } from "@/types";


const showConversationList = ref<ShowConversationItem[]>([])


export default function useShowConversationItemStore() {

    const createShowConversationItem = (doc_id:string, show:boolean = false) => {
        console.log("Creating conversation item for doc_id: ", doc_id)
        // check if workspace already exists
        let showConversationItem = showConversationList.value.find((showConversationItem:ShowConversationItem) => showConversationItem.doc_id === doc_id)
        if (showConversationItem != null || showConversationItem != undefined) {
            console.log("Doc already exists in showConversationList")
            return null
        }

        showConversationItem = {
            doc_id: doc_id,
            show: show
        }
        showConversationList.value.push(showConversationItem)
        return showConversationItem
    }

    const toggleConversation = (doc_id:string) => {
        if (doc_id == null || doc_id == undefined) {
            console.log("Doc not found in showConversationList")
            return null
        }
        let showConversationItem = showConversationList.value.find((showConversationItem:ShowConversationItem) => showConversationItem.doc_id === doc_id)

        if (showConversationItem == null || showConversationItem == undefined) {
            return null
        }
        showConversationItem.show = !showConversationItem.show
    }

    const showConversation = (doc_id:string) => {
        let showConversationItem = showConversationList.value.find((showConversationItem:ShowConversationItem) => showConversationItem.doc_id === doc_id)
        if (showConversationItem == null || showConversationItem == undefined) {
            console.log("Doc not found in showConversationList")
            return false
        }
        return showConversationItem.show
    }


    return {
        createShowConversationItem,
        toggleConversation,
        showConversation

    }

}