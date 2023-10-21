import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import 'devextreme/dist/css/dx.light.css';

const pinia = createPinia()
createApp(App).use(pinia)
createApp(App).mount('#app')
