<template>
	<div>
		<van-grid :column-num="2">
			<van-grid-item icon="photo-o" text="文字" >
				<div slot="icon" style="position:relative;">
					<div style="position:absolute;right:0;top:0;z-index:999;">
						<van-tag mark type="danger">爆款</van-tag>
					</div>
					<van-image :src="img">
						<template v-slot:error>加载失败</template>
					</van-image>
				</div>
				<div slot="text">
					<van-count-down :time="time" milliseconds>
						<template v-slot="timeData">
							<span class="item">
								剩余时间:{{ timeData.days }}天{{ timeData.hours }}:{{ timeData.minutes }}:{{ timeData.seconds }}
							</span>
						</template>
					</van-count-down>
					<!-- <van-circle v-model="currentRate" :rate="30" :speed="100" :text="text" :stroke-width="60" size="120px"/> -->
					<div style="font-size:12px">
						-323B/EB,测试信息
					</div>
					<div style="font-size:15px;color:#ee0a24">
						¥3.00~12.00/㎡
						<span style="color: rgb(202, 202, 202); text-decoration: line-through;">¥30.00/㎡</span>
					</div>
				</div>
			</van-grid-item>
			<van-grid-item icon="photo-o" text="文字" >
				
			</van-grid-item>
		</van-grid>
	</div>
</template>
<script>
	import { Image, Circle, CountDown, Tag, Grid, GridItem } from 'vant';
	export default {
		components:{
			[Image.name]: Image,
			[Circle.name]: Circle,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
		},
		data(){
			return {
				value:'',
				img : require('@/assets/groupImg/FlagBoardGroupPic.jpg'),
				time : 10000000000,
				currentRate : 0
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸板团购');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			text() {
				return this.currentRate.toFixed(0) + '%'
			}
		},
		watch:{

		}
	}
</script>
<style>
	.item {
		width: 2.5rem;
		color: #ee0a24;
		font-size: 0.5rem;
		text-align: center;
		/* background-color: rgba(255, 255, 255, 0.15); */
	}
</style>