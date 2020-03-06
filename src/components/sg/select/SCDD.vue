<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownOption" />
		</van-dropdown-menu>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<van-panel v-for="(item,index) in listInfo" :key="index" style="font-size:0.8125rem;">
					<div slot="default" :style=" index%2 == 1 ? 'background-color:#f0f0f0;' : '' ">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20" v-if="config.updown">
								<van-tag type="success" mark size="large" v-if=" item.tag == 1 ">上刀</van-tag>
								<van-tag type="danger" mark size="large" v-if=" item.tag == -1 ">下刀</van-tag>
							</div>
						</div>
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
								<span v-if=" config.isnew ">{{ item.paper_code }}</span>
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
								<span v-if="config.isnew">{{ item.slitting }}</span>
								<span v-else>{{ item.slitting1 }}</span>
							</div>
							<div class="van-col van-col--10">压型:{{ item.pressing_type }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">捆数:
								<span v-if="config.isnew">{{ item.bundling_qty }}</span>
								<span v-else>{{ item.bundle_qty }}</span>
							</div>
							<div class="van-col van-col--10">修边:{{ item.trimming }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">压线资料1:
								<span v-if="config.isnew">{{ item.slitting_data }}</span>
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
	import { Button, Field, DropdownMenu, DropdownItem, PullRefresh, List, Panel, Tag } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[Panel.name]: Panel,
			[Tag.name]: Tag,

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
					dropDownOption:[],
					popup:{
						filterShow : false
					},
					updown : false,
					isnew  : false
				},
				formData:{
					activeItem  : 0,
					sn          : '',
					orderNumber : '',
					companyName : '',
					paperCode   : '',
					fluteType   : '',
					width       : '',
					curPage     : 1
				},
				listInfo : []
			}
		},
		methods:{
			pullOnRefresh(){
				this.listInfo = [];
				this.formData.curPage = 1;
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.getScdd();
			},
			onLoad(){
				this.formData.curPage++;
				this.getScdd();
			},
			resetClick(){
				this.formData.sn          = '';
				this.formData.orderNumber = '';
				this.formData.companyName = '';
				this.formData.paperCode   = '';
				this.formData.fluteType   = '';
				this.formData.width       = '';
			},
			filterClick(){
				this.pullOnRefresh();
			},
			getScdd(){
				let self = this;
				this.$request.sg.select.getScdd( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						let maxLength = 3;
						if( self.config.updown ){
							maxLength = 6
						}
						if( res.result == null || res.result.length < maxLength ){
							self.config.list.pushLoading.finished = true;
						}
						self.config.list.pushLoading.loading = false;
						res.result.forEach((item,index)=>{
							self.listInfo.push(item);
						});
					}
				});
			},
			getDropDown(){
				let self = this;
				this.$request.sg.select.getConfig().then(res=>{
					if( res.errorCode == '00000' ){
						res.result.forEach((item,index)=>{
							self.config.dropDownOption.push({text:item.DB_FLAG,value:index,isnew:item.isnew,updown:item.updown});
						});
						self.config.updown = self.config.dropDownOption[ 0 ].updown == 0 ? false : true;
						self.config.isnew = self.config.dropDownOption[ 0 ].isnew == 0 ? false : true;
					}
				}).then(()=>{
					this.getScdd();
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','生产订单');
		},
		mounted(){
			this.getDropDown();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			activeItemChange(){
				return this.formData.activeItem;
			}
		},
		watch:{
			activeItemChange( newV, oldV ){
				this.config.updown = this.config.dropDownOption[ newV ].updown == 0 ? false : true;
				this.config.isnew  = this.config.dropDownOption[ newV ].isnew == 0 ? false : true;
				this.pullOnRefresh();
			}
		}
	}
</script>