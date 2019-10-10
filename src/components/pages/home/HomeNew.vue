<template>
	<div class="container">
		<van-swipe class="container-swipe" :autoplay="3000">
			<van-swipe-item v-for="thumb in goods.thumb" :key="thumb">
				<img :src="thumb" >
			</van-swipe-item>
		</van-swipe>
		<van-grid :column-num="3">
			<van-grid-item :key="1" icon="photo-o" text="员工入口"></van-grid-item>
			<van-grid-item :key="2" icon="photo-o" text="客户客户入口"></van-grid-item>
			<van-grid-item :key="3" icon="photo-o" text="联系我们"></van-grid-item>
		</van-grid>
		<van-cell title="单元格" icon="shop-o">
			<van-icon slot="right-icon" name="search" style="line-height: inherit;" />
		</van-cell>
		
	</div>
</template>
<script>
	import {Grid, GridItem, Swipe, SwipeItem, Cell, CellGroup, Icon } from 'vant';
	export default 
	{
		components:
		{
			[Swipe.name]: Swipe,
    		[SwipeItem.name]: SwipeItem,
    		[Grid.name]: Grid,
    		[GridItem.name]: GridItem,
    		[Cell.name]: Cell,
    		[CellGroup.name]: CellGroup,
    		[Icon.name]: Icon,
		},
		data(){
			return {
				goods:{
					thumb: [
			        	'https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg',
			        	'https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg'
			        ]
				}
			}
		},

	}

</script>
<style lang="less">
	.container {
		padding-bottom: 80px;
		&-swipe {
			img {
			  width: 100%;
			  display: block;
			}
		}
		&-title {
			font-size: 16px;
		}
		&-price {
			color: #f44;
		}
		&-express {
			color: #999;
			font-size: 12px;
			padding: 5px 15px;
		}
		&-cell-group {
			margin: 15px 0;
			.van-cell__value {
			 	color: #999;
			}
		}
		&-tag {
			margin-left: 5px;
		}
	}
</style>
