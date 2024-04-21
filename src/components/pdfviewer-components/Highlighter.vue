<template>
  <div id="annotator-popup" ref="selectionPopup2"
    class="bg-white z-10 cursor-pointer flex justify-between align-middle items-center rounded-lg border border-gray-300 absolute"
    style="display:none">

    <div id="red" @click="highlightSelection('red')" class="px-2 py-2 rounded-md bg-primary  hover:bg-primary">
      <div class="w-4 h-4 bg-red-500 rounded-full" style="height: 20px;width: 20px;background-color: red;"></div>
    </div>
    <div @click="highlightSelection('yellow')" class="px-2 py-2 rounded-md  hover:bg-primary">
      <div class="w-4 h-4 bg-yellow-300 rounded-full" style="height: 20px;width: 20px;background-color: yellow;"></div>
    </div>
    <div @click="highlightSelection('green')" class="px-2 py-2 rounded-md  hover:bg-primary">
      <div class="w-4 h-4 bg-green-500 rounded-full" style="height: 20px;width: 20px;background-color: green;"></div>
    </div>
    <div class="px-2 py-2 rounded-md  hover:bg-primary">Note</div>
    <div @click="removeSelection()" class="px-2 py-2 text-red-500 text-sm font-bold rounded-md  hover:bg-primary">DEL
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import type { PropType } from 'vue';
import Highlighter from 'web-highlighter';
import type { Highlight, HighlightMeta, HighlightWithMeta } from '@/types';

import HighlightsInteractions from '@/interactions/HighlightsInteractions';
const highlight_interactions = HighlightsInteractions()

import useHighlightsStore from '@/stores/useHighlightsStore';
const highlights_store = useHighlightsStore();

const props = defineProps({
  iframe_window: {
    type: Object as PropType<Window>,
    required: true
  },
  doc_id: {
    type: String,
    required: true
  }
})



let highlighter: any = null
let globalSelection: any = null
let string_selection: any = null
let color_selection: any = null
let clicked_page = ref<number | null>(null)
let creating_new_highlight = false

let pages_with_highlights: any = []


let selectedID: any = null

const selectionPopup2: any = ref(null);

let viewer: any = null


let ok = true


