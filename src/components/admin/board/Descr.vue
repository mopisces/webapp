<template>
	<div>
		<quill-css></quill-css>
		<div class="ql-container ql-snow" style="height:500px;">
			<quill-editor v-model="formData.descr" :options="editorOption">
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
	import QuillCss from '@/components/subject/admin/QuillCss';
	export default {
		components:{
			quillEditor,
			QuillCss
		},
		data(){
			return {
				formData : {
					descr     : '',
					id        : '',
					orderType : ''
				},
				editorOption : {
					modules: {
						toolbar: [
              				['bold', 'italic', 'underline', 'strike'],
              				['blockquote', 'code-block'],
							[{ 'header': 1 }, { 'header': 2 }],
							[{ 'list': 'ordered' }, { 'list': 'bullet' }],
							[{ 'script': 'sub' }, { 'script': 'super' }],
							[{ 'indent': '-1' }, { 'indent': '+1' }],
							[{ 'direction': 'rtl' }],
							[{ 'size': ['small', false, 'large', 'huge'] }],
							['clean'],
            			],
            			syntax: {
              				highlight: text => hljs.highlightAuto(text).value
            			},
          			},
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
							message: '保存成功',
							type: 'success'
						});
					}else{
						self.$message({
							message: '保存失败',
							type: 'warning'
						});
					}
				});
			},
			goBack(){
				this.$router.go(-1);
			}
		},
		created(){
			if( this.$route.params.id == '' || typeof(this.$route.params.id) == 'undefined' ){
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
			this.formData.orderType = this.$route.params.orderType
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
<style>
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
