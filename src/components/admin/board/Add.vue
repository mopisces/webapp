<template>
	<div class="form-page">
		<el-form 
			ref="addForm" 
			:model="formData" 
			:rules="rules" 
			label-position="left" 
			size="small"
		>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<div class="box-card-header">
						<div style="line-height:2.25rem">
							<span>添加纸板</span>
						</div>
						<el-button type="primary" @click="addSaveValidate()">添加</el-button>
					</div>
				</div>
				<div class="form-container">
					<div class="form-container-item">
						<el-form-item 
							label="材质" 
							prop="boardId"
							label-width="54px"
						>
							<el-select v-model="formData.boardId" placeholder="请选择" filterable>
								<el-option 
									v-for="(item,index) in config.select.options" 
									:key="index" 
									:label="item.BoardId" 
									:value="item.BoardId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="标题" prop="title" label-width="54px">
							<el-input class="custom-input" v-model="formData.title" placeholder="请输入标题"></el-input>
						</el-form-item>
						<el-form-item  label="区间价" prop="isRangePrice">
							<el-checkbox 
								v-model="formData.isRangePrice" 
								label="是否开放" 
								border 
								true-label="1" 
								false-label="0"
							></el-checkbox>
						</el-form-item>
						<el-form-item label="价格" prop="price" label-width="60px">
							<template v-if="formData.isRangePrice == 1">
								<el-row :gutter="20">
									<el-col :span="6">
										<el-input v-model="formData.buildMin" placeholder="起售面积">
											<template slot="append">㎡</template>
										</el-input>
									</el-col>
									<el-col :span="6">
										<el-input v-model="formData.firstTo" placeholder="截止面积">
											<template slot="append">㎡</template>
										</el-input>
									</el-col>
									<el-col :span="6">
										<el-input v-model="formData.firstPrice" placeholder="单价">
											<template slot="append">元/㎡</template>
										</el-input>
									</el-col>
									<el-col :span="5">
										<el-button 
											size="mini" 
											circle 
											icon="el-icon-plus" 
											type="success" 
											@click=" plusClick( -1 ) "
										>
										</el-button>
									</el-col>
								</el-row>
								<template v-for="(item,index) in formData.rangePrice">
									<el-row :gutter="20" class="mg-top">
										<el-col :span="6">
											<el-input 
												v-model="item.From" 
												placeholder="起售面积" 
											>
												<template slot="append">㎡</template>
											</el-input>
										</el-col>
										<el-col :span="6">
											<el-input 
												v-model="item.To" 
												placeholder="截止面积" 
											>
												<template slot="append">㎡</template>
											</el-input>
										</el-col>
										<el-col :span="6">
											<el-input v-model="item.Price" placeholder="单价">
												<template slot="append">元/㎡</template>
											</el-input>
										</el-col>
										<el-col :span="5">
											<el-button 
												size="mini" 
												circle 
												icon="el-icon-plus" 
												type="success"
												@click=" plusClick( index + 1 ) "
											>
											</el-button>
											<el-button 
												size="mini" 
												circle 
												icon="el-icon-minus" 
												type="success" 
												@click="minusClick(index)"
											></el-button>
										</el-col>
									</el-row>
								</template>
								<el-row :gutter="20" class="mg-top">
									<el-col :span="6">
										<el-input v-model="formData.lastFrom" placeholder="起售面积">
											<template slot="append">㎡</template>
										</el-input>
									</el-col>
									<el-col :span="6">
										<el-input 
											v-model="formData.buildMax" 
											placeholder="截止面积" 
										>
											<template slot="append">㎡</template>
										</el-input>
									</el-col>
									<el-col :span="6">
										<el-input 
											v-model="formData.lastPrice" 
											placeholder="单价"
										>
											<template slot="append">元/㎡</template>
										</el-input>
									</el-col>
								</el-row>
							</template>
							<template v-else>
								<el-input class="custom-input" v-model="formData.price" placeholder="请输入价格">
									<template slot="append">元/㎡</template>
								</el-input>
							</template>
						</el-form-item>
						<el-form-item label="市场价格" prop="marketPrice" label-width="80px">
							<el-input 
								v-model="formData.marketPrice" 
								placeholder="市场价格" 
								class="custom-input"
							>
								<template slot="append">元/㎡</template>
							</el-input>
						</el-form-item>
						<el-form-item label="下单范围" required>
							<el-row :gutter="20">
								<el-col :span="8">
									<el-input 
										v-model="formData.buildMin" 
										placeholder="起售面积" 
									>
										<template slot="append">㎡</template>
									</el-input>
								</el-col>
								<el-col :span="8">
									<el-input 
										v-model="formData.buildMax" 
										placeholder="最大面积" 
									>
										<template slot="append">㎡</template>
									</el-input>
								</el-col>
							</el-row>
						</el-form-item>
						
						<!-- <el-form-item label="默认图片" prop="isDefaultPic">
							<el-checkbox v-model="formData.isDefaultPic" label="是否为默认图片" border true-label="1" false-label="0"></el-checkbox>
						</el-form-item> -->

					</div>
					<div class="form-container-item">
						<el-form-item label="单客户限量" prop="cusMax">
							<el-input v-model="formData.cusMax" placeholder="请输入内容" class="custom-input">
								<template slot="append">㎡</template>
							</el-input>
						</el-form-item>
						<el-form-item label="总客户限量" prop="total">
							<el-input v-model="formData.total" placeholder="请输入内容" class="custom-input">
								<template slot="append">㎡</template>
							</el-input>
						</el-form-item>
						<el-form-item label="团购时间" prop="dateTime">
							<el-date-picker v-model="formData.dateTime" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</el-form-item>
						<el-form-item :label="formData.flagName" prop="isFlag">
							<el-checkbox 
								v-model="formData.isFlag" 
								label="是否为指定标签" 
								border 
								true-label="1" 
								false-label="0"
							></el-checkbox>
						</el-form-item>
						<el-form-item label="默认图片" prop="isDefaultPic">
							<el-checkbox v-model="formData.isDefaultPic" label="是否为默认图片" border true-label="1" false-label="0"></el-checkbox>
						</el-form-item>
						<template v-if="formData.isDefaultPic == 0">
							<el-form-item label="商品图片" props="imgPic">
								<el-upload 
									:action="config.upload.action"
									:headers="config.upload.header"
									:data="config.upload.params"
									list-type="picture-card"
									:on-preview="handlePictureCardPreview"
									:on-remove="handleRemove"
									:limit="3"
									name="image" 
									:on-success="uploadSuccess"
									:file-list="config.upload.picList"
								>
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</template>
					</div>
				</div>
			</el-card>
			
			<!-- <el-form-item label="材质" prop="boardId">
				<el-select v-model="formData.boardId" placeholder="请选择" filterable>
					<el-option v-for="(item,index) in config.select.options" :key="index" :label="item.BoardId" :value="item.BoardId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="formData.title" placeholder="请输入标题" style="width: 300px;"></el-input>
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
					<el-input v-model="formData.price" placeholder="请输入价格" style="width: 100px;"></el-input>&nbsp;&nbsp;元/㎡
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
			<el-form-item label="默认图片" prop="isDefaultPic">
				<el-checkbox v-model="formData.isDefaultPic" label="是否为默认图片" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item>
			<el-form-item :label="formData.flagName" prop="isFlag">
				<el-checkbox v-model="formData.isFlag" label="是否为指定标签" border true-label="1" false-label="0"></el-checkbox>
			</el-form-item> -->
		</el-form>
		<el-dialog :visible.sync="config.dialog.visible">
			<img width="45rem" :src="config.dialog.imgUrl" alt="">
		</el-dialog>
		<!-- <el-button type="primary" @click="addSaveValidate()">添加</el-button> -->
	</div>
