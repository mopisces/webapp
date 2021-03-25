<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownOption" />
				<van-dropdown-item title="筛选" ref="filter">
					<van-field label="序号" v-model="formData.sn" placeholder="精确查询" input-align="center"/>
					<van-field label="订单号" v-model="formData.orderNumber" placeholder="精确查询" input-align="center"/>
					<van-field label="客户名称" v-model="formData.companyName" placeholder="精确查询" input-align="center" v-if=" root != 2 "/>
					<van-field label="纸质" v-model="formData.paperCode" placeholder="精确查询" input-align="center"/>
					<van-field label="坑型" v-model="formData.fluteType" placeholder="精确查询" input-align="center"/>
					<van-field label="门幅" v-model="formData.width" placeholder="精确查询" input-align="center"/>
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
				</van-dropdown-item>
			</van-dropdown-menu>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<el-card class="box-card" v-for="(item,index) in listInfo" :key="index" :style=" index%2 == 1 ? 'background-color:#f5f7fa;' : '' " :body-style="{ padding: '10px' }">
					<div class="item" v-show="config.updown">
						<van-tag type="danger" mark size="large" v-show=" item.tag === '1' ">上刀</van-tag>
						<van-tag type="primary" mark size="large" v-show=" item.tag === '-1' ">下刀</van-tag>
					</div>
					<div class="item">
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
					<div class="item" v-if=" root != 2 ">
						<span class="text">
							客户名称:<span  class="text-color">{{ item.company_name }}</span>
						</span>
					</div>
					<div class="item">
						<div class="flex-box">
							<span class="text">
								订单数:<span class="text-color">{{ item.quantity }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								门幅:<span class="text-color">{{ item.width }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								纸质:<span class="text-color" v-if=" config.isnew ">{{ item.paper_code }}</span>
								<span class="text-color" v-else>{{ item.paper }}</span>
							</span>
						</div>
					</div>
					<div class="item">
						<div class="flex-box">
							<span class="text">
								坑型:<span class="text-color">{{ item.flute_type }}</span>
							</span>
						</div>
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
					<div class="item">
						<div class="flex-box">
							<span class="text">
								切刀数:<span class="text-color">{{ item.cutting_qty }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								总长:<span class="text-color">{{ item.total_len }}</span>
							</span>
						</div>
						<div class="flex-box" v-show=" config.isnew ">
							<span class="text">
								剖1:<span class="text-color" v-if="config.isnew">{{ item.slitting }}</span>
								<span class="text-color" v-else>{{ item.slitting1 }}</span>
							</span>
						</div>
					</div>
					<div class="item">
						<div class="flex-box">
							<span class="text">
								压型:<span class="text-color">{{ item.pressing_type }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								捆数:<span class="text-color" v-if="config.isnew">{{ item.bundling_qty }}</span>
								<span class="text-color" v-else>{{ item.bundle_qty }}</span>
							</span>
						</div>
						<div class="flex-box">
							<span class="text">
								修边:<span class="text-color">{{ item.trimming }}</span>
							</span>
						</div>
					</div>
					<div class="item">
						<span v-show=" config.isnew ">
							<span class="text">
								压线资料1:<span class="text-color" v-if=" config.isnew ">{{ item.slitting_data }}</span>
								<span class="text-color" v-else>{{ item.slitting_data1 }}</span>
							</span>
						</span>
					</div>
					<div class="item" v-show="item.pre_finishtime">
						<span class="text">
							预计完成时间:<span class="text-color">{{ item.pre_finishtime }}</span>
						</span>
					</div>
				</el-card>	
			</van-list>
		</van-pull-refresh>
		<!-- <div class="oblique-sign-up">上刀</div> -->
	</div>
</template>
<script>
	import { Button, Col, Row, Field, DropdownMenu, DropdownItem, PullRefresh, List, Panel, Sticky, Tag } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Col.name]: Col,
			[Row.name]: Row,
			[Field.name]: Field,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,

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
				listInfo : [],
				root:''
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
				this.$refs.filter.toggle();
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
			this.$store.commit('sg/setTabbar','scdd');
			this.root = sessionStorage.getItem('jpdn-sg-root');
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
<style type="text/css">
	.info-item{
		position: relative;
	}
	.oblique-sign-up {
	    height: 2rem;
		width: 5rem;
		line-height: 1.5rem;
		font-size: 1rem;
		text-align: center;
		color: #fff;
		transform: rotate(45deg);
		position: absolute;
		top: 0;
		right: -2rem;
		background-color: #ff4500;
	}
</style>