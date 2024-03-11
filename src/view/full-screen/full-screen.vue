<template>
	<div class="full-screen-box" value="true" style="z-index: 1100">
		<div class="full-screen_overlay" style=""></div>
		<div class="full-screen_container" style="">
			<div class="lobby-header">
				<!-- <div>登录</div> -->
			</div>
			<div class="full-screen__content" v-if="isShow">
				<div class="base-dialog-content t-section">
					<img src="@/assets/table-view/loading.gif" alt="loading...." />
					<div class="t-text-base t-text-white t-text-center t-mt-7">准备加载配置</div>
				</div>
			</div>
			<!-- <div class="content">
				<el-form label-position="left" label-width="auto" :model="loginData" style="min-width: 350px">
					<el-form-item label="账号名">
						<el-input v-model="loginData.account" />
					</el-form-item>
					<el-form-item label="商户号">
						<el-input v-model="loginData.mch_no" />
					</el-form-item>
					<el-form-item label="签名">
						<el-input v-model="loginData.sign" :disabled="true" />
					</el-form-item>
				</el-form>
			</div>
			<div class="dialog-footer">
				<el-button class="btn-confirm" @click="confirm">确定</el-button>
			</div> -->
		</div>
	</div>
</template>
<script setup>
import { defineProps, ref, onMounted, onUnmounted, reactive, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore, useUserInfoStore, useTableStore } from '@/store';
import { loginApi, getUserNameInfo } from '@/api/login';
import { HttpStatus } from '@/enums';
import { getTableInfo } from '@/api/home';
import { initSocket, statisticsPlayerRecords, getTableList, getTokenFromURL} from '@/utils';
import { ElMessage } from 'element-plus';
const { setUserInfo } = useUserStore();
const { setUserDetailInfo } = useUserInfoStore();

const router = useRouter();

const loginData = reactive({
	account: '',
	mch_no: '', // 2313dsf23 本地测试用  MOVHSZHREBZ3 线上用 商户
	sign: '842ABA5ED8D203F1134E18F3108E8DD3',
});

const useTables = useTableStore();

// const route = useRoute();

// const isShowTipInfo = ref(false);

const isShow = ref(false);

const message = ref('');

const timeOut = ref();

const getDetailUserInfo = async () => {
	try {
		const result = await getUserNameInfo();
		if (result.code === HttpStatus.SUCCESS) {
			// 保存用户信息
			setUserDetailInfo(result.data);
		}
	} catch (error) {}
};

// const login = async (param) => {
// 	try { 
// 		const res = await loginApi(param);
// 		if (res.code === HttpStatus.SUCCESS) {
// 			localStorage.setItem('TOKEN', res.data.token);
// 			const token  =await getTokenFromURL();
// 			setUserInfo?.(res.data);
// 			await getDetailUserInfo();
// 			// await getTableList();
// 			await initSocket();

// 			await router.push({ name: 'home' });
// 			isShow.value = false;
// 		} else {
// 			useTables.setTableList([]);
// 			ElMessage.warning({
// 				message: res.message,
// 				offset: window.screen.height / 2,
// 			});
// 		}
// 	} catch (error) {
// 		new Error(error);
// 	}
// };




//  改成从URL获取token
onBeforeMount( async() => {
	isShow.value = true;
	// 获取token
    const token =	getTokenFromURL();
	if(token){
		     localStorage.setItem('TOKEN', token);
			 const  tokens =  localStorage.getItem('TOKEN');
			 if(tokens){
				 await getDetailUserInfo();
				 await initSocket();
				 await router.push({ name: 'home' });
			 }
	}else {
		ElMessage.warning({
			message: "请输入带有token的URL",
			offset: window.screen.height / 2,
		});
	}
});

onMounted(() => {
	const env = import.meta.env;
	loginData.mch_no = env.MODE === 'development' ? '2313dsf23' : 'MOVHSZHREBZ3';
});

onUnmounted(() => {
	clearTimeout(timeOut.value);
	isShow.value = false;

});

// const confirm = async () => {
// 	isShow.value = true;
// 	await login(loginData);
// };
</script>

<style scoped lang="less">
@import url('./full-screen.less');
</style>

