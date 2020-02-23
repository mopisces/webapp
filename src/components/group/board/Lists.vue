<template>
	<div>
		<van-tabs v-model="formData.state">
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
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100" :immediate-check="false">
				<van-card v-for="(item,index) in listData" :key=" 'card' + index " @click="detailClick( item.Id, 0 )">
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
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import { Icon, Image, PullRefresh, CountDown, List, Tag, Tab, Tabs, Card } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Image.name]: Image,
			[PullRefresh.name]: PullRefresh,
			[CountDown.name]: CountDown,
			[List.name]: List,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Card.name]: Card,
		},
		data(){
			return {
				config : {
					list : {
						pullRefresh:{
							reloading : false,
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					}
				},
				formData:{
					state      : '1',
					isTaoBao   : 0,
					filterName : '全部',
					curPage    : 1
				},
				listData : []
			}
		},
		methods:{
			pullOnRefresh(){
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.formData.curPage = 1;
				this.getBoardList();
			},
			onLoad(){
				this.formData.curPage++;
				this.getBoardList();
			},
			getBoardList(){
				this.listData = [];
				let self = this;
				this.$request.client.groupBuying.groupBuyList( this.formData ).then(res=>{
					if( res.result == null || res.result.length < 7 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					res.result.forEach((item,index)=>{
						item.time  = ( Number(item.EndTime) - Number(item.CurTime) ) * 1000;
						if( typeof(item.Pic) == 'object' && item.Pic[0] != ''){
							item.thumb = require('@/assets/groupImg/' + item.Pic[0]);
						}
					});
					self.listData = res.result;
				});
			}
		},
		created(){
			this.$store.commit('common/setTitle','纸板团购');
		},
		mounted(){
			this.getBoardList()
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