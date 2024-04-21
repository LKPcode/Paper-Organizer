import {ref} from "vue";
import type { ShowSecondaryColumnItem } from "@/types";

const showSecondaryColumnList = ref<ShowSecondaryColumnItem[]>([])


export default function useSecondaryColumn() {

    const createSecondaryColumnItem = (doc_id:string) => {
        console.log("Creating secondary column item for doc_id: ", doc_id)
        // check if workspace already exists
        let secondaryColumnItem = showSecondaryColumnList.value.find((secondaryColumnItem:ShowSecondaryColumnItem) => secondaryColumnItem.doc_id === doc_id)
        if (secondaryColumnItem != null || secondaryColumnItem != undefined) {
            console.log("Doc already exists in showSecondaryColumnList")
            return null
        }

        secondaryColumnItem = {
            doc_id: doc_id,
            show: false
        }
        showSecondaryColumnList.value.push(secondaryColumnItem)
        return secondaryColumnItem
    }

    const toggleSecondaryColumn = (doc_id:string) => {
        if (doc_id == null || doc_id == undefined) {
            console.log("Doc not found in showSecondaryColumnList")
            return null
        }
        let secondaryColumnItem = showSecondaryColumnList.value.find((secondaryColumnItem:ShowSecondaryColumnItem) => secondaryColumnItem.doc_id === doc_id)

        if (secondaryColumnItem == null || secondaryColumnItem == undefined) {
            return null
        }
        secondaryColumnItem.show = !secondaryColumnItem.show
    }

    const showSecondaryColumn = (doc_id:string) => {
        let secondaryColumnItem = showSecondaryColumnList.value.find((secondaryColumnItem:ShowSecondaryColumnItem) => secondaryColumnItem.doc_id === doc_id)
        if (secondaryColumnItem == null || secondaryColumnItem == undefined) {
            console.log("Doc not found in showSecondaryColumnList")
            return false
        }
        return secondaryColumnItem.show
    }

    return {
        toggleSecondaryColumn,
        showSecondaryColumn,
        createSecondaryColumnItem
    }
}