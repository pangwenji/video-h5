import axios from "axios";
import config, {
    defaultRequestInterceptors,
    defaultResponseInterceptors,
} from "@/config/config";
import { ElMessage } from 'element-plus'
import router from "@/routes"
const { interceptors } = config;
const abortControllerMap = new Map();


const PATH_URL = import.meta.env.VITE_API_BASE_PATH;

const { requestInterceptors, responseInterceptors } = interceptors;



const axiosInstance = axios.create({
    ...config,
    baseURL: PATH_URL,
});

// 请求拦截器
axiosInstance.interceptors.request.use((res) => {
    const controller = new AbortController();
    const url = res.url ?? "";
    res.signal = controller.signal;
    abortControllerMap.set(url, controller);
    return res;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
    async (res) => {
        const url = res?.config?.url ?? "";
        abortControllerMap.delete(url);
        return res;
    },
    async (error) => {
        if (error.response && error.response.data) {
            if(error.response.status === 401){
                ElMessage.warning({
                    message: 'Token失效',
                    offset: window.screen.height / 2,
                });
               console.log('看一下是否')
                router.push({
                    // name:'full-screen'
                    path:'/'
                })
            }
        }
        return await Promise.reject(error);
    },
);

// 配置默认请求拦截器
axiosInstance.interceptors.request.use(
    requestInterceptors || defaultRequestInterceptors,
);
// 配置响应请求拦截器
axiosInstance.interceptors.response.use(
    responseInterceptors || defaultResponseInterceptors,
);

const service = {
    request: async (config) => {
        return await new Promise((resolve, reject) => {
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config );
            }

            axiosInstance
                .request(config)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    cancelRequest: (url) => {
        const urlList = Array.isArray(url) ? url : [url];
        for (const _url of urlList) {
            abortControllerMap.get(_url)?.abort();
            abortControllerMap.delete(_url);
        }
    },
    cancelAllRequest() {
        for (const [_, controller] of abortControllerMap) {
            controller.abort();
        }
        abortControllerMap.clear();
    },
};

export default service;
