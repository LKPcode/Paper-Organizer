import highlights_api from "../api/highlights_api"
import useHighlights from "@/stores/useHighlightsStore"
import type { Highlight, HighlightWithMeta } from "@/types"
import type { HighlightMeta } from "@/types"
import { toast } from "vue-sonner"


export default function HighlightsInteractions() {

    const highlights_store = useHighlights()


    const getHighlightsOfPaper = async (paper_id:string) => {
        const highlights = await highlights_api.getHighlightsOfPaper(paper_id)
        let paperHighlights = highlights_store.initHighlightsToPaper(paper_id, highlights)

        console.log("Highlights of paper Interaction", highlights)

        return paperHighlights.highlights
    }


    const createHighlightOnPaper = async (paper_id:string, highlight:HighlightWithMeta) => {
        let new_highlight:Highlight = {
            _id:'',
            text: highlight.text,
            meta: JSON.stringify(highlight.meta)
        }
        const createdHighlight = await highlights_api.createHighlightOnPaper(paper_id, new_highlight)
        highlights_store.addHighlightToPaper(paper_id, createdHighlight)
    }


    const deleteHighlightWithHighlighterId = async (paper_id:string, highlight_id:string) => {
        const database_id = highlights_store.findHilightDatabaseIdFromHighlightLibraryId(paper_id, highlight_id)
        if (database_id == null || database_id == undefined) {
            console.log("Error deleting highlight, database_id not found")
            toast.error("Error deleting highlight")
            return
        }
        try{
            let data = await highlights_api.deleteHighlight(paper_id, database_id)
            highlights_store.deleteHighlight(paper_id, database_id)

            // TODO: Delete highlight from highlighter instance
            let highlighter_instance = highlights_store.getHighlighterInstance(paper_id)
            highlighter_instance.remove(highlight_id)
        }catch(err){
            console.log("Error deleting highlight", err)
            toast.error("Error deleting highlight")
        }
       
    }




    return {
        getHighlightsOfPaper,
        createHighlightOnPaper,
        deleteHighlightWithHighlighterId

    }


}