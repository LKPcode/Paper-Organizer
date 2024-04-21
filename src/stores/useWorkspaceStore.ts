import { ref } from "vue";
import type { Workspace } from "@/types";

const workspace_list = ref<Workspace[]>([])


export default function useWorkspace() {
    

    const addWorkspace = (workspace:Workspace) => {
        workspace_list.value.push(workspace)
    }

    const initWorkspaces = (workspaces:Workspace[]) => {
        workspace_list.value = workspaces
    }

    const getWorkspace = (workspaceId:string) => {
        return workspace_list.value.find(workspace => workspace.id === workspaceId)
    }

    const updateWorkspace = (workspace:Workspace) => {
        const index = workspace_list.value.findIndex(workspace => workspace.id === workspace.id)
        workspace_list.value[index] = workspace
    }

    const deleteWorkspace = (workspaceId:string) => {
        const index = workspace_list.value.findIndex(workspace => workspace.id === workspaceId)
        workspace_list.value.splice(index, 1)
    }


    return {
        workspace_list,
        addWorkspace,
        initWorkspaces,
        getWorkspace,
        updateWorkspace,
        deleteWorkspace
        
    }

}