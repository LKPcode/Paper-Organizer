import type { Paper } from "@/types"
import {ref} from "vue"


const global_library = ref<Paper[]>([])


export default function useLibraryStore() {

    const initGlobalLibrary =  (papers:Paper[]) => {
        global_library.value = papers
    }

    const addPaperToGlobalLibrary =  (paper:Paper) => {
        // Check if paper already exists
        if (global_library.value.includes(paper)) {
            return
        }
        global_library.value.push(paper)
    }

    const updatePaperInGlobalLibrary =  (paper:Paper) => {
        global_library.value = global_library.value.map(p => {
            if (p.id === paper.id) {
                return paper
            }
            return p
        })
    }


    const removePaperFromGlobalLibrary =  (id: string) => {
        global_library.value = global_library.value.filter(p => p.id !== id)
    }

    const addTagToPaper =  (paper_id:string, name:string) => {
        if (global_library.value.find(p => p.id === paper_id)?.tags.includes(name)) {
            return
        }

        global_library.value = global_library.value.map(p => {
            if (p.id === paper_id) {
                p.tags.push(name)
            }
            return p
        })
    }

    const removeTagFromPaper =  (paper_id:string, name:string) => {

        global_library.value = global_library.value.map(p => {
            if (p.id === paper_id) {
                p.tags = p.tags.filter(t => t !== name)
            }
            return p
        })
    }







    return {
        global_library,
        initGlobalLibrary,
        addPaperToGlobalLibrary,
        removePaperFromGlobalLibrary,
        updatePaperInGlobalLibrary,
        addTagToPaper,
        removeTagFromPaper
    }
}