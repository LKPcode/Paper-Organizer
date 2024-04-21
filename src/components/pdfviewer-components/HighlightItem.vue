<template>
     <div class="relative bg-primary rounded-lg mx-4 mt-4 p-3 shadow-md hover:shadow-sm ">

        <button @click="toggleMenu()" class="absolute bottom-1 right-0 p-2 group">
            <img src="../icons/MoreIcon.svg" alt="More" class="h-4 w-4 ">
        </button>


        <div @click="goToPage()"
        class="  flex max-h-[150px] overflow-hidden">

                <div class="min-w-[2px] rounded-full bg-slate-700 "
                :style="`background-color:${highlight.meta.color};`"
                ></div>

            <div class="ml-3 text-xs mr-3 break-words relative">

                <!-- PAGE: {{ highlight.meta.page }}
                {{ highlight._id }} -->

                {{ highlight.text }}
                <div class="absolute h-10  bottom-0 w-full bg-gradient-to-b from-transparent via-[#EEE5] to-white"></div>
            </div>
        </div>

        <div class="flex overflow-hidden transition-all duration-500 "
            :class="showMenu == true ? 'h-4 mt-2' : 'h-0'"
        >
            <button class="flex text-xs pr-2 pl-1 mr-2 font-medium hover:underline rounded-md shadow-sm bg-secondary ">
                <img src="../icons/AdditionIcon.svg" alt="Addition" class="w-4 h-4" >
                Note
            </button>

            <button
            @click="deleteHighlight()"
             class="flex text-xs pr-2 pl-1 mr-2 font-medium hover:underline rounded-md shadow-sm bg-secondary ">
                <img src="../icons/AdditionIcon.svg" alt="Delete" class="w-4 h-4 rotate-45" >
                Delete
            </button>

            <button class="flex text-xs pr-2 pl-1 mr-2 font-medium hover:underline rounded-md shadow-sm bg-secondary ">
                <img src="../icons/ConversationIcon.svg" alt="Chat" class="w-4 h-4 " >
                Chat
            </button>

         
        </div>



    </div>



</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Highlight, HighlightWithMeta } from '@/types';
import HighlightsInteractions from '@/interactions/HighlightsInteractions';

const highlight_interactions = HighlightsInteractions();

const showMenu = ref<boolean>(false)

const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const {highlight, doc_id} = defineProps<{
    highlight: HighlightWithMeta,
    doc_id: string
}>()

const deleteHighlight = () => {
    highlight_interactions.deleteHighlightWithHighlighterId(doc_id, highlight.meta.id);
}

const goToPage = () => {
    console.log(`Go to page ${highlight.meta.page}`)
   
}


</script>