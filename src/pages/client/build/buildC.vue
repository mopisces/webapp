<!-- 纸箱纸板下单 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;width: '+ pageW/16 + 'rem;'">
		<van-field 
			v-model="formData.cusPoNo" 
			input-align="center" 
			label="客订单号" 
			placeholder="未填写则系统自动生成"
		/>
		<karry-popup-select 
			:value.sync="formData.bId"
			:localdata="config.radio.bId" 
			type="bId"
			label="材质名称"
			placeholder="请选择材质"
			:required="true"
		/>
		<uni-check-box
			label="箱型"
			:localdata="config.radio.boxId"
			:radioData.sync="formData.boxId" 
			:map="{text: 'BoxName', value: 'BoxId'}"
			:required="true"
			@change="boxIdChange"
		/>
		<div v-if="!boxInfo.isWeb" class="build-box-size-container">
			<div class="build-box-size-label karry-cell-required">箱规</div>
			<div class="build-box-size-context pd-right-1">
				<input 
					class="build-box-size-input"
					type="number" 
					placeholder="长" 
					v-model="formData.boxL" 
					:disabled="config.boxSize.boxL.disabled"
				/>
				<div class="build-box-size-x">×</div>
				<input 
					class="build-box-size-input"
					type="number" 
					placeholder="宽" 
					v-model="formData.boxW" 
					:disabled="config.boxSize.boxW.disabled"
				/>
				<div class="build-box-size-x">×</div>
				<input 
					class="build-box-size-input"
					type="number" 
					placeholder="高" 
					v-model="formData.boxH" 
					:disabled="config.boxSize.boxH.disabled"
				/>
			</div>
		</div>
		<uni-check-box
			v-if="!config.boxSize.tLen.disabled"
			label="箱舌"
			:localdata="config.radio.tLen"
			:radioData.sync="formData.tLen" 
			:map="{text: 'text', value: 'value'}"
			:required="true"
			@change="tLenChange"
		/>
		<uni-check-box
			v-if="!config.boxSize.uLen.disabled"
			label="封箱调整"
			:localdata="config.radio.uLen"
			:radioData.sync="formData.uLen" 
			:map="{text: 'text', value: 'value'}"
			:required="true"
			@change="uLenChange"
		/>
		<div class="build-box-size-container">
			<div class="build-box-size-label karry-cell-required">横向公式</div>
			<div class="build-box-size-context pd-right-1">
				<input 
					v-if="!boxInfo.isWeb"
					class="build-box-size-input "
					placeholder="横向公式" 
					v-model="formData.lengthFCalc" 
					disabled 
				/>
				<div
					v-if="!boxInfo.isWeb"
					class="build-box-size-x"
				>
					=
				</div>
				<input 
					class="build-box-size-input"
					:class="boxInfo.isWeb?'input-size':''"
					type="number" 
					placeholder="板长" 
					v-model="formData.bdL" 
					:disabled="!boxInfo.isWeb"
				/>
			</div>
		</div>
		<div class="build-box-size-container">
			<div class="build-box-size-label karry-cell-required">纵向公式</div>
			<div class="build-box-size-context pd-right-1">
				<input 
					v-if="!boxInfo.isWeb"
					class="build-box-size-input"
					placeholder="纵向公式" 
					v-model="formData.widthFCalc" 
					disabled
				/>
				<div 
					v-if="!boxInfo.isWeb" 
					class="build-box-size-x"
				>
					=
				</div>
				<input 
					class="build-box-size-input"
					:class="boxInfo.isWeb?'input-size':''"
					type="number" 
					placeholder="板宽" 
					v-model="formData.bdW" 
					:disabled="!boxInfo.isWeb"
				/>
			</div>
		</div>
		<uni-check-box
			label="压线压型"
			:localdata="config.radio.scoreEdge"
			:radioData.sync="formData.scoreEdge" 
			:map="{text: 'text', value: 'value'}"
			:required="true"
			@change="scoreTypeChange"
		/>
		<van-field 
			v-model="formData.scoreInfo" 
			input-align="center" 
			:label="config.build.buildScoreInfoChiText" 
			:placeholder="!boxInfo.isWeb?'由ERP系统自动计算':'请手动输入'" 
			:disabled="!boxInfo.isWeb"
		>
			<template v-if="!boxInfo.isWeb&&formData.isCalc==0" slot="button">
				<van-button 
					size="small" 
					type="primary" 
					:loading="config.scoreBtn.loading"
					:disabled="config.scoreBtn.disabled"
					@click="fetchScoreInfo"
				>
					压线计算
				</van-button>
			</template>
		</van-field>
		<div class="build-box-size-container">
			<div class="build-box-size-label karry-cell-required">纸板张数</div>
			<div class="build-box-size-context pd-right-1">
				<input 
					class="build-box-size-input"
					placeholder="成箱张数" 
					v-model="formData.bdMultiple" 
					disabled
				/>
				<div class="build-box-size-x">x</div>
				<input 
					class="build-box-size-input"
					type="number" 
					placeholder="订单数量" 
					v-model="formData.ordQty" 
				/>
				<div class="build-box-size-x">=</div>
				<input 
					class="build-box-size-input"
					placeholder="合计张数" 
					v-model="formData.bdQty" 
					disabled
				/>
			</div>
		</div>
		<karry-popup-select 
			v-if="config.build.showBuildCAddress"
			:value.sync="formData.cusAddr"
			:localdata="config.radio.cusAddr" 
			type="cusAddr"
			label="送货公司"
			placeholder="选择送货公司"
			:required="true"
		/>
		<karry-date-picker 
			label="交货日期"
			:required="true"
			:dateTime.sync="formData.dnDate"
			:minDate.sync="config.build.buildMinDate"
			:maxDate.sync="config.build.buildMaxDate"
		/>
		<van-field 
			v-if="config.build.showDeliveryRemark == 1" 
			v-model="formData.dRemark" 
			autosize 
			label="送货备注" 
			type="textarea"  
			maxlength="50" 
			placeholder="填写送货备注" 
			:rows="1"
		/>
		<van-field 
			v-model="formData.pRemark" 
			autosize 
			label="生产备注" 
			type="textarea"  
			maxlength="50" 
			placeholder="填写生产备注" 
			:rows="1"
		/>
	
		<card
			title="订单试算结果" 
			extra="数据由ERP提供"
			:subTitle="'面积范围:'+config.build.buildMinArea+'㎡~'+config.build.buildMaxArea+'㎡'"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<span>单片面积:
						<span class="mg-left-20">{{ formData.unitArea }}㎡</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>订单面积:
						<span class="mg-left-20">{{ formData.area }}㎡</span>
					</span>
				</div>
				<div 
					v-if="formData.isCalc == 1" 
					class="card-body-item card-body-item-100"
				>
					<span>计价价格:
						<span class="mg-left-20">{{ erpResult.dOrdPrice }}元/㎡</span>
					</span>
				</div>
				<div 
					v-if="formData.isCalc == 1" 
					class="card-body-item card-body-item-100"
				>
					<span>单片面积:
						<span class="mg-left-20">{{ erpResult.amt }}元</span>
					</span>
				</div>
			</div>
			<div slot="actions" class="card-actions">
				<div class="card-actions-item" @click="fetchAmt(item.strOrderId)">
					<van-icon color="#3c9cff" name="gold-coin-o" size="18"/>
					<span class="card-actions-item-text blue-color">计算订单金额</span>
				</div>
			</div>
		</card>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Icon, Field, Dialog, Toast } from "vant"
	/*自定义选择组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义时间选择组件*/
	import KarryDatePicker from "@/components/karry/datePicker/KarryDatePicker.vue"
	/*自定义单选组件*/
	import KarryPopupSelect from "@/components/karry/popupSelect/KarryPopupSelect.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*async-validator*/
	import schema from "async-validator"
	/*axios库*/
	import axios from "axios"
	/*api接口*/
	import { getBuildOrdConfig } from "@/api/common/webConfig"

	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,

			UniCheckBox,
			KarryDatePicker,
			KarryPopupSelect,
			Card,
			DragMenu
		},
		data() {
			return {
				/*配置*/
				config: {
					/*单选*/
					radio: {
						/*材质*/
						bId: [],
						/*箱型*/
						boxId: [],
						/*箱舌*/
						tLen: [],
						/*封箱调整*/
						uLen: [],
						/*压线压型*/
						scoreEdge: [],
					},
					/*页面必要参数*/
					build: {
						/*压线信息的label*/
						buildScoreInfoChiText: "压线信息",
						/*是否显示送货备注*/
						showDeliveryRemark: 1,
						/*是否显示送货地址*/
						showBuildCAddress: 1,
						/*送货日期可选最小日期*/
						buildMinDate: null,
						/*送货日期可选最大日期*/
						buildMaxDate: null,
						/*下单面积最小值*/
						buildMinArea: null,
						/*下单面积最大值*/
						buildMaxArea: null,
						/*默认箱舌*/
						buildTonLen: null,
						/*默认封箱调整*/
						buildULen: null,
						/*箱长最小值*/
						buildMinBoxL: null,
						/*箱长最大值*/
						buildMaxBoxL: null,
						/*箱宽最小值*/
						buildMinBoxW: null,
						/*箱宽最大值*/
						buildMaxBoxW: null,
						/*箱高最小值*/
						buildMinBoxH: null,
						/*箱高最大值*/
						buildMaxBoxH: null,
						/*自动获取封箱调整和箱舌*/
						buildAutoGetTonLenAndULen: 0,
						/*是否设置下单时间*/
						needSetBuildTime: 0,
						/*下单时间1*/
						buildInTime1: [],
						/*下单时间2*/
						buildInTime2: [],
						/*默认压线压型*/
						buildScoreName: [],
						//上次下单箱舌
						lastToLen: null,
						//上次下单封箱调整
						lastULen: null,
						/*上次下单压型*/
						lastScoreType: null,
						/*上次下单毛片净片*/
						lastEdgeType: null,
						/*后台配置默认压型*/
						defaultScoreName: null,
						/*厂商ID*/
						factoryId: null,
						/*分厂ID*/
						subFacId: null,
						/*客户编号*/
						cusId: null,
					},
					/*长宽高设置是否需要输入*/
					boxSize: {
						boxL: {
							disabled: false
						},
						boxW: {
							disabled: false
						},
						boxH: {
							disabled: false
						},
						tLen: {
							disabled: false
						},
						uLen: {
							disabled: false
						},
					},
					/*压线计算按钮*/
					scoreBtn: {
						disabled: false,
						loading: false,
					},
					/*订单试算按钮*/
					calcBtn: {

					},
				},
				/*表单数据*/
				formData: {
					/*客订单号*/
					cusPoNo: null,
					/*材质*/
					bId: null,
					/*箱型*/
					boxId: null,
					/*箱长*/
					boxL: null,
					/*箱宽*/
					boxW: null,
					/*箱高*/
					boxH: null,
					/*板长*/
					bdL: null,
					/*板宽*/
					bdW: null,
					/*箱舌*/
					tLen: null,
					/*封箱调账*/
					uLen: null,
					/*纸板张数*/
					bdMultiple: null,
					/*订单数量*/
					ordQty: null,
					/*订单纸板数量*/
					bdQty: null,
					/*送货地址*/
					cusAddr: null,
					/*送货备注*/
					dRemark: '',
					/*生产备注*/
					pRemark: '',
					/*送货日期*/
					dnDate: null,
					/*是否订单试算*/
					isCalc: 0,
					/*加销售面积*/
					saAreaAddArea: null,
					/*加修边*/
					saAreaAddTrim: null,
					/*压线信息*/
					scoreType: null,
					/*毛片/净片*/
					edgeType: null,
					/*压线公式*/
					scoreInfo: null,
					/*代入后的长度公式*/
					lengthFCalc: null,
					/*代入后的宽度公式*/
					widthFCalc: null,
					/*单片面积*/
					unitArea: null,
					/*订单面积*/
					area: null,
					/*压线压型选择*/
					scoreEdge: null,
				},
				//箱型对应信息
				boxInfo: {
					//长度公式
					lengthFCalc: null,
					//宽度公式
					widthFCalc: null,
					//长度提示信息
					lengthFDesc: null,
					//宽度提示信息
					widthFDesc: null,
					//备注
					remark: null,
					/*自由输入板长板宽压线*/
					isWeb: false,
				},
				/*erp计算结果*/
				erpResult: {
					/*计价价格*/
					dOrdPrice: null,
					/*金额*/
					amt: null
				},
				/*验证规则*/
			}
		},
		created() {
			this.$store.commit('client/setHeaderTitle', '纸箱纸板下单')
		},
		async mounted() {
			await this.getConfig()
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
				pageW: 'page/pageW',
			}),
			/*纸箱尺寸变化*/
			boxSize() {
				return {
					boxL: this.formData.boxL,
					boxW: this.formData.boxW,
					boxH: this.formData.boxH,
					tLen: this.formData.tLen,
					uLen: this.formData.uLen
				}
			},
			/*纸板张数相关变化*/
			sheets() {
				return {
					bdMultiple: this.formData.bdMultiple,
					ordQty: this.formData.ordQty
				}	
			},
			/*面积计算相关*/
			calcArea() {
				return {
					bdL: this.formData.bdL,
					bdW: this.formData.bdW,
					bdQty: this.formData.bdQty,
				}
			},
			/*计算压线相关*/
			clacScoreInfo() {
				//试算压线
				return {
					strBoxId: this.formData.boxId,
					iBoxL: this.formData.boxL,
					iBoxW: this.formData.boxW,
					iBoxH: this.formData.boxH,
					iLength: this.formData.bdL,
					iWidth: this.formData.bdW,
					iTonLen: this.formData.tLen,
					iULen: this.formData.uLen
				}
				//试算金额
				/*{
					bAddTrim: this.formData.saAreaAddTrim,
                    bAddArea: this.formData.saAreaAddArea,
                    bEdge: this.formData.isEdge == '毛片' ? 1 : 0,
                    strScoreInfo: null,
                    iQty: this.formData.bdQty,

                    strBoxId: this.formData.boxId,
                    iBoxL: this.formData.boxL,
                    iBoxW: this.formData.boxW,
                    iBoxH: this.formData.boxH,
                    iLength: null,
                    iWidth: null,
                    iTonLen: this.formData.tLen,
                    iULen: this.formData.uLen,
				}*/
			}
		},
		watch: {
			'boxInfo.isWeb': {
				async handler( nVal, oVal ) {
					/*设置压线压型*/
					await this.setScore()
				}
			},
			async boxSize( nVal, oVal ) {
				/*清空订单试算结果*/
				this.erpResult = this.$options.data().erpResult
				/*公式计算*/
				await this.fCalc()
			},
			sheets( nVal, oVal ) {
				/*清空订单试算结果*/
				this.erpResult = this.$options.data().erpResult

				if( nVal.bdMultiple && nVal.ordQty ) {
					if( nVal.bdMultiple > 0 ) {
						this.formData.bdQty = nVal.bdMultiple * nVal.ordQty
					} else {
						this.formData.bdQty = nVal.ordQty / nVal.bdMultiple * -1
					}
				} else {
					this.formData.bdQty = null
				}
			},
			calcArea( nVal, oVal ) {
				/*清空订单试算结果*/
				this.erpResult = this.$options.data().erpResult

				if( nVal.bdL && nVal.bdW && nVal.bdQty ) {
					let area = Math.round( nVal.bdL *  nVal.bdW * nVal.bdQty / 1000000 * 100) /100
					if( area > this.config.build.buildMaxArea || area < this.config.build.buildMinArea ) {
						Toast.fail({
							message: '下单面积范围:'+this.config.build.buildMinArea+'㎡\n'+this.config.build.buildMaxArea + '㎡',
							onClose: ()=>{
								this.formData.ordQty = null
								this.formData.area = null
							}
						})
					} else {
						this.formData.area = area
						this.formData.unitArea = parseFloat( (area / nVal.bdQty).toFixed(3) )
					}
				}
			}
		},
		methods: {
			/*订单计算*/
			menuClick() {

			},
			/*获取页面参数*/
			async getConfig( fastOrdId, isRebuild = false ){
				this.config.build = this.$options.data().config.build
				const  { result } = await getBuildOrdConfig({fastOrdId: fastOrdId})

				//设置页面参数
				this.config.build = result.buildConfig
				//设置用户上次下单信息
				this.config.build.lastToLen = result.userBuild.lastTonLen
				this.config.build.lastULen = result.userBuild.lastULen
				this.config.build.lastScoreType = result.userBuild.scoreType
				this.config.build.lastEdgeType = result.userBuild.edgeType
				//设置提交表格必要参数
				this.formData.dnDate = result.buildConfig.buildDeliveryDate
				this.formData.isCalc = result.buildConfig.buildAddCalc
				this.formData.saAreaAddArea = result.buildConfig.saAreaAddArea == 1 ? true : false
				this.formData.saAreaAddTrim = result.buildConfig.saAreaAddTrim == 1 ? true : false
				
				//检查是否在下单时间内
				if( !this.checkTime() ) return 

				//设置材质选择组件
				if( result.bdList.length == 0 ) {
					Dialog.alert({
						title: '没有可选择的材质',
						message: '请先选择常用材质',
						beforeClose: async (action, done)=> {
							done()
							await this.$router.push('/client/usedboard/lists')
						}
					})
				} else {
					result.bdList.forEach((row, idx)=> {
						if( row.BoardName ) {
							this.config.radio.bId.push({ 
								value: row.BoardId, 
								text: row.BoardName, 
								tag: row.IsUsedBoard 
							})
						} else {
							this.config.radio.bId.push({ 
								value: row.BoardId, 
								text: row.BoardName, 
								tag: row.IsUsedBoard 
							})
						}
					})
				}

				//设置箱型组件
				this.config.radio.boxId = JSON.parse(JSON.stringify(result.boxList))

				//设置箱舌
				result.buildConfig.buildTonLen.forEach((item,index)=>{
					this.config.radio.tLen.push({ value: item, text: item })
				})
				
				//设置封箱调整
				result.buildConfig.buildULen.forEach((item,index)=>{
					this.config.radio.uLen.push({ value: item, text: item })
				})

				//设置送货地址组件
				let defaultAddr = result.custDN.find((row)=>row.DefAddress==1)
				this.formData.cusAddr = defaultAddr.value
				this.config.radio.cusAddr = result.custDN

				//设置压线压型
				await this.setScore()

				/*设置默认箱舌和封箱调整*/
				await this.setLUlen()
			},
			/*公式计算*/
			fCalc() {
				/*没有选择箱型时返回*/
				if( !this.boxInfo.lengthFCalc || !this.boxInfo.widthFCalc || this.boxInfo.isWeb ) return 

				let lengthExp = this.boxInfo.lengthFCalc,
					widthExp = this.boxInfo.widthFCalc
				/*箱长代入公式*/
				if( this.formData.boxL && /(^[0-9]\d{0,3}$)/.test(this.formData.boxL) ) {
					if( Number(this.formData.boxL) <= this.config.build.buildMaxBoxL && Number(this.formData.boxL) >= this.config.build.buildMinBoxL ) {
						lengthExp = lengthExp.replace(/L/g, this.formData.boxL)
						widthExp = widthExp.replace(/L/g, this.formData.boxL)
					}
				}
				/*箱宽代入公式*/
				if( this.formData.boxW && /(^[0-9]\d{0,3}$)/.test(this.formData.boxW) ) {
					if( Number(this.formData.boxW) <= this.config.build.buildMaxBoxW && Number(this.formData.boxW) >= this.config.build.buildMinBoxW ) {
						lengthExp = lengthExp.replace(/W/g, this.formData.boxW)
						widthExp = widthExp.replace(/W/g, this.formData.boxW)
					}
				}
				/*箱高代入公式*/
				if( this.formData.boxH && /(^[0-9]\d{0,3}$)/.test(this.formData.boxH) ) {
					if( Number(this.formData.boxH) <= this.config.build.buildMaxBoxH && Number(this.formData.boxH) >= this.config.build.buildMinBoxH ) {
						lengthExp = lengthExp.replace(/H/g, this.formData.boxH)
						widthExp = widthExp.replace(/H/g, this.formData.boxH)
					}
				}
				/*箱舌代入公式*/
				if( this.formData.tLen ) {
					lengthExp = lengthExp.replace(/T/g, this.formData.tLen )
					widthExp = widthExp.replace(/T/g,  this.formData.tLen )
				}
				/*封箱调整代入公式*/
				if( this.formData.uLen ) {
					lengthExp = lengthExp.replace(/U/g, this.formData.uLen)
					widthExp = widthExp.replace(/U/g, this.formData.uLen)
				}
				/*设置代入后的公式*/
				this.formData.lengthFCalc = lengthExp
				this.formData.widthFCalc = widthExp
				/*校验长度公式是否完全代入*/
				if( this.checkF(lengthExp) ) {
					let len = Math.round(eval(lengthExp.replace(/<\/?.+?>/g,'')))
					if ( len != this.formData.bdL ) this.formData.bdL = len
				} else {
					this.formData.bdL = this.$options.data().formData.bdL
				}
				/*校验宽度公式是否完全代入*/
				if( this.checkF(widthExp) ) {
					let width = Math.round(eval(widthExp.replace(/<\/?.+?>/g,'')))
					if( width != this.formData.bdW ) this.formData.bdW = width
				} else {
					this.formData.bdW = this.$options.data().formData.bdW
				}
			},
			/*设置压线压型,WEB标识的订单必须是有压线*/
			setScore() {
				let scoreEdge
				if( this.formData.isCalc == 1 ) {
					if( !this.boxInfo.isWeb ) {
						scoreEdge = [
							{
								text: '净片-无压线',
								value: '00'
							},
							{
								text: '净片-普通压线',
								value: '01'
							},
							{
								text: '净片-平压线',
								value: '02'
							},
							{
								text: '毛片-无压线',
								value: '10'
							}
						]
					} else {
						scoreEdge = [
							{
								text: '净片-普通压线',
								value: '01'
							},
							{
								text: '净片-平压线',
								value: '02'
							}
						]
					}
					let scoreItem = scoreEdge.find(item=> item.value == (this.config.build.lastEdgeType+this.config.build.lastScoreType) )
					if( !scoreItem ) {
						scoreItem = {
							text: '净片-普通压线',
							value: '01'
						}
					}
					this.formData.edgeType = scoreItem.text.slice(0, 2) 
					this.formData.scoreType = scoreItem.text.slice(3)
					this.formData.scoreEdge = scoreItem.value
				} else {
					this.config.build.buildScoreName.forEach((item)=> {
						if( !this.boxInfo.isWeb || item.includes("无压线") ) {
							scoreEdge.push({
								text: item,
								value: item
							})
						}
					})

					if( this.config.build.defaultScoreName.includes("无压线") && this.boxInfo.isWeb  ) {
						this.formData.scoreType = scoreEdge[0].value
					} else {
						this.formData.scoreType = this.config.build.defaultScoreName
					}
				}
				this.config.radio.scoreEdge = scoreEdge
			},
			/*设置箱舌和封箱调整*/
			setLUlen() {
				let tLen = this.config.radio.tLen.find((item)=> Number(item.value) == Number(this.config.build.lastToLen) )
				this.formData.tLen = tLen?tLen.value:this.config.radio.tLen[0].value
				let uLen = this.config.radio.uLen.find((item)=> Number(item.value) == Number(this.config.build.lastULen) )
				this.formData.uLen = uLen?uLen.value:this.config.radio.uLen[0].value
			},
			/*检查公式是否已经全部代入完成*/
			checkF( formula ) {
				if( formula ) {
					return !formula.includes("L") && !formula.includes("W") && !formula.includes("H") && !formula.includes("T") && !formula.includes("U")
				}
				return false
			},
			/*检查是否在下单时间*/
			checkTime(){
				if( this.config.build.needSetBuildTime == 0 ) return true
				let timeRes1 = checkBuildTime(this.config.build.buildInTime1[0], this.config.build.buildInTime1[1])
				let timeRes2 = checkBuildTime(this.config.build.buildInTime2[0], this.config.build.buildInTime2[1])
				if( !timeRes1 && !timeRes2 ){
					let that = this
					Dialog.alert({
						title: '目前不在下单时间',
						message:'下单时间段为:' + that.config.build.buildInTime1[0] + '~' + that.config.build.buildInTime1[1] + '\n' + that.config.build.buildInTime2[0] + '~' + that.config.build.buildInTime2[1]
					}).then(()=>{
						Dialog.close()
						that.$router.push('/client/index/menu')
					})
				} else {
					return true
				}
			},
			/*箱型发生变化*/
			async boxIdChange(e) {
				/*清空相应的数据*/
				this.boxInfo = this.$options.data().boxInfo
				this.erpResult = this.$options.data().erpResult
				this.config.boxSize = this.$options.data().config.boxSize

				this.formData.bdMultiple = 0
				/*设置boxInfo*/
				this.boxInfo.remark = e.detail.data.Remark
				this.boxInfo.isWeb = e.detail.data.Remark.includes('WEB')
				this.boxInfo.lengthFCalc = e.detail.data.LengthF
				this.boxInfo.lengthFDesc = e.detail.data.LengthFDesc || ''
				this.boxInfo.widthFCalc = e.detail.data.WidthF
				this.boxInfo.widthFDesc = e.detail.data.WidthFDesc || ''
				/*设置表单数据*/
				this.formData.bdMultiple = Number(e.detail.data.Multiple)
				this.formData.bdL = null
				this.formData.bdW = null
				/*设置箱舌和封箱调整*/
				await this.setLUlen()
				/*过滤公式中不包含的数量*/
				if( !this.boxInfo.lengthFCalc.includes('L') && !this.boxInfo.widthFCalc.includes('L') || this.boxInfo.isWeb ) {
					this.config.boxSize.boxL.disabled = true
					this.formData.boxL = null
				}
				if( !this.boxInfo.lengthFCalc.includes('W') && !this.boxInfo.widthFCalc.includes('W') || this.boxInfo.isWeb ) {
					this.config.boxSize.boxW.disabled = true
					this.formData.boxW = null
				}
				if( !this.boxInfo.lengthFCalc.includes('H') && !this.boxInfo.widthFCalc.includes('H') || this.boxInfo.isWeb ) {
					this.config.boxSize.boxH.disabled = true
					this.formData.boxH = null
				}
				if( !this.boxInfo.lengthFCalc.includes('T') && !this.boxInfo.widthFCalc.includes('T') || this.boxInfo.isWeb ) {
					this.config.boxSize.tLen.disabled = true
					this.formData.tLen = null
				}
				if( !this.boxInfo.lengthFCalc.includes('U') && !this.boxInfo.widthFCalc.includes('U') || this.boxInfo.isWeb ) {
					this.config.boxSize.uLen.disabled = true
					this.formData.uLen = null
				}
				/*表单中的公式*/
				this.formData.lengthFCalc = e.detail.data.LengthF
				this.formData.widthFCalc = e.detail.data.WidthF

				/*公式代入计算*/
				await this.fCalc()
			},
			/*压线压型变化*/
			scoreTypeChange(e) {
				if( this.formData.isCalc == 1 ) {
					this.formData.scoreType = ['无压线', '普通压线', '平压线'][e.detail.value[1]]
					this.formData.edgeType = e.detail.value[0]
				} else {
					this.formData.scoreType = e.detail.value
				}
			},
			/*erp计算压线*/
			fetchScoreInfo() {
				this.config.scoreBtn.loading = true
				setTimeout(async ()=> {
					let postData = {
						strFactoryId: this.config.build.factoryId,
						strSubFacId: this.config.build.subFacId,
						strCusId: this.config.build.cusId,
						strBoxId: this.formData.boxId,
						iBoxL: this.formData.boxL,
						iBoxW: this.formData.boxW,
						iBoxH: this.formData.boxH,
						iLength: this.formData.bdL,
						iWidth: this.formData.bdW,
						iTonLen: this.formData.tLen,
						iULen: this.formData.uLen
					}
					const { data } = await axios({
						method: 'post',  
						url: window.jpdn_domain_erp + 'WebCommonF/FormulaCalcScore',
						data: postData,
						headers: {
							'Content-Type': 'text/plain',
						}
					})
					let response = JSON.parse(data[0])

				}, 1000)
			},
			/*订单试算*/
			fetchAmt() {

			},
		}
	}
</script>

<style>
	.build-box-size-container {
		border: 0.0625rem solid #ebedf0;
		background: #fff;
		display: flex;
		align-items: center;
		padding-left: 1rem;
		border-bottom: 0.0625rem solid #ebedf0;
	}

	.build-box-size-label {
		flex: none;
		width: 3.75rem;
		font-size: 0.875rem;
	}

	.build-box-size-context {
		flex: 1;
		display: flex;
		flex-direction: row;
		padding: 0.3125rem 0rem 0.3125rem 0rem;
		line-height: 1.3125rem;
		align-items: center;
	}

	.pd-right-1 {
		padding-right: 0.5rem;
	}
	
	.build-box-size-x {
		flex: 1;
		text-align: center;
		max-width: 0.875rem;
	}

	.build-box-size-input {
		flex: 1;
		text-align: center;
		border: 0.0625rem solid #000;
		line-height: 1.5rem;
		width: 100%;  
		border-radius: 0.25rem;
	}

	.input-size {
		max-width: 50%;
	}

	input[disabled] {  
		background-color: #ede9e9;  
	}

</style>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>