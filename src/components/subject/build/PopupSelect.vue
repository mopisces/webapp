<template>
	<div>
		<van-field v-model="value" input-align="center" clickable readonly :label="fieldConfig.label" :placeholder="fieldConfig.placeholder" @click=" show = true ">
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-popup v-model="show" position="top" :style="{ height: '100%' }">
			<van-sticky :offset="46">
				<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
					<div class="van-nav-bar__left">
						<span class="van-nav-bar__text">{{ fieldConfig.placeholder }}</span>
					</div>
					<div class="van-nav-bar__title van-ellipsis"></div>
					<div class="van-nav-bar__right" @click=" confirmClick() ">
						<i class="van-icon">确认</i>
						<i class="van-icon van-icon-success" style="font-size: 16px;"><!----></i>
					</div>
				</div>
			</van-sticky>
			<van-radio-group v-model="value">
				<van-cell-group>
					<van-cell clickable @click=" value = item.value " v-for=" (item,index) in radioData " :key="index">
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
				show  : false,
				value : this.selectValue,
			}
		},
		methods:{
			confirmClick(){
				this.show = false;
				if( this.selectType == 'material' ){
					this.$emit('materialConfirm');
				}
				if ( this.selectType == 'boxType' ) {
					this.$emit('boxTypeConfirm');
				}
				if( this.selectType == 'uLen' || this.selectType == 'tonLen' ){
					this.$emit('lenConfirm');
				}
			}
		},
		created(){
			
		},
		mounted(){

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
			}
		}
	}
</script>