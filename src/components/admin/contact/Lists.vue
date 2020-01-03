<template>
	<div>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" :offset="100">
				<van-swipe-cell v-for="(item,index) in dataList" :key="index">
					<van-cell :border="false" value="详情" is-link @click="showValue( item.content )">
						<div slot="title" style="text-align:right;">{{ item.name }}</div>
						<van-icon class-prefix="iconfont" :name="item.icon" size="24" slot="icon"/>
					</van-cell>
					<template slot="right">
						<van-button square type="primary" text="修改" @click="contactEdit( item.id )"/>
						<van-button square type="danger"  text="删除" @click="contactDel( index )"/>
					</template>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>
		
	</div>
</template>
<script>
	import { Button, Cell, Icon, Dialog, PullRefresh, SwipeCell, List } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[PullRefresh.name]: PullRefresh,
			[SwipeCell.name]: SwipeCell,
			[List.name]: List,
		},
		data(){
			return {
				config:{
					pullRefresh:{
						isLoading : false
					},
					list:{
						pullRefresh:{
							reloading : false,
							isInit    : true
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					},
				},
				dataList : [],
				curPage  : 0,
			}
		},
		methods:{
			contactLists( curPage ){
				let self = this;
				this.$request.admin.contact.contactLists( curPage ).then(res=>{
					if( res.result == null || res.result.length < 15 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					res.result.forEach((item,index)=>{
						let arrIcon = item.Icon.split('-');
						self.dataList.push({ icon:arrIcon[1], name: item.Name, content:item.Content, id:item.Id });
					});
				});
			},
			onLoad(){
				this.curPage++;
				this.contactLists( this.curPage );
			},
			pullOnRefresh(){
				this.dataList = [];
				this.curPage  = 0;
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.onLoad();
			},
			contactEdit( id ){
				this.$router.push({ name:'contactEdit', params:{
					contactId : id
				} });
			},
			contactDel( index ){
				Dialog.confirm({
					message: '确认删除？'
				}).then(()=>{
					let self = this;
					this.$request.admin.contact.contactDel( this.dataList[ index ].id ).then(res=>{
						if( res.errorCode == '00000' ){
							self.dataList.splice(index,1);
						}
					});
				}).catch(()=>{
					Dialog.close();
				});
			},
			showValue( value ){
				Dialog.alert({
					title : '联系方式内容',
					message : value
				}).then(()=>{
					Dialog.close()
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','联系方式列表');
		},
		mounted(){
			this.onLoad();
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