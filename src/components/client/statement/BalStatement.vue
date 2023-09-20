<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.filter.show=true">筛选</van-button>		
		</van-sticky>
		<van-cell-group>
			 <van-cell
			 	v-for="(item, idx) in config.indexList"
			 	:title="item.title" 
			 	:value="item.value" 
			 	:label="item.label" 
			 	:key="idx"
			 />
		</van-cell-group>
		<!-- 筛选 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.filter.time.show" :dateTime.sync="formData.beginDate" :minDate="config.filter.time.minDate" :maxDate="config.filter.time.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.filter.time.show" :dateTime.sync="formData.endDate" :minDate="config.filter.time.minDate" :maxDate="config.filter.time.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.filter.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Sticky } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';

	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Sticky.name]: Sticky,
			NewTimePicker,
			PopupFilter
		},
		data(){
			return {
				/*配置*/
				config: {
					/*列表数据*/
					indexList: [],
					/*筛选条件*/
					filter: {
						show: false,
						/*时间组件*/
						time: {
							show: false,
							maxDate: null,
							minDate: null,
						},
						/*是否记录*/
						switch: {
							checked: false
						}
					}
				},
				/*筛选条件*/
				formData: {
					beginDate: null,
					endDate: null,
				}
			}
		},
		methods:{
			/*获取参数*/
			getConfig( isReset = false, isInit = true ){
				this.$request.client.statement.getBalStatementConfig().then((res)=>{
					if( res.errorCode == '00000' ){
						this.config.filter.time.maxDate = res.result.maxDate;
						this.config.filter.time.minDate = res.result.minDate;
						if( isReset ){
							this.formData.beginDate = res.result.beginDate;
							this.formData.endDate = res.result.endDate
						}
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.filter.time.show = true
						if( !isReset || isInit ){
							this.queryList();
						}
					});
				});
			},
			queryList(){
				this.config.indexList = this.$options.data().config.indexList

				for (var i = 0; i <= 200; i++) {
					this.config.indexList.push({
						title: '消费信息' + i,
						label: '消费时间' + i + i,
						value: '消费金额' + i + i,
					});
				}
			},
			/*筛选点击重置*/
			resetClick(){},
			/*筛选点击*/
			filterClick(){},
		},
		created(){
			this.$store.commit('client/setHeaderTitle','余额流水');
		},
		mounted(){
			this.getConfig()
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>