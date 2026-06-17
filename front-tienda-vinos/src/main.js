import { createApp } from 'vue'

import App    from './App.vue'
import router from './router'
import { useCartStore } from './stores/cart'

import PrimeVue    from 'primevue/config'
import Aura        from '@primeuix/themes/aura'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

// Componentes globales
import Button      from 'primevue/button'
import Card        from 'primevue/card'
import Tag         from 'primevue/tag'
import Skeleton    from 'primevue/skeleton'
import Divider     from 'primevue/divider'
import InputText   from 'primevue/inputtext'
import Textarea    from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import IconField   from 'primevue/iconfield'
import InputIcon   from 'primevue/inputicon'
import RadioButton from 'primevue/radiobutton'
import Checkbox    from 'primevue/checkbox'
import Select      from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import Dialog      from 'primevue/dialog'
import Message     from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator   from 'primevue/paginator'
import DataTable   from 'primevue/datatable'
import Column      from 'primevue/column'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.component('Button',      Button)
app.component('Card',        Card)
app.component('Tag',         Tag)
app.component('Skeleton',    Skeleton)
app.component('Divider',     Divider)
app.component('InputText',   InputText)
app.component('Textarea',    Textarea)
app.component('InputNumber', InputNumber)
app.component('IconField',   IconField)
app.component('InputIcon',   InputIcon)
app.component('RadioButton', RadioButton)
app.component('Checkbox',    Checkbox)
app.component('Select',      Select)
app.component('ToggleSwitch', ToggleSwitch)
app.component('Dialog',      Dialog)
app.component('Message',     Message)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Paginator',   Paginator)
app.component('DataTable',   DataTable)
app.component('Column',      Column)

// Restaurar el carrito desde localStorage al iniciar la app
useCartStore().hydrate()

app.mount('#app')
