<template>
    <div class="h-full relative">
        

        <div v-for="tab in tab_list" :key="tab.id" >

            <div v-if="tab.type === 'viewer'">
                <div class="transition-opacity duration-1000 ease-out absolute top-0 w-full h-full" 
                    :class="view==='viewer' && active_tab && active_tab!.id===tab.id ? 'block': 'hidden' ">
                    <PDFViewer :doc_id="tab.id.split('-')[1]" />
                </div>
            </div>   

            <div  v-else-if="tab.type =='workspace'" >
                <div class="absolute top-0 w-full h-full" 
                    v-if="view==='workspace' && active_tab && active_tab!.id===tab.id">
                    <WorkSpaceView :workspace_id="tab.id.split('-')[1]" />
                </div>
            </div>



        </div>

       
        <!-- <WorkSpaceView  v-if="view === 'workspace'" :workspace_id="'12345'" /> -->

        <StarterView v-if="view==='starter'" />   
        <GlobalLibraryView v-if="view==='library'" />
        <AccountView v-if="view==='account'" />
        


        <!-- <View404 v-if="view!='starter' && view!='workspace' && view!='viewer'" /> -->
    

    </div>
</template>

<script setup lang="ts">
import PDFViewer from './main-components/PDFViewer.vue';
import WorkSpaceView from './main-components/WorkSpaceView.vue';
import StarterView from './main-components/StarterView.vue';
import View404 from './main-components/View404.vue';
import GlobalLibraryView from './main-components/GlobalLibraryView.vue';
import AccountView from './main-components/AccountView.vue';

import {useRoute} from 'vue-router';
import useChromeTabs from '@/stores/useChromeTabsStore';
import { ref, watch } from 'vue';
import type AccountViewVue from './main-components/AccountView.vue';


// ROUTER
const route = useRoute();
const view:any = ref('workspace');
// get the first route param
view.value = route.params.view;
// Watch for changes to the route params
watch(() => route.params, (newVal, oldVal) => {
    console.log('route.params changed', newVal);
    view.value = newVal.view;
});

// CHROME TABS
const { tab_list, active_tab} = useChromeTabs();


</script>

<style scoped>

</style>