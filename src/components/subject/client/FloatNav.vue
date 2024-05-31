<template>
	<div>
		<div @click=" config.popup.show = true ">
			<div class="cap-floating-nav__item">
				<van-icon class-prefix="iconfont" size="32" name="fukuan" class="floating-nav__icon" color="#fff"/>
			</div>
			<div class="cap-floating-nav__span">
				<span class="floating-nav__text">批量付款</span>
			</div>
		</div>
		<van-popup v-model="config.popup.show" get-container="body" position="top" :style="{ height: '100%' }">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__title van-ellipsis">
					订单信息
				</div>
				<div class="van-nav-bar__right" @click=" config.popup.show = false ">
					<van-icon name="cross"/>
				</div>
			</div>
			<div style="width:100%;height:2.875rem;"></div>
			<van-checkbox-group v-model="result" ref="listCheckBox">
				<van-cell-group>
					<van-cell :clickable=" item.isover " v-for="(item,index) in listData" :key="index"> 
						<div slot="title" class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--6"  v-if=" item.isGroup == 1 ">
								<van-image :src="item.pic" round width="40" height="40"/>
							</div>
							<div class="van-col van-col--12">
								<span style="color: rgb(224, 24, 53);">{{ item.boardId || item.matNo }}</span>
								<span>,{{ item.title }}</span>
								<van-tag mark v-if=" item.isover ">已过期</van-tag>
							</div>
							<div class="van-col van-col--6" style="margin-top:0.75rem;color:#999;">
								¥{{ item.cost }}
							</div>
						</div>
						<van-checkbox :name=" item.cusPoNo " slot="right-icon" :disabled=" item.isover "/>
					</van-cell>
				</van-cell-group>
			</van-checkbox-group>
			<div style="width:100%;height:2.875rem;"></div>
			<van-submit-bar :price="config.submitBar.price" button-text="批量付款" @submit="onSubmit" style="padding:0 0 0 1rem;">
				<van-checkbox v-model=" config.checkBox.selectAll " :disabled="config.checkBox.disabled" @click="selectAll()">
					全选
				</van-checkbox>
			</van-submit-bar>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Image, Popup, Checkbox, CheckboxGroup, Toast, Tag, NavBar, SubmitBar } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Toast.name]: Toast,
			[Tag.name]: Tag,
			[NavBar.name]: NavBar,
			[SubmitBar.name]: SubmitBar,
		},
		props:['listData','selectNum'],
		data(){
			return {
				config:{
					popup:{
						show:false
					},
					submitBar:{
						price:0
					},
					checkBox:{
						selectAll : false,
						disabled  : false
					}
				},
				result : [],
			}
		},
		methods:{
			onSubmit(){
				if( this.result.length == 0 ){
					Toast.fail('请选择要付款的订单');
					return ;
				}
				this.$router.push({ name : 'payWay' , params : { 
					cusOrderId : this.result
				} });
			},
			selectAll(){
				this.result = [];
				if( !this.config.checkBox.selectAll ){
					this.listData.forEach((item,index)=>{
						if( !item.isover ){
							this.result.push(item.cusPoNo);
						}
					});
				}
			}
		},
		created(){
			
		},
		mounted(){
			if( this.selectNum <= 0 ){
				this.config.disabled = true;
			}
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			resultChange(){
				return this.result;
			}
		},
		watch:{
			resultChange( newV,oldV ){
				if( newV.length != this.selectNum ){
					this.config.checkBox.selectAll = false;
				}else{
					this.config.checkBox.selectAll = true;
				}
				this.config.submitBar.price = 0;
				let time = new Date();
				newV.forEach((item,index)=>{
					this.listData.forEach((col,indexCol)=>{
						console.log(col.cost)
						if( col.isover == false ){
							this.listData[indexCol].isover = col.deadline * 1000 > time ? false : true
						}
						if( item == col.cusPoNo && this.listData[indexCol].isover == false ){
							this.config.submitBar.price += Number(col.cost) * 100;
						}
					});
				});
			}
		}
	}
</script>
<style>
	.cap-floating-nav__item {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background-color: #708090;
		background-position: 50%;
	    background-size: cover;
	    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.16);
	    cursor: pointer;
	    margin: 0;
	    padding: 0;
	    border: 0;
	    font: inherit;
	    font-size: 100%;
	    vertical-align: baseline;
	    display: block;
	    position: fixed;
	    bottom:5rem;
	    left:0.625rem;
	    text-align: center;
	}
	.floating-nav__icon{
		position: relative;
		top: 10%;
	}
	.floating-nav__text{
		color:#fff;
	}
	.cap-floating-nav__span {
		width: 3.2rem;
		height: 1rem;
		border-radius: 25%;
		background-color: #708090;
		background-position: 50%;
	    background-size: cover;
	    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.16);
	    cursor: pointer;
	    margin: 0;
	    padding: 0;
	    border: 0;
	    font: inherit;
	    font-size: 0.75rem;
	    vertical-align: baseline;
	    display: block;
	    position: fixed;
	    bottom:4rem;
	    left:0.625rem;
	    text-align: center;
	}
	.floating-item {
		font-size: 1rem;
		line-height: 1rem;
	}
</style>
