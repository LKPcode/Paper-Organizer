import {ref} from "vue";
import type { WorkspacePapers, Paper } from "@/types";

const papers_per_workspace = ref<WorkspacePapers[]>([])

export default function useWorkspacePapers() {

    const createWorkspacePapers = (workspace_id:string) => {
        // check if workspace already exists
        let workspace = papers_per_workspace.value.find(workspace => workspace.workspace_id === workspace_id)
        if (workspace != null || workspace != undefined) {
            console.log("Workspace already exists")
            return null
        }
        papers_per_workspace.value.push({
            workspace_id: workspace_id,
            papers: []
        })
    }

    const addPapersToWorkspace = (workspace_id:string, papers:Paper[]) => {
        let workspace = papers_per_workspace.value.find(workspace => workspace.workspace_id === workspace_id)
        if (workspace == null || workspace == undefined) {
            console.log("Workspace not found")
            return null
        }
        papers.forEach(paper => {
            workspace!.papers.push(paper)
        })
    }

    const getWorkspacePapers = (workspace_id:string) => {
        let workspace = papers_per_workspace.value.find(workspace => workspace.workspace_id === workspace_id)
        if (workspace == null || workspace == undefined) {
            console.log("Workspace not found")
            return null
        }
        return workspace.papers
    }



return {
    createWorkspacePapers,
    addPapersToWorkspace,
    getWorkspacePapers

}

}