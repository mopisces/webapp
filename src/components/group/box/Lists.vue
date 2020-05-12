<template>
	<div>
		<van-sticky :offset-top="46">
		<!-- <van-dropdown-menu>
			<van-dropdown-item v-model="formData.filterName" :options="config.filterOptions" />
		</van-dropdown-menu> -->
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="formData.state">
			<van-tab name="1">
				<div slot="title">
					<van-icon class-prefix="iconfont" name="huore" size="16"/>正在抢购
				</div>
			</van-tab>
			<van-tab name="2">
				<div slot="title">
					<van-icon class-prefix="iconfont" name="jijiang" size="16"/>即将开抢
				</div>
			</van-tab>
			<van-tab name="3">
				<div slot="title">
					<van-icon class-prefix="iconfont" name="jieshu1" size="16"/>已结束
				</div>
			</van-tab>
		</van-tabs>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100" :immediate-check="false">
				<van-card v-for="(item,index) in listData" :key=" 'card' + index " @click="detailClick( item.Id, 0 )">
					<van-image slot="thumb" :src="item.thumb" width="90" height="90"/>
					<div slot="title">
						{{ item.BoardId }}
					</div>
					<div slot="desc">
						<span v-if="item.Title != ''">
							{{ item.Title }}
						</span>
						<van-count-down :time="item.time">
							<template v-slot="timeData">
								<span style="font-size:0.75rem;">剩余时间:</span>
								<span class="item">{{ timeData.days }}天</span>
								<span class="item">{{ timeData.hours }}小时</span>
								<span class="item">{{ timeData.minutes }}分</span>
								<span class="item">{{ timeData.seconds }}秒</span>
							</template>
						</van-count-down>
					</div>
					<div slot="price" style="font-size:1rem;">
						¥{{ item.Price }}/㎡
					</div>
					<div slot="origin-price" style="font-size:0.8rem;">
						¥{{ item.MarketPrice }}/㎡
					</div>
					<van-tag mark type="danger" slot="tag" v-if="item.IsFlag == 1 ">{{ config.flagName }}</van-tag>
					<div slot="tags">
						<div class="progress-bar">
			                <div class="liquid" :style="'width: ' + item.SalePercent + '%;'"></div>
			                <div class="descr">已抢{{ item.SalePercent }}%</div>
			            </div>
					</div>
				</van-card>
			</van-list>
		</van-pull-refresh>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="formData.filterName" :radioColumns="config.radio.filterName.options" :title="config.radio.filterName.title" v-if="config.radio.filterName.show">
				</radio-cell>
				<van-field label="长度(mm)">
					<div class="van-row van-row--flex van-row--justify-center" slot="input">
						<div class="van-col van-col--11">
							<input type="number" v-model="formData.boxLMin" class="van-field__control van-field__control--center"/>
						</div>
						<div class="van-col van-col--2" style="text-align:center;">
							~ 
						</div>
						<div class="van-col van-col--11">
							<input type="number" v-model="formData.boxLMax" class="van-field__control van-field__control--center"/>
						</div>
					</div>
				</van-field>
				<van-field label="宽度(mm)">
					<div class="van-row van-row--flex van-row--justify-center" slot="input">
						<div class="van-col van-col--11">
							<input type="number" v-model="formData.boxWMin" class="van-field__control van-field__control--center"/>
						</div>
						<div class="van-col van-col--2" style="text-align:center;">
							~ 
						</div>
						<div class="van-col van-col--11">
							<input type="number" v-model="formData.boxWMax" class="van-field__control van-field__control--center"/>
						</div>
					</div>
				</van-field>
				<van-field label="高度(mm)">
					<div class="van-row van-row--flex van-row--justify-center" slot="input">
						<div class="van-col van-col--11">
							<input type="number" v-model="formData.boxHMin" class="van-field__control van-field__control--center"/>
						</div>
						<div class="van-col van-col--2" style="text-align:center;">
							~ 
						</div>
						<div class="van-col van-col--11">
							<input type="number" v-model="formData.boxHMax" class="van-field__control van-field__control--center"/>
						</div>
					</div>
				</van-field>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Image, Field, PullRefresh, Toast, CountDown, List, Sticky, Tag, Tab, Tabs, Card } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Field.name]: Field,
			[PullRefresh.name]: PullRefresh,
			[Toast.name]: Toast,
			[CountDown.name]: CountDown,
			[List.name]: List,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Card.name]: Card,

			PopupFilter,
			RadioCell
		},
		data(){
			return {
				config : {
					list : {
						pullRefresh:{
							reloading : false,
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					},
					flagName:'',
					popup:{
						filterShow:false
					},
					radio:{
						filterName:{
							title   : '筛选条件',
							show    : false,
							options : [],
						}
					}
				},
				formData:{
					state      : '1',
					isTaoBao   : 1,
					filterName : '全部',
					curPage    : 1,
					boxLMin    : 0,
					boxLMax    : 9999,
					boxWMin    : 0,
					boxWMax    : 9999,
					boxHMin    : 0,
					boxHMax    : 9999,
				},
				listData : []
			}
		},
		methods:{
			pullOnRefresh(){
				this.listData = [];
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.formData.curPage = 1;
				this.getBoardList();
			},
			onLoad(){
				this.formData.curPage++;
				this.getBoardList();
			},
			getBoardList(){
				let self = this;
				this.$request.client.groupBuying.groupBuyList( this.formData ).then(res=>{
					if( res.result == null || res.result.length < 7 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					if( res.errorCode == '20250' ){
						res.result = [];
						return ;
					}
					res.result.forEach((item,index)=>{
						item.time  = ( Number(item.EndTime) - Number(item.CurTime) ) * 1000;
						if( item.Pic ){
							item.thumb = this.$store.state.common.imgUrl + item.Pic;
						}else{
							item.thumb = this.$store.state.common.imgUrl + 'zwtp.png';
						}
						self.listData.push(item);
					});
				});
			},
			getFilterName(){
				this.config.filterOptions = [];
				this.formData.filterName  = '全部';
				let self = this;
				this.$request.client.groupBuying.groupBuyFilter( this.formData ).then(res=>{
					if( res.errorCode != '00000' ){
						self.config.radio.filterName.options.push({ title:'暂无数据',value:'暂无数据'});
					}else{
						self.config.radio.filterName.options = [];
						res.result.forEach((item)=>{
							self.config.radio.filterName.options.push({title:item,value:item})
						});
						self.config.radio.filterName.show = true;
					}
				});
			},
			detailClick( cardId ){
				this.$router.push({ name:'boxDetail', params:{ productId:cardId } });
				sessionStorage.setItem('group-product-id',cardId);
			},
			getFlagName(){
				let self = this;
				this.$request.client.groupBuying.flagName( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.flagName = res.result;
					}
				});
			},
			resetClick(){
				this.formData = {
					state      : this.formData.state,
					isTaoBao   : 1,
					filterName : '全部',
					curPage    : 1,
					boxLMin    : 0,
					boxLMax    : 9999,
					boxWMin    : 0,
					boxWMax    : 9999,
					boxHMin    : 0,
					boxHMax    : 9999,
				};
			},
			filterClick(){
				this.pullOnRefresh();		
			}
		},
		created(){
			this.config.list.pushLoading.loading = false;
			this.$store.commit('client/setHeaderTitle','淘宝箱团购');
			this.getBoardList();
			this.getFilterName();
			this.getFlagName();
		},
		mounted(){
			
		},
		updated(){
			
		},
		destroyed(){

		},
		computed:{
			stateChange(){
				return this.formData.state;
			}/*,
			filterNameChange(){
				return this.formData.filterName;
			}*/
		},
		watch:{
			stateChange( newV,oldV ){
				this.pullOnRefresh();
				this.getFilterName();
			}/*,
			filterNameChange( newV,oldV ){
				this.pullOnRefresh();
			}*/
		}
	}
</script>
<style>
	.item {
		width: 2.5625rem;
		color: #fff;
		font-size: 0.75rem;
		text-align: center;
		background-color: #ee0a24;
		margin-right: 0.3125rem;
	}
	.progress-bar {
        margin: 0.3125rem auto;
        width: 90%;
        height: 1rem;
        background-color: #fff;
        border: 0.0625rem solid #fc91b1;
        border-radius: 0.9375rem;
        overflow: hidden;
        position: relative;
    }
    .progress-bar .liquid {
        height: 100%;
        background-color: #fedee8;
        border-radius: 0.9375rem;
    }
    .progress-bar .descr {
        width: 100%;
        line-height: 0.8rem;
        color: #e60044;
        font-size: 0.8rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: absolute;
        top: 0;
    }
</style>