</template>
<script>
	import { getStorage } from '@/util/storage'
	export default {
		data(){
			return {
				config : {
					select : {
						options:[]
					},
					dialog: {
						visible: false,
						imgUrl: null
					},
					upload: {
						action: window.jpdn_domain_admin + 'img/addImg',
						header: {
							Authentication: getStorage('jpdn-admin-token',  'sessionStorage')
						},
						params: {
							addType: 1,
						},
						picList: []
					}
				},
				formData:{
					boardId      : '',
					title        : '',
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
					picList: [],

				},
				rules : {
					boardId : [
						{ required: true, message: '请选择材质', trigger: 'change' }
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
						{ validator:(rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) < 0 ){
								errors = '请输入正确的下单范围最小值';
							}
							callback(errors);
						} }
					],
					buildMax : [
						{ required: true, message: '请输入下单范围最大值', trigger: 'change' },
						{ validator:(rule, value, callback, source, options)=>{
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
					],
					imgPic: [
						{ validator:(rule, value, callback, source, options)=>{
							let errors;
							if( this.formData.isDefaultPic == 0 && !$value ){
								errors = '请上传商品图片';
							}
							callback(errors);
						} }
					]
				}
			}
		},
		methods:{
			getAddConfig(){
				let self = this;
				this.$request.admin.board.addConfig().then(res=>{
					self.formData.flagName = res.result;
				});
			},
			getBoardId(){
				let self = this;
				this.$request.admin.board.boardIdSelect().then(res=>{
					self.config.select.options = res.result;
				}).then(()=>{
					this.getAddConfig();
				});
			},
			plusClick( index ){
				this.formData.rangePrice.splice( index + 1, 0, { From:'', To:'', Price:'' } );
			},
			minusClick( index ){
				this.formData.rangePrice.splice( index, 1 );
			},
			addSaveValidate(){
				this.$refs['addForm'].validate((valid)=>{
					if( valid ){
						this.addSave( this.formData );
					}else{
						return false;
					}
				});
			},
			addSave( data ){
				let self = this;
				this.$request.admin.board.addSave( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							duration: 1500,
							message: res.msg,
							type: 'success',
							onClose:function(){
								for(let key in self.formData){
									self.formData[key]  = '';
								}
								self.$router.push('/admin/board/lists');
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
			},
			/*图片预览*/
			handlePictureCardPreview(file) {
				this.config.dialog.imgUrl = file.url
       			this.config.dialog.visible = true
			},
			/*删除*/
			handleRemove(file, fileList) {
				this.$request.admin.image.delImg(file.response.result, 2).then((res)=> {
					this.$message.success(res.msg)
				})
			},
			/*图片上传*/
			uploadSuccess(response, file, fileList) {
				if( response.errorCode == '00000' ) {
					this.formData.picList.push(response.result)
					this.$message.success(response.msg)
				}
			}
		},
		mounted(){
			this.getBoardId();
		},
	}
</script>

<style>
	.form-page {
		width: 100%;
		height: 100%;
		padding: 1rem;
		background-color: #f1f1f1;
	}

	.form-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start; 
	}

	.form-container-item {
		width: 50%;
		padding-left: 0.5rem;
		width: 80%;
	}

	.box-card-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.custom-input {
		width: 12.5rem !important;
	}
	
	.mg-top {
		margin-top: 0.5rem;
	}
</style>