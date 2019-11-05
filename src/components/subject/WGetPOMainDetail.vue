<template>
	<van-popup v-model="show" :style="{ height: '100%', width: '100%' }" position="top">
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__title van-ellipsis">
				原纸采购详细信息
			</div>
		</div>
		<div style="margin-top:46px;"></div>
		<van-field label="采购日期" v-model="fieldData.date" readonly input-align="center"></van-field>
		<van-field label="采购单号" v-model="fieldData.pONo" readonly input-align="center"></van-field>
		<van-field label="供应商" v-model="fieldData.shortName" readonly input-align="center"></van-field>
		<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;color:#0bf147;font-size:16px;">
			<div class="van-col van-col--3">纸类</div>
			<div class="van-col van-col--4">门幅</div>
			<div class="van-col van-col--4">克重</div>
			<div class="van-col van-col--4">重量(kg)</div>
			<div class="van-col van-col--4">单价</div>
			<div class="van-col van-col--5">收货/采购</div>
		</div>
		<div v-if="tableShow">
			<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;font-size:14px;margin-top:8px;" v-for="(item,index) in tableList" :key="index">
				<div class="van-col van-col--3">{{ item.PaperCode }}</div>
				<div class="van-col van-col--4">{{ item.PaperWidth }}</div>
				<div class="van-col van-col--4">{{ item.ActWeight }}</div>
				<div class="van-col van-col--4">{{ item.SumWeight }}</div>
				<div class="van-col van-col--4">{{ item.PoPrice }}</div>
				<div class="van-col van-col--5">{{ item.InQty }}/{{ item.Qty }}</div>
			</div>
		</div>
		<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;font-size:14px;">
			<div class="van-col van-col--3"></div>
			<div class="van-col van-col--4">合计</div>
			<div class="van-col van-col--4"></div>
			<div class="van-col van-col--4">{{ tableCount.sumWeight }}</div>
			<div class="van-col van-col--4"></div>
			<div class="van-col van-col--5">{{ tableCount.sumInQty }}/{{ tableCount.sumQty }}</div>
		</div>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:55px;">关闭</van-button>
	</van-popup>
</template>
<script>
	import { Popup, Button, Field } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[Button.name]: Button,
			[Field.name]: Field,
		},
		props:['detailShow'],
		data(){
			return {
				show:true,
				fieldData:{
					shortName:'',
					pONo:'',
					date:''
				},
				tableList:[],
				tableShow:false,
				tableCount:{
					sumWeight:'',
					sumInQty:'',
					sumQty:''
				}
			}
		},
		methods:{
			paperDetail( data ){
				let self = this;
				this.$request.staff.paperbuy.paperDetail( data ).then(res=>{
					self.tableList = res.result.result;
					self.tableCount.sumWeight = res.result.sum_sum_weight;
					self.tableCount.sumInQty  = res.result.sum_in_qty;
					self.tableCount.sumQty    = res.result.sum_qty;
				}).then(()=>{
					this.$nextTick(()=>{
						this.tableShow = true;
					})
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸采购--详细信息');
			if( sessionStorage.getItem('wGetPOMainDetail') !== null ){
				let storage = JSON.parse(sessionStorage.getItem('wGetPOMainDetail'));
				this.fieldData.shortName = storage.ShortName;
				this.fieldData.pONo = storage.PONo;
				this.fieldData.date = storage.PODate;
			}else{
				this.$router.go(-1);
			}
		},
		mounted(){
			this.paperDetail( this.fieldData );
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