<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">员工信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<div role="button" tabindex="0" class="van-cell van-cell--clickable" v-for="(item,index) in info.cell.data" :key="index" @click="cellClick(item.CusId)">
			<div class="van-cell__title">
				<span>{{ item.CusShortName }}</span><br/>
				<span>({{ item.CusId }})</span>
			</div>
			<div class="van-cell__value">
				<span style="color:black;">{{ item.LeftMinAmtCond }}/{{ item.MinAmtCond }}</span>
			</div>
		</div>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title" :position="config.popup.leftPopup.position" :isClose="true">
			<van-field label="员工" readonly v-model="info.leftPopup.data.userName" placeholder="员工" input-align="right" slot="new-popup-1"/>
			<van-field label="欠款合计" readonly v-model="info.leftPopup.data.realAmt" placeholder="欠款合计" input-align="right" slot="new-popup-2"/>
			<van-field label="查询时间" readonly v-model="info.leftPopup.data.queryTime" placeholder="查询时间" input-align="right" slot="new-popup-3"/>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="filterForm.cusId" ></cus-picker>
				<uni-check-box
					:label="config.radio.isStopped.title"
					:localdata="config.radio.isStopped.options"
					:radioData.sync="filterForm.isStopped" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					:label="config.radio.isSettleDay.title"
					:localdata="config.radio.isSettleDay.options"
					:radioData.sync="filterForm.isSettleDay" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
		<cus-amt-detail :detailShow.sync="config.popup.detail.show" :detailCusId="config.popup.detail.cusId"></cus-amt-detail>
	</div>
</template>
<script>
	import { Button, Icon, Field, SwitchCell, Sticky } from 'vant';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import CusAmtDetail from '@/components/subject/cred/CusAmtDetail.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			NewPopup,
			CusPicker,
			PopupFilter,
			RadioCell,
			CusAmtDetail,
			UniCheckBox
		},
		data(){
			return {
				config:{
					popup:{
						leftPopup:{
							show:false,
							title:'员工信息',
							position:'left'
						},
						rightFilter:{
							show:false
						},
						cusPicker:{
							show:false
						},
						detail:{
							show  : false,
							cusId : ''
						}
					},
					switch:{
						checked:false
					},
					radio:{
						isStopped:{
							options:[
								{ title:'全部' ,value:2 },
								{ title:'是' ,value:0 },
								{ title:'否' ,value:1 },
							],
							title:'是否停单'
						},
						isSettleDay:{
							options:[
								{ title:'全部' ,value:2 },
								{ title:'是' ,value:0 },
								{ title:'否' ,value:1 },
							],
							title:'是否月结'
						}
					}
				},
				info:{
					leftPopup:{
						data:{
							userName:'',
							realAmt:'',
							queryTime:''
						}
					},
					cell:{
						data:[]
					}
				},
				filterForm:{
					cusId:'',
					isStopped:2,
					isSettleDay:2
				},
				cusPicker:{
					searchData:'',
				},
				fieldColor : 'field-color'
			}
		},
		methods:{
			getUserInfo(){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.info.leftPopup.data.userName = res.result.user_name
				});
			},
			getInitData( data ){
				let self = this;
				this.$request.staff.cred.wGetCusAmt( data ).then(res=>{
					self.info.leftPopup.data.realAmt = res.result.real_amt;
					self.info.leftPopup.data.queryTime = res.result.query_time;
					self.info.cell.data = res.result.result;
				});
			},
			cellClick( cusId ){
				this.config.popup.detail.cusId = cusId;
				this.config.popup.detail.show  = true;
			},
			resetClick(){
				this.filterForm = {
					cusId:'',
					isStopped:'2',
					isSettleDay:'2'
				};
				this.$refs.cusPicker.cusPickerClean();
				this.config.switch.checked = false;
			},
			filterClick(){
				this.config.popup.rightFilter.show = false;
				this.getInitData( this.filterForm );
			},
			cusPickerCancel(){
				this.config.popup.cusPicker.show = false;
				this.filterForm.cusId = '';
			},
			cusPickerConfirm( result ){
				this.config.popup.cusPicker.show = false;
				this.filterForm.cusId = result.key;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage( 'cred/wGetCusAmt', this.filterForm );
				}else{
					removeStorage( 'cred/wGetCusAmt' );
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户信用余额');
			if( getStorage('cred/wGetCusAmt') !== null  ){
				this.filterForm = JSON.parse( getStorage('cred/wGetCusAmt') );
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getUserInfo();
			this.getInitData( this.filterForm );
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>
<style>
	.van-field__control {
		color:#0bf147;
	}
</style>
