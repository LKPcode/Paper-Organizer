<template>

<div class="flex justify-end h-full">
  <SecondaryColumn :doc_id="props.doc_id" />

  <div class="w-full flex flex-col">
   
  <iframe
    v-if="render_pdf_viewer===true"
    ref="pdf_viewer_embeded" 
    class="grow z-10"
    id="pdf_viewer_embeded"  
    width="100%"
    height="100%"
    :src="`/pdfviewer/web/viewer.html?file=${pdf_viewer_object_url_file}`" >

  </iframe>

  <div v-else-if="render_pdf_viewer===false" class="flex-grow flex justify-center items-center">
    <div class="text-gray-400">Loading PDF Viewer...</div>
  </div>

  <View404 type_404="paper" v-if="render_pdf_viewer===null" />




</div>

  <ConversationContainer conversation_id="" :doc_id="props.doc_id" />


  <Highlighter :doc_id="props.doc_id" v-if="render_highlighter===true" :iframe_window="iframe_window!"/>

</div>
   
</template>
  
  
<script setup lang="ts">
import SecondaryColumn from '../pdfviewer-components/SecondaryColumn.vue';
import Highlighter from '../pdfviewer-components/Highlighter.vue';
import paper_api from '@/api/paper_api';
import useChromeTabs from '@/stores/useChromeTabsStore';
import ConversationContainer from '../global/ConversationContainer.vue';
import View404 from './View404.vue';

import type {Paper} from '@/types';

import {toast} from "vue-sonner"

import { ref, onMounted, nextTick } from 'vue'

const doc_data = ref<Paper|null>(null);

// Conversation Popup
import useConversationStore from '@/stores/useShowConversationViewerStore';
const { showConversation } = useConversationStore();


const props = defineProps({
  doc_id: {
    type: String,
    required: true
  }
})

const render_pdf_viewer = ref<boolean|null>(false)

const pdf_viewer_object_url_file = ref<string|null>(null)

const pdf_viewer_embeded = ref<HTMLIFrameElement|null>(null);

const iframe_window = ref<Window|null>(null)

const render_highlighter = ref<boolean>(false)


// Iframe needs to be loaded before we can access its contentWindow
// then we pass the iframe contentWindow to the highlighter component
// then we render it
onMounted(async () => {

  console.log("Loading PDFViewer with doc_id ", props.doc_id )

  try{

    const paper = await paper_api.getPaperMetadata(props.doc_id as string)
     // Set metadata to tab so we can see the title of the paper in the tab
    const { setMetadataToTab } = useChromeTabs();
    setMetadataToTab(props.doc_id as string, {
      title:paper.title,
      type:'viewer',
    })

    // Download the paper, then render the pdf viewer
    let objectURL = await  paper_api.downloadPaper(paper.path)
    pdf_viewer_object_url_file.value = objectURL
    render_pdf_viewer.value = true;
  }catch{
    toast.error(`Error loading paper`)
    render_pdf_viewer.value = null;
    return
  }


  // Wait for the iframe to be rendered
  await nextTick()
  if (pdf_viewer_embeded.value == null) {
    console.log("pdf_viewer_embeded is null")
    return
  }
  // Get the iframe contentWindow to pass to the highlighter component
  let frame =  pdf_viewer_embeded.value.contentWindow;
  iframe_window.value = frame; // for debugging, access iframe from console

  // Then render the highlighter
  render_highlighter.value = true;





 
});


</script>
