<template>
	<div>
		<van-field 
			v-model="shipper" 
			clickable 
			placeholder="选择发货员" 
			input-align="center" 
			label="发货员" 
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
					v-model="searchData"
					input-align="center"
					:clearable="false" 
					style="width:50%" 
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
		props:['taskName'],
		data(){
			return {
				shipper:this.taskName,
				popupShow:false,
				columns:[],
				defaultIndex:-1,
				searchData:'',
			}
		},
		methods:{
			confirm( value, index ){
				this.defaultIndex = index;
				this.shipper = value.key;
				this.clickOverlay();
			},
			search(){
				let self = this;
				this.$request.staff.stow.getCarPersonInfo({taskNameKey: this.searchData, infoType: '2'}).then(res=>{
					self.columns = [];
					if( res.errorCode != '00000' || res.shipper.length <= 0 ) return 
					res.shipper.forEach((item,index)=>{
						if( self.shipper == item.TaskId ){
							self.defaultIndex = index;
						}
						self.columns.push({
							text: item.TaskName + '(' + item.TaskId + ')' ,
							key: item.TaskId, 
							name: item.TaskName
						});
					});
				}).then(()=>{
					if( this.taskName ){
						this.findShipper(this.taskName)
					}
				});

			},
			clickOverlay(){
				this.popupShow = false;
			},
			clean(){
				this.defaultIndex = -1;
				this.shipper = '';
				this.clickOverlay();
			},
			findShipper( taskName ){
				if( this.columns.length <= 0 || !taskName ){
					this.defaultIndex = -1;
					return false;
				}
				this.columns.forEach((item,index)=>{
					if( item.key == taskName ){
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
			taskName(newV,oldV){
				this.findShipper( newV );
				this.shipper = newV;
			},
			shipper(newV,oldV){
				this.$emit("update:taskName", newV);
			}
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
