<template>
	<div>
		<el-form :model="formData" :rules="rules" ref="editForm" label-width="150px" label-position="left">
			<el-form-item label="货品编号" prop="matNo">
				<el-select v-model="formData.matNo" placeholder="请选择" filterable>
					<el-option v-for="(item,index) in config.select.options" :key="index" :label="item.MatNo" :value="item.MatNo"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="formData.title" placeholder="请输入内容" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="区间价" prop="isRangePrice">
				<el-checkbox v-model="formData.isRangePrice" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<template v-if="Number(formData.isRangePrice)">
					<el-input v-model="formData.buildMin" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;个&nbsp;~&nbsp;
					<el-input v-model="formData.firstTo" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;个&nbsp;=&nbsp;
					<el-input v-model="formData.firstPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/个&nbsp;&nbsp;
					<el-button size="mini" circle icon="el-icon-plus" type="success" @click=" plusClick( -1 ) "></el-button>
					<div style="width:100%;height:10px;"></div>
					<template v-for="(item,index) in formData.rangePrice">
						<el-input v-model="item.From" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;个&nbsp;~&nbsp;
						<el-input v-model="item.To" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;个&nbsp;=&nbsp;
						<el-input v-model="item.Price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/个&nbsp;&nbsp;
						<el-button size="mini" circle icon="el-icon-plus" type="success" @click=" plusClick( index + 1 ) "></el-button>
						<el-button size="mini" circle icon="el-icon-minus" type="success" @click="minusClick(index)"></el-button>
						<div style="width:100%;height:10px;"></div>
					</template>
					<el-input v-model="formData.lastFrom" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;个&nbsp;~&nbsp;
					<el-input v-model="formData.buildMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;个&nbsp;=&nbsp;
					<el-input v-model="formData.lastPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/个&nbsp;&nbsp;
				</template>
				<template v-else>
					<el-input v-model="formData.price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/个
				</template>
			</el-form-item>
			<el-form-item label="市场价" prop="marketPrice">
				<el-input v-model="formData.marketPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元/个
			</el-form-item>
			<el-form-item label="下单范围" required>
				<el-col :span="3">
					<el-form-item prop="buildMin">
						<el-input v-model="formData.buildMin" placeholder="请输入内容" type="number" style="width: 100px;"></el-input>&nbsp;个&nbsp;
					</el-form-item>
				</el-col>
				<el-col :span="1">
					~
				</el-col>
				<el-col :span="3">
					<el-form-item prop="buildMax">
						<el-input v-model="formData.buildMax" placeholder="请输入内容" type="number" style="width: 100px;"></el-input>&nbsp;个&nbsp;
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="单客户限量" prop="cusMax">
				<el-input v-model="formData.cusMax" placeholder="请输入内容" type="number" style="width: 100px;"></el-input>&nbsp;个&nbsp;
			</el-form-item>
			<el-form-item label="总客户限量" prop="total">
				<el-input v-model="formData.total" placeholder="请输入内容" type="number" style="width: 100px;"></el-input>&nbsp;个&nbsp;
			</el-form-item>
			<el-form-item label="团购时间" prop="dateTime" v-if=" config.isFinishLoad ">
				<el-date-picker v-model="formData.dateTime" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item :label="formData.flagName" prop="isFlag">
				<el-checkbox v-model="formData.isFlag" label="是否为指定标签" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="editSaveValidate()">保存</el-button>
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
					matNo        : '',   //货品编号
					title        : '',   //标题
					isRangePrice : '',   //是否是区间价格
					//区间价格开始
					rangePrice   : [],  
					firstTo      : '',   //
					firstPrice   : '',   //
					lastFrom     : '',   //
					lastPrice    : '',   //
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
				listPageNum : 1,  //列表页码
				rules : {
					matNo : [
						{ required: true, message: '请选择货品编号', trigger: 'change' }
					],
					price : [
						{ validator:(rule, value, callback)=>{
							let errors;
							if( this.formData.isRangePrice == '0' && value <= 0 ){
								errors = '请输入价格';
							}
							if( this.formData.isRangePrice == '1' ){
								this.formData.rangePrice.forEach((item,index)=>{
									if(!item.From || !item.To || !item.Price){
										errors = '区间价信息不完整';
									}
								});
							}
							callback(errors);
						} }
					],
					marketPrice : [
						{ required: true, message: '请输入市场价格', trigger: 'blur' }
					],
					buildMin : [
						{ required: true, message: '请输入下单范围最小值', trigger: 'blur' }
					],
					buildMax : [
						{ required: true, message: '请输入下单范围最大值', trigger: 'blur' }
					],
					cusMax : [
						{ required: true, message: '请输入单客户限量', trigger: 'blur' }	
					],
					total : [
						{ required: true, message: '请输入总客户限量', trigger: 'blur' }	
					],
					dateTime : [
						{ required: true, message: '请选择团购日期', trigger: 'change' }
					]
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.box.getConfig().then(res=>{
					self.config.select.options = res.result.order_card_select;
				});
			},
			editConfig( id ){
				let self = this;
				this.$request.admin.board.editConfig( { id:id, type:2 } ).then(res=>{
					if( res.errorCode == '00000' ){
						self.formData.matNo        = res.result.MatNo;
						self.formData.title        = res.result.Title;
						self.formData.isRangePrice = res.result.IsRangePrice;
						if( res.result.IsRangePrice != '0' ){
							self.formData.rangePrice   = res.result.rangePrice;
						}else{
							self.formData.price = res.result.Price
						}
						self.formData.marketPrice  = res.result.MarketPrice;
						self.formData.buildMin     = res.result.BuildMin;
						self.formData.buildMax     = res.result.BuildMax;
						self.formData.cusMax       = res.result.CusMax;
						self.formData.total        = res.result.Total;
						self.formData.dateTime[0]  = res.result.BeginTime;
						self.formData.dateTime[1]  = res.result.EndTime;
						self.formData.flagName     = res.result.FlagName;
						self.formData.isFlag       = res.result.IsFlag;
						self.formData.firstTo      = res.result.FirstTo;
						self.formData.firstPrice   = res.result.FirstPrice;
						self.formData.lastFrom     = res.result.LastFrom;
						self.formData.lastPrice    = res.result.LastPrice;
					}
				}).then(()=>{
					this.config.isFinishLoad = true;
				});
			},
			plusClick( index ){
				console.log(typeof(this.formData.rangePrice))
				this.formData.rangePrice.splice( index + 1, 0, { From:'', To:'', Price:'' } );
			},
			minusClick( index ){
				this.formData.rangePrice.splice( index, 1 );
			},
			goBack(){
				this.$router.push('/admin/box/lists?curPage=' + this.listPageNum);
			},
			editSaveValidate(){
				this.$refs['editForm'].validate((valid)=>{
					if( valid ){
						this.editSave( this.formData );
					}else{
						return false;
					}
				});
			},
			editSave( data ){
				let self = this;
				this.$request.admin.box.editSave( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							duration: 1500,
							message: res.msg,
							type: 'success',
							onClose:function(){
								for(let key in self.formData){
									self.formData[key]  = '';
								}
								self.$router.push('/admin/box/lists?curPage=' + self.listPageNum);
							}
						});
					}else{
						self.$message({
							duration: 1500,
							message: '数据更新失败',
							type: 'warning'
						});
					}
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getConfig();
			if( this.$route.params.id == '' || typeof(this.$route.params.id) == 'undefined' || this.$route.params.pageNum == '' || typeof(this.$route.params.pageNum) == 'undefined' ){
				this.$alert('请先选择需要修改的记录', '提示', {
					confirmButtonText : '返回',
					callback: action => {
						this.$router.push('/admin/box/lists');
					}
				});
				return ;
			}
			this.formData.id = this.$route.params.id;
			this.listPageNum = this.$route.params.pageNum;
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