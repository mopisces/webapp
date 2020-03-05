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
							<div class="van-col van-col--10">订单数:{{ item.quantity }}</div>
							<div class="van-col van-col--10">门幅:{{ item.width }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">纸质:
								<span v-if="false">{{ item.paper_code }}</span>
								<span v-else>{{ item.paper }}</span>
							</div>
							<div class="van-col van-col--10">坑型:{{ item.flute_type }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">纸宽:{{ item.paper_w }}</div>
							<div class="van-col van-col--10">纸长:{{ item.paper_len }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">切刀数:{{ item.cutting_qty }}</div>
							<div class="van-col van-col--10">总长:{{ item.total_len }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">剖1:
								<span v-if="false">{{ item.slitting }}</span>
								<span v-else>{{ item.slitting1 }}</span>
							</div>
							<div class="van-col van-col--10">压型:{{ item.pressing_type }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">捆数:
								<span v-if="false">{{ item.bundling_qty }}</span>
								<span v-else>{{ item.bundle_qty }}</span>
							</div>
							<div class="van-col van-col--10">修边:{{ item.trimming }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">压线资料1:
								<span v-if="false">{{ item.slitting_data }}</span>
								<span v-else>{{ item.slitting_data1 }}</span>
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">
								预计完成时间:{{ item.pre_finishtime }}
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
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, DropdownMenu, DropdownItem, PullRefresh, List } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,

			PopupFilter
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
						filterShow : false
					}
				},
				formData:{
					activeItem  : 0,
					sn          : '',
					orderNumber : '',
					companyName : '',
					paperCode   : '',
					fluteType   : '',
					width       : ''
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
			this.$store.commit('sg/setHeaderTitle','生产订单');
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