

<template>
    <Listbox 
      @update:modelValue="value => emits('change', value)" 
      class="z-40 min-w-[200px]" as="div" v-model="selected">

      <div class="relative ">
        <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span class="block truncate">{{ selected.name }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
  
        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption as="template" v-for="option in options" :key="option.id" :value="option" v-slot="{ active, selected }">
              <li :class="[active ? 'bg-accent text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option.name }}</span>
  
                <span v-if="selected" :class="[active ? 'text-white' : 'text-accent', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
  import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
  
  const props = defineProps<{
    options: {
      id: number
      name: string
    }[],
    kind: string,
    add_all: boolean
  }>()


  const emits = defineEmits(['change'])

  const selected = ref({
    id: 0,
    name: ''
  })

  let options = ref<{
      id: number
      name: string
    }[]
  >([])
  
  onMounted(() => {
    console.log('Dropdown menu mounted.')

    options.value = [...props.options];


    if (props.add_all){
      options.value.unshift({
        id: -1,
        name: 'All ' + props.kind
      });
      selected.value = options.value[0]  
    }else{
      options.value.unshift({
        id: -1,
        name: 'None'
      });
      selected.value = options.value[0]  
    }

   


  })


  </script>