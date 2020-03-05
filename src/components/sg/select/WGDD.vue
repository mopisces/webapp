<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownItem" />
		</van-dropdown-menu>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<van-panel v-for="(item,index) in listInfo" :key="index">
					<div slot="default">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">序号:{{ item.sn }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">订单号:{{ item.order_number }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">客户名称:{{ item.company_name }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">纸质:
								<span v-if="false">{{ item.paper_code }}</span>
								<span v-else>{{ item.paper }}</span>
							</div>
							<div class="van-col van-col--10">坑型:{{ item.width }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">门幅:{{ item.width }}</div>
							<div class="van-col van-col--10">修边:{{ item.trimming }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">纸宽:{{ item.paper_w }}</div>
							<div class="van-col van-col--10">纸长:{{ item.paper_len }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">订单数:{{ item.order_qty }}</div>
							<div class="van-col van-col--10">切刀数:{{ item.cutting_qty }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">压型:{{ item.pressing_type }}</div>
							<div class="van-col van-col--10">剖1:
								<span v-if="false">{{ item.slitting }}</span>
								<span v-else>{{ item.slitting1 }}</span>
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">生产数:{{ item.prod_qty }}</div>
							<div class="van-col van-col--10">坏品数:{{ item.bad_qty }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">停车次数:{{ item.stops }}</div>
							<div class="van-col van-col--10">停车时间:{{ item.stop_time }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">压线资料1:
								<span v-if="false">{{ item.slitting_data }}</span>
								<span v-else>{{ item.slitting_data1 }}</span>
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">
								完工时间:{{ item.finish_date }}
							</div>
						</div>
					</div>
				</van-panel>
			</van-list>
		</van-pull-refresh>
		<div style="width:100%;height:1rem;"></div>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="序号" v-model="formData.sn" placeholder="精确查询" input-align="center"/>
				<van-field label="订单号" v-model="formData.orderNumber" placeholder="精确查询" input-align="center"/>
				<van-field label="客户名称" v-model="formData.companyName" placeholder="精确查询" input-align="center"/>
				<van-field label="纸质" v-model="formData.paperCode" placeholder="精确查询" input-align="center"/>
				<van-field label="坑型" v-model="formData.fluteType" placeholder="精确查询" input-align="center"/>
				<van-field label="门幅" v-model="formData.width" placeholder="精确查询" input-align="center"/>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, DropdownMenu, DropdownItem, PullRefresh, List } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,

			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				config : {
					list:{
						pullRefresh:{
							reloading : false,
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					},
					dropDownItem:[],
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad : false
						}
					},
				},
				formData:{
					activeItem  : 0,
					sn          : '',
					orderNumber : '',
					companyName : '',
					paperCode   : '',
					fluteType   : '',
					width       : '',
					beginDate   : '',
					endDate     : ''
				},
				pageConfig:{
					minDate : '',
					maxDate : ''
				},
				listInfo : []
			}
		},
		methods:{
			pullOnRefresh(){

			},
			onLoad(){

			},
			resetClick(){

			},
			filterClick(){

			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','完工订单');
		},
		mounted(){

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