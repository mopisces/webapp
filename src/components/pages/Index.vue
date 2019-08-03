<template>
	<div>
		<van-tabs v-model="active" :duration="0.3" animated>
			<van-tab >
				<div slot="title">
					<van-icon name="hot-o" />生管监控
				</div>
				<div slot="default">
					<div class="van-cell-group van-hairline--top-bottom van-panel" v-for="(value,index) in manageItem" :key="index">
						<div class="van-cell van-panel__header">
							<div class="van-cell__title">
								<span>{{ value.cusName }}</span>
							</div>
							<div class="van-cell__title">
								<span>{{ value.status }}</span>
							</div>
							<div class="van-cell__value van-panel__header-value">
								<div class="van-cell__label" v-for="(v,i) in value.proItem" :key="i">
									<van-tag mark :type="v.status == 0 ? 'danger':'success' " >{{ v.flag }}</van-tag>
								</div>
							</div>
						</div>
					</div>
				</div>
			</van-tab>
			<van-tab>
				<div slot="title">
					<van-icon name="hot-o" />ERP移动办公
				</div>
				<div slot="default">
					<van-grid :column-num="3">
						<van-grid-item  v-for="(value,index) in gridItem" :key="index" icon="hot-o" :text="value.cusName" :to="value.homeUrl">
						</van-grid-item>
					</van-grid>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>
<script >
	import { Tab, Tabs, Icon, Grid, GridItem, Tag } from 'vant';
	export default {
		data(){
			return {
				active:0,
				gridItem:[
					{
						cusName:'绍兴合润',
						homeUrl:'/all/login'
					},
					{
						cusName:'重庆永利',
						homeUrl:'/admin/login'
					},
					{
						cusName:'宁波伟捷',
						homeUrl:'/admin/login'

					},
					{
						cusName:'杭州柯信',
						homeUrl:'/admin/login'

					}

				],
				manageItem:[
					{
						cusName:'绍兴合润',
						status:'ok/4299',
						proItem:[{"flag":"东创2.5m","status":1},{"flag":"德生2.2m","status":0}]
					}
				]
			}
		},
		components:{
			[Tab.name]:Tab,
    		[Tabs.name]:Tabs,
    		[Icon.name]:Icon,
    		[Grid.name]:Grid,
    		[GridItem.name]:GridItem,
    		[Tag.name]:Tag
		},
		created(){
			//this.getManageInfo();
		},
		mounted(){

		},
		updated(){

		},
		methods:{
			getManageInfo(){
				this.manageItem = this.$request.adminRequest.getAllProductInfo();
			}
		}

	}
</script>
<style>
	.van-tab {
		color:#0a0a0a !important;
	}
	.van-tab--active {
		color:#20f514 !important;
	}
	.van-tabs__line {
		background-color: #20f514 !important;
	}
	.van-cell__value {
		text-align: center !important;
	}
	.van-cell__label {
		color:#20f514 !important;
	}
</style>