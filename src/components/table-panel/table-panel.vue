<template>
	<div class="dialog" @click="(e) => checkTableInfo(e, false)">
		<div class="dialog-content" @click="(e) => checkTableInfo(e, true)">
			<div class="table-panel-content">
				<div class="table-title">
					<span>{{ title }}</span
					><span>桌台</span>
				</div>
				<div class="hide-scrollbar">
					<div class="t-overflow-y-auto">
						<div class="t-tabs">
							<div class="t-tabs__tab" @click="change('B')" :class="{ active: isActive === 'B' }">下注区间</div>
							<span class="t-w-px t-h-3 t-bg-gold-500"></span>
							<div class="t-tabs__tab" @click="change('T')" :class="{ active: isActive === 'T' }">本台限红</div>
							<span class="t-w-px t-h-3 t-bg-gold-500"></span>
							<div class="t-tabs__tab" @click="change('P')" :class="{ active: isActive === 'P' }">个人盘口</div>
						</div>
						<div class="t-my-3"></div>
						<div class="t-limit-detail" v-for="item in list" :key="item.label">
							<span class="t-font-medium-left">{{ item.label }}</span
							><span class="t-font-normal-right">{{ item.value }}</span>
						</div>
						<div  class="t-player-section" v-if="isShowPlayerInfo">
							<div  class="t-leading-none t-font-medium t-text-lg t-text-center t-mt-5">
								<span >桌台玩家</span>
							</div>
							<div  class="t-w-full t-h-px t-bg-gold-500 t-mt-3 t-mb-4"></div>
							<div  class="t-players-detail">
								<span >座位</span><span  class="t-justify-self-start">会员名称</span
								><span  class="t-justify-self-end">金额</span>
							</div>
							<div  class="t-players-detail t-mt-2" v-for="item in user_list" :key="item.unique">
								<div ><span >{{item.seat}}</span></div>
								<span  class="t-justify-self-start"> {{item.user_nick}} </span
								><span  class="t-justify-self-end">{{item.money}}</span>
							</div>
							
						</div>
					</div>
				</div>
				<div class="confirm" @click="(e) => confirm(e)">确定</div>
			</div>
		</div>
	</div>
</template>
<script  setup>
import { defineEmits, defineProps, ref, onMounted, toRaw , watch} from 'vue';
import { setThousandsOfPoints }  from "@/utils"
const props = defineProps({
	isShowPlayerMessage:{
		type:Boolean,
		required:false
	},
	data: {
		type:Object,
		required:false
	},
})


const isShowPlayerInfo = ref(props.isShowPlayerMessage)

const isActive = ref('B');

const emit = defineEmits(['tablePanel']);

let betRange = ref([]);
let tableRange = ref([]);
let person = ref([]);

let user_list=ref([])

const title = ref(props.data.code);

const list = ref([]);
const checkTableInfo = (e, v) => {
	e.stopPropagation();
	emit('tablePanel', v);
};

const confirm = (e) => {
	e.stopPropagation();
	emit('tablePanel', false);
};

const change = (v) => {
	if (v === 'B') {
		list.value = betRange.value;
		isActive.value = 'B';
	} else if (v === 'T') {
		list.value = tableRange.value;
		isActive.value = 'T';
	} else if (v === 'P') {
		list.value = person.value;
		isActive.value = 'P';
	}
};

const handlerData = () => {
	if(props.data !== undefined){
		let flag = Object.keys(props.data);
		if (flag.length > 0) {
			betRange.value[0] = {
				label: '庄/闲',
				value: `${setThousandsOfPoints(props.data.public_red_limit_rules[1]['min'])}-${setThousandsOfPoints(props.data.public_red_limit_rules[1]['max'])}`,
			};
			betRange.value[1] = {
				label: '对子',
				value: `${setThousandsOfPoints(props.data.public_red_limit_rules[2]['min'])}-${setThousandsOfPoints(props.data.public_red_limit_rules[2]['max'])}`,
			};
			betRange.value[2] = { label: '和', value: `${setThousandsOfPoints(props.data.public_red_limit_rules[3]['min'])}-${setThousandsOfPoints(props.data.public_red_limit_rules[3]['max'])}` };
	
			tableRange.value[0] = {
				label: '庄/闲',
				value: `${setThousandsOfPoints(props.data.table_red_limit_rules[1]['min'])}-${setThousandsOfPoints(props.data.table_red_limit_rules[1]['max'])}`,
			};
			tableRange.value[1] = {
				label: '对子',
				value: `${setThousandsOfPoints(props.data.table_red_limit_rules[2]['min'])}-${setThousandsOfPoints(props.data.table_red_limit_rules[2]['max'])}`,
			};
			tableRange.value[2] = { label: '和', value: `${setThousandsOfPoints(props.data.table_red_limit_rules[3]['min'])}-${setThousandsOfPoints(props.data.table_red_limit_rules[3]['max'])}` };
	
			person.value[0] = { label: '庄/闲', value: `${setThousandsOfPoints(props.data.self_red_limit_rules[1]['min'])}-${setThousandsOfPoints(props.data.self_red_limit_rules[1]['max'])}` };
			person.value[1] = { label: '对子', value: `${setThousandsOfPoints(props.data.self_red_limit_rules[2]['min'])}-${setThousandsOfPoints(props.data.self_red_limit_rules[2]['max'])}` };
			person.value[2] = { label: '和', value: `${setThousandsOfPoints(props.data.self_red_limit_rules[3]['min'])}-${setThousandsOfPoints(props.data.self_red_limit_rules[3]['max'])}` };
			list.value = betRange.value;
		}
	}

	user_list.value = props.data.user_list;
};

onMounted(() => {
	handlerData();
});


</script>

<style lang="less">
@import url('./table-panel.less');
</style>

