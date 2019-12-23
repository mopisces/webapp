<template>
	<div>
		<van-card v-for="(item,index) in listData" :key=" 'card' + index " @click="detailClick( item.Id )">
			<van-image slot="thumb" :src="item.thumb" width="90" height="90"/>
			<div slot="title">
				{{ item.BoardId }}
			</div>
			<div slot="desc">
				<span v-if="item.Title != ''">
					{{ item.Title }}
				</span>
				<van-count-down :time="item.time">
					<template v-slot="timeData">
						<span style="font-size:0.75rem;">剩余时间:</span>
						<span class="item">{{ timeData.days }}天</span>
						<span class="item">{{ timeData.hours }}小时</span>
						<span class="item">{{ timeData.minutes }}分</span>
						<span class="item">{{ timeData.seconds }}秒</span>
					</template>
				</van-count-down>
			</div>
			<div slot="price" style="font-size:1rem;">
				¥{{ item.Price }}/㎡
			</div>
			<div slot="origin-price" style="font-size:0.8rem;">
				¥{{ item.MarketPrice }}/㎡
			</div>
			<van-tag mark type="danger" slot="tag">爆款</van-tag>
			<div slot="tags">
				<div class="progress-bar">
	                <div class="liquid" :style="'width: ' + item.SalePercent + '%;'"></div>
	                <div class="descr">已抢{{ item.SalePercent }}%</div>
	            </div>
			</div>
		</van-card>
	</div>
</template>
<script>
	import { Image, CountDown, Tag, Card } from 'vant';
	export default {
		components:{
			[Image.name]: Image,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Card.name]: Card,
		},
		data(){
			return {
				listData : []
			}
		},
		methods:{
			faddishList( isTaobao ){
				let self = this;
				this.$request.client.groupBuying.faddishList( isTaobao ).then(res=>{
					res.result.forEach((item,index)=>{
						item.time  = ( Number(item.EndTime) - Number(item.CurTime) ) * 1000;
						if( typeof(item.Pic) == 'object' && item.Pic[0] != ''){
							item.thumb = require('@/assets/groupImg/' + item.Pic[0]);
						}
					});
					self.listData = res.result;
				});
			},
			detailClick( cardId ){
				this.$router.push({ name:'boardDetail', params:{ productId:cardId } });
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸板团购');
		},
		mounted(){
			this.faddishList(0);
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
	.item {
		width: 2.5625rem;
		color: #fff;
		font-size: 0.75rem;
		text-align: center;
		background-color: #ee0a24;
		margin-right: 0.3125rem;
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