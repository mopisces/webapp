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
		<div v-if=" field === 'stowListModify' ">
			<van-button plain hairline type="primary" @click="stowListModify()" size="small" v-if=" rowData.CarState == 0 " color="#000">
				修改
			</van-button>
		</div>
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
			<van-button plain hairline type="primary" size="small" @click="dailyDetail()"  v-if=" rowData.last != 1 ">
				详情
			</van-button>
			<van-button plain hairline type="primary" size="small" @click="clacAmtOrd()" v-else>
				计算汇总金额
			</van-button>
		</div>
		<!--导航模块-->
		<div v-if=" field === 'amapPDNCus' ">
			<van-button plain hairline type="primary" size="small" @click="amapPDNCusOperate('detail')">
				详情
			</van-button>
			<van-button plain hairline type="primary" size="small" @click="amapPDNCusOperate('refresh')">
				刷新
			</van-button>
		</div>
		<!--司机点击完成送货单-->
		<div v-if=" field === 'finishDelivery' ">
			<van-button plain hairline type="primary" size="small" @click="finishDelivery()">
				完成送货
			</van-button>
		</div>
		<!-- 外部用户-对账单表格 -->
		<div v-if=" field === 'cusFreeMBTable' ">
			<van-button plain hairline type="primary" size="small" @click="cusFreeMBDetail()">
				详细
			</van-button>
		</div>
		<!-- 内部用户-调整信用额度 -->
		<div v-if=" field === 'adjustCusContact' ">
			<van-button plain hairline type="primary" size="small" @click="adjustCusContact()">
				调整
			</van-button>
		</div>
		<!-- 导航模块 单选
		<div v-if=" field === 'amapPDNCusRadio' ">
			<van-radio-group v-model="selectNo">
				<van-radio name="1" shape="square">{{rowData.PListNo}}</van-radio>
			</van-radio-group>
		</div> -->
	</div>
</template>
<script>
	import { Button, RadioGroup, Radio, Dialog, Toast  } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[Toast.name]: Toast,
		},
		props:['rowData','field','index'],
		data(){
			return {
				userInfo:{
					strFactoryId : '',
					strUserId    : '',
				},
				selectNo:this.rowData.PListNo
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
			stowListModify(){
				this.$emit('on-custom-comp',{type: 'modify', index:this.index, rowData:this.rowData});
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
				this.$emit('on-custom-comp',{type:'detail',index:this.index});
			},
			clacAmtOrd(){
				this.$emit('on-custom-comp',{type:'clacAmtOrd',index:this.index});
			},
			amapPDNCusOperate(type){
				this.$emit('on-custom-comp',{type:type,index:this.index,rowData:this.rowData});
			},
			finishDelivery(){
				this.$emit('on-custom-comp',{rowData:this.rowData});
			},
			cusFreeMBDetail(){
				this.$emit('on-custom-comp',{rowData:this.rowData});
			},
			adjustCusContact(){
				this.$emit('on-custom-comp',{rowData:this.rowData});
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
			rowDataNo(){
				return this.rowData.PListNo;
			}
		},
		watch:{
			rowDataNo(newV,oldV){
				this.selectNo = newV;
			},
			selectNo(newV,oldV){
				this.$emit("update:rowDataNo", newV);
			}
		}
	}
</script>