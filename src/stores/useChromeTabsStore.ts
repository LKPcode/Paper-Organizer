import {ref} from "vue";
import { useRouter, useRoute} from "vue-router";
import type {Tab} from "@/types";
import useSecondaryColumn from "./useSecondaryColumnStore";
import useShowConversationViewerStore from "./useShowConversationViewerStore";


const active_tab = ref<Tab|null>()
const tab_list = ref<Tab[]>([])

const chrome_tabs_element = ref<Element|null>()

const chrome_tabs_instance = ref<any>()

// import chromeTabsLocalStorage from "@/localstorage/chromeTabsLocalStorage";

export default function useChromeTabs() {

    const router = useRouter()
    const route = useRoute()
    const {createSecondaryColumnItem} = useSecondaryColumn()
    const {createShowConversationItem} = useShowConversationViewerStore()



    const initChromeTabs = (el:Element|null, chromeTabsInstance:any) => {
        chrome_tabs_element.value = el
        chrome_tabs_instance.value = chromeTabsInstance


        // TAB EVENT LISTENERS
        el!.addEventListener('activeTabChange', ({ detail }:any) => {
            console.log('Active tab changed', detail);
            changeActiveTab(detail.tabEl.id);
        });
        // el!.addEventListener('tabAdd', ({ detail }:any) => {
        // });
        el!.addEventListener('tabRemove', ({ detail }:any) => {
            console.log('Tab removed', detail)
            removeTab(detail.tabEl.id);
        });

        
        loadTabs()

        const runBeforeEach = (to:any ) => {
            console.log("CHANGED VIEW TO", to)


            // When the user navigates to Starter, deactivate the current tab if any
            if(to.params.view != 'viewer' && to.params.view != 'workspace') {
                deactivateTab()
            }

            // If view is a PDFViewer then create a secondary column item for it and  a conversation viewer
            if(to.params.view == 'viewer') {
                let doc_id = to.params.view_id
                createSecondaryColumnItem(doc_id)
                createShowConversationItem(doc_id)
            }
            if(to.params.view == 'workspace') {
                let workspace_id = to.params.view_id
                createShowConversationItem(workspace_id, true)
                
            }




            if( to.params.view == 'workspace' || to.params.view == 'viewer') {
                let tab_id = "tab-" + to.params.view_id
                // Check if tab exists, If tab does not exist, create it
                if(!tabExists(tab_id)) {
                    let tab:Tab = {
                        id: to.params.view_id as string,
                        type: to.params.view as 'viewer' | 'workspace',
                        title: to.params.view as 'viewer' | 'workspace',
                        url: '',
                        meta:{}
                    }
                    addTab(tab);
                }


            if(active_tab.value == null && tabExists(tab_id)){
                console.log("Navigated route a different tab")
                // If navigated tab is not the active tab, change the active tab
                document.getElementById(tab_id as string)!.removeAttribute('active');
                document.getElementById(tab_id)!.setAttribute('active', 'true');
                changeActiveTab(tab_id);
            }


            if(active_tab.value != null && active_tab.value.id != tab_id){
                console.log("Navigated to a different tab")
                // If navigated tab is not the active tab, change the active tab
                document.getElementById(active_tab.value!.id as string)!.removeAttribute('active');
                document.getElementById(tab_id)!.setAttribute('active', 'true');
                changeActiveTab(tab_id);
            }


            }



            
           

        }

        router.beforeEach((to, from, next) => {
           runBeforeEach(to)
           next()
        });

        // let tab:Tab = {
        //     id: "6460db33980a8c49ed4c6b6b",
        //     type: 'viewer',
        //     title: 'workspace',
        //     url: '',
        //     meta:{}
        // }
        // addTab(tab);
        // let tab2:Tab = {
        //     id: "234567898765434567",
        //     type: 'workspace',
        //     title: 'workspace',
        //     url: '',
        //     meta:{}
        // }
        // addTab(tab2);

        runBeforeEach(route)

       


    }

    const getTabList = () => {
        return tab_list.value
    }

    const changeActiveTab = (id:String) => {
        let tab = tab_list.value.filter(tab => tab.id === id)[0]
        if (tab==null){
            console.log("Tab not found")
            return null
        }
        console.log("Changing active tab to",tab)
        active_tab.value =  tab

        let view_id = tab.id.split('-')[1]
        let path = `/${tab.type}/${view_id}`
        router.push({path:path})

    };

    const addTab = (tab:Tab) => {
        let tab_el = chrome_tabs_instance.value.addTab()
        console.log("Tab Element",tab_el)
        tab_el.id = "tab-" + tab.id

        if (tab.type == 'viewer') {
            tab_el.querySelector(".chrome-tab-favicon").innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.1716 3H9C7.11438 3 6.17157 3 5.58579 3.58579C5 4.17157 5 5.11438 5 7V17C5 18.8856 5 19.8284 5.58579 20.4142C6.17157 21 7.11438 21 9 21H15C16.8856 21 17.8284 21 18.4142 20.4142C19 19.8284 19 18.8856 19 17V8.82843C19 8.41968 19 8.2153 18.9239 8.03153C18.8478 7.84776 18.7032 7.70324 18.4142 7.41421L14.5858 3.58579C14.2968 3.29676 14.1522 3.15224 13.9685 3.07612C13.7847 3 13.5803 3 13.1716 3Z" stroke="#33363F" stroke-width="2"/><path d="M9 13L15 13" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M9 17L13 17" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M13 3V7C13 7.94281 13 8.41421 13.2929 8.70711C13.5858 9 14.0572 9 15 9H19" stroke="#33363F" stroke-width="2"/></svg>`
        }
        else if (tab.type == 'workspace') {
            tab_el.querySelector(".chrome-tab-favicon").innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 13.2C4 12.0799 4 11.5198 4.21799 11.092C4.40973 10.7157 4.71569 10.4097 5.09202 10.218C5.51984 10 6.0799 10 7.2 10H8.67452C9.1637 10 9.40829 10 9.63846 10.0553C9.84254 10.1043 10.0376 10.1851 10.2166 10.2947C10.4184 10.4184 10.5914 10.5914 10.9373 10.9373L12.0627 12.0627C12.4086 12.4086 12.5816 12.5816 12.7834 12.7053C12.9624 12.8149 13.1575 12.8957 13.3615 12.9447C13.5917 13 13.8363 13 14.3255 13H16.8C17.9201 13 18.4802 13 18.908 13.218C19.2843 13.4097 19.5903 13.7157 19.782 14.092C20 14.5198 20 15.0799 20 16.2V17.8C20 18.9201 20 19.4802 19.782 19.908C19.5903 20.2843 19.2843 20.5903 18.908 20.782C18.4802 21 17.9201 21 16.8 21H7.2C6.07989 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V13.2Z" stroke="#33363F" stroke-width="2"/>
            <path d="M18 13V7L15 4H9.2C8.07989 4 7.51984 4 7.09202 4.21799C6.71569 4.40973 6.40973 4.71569 6.21799 5.09202C6 5.51984 6 6.0799 6 7.2V10" stroke="#33363F" stroke-width="2" stroke-linejoin="round"/>
            <path d="M13 4V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H18" stroke="#33363F" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            `
        }

        tab.id = tab_el.id
        tab_list.value.push(tab)
        changeActiveTab(tab_el.id)
        saveTabs()
    }

    // Add tab in background, only works if you pass the tab object with id: "tab-<id>"
    const addTabInBackground = (tab:Tab) => {
        let tab_el = chrome_tabs_instance.value.addTab(undefined,{background:true})
        console.log("Tab Element",tab_el)
        tab_el.id = tab.id

        if (tab.type == 'viewer') {
            tab_el.querySelector(".chrome-tab-favicon").innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.1716 3H9C7.11438 3 6.17157 3 5.58579 3.58579C5 4.17157 5 5.11438 5 7V17C5 18.8856 5 19.8284 5.58579 20.4142C6.17157 21 7.11438 21 9 21H15C16.8856 21 17.8284 21 18.4142 20.4142C19 19.8284 19 18.8856 19 17V8.82843C19 8.41968 19 8.2153 18.9239 8.03153C18.8478 7.84776 18.7032 7.70324 18.4142 7.41421L14.5858 3.58579C14.2968 3.29676 14.1522 3.15224 13.9685 3.07612C13.7847 3 13.5803 3 13.1716 3Z" stroke="#33363F" stroke-width="2"/><path d="M9 13L15 13" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M9 17L13 17" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M13 3V7C13 7.94281 13 8.41421 13.2929 8.70711C13.5858 9 14.0572 9 15 9H19" stroke="#33363F" stroke-width="2"/></svg>`
        }
        else if (tab.type == 'workspace') {
            tab_el.querySelector(".chrome-tab-favicon").innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 13.2C4 12.0799 4 11.5198 4.21799 11.092C4.40973 10.7157 4.71569 10.4097 5.09202 10.218C5.51984 10 6.0799 10 7.2 10H8.67452C9.1637 10 9.40829 10 9.63846 10.0553C9.84254 10.1043 10.0376 10.1851 10.2166 10.2947C10.4184 10.4184 10.5914 10.5914 10.9373 10.9373L12.0627 12.0627C12.4086 12.4086 12.5816 12.5816 12.7834 12.7053C12.9624 12.8149 13.1575 12.8957 13.3615 12.9447C13.5917 13 13.8363 13 14.3255 13H16.8C17.9201 13 18.4802 13 18.908 13.218C19.2843 13.4097 19.5903 13.7157 19.782 14.092C20 14.5198 20 15.0799 20 16.2V17.8C20 18.9201 20 19.4802 19.782 19.908C19.5903 20.2843 19.2843 20.5903 18.908 20.782C18.4802 21 17.9201 21 16.8 21H7.2C6.07989 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V13.2Z" stroke="#33363F" stroke-width="2"/>
            <path d="M18 13V7L15 4H9.2C8.07989 4 7.51984 4 7.09202 4.21799C6.71569 4.40973 6.40973 4.71569 6.21799 5.09202C6 5.51984 6 6.0799 6 7.2V10" stroke="#33363F" stroke-width="2" stroke-linejoin="round"/>
            <path d="M13 4V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H18" stroke="#33363F" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            `
        }

        tab_list.value.push(tab)
    }

    const removeTab = (id:String) => {
        tab_list.value = tab_list.value.filter(tab => tab.id !== id)
        // if tab_list is empty, redirect to workspace
        if (tab_list.value.length === 0) {
            router.push({path:'/library/0'})
        }
        saveTabs()
    }

    const deactivateTab = () => {
        if (active_tab.value == null) return null
        document.getElementById(active_tab!.value!.id as string)?.removeAttribute('active')
        active_tab.value = null
    }

    const tabExists = (id:String) => {
        return tab_list.value.filter(tab => tab.id === id).length > 0
    }

    const setMetadataToTab = (tab_id:string, meta:{title:string, type:string}) => {
        let tab_el_id = "tab-" + tab_id
        let tab = tab_list.value.filter(tab => tab.id === tab_el_id)[0]
        console.log("KKKK", tab)
        if (tab==null){
            console.log("Tab not found")
            return null
        }
        
        let tab_el = document.getElementById(tab_el_id)
        let title_el = tab_el!.getElementsByClassName("chrome-tab-title")[0]
        console.log("Setting metadata to tab",tab_el_id, meta, title_el)
        title_el.innerHTML = meta.title
    }


   // Save tabs to localstorage 
    const saveTabs = () => {
        let tabs = getTabList()
        localStorage.setItem('tabs', JSON.stringify(tabs));
    }

    // Load tabs from localstorage
    const loadTabs = () => {
        let tabs = localStorage.getItem('tabs')
        if (tabs == null) {
            return
        }
        let tabs_ : Tab[] = JSON.parse(tabs)
        tabs_.forEach((tab:Tab) => {
            addTabInBackground(tab)
        })
    }



    return {
        tab_list,
        active_tab,
        getTabList,
        changeActiveTab,
        addTab,
        addTabInBackground,
        removeTab,
        deactivateTab,
        tabExists,
        initChromeTabs,
        setMetadataToTab
    }

}