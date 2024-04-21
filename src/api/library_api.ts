import {supabase} from "./supabase_client"
import type { Paper } from "../types"
import useLibraryStore from "@/stores/useLibraryStore"
import useTagStore from "@/stores/useTagsStore"

const library_store = useLibraryStore()
const tag_store = useTagStore()

//  Query to get all papers, their workspaces and their tags
const query = `
                *,
                tags(*),
                papers_to_workspaces (
                    workspace:workspaces(*)
                )
                `


// listen for changes to papers
supabase.channel('custom-channel-papers')
.on(
  'postgres_changes', 
  { event: 'INSERT', schema: 'public', table: 'papers' },
  async (payload) => {
      console.log('New Paper Added received!', payload)
      let new_paper = await getPaperById(payload.new.id)
      library_store.addPaperToGlobalLibrary(new_paper as Paper)
  }
)
.on(
    'postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'papers' },
    async (payload) => {
        console.log('Paper Updated received!', payload)
        let updated_paper = await getPaperById(payload.new.id)
        library_store.updatePaperInGlobalLibrary(updated_paper as Paper)
        
    })
.on(
    'postgres_changes', 
    { event: 'DELETE', schema: 'public', table: 'papers' },
    async (payload) => {
        console.log('Paper Deletion received!', payload)
        library_store.removePaperFromGlobalLibrary(payload.old.id)
        
    }
)
.subscribe()

// listen for changes to papers_to_workspaces
supabase.channel('custom-channel-23456789876543')
.on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'papers_to_workspaces' },
    async (payload) => {
        console.log('New Paper added to Workspace received!', payload)
        let new_paper = await getPaperById(payload.new.paper_id)
        library_store.updatePaperInGlobalLibrary(new_paper as Paper)
    }
)
.on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'papers_to_workspaces' },
    async (payload) => {
        console.log('Paper removed from Workspace received!', payload)
        let new_paper = await getPaperById(payload.old.paper_id)
        library_store.updatePaperInGlobalLibrary(new_paper as Paper)
    }
)
.subscribe()




const getAllPapers = async () => {
    const { data, error } = await supabase
        .from("papers")
        .select(query)

    if (error) {
        throw error
    }

    let restructured = restructureData(data)


    console.log("getAllPapers", data,  restructured)
    library_store.initGlobalLibrary(restructured)

    return restructured;
}


const getPaperById = async (id:string) => {
    const { data, error } = await supabase
        .from("papers")
        .select(query)
        .eq("id", id)
        .single()

    if (error) {
        throw error
    }

    let restructured = restructureData([data])

    console.log("getPaperById", data, restructured)

    return restructured[0];
}


const restructureData = (data:any) => {

    // Restructure data
    let restructured = data.map((item:any) => {
        let i = {
            ...item,
            tags: item.tags.map((tag:any) => tag.name),
            workspaces: item.papers_to_workspaces.map((p:any) => p.workspace),
        };
        delete i.papers_to_workspaces;
        return i;
    });

    return restructured
}

const addTagToPaper = async (paper_id:string, name:string) => {

    const { data, error } = await supabase
        .from("tags")
        .insert({paper_id: paper_id, name: name})
        .select("*")
        .single()

    if (error) {
        throw error
    }

    console.log("addTagToPaper", data)
    library_store.addTagToPaper(paper_id, name)
    return data;
}

const removeTagFromPaper = async (paper_id:string, name:string) => {

    const { data, error } = await supabase
        .from("tags")
        .delete()
        .match({paper_id: paper_id, name: name})
        .single()

    if (error) {
        throw error
    }

    console.log("removeTageFromPaper", data)
    library_store.removeTagFromPaper(paper_id, name)
    return data;
}

const getAllTags = async () => {
    const { data, error } = await supabase
        .from("unique_tags")
        .select()

    if (error) {
        throw error
    }

    console.log("getAllTags", data)
    let list_of_tags = data.map((item:any) => item.name)
    tag_store.initTags(list_of_tags)
    return data;
}





export default { 
    getAllPapers,
    addTagToPaper,
    removeTagFromPaper,
    getAllTags,
};


