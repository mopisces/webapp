<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="6">
				排序
				<el-select v-model="filterForm.orderType" placeholder="请选择">
					<el-option v-for="item in config.filterOptions.orderType" :key=" 'orderType' + item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="6">
				团购状态
				<el-select v-model="filterForm.orderState" placeholder="请选择">
					<el-option v-for="item in config.filterOptions.orderState" :key=" 'orderState' + item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="6">
				{{ config.flagName }}
				<el-select v-model="filterForm.isFlag" placeholder="请选择">
					<el-option v-for="item in config.filterOptions.isFlag" :key=" 'isFlag' + item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column prop="Id" label="ID" width="50"></el-table-column>
			<el-table-column label="材质,标题" width="100">
				<template slot-scope="scope">
					<span style="color:#e01835">{{ scope.row.BoardId }}</span>
					<span v-if="scope.row.Title">,{{ scope.row.Title }}</span>
				</template>
			</el-table-column>
			<el-table-column label="图片(点击编辑)" width="120">
				<template slot-scope="scope">
					<img style="width: 60px;" :src=" $store.state.common.imgUrl + scope.row.Pic[0] " v-if="scope.row.Pic[0]" @click="showImg(scope.row)">
					<span v-if="scope.row.Pic.length > 1">等{{ scope.row.Pic.length }}张</span>
				</template>
			</el-table-column>
			<el-table-column label="价格(元/㎡)" width="100">
				<template slot-scope="scope">
					<span style="color: #e01835;">{{ scope.row.Price }}</span>
					<br/>
					<span style="text-decoration: line-through;">{{ scope.row.MarketPrice }}</span>
				</template>
			</el-table-column>
			<el-table-column label="团购时间" width="180">
				<template slot-scope="scope">
					<div style=" position:relative; ">
						{{ scope.row.BeginTime }}
						<br/>
						{{ scope.row.EndTime }}
						<span class="flag" style="color: #e01835;border-color: #e01835;" v-if=" scope.row.State === 'ing' ">正在抢购</span>
	                    <span class="flag" style="color: #ffa500;border-color: #ffa500;" v-else-if=" scope.row.State === 'tobe' ">即将开抢</span>
	                    <span class="flag" style="color: #778899;border-color: #778899;" v-else-if=" scope.row.State === 'ed' ">已结束</span>
                    </div>
				</template>
			</el-table-column>
			<el-table-column label="下单范围(㎡)" width="100">
				<template slot-scope="scope">
					{{ scope.row.BuildMin }}&nbsp;~&nbsp;{{ scope.row.BuildMax }}
				</template>
			</el-table-column>
			<el-table-column label="单客户限量(㎡)" width="100">
				<template slot-scope="scope">
					{{ scope.row.CusMax }}
				</template>
			</el-table-column>
			<el-table-column label="售出/总客户限量(㎡)" width="150">
				<template slot-scope="scope">
					{{ scope.row.Sale }}&nbsp;/&nbsp;{{ scope.row.Total }}
				</template>
			</el-table-column>
			<el-table-column label="添加时间" width="180">
				<template slot-scope="scope">
					{{ scope.row.AddTime }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" content="修改" placement="top">
						<i class="el-icon-document icon-size" style="color: #9370db;" @click="edit( scope.row )"></i>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="描述" placement="top">
						<i class="el-icon-edit-outline icon-size" style="color: #0a9c4d;" @click="descr( scope.row )">
						</i>
					</el-tooltip>
					<el-popconfirm :title="'确定标记成' + config.flagName + '？'" @onConfirm="changeFlag(scope,1)" v-if=" scope.row.IsFlag == '0' ">
						<i class="el-icon-star-off icon-size" style="color: grey;" slot="reference"></i>
					</el-popconfirm>
					<el-popconfirm :title="'确定取消' + config.flagName + '？'" @onConfirm="changeFlag(scope,0)" v-else>
						<i class="el-icon-star-on icon-size" style="color: rgb(224, 24, 53);"  slot="reference"></i>
					</el-popconfirm>
					<el-popconfirm title="确定删除吗？" @onConfirm="del(scope)">
						<i class="el-icon-delete icon-size" style="color: red;" slot="reference"></i>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<div class="footer" v-if=" config.pagination.show ">
			<el-pagination background layout="prev, pager, next" :total="config.total"  @current-change="pageChange" :current-page.sync="filterForm.curPage">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config : {
					pagination : {
						show : false
					},
					flagName : '',
					total    : 0,
					curPage  : 1,
					filterOptions : {
						orderType : [
							{
								value : 1,
								label : '降序'
							},
							{
								value : 2,
								label : '升序'
							}
						],
						orderState : [
							{
								value : 0,
								label : '全部'
							},
							{
								value : 1,
								label : '正在抢购'
							},
							{
								value : 2,
								label : '即将开抢'
							},
							{
								value : 3,
								label : '已结束'
							}
						],
						isFlag : [
							{
								value : 0,
								label : '全部'
							},
							{
								value : 1,
								label : '是'
							},
							{
								value : 2,
								label : '否'
							}
						]
					} 
				},
				filterForm : {
					orderType  : 1,
					orderState : 0,
					isFlag     : 0,
					curPage    : 1,
				},
				tableData:[],
			}
		},
		methods:{
			getAddConfig(){
				let self = this;
				this.$request.admin.board.addConfig().then(res=>{
					self.config.flagName = res.result;
				});
			},
			getList(){
				let self = this;
				this.$request.admin.board.getList( this.filterForm ).then(res=>{
					if( res.errorCode == '20250' ){
						self.tableData    = [];
						self.config.total = 0;
					}else{
						self.tableData    = res.result.list;
						self.config.total = res.result.total;
					}
					self.config.pagination.show = true;
				});
			},
			pageChange( curPage ){
				this.tableData          = [];
				this.filterForm.curPage = curPage;
				this.getList();
			},
			tableRowClassName({row, rowIndex}){
				if ( rowIndex%2 == 0 ) {
					return 'even-row';
				}else{
					return 'odd-row';
				}
			},
			del( scope ){
				let self = this;
				this.$request.admin.board.del( scope.row ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							message: '删除成功',
							type: 'success'
						});
						if( self.tableData.length > 1 ){
							self.tableData.splice(scope.$index,1);
						}else{
							self.filterForm.curPage--;
							self.getList();
						}
					}else{
						self.$message({
							message: '删除失败',
							type: 'warning'
						});
					}
				});
			},
			changeFlag( scope, isFlag ){
				let self = this;
				let postData = {
					orderId   : scope.row.Id,
					orderType : scope.row.BoardId == null ? 1 : 2,
					isFlag    : isFlag
				};
				this.$request.admin.board.changeFlag( postData ).then(res=>{
					if( res.errorCode == '00000' ){	
						self.$message({
							message: postData.isFlag == 1 ? '标记成功!' : '取消标记成功!',
							type: 'success'
						});
						self.tableData[ scope.$index ].IsFlag = postData.isFlag;
					}else{
						self.$message({
							message: postData.isFlag == 1 ? '标记失败!' : '取消标记失败!',
							type: 'warning'
						});
					}
				});
			},
			descr( rowData ){
				if( rowData.IsDel == 1 ){
					return ;
				}
				this.$router.push({ 
					name : 'descr', 
					params:{ 
						id        : rowData.Id,
						descr     : rowData.Descr,
						orderType : rowData.BoardId == null ? 1 : 2,
						pageNum   : this.filterForm.curPage
					} 
				});
			},
			edit( rowData ){
				if( rowData.IsDel == 1 ){
					return ;
				}
				this.$router.push({ 
					name : 'boardEdit', 
					params:{ 
						id : rowData.Id,
						pageNum : this.filterForm.curPage
					} 
				});
			},
			showImg( rowData ){
				this.$router.push({ 
					name:'changeImg', 
					params:{ 
						listId   : rowData.Id, 
						listType : 'board' ,
						pageNum  : this.filterForm.curPage
					}
				 });
			}
		},
		created(){
			if( this.$route.query.curPage && Number(this.$route.query.curPage) > 0 ){
				this.filterForm.curPage = Number(this.$route.query.curPage);
			}
			this.getAddConfig();
			this.getList();
		},
		mounted(){
			
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			orderTypeChange(){
				return this.filterForm.orderType;
			},
			orderStateChange(){
				return this.filterForm.orderState;
			},
			isFlagChange(){
				return this.filterForm.isFlag;
			}
		},
		watch:{
			orderTypeChange( newV,oldV ){
				this.getList();
			},
			orderStateChange( newV,oldV ){
				this.getList();
			},
			isFlagChange( newV,oldV ){
				this.getList();
			}
		}
	}
</script>
<style>
	.footer {
		text-align:center;
		margin-top:3.125rem;
	}
	.flag {
		padding: 0 5px;
		font-size: 0.8rem;
		border:1px solid #EF784B;
		border-radius: 50%;
		transform:rotate(-30deg);
		display:inline-block;
		position: absolute;
		top: 20%;
		right: 50%;
	}
	.icon-size {
		font-size: 1.2rem;
	}
	.el-table .even-row {
		background: #f0f0f0;
	}
	.el-table .odd-row {
		background: #fff;
	}
</style>