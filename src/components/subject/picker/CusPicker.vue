<template>
	<div>
		<van-field v-model="cusId" clickable @click="popupShow = true" placeholder="选择客户名称" input-align="center" label="客户名称" readonly :error-message="cusCHN">
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

	/*api接口*/
	import { fetchDataList } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
			[Search.name]: Search
		},
		props:['cusName', 'showCHN'],
		data(){
			return {
				popupShow:false,
				columns:[],
				defaultIndex:-1,
				searchData:'',
				cusCHN:'',
			}
		},
		methods:{
			cusPickerConfirm( value, index ){
				this.defaultIndex = index
				this.cusId = value.key
				if( this.showCHN ){
					this.cusCHN = value.name
				}
				this.cusPickerOverlay()
			},
			async cusPickerSearch(){
				this.columns = this.$options.data().columns
				const { result } = await fetchDataList({
					paramType: 'cus', 
					keyWord: this.searchData
				})
				result.forEach((item,idx)=> {
					if( this.cusId == item.CusId ){
						this.cusCHN = item.name;
						this.defaultIndex = idx;
					}
					this.columns.push({text:item.CusName + '--' +item.CusId ,key:item.CusId, name:item.CusName})
				})
				if( this.cusName ) await this.findCus(this.cusName)
			},
			cusPickerOverlay(){
				this.popupShow = false;
			},
			cusPickerClean(){
				this.defaultIndex = -1
				this.cusId = ''
				if( this.showCHN ){
					this.cusCHN = ''
				}
				this.searchData = ''
				this.cusPickerSearch()
				this.cusPickerOverlay()
			},
			findCus( cusId ){
				if( this.columns.length <= 0 || !cusId ){
					this.defaultIndex = -1
					this.cusCHN = ''
					return false
				}
				this.columns.forEach((item,index)=>{
					if( item.key == cusId ){
						this.cusPickerConfirm(this.columns[index],index);
					}
				});
			}
		},
		mounted(){
			this.cusPickerSearch()
		},
		created(){

		},
		computed:{
			cusId: {
				get() {
					return this.$props.cusName
				},
				set( nVal ) {
					this.$emit("update:cusName", nVal)
				}
			}
		},
		watch:{
			/*cusName(newV,oldV){
				this.cusId = newV;
				this.findCus(newV)
			},
			cusId(newV,oldV){
				this.$emit("update:cusName", newV);
			}*/
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
