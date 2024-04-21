
interface User {
    _id: string;
    email: string;
    password: string;
    name: string;
    jwt: string;
    isLoggedIn: boolean;
}


interface Tab {
    id: string;
    type: string;
    title: string;
    url: string;
    meta: any;
}

interface CreateWorkspace {
    name: string;
    description: string;
    paper_ids: string[];
}
interface Workspace {
    id: string;
    name: string;
    description: string;
}



interface Paper {
    id: string;
 
    title: string;
   
}

interface WorkspacePapers {
    workspace_id: string;
    papers: Paper[];
}

interface HighlightMeta {
    id: string;
    startMeta:any;
    endMeta:any;
    text:string;
    color:string;
    page:number;
}

interface Highlight {
    _id: string;
    text: string; 
    meta: string
}

interface HighlightWithMeta {
    _id: string;
    text: string;
    meta: HighlightMeta;
}

interface PaperHighlightsWithMeta {
    paper_id: string;
    highlighter_instance: any;
    highlights: HighlightWithMeta[];
}

interface PaperHighlights {
    paper_id: string;
    highlighter_instance: any;
    highlights: Highlight[];
}

interface ShowSecondaryColumnItem {
    doc_id: string;
    show: boolean;
}

interface ShowConversationItem {
    doc_id: string;
    show: boolean;
}

interface Message {
    _id: string;
    from_user: boolean;
    created_at: string;
    text: string;
    references: {
      _id: string;
      type: string;
    }[];
}

interface Conversation {
    _id: string;
    user_id: string;
    started_from: {
      _id: string;
      type: string;
    };
    title: string;
    created_at: string;
    updated_at: string;
    context: {
      _id: string;
      type: string;
    }[];
    prompt: string[];
    messages: Message[];
  }






export type {
    Tab, 
    CreateWorkspace,
    Workspace,
    Paper,
    WorkspacePapers,
    Highlight,
    PaperHighlights,
    ShowSecondaryColumnItem,
    ShowConversationItem,
    HighlightMeta,
    HighlightWithMeta,
    PaperHighlightsWithMeta,
    Conversation,
    Message,

}