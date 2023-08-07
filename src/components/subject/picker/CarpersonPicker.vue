<template>
	<div>
		<van-field 
			v-model="pId" 
			clickable 
			placeholder="选择司机" 
			input-align="center" 
			label="司机编号" 
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
					input-align="center"
					:clearable="false" 
					style="width:50%"
					v-model="searchData" 
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
		props:['carPId'],
		data(){
			return {
				pId:this.carPId,
				popupShow:false,
				columns:[],
				defaultIndex:-1,
				searchData:'',
			}
		},
		methods:{
			confirm( value, index ){
				this.defaultIndex = index;
				this.pId = value.key;
				this.clickOverlay();
			},
			search(){
				let self = this;
				this.$request.staff.stow.getCarPersonInfo({pIdKey: this.searchData, infoType: '3'}).then(res=>{
					self.columns = [];
					if( res.errorCode != '00000' || res.result.length <= 0 ) return 
					res.result.forEach((item,index)=>{
						if( self.pId == item.CarPId ){
							self.defaultIndex = index;
						}
						self.columns.push({
							text: item.CarPId + '(' + item.CarPName + ')' ,
							key: item.CarPId, 
							name: item.CarPName
						});
					});
				}).then(()=>{
					if( this.carPId ){
						this.findPId(this.carPId)
					}
				});

			},
			clickOverlay(){
				this.popupShow = false;
			},
			clean(){
				this.defaultIndex = -1;
				this.pId = '';
				this.clickOverlay();
			},
			findPId( carPId ){
				console.log(!carPId)
				if( this.columns.length <= 0 || !carPId ){
					this.defaultIndex = -1;
					return false;
				}
				this.columns.forEach((item,index)=>{
					if( item.key == carPId ){
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

		},
		watch:{
			carPId(newV,oldV){
				this.findPId( newV );
				this.pId = newV;
			},
			pId(newV,oldV){
				this.$emit("update:carPId", newV);
			}
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
