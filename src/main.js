import { createApp } from 'vue';
import App from './App.vue';
import router from '@/routes';
import ElementPlus from 'element-plus';
import il8n from '@/locale';
import init from '@/utils/init';
import 'element-plus/dist/index.css';
import store from './store';
const app = createApp(App);

await init()

app.use(store);
app.use(ElementPlus);
app.use(router);
app.use(il8n);
app.mount('#app');
