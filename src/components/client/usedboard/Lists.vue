<template>
	<div>
		<van-search placeholder="请输入搜索关键词" v-model="value" />
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				
			</van-list>
		</van-pull-refresh>
		<van-checkbox v-model="checked" checked-color="#07c160" v-for="(item,index) in checkBoxData">
			复选框
		</van-checkbox>
	</div>
</template>
<script>
	import { Checkbox, CheckboxGroup, Search, PullRefresh, List } from 'vant';
	export default {
		components:{
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Search.name]: Search,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
		},
		data(){
			return {
				config:{
					list:{
						pullRefresh : {
							reloading : false,
							isInit    : true
						},
						pushLoading : {
							loading  : false,
							finished : false
						}
					}
				},
				filterForm : {
					showChecked : 0,
					curPage     : 0
				},
				value:'',
				checked : '',
				checkBoxData : []
			}
		},
		methods:{
			onLoad(){
				if( this.config.list.pullRefresh.isInit ){
					this.filterForm.curPage = 1;
					this.getConfig();
					this.config.list.pullRefresh.isInit = false;
				}else{
					this.filterForm.curPage++;
					this.commonMaterial( this.filterForm );
				}
			},
			pullOnRefresh(){

			},
			getConfig(){
				let self = this;
				this.$request.client.commonMaterial.getConfig().then(res=>{
					
				});
			},
			commonMaterial(){
				let self = this;
				this.$request.client.commonMaterial.getMaterial().then(res=>{

				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','常用材质');
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
