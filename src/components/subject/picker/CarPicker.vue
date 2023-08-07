<template>
	<div>
		<van-field 
			v-model="car" 
			clickable 
			placeholder="选择车辆" 
			input-align="center" 
			label="车牌编号" 
			readonly
			@click="popupShow = true" 
		>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-popup 
			v-model="popupShow" 
			position="bottom"
			get-container="body"
			@click-overlay="clickOverlay()" 
		>
			<van-picker 
				show-toolbar 
				:columns="columns" 
				:default-index="defaultIndex"
				cancel-button-text="清空"
				@cancel="clean()" 
				@confirm="confirm"
			>
				<van-search 
					slot="title" 
					v-model="searchDataUpper" 
					input-align="center"
					:clearable="false" 
					@search="search" 
				></van-search>
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
		props:['carCode'],
		data(){
			return {
				car:this.carCode,
				popupShow:false,
				columns:[],
				defaultIndex:-1,
				searchData:'',
			}
		},
		methods:{
			confirm( value, index ){
				this.defaultIndex = index;
				this.car = value.key;
				this.$emit("modifyPId", this.columns[index]);
				this.clickOverlay();
			},
			search(){
				let self = this;
				this.$request.staff.stow.getCarPersonInfo({carCodeKey: this.searchData, infoType: '3'}).then(res=>{
					self.columns = [];
					if( res.errorCode != '00000' || res.result.length <= 0 ) return 
					res.result.forEach((item,index)=>{
						if( self.car == item.CarCode ){
							self.defaultIndex = index;
						}
						self.columns.push({
							text: item.CarCode + '(' + item.CarNo + ')' ,
							key: item.CarCode, 
							name: item.CarNo,
							pId: item.CarPId
						});
					});
				}).then(()=>{
					if( this.carCode ){
						this.findCar(this.carCode)
					}
				});

			},
			clickOverlay(){
				this.popupShow = false;
			},
			clean(){
				this.defaultIndex = -1;
				this.car = '';
				this.clickOverlay();
			},
			findCar( carCode ){
				if( this.columns.length <= 0 || !carCode ){
					this.defaultIndex = -1;
					return false;
				}
				this.columns.forEach((item,index)=>{
					if( item.key == carCode ){
						this.confirm(this.columns[index],index);
					}
				});
			}
		},
		mounted(){
			this.search();
		},
		created(){

		},
		computed:{
			searchDataUpper: {
				get: function () {
					return this.searchData;
				},
				set: function (newV) {
					this.searchData = newV.toUpperCase();
				}
			}
		},
		watch:{
			carCode(newV,oldV){
				this.findCar( newV );
				this.car = newV;
			},
			car(newV,oldV){
				this.$emit("update:carCode", newV);
			}
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
