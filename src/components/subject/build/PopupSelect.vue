<template>
	<div>
		<van-field v-model="value" input-align="center" clickable readonly :label="fieldConfig.label" :placeholder="fieldConfig.placeholder" @click=" show = true ">
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-popup v-model="show" :style="{ height: '75%', width: '95%' }" round>
			<van-sticky :offset="46">
				<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
					<div class="van-nav-bar__left">
						<span class="van-nav-bar__text">{{ fieldConfig.placeholder }}</span>
					</div>
					<div class="van-nav-bar__title van-ellipsis"></div>
					<template v-if="needConfirm == 1">
						<div class="van-nav-bar__right" @click=" confirmClick() ">
							<i class="van-icon">确认</i>
							<i class="van-icon van-icon-success" style="font-size: 16px;"><!----></i>
						</div>
					</template>
					<template v-else>
						<div class="van-nav-bar__right">
							<i class="van-icon">请选择</i>
							<i class="van-icon van-icon-setting-o" style="font-size: 16px;"><!----></i>
						</div>
					</template>
				</div>
			</van-sticky>
			<van-radio-group v-model="value">
				<van-cell-group>
					<van-cell clickable @click=" value = item.value;itemClick() " v-for=" (item,index) in radioData " :key="index">
						<div slot="title">
							<div>{{ item.value }}</div>
							<div v-if=" selectType == 'cusInfo' && item.text != '' ">
								送货地址:{{ item.text }}
							</div>
							<div v-if=" selectType == 'boxType' && item.text != '' ">
								箱型名称:{{ item.text }}
							</div>
							<div v-if=" selectType == 'productName' && item.text != '' ">
								套件名称:{{ item.text }}
							</div>
							<div v-if=" selectType == 'material' && item.text != '' ">
								材质名称:{{ item.text }}
							</div>
						</div>
						<van-radio slot="right-icon" :name="item.value" />
						<div slot="default">
							<div v-if=" selectType == 'material' ">
								<van-tag mark v-if="value != item.value ">常用材质</van-tag>
								<van-tag mark type="success" v-else>常用材质</van-tag>
							</div>
						</div>
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Popup, Field, RadioGroup, Radio, Sticky ,Tag } from 'vant';
	import { getStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
		},
		props:['selectValue','fieldConfig','radioData','selectType'],
		data(){
			return {
				needConfirm: 0,
				show  : false,
				value : this.selectValue,
			}
		},
		methods:{
			confirmClick(){
				this.show = false;
				this.$emit('valueChange', this.value);
				/*if( this.selectType == 'material' ){
					this.$emit('materialConfirm');
				}
				if ( this.selectType == 'boxType' ) {
					this.$emit('boxTypeConfirm');
				}
				if( this.selectType == 'uLen' || this.selectType == 'tonLen' ){
					this.$emit('lenConfirm');
				}*/
			},
			itemClick(){
				this.confirmClick()
				/*if( this.needConfirm == 0 ){
					this.confirmClick();
				}*/
			}
		},
		created(){
			//console.log(this.selectValue)
		},
		mounted(){
			/*try{
				let config = JSON.parse(getStorage('jpdn_webapp_config'));
				if( typeof(config.selectNeedConfirm) == 'string' ){
					this.needConfirm = config.selectNeedConfirm;
				}
			}catch(err){
				this.needConfirm = 1;
			}*/
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			selectValue(newV,oldV){
				this.value = newV;
			},
			value(newV,oldV){
				this.$emit("update:selectValue", newV);
			},
			show( newV,oldV ){
				if( newV == true && this.needConfirm != 1 ){
					let arr = JSON.parse(JSON.stringify(this.radioData));
					if( arr.length == 0 ){
						this.needConfirm = 1;
					}
				}
			}
		}
	}
</script>
<style type="text/css">
	.van-radio__label {
		margin: 0rem !important;
	}

	.van-icon {
		display: inline-block !important;
	}
</style>