<template>
	<div>
		<el-row>
			排序
			<el-select v-model="filterForm.orderType" placeholder="请选择">
				<el-option v-for="item in config.filterOptions.orderType" :key=" 'orderType' + item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-row>
		<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column prop="Id" label="ID" width="50"></el-table-column>
			<el-table-column label="货品编号,标题" width="100">
				<template slot-scope="scope">
					<span style="color:#e01835">{{ scope.row.MatNp }}</span>
					<span v-if="scope.row.Title">,{{ scope.row.Title }}</span>
				</template>
			</el-table-column>
			<el-table-column label="图片(点击编辑)" width="120">
				<template slot-scope="scope">
					<img style="width: 60px;" :src=" $store.state.common.imgUrl + scope.row.Pic[0] " v-if="scope.row.Pic[0]">
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
			<el-table-column label="删除时间" width="180">
				<template slot-scope="scope">
					{{ scope.row.AddTime }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" content="还原" placement="top">
						<i class="el-icon-refresh-left icon-size" style="color: #9370db;" @click="undel( scope.row )"></i>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<div class="footer">
			<el-pagination background layout="prev, pager, next" :total="config.total"  @current-change="pageChange">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config:{
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
						]
					},
					total : 0
				},
				filterForm : {
					orderType : 1,
					curPage   : 1,
				},
				tableData : []
			}
		},
		methods:{
			tableRowClassName({row, rowIndex}){
				if ( rowIndex%2 == 0 ) {
					return 'even-row';
				}else{
					return 'odd-row';
				}
			},
			getList(){
				let self = this;
				this.$request.admin.box.getDelList( this.filterForm ).then(res=>{
					if( res.errorCode == '20250' ){
						self.tableData    = [];
						self.config.total = 0;
					}else{
						self.tableData    = res.result.list;
						self.config.total = res.result.total;
					}
				});
			},
			pageChange( curPage ){
				this.tableData          = [];
				this.filterForm.curPage = curPage;
			},
			undel( scope ){
				let self = this;
				this.$request.admin.board.undel( scope ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							message: '还原成功',
							type: 'success'
						});
						if( self.tableData.length > 1 ){
							self.tableData.splice(scope.$index,1);
						}else{
							self.filterForm.curPage--;
						}
					}else{
						self.$message({
							message: '还原失败',
							type: 'warning'
						});
					}
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getList();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			orderTypeChange(){
				return this.filterForm.orderType;
			},
			curPageChange(){
				return this.filterForm.curPage;
			}
		},
		watch:{
			orderTypeChange( newV,oldV ){
				this.getList();
			},
			curPageChange( newV,oldV ){
				if( newV > 0 ){
					this.getList();
				}else{
					this.filterForm.curPage = 1;
				}
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