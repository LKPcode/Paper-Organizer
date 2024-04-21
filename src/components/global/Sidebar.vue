<template>
    <div class="w-[50px] flex flex-col justify-between bg-secondary h-full fixed border shadow-xl">
        <div>

            <div class="font-bold h-[50px] flex justify-center items-center text-[13px] text-center">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12V17C20 18.8856 20 19.8284 19.4142 20.4142C18.8284 21 17.8856 21 16 21H6.5C5.11929 21 4 19.8807 4 18.5V18.5C4 17.1193 5.11929 16 6.5 16H16C17.8856 16 18.8284 16 19.4142 15.4142C20 14.8284 20 13.8856 20 12V7C20 5.11438 20 4.17157 19.4142 3.58579C18.8284 3 17.8856 3 16 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V18.5" 
                    class="stroke-accent" stroke-width="2"/>
                    <path d="M9 8L15 8" class="stroke-accent" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>


            <div class="flex flex-col text-xs">

                <!-- <RouterLink class="p-3" to="/viewer/0/highlights"> PDFs </RouterLink> -->
                <!-- <RouterLink class="p-3"  to="/workspace/0"> WORKSPACE </RouterLink> -->
                <!-- <RouterLink class=" group mb-2  flex flex-col justify-center items-center" to="/starter/0">
                    <StarterPageIcon class="w-8 h-8" />
                    <div class="text-[10px] group-hover:underline text-gray-600"> Starter </div>
                </RouterLink> -->

               
                <RouterLink class=" group mb-2  flex flex-col justify-center items-center" to="/library/0">
                    <img src="../icons/LibraryIcon.svg" class="w-8 h-8" />
                    <button class="text-[10px] group-hover:underline text-gray-600 text-center"> Library </button>
                </RouterLink>

                <button v-if="view === 'viewer'" class="group mb-2 flex flex-col justify-center items-center cursor-pointer"
                    @click="toggleSecondaryColumn(view_id)">
                    <div v-if="showSecondaryColumn(view_id) == false">
                        <RightArrowIcon class="w-8 h-8" />
                        <div class="text-[10px] group-hover:underline text-gray-600 text-center"> Open </div>
                    </div>
                    <div v-else>
                        <LeftArrowIcon class="w-8 h-8" />
                        <div class="text-[10px] group-hover:underline text-gray-600 text-center"> Close </div>
                    </div>
                </button>
                
                <!-- <button @click="toggleConversation(view_id)"
                    class="group mb-2 flex flex-col justify-center items-center cursor-pointer">
                    <img src="../icons/ConversationIcon.svg" class="w-8 h-8" />
                    <button class="text-[10px] group-hover:underline text-gray-600 text-center"> Chat </button>
                </button> -->

            </div>

        </div>

        <div class="flex flex-col text-xs">
                <!-- <button @click=""
                    class="group mb-2 flex flex-col justify-center items-center cursor-pointer">
                    <img src="../icons/SettingsIcon.svg" class="w-6 h-6" />
                    <button class="text-[10px] group-hover:underline text-gray-600 text-center"> Settings </button>
                </button> -->

                <RouterLink class=" group mb-2  flex flex-col justify-center items-center" to="/account/0">
                    <img src="../icons/AccountIcon.svg" class="w-8 h-8" />
                    <button class="text-[10px] group-hover:underline text-gray-600 text-center"> Account </button>
                </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import useSecondaryColumn from '@/stores/useSecondaryColumnStore';
import StarterPageIcon from '../icons/StarterPageIcon.vue';
import RightArrowIcon from '../icons/RightArrowIcon.vue';
import LeftArrowIcon from '../icons/LeftArrowIcon.vue';
// import ConversationIcon from '../icons/ConversationIcon.vue';

import useShowConversationViewerStore from '@/stores/useShowConversationViewerStore';

const { showSecondaryColumn, toggleSecondaryColumn } = useSecondaryColumn();
const { toggleConversation } = useShowConversationViewerStore();


// ROUTER
const route = useRoute();
const view: any = ref('');
const view_id: any = ref(null);
view.value = route.params.view;
watch(() => route.params, (newVal, oldVal) => {
    console.log('route.params changed', newVal);
    view.value = newVal.view;
    view_id.value = newVal.view_id;

});

onMounted(() => {
    console.log(`Sidebar was mounted`)
    console.log(`View`, view.value)
    console.log(`View ID`, view_id.value)

    view.value = route.params.view;
    view_id.value = route.params.view_id;

})


</script>



