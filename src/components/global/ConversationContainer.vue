<template>


    
    <!-- Open Conversation Buble -->
    <!-- <div class="relative h-full">
        <Transition name="conversation_icon">
        <div v-if="showConversation(props.doc_id) == false" class="animate-bounce absolute bottom-4 z-20 left-[-80px] w-12 h-12 bg-accent rounded-full">
            <button @click="toggleConversation(props.doc_id)" class="w-full h-full flex justify-center items-center">
                <img src="../icons/ConversationIcon.svg" class="w-8 h-8" />
            </button>
        </div>
    </Transition>
    </div> -->


    <div class="relative bg-secondary h-full flex-col flex  transition-all box-border
                duration-500 overflow-hidden border  justify-between"
        :class="showConversation(props.doc_id) == true ? ' conversation_opened' : 'conversation_closed'">

       

        <div class="min-w-[400px] flex h-full  flex-col grow">

            <div class="flex justify-between items-center m-2 ">
                <div class="flex items-center">
                    <button @click="toggleConversation(props.doc_id)" class="w-8 h-8 flex items-center">
                        <RightArrowIcon />
                    </button>
                    <div class="text-xl font-bold ">
                        {{ conversation?.title }}
                    </div>
                </div>

                <div class="flex items-center">
                    
                    <button v-show="showConversationList==false" @click="toggleConversationList()" class="text-xs font-bold bg-primary px-3 py-1 rounded-xl border border-accent shadow-md">
                        All Conversations
                    </button>

                    <button @click="createNewConversation" class="bg-blue-300 rounded-full ml-2">
                        <img src="../icons/AdditionIcon.svg" class="w-6 h-6" />
                    </button>
                    
                </div>  

            </div>

            <ConversationVue v-if="showConversationList==false" :paper_id="doc_id" :conversation_id="conversation?.id" :key="conversation?.id" />
            <ConverversationList v-if="showConversationList==true" :paper_id="doc_id" :conversation_id="conversation?.id" @conversation_selected="selectConversation" />





        </div>


    </div>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import RightArrowIcon from '../icons/RightArrowIcon.vue';
import ConversationVue from './Conversation.vue';
import ConverversationList from './ConversationList.vue';
import useShowConversationViewerStore from '@/stores/useShowConversationViewerStore';
import conversation_api from '@/api/conversation_api';

import type { Conversation } from '@/types';



const { showConversation, toggleConversation } = useShowConversationViewerStore();

const props = defineProps({
    conversation_id: {
        type: String,
        required: true
    },
    doc_id: {
        type: String,
        required: true
    }
})

const showConversationList = ref(true);

const conversation = ref<any>(null);

const toggleConversationList = () => {
    console.log('toggleConversationList')
    showConversationList.value = !showConversationList.value;
}

const createNewConversation = async () => {
    const data = await conversation_api.createConversation({
        type: 'document',
        paper_id: props.doc_id,
        title: 'New Conversation'
    });
    console.log("Created Conversation", data);
    conversation.value = data;
    showConversationList.value = false;
}

const selectConversation = (convo: Conversation) => {
   
    conversation.value = convo;
    showConversationList.value = false;
}



</script>




<style scoped>
.conversation_opened {
    width: 80%;
}

.conversation_closed {
    width: 0px;

}


/* Conversation Icon */
.conversation_icon-enter-active {
    animation: bounce-in 0.5s;
}

.conversation_icon-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}
</style>