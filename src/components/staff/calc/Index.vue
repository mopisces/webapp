<template>
	<div>
		<van-tabs v-model="config.tabs.active" sticky>
			<van-tab :title="item" v-for="item in config.tabs.title">
				<van-cell-group>
					<van-field readonly clickable label="客户" :value="commonForm.cusName"  placeholder="选择客户" @click="cusPicker()" required></van-field>
					<van-field readonly clickable label="材质" :value="commonForm.texName"  placeholder="选择材质" @click="texPicker()" required></van-field>
					<van-cell title="加修边" is-link>
						<van-switch v-model="checked" slot="right-icon"/>
					</van-cell>
					<van-cell title="加面积" is-link>
						<van-switch v-model="checked" slot="right-icon"/>
					</van-cell>
					<van-cell title="毛片" is-link>
						<van-switch v-model="checked" slot="right-icon"/>
					</van-cell>
					<template v-if="config.tabs.active == 0 ">
						<van-cell title="规格(mm)" is-link>
							<div slot="right-icon">
								<input type="number" placeholder="板长" class="cell-input">
	                    		x
	                    		<input type="number" placeholder="板宽" class="cell-input">
							</div>
						</van-cell>
						<van-field v-model="value" placeholder="压线和=板宽(格式：x+x+x)" label="压线" />
					</template>
					<template v-if="config.tabs.active == 1 ">
						<van-field readonly clickable label="箱型" :value="boxForm.boxName"  placeholder="选择箱型" @click="boxPicker()" required></van-field>
						<van-cell title="规格" is-link >
							<div slot="right-icon">
								<input type="number" placeholder="箱长(mm)" class="cell-input" >
	                    		x
	                    		<input type="number" placeholder="箱宽(mm)" class="cell-input">
	                    		x
	                    		<input type="number" placeholder="箱高(mm)" class="cell-input">
							</div>
						</van-cell>
						<van-field v-model="value" placeholder="输入箱舌(mm)" label="箱舌" />
						<van-field v-model="value" placeholder="输入封箱调整(mm)" label="封箱调整" />
						<van-cell title="板长(mm)" value="内容" />
						<van-cell title="板宽(mm)" value="内容" />
						<van-cell title="压线" value="内容" />
					</template>
					<van-field v-model="value" placeholder="输入订单数" label="订单数"/>
					<van-cell title="销售面积(㎡)" value="内容" />
					<van-cell title="折扣" value="内容" />
					<van-cell title="平方报价(元/㎡)" value="内容" />
					<van-cell title="片价(元/片)" value="内容" />
					<van-cell title="平方价(元/㎡)" value="内容" />
					<van-cell title="金额(元)" value="内容" />
					<van-button type="primary" size="large" round v-if="config.tabs.active == 0 " @click="calBdQuotaInfo()">纸板计算</van-button>
					<van-button type="primary" size="large" round v-if="config.tabs.active == 1 ">纸箱计算</van-button>
				</van-cell-group>
			</van-tab>
		</van-tabs>
		<template>
			<van-popup v-model="config.popup.show" position="bottom" :style="{ height: '50%' }" >
				<van-picker show-toolbar :columns="info.cusPicker.columns" @cancel="config.popup.show = false"  @confirm="cusConfirm" :default-index="info.cusPicker.defaultIndex" v-if=" config.picker.type === 0">
					<van-search slot="title" v-model="commonForm.cusName" @search="cusPickerSearch"> </van-search>
				</van-picker>
				<van-picker show-toolbar :columns="info.texPicker.columns" @cancel="config.popup.show = false"  @confirm="texConfirm" :default-index="info.texPicker.defaultIndex" v-if=" config.picker.type === 1">
					<van-search slot="title" v-model="commonForm.texName" @search="texPickerSearch"> </van-search>
				</van-picker>
				<van-picker show-toolbar :columns="info.boxPicker.columns" @cancel="config.popup.show = false"  @confirm="boxConfirm" :default-index="info.boxPicker.defaultIndex" v-if=" config.picker.type === 2">
					<van-search slot="title" v-model="boxForm.boxName" @search="boxPickerSearch"> </van-search>
				</van-picker>
			</van-popup>
		</template>
	</div>
