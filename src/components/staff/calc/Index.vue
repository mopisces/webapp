<template>
	<div>
		<van-tabs v-model="config.tabs.active" sticky>
			<van-tab :title="item" v-for="(item,index) in config.tabs.title" :key="index">
				<van-cell-group>
					<van-field readonly clickable label="客户" :value="commonForm.cusName"  placeholder="选择客户" @click="cusPicker()" required input-align="right"></van-field>
					<van-field readonly clickable label="材质" :value="commonForm.texName"  placeholder="选择材质" @click="texPicker()" required input-align="right"></van-field>
					<van-switch-cell v-model="commonForm.bAddTrim" title="加修边" />
					<van-switch-cell v-model="commonForm.bAddArea" title="加面积" />
					<van-switch-cell v-model="commonForm.bEdge" title="毛片" />
					<template v-if="config.tabs.active == 0 ">
						<van-cell title="规格(mm)" is-link>
							<div slot="right-icon">
								<input v-model="boardForm.length" type="number" placeholder="板长" class="cell-input">
	                    		x
	                    		<input v-model="boardForm.width" type="number" placeholder="板宽" class="cell-input">
							</div>
						</van-cell>
						<van-field v-model="boardForm.scoreInfo" placeholder="压线和=板宽(格式：x+x+x)" label="压线" />
					</template>
					<template v-if="config.tabs.active == 1 ">
						<van-field readonly clickable label="箱型" :value="boxForm.boxId"  placeholder="选择箱型" @click="boxPicker()" required input-align="right"></van-field>
						<van-cell title="规格" is-link  >
							<div slot="right-icon">
								<input type="number" placeholder="箱长(mm)" class="cell-input" v-model="boxForm.boxL">
	                    		x
	                    		<input type="number" placeholder="箱宽(mm)" class="cell-input"  v-model="boxForm.boxW">
	                    		x
	                    		<input type="number" placeholder="箱高(mm)" class="cell-input"  v-model="boxForm.boxH">
							</div>
						</van-cell>
						<van-field v-model="boxForm.tonLen" placeholder="输入箱舌(mm)" label="箱舌" input-align="right"/>
						<van-field v-model="boxForm.uLen" placeholder="输入封箱调整(mm)" label="封箱调整" input-align="right"/>
						<van-cell title="板长(mm)" value="内容" />
						<van-cell title="板宽(mm)" value="内容" />
						<van-cell title="压线"     value="内容" />
					</template>
					<van-field v-if="config.tabs.active == 0" v-model="boardForm.ordQty" placeholder="输入纸板订单数" label="订单数" input-align="right"/>
					<van-field v-else v-model="boxForm.ordQty" placeholder="输入纸箱订单数" label="订单数" input-align="right"/>
					<van-cell title="销售面积(㎡)" value="内容" />
					<van-cell title="折扣" value="内容" />
					<van-cell title="平方报价(元/㎡)" value="内容" />
					<van-cell title="片价(元/片)" value="内容" />
					<van-cell title="平方价(元/㎡)" value="内容" />
					<van-cell title="金额(元)" value="内容" />
					<van-button type="primary" size="large" round @click="CalBdPriceInfo()">
						<span v-if="config.tabs.active == 0 ">纸板计算</span>
						<span v-else>纸箱计算</span>
					</van-button>
				</van-cell-group>
			</van-tab>
		</van-tabs>
		<template>
			<van-popup v-model="config.popup.show" position="bottom" :style="{ height: '50%' }" >
				<van-picker show-toolbar :columns="info.cusPicker.columns" @cancel="config.popup.show = false"  @confirm="cusConfirm" :default-index="info.cusPicker.defaultIndex" v-if=" config.picker.type === 0">
					<van-search slot="title" v-model="config.search.cusName" @search="cusPickerSearch"> </van-search>
				</van-picker>
				<van-picker show-toolbar :columns="info.texPicker.columns" @cancel="config.popup.show = false"  @confirm="texConfirm" :default-index="info.texPicker.defaultIndex" v-if=" config.picker.type === 1">
					<van-search slot="title" v-model="config.search.texName" @search="texPickerSearch"> </van-search>
				</van-picker>
				<van-picker show-toolbar :columns="info.boxPicker.columns" @cancel="config.popup.show = false"  @confirm="boxConfirm" :default-index="info.boxPicker.defaultIndex" v-if=" config.picker.type === 2">
					<van-search slot="title" v-model="config.search.boxId" @search="boxPickerSearch"> </van-search>
				</van-picker>
			</van-popup>
		</template>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, Picker, Search, SwitchCell, Dialog, Tab, Tabs} from 'vant';
	import { trim } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Picker.name]: Picker,
			[Search.name]: Search,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
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
					},
					search:{
						cusName : '',
						texName : '',
						boxId : ''
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
					factoryId : '',
					cusName   : '',
					texName   : '',
					bAddTrim  : false,
					bAddArea  : false,
					bEdge     : false
				},
				boardForm:{
					length    : '',
					width     : '',
					scoreInfo : ''
				},
				boxForm:{
					boxId  : '',   	//箱型
					tonLen : '',   	//箱舌
					uLen   : '',	//封箱调整
					boxL   : '',  	//箱长
					boxW   : '',	//箱宽
					boxH   : '',	//箱高
					ordQty : ''     //订单数
				}
			}
		},
		methods:{
			getCalcConfig(){
				let self = this;
				this.$request.staff.calc.getCalcConfig().then(res=>{
					self.commonForm.factoryId = res.result.factory_id;
				});
			},
			getTrimAndArea( data ){
				let self = this;
				this.$request.staff.calc.getTrimAndArea( data ).then(res=>{
					self.commonForm.bAddTrim = res.result.SaAreaAddTrim === '1' ? true : false;
					self.commonForm.bAddArea = res.result.SaAreaAddArea === '1' ? true : false;
				});
			},
			cusPicker(){
				this.config.popup.show = true;
				this.config.picker.type = 0;
				if( this.info.cusPicker.columns.length == 0 ){
					this.cusPickerSearch();
				}
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.config.search.cusName ).then(res=>{
					self.info.cusPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.cusPicker.columns.push({text:item.CusName + '--' +item.CusId ,key:item.CusId});
					});
				});
			},
			cusConfirm( value, index ){
				this.commonForm.cusName = value.key;
				this.info.cusPicker.defaultIndex = index;
				this.getTrimAndArea( this.commonForm );
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
				this.$request.staff.calc.boardPicker( this.config.search.texName ).then(res=>{
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
				this.config.popup.show  = true;
				this.config.picker.type = 2;
				if( this.info.boxPicker.columns.length == 0 ){
					this.boxPickerSearch();
				}
			},
			boxPickerSearch(){
				let self = this;
				this.$request.staff.calc.boxPicker( this.config.search.boxName ).then(res=>{
					self.info.boxPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.boxPicker.columns.push({text:item.BoxId + '--' + item.BoxName,key:item.BoxId});
					});
				});
			},
			boxConfirm( value, index ){
				this.boxForm.boxId = value.key;
				this.info.boxPicker.defaultIndex = index;
				this.config.popup.show = false;
			},
			calBdQuotaInfo(){
				if( trim(this.commonForm.cusName).length <= 0 ){
					Dialog.alert({message: '请选择客户'});
					return false;
				}
				if( trim(this.commonForm.texName).length <= 0 ){
					Dialog.alert({message: '请选择材质'});
					return false;
				}
				this.$request.staff.calc.calBdQuotaInfo( this.commonForm ).then(res=>{
					console.log(res);
				}).then(err=>{
					console.log(err);
				});
			},
			calBdPriceInfo(){
				let data = {

				};
				this.$request.staff.calc.calBdPriceInfo( data ).then((res)=>{
					console.log(res)
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单试算');
		},
		mounted(){
			this.getCalcConfig();
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
