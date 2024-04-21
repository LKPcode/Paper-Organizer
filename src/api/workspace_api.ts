import { supabase } from "../api/supabase_client";
import type { Workspace } from "../types"
import useWorkspace from '@/stores/useWorkspaceStore';

const workspace_store = useWorkspace();

// listen to inserts on the workspaces table , supabase-js v2
const workspace_inserts = supabase.channel('custom-insert-channel-workspaces')
  .on(
    'postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'workspaces' },
    (payload) => {
        console.log('Change received!', payload)
        workspace_store.addWorkspace(payload.new as Workspace);
    }
  )
  .subscribe()






// listen to updates on the workspaces table , supabase-js v2
const workspaces_updates = supabase.channel('custom-update-channel')
    .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'workspaces' },
        (payload) => {
            console.log('Change received!', payload)
            workspace_store.updateWorkspace(payload.new as Workspace);
        }
    )
    .subscribe()


// listen to deletes on the workspaces table , supabase-js v2
const workspaces_deletes = supabase.channel('custom-delete-channel')
    .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'workspaces' },
        (payload) => {
            console.log('Change received!', payload)
            workspace_store.deleteWorkspace(payload.old.id);
        }
    )
    .subscribe()






// Create a new workspace
const createWorkspace = async (workspace:any):Promise<any> => {

    const {data, error} = await supabase.from("workspaces").insert(workspace).select("*").single();
    // handle errors
    if (error) {
        console.log("Error creating workspace", error)
    }   

    console.log("Called createWorkspace HTTP Request",data)
    // workspace_store.addWorkspace(data as Workspace);

    return data;
}

const getAllWorkspaces = async ():Promise<Workspace[]> =>  {
    const { data , error } = await supabase.from("workspaces").select("*").returns<Workspace[]>();
    // handle errors
    if (error) {
        console.log("Error getting all workspaces", error)
        throw error
    }
    console.log("Called getAllWorkspaces HTTP Request",data)
    workspace_store.initWorkspaces(data);

    return data;
}

const getWorkspace = async (workspaceId: string) => {
    const { data, error } = await supabase.from("workspaces").select("*").match({id: workspaceId}).single();
    // handle errors
    if (error) {
        console.log("Error getting workspace", error)
        throw error
    }

    console.log("Called getWorkspace HTTP Request",data)
    return data as Workspace;
};

// const removePapersFromWorkspace = async (workspaceId: string, paperIds: string[]) => {
//     const { data } = await axios.delete(`/api/workspace/${workspaceId}/documents`, {
//         data: paperIds
//     });
//     // handle errors

//     console.log("Called removePapersFromWorkspace HTTP Request",data)
//     return data;
// }

const deleteWorkspace = async (workspaceId: string) => {
    const { data, error } = await supabase.from("workspaces").delete().match({id: workspaceId}).select("*").single();
    // handle errors
    if (error) {
        console.log("Error deleting workspace", error)
        throw error
    }

    console.log("Called deleteWorkspace HTTP Request",data)
    // workspace_store.deleteWorkspace(workspaceId);
    return data;
}


export default { 
    createWorkspace,
    getAllWorkspaces,
    getWorkspace,
    // removePapersFromWorkspace,
    deleteWorkspace

 }