<template>
    <div class="overflow-auto grow transition-all duration-500 p-4 pt-0">

        <div v-if="conversation != null" v-for="message in conversation.messages">


            <div v-if="message.author == 'user'" class="flex justify-start mt-4  ">
                <div class="w-12 ">
                    <div class="w-6 h-6 bg-accent rounded-full"></div>
                </div>
                <div class="mt-1 text-xs break-words"> {{ message.text }} </div>

            </div>

            <div v-else class="bg-primary rounded-lg mt-4 p-3 ">
                <!-- <div class="text-slate-400 text-xs uppercase mb-2">NOTE</div> -->
                <div class="flex text-xs">
                    <!-- <div class="w-[5px] rounded-full bg-slate-700"></div> -->
                    <div class="w-full break-words">ktk
                        {{ message.text }}
                    </div>

                </div>


            </div>



        </div>


    </div>


    <div>
        <span v-if="waiting_for_response" class="m-auto w-1/2 flex justify-center">

            <div class="text-xs text-center text-slate-900 bg-blue-300 rounded-md p-2  flex items-center">
                <div class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <span class="ml-4">Wait a few secconds boy!</span>
            </div>
        </span>

        <div class="w-full p-4">
            <textarea v-model="new_message"
                class="w-full p-2 block bg-primary text-xs rounded-lg border outline-none focus:border-accent "
                placeholder="Ask anything..." name="" id="" rows="2"></textarea>
            <button class="w-full bg-accent rounded-md mt-2 py-1 text-sm" @click="createMessage">Ask the oracle boy!</button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import conversation_api from '@/api/conversation_api';
import { toast } from 'vue-sonner'
import type { Conversation } from '@/types';
import { supabase } from '@/api/supabase_client';
import { AuthInvalidCredentialsError } from '@supabase/supabase-js';

const props = defineProps({
    conversation_id: {
        type: String,
        required: true,
        default: ""
    },
    paper_id: {
        type: String,
        required: true,
        default: ""
    }
})


const waiting_for_response = ref(false)

const conversation = ref<any>(null)
const new_message = ref<any>("")


let conversation_channel:any;
onMounted(() => {

    console.log(`conversation_id=eq.${props.conversation_id}}`)
    // listen to inserts on the messages table , supabase-js v2
    conversation_channel = supabase.channel(`custom-insert-channel-conversation-${props.conversation_id}`)
    .on(
        'postgres_changes', 
        { 
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${props.conversation_id}`,
        },
        (payload) => {
            console.log('Change received!', payload)
            // Add new message to the conversation
            conversation.value?.messages.push(payload.new)

        }
    )
    .subscribe()


    conversation_api.getConversation(props.conversation_id).then((data) => {
        conversation.value = data
    })

})

onUnmounted(() => {
    conversation_channel.unsubscribe()
})


const createMessage = async () => {
    waiting_for_response.value = true

    let message = {
        text: new_message.value,
        status: "pending",
        author: "user",
        conversation_id: props.conversation_id
    }

    conversation_api.createMessage(message).then((data) => {
        console.log(data)
        toast.success("Message sent!")
        waiting_for_response.value = false
    }).catch((error) => {
        console.log(error)
        toast.error("Error sending message!")
        waiting_for_response.value = false
    })




    new_message.value = ""
}



</script>