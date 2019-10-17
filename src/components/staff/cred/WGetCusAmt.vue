<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">员工信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<van-cell-group>
			<van-cell :title="item.CusShortName + '(' + item.CusId + ')' " is-link :value="item.LeftMinAmtCond + '/' + item.MinAmtCond " v-for="(item,index) in info.cell.data" :key="index" @click="cellClick(item.CusId)"/>
		</van-cell-group>
		<left-popup :leftShow="config.popup.leftPopup.show" @closeLeft="closeLeft()" :title="config.popup.leftPopup.title">
			<van-field label="员工" readonly v-model="info.leftPopup.data.taskId" placeholder="员工" input-align="center" slot="left-popup-1"/>
			<van-field label="欠款合计" readonly v-model="info.leftPopup.data.realAmt" placeholder="欠款合计" input-align="center" slot="left-popup-2"/>
			<van-field label="查询时间" readonly v-model="info.leftPopup.data.queryTime" placeholder="查询时间" input-align="center" slot="left-popup-3"/>
		</left-popup>
	</div>
</template>
<script>
	import { Button, Field, Cell, CellGroup, Sticky  } from 'vant';
	import LeftPopup from '@/components/subject/LeftPopup.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Sticky.name]: Sticky,

			LeftPopup
		},
		data(){
			return {
				active:0,
				config:{
					popup:{
						leftPopup:{
							show:false,
							title:'员工信息'
						}
					}
				},
				info:{
					leftPopup:{
						data:{
							taskId:'该数据暂缺',
							realAmt:'',
							queryTime:''
						}
					},
					cell:{
						data:[]
					}
				},
				filterForm:{

				}
			}
		},
		methods:{
			closeLeft(){
				this.config.popup.leftPopup.show = false;
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
			}
		},
		mounted(){
			this.getInitData( this.filterForm );
		},
		created(){
				
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>