<template>
	<div>
		<div v-if=" field === 'stowDetailHandle' ">
			<button class="van-button van-button--primary van-button--mini van-button--plain van-button--hairline van-hairline--surround"  @click="modifyData()">
	   			<span class="van-button__text">修改</span>
	   		</button>
			<button class="van-button van-button--primary van-button--mini van-button--plain van-button--hairline van-hairline--surround"  @click="deleteData()">
	   			<span class="van-button__text">删除</span>
	   		</button>
		</div>
		<div v-if=" field === 'stowDelivery' ">
			<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="update()" v-if=" rowData.CarState == 0 ">
	   			<span class="van-button__text">准备</span>
	   		</button>
			<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="update()" v-if="rowData.CarState == 1 ">
	   			<span class="van-button__text">取消准备</span>
	   		</button>
		</div>
		<div v-if=" field === 'stowDetail' ">
			<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="detail()">
				<span class="van-button__text">明细</span>
			</button>
		</div>
		<div v-if=" field === 'stowLoading' ">
			<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="load()">
				<span class="van-button__text">装货</span>
			</button>
		</div>
		<div v-if=" field === 'directInStock' ">
			<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="operate()">
				<span class="van-button__text">操作</span>
			</button>
		</div>
	</div>
</template>
<script>
	import { Button } from 'vant';
	export default {
		components:{
			[Button.name]: Button
		},
		props:['rowData','field','index'],
		data(){
			return {

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
				let params = {type:'prepare',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
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