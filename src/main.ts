import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import { ConfirmationService, DialogService, ToastService } from 'primevue'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)

app.mount('#app')
