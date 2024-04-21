// import useChromeTabs from "@/stores/useChromeTabsStore";
// import type {Tab} from "@/types";

// const {getTabList, addTabInBackground} = useChromeTabs()

// // TODO: Tabs do not show up in the correct order

// const saveTabs = () => {
//     let tabs = getTabList()
//     localStorage.setItem('tabs', JSON.stringify(tabs));
// }

// const loadTabs = () => {
//     let tabs = localStorage.getItem('tabs')
//     if (tabs == null) {
//         return
//     }
//     let tabs_ : Tab[] = JSON.parse(tabs)
//     tabs_.forEach((tab:Tab) => {
//         addTabInBackground(tab)
//     })
// }


// export default {
//     saveTabs,
//     loadTabs
// }

export {}