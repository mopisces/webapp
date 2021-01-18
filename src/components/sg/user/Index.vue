<template>
	<div>
		<el-button type="primary"  @click="handleAdd()">添加</el-button>
		<el-table :data="list" :stripe="true" :height="config.table.height" v-if="config.table.height">
			<el-table-column prop="user" label="用户名" width="100" fixed></el-table-column>
			<el-table-column prop="pass" label="密码" width="100"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
					<el-button type="danger" size="mini" @click="handleStatus(scope)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<van-dialog v-model="show" :title="title" show-cancel-button close-on-popstate :before-close="checkData">
			<van-field v-model="form.user" error required label="用户名" :disabled="form.edit == 1 ? true : false" />
			<van-field v-model="form.pass" error required label="密码" placeholder="请输入密码" />
		</van-dialog>
	</div>
</template>
<script>
	import { Field, Dialog, Toast } from 'vant';
	import schema from 'async-validator';
	export default {
		components:{
			[Field.name]: Field,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,
		},
		data(){
			return {
				config:{
					table:{
						height:0,
					}
				},
				list:[],
				show:false,
				title:'添加用户',
				checked:false,
				form:{
					id:'',
					user:'',
					pass:'',
					edit:0
				},
				rules:{
					user:[{required:true,message:'请输入用户名'}],
					pass:[{required:true,message:'请输入密码'}],
				},
				validator:{},
			}
		},
		methods:{
			fetchData(){
				this.$request.sg.user.getList().then(res=>{
					this.list = res.result;
				});
			},
			handleEdit(row){
				this.title = '修改用户信息';
				this.show = true;
				this.form = row;
				this.form.edit = 1;
			},
			handleAdd(){
				this.title = '添加用户';
				this.form = this.$options.data().form;
				this.show = true;
			},
			checkData(action, done){
				if( action == 'cancel' ){
					this.form = this.$options.data().form;
					return done();
				}
				if( action == 'confirm' ){
					this.validator.validate(this.form).then(()=>{
						this.$request.sg.user.doEdit(this.form).then(res=>{
							if( res.errorCode != '00000' ){
								return done(false);
							}else{
								Toast.success(res.msg);
								this.form = this.$options.data().form;
								this.fetchData();
								return done();
							}
						});
					}).catch(({ errors, fields })=>{
						Toast.fail(errors[0].message);
					});
				}
				
			},
			handleStatus(scope){
				let postData = {
					id:scope.row.id,
					status:0
				}
				this.$request.sg.user.doStatus(postData).then(res=>{
					if( res.errorCode == '00000' ){
						Toast.success(res.msg);
						this.list.splice(scope.$index,1)
					}
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','用户管理');
			this.$store.commit('sg/setTabbar','menu');
			this.fetchData();
		},
		mounted(){
			this.config.table.height = window.screen.height - 150;
			this.validator = new schema(this.rules);
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