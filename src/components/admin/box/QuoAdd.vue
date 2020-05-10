<template>
	<div>
		<el-form :model="formData" :rules="rules" ref="quoAdd" label-width="150px" label-position="left">
			<el-form-item label="材质编号" prop="BoardId">
				<el-select v-model="formData.boardId" placeholder="请选择" filterable>
					<el-option v-for="(item,index) in config.select.options" :key="index" :label="item.BoardId" :value="item.BoardId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="区间价" prop="isRangePrice">
				<el-checkbox v-model="formData.isRangePrice" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<template v-if="Number(formData.isRangePrice)">
					<el-input v-model="formData.buildMin" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;~&nbsp;
					<el-input v-model="formData.firstTo" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;=&nbsp;
					<el-input v-model="formData.firstPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡&nbsp;&nbsp;
					<el-button size="mini" circle icon="el-icon-plus" type="success" @click=" plusClick( -1 ) "></el-button>
					<div style="width:100%;height:10px;"></div>
					<template v-for="(item,index) in formData.rangePrice">
						<el-input v-model="item.From" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;~&nbsp;
						<el-input v-model="item.To" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;=&nbsp;
						<el-input v-model="item.Price" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡&nbsp;&nbsp;
						<el-button size="mini" circle icon="el-icon-plus" type="success" @click=" plusClick( index + 1 ) "></el-button>
						<el-button size="mini" circle icon="el-icon-minus" type="success" @click="minusClick(index)"></el-button>
						<div style="width:100%;height:10px;"></div>
					</template>
					<el-input v-model="formData.lastFrom" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;~&nbsp;
					<el-input v-model="formData.buildMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;㎡&nbsp;=&nbsp;
					<el-input v-model="formData.lastPrice" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡&nbsp;&nbsp;
				</template>
				<template v-else>
					<el-input v-model="formData.price" placeholder="请输入价格" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元/㎡
				</template>
			</el-form-item>
			<el-form-item label="市场价格" prop="marketPrice">
				<el-input v-model="formData.marketPrice" placeholder="市场价格" style="width: 100px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元/㎡
			</el-form-item>
			<el-form-item label="下单范围" required>
				<el-col :span="3">
					<el-form-item prop="buildMin">
						<el-input v-model="formData.buildMin" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
					</el-form-item>
				</el-col>
				<el-col :span="1">
					~
				</el-col>
				<el-col :span="3">
					<el-form-item prop="buildMax">
						<el-input v-model="formData.buildMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="单客户限量" prop="cusMax">
				<el-input v-model="formData.cusMax" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
			</el-form-item>
			<el-form-item label="总客户限量" prop="total">
				<el-input v-model="formData.total" placeholder="请输入内容" style="width: 100px;"></el-input>&nbsp;㎡&nbsp;
			</el-form-item>
			<el-form-item label="团购时间" prop="dateTime">
				<el-date-picker v-model="formData.dateTime" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="addSaveValidate()">添加</el-button>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config : {
					select : {
						options:[]
					},
				},
				formData:{
					boardId      : '',
					isRangePrice : '0',
					//区间价格开始
					rangePrice   : [],  
					firstTo      : '',   //
					firstPrice   : '',   //
					lastFrom     : '',   //
					lastPrice    : '',   //
					//区间价格结束
					price        : '',   //非区间价格
					marketPrice  : '',
					buildMin     : '',
					buildMax     : '',
					cusMax       : '',
					total        : '',
					dateTime     : [],
					isDefaultPic : '1',
					flagName     : '',
					isFlag       : '0',

				},
				rules : {
					boardId : [
						{ required: true, message: '请选择材质编号', trigger: 'change' }
					],
					price : [
						{ validator:(rule, value, callback)=>{
							let errors;
							if( this.formData.isRangePrice == '0' && value <= 0 ){
								errors = '请输入价格';
							}
							if( this.formData.isRangePrice == '1' && ( this.formData.firstTo <= 0 || this.formData.firstPrice <= 0 || this.formData.lastFrom <= 0 || this.formData.lastPrice <= 0 ) ){
								errors = '区间价信息不完整';
							}
							callback(errors);
						} }
					],
					marketPrice : [
						{ required: true, message: '请输入市场价格', trigger: 'blur' }
					],
					buildMin : [
						{ required: true, message: '请输入下单范围最小值', trigger: 'change' },
						{ validator:(rule, value, callback)=>{
							let errors;
							if( Number(value) < 0 ){
								errors = '请输入正确的下单范围最小值';
							}
							callback(errors);
						} }
					],
					buildMax : [
						{ required: true, message: '请输入下单范围最大值', trigger: 'change' },
						{ validator:(rule, value, callback)=>{
							let errors;
							if( Number(value) < 0 || Number(this.formData.buildMin) > Number(value) ){
								errors = '请输入正确的下单范围最大值';
							}
							callback(errors);
						} }
					],
					cusMax : [
						{ required: true, message: '请输入单客户限量', trigger: 'blur' },	
					],
					total : [
						{ required: true, message: '请输入总客户限量', trigger: 'blur' },	
					],
					dateTime : [
						{ required: true, message: '请选择团购日期', trigger: 'change' },	
					]
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.box.quoAddConfig().then(res=>{
					if( res.errorCode == '00000' ){
						self.config.select.options = res.result.board_id_select;
						self.formData.flagName     = res.result.flag_name;
					}
				});
			},
			plusClick( index ){
				this.formData.rangePrice.splice( index + 1, 0, { From:'', To:'', Price:'' } );
			},
			minusClick( index ){
				this.formData.rangePrice.splice( index, 1 );
			},
			addSaveValidate(){
				this.$refs['quoAdd'].validate((valid)=>{
					if( valid ){
						this.addSave( this.formData );
					}else{
						return false;
					}
				});
			},
			addSave( data ){
				let self = this;
				this.$request.admin.box.quoAdd( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							duration: 1500,
							message: res.msg,
							type: 'success',
							onClose:function(){
								for(let key in self.formData){
									self.formData[key]  = '';
								}
								self.$router.push('/admin/box/quoList');
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