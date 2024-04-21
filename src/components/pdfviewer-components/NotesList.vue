<template>
    <div class="w-[300px] flex flex-col  h-full  grow overflow-y-auto  overflow-x-hidden ">
        <div class="pb-4">
            <NoteItem v-for="note in notes" :key="note._id" :text="note.text" :note_id="note._id" />
        </div>
    </div>

    <textarea class=" h-20 text-slate-600 text-xs m-4 mt-2 p-2 block bg-primary rounded-lg border outline-none focus:border-accent" placeholder="Add a note"></textarea>

</template>


<script setup lang="ts">
import NoteItem from './NoteItem.vue';
import {ref} from 'vue';

const notes = ref<{
        _id: string,
        text: string,
}[]>([]);

// Destructuring JS object
const { paper_id } = defineProps({
    paper_id: {
        type: String,
        required: true
    }
})



// dummy notes
notes.value = [
    {
        _id: "1",
        text: 'Lorem Ipsum',
    },
    {
        _id: "2",
        text: 'Lorem Ipsum',
    },
    {
        _id: "3",
        text: 'Lorem Ipsum',
    },

]



</script>