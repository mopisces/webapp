<template>
	<div>
		<van-card tag="标签" price="2.00" desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/t-thirt.jpg" origin-price="10.00">
			<div slot="title">
				-323C/EB
			</div>
			<div slot="desc">
				0629清仓甩卖
				<van-count-down :time="time">
					<template v-slot="timeData">
						<span>剩余时间:</span>
						<span class="item">{{ timeData.days }}天</span>
						<span class="item">{{ timeData.hours }}小时</span>
						<span class="item">{{ timeData.minutes }}分</span>
						<span class="item">{{ timeData.seconds }}秒</span>
					</template>
				</van-count-down>
			</div>
			<div slot="price" style="font-size:1rem;">
				¥3.00~12.00/㎡
			</div>
			<div slot="origin-price" style="font-size:0.8rem;">
				¥30.00/㎡
			</div>
			<van-tag mark type="danger" slot="tag">爆款</van-tag>
			<div slot="tags">
						<!-- <van-slider active-color="#ee0a24" v-model="value" bar-height="0.125rem">
							<div slot="button" class="custom-button">
								{{ value }}%
							</div>
						</van-slider> -->
						<div class="progress-bar">
			                <div class="liquid" :style="'width: ' + value + '%;'"></div>
			                <div class="descr">已抢{{ value }}%</div>
			            </div>
				<!-- <van-slider active-color="#ee0a24" v-model="value" bar-height="0.125rem">
					<div slot="button" class="custom-button">
						已抢{{ value }}%
					</div>
				</van-slider> -->
			</div>
		</van-card>
	</div>
</template>
<script>
	import { Row, Col, Slider, CountDown, Tag, Card } from 'vant';
	export default {
		components:{
			[Row.name]: Row,
			[Col.name]: Col,
			[Slider.name]: Slider,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Card.name]: Card,
			/*[Image.name]: Image,
			[Circle.name]: Circle,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,*/

		},
		data(){
			return {
				value:1.25,
				img : require('@/assets/groupImg/FlagBoardGroupPic.jpg'),
				time :  12 * 30 * 24 * 60 * 60 * 1000,
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
		width: 2.5625rem;
		color: #fff;
		font-size: 0.75rem;
		text-align: center;
		background-color: #ee0a24;
	}
	.progress-bar {
        margin: 0.3125rem auto;
        width: 90%;
        height: 1rem;
        background-color: #fff;
        border: 0.0625rem solid #fc91b1;
        border-radius: 0.9375rem;
        overflow: hidden;
        position: relative;
    }
    .progress-bar .liquid {
        height: 100%;
        background-color: #fedee8;
        border-radius: 0.9375rem;
    }
    .progress-bar .descr {
        width: 100%;
        line-height: 0.8rem;
        color: #e60044;
        font-size: 0.8rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: absolute;
        top: 0;
    }
</style>