onMounted(async () => {

  // console.log("Mounted", PDFViewerApplication)
  let frame = props.iframe_window;
  window.frame = frame; // for debugging, access iframe from console

  highlight_interactions.getHighlightsOfPaper(props.doc_id)



  setTimeout(async () => {
    viewer = frame.document.getElementById("viewer")

    viewer.appendChild(selectionPopup2.value)

    console.log("Viewer: ", viewer)


    highlighter = new frame.Highlighter({
      $root: viewer,
      exceptSelectors: ['br']
    });





    // let highlights = await highlights_store.getHighlightsOfPaper(props.doc_id)
    // highlights_list.value = highlights

    highlights_store.setHighlighterInstance(props.doc_id, highlighter)

    // highlighter object in viewer.html because the library accesses the document object
    console.log("Highlighter: ", highlighter)


    viewer.addEventListener("mouseup", (event: any) => {

      console.log("mouseup", event)

      let selection: any = frame.getSelection();
      selectionPopup2.value.style.display = "none";

      if (selection.toString().length == 0) return;

      selectionPopup2.value.style.display = "flex";

      console.log("selectionchange", selection.toString());

      globalSelection = selection.getRangeAt(0).cloneRange();
      console.log("Global Selection: ", globalSelection);


      let rectangle = selection.getRangeAt(0).getBoundingClientRect();
      let popupRect = selectionPopup2.value.getBoundingClientRect()

      // let viewer = frame.document.getElementById("viewer")
      // console.log("Viewer: ", viewer)

      // viewer.appendChild(selectionPopup2.value)

      let viewerRect = viewer.getBoundingClientRect()


      selectionPopup2.value.style.top = (rectangle.top - viewerRect.top) - popupRect.height + "px";
      selectionPopup2.value.style.left = (rectangle.left - viewerRect.left) + rectangle.width / 2 - popupRect.width / 2 + "px";


      // console.log("Popup: ", selectionPopup2.value.getBoundingClientRect())
    });


    // Get Clicked Page Number
    viewer.addEventListener('click', function (event: any) {
      var clickedElement = event.target;
      if (!clickedElement) {
        return;
      }

      // Find ancestor with "data-page-number" attribute
      var ancestorWithPageNumber = null;
      var currentElement = clickedElement.parentNode;

      while (currentElement !== document) {
        if (currentElement.hasAttribute('data-page-number')) {
          ancestorWithPageNumber = currentElement;
          break;
        }
        currentElement = currentElement.parentNode;
      }

      if (ancestorWithPageNumber) {
        var pageNumber = ancestorWithPageNumber.getAttribute('data-page-number');
        clicked_page.value = parseInt(pageNumber)
        console.log("Page Number Clicked: ", pageNumber); // Log the value of the "data-page-number" attribute
      } else {
        console.log('No ancestor element with "data-page-number" attribute found.');
      }
    });

    function debounce(func: any, delay: any) {
      let timerId: any;
      return function (this: any, ...args: any) {
        clearTimeout(timerId);
        timerId = setTimeout(() => func.apply(this, args), delay);
      };
    }


    frame.PDFViewerApplication.eventBus.on('pagerendered', debounce(async function (event: any) {
      renderHighlightsOfPage(event.pageNumber);
    }, 1)); // Debounce delay of 200 milliseconds




    // 3. listen for highlight creating, then save to backend
    highlighter.on(Highlighter.event.CREATE, ({ sources }: any) => {

      let id = sources[0].id
      let color: any = null

      if (creating_new_highlight == true) {
        color = color_selection
      } else {
        color = highlights_store.getHighlightByHighlighterId(props.doc_id, id)!.meta.color
      }
      console.log("Highlight Created", sources, sources[0].id);

      highlighter.addClass(`highlight-color-${color}`, sources[0].id);
      highlighter.addClass('highlight', sources[0].id);
      highlighter.addClass('selected', sources[0].id);
      highlighter.addClass('appended', sources[0].id);

      let new_highlight: HighlightWithMeta = {
        _id: "",
        text: string_selection,
        meta: {
          id: sources[0].id,
          text: string_selection,
          startMeta: sources[0].startMeta,
          endMeta: sources[0].endMeta,
          color: color,
          page: clicked_page.value || 0
        }
      }

      string_selection = null

      highlighter.setOption({ $root: viewer, exceptSelectors: ['br'] });

      if (creating_new_highlight == true) {
        highlight_interactions.createHighlightOnPaper(props.doc_id as string, new_highlight)
      }


      creating_new_highlight = false

    });

    highlighter.on(Highlighter.event.CLICK, ({ id }: any) => {

      console.log("click", id);
      selectedID = id;


      let doms = highlighter.getDoms(id)
      let rectangle = doms[0].getBoundingClientRect()

      selectionPopup2.value.style.display = "flex";
      let popupRect = selectionPopup2.value.getBoundingClientRect()

      // let viewer = frame.document.getElementById("viewer")
      // console.log("Viewer: ", viewer)

      // viewer.appendChild(selectionPopup2.value)

      let viewerRect = viewer.getBoundingClientRect()


      selectionPopup2.value.style.top = (rectangle.top - viewerRect.top) - popupRect.height + "px";
      selectionPopup2.value.style.left = (rectangle.left - viewerRect.left) + rectangle.width / 2 - popupRect.width / 2 + "px";


    });


    highlighter
      .on('selection:hover', ({ id }: any) => {
        // display different bg color when hover
        console.log("hover", id)

        highlighter.addClass('highlight-wrap-hover', id);
      })

    // // 4. auto highlight
    // highlighter.run();

    const currentlyRenderedPages = Array.from(viewer.querySelectorAll('.page[data-loaded="true"]')).map((page: any) => parseInt(page.getAttribute('data-page-number')));
    console.log('Currently rendered pages:', currentlyRenderedPages);
    currentlyRenderedPages.forEach(async (pageNumber: number) => {
      renderHighlightsOfPage(pageNumber);
    });




  }, 2000)

  const renderHighlightsOfPage = async (pageNumber: number) => {

    console.log('Page rendered:', pageNumber);

    await new Promise(r => setTimeout(r, 100));

    const currentlyRenderedPages = Array.from(viewer.querySelectorAll('.page[data-loaded="true"]')).map((page: any) => parseInt(page.getAttribute('data-page-number')));
    console.log('Currently rendered pages:', currentlyRenderedPages);

    pages_with_highlights = pages_with_highlights.filter((page: any) => currentlyRenderedPages.includes(page));

    // console.log('Pages with highlights:', pages_with_highlights);

    if (pages_with_highlights.includes(pageNumber)) {
      return;
    }

    const highlightsOfPage = highlights_store.getHighlightsOfPaper(props.doc_id).filter(highlight => highlight.meta.page === pageNumber);
    if (highlightsOfPage.length === 0) {
      return;
    }

    pages_with_highlights.push(pageNumber);
    console.log('Pages with highlights:', pages_with_highlights);

    highlightsOfPage.forEach(highlight => {
      const highlightMeta = highlight.meta;

      if (pageNumber === highlightMeta.page) {
        console.log(`Highlighting on page ${pageNumber}`, highlightMeta, highlighter);

        const pageElement = viewer.querySelector(`[data-page-number="${pageNumber}"]`);
        console.log('Page Element:', pageElement);

        highlighter.setOption({ $root: pageElement, exceptSelectors: ['br'] });
        highlighter.fromStore(highlightMeta.startMeta, highlightMeta.endMeta, highlightMeta.text, highlightMeta.id);
        highlighter.addClass(`highlight-color-${highlightMeta.color}`, highlightMeta.id);
        highlighter.addClass('highlight', highlightMeta.id);
        highlighter.addClass('selected', highlightMeta.id);
        highlighter.addClass('appended', highlightMeta.id);
        highlighter.setOption({ $root: viewer, exceptSelectors: ['br'] });
      }
    });

  }



})


const highlightSelection = (color: any) => {
  creating_new_highlight = true

  var page_element = viewer.querySelector(`[data-page-number="${clicked_page.value}"]`);
  console.log("Page Element on Create: ", page_element)

  // highlighter.remove(highlight_meta.id);
  highlighter.setOption({ $root: page_element, exceptSelectors: ['br'] });
  console.log("GlobalSelection: ", globalSelection)
  string_selection = globalSelection.toString();
  console.log("Highlight Selection", string_selection)
  color_selection = color
  highlighter.fromRange(globalSelection);
}

const removeSelection = () => {
  console.log("Remove Selection", selectedID)
  // remove highlight from paper
  // highlighter.remove(selectedID);
  // remove highlight from database and store
  highlight_interactions.deleteHighlightWithHighlighterId(props.doc_id as string, selectedID)
}




</script>