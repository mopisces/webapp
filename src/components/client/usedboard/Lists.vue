<template>
	<div>
		<van-sticky :offset-top="46">
			<van-search placeholder="请输入搜索关键词" v-model="filterForm.keyWord" @input="search()" />
		</van-sticky>
		<van-checkbox-group v-model="checkBoxResult">
			<van-cell-group>
				<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
					<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多" @load="onLoad" :immediate-check="false" :offset="100">
						<van-cell v-for="(item, index) in checkBoxData" clickable :key="index" :title="item" @click="toggle(index)">
							<van-checkbox :name="item" ref="checkboxes" slot="right-icon"/>
						</van-cell>
					</van-list>
				</van-pull-refresh>
			</van-cell-group>
		</van-checkbox-group>
		<div style="width:100%;height:2.875rem;bottom:2.875rem;position:fixed;">
			<div class="van-col van-col--16">
				<van-switch-cell v-model="filterForm.showChecked" title="只显示已选择" />
			</div>
			<div class="van-col van-col--8">
				<van-button type="primary" style="width:100%;" @click="saveMaterial()">保存</van-button>
			</div>
		</div>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Checkbox, CheckboxGroup, Search, SwitchCell, PullRefresh, Toast , List, Sticky } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Search.name]: Search,
			[SwitchCell.name]: SwitchCell,
			[PullRefresh.name]: PullRefresh,
			[Toast.name]: Toast,
			[List.name]: List,
			[Sticky.name]: Sticky,
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
							finished : false,
						},
						returnType : '0',   //后台是否分页 1 不分页 0 分页
					}
				},
				filterForm : {
					keyWord     : '',
					showChecked : false,
					curPage     : 1
				},
				checkBoxData   : [],
				checkBoxResult : [],
			}
		},
		methods:{
			toggle(index){
				this.$refs.checkboxes[index].toggle();
			},
			onLoad(){
				this.filterForm.curPage++;
				this.commonMaterial( this.filterForm );
			},
			pullOnRefresh(){
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.filterForm.curPage = 1;
				this.checkBoxData       = [];
				this.getConfig();
			},
			getConfig(){
				let self = this;
				this.$request.client.commonMaterial.getConfig().then(res=>{
					self.config.list.returnType = res.result;
				}).then(()=>{
					this.$nextTick(()=>{
						this.commonMaterial( this.filterForm );
					});
				});
			},
			commonMaterial( data ){
				let self = this;
				this.$request.client.commonMaterial.getMaterial( data ).then(res=>{
					if( res.result == null || self.config.list.returnType == '1' || res.result.BoardCodeCheckbox.length < 100 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					if( self.filterForm.curPage == 1){
						self.checkBoxResult = res.result.BeChecked;
					}
					res.result.BoardCodeCheckbox.forEach((item,index)=>{
						self.checkBoxData.push(item.BoardId);
					});
				});
			},
			saveMaterial(){
				let data = {
					selectName : this.checkBoxResult.join(',')
				};
				this.$request.client.commonMaterial.materialSave( data ).then(res=>{
					Toast.success(res.msg);
				});
			},
			search(){
				this.pullOnRefresh();
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','常用材质');
		},
		mounted(){
			this.getConfig();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			switchChange(){
				return this.filterForm.showChecked;
			}
		},
		watch:{
			switchChange( newV,oldV ){
				this.pullOnRefresh();
			}
		}
	}
</script>
