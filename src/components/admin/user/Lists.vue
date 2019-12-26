<template>
	<div>
		<van-field label="用户名" value="密码" input-align="left" readonly/>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" :offset="100">
				<van-swipe-cell v-for="(item,index) in dataList" :key="index" >
					<van-field :label="item.name" v-model="item.pass" input-align="left" :readonly="item.readonly">
						<van-button slot="button" size="small" type="primary" v-if="!item.readonly" @click="modifyConfirm(index)">
							确认
						</van-button>
					</van-field>
					<template slot="right">
						<van-button square type="warning" text="取消" v-if="!item.readonly" @click="cancelEdit(index)"/>
						<van-button square type="primary" text="修改" @click="modifyClick(index)" v-if="item.readonly"/>
						<van-button square type="danger" text="删除" @click="delClick(index)"/>
					</template>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import { Button, Cell, Icon, Field, Dialog, PullRefresh, SwipeCell, List } from 'vant';
	import '@vant/touch-emulator';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[Field.name]: Field,
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
				dataList:[],
				curPage : 0,
			}
		},
		methods:{
			getUserList( curPage ){
				let self = this;
				this.$request.admin.user.getUserList( curPage ).then(res=>{
					if( res.result == null || res.result.data.length < 15 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					res.result.data.forEach((item,index)=>{
						self.dataList.push({ name:item.UserName, pass: item.PassWord, readonly:true });
					});
				});
			},
			onLoad(){
				this.curPage++;
				this.getUserList( this.curPage );
			},
			pullOnRefresh(){
				this.dataList = [];
				this.curPage  = 0;
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.onLoad();
			},
			modifyClick( index ){
				for (var i = this.dataList.length - 1; i >= 0; i--) {
					this.dataList[i].readonly = true;
				}
				this.dataList[ index ].readonly = false;
			},
			modifyConfirm( index ){
				let postData = {
					userName : this.dataList[ index ].name,
					userPass : this.dataList[ index ].pass
				};
				let self = this;
				this.$request.admin.user.editUser( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.dataList[ index ].readonly = true;
					}
				});
			},
			cancelEdit( index ){
				this.dataList[ index ].readonly = true;
			},
			delClick( index ){
				Dialog.confirm({
					message: '确认删除？'
				}).then(()=>{
					let self = this;
					this.$request.admin.user.delUser( this.dataList[ index ].name ).then(res=>{
						if( res.errorCode == '00000' ){
							self.dataList.splice(index,1);
						}
					});
				}).catch(()=>{
					Dialog.close();
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','用户列表');
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