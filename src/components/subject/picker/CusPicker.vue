<template>
	<div>
		<van-field v-model="cusId" clickable @click="popupShow = true" placeholder="选择客户名称" input-align="center" label="客户名称" readonly >
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-popup v-model="popupShow" position="bottom" @click-overlay="cusPickerOverlay()" get-container="body">
			<van-picker show-toolbar :columns="columns" :default-index="defaultIndex" @cancel="cusPickerClean()" @confirm="cusPickerConfirm" cancel-button-text="清空">
				<van-search slot="title" v-model="searchData" @search="cusPickerSearch" :clearable="false" style="width:50%"></van-search>
			</van-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon, Popup, Picker, Field, Search } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
			[Search.name]: Search
		},
		props:['cusName'],
		data(){
			return {
				cusId:this.cusName,
				popupShow:false,
				columns:[],
				defaultIndex:-1,
				searchData:'',
			}
		},
		methods:{
			cusPickerConfirm( value, index ){
				this.defaultIndex = index;
				this.cusId = value.key;

				this.cusPickerOverlay();
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.searchData ).then(res=>{
					self.columns = [];
					if( res.result.length <= 0 ){
						return 
					}
					res.result.forEach((item,index)=>{
						self.columns.push({text:item.CusName + '--' +item.CusId ,key:item.CusId});
					});
				});

			},
			cusPickerOverlay(){
				this.popupShow = false;
			},
			cusPickerClean(){
				this.defaultIndex = -1;
				this.cusId = '';
				this.cusPickerOverlay();
			}
		},
		mounted(){
			this.cusPickerSearch();
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			cusName(newV,oldV){
				this.cusId = newV;
			},
			cusId(newV,oldV){
				this.$emit("update:cusName", newV);
			}
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
