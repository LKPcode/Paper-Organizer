import { supabase } from './supabase_client';
import type { Highlight } from "../types"


const getHighlightsOfPaper = async (paper_id:string) => {
    const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .eq('paper_id', paper_id)
    // handle errors
    console.log("Called getHighlightsOfPaper HTTP Request",data)
    return data;
}

const createHighlightOnPaper = async (paper_id:string, highlight:Highlight) => {
    const { data, error } = await supabase
        .from('highlights')
        .insert(
            {
                paper_id: paper_id,
                text: highlight.text,
                meta: highlight.meta
            }
        )
        .select('*')
        .single();
    // handle errors
    if (error) throw error;

    console.log("Called createHighlightOnPaper HTTP Request",data)
    return data;
}


const deleteHighlight = async (paper_id:string, highlight_id:string) => {
    const { data, error } = await supabase
        .from('highlights')
        .delete()
        .eq('paper_id', paper_id)
        .eq('_id', highlight_id)
    // handle errors
    if (error) throw error;

    console.log("Called deleteHighlight HTTP Request",data)
    return data;
}


export default {
    getHighlightsOfPaper,
    createHighlightOnPaper,
    deleteHighlight

}

