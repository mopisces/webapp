<template>
	<div>
		<!--内部用户-扫描装货详情-->
		<div v-if=" field === 'stowDetailHandle' ">
			<van-button plain hairline type="primary" @click="modifyData()" size="small" color="#000">
				修改
			</van-button>
			<van-button plain hairline type="primary" @click="deleteData()" size="small" color="#000">
				删除
			</van-button>
		</div>
		<!--内部用户-扫描装货-->
		<div v-if=" field === 'stowDelivery' ">
			<van-button plain hairline type="primary" @click="prepare()" size="small" v-if=" rowData.CarState == 0 " color="#000">
				准备
			</van-button>
			<van-button plain hairline type="primary" @click="cancelPre()" size="small" v-if=" rowData.CarState == 1 " color="#000">
				取消准备
			</van-button>
		</div>
		<div v-if=" field === 'stowDetail' && Number(rowData.DNCount) > 0">
			<van-button plain hairline type="primary" @click="detail()" size="small" color="#000">
				明细
			</van-button>
		</div>
		<div v-if=" field === 'stowLoading' && rowData.CarState == 0 ">
			<van-button plain hairline type="primary" @click="load()" size="small" color="#000">
				装货
			</van-button>
		</div>
		<!--内部用户-直接入库-->
		<div v-if=" field === 'directInStock' ">
			<van-button plain hairline type="danger" @click="operate()" size="small">
				操作
			</van-button>
		</div>
		<!--内部用户-库存修改-->
		<div v-if=" field === 'stockOperate' ">
			<van-button type="info" @click="stockOperate()" size="small">
				修改
			</van-button>
		</div>
		<!--外部用户-每日订单-->
		<div v-if=" field === 'dailyDetail' ">
			<van-button plain hairline type="primary" @click="dailyDetail()" size="small">
				详情
			</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Dialog, Toast  } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Toast.name]: Toast,
		},
		props:['rowData','field','index'],
		data(){
			return {
				userInfo:{
					strFactoryId : '',
					strUserId    : '',
				}
			}
		},
		methods:{
			modifyData(){
				let params = {type:'edit',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
			},
			deleteData(){
				let params = {type:'delete',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
			},
			prepare(){
				Dialog.confirm({
					message: '确定准备吗?'
				}).then(()=>{
					if( this.rowData.CarCode === '' ){
						Toast.fail('请选择车牌');
						return ;
					}
					if( this.rowData.CarPId === '' ){
						Toast.fail('请选择司机');
						return ;
					}
					this.getUserInfo('prepare');
				}).catch(()=>{
					Dialog.close();
				});
			},
			cancelPre(){
				Dialog.confirm({
					message: '确定取消准备吗?'
				}).then(()=>{
					this.getUserInfo('cancelPre');
				}).catch(()=>{
					Dialog.close();
				});
			},
			detail(){
				this.$router.push({
					path:'/staff/stow/detail',
					query:{
						isEdit    : 0,
						listNo    : this.rowData.PListNo,
						orderType : this.rowData.OrderType
					}
				});
			},
			load(rowData,index){
				this.$router.push({
					path:'/staff/stow/detail',
					query:{
						isEdit    : 1,
						listNo    : this.rowData.PListNo,
						orderType : this.rowData.OrderType
					}
				});
			},
			operate(){
				let params = {type:'operate',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
			},
			stockOperate(){
				let params = {type:'stockOperate',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
			},
			getUserInfo( type ){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.userInfo.strFactoryId = res.result.factory_id;
					self.userInfo.strUserId    = res.result.erp_id;
				}).then(()=>{
					this.$nextTick(()=>{
						let params = {type:type,index:this.index,rowData:this.rowData,userInfo:this.userInfo};
						this.$emit('on-custom-comp',params);
					})
				});
			},
			dailyDetail(){
				this.$emit('on-custom-comp',{index:this.index});
			}
		},
		created(){

		},
		mounted(){

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