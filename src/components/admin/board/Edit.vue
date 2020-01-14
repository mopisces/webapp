<template>
	<!-- <div>
		<table>
			<tr>
				<td style="width:150px;">材质</td>
				<td>
					<el-select v-model="formData.boardId" placeholder="请选择" filterable>
						<el-option v-for="(item,index) in config.select.options" :key="index" :label="item.BoardId" :value="item.BoardId"></el-option>
					</el-select>
				</td>
			</tr>
			<tr>
				<td style="width:150px;">标题</td>
				<td>
					<el-input v-model="formData.title" placeholder="请输入内容" style="width: 300px;"></el-input>
				</td>
			</tr>
			<tr>
				<td style="width:150px;">区间价</td>
				<td>
					<el-checkbox v-model="formData.isRangePrice" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
				</td>
			</tr>
			<tr>
				<td style="width:150px;">价格</td>
				<td v-if="Number(formData.isRangePrice)">
					<template v-for="(item,index) in formData.rangePrice">
						<el-input v-model="item.From" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;~&nbsp;
						<el-input v-model="item.To" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;=&nbsp;
						<el-input v-model="item.Price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡&nbsp;&nbsp;
						<template v-if=" index != formData.rangePrice.length - 1 ">
							<el-button size="mini" circle icon="el-icon-plus" type="success" @click=" plusClick( index ) "></el-button>
							<el-button size="mini" circle icon="el-icon-minus" type="success" v-if=" index > 0 " @click="minusClick(index)"></el-button>
						</template>
						<div style="width:100%;height:10px;"></div>
					</template>
				</td>
				<td v-else>
					<el-input v-model="formData.price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡
				</td>
			</tr>
			<tr>
				<td style="width:150px;">市场价</td>
				<td>
					<el-input v-model="formData.marketPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元/㎡
				</td>
			</tr>
			<tr>
				<td style="width:150px;">下单范围</td>
				<td>
					<el-input v-model="formData.buildMin" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;&nbsp;~&nbsp;
					<el-input v-model="formData.buildMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
				</td>
			</tr>
			<tr>
				<td style="width:150px;">单客户限量</td>
				<td>
					<el-input v-model="formData.cusMax" placeholder="请输入内容" style="width: 200px;"></el-input>
				</td>
			</tr>
			<tr>
				<td style="width:150px;">总客户限量</td>
				<td>
					<el-input v-model="formData.total" placeholder="请输入内容" style="width: 200px;"></el-input>
				</td>
			</tr>
			<tr v-if=" config.isFinishLoad ">
				<td style="width:150px;">团购时间</td>
				<td>
					<el-date-picker v-model="formData.dateTime" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				</td>
			</tr>
			<tr>
				<td style="width:150px;">{{ formData.flagName }}</td>
				<td>
					<el-checkbox v-model="formData.isFlag" label="是否为指定标签" border true-label="1" false-label="0"></el-checkbox>
				</td>
			</tr>
		</table>
	</div> -->
	<div>
		<el-form :model="formData" :rules="rules" ref="editForm" label-width="150px" label-position="left">
			<el-form-item label="材质" prop="boardId">
				<el-select v-model="formData.boardId" placeholder="请选择" filterable>
					<el-option v-for="(item,index) in config.select.options" :key="index" :label="item.BoardId" :value="item.BoardId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="formData.title" placeholder="请输入内容" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="区间价" prop="isRangePrice">
				<el-checkbox v-model="formData.isRangePrice" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item>
			<el-form-item label="区间价" prop="rangePrice">
				<template v-if="Number(formData.isRangePrice)">
					<template v-for="(item,index) in formData.rangePrice">
						<el-input v-model="item.From" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;~&nbsp;
						<el-input v-model="item.To" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;=&nbsp;
						<el-input v-model="item.Price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡&nbsp;&nbsp;
						<template v-if=" index != formData.rangePrice.length - 1 ">
							<el-button size="mini" circle icon="el-icon-plus" type="success" @click=" plusClick( index ) "></el-button>
							<el-button size="mini" circle icon="el-icon-minus" type="success" v-if=" index > 0 " @click="minusClick(index)"></el-button>
						</template>
						<div style="width:100%;height:10px;"></div>
					</template>
				</template>
				<template v-else>
					<el-input v-model="formData.price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡
				</template>
			</el-form-item>
			<el-form-item label="市场价" prop="marketPrice">
				<el-input v-model="formData.marketPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元/㎡
			</el-form-item>
			<el-form-item label="下单范围" prop="rangeBuild">
				<el-input v-model="formData.buildMin" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;&nbsp;~&nbsp;
				<el-input v-model="formData.buildMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
			</el-form-item>
			<el-form-item label="单客户限量" prop="cusMax">
				<el-input v-model="formData.cusMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
			</el-form-item>
			<el-form-item label="总客户限量" prop="total">
				<el-input v-model="formData.total" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
			</el-form-item>
			<el-form-item label="团购时间" prop="dateTime" v-if=" config.isFinishLoad ">
				<el-date-picker v-model="formData.dateTime" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item :label="formData.flagName" prop="isFlag">
				<el-checkbox v-model="formData.isFlag" label="是否为指定标签" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="editSave()">保存</el-button>
		<el-button type="success" @click="goBack()">返回</el-button>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config : {
					select : {
						options : []
					},
					isFinishLoad : false
				},
				formData : {
					id           : '',   //id
					boardId      : '',   //材质
					title        : '',   //标题
					isRangePrice : '',   //是否是区间价格
					//区间价格开始
					rangePrice   : [],  
					//区间价格结束
					price        : '',   //非区间价格
					marketPrice  : '',   //市场价
					buildMin     : '',   //下单价格下线
					buildMax     : '',   //下单价格上线
					cusMax       : '',   //单客户限量
					total        : '',   //总客户限量
					dateTime     : [],   //团购时间
					flagName     : '',   //标签名称
					isFlag       : '',   //是否是爆款
				},
				rules : {}
			}
		},
		methods:{
			getBoardId(){
				let self = this;
				this.$request.admin.board.boardIdSelect().then(res=>{
					self.config.select.options = res.result;
				});
			},
			editConfig( id ){
				let self = this;
				this.$request.admin.board.editConfig( { id:id, type:1 } ).then(res=>{
					if( res.errorCode == '00000' ){
						self.formData.boardId      = res.result.BoardId;
						self.formData.title        = res.result.Title;
						self.formData.isRangePrice = res.result.IsRangePrice;
						self.formData.rangePrice   = res.result.rangePrice;
						self.formData.marketPrice  = res.result.MarketPrice;
						self.formData.buildMin     = res.result.BuildMin;
						self.formData.buildMax     = res.result.BuildMax;
						self.formData.cusMax       = res.result.CusMax;
						self.formData.total        = res.result.Total;
						self.formData.dateTime[0]  = res.result.BeginTime;
						self.formData.dateTime[1]  = res.result.EndTime;
						self.formData.flagName     = res.result.FlagName;
						self.formData.isFlag       = res.result.IsFlag;
					}
				}).then(()=>{
					this.config.isFinishLoad = true;
				});
			},
			plusClick( index ){
				this.formData.rangePrice.splice( index + 1, 0, { From:'', To:'', Price:'' } );
			},
			minusClick( index ){
				this.formData.rangePrice.splice( index, 1 );
			},
			goBack(){
				this.$router.push('/new/board/lists')
			},
			editSave(){
				this.$refs['editForm'].validate((valid)=>{
					if( valid ){
						alert('submit!');
					}else{
						console.log('error submit!!');
						return false;
					}
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getBoardId();
			if( this.$route.params.id == '' || typeof(this.$route.params.id) == 'undefined' ){
				this.$alert('请先选择需要修改的记录', '提示', {
					confirmButtonText : '返回',
					callback: action => {
						this.$router.push('/new/board/lists');
					}
				});
				return ;
			}
			this.formData.id = this.$route.params.id;
			this.editConfig( this.$route.params.id );
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
	.info {
		margin-left: 1rem;
		display: inline;
		color: #57a000;
	}
	table td p {
    	display: inline;
    	margin-left: 10px;
    	color: #57a000;
	}
	table td {
		padding: 10px;
	}
</style>