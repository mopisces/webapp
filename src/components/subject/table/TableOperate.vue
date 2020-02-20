<template>
	<div>
		<div v-if=" field === 'stowDetailHandle' ">
			<van-button plain hairline type="primary" @click="modifyData()" size="small" color="#000">修改</van-button>
			<van-button plain hairline type="primary" @click="deleteData()" size="small" color="#000">删除</van-button>
			<!-- <button class="van-button van-button--primary van-button--mini van-button--plain van-button--hairline van-hairline--surround"  @click="modifyData()">
				   			<span class="van-button__text">修改</span>
				   		</button>
			<button class="van-button van-button--primary van-button--mini van-button--plain van-button--hairline van-hairline--surround"  @click="deleteData()">
				   			<span class="van-button__text">删除</span>
				   		</button> -->
		</div>
		<div v-if=" field === 'stowDelivery' ">
			<van-button plain hairline type="primary" @click="prepare()" size="small" v-if=" rowData.CarState == 0 " color="#000">准备</van-button>
			<van-button plain hairline type="primary" @click="cancelPre()" size="small" v-if=" rowData.CarState == 1 " color="#000">取消准备</van-button>
			<!-- <button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="prepare()" v-if=" rowData.CarState == 0 ">
				   			<span class="van-button__text">准备</span>
				   		</button>
			<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="cancelPre()" v-if="rowData.CarState == 1 ">
				   			<span class="van-button__text">取消准备</span>
				   		</button> -->
		</div>
		<div v-if=" field === 'stowDetail' ">
			<van-button plain hairline type="primary" @click="detail()" size="small" color="#000">明细</van-button>
			<!-- <button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="detail()">
				<span class="van-button__text">明细</span>
			</button> -->
		</div>
		<div v-if=" field === 'stowLoading' && rowData.CarState == 0 ">
			<van-button plain hairline type="primary" @click="load()" size="small" color="#000">装货</van-button>
			<!-- <button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="load()">
				<span class="van-button__text">装货</span>
			</button> -->
		</div>
		<div v-if=" field === 'directInStock' ">
			<van-button plain hairline type="danger" @click="operate()" size="small">操作</van-button>
			<!-- <button class="van-button van-button--danger van-button--small van-button--round"  @click="operate()">
				<span class="van-button__text">操作</span>
			</button> -->
		</div>
		<div v-if=" field === 'stockOperate' ">
			<van-button plain hairline type="primary" @click="stockOperate()" size="small">修改</van-button>
			<!-- <button class="van-button van-button--primary van-button--small"  @click="stockOperate()">
				<span class="van-button__text">修改</span>
			</button> -->
		</div>
		<div v-if=" field === 'dailyDetail' ">
			<van-button plain hairline type="primary" @click="dailyDetail()" size="small">详情</van-button>
			<!-- <button class="van-button van-button--primary van-button--small"  @click="dailyDetail()">
				<span class="van-button__text">详情</span>
			</button> -->
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