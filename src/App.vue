<script setup>

import { RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue'
import NavBar from './components/NavBar.vue'
import  ToastContainer  from 'vue3-toastify'

</script>

<template>
    <ToastContainer />
    <NavBar />
    <RouterView />

</template>

