import { supabase } from "./supabase_client";
import type { Conversation, Message } from "@/types";




const getAllConversations = async () => {
    const { data, error } = await supabase
        .from("conversations")
        .select(`*`)
        .order("created_at", { ascending: false });
    // handle errors
    console.log("Called getAllConversations HTTP Request",data)
    return data;
}

const getConersationsOfPaper = async (paper_id:string) => {

    console.log("LOUKAS", paper_id)
    const { data, error } = await supabase
        .from("conversations")
        .select(`*`)
        .filter("paper_id", "eq", paper_id)
        .order("created_at", { ascending: false });

    // handle errors
    if (error) {
        console.log("Error getting conversations of paper", error)
        throw error
    }

    console.log("Called getConersationsOfPaper HTTP Request",data)

    return data;
}


const getConversation = async (conversation_id:string) => {
    const { data, error } = await supabase
        .from("conversations")
        .select("*, messages(*)")
        .eq("id", conversation_id)
        .single();

    // handle errors
    console.log("Called getConversation HTTP Request",data)
    return data;
}

const createConversation = async (conversation:any) => {
     const { data, error } = await supabase
        .from("conversations")
        .insert(conversation)
        .select("*")
        .single();
    
    // handle errors
    console.log("Called createConversation HTTP Request",data)
    return data;
}

const createMessage = async (message:any) => {
    const { data, error } = await supabase
        .from("messages")
        .insert(message)
        .select("*")
        .single();
    // handle errors
    console.log("Called createMessage HTTP Request",data)
    return data;
}

const deleteConversation = async (conversation_id:string) => {
    const { data, error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversation_id)
        .single();
    // handle errors
    console.log("Called deleteConversation HTTP Request",data)
    return data;
}




export default {
    getAllConversations,
    getConversation,
    createConversation,
    createMessage,
    deleteConversation,
    getConersationsOfPaper

}