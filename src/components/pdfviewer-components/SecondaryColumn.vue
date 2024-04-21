<template>
  <Transition name="open_secondary">
    <div v-if="showSecondaryColumn(props.doc_id) == true" class="flex flex-col h-full border  bg-secondary">

        <div class="p-2 h-10 w-[300px]">
            <span @click="changeColumnTab('highlights')" class=" px-4 py-1 mx-1 border bg-primary  shadow-md rounded-full  text-xs cursor-pointer"
                   :class="selected_column_tab=='highlights'?' border-accent':''" >
               Highlights
              </span>
            <span @click="changeColumnTab('notes')" class=" px-4 py-1 mx-1 border bg-primary shadow-md rounded-full  text-xs cursor-pointer"
            :class="selected_column_tab=='notes'?' border-accent':''">
              Notes
            </span>
        </div>


        <HighlightList :doc_id="props.doc_id" v-if="selected_column_tab=='highlights'" />
        <NotesList :doc_id="props.doc_id" v-if="selected_column_tab=='notes'" :paper_id="props.doc_id" />

    </div>
</Transition>
</template>

<script setup lang="ts">
import HighlightList from './HighlightList.vue'
import NotesList from './NotesList.vue';

import useSecondaryColumn from '@/stores/useSecondaryColumnStore';

import { ref } from 'vue';

const props = defineProps({
  doc_id: {
    type: String,
    required: true
  }
})

const { showSecondaryColumn } = useSecondaryColumn();

const selected_column_tab = ref<string>("highlights")

const changeColumnTab = (tab: string) => {
    selected_column_tab.value = tab;
}



</script>


<style scoped>


.open_secondary-enter-active,
.open_secondary-leave-active {
  transition: width 0.5s ease;
  width: 300px;
}

.open_secondary-enter-from,
.open_secondary-leave-to {
  width: 0px;
}

</style>