</template>
<script>
	import { Tab, Tabs, Switch, CellGroup, Cell, Field, Button, Popup, Picker, Search, Dialog    } from 'vant';
	import commonFunc from '@/util/index';
	export default {
		components:{
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Switch.name]: Switch,
			[Field.name]: Field,
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Search.name]: Search,
			[Dialog.Component.name]: Dialog.Component,
		},
		data(){
			return {
				checked: false,
				show:false,
				value:'',
				config:{
					tabs:{
						active:0,
						title:['纸箱纸板','纸箱纸板']
					},
					popup:{
						show:false
					},
					picker:{
						type:0,
					}
				},
				info:{
					cusPicker:{
						columns:[],
						defaultIndex:-1,
						keyWord:'',
					},
					texPicker:{
						columns:[],
						defaultIndex:-1,
						keyWord:'',
					},
					boxPicker:{
						columns:[],
						defaultIndex:-1,
						keyWord:'',
					}
				},
				commonForm:{
					cusName:'',
					texName:'',
				},
				boardForm:{

				},
				boxForm:{
					boxName:''
				}
			}
		},
		methods:{
			cusPicker(){
				this.config.popup.show = true;
				this.config.picker.type = 0;
				if( this.info.cusPicker.columns.length == 0 ){
					this.cusPickerSearch();
				}
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.commonForm.cusName ).then(res=>{
					self.info.cusPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.cusPicker.columns.push({text:item.CusName + '--' +item.CusId ,key:item.CusId});
					});
				});
			},
			cusConfirm( value, index ){
				this.commonForm.cusName = value.key;
				this.info.cusPicker.defaultIndex = index;
				this.config.popup.show = false;
			},
			texPicker(){
				this.config.popup.show = true;
				this.config.picker.type = 1;
				if( this.info.texPicker.columns.length == 0 ){
					this.texPickerSearch();
				}
			},
			texPickerSearch(){
				let self = this;
				this.$request.staff.calc.boardPicker( this.commonForm.texName ).then(res=>{
					self.info.texPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.texPicker.columns.push({text:item.BoardId,key:item.BoardId});
					});
				});
			},
			texConfirm( value, index ){
				this.commonForm.texName = value.key;
				this.info.texPicker.defaultIndex = index;
				this.config.popup.show = false;
			},
			boxPicker(){
				this.config.popup.show = true;
				this.config.picker.type = 2;
				if( this.info.boxPicker.columns.length == 0 ){
					this.boxPickerSearch();
				}
			},
			boxPickerSearch(){
				let self = this;
				this.$request.staff.calc.boxPicker( this.boxForm.boxName ).then(res=>{
					self.info.boxPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.boxPicker.columns.push({text:item.BoxId + '--' + item.BoxName,key:item.BoxId});
					});
				});
			},
			boxConfirm( value, index ){
				this.boxForm.boxName = value.key;
				this.info.boxPicker.defaultIndex = index;
				this.config.popup.show = false;
			},
			checkCommon(){
				if( commonFunc.trim(this.commonForm.cusName).length <= 0 ){
					Dialog.alert({
						message: '请选择客户'
					});
					return false;
				}
				if( commonFunc.trim(this.commonForm.texName).length <= 0 ){
					Dialog.alert({
						message: '请选择材质'
					});
					return false;
				}
			},
			calBdQuotaInfo(){
				this.checkCommon();
				this.$request.staff.calc.calBdQuotaInfo( this.commonForm.commonName ).then(res=>{
					console.log(res);
				}).then(err=>{
					console.log(err);
				});
			},
			CalBdPriceInfo(){

			}
		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单试算');
		}	
	}
</script>
<style>
	.cell-input {
		width: 150px;
	    height: 50px;
	    text-align: center;
	    border:1px solid;
	}
	.van-search {
		width:60%;
	}
</style>