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
		<van-button type="primary" size="normal" round style="width:100%;position:fixed;bottom:3.125rem;" @click="contactAdd()">
			添加联系方式
		</van-button>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Field, RadioGroup, Radio, Dialog, Toast } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[Toast.name]: Toast,
		},
		data(){
			return {
				config:{
					iconList:[]
				},
				formData:{
					iconName:'',
					name : '',
					content : '',
					prefix : ''
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
			contactAdd(){
				let self = this;
				this.$request.admin.contact.contactAdd( this.formData ).then((res)=>{
					let message = '';
					if( res.errorCode == '00000' ){
						message = '插入成功！';
						self.getConfig();
					}else{
						message = '插入失败';
					}
					Dialog.alert({
						message: message
					}).then(()=>{
						Dialog.close();
					});
				}).then(()=>{
					Object.keys( this.formData ).forEach((item,index)=>{
						this.formData[item] = '';
					});
					this.config.iconList = [];
					this.getConfig();
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','添加联系方式');
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