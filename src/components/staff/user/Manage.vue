<template>
	<div>
		<van-tabs v-model="config.tab.active" sticky :offset-top="46">
			<van-tab title="外部用户" name="0">
				<div style="margin-top:15px;text-align:center;font-size:0.875rem;" v-for="(item,index) in listData" :key="index">
					<van-panel>
						<van-row type="flex" justify="space-between" slot="header" >
							<van-col span="12">
								<span>{{ item.CusShortName }}( {{ item.CusId }} )</span>
							</van-col>
							<van-col span="12">
								<span>账号:{{ item.UserName }}</span>
							</van-col>
						</van-row>
						<van-row type="flex" justify="default" slot="footer">
							<van-col span="12" @click="qrcodeClick( item )">
								<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
								<span>登录二维码</span>
							</van-col>
							<van-col span="12" @click="authClick( item )">
								<van-icon class-prefix="iconfont" size="16" name="quanxianguanli2"/>
								<span>权限</span>
							</van-col>
						</van-row>
					</van-panel>
				</div>
			</van-tab>
			<van-tab title="内部用户" name="1">
				<div style="margin-top:15px;text-align:center;font-size:0.875rem;" v-for="(item,index) in listData" :key="index">
					<van-panel>
						<van-row type="flex" justify="space-between" slot="header" >
							<van-col span="12">
								<span>员工:{{ item.UserName_ }}( {{ item.UserId }} )</span>
							</van-col>
							<van-col span="12">
								<span>账号:{{ item.UserName }}</span>
							</van-col>
						</van-row>
						<van-row type="flex" justify="default" slot="footer">
							<van-col span="12" @click="qrcodeClick( item )">
								<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
								<span>登录二维码</span>
							</van-col>
							<van-col span="12" @click="authClick( item )">
								<van-icon class-prefix="iconfont" size="16" name="quanxianguanli2"/>
								<span>权限</span>
							</van-col>
						</van-row>
					</van-panel>
				</div>
			</van-tab>
		</van-tabs>
		<new-popup :leftShow.sync="config.popup.qrCode.show" :position="config.popup.qrCode.position" :isClose="true" :title="config.popup.qrCode.title">
			<div id="qrcode" slot="new-popup-qrcode" class="qrcode"></div>
		</new-popup>
		<new-popup :leftShow.sync="config.popup.auth.show" :position="config.popup.auth.position" isClose="3" :title="config.popup.auth.title">
			<van-checkbox-group v-model="config.checkboxes.result" slot="new-popup-1" v-if="config.popup.auth.show">
				<van-cell-group>
					<van-cell clickable v-for="(item, index) in authSelectAuth" :key="index" @click="toggle(index)" :title="item">
						<van-checkbox :name="item" ref="checkboxes" shape="square" slot="right-icon"/>
					</van-cell>
				</van-cell-group>
			</van-checkbox-group>
			<div slot="new-popup-2">
				<div class="van-row van-row--flex van-row--justify-space-between" style="text-align:center;">
					<div class="van-col van-col--12">
						<van-button type="primary" size="large" @click="saveClick()" style="width:60%;">保存</van-button>
					</div>
					<div class="van-col van-col--12">
						<van-button type="danger" size="large" @click="config.popup.auth.show = false" style="width:60%;">取消</van-button>
					</div>
				</div>
			</div>
		</new-popup>
	</div>
</template>
<script>
	import { Button, CellGroup, Cell, Icon, Row, Col, Checkbox, CheckboxGroup, Toast, Panel, Tab, Tabs } from 'vant';
	import QRCode from 'qrcodejs2';
	import NewPopup from '@/components/subject/NewPopup.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Row.name]: Row,
			[Col.name]: Col,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Toast.name]: Toast,
			[Panel.name]: Panel,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			NewPopup
		},
		data(){
			return {
				config:{
					tab:{
						active:'0'
					},
					popup:{
						qrCode:{
							show:false,
							position:'right',
							title:''
						},
						auth:{
							show:false,
							position:'left',
							title:''
						}
					},
					checkboxes:{
						result:[]
					}
				},
				listData:[],
				authSelectAuth:[],
				authChangeForm:{
					userName:'',
					userPass:'',
					userType:''
				}
			}
		},
		methods:{
			getWebUserClient(){
				let self = this;
				this.$request.staff.user.getWebUserClient().then(res=>{
					self.listData = res.result;
				});
			},
			getWebUserStaff(){
				let self = this;
				this.$request.staff.user.getWebUserStaff().then(res=>{
					self.listData = res.result;
				});
			},
			getCommonQrCode( data ){
				let self = this;
				this.$request.staff.user.getCommonQrCode( data ).then(res=>{
					self.config.popup.qrCode.show = true;
					this.$nextTick(()=>{
						document.getElementById('qrcode').innerHTML = '';
						let url = res.result;//登录地址
						this.creatQrCode(url);
					});
				});
			},
			getAuthName( data ){
				let self = this;
				this.$request.staff.user.getAuthName( data ).then(res=>{
					self.authSelectAuth = res.result.select;
					self.config.checkboxes.result = res.result.available;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.auth.show = true;
					});
				});
			},
			saveAuthName( data ){
				let self = this;
				this.$request.staff.user.saveAuthName( data ).then(res=>{
					if( res.errorCode != '00000' ){
						Toast.fail(res.msg);
					}else{
						Toast.success(res.msg);
						self.config.popup.auth.show = false;
					}
				});
			},
			qrcodeClick( item ){
				this.config.popup.qrCode.title = '账号:' + item.UserName + '登录二维码';
				this.getCommonQrCode( item );
			},
			creatQrCode( url ){
				let qrcode = new QRCode('qrcode',{
					text         : url,
			     	colorDark    : '#000000',
			      	colorLight   : '#ffffff',
			      	correctLevel : QRCode.CorrectLevel.H
				});
			},
			authClick( item ){
				this.config.popup.auth.title = '账号  ' + item.UserName + '  权限';
				this.getAuthName( item );
				this.authChangeForm.userName = item.UserName;
				this.authChangeForm.userPass = item.PassWord;
				this.authChangeForm.userType = item.UserType;
			},
			saveClick(){
				let postData = Object.assign({},this.authChangeForm,{ authName: this.config.checkboxes.result.join(',') });
				this.saveAuthName(postData);
			},
			toggle( index ){
				this.$refs.checkboxes[index].toggle();
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','用户管理');
		},
		mounted(){
			if( this.config.tab.active == '0' ){
				this.getWebUserClient();
			}else{
				this.getWebUserStaff();
			}
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			tabActiveChange(){
				return this.config.tab.active;
			}
		},
		watch:{
			tabActiveChange(newV,oldV){
				if( newV == '0' ){
					this.getWebUserClient();
				}else{
					this.getWebUserStaff();
				}
			}
		}
	}
</script>
<style>
	.qrcode img{
		margin:50% auto;
		width:60%;
	}
</style>