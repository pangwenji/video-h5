<template>
	<div class="nick-name-fixed" style="z-index: 1052">
		<div aria-expanded="true" role="dialog" aria-modal="true" tabindex="-1" class="nick-name-container" style="">
			<div class="nick-name-content">
				<div class="nick-name-area">
					<div class="nick-name-title">设置昵称</div>
					<div class="t-mt-4 t-mb-5 input-area">
						<div class="t-text-field t-mb-2">
							<div class="t-text-field__main">
								<input autocomplete="off" autocapitalize="off" spellcheck="false" autocorrect="off"
									type="text" placeholder="请输入您的昵称" maxlength="" tabindex="-1" class="t-text-field__input"
									v-model="inputValue" @input="changes" />
							</div>
						</div>
						<p class="hint" :style="{ color: textColor }">名称不可使用空白或符号（如：“*#+$等)</p>
					</div>
					<div class="base-dialog-footer">
						<div class="t-button t-mr-3 common second" @click="nextTime">下次设定</div>
						<div class="t-button common first disabled confirm" @click="confirm">确定</div>
					</div>
				</div>
				<!---->
			</div>
		</div>
	</div>
</template>
<script setup>
import { defineEmits, ref } from 'vue';
import { setNickName } from '@/api/home';
import { HttpStatus } from '@/enums';
import { useStorage } from '@/hook/useStorage.js';
import { useUserInfoStore } from '@/store';
import { getUserNameInfo } from '@/api/login';

const { setStorage } = useStorage();
const userUserInfo = useUserInfoStore();
const inputValue = ref();
const { setUserDetailInfo } = useUserInfoStore();

const emit = defineEmits(['close']);

const nextTime = () => emit('close');

const changes = (e) => {
	inputValue.value = e.target.value;
	if (regex.test(inputValue.value)) {
		textColor.value = "red";
	}
	else {
		textColor.value = "white";
	}
};

const getDetailUserInfo = async () => {
	try {
		const result = await getUserNameInfo();
		if (result.code === HttpStatus.SUCCESS) {
			// 保存用户信息
			await setUserDetailInfo(result.data);
		}
	} catch (error) { }
};

const textColor = ref();
const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

const confirm = async () => {
	if (!regex.test(inputValue.value)) {
		const param = {
			user_nick: inputValue.value,
			portrait: userUserInfo.getUserDetailInfo.portrait === null ? 'no avatar' : userUserInfo.getUserDetailInfo.portrait,
		};

		try {
			const result = await setNickName(param);
			if (result.code === HttpStatus.SUCCESS) {
				await getDetailUserInfo();
			}
			emit('close');
		} catch (error) { }
	}
};
</script>
<style scoped lang="less">
@import url('./nick-name.less');
</style>

