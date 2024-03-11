<template>
	<div>
		<el-drawer v-model="isShowSet" :show-close="false" size="100%" :append-to-body="true">
			<div class="container">
				<div class="content">
					<div class="section">
						<div class="full">
							<div class="header">
								<ArrowLeft @click="closeSettings" />
								<span class="title">{{ $t('settings.settingsTitle') }}</span>
							</div>
							<div class="divider"></div>
						</div>
						<div class="section hide_scrollbar">
							<img src="@/assets/table-view/people.png" alt="photo" class="avator" />
							<div class="semibold">{{ userDetail.account }}</div>
							<div class="leading" @click="handlerNickName(true)">
								<span class="t-mr-2">{{ userDetail.user_nick ? userDetail.user_nick : '请输入您的昵称' }}</span>
								<Edit />
							</div>
							<div class="credit-box">
								<span class="font-medium">全部额度</span><span class="font-semibold">{{ formatNumber(userDetail.money) }}</span>
							</div>
							<div class="t-mb-0">
								<div class="text-base">账户</div>
								<div class="divider"></div>
							</div>
							<div class="t-row" @click="handlerGameRecord(true)">
								<SettingList />
								<span>投注记录</span>
								<ArrowRight />
							</div>

							<div class="t-mb-0">
								<div class="text-base">游戏</div>
								<div class="divider"></div>
							</div>
							<div class="t-row" @click="handlerChipStyle">
								<SettingChip />
								<span>筹码样式</span>
								<ArrowRight />
							</div>
							<div class="t-row">
								<SettingLive />
								<span>直播模式</span>
								<div class="t-switch" :class="isEnable ? 'disable' : 'enable'" @click="streamMode">
									<div class="t-switch-circle"></div>
								</div>
							</div>
							<div class="t-row" @click="handlerSelectChip(true)">
								<GameLimit />

								<div class="v-flex">
									<span>盘口设置</span>
									<NewFeature />
								</div>
								<ArrowRight />
							</div>
							<div></div>
							<div class="t-mb-0">
								<div class="text-base">系统</div>
								<div class="divider"></div>
							</div>
							<div class="t-row" @click="handlerSound(true)">
								<SettingVoice />
								<span>声音设置</span>
								<ArrowRight />
							</div>
							<div class="t-row" @click="handlerLanguage(true)">
								<SettingLanguage />
								<span>语言设置</span>
								<ArrowRight />
							</div>
							<div class="t-row" @click="handlerQuestion(true)">
								<SettingQuestion />
								<span>常见问题</span>
								<ArrowRight />
							</div>

							<div class="btn-logout" @click="closeLogoutModal">安全登出</div>
							<div class="version"><span> - </span><span>production-4.0.457</span></div>
						</div>
					</div>
				</div>
			</div>
		</el-drawer>

		<!-- 修改LogoutModal -->
		<el-dialog v-model="isShowLogout"  title="安全退出" width="80%" center>
			<span> 确认退出 博赢网投？ </span>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeLogout" class="cancel-btn">取消</el-button>
					<el-button type="primary" @click="logout" class="conform-btn"> 确定 </el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 修改nickName -->
		<el-drawer v-model="showNickname" :show-close="false" size="100%" :append-to-body="true">
			<div class="container">
				<div class="content">
					<div class="section">
						<div class="full">
							<div class="header">
								<ArrowLeft @click="handlerNickName(false)" />
								<span name="Title" class="title">编辑昵称</span>
							</div>
							<div class="divider"></div>
						</div>
						<div class="nick-section">
							<div class="box">
								<span class="t-text t-mr-5">账户</span><span>{{ userDetail.account }}</span
								><span class="t-text-sm">昵称</span>
								<div class="t-text-field">
									<div class="t-text-field__main">
										<input
											autocomplete="off"
											autocapitalize="off"
											spellcheck="false"
											autocorrect="off"
											type="text"
											:placeholder="userDetail.user_nick ? userDetail.user_nick : '请输入您的昵称'"
											maxlength=""
											tabindex="-1"
											class="t-text-field__input"
											v-model="inputValue"
											@input="changes"
										/>
									</div>
								</div>
							</div>
							<p class="t-text-xs" :style="{ color: textColor }">不允许使用空或符号。(例如："*#+$...等.）。</p>
						</div>
						<div class="confirm" @click="editNickName">确定</div>
					</div>
				</div>
			</div>
		</el-drawer>

		<!-- game Record -->

		<GameRecord :isShow="showGameRecord" @close="handlerGameRecord" />

		<!-- select-chip -->
		<el-drawer v-model="showSelectChip" :show-close="false" size="100%" :append-to-body="true">
			<div class="t-page">
				<div class="full">
					<div class="header">
						<ArrowLeft @click="handlerSelectChip(false)" />
						<span name="Title" class="title">选择游戏盘口</span>
					</div>
					<div class="divider"></div>
				</div>
				<div class="limit-tip">
					<span class="t-text-xs"> 此盘口与桌台限红交集后，即为您的游戏限红 </span>
				</div>
				<div class="t-page__body">
					<div
						class="t-item"
						v-for="(item, index) in data"
						:class="{ 't-mt-7': index !== 0, active: isActive === index }"
						@click="chooseActive(item, index)"
					>
						<div class="t-inline-flex" style="width: 173px">
							<span>{{ item.name }}</span>
						</div>
					</div>
				</div>
				<div class="button-area">
					<div class="t-button cancel" @click="cancelChip">取消</div>
					<div class="t-button confirm" @click="confirmChip">确认</div>
				</div>
			</div>
		</el-drawer>

		<!-- StreamMode -->
		<el-dialog v-model="isShowStreamMode" title="流模式" width="100%" center>
			<span> 如果关闭，则不会显示流媒体上线通知和窗口。 </span>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeStreammode" class="cancel-btn">取消</el-button>
					<el-button type="primary" @click="disableStream" class="conform-btn"> 确定 </el-button>
				</div>
			</template>
		</el-dialog>

		<!-- Sound -->

		<el-drawer v-model="showSound" :show-close="false" size="100%" :append-to-body="true">
			<div class="t-page">
				<div class="full">
					<div class="header">
						<ArrowLeft @click="handlerSound(false)" />
						<span name="Title" class="title">声音设置</span>
					</div>
					<div class="divider"></div>
				</div>
				<div class="t-section__body">
					<div class="items-center" @click="choose('music')">
						<span>背景音乐</span>
						<div class="switch" :style="{ 'background-color': obj.music ? '#FCEFBC' : '#9B9B9B' }">
							<div class="t-switch-circle" :style="{ transform: `translateX(${obj.music ? 15 : 0}px)` }"></div>
						</div>
					</div>
					<div class="divider"></div>
					<div class="items-center" @click="choose('sound')">
						<span>游戏音效</span>
						<div class="switch" :style="{ 'background-color': obj.sound ? '#FCEFBC' : '#9B9B9B' }">
							<div class="t-switch-circle" :style="{ transform: `translateX(${obj.sound ? 15 : 0}px)` }"></div>
						</div>
					</div>
					<div class="divider"></div>
					<div class="items-center" @click="choose('live')">
						<div class="t-flex-col"><span>现场语音</span><span class="t-text-gray-400"> 进入直播桌时，现场语音将暂时为静音</span></div>
						<div class="switch" :style="{ 'background-color': obj.live ? '#FCEFBC' : '#9B9B9B' }">
							<div class="t-switch-circle" :style="{ transform: `translateX(${obj.live ? 15 : 0}px)` }"></div>
						</div>
					</div>
					<div class="divider"></div>
					<div class="items-center" @click="choose('stream')">
						<span>直播语音</span>
						<div class="switch" :style="{ 'background-color': obj.stream ? '#FCEFBC' : '#9B9B9B' }">
							<div class="t-switch-circle" :style="{ transform: `translateX(${obj.stream ? 15 : 0}px)` }"></div>
						</div>
					</div>
					<div class="divider"></div>
				</div>
			</div>
		</el-drawer>

		<!-- language -->
		<el-drawer v-model="isShowLanguage" :show-close="false" size="100%" :append-to-body="true">
			<div class="t-page">
				<div class="full">
					<div class="header">
						<ArrowLeft @click="handlerLanguage(false)" />
						<span name="Title" class="title">语言设置</span>
					</div>
					<div class="divider"></div>
				</div>
				<div class="t-page__body">
					<div
						class="language"
						v-for="(item, index) in language"
						:class="{ selected: isSelect === index }"
						:key="item.label"
						@click="handlerSelect(index)"
					>
						<img :src="setImage(item.image)" /><span class="language-label">{{ item.label }}</span>
					</div>
				</div>
				<div class="button-group">
					<div class="cancel t-button margin-right-a" @click="cancel">取消</div>
					<div class="confirm t-button" @click="confirm">确定</div>
				</div>
			</div>
		</el-drawer>

		<!-- FAQ -->
		<el-drawer v-model="isShowQuestion" :show-close="false" size="100%" :append-to-body="true">
			<div class="t-page">
				<div class="full">
					<div class="header">
						<ArrowLeft @click="handlerQuestion(false)" />
						<span name="Title" class="title">常见问题</span>
					</div>
					<div class="divider"></div>
				</div>
				<div class="t-section__body">
					<div class="faqs">
						<div class="input-box">
							<div class="dropdown-box">
								所有问题
								<img src="../../assets/table-view/question-arrow-down.png" />
								<ul style="display: none">
									<li v-for="item in questions" class="selected" :key="item">{{ item }}</li>
								</ul>
							</div>
							<img src="../../assets/table-view/serach.png" /><input type="text" placeholder="请输入关键字" />
						</div>
						<div class="catagory" v-for="(item, index) in answer" :key="item.title">
							<div class="header" @click="chooseHeader(index)">
								{{ item.title }}
								<img src="../../assets/table-view/question-arrow-down.png" />
							</div>
							<div class="faq" v-for="sub in item.subTitle" v-if="item.isShowSubTitle">
								<div class="faq-title" @click="chooseContent(sub)">{{ sub.title }}</div>
								<div class="faq-content" v-if="sub.flag">
									{{ sub.descendants }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-drawer>

		<!-- Chip style -->
		<Drawer :is-show="isShowCipStyle" @closeDrawer="closeDrawer" />
	</div>
</template>
<script setup>
import { watch, ref, defineEmits, onMounted } from 'vue';
import Edit from '@/components/svg/edit.vue';
import ArrowLeft from '@/components/svg/arrow-left.vue';
import ArrowRight from '@/components/svg/arrow-right.vue';
import SettingList from '@/components/svg/setting-list.vue';
import SettingChip from '@/components/svg/setting-chip.vue';
import SettingLive from '@/components/svg/setting-live.vue';
import SettingVoice from '@/components/svg/setting_voice.vue';
import SettingLanguage from '@/components/svg/setting_language.vue';
import SettingQuestion from '@/components/svg/setting_question.vue';
import GameLimit from '@/components/svg/game_limit.vue';
import NewFeature from '@/components/svg/new-feature.vue';
import Drawer from '@/components/drawer/drawer.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GameRecord from '@/components/game-record/game-record.vue';
import { useUserInfoStore, useWsInfoStore, useUserStore } from '@/store';
import { answer, formatNumber } from '@/utils';
import { getUserRedLimitList, setRedLimitInfo } from '@/api/home';
import { HttpStatus } from '@/enums';
import { ElMessage } from 'element-plus'

// import { storeToRefs } from 'pinia';
import { setNickName } from '@/api/home';
import { useStorage } from '@/hook/useStorage.js';
import { getUserNameInfo } from '@/api/login';
const { setUserDetailInfo } = useUserInfoStore();
const { resetUserInfo } = useUserStore();
const wsInfoStore = useWsInfoStore();
const { getStorage } = useStorage();

const userUserInfo = useUserInfoStore();

const router = useRouter();

const { locale } = useI18n();

const questions = ref(['所有问题', '网络连接问题', '游戏类型', '游戏设备', '操作问题', '投注问题']);

const props = defineProps({
	isShow: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const isShowSet = ref(false);

const isShowCipStyle = ref(false);

const isEnable = ref(false);

const isShowLanguage = ref(false);

const isShowQuestion = ref(false);

const isSelect = ref(0);
const obj = ref({
	music: true,
	sound: true,
	live: true,
	stream: true,
});

const language = ref([
	{ label: '简中', image: 'china' },
	{ label: '한국어', image: 'korea' },
	{ label: 'English', image: 'USA' },
	{ label: '日本語', image: 'japan' },
	{ label: 'ภาษาไทย', image: 'Brazil' },
]);
const chipId = ref();

const data = ref([]);

const isShowLogout = ref(false);

const isActive = ref(0);

const showNickname = ref(false);

const showGameRecord = ref(false);

const isShowStreamMode = ref(false);

const showSound = ref(false);

const showSelectChip = ref(false);

// const { money } = storeToRefs(userUserInfo.getUserDetailInfo);
const userDetail = userUserInfo.getUserDetailInfo;

const emit = defineEmits(['close-set']);

const handlerNickName = (v) => (showNickname.value = v);

const handlerLanguage = (v) => (isShowLanguage.value = v);

const handlerGameRecord = (v) => showGameRecord.value = v;

const handlerSelectChip = async (v) => {
	await getSelectChip();
	showSelectChip.value = v;
};

const cancelChip = () => {
	showSelectChip.value = false;
	isActive.value = 0;
};

const confirmChip = async () => {
	try {
		let result = await setRedLimitInfo({ red_limit_id: chipId.value });

		if (result.code === HttpStatus.SUCCESS) {
			ElMessage.success({
				message: '修改成功',
				offset: window.screen.height / 2,
			});
		}

		showSelectChip.value = false;

	} catch (error) {}
};

const handlerSound = (v) => (showSound.value = v);

const handlerQuestion = (v) => (isShowQuestion.value = v);

const chooseActive = (v, n) => {
	isActive.value = n;
	chipId.value = v.id;
};

const handlerChipStyle = () => {
	isShowCipStyle.value = !isShowCipStyle.value;
};

// 昵称
const inputValue = ref();

const changes = (e) => {
	inputValue.value = e.target.value;
	if (regex.test(inputValue.value)) {
		textColor.value = 'red';
	} else {
		textColor.value = 'white';
	}
};

const { setStorage } = useStorage();

const getDetailUserInfo = async () => {
	try {
		const result = await getUserNameInfo();
		if (result.code === HttpStatus.SUCCESS) {
			// 保存用户信息
			await setUserDetailInfo(result.data);
		}
	} catch (error) {}
};

const textColor = ref();
const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

const editNickName = async () => {
	if (regex.test(inputValue.value)) {
		showNickname.value = true;
	} else {
		const param = {
			user_nick: inputValue.value,
			portrait: userUserInfo.getUserDetailInfo.portrait === null ? 'no avatar' : userUserInfo.getUserDetailInfo.portrait,
		};

		try {
			const result = await setNickName(param);
			if (result.code === HttpStatus.SUCCESS) {
				await getDetailUserInfo();
				showNickname.value = false;
			}
			emit('close');
		} catch (error) {}
	}
};

const confirm = () => {
	if (isSelect.value === 0) {
		//中文
		locale.value = 'zh';
	} else if (isSelect.value === 2) {
		//英文
		locale.value = 'en';
	}

	isShowLanguage.value = false;
};

const cancel = () => {
	isShowLanguage.value = false;
};

const closeSettings = () => {
	isShowSet.value = false;
	emit('close-set', false);
};

const getSelectChip = async () => {
	const result = await getUserRedLimitList();
	if (result.code === HttpStatus.SUCCESS) {
		data.value = result.data;
	} else {
		data.value = [];
	}
};

const closeLogout = () => {
	if (isShowLogout) {
		isShowLogout.value = false;
	} else {
		isShowLogout.value = true;
	}
};

const logout = () => {
	isShowLogout.value = !isShowLogout;

	router.push({
		name: 'full-screen',
		query: {
			status: 'logout',
		},
	});
	window.localStorage.clear();
	//关闭socket链接
	wsInfoStore.close();
	resetUserInfo?.();
};

const closeStreammode = () => {
	isEnable.value = false;
	if (isShowStreamMode) {
		isShowStreamMode.value = false;
	} else {
		isShowStreamMode.value = true;
	}
};

const disableStream = () => {
	isShowStreamMode.value = !isShowStreamMode;
	isEnable.value = isEnable;
};

const choose = (v) => {
	switch (v) {
		case 'music':
			obj.value.music = !obj.value.music;
			break;
		case 'sound':
			obj.value.sound = !obj.value.sound;
			break;
		case 'live':
			obj.value.live = !obj.value.live;
			break;
		case 'stream':
			obj.value.stream = !obj.value.stream;
			break;
		default:
			break;
	}
};

const setImage = (v) => {
	return new URL(`../../assets/table-view/${v}.png`, import.meta.url).href;
};

const handlerSelect = (v) => (isSelect.value = v);

const chooseHeader = (n) => {
	answer.value.forEach((e, i) => {
		if (i === n) {
			answer.value[i].isShowSubTitle = !answer.value[i].isShowSubTitle;
		}
	});
};

const chooseContent = (v) => {
	answer.value.forEach((e) => {
		e.subTitle.forEach((i) => {
			if (i.title === v.title) {
				i.flag = !i.flag;
			}
		});
	});
};

const closeLogoutModal = () => {
	isShowLogout.value = !isShowLogout.value;
};

const streamMode = () => {
	if (isEnable.value) {
		isShowStreamMode.value = isShowStreamMode.value;
		isEnable.value = !isEnable.value;
	} else {
		isShowStreamMode.value = !isShowStreamMode.value;
		isEnable.value = !isEnable.value;
	}
};

const closeDrawer = (v) => (isShowCipStyle.value = false);

watch(
	() => props.isShow,
	(v) => {
		console.log(userDetail, 'userDetail');
		isShowSet.value = v;
	},
	{
		deep: true,
	}
);
</script>
<style lang="less" scoped>
@import url('./settings.less');

:deep(.el-dialog){
	
	border-radius: 0.75rem;
	border: 1px solid rgba(76, 88, 131, 1);

	--tw-gradient-from: #2e2f40;
	--tw-gradient-to: #111217;
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(46, 47, 64, 0));

	background: linear-gradient(180deg, var(--tw-gradient-stops));
	.el-dialog__title {
		color: #fcefbc !important;
		;
		font-size: 1.25rem;
	}
	.el-dialog__body {
		font-size: 1.25rem;
		color: #fff;
		text-align: center;
		padding: 0.5rem;
	}
}
   :deep(.el-overlay-dialog) {
     display: flex;
	 align-items: center;
	 justify-content: center;
	.el-dialog__title {
		color: #fcefbc !important;
		;
		font-size: 1.25rem;
	}

	.el-dialog__body {
		font-size: 1.25rem;
		color: #fff;
		text-align: center;
		padding: 0.5rem;
	}

	.el-icon {
		display: none !important;
	}

	.el-dialog__footer {
		width: 100%;

		.dialog-footer {
			.el-button {
				height: 42px;
				width: 45%;
			}

			.cancel-btn {
				color: rgba(252, 239, 188, 1);
				background: transparent;
				border: 1px solid rgba(252, 239, 188, 1);
				border-radius: 0.5rem;
			}

			.el-button:focus-visible {
				outline: none;
			}

			.conform-btn {
				background: rgba(252, 239, 188, 1);
				color: #000;
				border: 1px solid #000;
				border-radius: 0.5rem;
			}
		}
	}
}
</style>
