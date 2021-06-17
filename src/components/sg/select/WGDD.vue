<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-dropdown-menu>
				<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownOption" />
			</van-dropdown-menu>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<el-card class="box-card" v-for="(item,index) in listInfo" :key="index" :style=" index%2 == 1 ? 'background-color:#f5f7fa;' : '' ">
					<div class="text item" v-show="config.updown">
						<van-tag type="danger" mark size="large" v-show=" item.tag === '1' ">上刀</van-tag>
						<van-tag type="primary" mark size="large" v-show=" item.tag === '-1' ">下刀</van-tag>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								序号:<span class="text-color">{{ item.sn }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								订单号:<span class="text-color">{{ item.order_number }}</span>
							</span>
						</div>
					</div>
					<div class="text item" v-if=" root != 2 ">
						<span class="text">
							客户名称:<span class="text-color">{{ item.company_name }}</span>
						</span>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								纸质:<span class="text-color" v-if="config.isnew">{{ item.paper_code }}</span>
								<span class="text-color" v-else>{{ item.paper }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								坑型:<span class="text-color">{{ item.flute_type }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								门幅:<span class="text-color">{{ item.width }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								修边:<span class="text-color">{{ item.trimming }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								纸宽:<span class="text-color">{{ item.paper_w }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								纸长:<span class="text-color">{{ item.paper_len }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								订单数:<span class="text-color">{{ item.order_qty }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								切刀数:<span class="text-color">{{ item.cutting_qty }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								剖1:<span class="text-color" v-if="config.isnew">{{ item.slitting }}</span>
								<span class="text-color" v-else>{{ item.slitting1 }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								压型:<span class="text-color">{{ item.pressing_type }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								生产刀数:<span class="text-color" v-if="config.updown">{{ item.prod_qty }}</span>
								<span class="text-color" v-else>{{ item.good_qty }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								坏品数:<span class="text-color">{{ item.bad_qty }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								停车次数:<span class="text-color">{{ item.stops }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								停车时间:<span class="text-color">{{ item.stop_time }}</span>
							</span>
						</div>
					</div>
					<div class="text item">
						<div class="flex-box">
							<span class="text">
								压线资料1:<span class="text-color" v-if="config.isnew">{{ item.slitting_data }}</span>
								<span class="text-color" v-else>{{ item.slitting_data1 }}</span>
							</span>
						</div>
					</div>
					<div class="text item" v-show="item.finish_date">
						<span class="text">
							完成时间:<span class="text-color">{{ item.finish_date }}</span>
						</span>
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
					}else{
						self.config.list.pushLoading.loading   = false;
						self.config.list.pushLoading.finished = true
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