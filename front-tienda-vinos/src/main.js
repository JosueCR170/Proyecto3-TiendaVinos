import { createApp } from 'vue'

import App    from './App.vue'
import router from './router'
import { useCartStore } from './stores/cart'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

// Restaurar el carrito desde localStorage al iniciar la app
useCartStore().hydrate()

app.mount('#app')