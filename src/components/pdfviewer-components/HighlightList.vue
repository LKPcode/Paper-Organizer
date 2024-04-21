<template>
    <div class="w-[300px] overflow-y-auto overflow-x-hidden flex flex-col grow pb-8 ">
        <HighlightItem 
          v-for="highlight in highlighter_store.getHighlightsOfPaper(props.doc_id)" 
          :key="highlight._id" 
          :highlight="highlight" 
          :doc_id="props.doc_id"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import HighlightItem from './HighlightItem.vue';
import useHighlights from '@/stores/useHighlightsStore';

const props = defineProps({
  doc_id: {
    type: String,
    required: true
  }
});

const highlighter_store = useHighlights();

onMounted(() => {
    console.log('mounted highlight list')
   

})




</script>