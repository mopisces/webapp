<!-- 团购首页 -->
<template>
	<div class="page-color group-index-container" :style="'min-height: '+ pageH/16 +'rem;'">
		<!-- 筛选菜单 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<van-nav-bar
			title="团购"
		/>
		<div class="group-index-banner">
			<van-swipe class="group-index-banner-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(image, index) in config.bannerList" :key="index">
					<van-image 
						:src="image" 
						:width="pageW-20" 
						height="150"
					/>
				</van-swipe-item>
			</van-swipe>
		</div>
		<!-- 头部标签 -->
		<van-sticky>
			<van-tabs 
				v-model="formData.ordState" 
				@change="change"
			>
				<van-tab name="1">
					<div slot="title">
						<van-icon class-prefix="iconfont" name="huore" size="16"/>正在抢购
					</div>
				</van-tab>
				<van-tab name="2">
					<div slot="title">
						<van-icon class-prefix="iconfont" name="jijiang" size="16"/>即将开抢
					</div>
				</van-tab>
				<van-tab name="3">
					<div slot="title">
						<van-icon class-prefix="iconfont" name="jieshu1" size="16"/>已结束
					</div>
				</van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 数据列表 -->
		<div class="group-index-list">
			<van-pull-refresh 
				v-model="config.pullRefresh.reloading" 
				@refresh="pullOnRefresh"
			>
				<van-card 
					v-for="(item,index) in config.indexList" 
					:key="index" 
					@click="detail( item )"
				>
					<div class="mall-list-img-container" slot="thumb" >
						<van-image 
							:src="item.pic" 
							width="95" 
							height="95"
						/>
						<div class="mall-list-img-overlay-box">
							<van-count-down :time="item.countTime" @finish="finish(index)">
								<template v-slot="timeData">
									<span class="list-countdown-item">{{ timeData.hours }}时</span>
									<span class="list-countdown-item">{{ timeData.minutes }}分</span>
									<span class="list-countdown-item">{{ timeData.seconds }}秒</span>
								</template>
							</van-count-down>
						</div>  
					</div>
					
					<div class="group-list-title group-list-pd" slot="title">
						<span class="group-card-bd-text">
							{{ item.boardId }}
						</span>
					</div>
					<div class="group-list-pd" slot="desc">
						<progress-bar :percent="item.salePercent"></progress-bar>
					</div>
					<div class="group-list-pd" slot="price">
						¥<span class="group-card-price-text">{{ item.price }}</span>/
						<span v-if="formData.ordType == 1">㎡</span>
						<span v-else>个</span>
					</div>
					<div class="group-list-pd" slot="origin-price">
						¥{{ item.marketPrice }}/
						<span v-if="formData.ordType == 1">㎡</span>
						<span v-else>个</span>
					</div>
					<van-tag 
						v-if="item.isFlag == 1 "
						slot="tag"
						mark 
						type="danger"
					>
						{{ config.flagName }}
					</van-tag>
					<div slot="tags" class="item-desc-list" >
						<van-tag plain type="primary">
							{{ formData.ordType == 1 ? '纸板':'纸箱' }}
						</van-tag>
						<van-tag plain type="primary" style="margin-left: 0.5rem;">
							{{ item.title }}
						</van-tag>
						<van-tag plain type="danger" style="margin-left: 0.5rem;">
							自营
						</van-tag>
					</div>
				</van-card>
			</van-pull-refresh>
		</div>
		<!-- 底部tabbar -->
		<van-tabbar v-model="active">
			<van-tabbar-item name="group" icon="home-o" @click="doClick(1)">
				团购
			</van-tabbar-item>
			<van-tabbar-item name="home" icon="user-o" @click="doClick(2)">
				我的
			</van-tabbar-item>
		</van-tabbar>
		<!-- 筛选弹窗 -->
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<uni-check-box
					label="团购类型"
					:localdata="config.radio.ordType"
					:radioData.sync="formData.ordType" 
					:map="{text: 'title', value: 'value'}"
				></uni-check-box>
				<uni-check-box
					:label="config.flagName"
					:localdata="config.radio.spFlag"
					:radioData.sync="formData.spFlag" 
					:map="{text: 'title', value: 'value'}"
				></uni-check-box>
				<uni-check-box
					label="材质类型"
					:localdata="config.radio.bdType"
					:radioData.sync="formData.bdType" 
					:map="{text: 'title', value: 'value'}"
				></uni-check-box>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	import { Icon, Image, Notify, PullRefresh, CountDown, Tag, NavBar, Tab, Tabs, Card, Sticky, Swipe, SwipeItem, Tabbar, TabbarItem  } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义百分比*/
	import ProgressBar from "@/components/karry/progressBar/ProgressBar.vue"
	/*api接口*/
	import { fetchConfig, fetchList } from "@/api/client/group.js"
	export default {
		components: {
			[Icon.name]: Icon,
			[Image.name]: Image,
			[PullRefresh.name]: PullRefresh,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[NavBar.name]: NavBar,
			[Card.name]: Card,
			[Sticky.name]: Sticky,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,

			PopupFilter,
			UniCheckBox,
			DragMenu,
			ProgressBar
		},
		data() {
			return {
				/*配置信息*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*下拉刷新*/
					pullRefresh: {
						reloading: false
					},
					/*上拉加载*/
					list: {
						loading: false,
						finished: false
					},
					/*单选配置*/
					radio: {
						bdType: [],
						ordType: [
							{ title:'纸板', value: 1 },
							{ title:'纸箱', value: 2 }
						],
						spFlag: [
							{ title:'全部', value: 2 },
							{ title:'是', value: 1 },
							{ title:'否', value: 0 },
						]
					},
					/*页面数据*/
					indexList: [],
					/*标识名称*/
					flagName: null,
					/*轮播图片*/
					bannerList: [],
				},
				/*筛选条件*/
				formData: {
					/*数据类型 1->团购首页*/
					dataType: 1,
					/**
					 * 订单类型
					 * 1->纸板 2->纸箱
					 */
					ordType: 1,
					/**
					 * 订单状态
					 * 1->正在抢购 2->即将开抢 3->已结束
					 */
					ordState: 1,
					/**
					 * 是否特殊标签
					 * 0->否 1->是 2->全部
					 */
					spFlag: 2,
					/*材质*/
					bdType: '全部',
				},
			}
		},
		async mounted() {
			await this.getConfig()
			await this.$store.commit('page/setActive', 'group')
		},
		beforeDestroy() {
			this.formData = this.$options.data().formData
		},
		computed: {
			...window.Vuex.mapGetters({
				pageH: 'page/pageH',
				pageW: 'page/pageW',
				viewH: 'page/viewH',
				active: 'page/active'
			})
		},
		methods: {
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*头部标签改变*/
			async change(name, title) {
				await window.scrollTo(0, 0)
				await this.fetchData()
			},
			/*获取页面参数*/
			async getConfig() {
				this.formData = this.$options.data().formData
				const { result } = await fetchConfig( this.formData )
				this.config.radio.bdType = result.list
				this.config.flagName = result.flagName
				this.config.bannerList = result.bannerList
				await this.fetchData()
			},
			/*获取页面数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				await this.fetchData()
				this.config.pullRefresh.reloading = false
			},
			/*倒计时结束*/
			async finish( idx ) {
				await this.$set( this.config.indexList[idx], 'inTime', 0 )
			},
			/*列表点击*/
			detail( item ) {
				if( item.inTime == 1 ) {
					this.$router.push({
						path: '/mall/product/detail',
						query: {
							productId: item.id,
							ordType: this.formData.ordType
						}
					})
				} else {
					Notify({
						type: this.formData.ordState == 2? 'warning' : 'danger',
						message: this.formData.ordState == 2? '团购暂未开始,请选择其他团购':'该团购已结束,请选择其他团购'
					})
				}
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				await this.pullOnRefresh()
				this.config.filter.show = false
			},
			/*筛选按钮*/
			async filter() {
				await this.pullOnRefresh()
			},
			/*底部标签栏切换*/
			doClick(type) {
				if( type == 1 ) {
					location.reload()
				} else {
					this.$router.push('/client/index/menu')
				}
			},
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
	.list-countdown-item {
		width: 2.5625rem;
		color: #fff;
		font-size: 0.75rem;
		text-align: center;
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
	
	.group-index-container {
		display: flex;
    	box-sizing: border-box;
    	flex-direction: column;
	}

	.group-index-banner {
		width: 100%;
	    padding: 0 0.625rem;
	    box-sizing: border-box;
	    z-index: 99;
	    left: 0;
	}

	.group-index-banner-swipe {
		color: #fff;
	    font-size: 1.25rem;
	    height: 9.375rem;
	    text-align: center;
	    background-color: #5ac725;
	}

	.group-index-list {
		padding-bottom: 3.125rem;
	}

    .group-list-title {
    	font-size: 0.8rem;
    }

    .group-list-pd {
    	padding: 0.1rem;
    }

    .item-desc-list {
    	display: flex;
	    align-items: center;
	    justify-content: flex-start;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    padding: 0.1rem;
    }

    .item-desc-row {
    	flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
    }

    .countdown-bg {
    	background-color: #ee0a24;
    }

    .mall-list-img-container {
    	position: relative;
    	width: 5.625rem;
    	height: 5.625rem;
    }

    .mall-list-img-overlay-box {
    	position: absolute;  
		left: 0;  
		bottom: 0;
		width: 100%;  
		height: 1rem;  
		background-color: rgba(238, 10, 36, 0.5);
		text-align: center;
    }

    .van-count-down {
    	line-height: 1rem !important;
    	font-size: 0.75rem !important;
    }

    .group-card-price-text {
    	font-size: 1.25rem;
    }
</style>