<template>
	<van-popup :value="show" position="bottom" @click-overlay="cusPickerOverlay()" :close-on-click-overlay="false">
		<van-picker show-toolbar :columns="columns" :default-index="defaultIndex" @cancel="cusPickerCancel()" @confirm="cusPickerConfirm" cancel-button-text="清空">
			<van-search slot="title" v-model="filterForm.cusName" @search="cusPickerSearch" @input="cusPickerInput" :clearable="false" style="width:50%"></van-search>
		</van-picker>
	</van-popup>
</template>
<script>
	import { Popup, Search, Picker, Field } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[Search.name]: Search,
			[Picker.name]: Picker,
			[Field.name]: Field,
		},
		props:{
			show:{
				type:Boolean,
				default:false,
				required:true
			},
			searchData:{
				type:String,
				default:'',
				required:true
			},
			index:{
				required:true,
				default:-1,
			}
		},
		data(){
			return {
				columns:[],
				defaultIndex:this.index,
				filterForm:{
					cusName:this.searchData,
				},
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
				this.$request.staff.frec.cusPicker( this.filterForm.cusName ).then(res=>{
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
			},
			cusPickerInput(value){
				console.log(value);
			}
		},
		mounted(){
			this.cusPickerSearch();
		},
		created(){
			let itemName = this.$parent.getPageName();
			if( sessionStorage.getItem(itemName + '---pageConfig') !== null ){
				try{
					let pageConfig = JSON.parse(sessionStorage.getItem(itemName + '---pageConfig'));
					this.defaultIndex = pageConfig.defaultIndex;
				}catch(err){
					sessionStorage.removeItem(itemName + '---pageConfig');
				}
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>