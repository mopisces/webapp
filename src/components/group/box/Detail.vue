<template>
	<div style="background-color:#f5f5f5;">
		<van-swipe :autoplay="3000" indicator-color="white" style="width: 100%; height: 30%; transform: translateX(0px);">
			<van-swipe-item v-for="(image, index) in imagesList" :key="  'img' + index"  >
				<van-image :src="image" style="width:100%;height:10%;">
					<template v-slot:error>加载失败</template>
				</van-image>
			</van-swipe-item>
		</van-swipe>
		<div class="van-cell">
			<div class="van-cell__title">
				<span style="color:rgb(224, 24, 53);font-size:1.375rem;" >¥{{ detailData.Price }}/个</span>
				<div class="van-cell__label">
					<span style="font-size: 0.75rem; color: rgb(202, 202, 202); text-decoration: line-through;">
						¥{{ detailData.MarketPrice }}/个
					</span>
				</div>
			</div>
		</div>
		<div  class="van-cell" style="font-size:1rem;">
			{{ detailData.MatNo }}
			<span style="color:#000;" v-if="detailData.Title">,{{ detailData.Title }}</span>
		</div>
		<div class="van-cell" style="margin-top:0.625rem;">
			<span style="font-size:1rem;">区间价格</span>
		</div>
		<div class="van-cell" v-for="(item,index) in detailData.RangePrice" :key=" 'RangePrice' + index ">
			<div class="van-cell__title">
				<span>{{ item.From }} 个 ~ {{ item.To }} 个</span>
			</div>
			<span class="van-icon" style="color:rgb(224, 24, 53);">¥{{ item.Price }}/个</span>
		</div>
		<div class="van-cell" style="margin-top:0.625rem;font-family: -apple-system-font,Helvetica Neue,sans-serif;">
			<div class="van-cell__title">
				<span style="font-size:1.125rem;">距团购结束</span>
			</div>
			<div clss="van-icon" style="font-size:1.125rem;"  v-if="config.countDown.show">
				<van-count-down :time="countDownTime" @finish="countDownFinish()">
					<template v-slot="timeData">
						<span class="detail-item">{{ timeData.days }}天</span>
						<span class="detail-item">{{ timeData.hours }}:</span>
						<span class="detail-item">{{ timeData.minutes }}:</span>
						<span class="detail-item">{{ timeData.seconds }}</span>
					</template>
				</van-count-down>
			</div>
		</div>
		<div class="van-cell" style="margin-top:0.625rem;font-size:1rem;">
			总客户限量 {{ detailData.Total }} 个
		</div>
		<div class="van-cell">
			<div class="detail-progress-bar">
		        <div class="detail-liquid" :style="'width: ' + detailData.SalePercent + '%;'"></div>
		        <div class="detail-descr">已抢{{ detailData.SalePercent }}%剩余 {{ detailData.Surp1 }} 个</div>
		    </div>
		</div>
		<div class="van-cell" style="margin-top:0.625rem;font-size:1rem;">
			单客户限量 {{ detailData.CusMax }} 个
		</div>
		<div class="van-cell">
			<div class="detail-progress-bar">
		        <div class="detail-liquid" :style="'width: ' + detailData.CusPercent + '%;'"></div>
		        <div class="detail-descr">你已购{{ detailData.CusPercent }}%剩余 {{ detailData.Surp2 }} 个</div>
		    </div>
		</div>
		<div class="van-cell" style="margin-top:0.625rem;font-size:1rem;">
			买家订单(金额单位:元)
		</div>
		<div class="van-cell">
			<div class="van-row" style="width:100%;text-align:center;">
				<div class="van-col van-col--4">采购商</div>
				<div class="van-col van-col--7">下单个数</div>
				<div class="van-col van-col--7">下单金额</div>
				<div class="van-col van-col--6">节省金额</div>
			</div>
		</div>
		<div class="van-cell" style="max-height: 10rem;"> 
			<vue-seamless-scroll :data="buyResult" :class-option="classOption" style="width:100%;">
				<div class="van-row" style="width:100%;text-align:center;" v-for="item in buyResult">
					<div class="van-col van-col--4">{{ item.CusId }}</div>
					<div class="van-col van-col--7">{{ item.OrdQty }}</div>
					<div class="van-col van-col--7">{{ item.Cost }}</div>
					<div class="van-col van-col--6">{{ item.SaveCost }}</div>
				</div>
			</vue-seamless-scroll>
		</div>
		<template v-if="descInfo">
			<div class="van-cell" style="margin-top:0.625rem;font-size:1rem;">
				产品描述
			</div>
			<div class="van-cell">
				{{ descInfo }}
			</div>
		</template>
		<div class="van-cell">
			<template v-if="!config.button.disabled">
				<van-button type="warning" size="large" square class="van-goods-action-button van-goods-action-button--warning" @click="buildt()">{{ config.button.text }}</van-button>
			</template>
			<van-button size="large" color="#868080" v-else>团购已结束</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Image,CountDown, Swipe, SwipeItem } from 'vant';
	import vueSeamlessScroll from 'vue-seamless-scroll'
	export default {
		components:{
			[Button.name]: Button,
			[Image.name]: Image,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem,
			[CountDown.name]: CountDown,
			
			vueSeamlessScroll
		},
		data(){
			return {
				config: {
					button:{
						disabled : false,
						text : '立即抢购'
					},
					countDown : {
						show : false
					}
				},
      			imagesList : [],
              	detailData : {},
              	buyResult  : [],
              	descInfo   : '',
              	countDownTime : 0,
              	productId : ''
			}
		},
		methods:{
			groupBuyDetail( id ){
				let self = this;
				this.$request.client.groupBuying.groupBuyDetail(  { id : id, isTaobao:1  }  ).then(res=>{
					self.detailData = res.result.goods_detail;
					self.buyResult  = res.result.buy_result;
					self.descInfo   = res.result.desc_info;
					res.result.goods_detail.Pic.forEach((item,index)=>{
						if( item != '' ){
							self.imagesList.push( require( '@/assets/groupImg/'  + item ) );
						}else{
							self.imagesList.push( require( '@/assets/groupImg/zwtp.png') );
						}
					});
				}).then(()=>{
					this.$nextTick(()=>{
						if( this.detailData.BeginTime * 1000 < (new Date()).valueOf()  ){
							this.countDownTime = this.detailData.EndTime * 1000 - (new Date()).valueOf();
						}else{
							this.countDownTime = ( this.detailData.EndTime - this.detailData.BeginTime ) * 1000;
						}	
						this.config.countDown.show = true;
					});
				});
			},
			countDownFinish(){
				this.config.button.disabled = true;
				this.config.button.text     = '团购已结束';
			},
			buildt(){
				this.$router.push({ 
					name : 'buildGroupT', 
					params : { productId : sessionStorage.getItem('group-product-id') } 
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','淘宝箱团购详情');
		},
		mounted(){
			if( typeof(this.$route.params.productId) != 'undefined' ){
				this.productId = this.$route.params.productId ;
			}else if( sessionStorage.getItem('group-product-id') != null ){
				this.productId = sessionStorage.getItem('group-product-id');
			}else{
				this.$router.go(-1);
			}
			this.groupBuyDetail( this.productId );
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			classOption: function () {
				return {
					step: 0.5,
					limitMoveNum: 5
				}
			}
		},
		watch:{

		}
	}
</script>
<style>
	.detail-item { 
		color: #fff;
		font-size: 1.2rem;
		text-align: center;
		background-color: rgb(224, 24, 53);
	}
	.detail-progress-bar {
        margin: 0.3125rem auto;
        width: 90%;
        height: 2.1875rem;
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
        line-height: 2.1875rem;
        color: #e60044;
        font-size: 1rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: absolute;
        top: 0;
    }
</style>