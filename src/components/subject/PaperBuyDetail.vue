<template>
	<van-popup v-model="show" :style="{ height: '100%', width: '100%' }" position="top" @click-overlay=" show = false ">
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__title van-ellipsis">
				原纸采购详细信息
			</div>
		</div>
		<div style="margin-top:46px;"></div>
		<van-field label="采购日期" v-model="detailItem.Date" readonly input-align="center"></van-field>
		<van-field label="采购单号" v-model="detailItem.PONo" readonly input-align="center"></van-field>
		<van-field label="供应商" v-model="detailItem.ShortName" readonly input-align="center"></van-field>
		<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;color:#0bf147;font-size:15px;padding:12px 15px;">
			<div class="van-col van-col--3">纸类</div>
			<div class="van-col van-col--4">门幅</div>
			<div class="van-col van-col--3">克重</div>
			<div class="van-col van-col--5">重量(kg)</div>
			<div class="van-col van-col--4">单价</div>
			<div class="van-col van-col--5">收货/采购</div>
		</div>
		<div v-if="tableShow">
			<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;font-size:15px;padding:12px 15px;" v-for="(item,index) in tableList" :key="index">
				<div class="van-col van-col--3">{{ item.PaperCode }}</div>
				<div class="van-col van-col--4">{{ item.PaperWidth }}</div>
				<div class="van-col van-col--3">{{ item.ActWeight }}</div>
				<div class="van-col van-col--5">{{ item.SumWeight }}</div>
				<div class="van-col van-col--4">{{ item.PoPrice }}</div>
				<div class="van-col van-col--5">{{ item.InQty }}/{{ item.Qty }}</div>
			</div>
		</div>
		<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;font-size:15px;padding:12px 15px;">
			<div class="van-col van-col--3"></div>
			<div class="van-col van-col--4">合计</div>
			<div class="van-col van-col--3"></div>
			<div class="van-col van-col--5">{{ tableCount.sumWeight }}</div>
			<div class="van-col van-col--4"></div>
			<div class="van-col van-col--5">{{ tableCount.sumInQty }}/{{ tableCount.sumQty }}</div>
		</div>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0px;" @click="show = false">关闭</van-button>
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
		props:['detailShow','detailItem'],
		data(){
			return {
				show:this.detailShow,
				tableList:[],
				tableShow:false,
				tableCount:{
					sumWeight:'',
					sumInQty:'',
					sumQty:''
				},
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
		},
		mounted(){
			this.paperDetail( this.detailItem );
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			detailShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:detailShow", newV);
			}
		}
	}
</script>