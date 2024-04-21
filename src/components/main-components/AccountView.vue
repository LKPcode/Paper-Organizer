<template>

    
    <div>
        <div class="flex items-center justify-between px-4 py-2 border-b border-accent">
            <div class="text-lg font-bold">Account Details</div>

            <div>
                <button class="text-sm font-bold px-5 py-2 text-white rounded-xl bg-slate-800 shadow-md hover:shadow-xl">
                    Logout
                </button>
            </div>

        </div>


        <div>
            ACCOUNT JWT: {{ jwt }}
            <div>
            <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
            <div class="relative mt-2 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input @keyup.enter="changeJWT" v-model="new_jwt" type="text" name="price" id="price" class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="New JWT">
            
            </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from "@/api/axios-instance";

const jwt = ref<any>("")

const new_jwt = ref<any>("")

onMounted(async () => {
    jwt.value = axios.defaults.headers.common['Authorization']
})


const changeJWT = () => {
    axios.defaults.headers.common['Authorization'] = new_jwt.value
    jwt.value = new_jwt.value
    localStorage.setItem("access_token", new_jwt.value)
}

</script>