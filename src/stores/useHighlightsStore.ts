import {ref} from "vue";
import type { Highlight , PaperHighlights, HighlightWithMeta, PaperHighlightsWithMeta } from "@/types";

// A highlight has two ids, one from the database and one from the highlight library.
// The database _id is used to delete the highlight from the database.
// The highlight library meta.id is used to delete the highlight from the highlight library.

const highlightsPerPaper = ref<PaperHighlightsWithMeta[]>([])


export default function useHighlights() {

    const getHighlightsOfPaper = (paper_id:string) => {
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper")
            return []
        }

        return paperHighlights.highlights
    }

    const getHighlightByHighlighterId = (paper_id:string, highlight_id:string) => {
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper")
            return null
        }
        let highlight = paperHighlights.highlights.find((highlight:HighlightWithMeta) => highlight.meta.id === highlight_id)
        if (highlight == null || highlight == undefined) {
            console.log("Highlight not found in paperHighlights")
            return null
        }
        return highlight   
    }

    const getPaperHighlights = (paper_id:string) => {
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper")
            return null
        }

        return paperHighlights
    }

    const getHighlighterInstance = (paper_id:string) => {
        let paperHighlights = getPaperHighlights(paper_id)
        
        return paperHighlights!.highlighter_instance
    }

    const parseHighlight = (highlight:Highlight) => {
        let highlightWithMeta:HighlightWithMeta = {
            _id: highlight._id,
            text: highlight.text,
            meta: JSON.parse(highlight.meta)
        }
        return highlightWithMeta
    }

    const createPaperHighlights = (paper_id:string) => {
        let paperHighlights: PaperHighlightsWithMeta = {
            paper_id: paper_id,
            highlighter_instance: null,
            highlights: []
        }
        highlightsPerPaper.value.push(paperHighlights)
        return paperHighlights
    }

    const addHighlightToPaper = (paper_id:string, highlight:Highlight) => {
        let new_highlight = parseHighlight(highlight)
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper, Adding it")
            paperHighlights = createPaperHighlights(paper_id)
        }
        paperHighlights.highlights.push(new_highlight)
    }

    const initHighlightsToPaper = (paper_id:string, highlights:Highlight[]) => {
        let new_highlights = highlights.map(highlight => parseHighlight(highlight))
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper, Adding it")
            paperHighlights = createPaperHighlights(paper_id)
        }
        paperHighlights.highlights = new_highlights
        return paperHighlights
    }


    const deleteHighlight = (paper_id:string, highlight_id:string) => {
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper")
            return null
        }
        paperHighlights.highlights = paperHighlights.highlights.filter((highlight:HighlightWithMeta) => highlight._id !== highlight_id)
    }

    
    const findHilightDatabaseIdFromHighlightLibraryId = (paper_id:string, highlight_id:string) => {
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper")
            return null
        }
        let highlight = paperHighlights.highlights.find((highlight:HighlightWithMeta) => highlight.meta.id === highlight_id)
        if (highlight == null || highlight == undefined) {
            console.log("Highlight not found in paperHighlights")
            return null
        }
        return highlight._id
    }

    const setHighlighterInstance = (paper_id:string, highlighter_instance:any) => {
        let paperHighlights = highlightsPerPaper.value.find((paperHighlights:PaperHighlightsWithMeta) => paperHighlights.paper_id === paper_id)
        if (paperHighlights == null || paperHighlights == undefined) {
            console.log("Paper not found in HighlightsPerPaper")
            return null
        }
        paperHighlights.highlighter_instance = highlighter_instance
    }



    return {
        highlightsPerPaper,
        getHighlightsOfPaper,
        getPaperHighlights,
        getHighlightByHighlighterId,
        addHighlightToPaper,
        initHighlightsToPaper,
        deleteHighlight,
        findHilightDatabaseIdFromHighlightLibraryId,
        parseHighlight,
        setHighlighterInstance,
        getHighlighterInstance
    }

}