<template>
    <span 
        class="relative cursor-pointer inline-block m-1 ml-0 px-3 py-1 font-semibold text-slate-800  leading-tight"
        >
        <span @click.self="tagClicked(tag)" aria-hidden class="absolute inset-0 opacity-50 rounded-md"
            :style="{ backgroundColor: tagColor(tag) }"
        ></span>
        <span  @click.self="tagClicked(tag)" class="relative flex items-center">
            {{ tag }}
            <img  v-if="closeButton==true" @click="removeTag(tag)" class="ml-1 w-3 h-3 rounded-full hover:bg-gray-500/25 cursor-pointer" src="../icons/XIcon.svg" alt="">
        </span>
    </span>
</template>

<script setup lang="ts">
import {  defineEmits } from 'vue'


let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const { tag } = defineProps({
    tag: {
        type: String,
        required: true
    },
    closeButton: {
        type: Boolean,
        default: true
    }
})

const emits = defineEmits(['removeTag', 'tagClicked'])

const removeTag = (tag: string) => {
    emits('removeTag', tag)
}

const tagClicked = (tag: string) => {
    emits('tagClicked', tag)
}

const tagColor = (tag:string) => {
    // Calculate hash code
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Calculate color
    let index = Math.abs(hash % colors.length);
    return colors[index];
}

</script>