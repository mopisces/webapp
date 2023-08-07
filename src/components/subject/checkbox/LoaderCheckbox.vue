<template>
	<div>
		<van-field 
			v-model="floader" 
			type="textarea"
			clickable 
			placeholder="选择装货员" 
			input-align="center" 
			label="装货员" 
			readonly
			:autosize="true"
			@click="popupShow = true">
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-popup 
			v-model="popupShow" 
			position="bottom"
			get-container="body" 
			:style="{ height: '17rem' }"
			@click-overlay="OverlayClick()" >
			<div class="loader-popup-container">
	       		<van-checkbox-group v-model="checkBoxResult" ref="loaderCheckbox" style="width:100%;" @change="checkboChange">
					<van-cell-group>
						<van-cell  v-for="(item,index) in columns" clickable :key="index" @click="toggle(index)">
							<template slot="title">
								{{item.text}}
							</template>
							<van-checkbox slot="right-icon" :name="item.key" ref="checkboxes" /> 
						</van-cell>
					</van-cell-group>
				</van-checkbox-group>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import {  Cell, CellGroup, Icon, Popup, Checkbox, CheckboxGroup, Field, Search } from 'vant';
	export default {
		components:{
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Field.name]: Field,
			[Search.name]: Search
		},
		props:['loader'],
		data(){
			return {
				checkBoxResult: [],
				floader: this.loader,
				searchData: '',
				popupShow: false,
				columns: [],
			}
		},
		methods:{
			OverlayClick(){
				this.popupShow = false;
			},
			search(){
				let self = this;
				this.$request.staff.stow.getCarPersonInfo({taskNameKey: this.searchData, infoType: '1'}).then(res=>{
					self.columns = [];
					if( res.errorCode != '00000' || res.loader.length <= 0 ) return 
					/*for(let i = 1; i<=100; i++){
						self.columns.push({
							text: i ,
							key: i, 
							name: i
						});
					}*/
					res.loader.forEach((item,index)=>{
						self.columns.push({
							text: item.TaskName + '(' + item.TaskId + ')' ,
							key: item.TaskId, 
							name: item.TaskName
						});
					});
				})
			},
			toggle(index){
				this.$refs.checkboxes[index].toggle();
			},
			checkboChange(data){
				if( data.length == 0 ){
					this.floader = '';
				}
				if( data.length > 0 ){
					let str = ''
					data.forEach((item,idx)=>{
						if( idx == (data.length - 1) ){
							str += item;
						}else{
							str += item + ',';
						}
						
					});
					this.loader = str;
				}
			}
		},
		created(){
			
		},
		mounted(){
			this.search();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			loader( newV,oldV ){
				//清空
				if( !newV ){
					this.$refs.loaderCheckbox.toggleAll(false);
				}
				this.floader = newV;
			},
			floader( newV,oldV ){
				this.$emit("update:loader", newV);
			}
		}
	}
</script>
<style>
	.loader-popup-container{
		width: 100%;
	    height: 17rem;
	    box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    flex-direction: column;
	}
</style>