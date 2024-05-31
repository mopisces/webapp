<!-- 团购列表 -->
<template>
	<div class="page-color product-detail-container" :style="'min-height: '+ pageH/16 +'rem;'">
		<div class="product-detail-header-box" :style="{ background: 'rgba(255,255,255,' + config.opcity + ')' }">
			<div class="product-detail-header" :style="{ opacity: config.opcity }">
				商品详情
			</div>
			<div class="product-detail-header-icon" @click="doClick(1)">
				<van-icon name="arrow-left" size="1.5rem"/>
			</div>
		</div>
		<div class="product-detail-banner">
			<van-swipe 
				class="product-detail-banner-swipe" 
				:style="{height: pageW*0.65/16 + 'rem'}"
				:autoplay="3000" 
				indicator-color="white"
			>
				<van-swipe-item v-for="(image, index) in productInfo.pic" :key="index">
					<van-image 
						:src="image" 
						:width="pageW" 
						:height="pageW*0.65"
					/>
				</van-swipe-item>
			</van-swipe>
		</div>
	
		<div class="product-detail-box">
			<div class="product-detail-title product-detail-title-box product-detail-radius">
				<div class="product-detail-pricebox">
					<div class="product-detail-price">
						<div class="price-text" v-if="productInfo.isRangePrice == 1">
							<span>￥</span>
							<span class="tui-price">{{ productInfo.priceMax.split('.')[0] }}</span>
							<span class="tui-price">.{{ productInfo.priceMax.split('.')[1] }}</span>
							<span>~</span>
							<span class="tui-price">{{ productInfo.priceMin.split('.')[0] }}</span>
							<span class="tui-price">.{{ productInfo.priceMin.split('.')[1] }}</span>
						</div>
						<div class="price-text" v-else>
							<span>￥</span>
							<span class="tui-price">{{ productInfo.price.split('.')[0] }}</span>
							<span class="tui-price">.{{ productInfo.price.split('.')[1] }}</span>
						</div>
					</div>
					<div class="product-detail-original-price">
						市场价
						<span class="product-detail-line-through">￥{{ productInfo.marketPrice }}</span>
					</div>
				</div>
				
				<div class="product-detail-countdown">
					<img class="countdown_icon" src="@/assets/image/mall/group-detail-limit.png">
					<van-count-down v-if="productInfo.countTime" :time="productInfo.countTime" @finish="finish()">
						<template v-slot="timeData">
							<span class="product-detail-countdown-item">{{ timeData.days }}天</span>
							<span class="product-detail-countdown-item">{{ timeData.hours }}时</span>
							<span class="product-detail-countdown-item">{{ timeData.minutes }}分</span>
							<span class="product-detail-countdown-item">{{ timeData.seconds }}秒</span>
						</template>
					</van-count-down>
				</div>
			</div>

			<div class="product-detail-title tui-pro-radius">
				<!-- 标题 -->
				<div class="product-detail-titbox">
					<div class="tui-pro-title">
						{{ productInfo.boardId }}
						<span class="mg-left-20">{{ productInfo.title }}</span>
					</div>
				</div>
				<!-- 商品描述 -->
				<div v-if="productInfo.descr" class="product-detail-padding">
					<div class="product-detail-sale-info tui-size product-detail-gray">
						<div v-html="productInfo.descr"></div>
					</div>
				</div>
			</div>

		</div>
		<!-- 客户限量信息 -->
		<div v-if="accessToken" class="tui-basic-info tui-mtop tui-radius-all product-detail-limit-box">
			<!-- <div class="tui-list-cell">
				<div class="tui-bold tui-cell-title">总限量</div>
				<div class="detail-progress-bar">
			        <div class="detail-liquid" :style="'width: ' + 20 + '%;'"></div>
			        <div class="detail-descr">已抢{{ 20 }}%剩余 {{ 100 }} ㎡</div>
			    </div>
			</div> -->
			<div class="tui-list-cell">
				<div class="tui-bold tui-cell-title">我的限量</div>
				<div class="detail-progress-bar">
			        <div class="detail-liquid" :style="'width: ' + productInfo.cusBuyPercent + '%;'"></div>
			        <div class="detail-descr">已抢{{ productInfo.cusBuyPercent }}%剩余 {{ productInfo.cusRemainArea }} ㎡</div>
			    </div>
			</div>
			<div class="tui-list-cell">
				<div class="tui-bold tui-cell-title">单笔限购</div>
				<van-tag size="medium" round type="danger">
					{{ productInfo.buildMin }}㎡ ~ {{ productInfo.buildMax }}㎡
				</van-tag>
			</div>
		</div>
		<!-- 区间价格 -->
		<div v-if="productInfo.isRangePrice == 1" class="tui-basic-info tui-mtop tui-radius-all product-detail-range-price">
			<div class="tui-list-cell">
				<div class="tui-bold tui-cell-title">区间价格</div>
				<div class="tui-addr-box">
					<van-row v-for="(prices, idx) in productInfo.rangePrice" :key="idx">
						<van-col span="12" class="range-price-item">{{ prices.from }}㎡~{{ prices.to }}㎡</van-col>
						<van-col span="12" class="range-price-item">{{ prices.price }}元/平方米</van-col>
					</van-row>
				</div>
			</div>
		</div>
		
		<!-- 已售信息 -->
		<div class="tui-basic-info tui-mtop tui-radius-all product-detail-result">
			<div class="result-title">买家订单(金额单位:元)</div>
			<van-row class="result-row-list">
				<van-col span="4" class="result-row-item">采购商</van-col>
				<van-col span="7" class="result-row-item">下单面积(㎡)</van-col>
				<van-col span="7" class="result-row-item">下单金额</van-col>
				<van-col span="6" class="result-row-item">节省金额</van-col>
			</van-row>
			<div class="result-scroll-box">
				<vue-seamless-scroll :data="buyResult" :class-option="classOption">
					<van-row 
						class="result-row-list"
						v-for="(result, index) in buyResult"
						:key="index"
					>
						<van-col span="4" class="result-row-item">{{ result.cusId }}</van-col>
						<van-col span="7" class="result-row-item">{{ result.area }}</van-col>
						<van-col span="7" class="result-row-item">{{ result.cost }}</van-col>
						<van-col span="6" class="result-row-item">{{ result.saveCost }}</van-col>
					</van-row>
				</vue-seamless-scroll>
			</div>
		</div>

		<van-goods-action>
			<van-goods-action-icon icon="user-o" text="我的" @click="doClick(3)" />
			<van-goods-action-icon icon="home-o" text="首页" @click="doClick(1)" />
			<template v-if="formData.ordType == 1">
				<van-goods-action-button 
					v-if="config.page.showGroupSimpleBuild==1"
					type="warning" 
					text="简单纸板" 
					:disabled="config.goodsAction.disabled"
					@click="doClick(100)"
				/>
  				<van-goods-action-button 
  					type="danger" 
  					:text="config.page.showGroupSimpleBuild==1?'纸箱纸板':'立即下单'" 
  					:disabled="config.goodsAction.disabled"
  					@click="doClick(200)"
  				/>
			</template>
			<template v-else>
				<van-goods-action-button 
					type="danger" 
					text="纸箱下单" 
					:disabled="config.goodsAction.disabled"
					@click="doClick(300)"
				/>
			</template>
		</van-goods-action>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Col, Row, Image, CountDown, Swipe, SwipeItem, Tag, GoodsAction, GoodsActionIcon, GoodsActionButton } from "vant"
	/*滚动组件*/
	import vueSeamlessScroll from "vue-seamless-scroll"
	/*api接口*/
	import { fetchList } from "@/api/client/group.js"

	export default {
		components: {
			[Icon.name]: Icon,
			[Col.name]: Col,
			[Row.name]: Row,
			[Image.name]: Image,
			[CountDown.name]: CountDown,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem,
			[Tag.name]: Tag,
			[GoodsAction.name]: GoodsAction,
			[GoodsActionIcon.name]: GoodsActionIcon,
			[GoodsActionButton.name]: GoodsActionButton,
		},
		data() {
			return {
				images: [
					'https://thorui.cn/images/mall/banner/5.jpg',
        			'https://thorui.cn/images/mall/banner/4.jpg',
        			'https://thorui.cn/images/mall/banner/3.jpg',
        			'https://thorui.cn/images/mall/banner/2.jpg',
				],
				/*配置*/
				config: {
					/*表格*/
					table: {
						columns: [
							{ field:"from", title:"起售面积", width:"80", titleAlign:"center", columnAlign:"center" },
							{ field:"to", title:"最大面积", width:"80", titleAlign:"center", columnAlign:"center" },
							{ field:"price", title:"单价", width:"80", titleAlign:"center", columnAlign:"center" },
						]
					},
					/*头部透明度*/
					opcity: 0,
					/*页面配置*/
					page: {
						/*是否显示简单纸板下单*/
						showGroupSimpleBuild: 0,
					},
					/*底部商品导航栏*/
					goodsAction: {
						disabled: false
					},
				},
				/*筛选条件*/
				formData: {
					/*数据类型 2->团购详情*/
					dataType: 2,
					/**
					 * 商品ID
						 */
					productId: null,
					/**
					 * 订单类型
					 * 1->纸板 2->纸箱
					 */
					ordType: 1,
				},
				/*商品详情*/
				productInfo: {
					/*价格*/
					price: '',
					/*市场价格*/
					marketPrice: 0,
					/*商品图片*/
					pic: [],
					/*材质*/
					boardId: null,
					/*标题*/
					title: null,
					/*描述信息*/
					descr: null,
					/*倒计时*/
					countTime: null,
					/*最大限购面积*/
					buildMax: null,
					/*最小起购面积*/
					buildMin: null,
					/*已购买百分比*/
					cusBuyPercent: null,
					/*客户限购面积*/
					cusRemainArea: null,
				},
				/*已销售*/
				buyResult: []
			}
		},
		async created(){
			if( this.$route.query ) {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				await this.fetchDetail()
			} else {
				this.$router.push('/mall/mall/mall')
			}
		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll)
		},
		beforeDestroy() {
			window.removeEventListener('scroll', this.handleScroll)
		},
		computed: {
			...window.Vuex.mapGetters({
				pageH: 'page/pageH',
				pageW: 'page/pageW',
				viewH: 'page/viewH',
				active: 'page/active',
				accessToken: 'user/accessToken'
			}),
			classOption: function () {
				return {
					step: 0.5,
					limitMoveNum: 5
				}
			}
		},
		methods: {
			/*获取页面数据*/
			async fetchDetail() {
				const { result } = await fetchList(this.formData)
				this.productInfo = result.productInfo
				this.buyResult = result.buyResult
				this.config.page = result.page
			},
			/*监听页面滑动*/
			handleScroll(e) {
				if( window.scrollY > 0 ) {
					this.config.opcity =  9 * window.scrollY / this.pageW * 0.75
				}
			},
			/*倒计时结束*/
			finish(){
				this.config.goodsAction.disabled = true
			},
			/**
			 * 页面点击
			 * @param  {[number]} type [点击类型]
			 * @return {[type]}      [description]
			 */
			doClick( type) {
				//跳转首页
				if( type == 1 ) {
					this.$router.replace('/mall/mall/mall')
				}
				//点击客户
				/*if( type == 2 ) {
					window.open('tel:888-888-8888')
				}*/
				if( type == 3 ) {
					this.$router.replace('/client/index/menu')
					this.$store.commit('client/setLoginRedirect', '/client/index/menu')
				}
				//简单纸板下单
				if( type == 100 ) {
					this.$router.push({
						name: 'buildGroupS', 
						query: {
							productId: this.formData.productId
						}
					})
				}
				//纸箱纸板下单
				if( type == 200 ) {
					this.$router.push({ 
						name : 'buildGroupC', 
						query: {
							productId: this.formData.productId
						}
					})
				}
				//纸箱下单
				if( type == 300 ) {
					this.$router.push({ 
						name : 'buildGroupT', 
						query: {
							productId: this.formData.productId
						}
					})
				}
			},

		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';

	.product-detail-container {
		display: flex;
    	box-sizing: border-box;
    	flex-direction: column;
    	margin-bottom: 3.125rem;
	}

	.product-detail-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 995;
		height: 2.875rem;
		background: rgba(255,255,255, 0.5);
	}

	.product-detail-header {
		width: 100%;
		font-size: 1.125rem;
		line-height: 1.125rem;
		font-weight: 500;
		height: 2.875rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-detail-header-icon {
		position: fixed;
		top: 0;
		left: 0.625rem;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 1.5rem;
		transform: translateZ(0);
		z-index: 9999;
		margin-top: 0.6375rem;
		background: rgba(255,255,255,0.75);
		border-radius: 0.75rem;
	}

	.product-detail-banner {
		position: relative;
	}

	.product-detail-banner-swipe {
		width: 100%;
		box-sizing: border-box;
	}

	.product-detail-box {
		box-sizing: border-box;
		color: #333;
	}

	.product-detail-title {
		background: #fff;
		padding: 0.75rem;
	}

	.tui-pro-radius {
		border-bottom-left-radius: 0.75rem;
		border-bottom-right-radius: 0.75rem;
	}

	.product-detail-title-box {
		background: url(/image/mall/group-price.png);
    	background-size: cover;
    	padding: 0.25rem 0rem 0.25rem 0rem;
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between; 
    	align-items: center;  

	}

	.product-detail-radius {
		border-top-left-radius: 0.75rem;
		border-top-right-radius: 0.75rem;
		overflow: hidden;
	}

	.product-detail-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 0.625rem;
		flex-direction: column;
	}

	.product-detail-title-context {
		align-items: center;
		display: flex;
		height: 100%;
		left: 0;
		top: 0;
		width: 100%;
	}

	.product-detail-price-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 0.625rem;
	}

	.product-detail-padding {
		box-sizing: border-box;
	}

	.product-detail-price {
		display: flex;
		align-items: center;
	}

	.product-detail-count-time {
		display: flex;
		align-items: center;
		background-color: #ff201f;
	}

	.product-detail-countdown-item {
		color: #fff;
		font-size: 0.75rem;
		line-height: 0.625rem;
		font-weight: 600;
	}

	
	.price-text {
		font-size: 0.875rem;
		color: #fff;
		font-weight: 600;
	}

	.tui-price {
		font-size: 1.5rem;
	}

	.product-detail-original-price {
		font-size: 0.8125rem;
		line-height: 0.8125rem;
		padding: 0.3125rem 0.9375rem;
		box-sizing: border-box;
		color: #fff;
	} 

	.product-detail-gray {
		color: #999;
	}

	.product-detail-line-through {
		text-decoration: line-through;
	}

	.product-detail-countdown {
		align-items: flex-end;
	    display: flex;
	    flex-direction: column;
	    height: 100%;
	    justify-content: center;
	    padding-right: 0.625rem;
	    width: 9.375rem;
	}
	

	.countdown_icon {
		height: 0.875rem;
    	width: 5.9375rem;
	}

	.product-detail-titbox {
		font-size: 1rem;
		font-weight: 700;
		position: relative;
		box-sizing: border-box;
	}


	.mg-left-20 {
		margin-left: 0.5rem;
	}

	.product-detail-sale-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.5rem;
		color: #262626;
	}

	.tui-size {
		font-size: 0.75rem;
		line-height: 0.75rem;
	}

	.tui-basic-info {
		background: #fff;
	}

	.tui-mtop {
		margin-top: 0.8125rem;
	}

	.tui-radius-all {
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-cell-title {
		font-size: 0.75rem;
		width: 4rem;
		flex-shrink: 0;
		padding-right: 0.75rem;
	}

	.result-row-list {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.result-row-item {
		text-align: center;
		padding: 0.2rem;
		font-size: 0.875rem;
	}

	.product-detail-result {
		padding: 0rem 0.9375rem;
		margin-top: 0.75rem;
		margin-bottom: 0.75rem;
		padding-bottom: 0.9375rem;
	}

	.result-scroll-box {
		max-height: 5rem;
		overflow: hidden;
	}

	.result-title {
		line-height: 1.875rem;
		font-size: 0.9375rem;
		text-align: center;
		font-weight: 800;
	}

	.product-detail-range-price {
		padding: 0rem 0.9375rem 0rem 0.9375rem;
		background: url(/image/mall/group-price.png);
    	background-size: cover;
    	color: #fff;
	}

	.tui-list-cell {
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 0.8125rem;
		line-height: 0.8125rem;
		padding: 0.75rem;
		box-sizing: border-box;
	}

	.tui-addr-box {
		width: 80%;
	}

	.tui-addr-item {
		padding: 0.3125rem;
		line-height: 1.0625rem;
	}

	.range-price-item {
		text-align: center;
		padding: 0.2rem;
		font-size: 0.875rem;
		line-height: 1.275rem;
		font-weight: 700;
	}

	.product-detail-limit-box {
		
	}

	.detail-progress-bar {
        margin: 0.3125rem auto;
        width: 80%;
        height: 1.5rem;
        background-color: #fff;
        border: 0.0625rem solid #fc91b1;
        border-radius: 0.9375rem;
        overflow: hidden;
        position: relative;
    }
    .detail-progress-bar .detail-liquid {
        height: 100%;
        background-color: #fedee8;
        border-radius: 0.9375rem;
    }
    .detail-progress-bar .detail-descr {
        width: 100%;
        line-height: 1.5rem;
        color: #e60044;
        font-size: 0.75rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: absolute;
        top: 0;
    }

    .tui-sale-info {
    	display: flex;
    	align-items: center;
    	justify-content: space-between;
    	padding-top: 0.75rem;
    }
	

	.group-card-price-text {
    	font-size: 1.25rem;
    }
</style>