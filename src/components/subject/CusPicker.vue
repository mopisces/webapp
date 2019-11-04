<template>
	<van-popup v-model="popupShow" position="bottom" @click-overlay="cusPickerOverlay()" :close-on-click-overlay="false">
		<van-picker show-toolbar :columns="columns" :default-index="defaultIndex" @cancel="cusPickerCancel()" @confirm="cusPickerConfirm" cancel-button-text="清空">
			<van-search slot="title" v-model="cusName" @search="cusPickerSearch" :clearable="false" style="width:50%"></van-search>
		</van-picker>
	</van-popup>
</template>
<script>
	import { Popup, Field, Picker, Search } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Picker.name]: Picker,
			[Search.name]: Search
		},
		props:['show','searchData','index'],
		data(){
			return {
				columns:[],
				popupShow:this.show,
				defaultIndex:this.index,
				cusName:this.searchData,
			}
		},
		methods:{
			cusPickerCancel(){
				this.$emit('cusPickerCancel');
			},
			cusPickerConfirm( value, index ){
				this.$emit('cusPickerConfirm',{key:value.key,index:index});
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.cusName ).then(res=>{
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
				this.cusPickerCancel();
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
			show(newV,oldV){
				this.popupShow = newV;
			},
			popupShow(newV,oldV){
				this.$emit("update:show", newV);
			},
			index(newV,oldV){
				this.defaultIndex = newV;
			},
			defaultIndex(newV,oldV){
				this.$emit("update:index", newV);
			},
			searchData(newV,oldV){
				this.cusName = newV;
			},
			cusName(newV,oldV){
				this.$emit("update:searchData", newV);
			}
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
