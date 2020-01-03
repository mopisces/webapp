<template>
	<div>
		<van-cell-group title="公共参数">
			<van-field v-model="formData.FactoryId" required label="厂商Id" right-icon="question-o" placeholder="请输入厂商Id" @click-right-icon="$toast('2代不填写/3代填写')"/>
			<van-field v-model="formData.FactoryName" required label="厂商名称" placeholder="请输入厂商名称"/>
			<van-field v-model="formData.ErpPort" required label="ERP端口" right-icon="question-o" placeholder="请输入ERP端口" @click-right-icon="$toast('作用于：内部直接入库，内部库存修改，内部订单试算，内部扫描装货')" type="number"/>
			<van-switch-cell v-model="formData.Open80Port" title="是否开放了外部80端口" />
			<van-field v-model="formData.WxAppId" required label="微信AppId" right-icon="question-o" placeholder="请输入微信AppId" @click-right-icon="$toast('作用于:内部扫码,团购微信支付')"/>
			<template v-if=" !formData.Open80Port ">
				<van-field v-model="formData.Frp80PortDomain" required label="FRP80端口的域名" right-icon="question-o" placeholder="请输入FRP80端口的域名" @click-right-icon="$toast('作用于:内部扫码,团购微信支付')"/>
				<van-field v-model="formData.OriDomain" required label="原来的域名" right-icon="question-o" placeholder="请输入原来的域名" @click-right-icon="$toast('作用于:内部扫码,团购微信支付')"/>
				<van-field v-model="formData.OriPort" required label="原来的端口" right-icon="question-o" placeholder="请输入原来的端口" @click-right-icon="$toast('作用于:内部扫码,团购微信支付')"/>
			</template>
		</van-cell-group>
		<div style="width:100%;height:3.125rem;"></div>
		<div style="width:100%;position:fixed;bottom:3.125rem;">
			<van-button round type="primary" style="width:50%;" @click="saveConfig()">
				保存
			</van-button>
			<van-button round type="info" style="width:50%;" @click="getConfig()">
				重置
			</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, CellGroup, Field, SwitchCell, Dialog } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
		},
		data(){
			return {
				formData:{
					FactoryId       : '',
					FactoryName     : '',
					ErpPort         : '',
					Open80Port      : '',
					WxAppId         : '',
					Frp80PortDomain : '',
					OriDomain       : '',
					OriPort         : ''
				},
				checked : false
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					self.formData.FactoryId       = res.result.FactoryId;
					self.formData.FactoryName     = res.result.FactoryName;
					self.formData.ErpPort         = res.result.ErpPort;
					self.formData.Open80Port      = res.result.Open80Port == '1' ? true : false;
					self.formData.WxAppId         = res.result.WxAppId;
					self.formData.Frp80PortDomain = res.result.Frp80PortDomain;
					self.formData.OriDomain       = res.result.OriDomain;
					self.formData.OriPort         = res.result.OriPort;
				});
			},
			saveConfig(){
				let postData = Object.assign({},this.formData);
				postData.Open80Port = this.formData.Open80Port ? 1 : 0;
				this.$request.admin.config.saveConfig( JSON.stringify( postData ) ).then((res)=>{
					let message = ''
					if( res.errorCode == '00000' ){
						message = '修改成功!';
					}else{
						message = '修改失败!';
					}
					Dialog.alert({
						message : message
					}).then(()=>{
						Dialog.close();
					});
				});
			},
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','公共参数修改');
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