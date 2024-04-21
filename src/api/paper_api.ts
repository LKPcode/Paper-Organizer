import { supabase } from './supabase_client';

const getPaperMetadata = async (id: string) => {
    const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}


const downloadPaper = async (path: string) => {
    const { data, error } = await supabase
        .storage
        .from('documents')
        .download(path);
    
    if (error) throw error;
    console.log(data);

    // convert blob to ObjectURL
    // const blob = new Blob([data as BlobPart], { type: 'application/pdf' });
    const object_url = URL.createObjectURL(data);

    return object_url;
}

const deletePaper = async (id: string) => {
    const { data, error } = await supabase
        .from('papers')
        .delete()
        .eq('id', id);
        
    if (error) throw error;
    return data;
}

const addPaperToWorkspace = async (workspace_id: string, paper_id: string) => {
    const { data, error } = await supabase
        .from('papers_to_workspaces')
        .insert([
            { workspace_id, paper_id }
        ]);
    
    if (error) throw error;
    return data;
}


export default {
    getPaperMetadata,
    downloadPaper,
    deletePaper,
    addPaperToWorkspace
}
