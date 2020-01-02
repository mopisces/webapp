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
					<van-cell clickable>
						<div slot="title" class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--6">
								<van-image src="https://img.yzcdn.cn/vant/cat.jpeg" round width="40" height="40"/>
							</div>
							<div class="van-col van-col--12 floating-nav__tag">
								<img style="vertical-align:middle;height:100%" v-if="false">
								<span style="color: rgb(224, 24, 53);">-323C/EB</span>
								<span>,0629清仓甩卖</span>
							</div>
							<div class="van-col van-col--6" style="text-align:right;margin-top:0.75rem;color:#999;">
								¥556.70
							</div>
						</div>
						<van-checkbox name="a" slot="right-icon"/>
					</van-cell>
				</van-cell-group>
			</van-checkbox-group>
			<div style="width:100%;height:2.875rem;"></div>
			<div style="width:100%;bottom:0;position:fixed;">
				<van-submit-bar :price="config.submitBar.price" button-text="批量付款" @submit="onSubmit">
					<van-checkbox v-model=" config.checkBox.selectAll ">全选</van-checkbox>
				</van-submit-bar>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Image, Popup, Checkbox, CheckboxGroup, NavBar, SubmitBar } from 'vant';
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
			[NavBar.name]: NavBar,
			[SubmitBar.name]: SubmitBar,
		},
		props:['listData'],
		data(){
			return {
				config:{
					popup:{
						show:false
					},
					submitBar:{
						price:3000
					},
					checkBox:{
						selectAll : false
					}
				},
				result: ['b'],
				checked:true
			}
		},
		methods:{
			onSubmit(){

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
	.floating-nav__tag::before {
		content: '已超时';
        padding: 0 0.1875rem;
        font-size: 0.875rem;
        color: grey;
        border: 0.0625rem solid grey;
        border-radius: 0.3125rem;
        transform: translateY(-50%) rotate(-25deg);
        position: absolute;
        top: 50%;
        right: 40%;
        z-index: 1;
	}
</style>
