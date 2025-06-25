import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'
import { ToastService } from 'primevue'
import  ConfirmationService  from 'primevue/confirmationservice'
import Toast         from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import {MotionPlugin} from '@vueuse/motion'
const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
  }
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(MotionPlugin) 
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.mount('#app')
