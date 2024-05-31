<template>
	<div style="padding-bottom:3.125rem;">
		<van-tabs v-model="config.tabs.active" sticky>
			<van-tab :title="item" v-for="(item,index) in config.tabs.title" :key="index">
				<van-cell-group>
					<cus-picker :cusName.sync="commonForm.cusName" ></cus-picker>
					<van-field readonly clickable label="材质" :value="commonForm.texName"  placeholder="选择材质" @click="texPicker()" required input-align="center" style="border-top:1px #f9fafb solid;">
						<van-icon name="arrow" slot="right-icon"/>
					</van-field>
					<van-switch-cell v-model="commonForm.bAddTrim" title="加修边" />
					<van-switch-cell v-model="commonForm.bAddArea" title="加面积" />
					<van-switch-cell v-model="commonForm.bEdge" title="毛片" />
					<template v-if="config.tabs.active == 0 ">
						<div class="van-cell" style="display: flex;align-items: center;">
							<div class="van-cell__title van-field__label">规格(mm)</div>
							<input type="number" class="karry-input" placeholder="板长" v-model="boardForm.length" />
							<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
							<input type="number" class="karry-input" placeholder="板宽" v-model="boardForm.width" />
						</div>
						<van-field v-model="boardForm.scoreInfo" placeholder="压线和=板宽(格式：x+x+x)" label="压线" input-align="center"/>
					</template>
					<template v-if="config.tabs.active == 1 ">
						<van-field readonly clickable label="箱型" :value="boxForm.boxId"  placeholder="选择箱型" @click="boxPicker()" required input-align="center">
							<van-icon name="arrow" slot="right-icon"/>
						</van-field>
						
						<div class="van-cell" style="display: flex;align-items: center;">
							<div class="van-cell__title van-field__label">规格</div>
							<input type="number" class="karry-input" placeholder="箱长(mm)" v-model="boxForm.boxL" />
							<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
							<input type="number" class="karry-input" placeholder="箱宽(mm)" v-model="boxForm.boxW" />
							<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
							<input type="number" class="karry-input" placeholder="箱高(mm)" v-model="boxForm.boxH" />
						</div>
						<van-field v-model="boxForm.tonLen" placeholder="输入箱舌(mm)" label="箱舌" input-align="center"/>
						<van-field v-model="boxForm.uLen" placeholder="输入封箱调整(mm)" label="封箱调整" input-align="center"/>
					</template>
					<van-field v-if="config.tabs.active == 0" v-model="boardForm.ordQty" placeholder="输入纸板订单数" label="订单数" input-align="center"/>
					<van-field v-else v-model="boxForm.ordQty" placeholder="输入纸箱订单数" label="订单数" input-align="center" />

					<field-label-variable :value.sync="calcResult.salesArea" label="销售面积(㎡)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
					<field-label-variable :value.sync="calcResult.disRate" label="折扣" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
					<field-label-variable :value.sync="calcResult.oriPrice" label="平方报价(元/㎡)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
					<field-label-variable :value.sync="calcResult.unitPrice" label="片价(元/片)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
					<field-label-variable :value.sync="calcResult.squarePrice" label="平方价(元/㎡)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
					<field-label-variable :value.sync="calcResult.amt" label="金额(元)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
					<div v-if=" config.tabs.active == 1 ">
						<field-label-variable :value.sync="calcResult.boxL" label="板长(mm)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
						<field-label-variable :value.sync="calcResult.boxW" label="板宽(mm)" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
						<field-label-variable :value.sync="calcResult.strScoreInfo" label="压线" placeholder="待计算" readonly="readonly"></field-label-variable>
					</div>
					<div style="width:100%;height:3.125rem;"></div>
					<van-button type="primary" size="normal" round @click.native="calBdPriceInfo()" style="position:fixed;bottom:3.125rem;width:100%;" :disabled="config.button.disabled">
						<span v-if="config.tabs.active == 0 ">纸板计算</span>
						<span v-else>纸箱计算</span>
					</van-button>
				</van-cell-group>
			</van-tab>
		</van-tabs>
		<template>
			<van-popup v-model="config.popup.show" position="bottom" :style="{ height: '50%' }" >
				<van-picker show-toolbar :columns="info.texPicker.columns" @cancel="config.popup.show = false"  @confirm="texConfirm" :default-index="info.texPicker.defaultIndex" v-if=" config.picker.type === 1">
					<van-search slot="title" v-model="config.search.texName" @search="texPickerSearch" style="width:60%;"> </van-search>
				</van-picker>
				<van-picker show-toolbar :columns="info.boxPicker.columns" @cancel="config.popup.show = false"  @confirm="boxConfirm" :default-index="info.boxPicker.defaultIndex" v-if=" config.picker.type === 2">
					<van-search slot="title" v-model="config.search.boxId" @search="boxPickerSearch" style="width:60%;"> </van-search>
				</van-picker>
			</van-popup>
		</template>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Popup, Picker, Field, Search, SwitchCell, Dialog, Toast, Tab, Tabs} from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import FieldLabelVariable from '@/components/subject/staff/FieldLabelVariable.vue';
	import schema from 'async-validator';
	/*api接口*/
	import { getWebConfig, fetchDataList } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
			[Search.name]: Search,
			[SwitchCell.name]: SwitchCell,
			[Toast.name]: Toast,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			CusPicker,
			FieldLabelVariable
		},
		data(){
			return {
				config:{
					tabs:{
						active:0,
						title:['简单纸板','纸箱纸板']
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
						boxId   : ''
					},
					button:{
						disabled:true
					}
				},
				info:{
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
					cusName   : '',		//客户名称
					texName   : '',     //材质
					bAddTrim  : false,  //加修边
					bAddArea  : false,	//加面积
					bEdge     : false   //毛片
				},
				boardForm:{
					length    : '',  //板厂
					width     : '',  //板宽
					scoreInfo : '',  //压线信息
					ordQty    : 0    //订单数
				},
				boxForm:{
					boxId  : '',   	//箱型
					tonLen : '',   	//箱舌
					uLen   : '',	//封箱调整
					boxL   : '',  	//箱长
					boxW   : '',	//箱宽
					boxH   : '',	//箱高
					ordQty : 0      //订单数
				},
				calcResult:{
					saleArea    : '',  //销售面积
					disRate     : '',  //折扣
					oriPrice    : '',  //平方报价
					unitPrice   : '',  //片价
					squarePrice : '',  //平方价
					amt         : '',  //金额
					boxL        : '',  //板厂(箱型试算)
					boxW        : '',  //板宽(箱型试算)
					strScoreInfo: '',  //压线(箱型试算)
				},
				pageConfig:{
					calcAutoGetdOriPrice        : false,
					calcAutoGetTonLenAndULen    : false,
					calcAutoGetTrimAndAreaByCus : false,
				},
				rules:{
					sRules:{
						length : [
							{ required : true, message : '请输入板长' },
							{ pattern : '^[1-9][0-9]{0,5}$', message : '板长格式错误' }
						],
						width : [
							{ required : true, message : '请输入板宽' },
							{ pattern : '^[1-9][0-9]{0,3}$' , message : '板宽格式错误' }
						],
						scoreInfo : [
							{ validator:(rule, value, callback, source, options)=>{
								let errors;
								if( value != '' && !/^\d+([.]{1}[5]{1}){0,1}(\+\d+([.]{1}[5]{1}){0,1})+$/.test(value) ){
									errors = '压线格式不正确';
								}
								if( value != '' && eval( value ) != source.width ){
									errors = '压线和不等于板宽';
								}
								callback(errors);
							}}
						],
						ordQty : [
							{ required : true, message : '请填写订单数' },
							{ pattern : '^[1-9][0-9]{0,6}$',message : '请填写正确的订单数'},
						]
					},
					cRules:{
						boxId : [
							{ type : 'string', required : true, message : '请选择箱型'  },
						],
						boxL : [
							{ required : true, message : '请填写箱长' },
							{ pattern : '^[1-9][0-9]{0,4}$', message : '箱长格式不正确' }
						],
						boxW : [
							{ required : true, message : '请填写箱宽' },
							{ pattern : '^[1-9][0-9]{0,4}$', message : '箱宽格式不正确' }
						],
						boxH : [
							{ required : true, message : '请填写箱高' },
							{ pattern : '^[1-9][0-9]{0,4}$', message: '箱高格式不正确' }
						],
						ordQty : [
							{ required : true, message : '请填写订单数' },
							{ pattern : '^[1-9][0-9]{0,6}$',message : '请填写正确的订单数'},
						]
					},
					commonRules:{
						cusName : [
							{ type : 'string', required : true, message : '请选择客户' }
						],
						texName : [
							{ type : 'string', required : true, message : '请选择材质' }
						],
						bAddTrim : [
							{ validator:(rule, value, callback, source, options)=>{
								let errors;
								if( value == true && this.commonForm.bAddArea == true ){
									errors = '加修边和加面积不能同时选择';
								}
								callback(errors);
							} }
						],
						bAddArea : [
							{ validator:(rule, value, callback, source, options)=>{
								let errors;
								if( this.commonForm.bAddTrim == true && value == true ){
									errors = '加修边和加面积不能同时选择';
								}
								callback(errors);
							} }
						]
					}
				}
			}
		},
		methods:{
			async getCalcConfig(){
				const { result } = await getWebConfig({paramType: 'staffCalc'})
				this.commonForm.factoryId = result.factory_id
				this.pageConfig.calcAutoGetdOriPrice = result.CalcAutoGetdOriPrice == '1' ? true : false
				this.pageConfig.calcAutoGetTonLenAndULen = result.CalcAutoGetTonLenAndULen == '1' ? true : false
				this.pageConfig.calcAutoGetTrimAndAreaByCus =result.CalcAutoGetTrimAndAreaByCus == '1' ? true : false
			},
			getTrimAndArea( cusName ){
				let self = this;
				this.$request.staff.calc.getTrimAndArea( cusName ).then(res=>{
					self.commonForm.bAddTrim = res.result.SaAreaAddTrim === '1' ? true : false;
					self.commonForm.bAddArea = res.result.SaAreaAddArea === '1' ? true : false;
				});
			},
			getTonLenAndULen( IsContinueCallCalBdQuotaInfo = false ){
				if( this.pageConfig.calcAutoGetTonLenAndULen && this.config.tabs.active == 1 && this.commonForm.cusName && this.commonForm.texName ){
					let data = {
						cusName : this.commonForm.cusName,
						texName : this.commonForm.texName
					};
					let self = this;
					this.$request.staff.calc.getTonLenAndULen( data ).then(res=>{
						self.boxForm.tonLen = res.result[0].TonLen;
						self.boxForm.uLen   = res.result[0].ULen;
						Toast.success('箱舌 => ' + self.boxForm.tonLen + ' 封箱调整 => ' + self.boxForm.uLen );
					}).then(()=>{
						this.calBdQuotaInfo();
					});
				}else{
					if( IsContinueCallCalBdQuotaInfo ){
						this.calBdQuotaInfo();
					}
				}
				
			},
			texPicker(){
				this.config.popup.show = true;
				this.config.picker.type = 1;
				if( this.info.texPicker.columns.length == 0 ){
					this.texPickerSearch()
				}
			},
			async texPickerSearch(){
				this.info.texPicker.columns = this.$options.data().info.texPicker.columns
				const { result } = await fetchDataList({
					paramType: 'bd', 
					keyWord: this.config.search.texName
				})
				result.forEach(( item,idx )=> {
					this.info.texPicker.columns.push({text:item.BoardId, key:item.BoardId})
				})
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
			async boxPickerSearch(){
				this.info.boxPicker.columns = this.$options.data().info.boxPicker.columns
				const { result } = await fetchDataList({
					paramType: 'box', 
					keyWord: this.config.search.boxId
				})
				result.forEach((item,idx)=> {
					this.info.boxPicker.columns.push({text:item.BoxId + '--' + item.BoxName, key:item.BoxId})
				})
			},
			boxConfirm( value, index ){
				this.boxForm.boxId = value.key;
				this.info.boxPicker.defaultIndex = index;
				this.config.popup.show = false;
			},
			calBdQuotaInfo(){
				if( this.pageConfig.calcAutoGetdOriPrice && this.commonForm.cusName != '' && this.commonForm.texName != '' ){
					let validator = new schema( this.rules.commonRules );
					let self = this;
					validator.validate( this.commonForm ).then(()=>{
						self.$request.staff.connecterp.calBdQuotaInfo( this.commonForm ).then(res=>{
							if( res.data.result[2] === false ){
								Dialog.alert({
									title   : '计算失败',
									message : res.data.result[1]
								}).then(()=>{
									Dialog.close();												
								});
								self.config.button.disabled = true;
								return false;
							}
							let erpResult = JSON.parse( res.data.result[0] );
							self.calcResult.oriPrice = erpResult[0].dOriPrice;
							Toast.success('平方报价 => ' + self.calcResult.oriPrice);
							self.config.button.disabled = false;
						});												
					}).catch(({ errors, fields })=>{
						Toast.fail(errors[0].message);
					});
				}
			},
			calBdPriceInfo(){
				if( this.config.tabs.active == '0' ){
					var mixSRules = Object.assign({},this.rules.commonRules,this.rules.sRules);
					var validator = new schema( mixSRules );
					var postData = Object.assign({},this.commonForm,this.boardForm);
				}else{
					var mixCRules = Object.assign({},this.rules.commonRules,this.rules.cRules);
					var validator = new schema( mixCRules );
					var postData  = Object.assign({},this.commonForm,this.boxForm);
				}
				let data = {
					strFactoryId : this.commonForm.factoryId,
                    strCusId     : this.commonForm.cusName,
                    strBoardId   : this.commonForm.texName,
                    bAddTrim     : this.commonForm.bAddTrim,
                    bAddArea     : this.commonForm.bAddArea,
                    bEdge        : this.commonForm.bEdge,
                    iLength      : this.config.tabs.active == '0' ? this.boardForm.length    : null,
                    iWidth       : this.config.tabs.active == '0' ? this.boardForm.width     : null,
                    strScoreInfo : this.config.tabs.active == '0' ? this.boardForm.scoreInfo : null,
                    iQty         : this.config.tabs.active == '0' ? this.boardForm.ordQty    : this.boxForm.ordQty,
                    strBoxId     : this.config.tabs.active == '1' ? this.boxForm.boxId       : null,
                    iBoxL        : this.config.tabs.active == '1' ? this.boxForm.boxL        : null,
                    iBoxW        : this.config.tabs.active == '1' ? this.boxForm.boxW        : null,
                    iBoxH        : this.config.tabs.active == '1' ? this.boxForm.boxH        : null,
                    iTonLen      : this.config.tabs.active == '1' ? this.boxForm.tonLen      : null,
                    iULen        : this.config.tabs.active == '1' ? this.boxForm.uLen        : null
				};
				let self  = this;
				validator.validate( postData ).then(()=>{
					self.$request.staff.connecterp.calBdPriceInfo( data, self.config.tabs.active ).then((res)=>{
						if( res.data.result[2] === false ){
							Dialog.alert({
								title   : '计算失败',
								message : res.data.result[1]
							}).then(()=>{
								Dialog.close();
							});
							return ;
						}
						let erpResult = JSON.parse( res.data.result[0] )[0];
						self.calcResult.salesArea   = erpResult.dSalesArea;
						self.calcResult.disRate     = erpResult.dDisRate;
						self.calcResult.oriPrice    = erpResult.dOriPrice;
						self.calcResult.unitPrice   = erpResult.dUnitPrice;
						self.calcResult.squarePrice = erpResult.dSquarePrice;
						self.calcResult.amt         = erpResult.dAmt
						if( self.config.tabs.active == 1 ){
							self.calcResult.boxL         = erpResult.iLength;
							self.calcResult.boxW         = erpResult.iWidth;
							self.calcResult.strScoreInfo = erpResult.strScoreInfo;
						} 
						Dialog.alert({
							message : '计算结果已更新'
						}).then(()=>{
							Dialog.close();
						});
					});
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			clearCalcRes(){
				this.calcResult = this.$options.data().calcResult
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单试算');
		},
		mounted(){
			this.getCalcConfig();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			cusNameChange(){
				return this.commonForm.cusName;
			},
			tabsActiveChange(){
				return this.config.tabs.active;
			},
			texNameChange(){
				return this.commonForm.texName;
			},
			bAddTrimChange(){
				return this.commonForm.bAddTrim;
			},
			bAddAreaChange(){
				return this.commonForm.bAddArea;
			}
		},
		watch:{
			cusNameChange( newV, oldV ){
				if( newV.length == 0){
					this.commonForm.bAddTrim = false;
					this.commonForm.bAddArea = false;
				}else{
					if( this.pageConfig.calcAutoGetTrimAndAreaByCus ){
						this.getTrimAndArea( newV );
					}
				}
				this.getTonLenAndULen(true);
			},
			tabsActiveChange( newV, oldV ){
				this.getTonLenAndULen(false);
				this.clearCalcRes();
			},
			texNameChange( newV, oldV ){
				this.getTonLenAndULen(true);
			},
			commonForm:{
				handler(newV, oldV) {
					this.clearCalcRes();
				},
				deep: true
			},
			boardForm :{
				handler(newV, oldV) {
					this.clearCalcRes();
				},
				deep: true
			},
			boxForm : {
				handler(newV, oldV) {
					this.clearCalcRes();
				},
				deep: true
			},
			bAddTrimChange(newV, oldV){
				if( newV == true ){
					this.commonForm.bAddArea = false;
				}
			},
			bAddAreaChange(newV, oldV){
				if( newV == true ){
					this.commonForm.bAddTrim = false;
				}
			}
		}
	}
</script>
<style>
	.cell-input {
		width: 3.75rem;
	    text-align: center;
	    border:1px solid;
	   	font-size: 0.8125rem;
	   	padding: auto 10%;
	   	display:inline-block;
	}
</style>
