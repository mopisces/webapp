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
							<van-col span="12">
								<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
								<span>登录二维码</span>
							</van-col>
							<van-col span="12">
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
							<van-col span="12">
								<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
								<span>登录二维码</span>
							</van-col>
							<van-col span="12">
								<van-icon class-prefix="iconfont" size="16" name="quanxianguanli2"/>
								<span>权限</span>
							</van-col>
						</van-row>
					</van-panel>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>
<script>
	import { Icon, Row, Col, Panel, Tab, Tabs } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Row.name]: Row,
			[Col.name]: Col,
			[Panel.name]: Panel,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data(){
			return {
				config:{
					tab:{
						active:'0'
					}
				},
				listData:[]
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
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','');
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
				console.log(newV == '0')
				if( newV == '0' ){
					this.getWebUserClient();
				}else{
					this.getWebUserStaff();
				}
			}
		}
	}
</script>
