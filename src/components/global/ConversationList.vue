<template>
    <div class="p-4 pt-0 overflow-auto">

        <div  @click.self="clickedConversation(convo)" v-for="convo in conversations" class="flex group justify-between items-center bg-primary rounded-md mt-3  px-3 py-2 shadow-sm cursor-pointer">

            <div @click="clickedConversation(convo)" class="flex">
                <img src="../icons/ChatIcon.svg" class="w-6 h-6 mr-2" alt="">
                <div class="group-hover:underline truncate text-sm leading-6">
                    {{ convo.title }}
                </div>
            </div>

            <div class="flex">
                <div>
                    <img src="../icons/EditIcon.svg" class="w-6 h-6 mr-2" alt="">
                </div>

                <div @click="deleteConvo(convo.id)">
                    <img src="../icons/DeleteIcon.svg" class="w-6 h-6 " alt="">
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import conversation_api from '@/api/conversation_api';
import type { Conversation } from '@/types';

const conversations = ref<any>([]);

const emits = defineEmits(['conversation_selected'])


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

onMounted(async () => {
    conversations.value = await conversation_api.getConersationsOfPaper(props.paper_id);
})

const clickedConversation = (conversation:Conversation) => {
    console.log(conversation);
    emits('conversation_selected', conversation)
}

const deleteConvo = async (id:string) => {
    await conversation_api.deleteConversation(id);
    conversations.value = conversations.value.filter((convo:any) => convo.id != id);
}


</script>