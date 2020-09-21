<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-dropdown-menu>
				<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownOption" />
				<!-- <van-dropdown-item title="筛选" ref="filter">
					<van-field label="序号" v-model="formData.sn" placeholder="精确查询" input-align="center"/>
					<van-field label="订单号" v-model="formData.orderNumber" placeholder="精确查询" input-align="center"/>
					<van-field label="客户名称" v-model="formData.companyName" placeholder="精确查询" input-align="center" v-if=" root != 2 "/>
					<van-field label="纸质" v-model="formData.paperCode" placeholder="精确查询" input-align="center"/>
					<van-field label="坑型" v-model="formData.fluteType" placeholder="精确查询" input-align="center"/>
					<van-field label="门幅" v-model="formData.width" placeholder="精确查询" input-align="center"/>
					<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
					<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
					<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
					<div style="padding: 5px 16px;">
						<van-row gutter="20" type="flex" justify="center">
							<van-col span="10">
								<van-button type="danger" block round @click="resetClick">重置</van-button>
							</van-col>
							<van-col span="10">
								<van-button type="primary" block round @click="filterClick">筛选</van-button>
							</van-col>
						</van-row>
					</div>
				</van-dropdown-item> -->
			</van-dropdown-menu>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<!-- <van-panel v-for="(item,index) in listInfo" :key="index" style="font-size:0.8125rem;">
					<div slot="default" :style=" index%2 == 1 ? 'background-color:#f0f0f0;' : '' ">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20" v-if="config.updown">
								<van-tag type="danger" mark size="large" v-if=" item.tag === '1' ">上刀</van-tag>
								<van-tag type="primary" mark size="large" v-if=" item.tag === '-1' ">下刀</van-tag>
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">序号:{{ item.sn }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">订单号:{{ item.order_number }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" root != 2 ">
							<div class="van-col van-col--20">客户名称:{{ item.company_name }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">纸质:
								<span v-if="config.isnew">{{ item.paper_code }}</span>
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
								<span v-if="config.isnew">{{ item.slitting }}</span>
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
								<span v-if="config.isnew">{{ item.slitting_data }}</span>
								<span v-else>{{ item.slitting_data1 }}</span>
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">
								完工时间:{{ item.finish_date }}
							</div>
						</div>
					</div>
				</van-panel> -->
				<el-card class="box-card" v-for="(item,index) in listInfo" :key="index" :style=" index%2 == 1 ? 'background-color:#f5f7fa;' : '' ">
					<div class="text item" v-show="config.updown">
						<van-tag type="danger" mark size="large" v-show=" item.tag === '1' ">上刀</van-tag>
						<van-tag type="primary" mark size="large" v-show=" item.tag === '-1' ">下刀</van-tag>
					</div>
					<div class="text item">
						<div class="flex-box">序号:{{ item.sn }}</div>
						<div class="flex-box">订单号:{{ item.order_number }}</div>
					</div>
					<div class="text item">
						客户名称:{{ item.company_name }}
					</div>
					<div class="text item">
						<div class="flex-box" v-show=" config.isnew ">纸质:{{ item.paper_code }}</div>
						<div class="flex-box" v-show=" !config.isnew ">纸质:{{ item.paper }}</div>
						<div class="flex-box">坑型:{{ item.flute_type }}</div>
					</div>
					<div class="text item">
						<div class="flex-box">门幅:{{ item.width }}</div>
						<div class="flex-box">修边:{{ item.trimming }}</div>
					</div>
					<div class="text item">
						<div class="flex-box">纸宽:{{ item.paper_w }}</div>
						<div class="flex-box">纸长:{{ item.paper_len }}</div>
					</div>
					<div class="text item">
						<div class="flex-box">订单数:{{ item.order_qty }}</div>
						<div class="flex-box">切刀数:{{ item.cutting_qty }}</div>
					</div>
					<div class="text item">
						<div class="flex-box" v-show=" config.isnew ">剖1:{{ item.slitting }}</div>
						<div class="flex-box" v-show=" !config.isnew ">剖1:{{ item.slitting1 }}</div>
						<div class="flex-box">压型:{{ item.pressing_type }}</div>
					</div>
					<div class="text item">
						<div class="flex-box">生产数:{{ item.prod_qty }}</div>
						<div class="flex-box">坏品数:{{ item.bad_qty }}</div>
					</div>
					<div class="text item">
						<div class="flex-box">停车次数:{{ item.stops }}</div>
						<div class="flex-box">停车时间:{{ item.stop_time }}</div>
					</div>
					<div class="text item">
						<div class="flex-box" v-show=" config.isnew ">压线资料1:{{ item.slitting_data }}</div>
						<div class="flex-box" v-show=" !config.isnew ">压线资料1:{{ item.slitting_data1 }}</div>
					</div>
					<div class="text item" v-show="item.finish_date">
						预计完成时间:{{ item.finish_date }}
					</div>
				</el-card>
			</van-list>
		</van-pull-refresh>
		<div style="width:100%;height:1rem;"></div>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="序号" v-model="formData.sn" placeholder="精确查询" input-align="center"/>
				<van-field label="订单号" v-model="formData.orderNumber" placeholder="精确查询" input-align="center"/>
				<van-field label="客户名称" v-model="formData.companyName" placeholder="精确查询" input-align="center" v-if=" root != 2 "/>
				<van-field label="纸质" v-model="formData.paperCode" placeholder="精确查询" input-align="center"/>
				<van-field label="坑型" v-model="formData.fluteType" placeholder="精确查询" input-align="center"/>
				<van-field label="门幅" v-model="formData.width" placeholder="精确查询" input-align="center"/>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Col, Row, Field, SwitchCell, DropdownMenu, DropdownItem, PullRefresh, List, Panel,  Sticky, Tag  } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Col.name]: Col,
			[Row.name]: Row,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,

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
					dropDownOption:[],
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad : false
						}
					},
					updown : false,
					isnew  : false,
					getInitDate : true,
					switch:{
						checked : false
					}
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
					endDate     : '',
					curPage     : 1
				},
				pageConfig:{
					minDate : '',
					maxDate : ''
				},
				listInfo : [],
				root : ''
			}
		},
		methods:{
			pullOnRefresh(){
				this.listInfo = [];
				this.formData.curPage = 1;
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;
				this.getWgdd();
			},
			onLoad(){
				this.formData.curPage++;
				this.getWgdd();
			},
			resetClick(){
				this.formData.sn          = '';
				this.formData.orderNumber = '';
				this.formData.companyName = '';
				this.formData.paperCode   = '';
				this.formData.fluteType   = '';
				this.formData.width       = '';
				this.config.getInitDate   = true;
				this.getConfig( true );
			},
			filterClick(){
				/*this.$refs.filter.toggle();*/
				this.getWgdd();
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
				});
			},
			getConfig( isRest = false ){
				let self = this;
				this.$request.sg.select.getWgddConfig().then(res=>{
					if( res.errorCode == '00000' ){
						if( self.config.getInitDate ){
							self.formData.beginDate = res.result.beginDate;
							self.formData.endDate   = res.result.endDate;
						}
						self.pageConfig.minDate = res.result.minDate;
						self.pageConfig.maxDate = res.result.maxDate;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
						if( !isRest ){
							this.getWgdd();
						}
					});
				});	
			},
			getWgdd(){
				let self = this;
				this.$request.sg.select.getWgdd( this.formData ).then(res=>{
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
							self.listInfo.push(item)
						});
					}
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','完工订单');
			this.$store.commit('sg/setTabbar','wgdd');
			if( sessionStorage.getItem('sg/wgdd') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('sg/wgdd'));
				this.formData = storageData;
				this.config.getInitDate    = false;
				this.config.switch.checked = true;
			}
			this.root = sessionStorage.getItem('jpdn-sg-root');
		},
		mounted(){
			this.getConfig();
			this.getDropDown();
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('sg/wgdd',JSON.stringify(this.formData));
			}else{
				sessionStorage.removeItem('sg/wgdd');
			}
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