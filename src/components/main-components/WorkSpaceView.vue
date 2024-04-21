<template>
  <div class="h-full relative ">

    <div class="flex justify-end h-full">

        <WorkspaceLibrary :workspace_id="props.workspace_id" />

       <ConversationContainer conversation_id="12345678" :doc_id="props.workspace_id" />
    </div>
    <!-- {{ props.workspace_id  }} -->
    
    <!-- <DocLibrary :workspace_id="props.workspace_id" />       -->
    <!-- <PaperMetadata /> -->

   

  </div>
</template>

<script setup lang="ts">
import PaperMetadata from '../global/PaperMetadata.vue';

import WorkspaceLibrary from '../workspace-components/WorkspaceLibrary.vue';

import ConversationContainer from '../global/ConversationContainer.vue';

import workspace_api from '@/api/workspace_api';
import useChromeTabs from '@/stores/useChromeTabsStore';


import { onMounted } from 'vue';


const props = defineProps({
  workspace_id: {
    type: String,
    required: true
  }
})

onMounted(() => {

  console.log(`Workspace with id ${props.workspace_id} was mounted`)


  // Set metadata to tab so we can see the title of the paper in the tab
  const { setMetadataToTab } = useChromeTabs();
  workspace_api.getWorkspace(props.workspace_id).then((data) => {
    console.log(data)
    setMetadataToTab(props.workspace_id, {
      title: data.name,
      type: 'workspace'
    })
  }).catch((err) => {
    console.log(err)
  })

});

</script>
