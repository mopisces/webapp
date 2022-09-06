<template>
	<div>
		<el-upload :action=" config.upload.action " :data="config.upload.data" :headers="config.upload.header" list-type="picture" v-show="false" id="quill-upload" :multiple="true" :limit="3" :show-file-list="false" :before-upload="beforeUpload" :on-error="uploadError" :on-success="handleExceed" name="image">
			<el-button size="small" type="primary" ></el-button>
			<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
		<div class="ql-container ql-snow" style="height:500px;width:100%;" v-loading=" config.upload.loading ">
			<quill-editor v-model="formData.descr" :options="editorOption" ref="myQuillEditor">
			</quill-editor>
		</div>
		<div style="position:fixed;bottom:3rem;">
        	<el-button type="primary" plain @click="saveDescr()">保存</el-button>
        	<el-button type="primary" plain @click="goBack()">返回</el-button>
        </div>
	</div>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor';
	import { getStorage } from '@/util/storage';
	export default {
		components:{
			quillEditor,
		},
		data(){
			return {
				config:{
					upload:{
						action : window.jpdn_domain_admin + 'addDescrImage',
						header:{
							Authentication : getStorage('jpdn-admin-token', 'sessionStorage')
						},
						data   : {
							goods_id : ''
						},
						loading: false
					}
				},
				formData : {
					descr     : '',
					id        : '',
					orderType : '',
					//列表页码
					pageNum : 1,
				},
				editorOption : {
					modules: {
						toolbar:{
							container:[
								['bold', 'italic', 'underline', 'strike'],
	              				['blockquote', 'code-block'],
								[{ 'header': 1 }, { 'header': 2 }],
								[{ 'list': 'ordered' }, { 'list': 'bullet' }],
								[{ 'script': 'sub' }, { 'script': 'super' }],
								[{ 'indent': '-1' }, { 'indent': '+1' }],
								[{ 'direction': 'rtl' }],
								[{ 'size': ['small', false, 'large', 'huge'] }],
								[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
								[{ 'color': [] }, { 'background': [] }],
								[{ 'font': [] }],
								[{ 'align': [] }],
								['link'],
								['image'],
								['clean'],
							],
							handlers:{
								'image' : ( value ) => {
									if( value ){
										document.querySelector('#quill-upload input').click();
									}else{
										this.quill.format( 'image', false );
									}
								} 
							}
              				
            			}
          			},
          			placeholder:'请输入描述信息~',
          			theme:'snow'
				}
			}
		},
		methods:{
			saveDescr(){
				let self = this;
				this.$request.admin.board.saveDescr( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							duration: 1500,
							message: '保存成功',
							type: 'success',
							onClose:function(){
								let url = '';
								if( self.formData.orderType == 2 ){
									url = '/admin/board/lists?curPage=';
								}else{
									url = '/admin/box/lists?curPage=';
								}
								self.$router.push(url + self.formData.pageNum);
							}
						});
					}else{
						self.$message({
							duration: 1500,
							message: '保存失败',
							type: 'warning'
						});
					}
				});
			},
			goBack(){
				let url = '';
				if( this.formData.orderType == 2 ){
					url = '/admin/board/lists?curPage=';
				}else{
					url = '/admin/box/lists?curPage=';
				}
				this.$router.push(url + this.formData.pageNum);
			},
			beforeUpload(){
				this.config.upload.loading = true;
			},
			uploadError(){
				this.config.upload.loading = false;
				this.$message.error('图片插入失败');
			},
			handleExceed( response, file, fileList ){
				let quill = this.$refs.myQuillEditor.quill;
				if ( response.errorCode === '00000' ) {
					let length = quill.getSelection().index;
					quill.insertEmbed(length, 'image', window.jpdn_domain_imgDomain + response.result);
					quill.setSelection(length + 1);
				}else{
					this.$message.error('图片插入失败');
				}
				this.fileList = fileList;
				this.config.upload.loading = false;
			}
		},
		created(){
			if( this.$route.params.id == '' || typeof(this.$route.params.id) == 'undefined' || this.$route.params.pageNum == '' || typeof(this.$route.params.pageNum) == 'undefined'  || this.$route.params.orderType == '' || typeof(this.$route.params.orderType) == 'undefined' ){
				this.$alert('请先选择需要修改的记录', '提示', {
					confirmButtonText : '返回',
					callback: action => {
						this.$router.go(-1);
					}
				});
				return ;
			}
			this.formData.descr     = this.$route.params.descr;
			this.formData.id        = this.$route.params.id;
			this.formData.orderType = this.$route.params.orderType;
			this.formData.pageNum   = this.$route.params.pageNum;
			this.config.upload.data.goods_id = this.$route.params.id;
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
<style scoped>
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
	@import 'https://cdn.quilljs.com/1.3.6/quill.bubble.css';
	@import 'https://cdn.quilljs.com/1.3.6/quill.core.css';
	.ql-container {
		width: 100%;
		height:100%;
		font-size: 1rem;
	}
	.quill-editor {
		border: 1px solid #ccc;
		border-bottom: none;
	}
</style>