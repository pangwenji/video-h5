import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';
import useWsInfoStore from './modules/wsInfo';
import { useTableStore } from './modules/table';
import { useUserInfoStore } from './modules/userInfo';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia();
store.use(piniaPluginPersistedstate);

export { useUserStore , useWsInfoStore, useUserInfoStore,useTableStore};
export default store;
