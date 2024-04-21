<template>
        <div class="h-[46px] chrome-tabs bg-secondary fixed w-full border "
        style="width:calc(100% - 50px);left:50px;top:0px"
        >
            <div class="chrome-tabs-content"></div>
            <div class="chrome-tabs-bottom-bar"></div>
        </div> 

    <!-- <div>{{ tab_list }}</div>
    <div>{{ active_tab }}</div> -->
   
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick } from 'vue'
import useChromeTabs from '@/stores/useChromeTabsStore'
// import chrome-tab styles
import '@/assets/chrome-tabs/js/chrome-tabs.js'
import '@/assets/chrome-tabs/css/chrome-tabs.css'

import { useRoute } from 'vue-router'
const route = useRoute();

import type { Tab } from '@/types';

const { active_tab, addTab, changeActiveTab, removeTab, initChromeTabs } = useChromeTabs();



// https://stackoverflow.com/questions/38266951/how-to-create-chrome-like-tab-on-electron

onMounted( async () => {

    await nextTick()

    var el = document.querySelector('.chrome-tabs');
    console.log("Chrome tabs ellement",el)
    var chromeTabs = new (window as any).ChromeTabs();
    chromeTabs.init(el, { tabOverlapDistance: 14, minWidth: 20, maxWidth: 243 });

    // window.chromeTabs = chromeTabs;

    initChromeTabs(el, chromeTabs);
    


});



// })

</script>