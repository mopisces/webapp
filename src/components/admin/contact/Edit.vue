<template>
	<div>
		<van-radio-group v-model="formData.iconName">
			<van-cell-group title="图标">
				<van-cell clickable @click="formData.iconName = item.value " v-for="(item,index) in config.iconList" :key="index" >
					<van-icon  slot="title" class-prefix="iconfont" :name="item.value" size="24"/>
					<van-radio slot="right-icon" :name="item.value" />
				</van-cell>
			</van-cell-group>
		</van-radio-group>
		<van-cell-group title="名称">
			<van-field v-model="formData.name" label="名称" required placeholder="请输入名称"/>
		</van-cell-group>
		<van-cell-group title="内容">
			<van-field v-model="formData.content" label="内容" required placeholder="请输入内容" type="textarea" rows="1" autosize />
		</van-cell-group>
		<div style="width:100%;height:3.125rem;"></div>
		<van-button type="primary" size="normal" round style="width:100%;position:fixed;bottom:3.125rem;" @click="contactEdit()">
			修改联系方式
		</van-button>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Field, RadioGroup, Radio, Dialog } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
		},
		data(){
			return {
				config:{
					iconList:[]
				},
				formData:{
					id       : '',
					iconName : '',
					name     : '',
					content  : '',
					prefix   : ''
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.contact.contactAddConfig().then((res)=>{
					res.result.forEach((item,index)=>{
						let arrIcon = item.split('-');
						self.formData.prefix = arrIcon[0];
						self.config.iconList.push({ value:arrIcon[1] });
					});
				});
			},
			contactEdit(){
				let self = this;
				this.$request.admin.contact.contactEditSave( this.formData ).then((res)=>{
					if( res.errorCode == '00000' ){
						Dialog.alert({
							message : '更新成功!'
						}).then(()=>{
							self.$router.push('/admin/contact/list');
							Dialog.close();
						});
					}else{
						Dialog.alert({
							message : '更新失败!'
						}).then(()=>{
							Dialog.close();
						});
					}
				});
			},
			editConfig( contactId ){
				let self = this;
				this.$request.admin.contact.contactEditConfig( contactId ).then((res)=>{
					self.formData.id      = res.result.Id;
					self.formData.name    = res.result.Name;
					self.formData.content = res.result.Content;
					let arrIcon = res.result.Icon.split('-');
					self.formData.prefix   = arrIcon[0];
					self.formData.iconName = arrIcon[1];
				}).then(()=>{
					this.getConfig();
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','编辑联系方式');
			if( typeof( this.$route.params.contactId ) != 'undefined' && this.$route.params.contactId != null ){
				this.editConfig( this.$route.params.contactId ); 
			}else{
				this.$router.go(-1);
			}
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