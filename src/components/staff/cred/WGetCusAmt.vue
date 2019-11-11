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
		<van-cell-group>
			<van-cell :title="item.CusShortName + '(' + item.CusId + ')' " is-link :value="item.LeftMinAmtCond + '/' + item.MinAmtCond " v-for="(item,index) in info.cell.data" :key="index" @click="cellClick(item.CusId)"/>
		</van-cell-group>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title" :position="config.popup.leftPopup.position" :isClose="true">
			<van-field label="员工" readonly v-model="info.leftPopup.data.userName" placeholder="员工" input-align="center" slot="new-popup-1"/>
			<van-field label="欠款合计" readonly v-model="info.leftPopup.data.realAmt" placeholder="欠款合计" input-align="center" slot="new-popup-2"/>
			<van-field label="查询时间" readonly v-model="info.leftPopup.data.queryTime" placeholder="查询时间" input-align="center" slot="new-popup-3"/>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<van-field readonly clickable label="客户名称" v-model="filterForm.cusId" placeholder="选择客户名称" input-align="center" @click="config.popup.cusPicker.show = true" slot="filter-field-1"></van-field>
			<radio-cell :radioInfo.sync="filterForm.isStopped" :radioColumns="config.radio.isStopped.options" :title="config.radio.isStopped.title" slot="filter-field-2"></radio-cell>
			<radio-cell :radioInfo.sync="filterForm.isSettleDay" :radioColumns="config.radio.isSettleDay.options" :title="config.radio.isSettleDay.title" slot="filter-field-3"></radio-cell>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" />
		</popup-filter>
		<cus-picker ref="cusPicker" :show.sync="config.popup.cusPicker.show" :searchData.sync="cusPicker.searchData" @cusPickerCancel="cusPickerCancel" @cusPickerConfirm="cusPickerConfirm">
		</cus-picker>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Field, SwitchCell, Sticky } from 'vant';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import CusPicker from '@/components/subject/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			NewPopup,
			CusPicker,
			PopupFilter,
			RadioCell
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
				}
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
				sessionStorage.setItem('cred/wGetCusAmt/cusId',cusId);
				this.$router.push('/staff/cred/cusAmtDetail');
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
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户信用余额');
			if( sessionStorage.getItem('cred/wGetCusAmt') !== null  ){
				this.filterForm = JSON.parse(sessionStorage.getItem('cred/wGetCusAmt'));
				this.config.switch.checked = true;
			}	
		},
		mounted(){
			this.getUserInfo();
			this.getInitData( this.filterForm );
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('cred/wGetCusAmt',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('cred/wGetCusAmt');
			}
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>