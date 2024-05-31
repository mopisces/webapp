<template>
	<div class="container">
		<div class="tui-bg-box">
			<img 
				src="http://lpkj.leaper.ltd:50001/upload/pages/login/bg_login.png" 
				class="tui-bg-img"
			/>
			<img 
				:src="pageInfo.factoryLogo" 
				class="tui-photo"
			/>
			<div class="tui-factory">
				{{ pageInfo.factoryName || '厂家名称' }}
			</div>
		</div>
		
		<div class="tui-login-from">
			<van-field 
				v-model="nameUpper" 
				label="用户名" 
				placeholder="请输入登录名" 
				required 
				input-align="center"
			/>
			<van-field 
				v-model="formData.userPass" 
				:type="config.field.type" 
				:right-icon="config.field.passIcon" 
				label="密码" 
				placeholder="请输入密码" 
				required 
				input-align="center" 
				@click-right-icon="eyeClick" 
			/>
			<van-field 
				v-if="config.field.show"
				v-model="formData.subFactory" 
				label="分厂" 
				required
				placeholder="请选择分厂" 
				clickable 
				readonly  
				@click="config.popup.show = true" 
			>
				<van-icon name="arrow" slot="right-icon"/>
			</van-field>
			<div class="tui-login-form-btn">
				<van-button 
					type="info"
					size="normal"
					block
					round
					color="#5677FC"
					@click="onLogin"
				>
					登录
				</van-button>
			</div>
		</div>

		<div class="tui-login-footer">
			<copy-right />
		</div>

		<van-popup 
			v-model="config.popup.show" 
			position="bottom" 
			:style="{ height: '50%' }"
		>
			<van-picker 
				title="请选择分厂"
				:columns="config.picker.columns" 
				:default-index="config.picker.defaultIndex" 
				show-toolbar
				@cancel="config.popup.show = false" 
				@confirm="confirm" 
			/>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Icon, Popup, Picker, Field, Toast } from 'vant'
	/*自定义版权组件*/
	import CopyRight from '@/components/subject/footer/CopyRight'
	/*数据校验库*/
	import schema from 'async-validator'
	/*api接口*/
	import { getSF } from '@/api/common/index.js'

	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
			[Toast.name]: Toast,

			CopyRight
		},
		data() {
			return {
				/*配置*/
				config: {
					/*输入框配置*/
					field: {
						show: true,
						passIcon: 'eye-o',
						type: 'text'
					},
					/*弹出层配置*/
					popup: {
						show: false
					},
					/*分厂弹出配置*/
					picker:{
						columns:[],
						defaultIndex:0
					},
					/*校验规则*/
					rules:{
						userName: [
							{ 
								type: 'string', 
								required: true, 
								message: '请输入用户名'
							},
							{ 
								regexp: '/^[a-zA-Z0-9]{2,12}$/', 
								message: '用户名格式错误'
							}
						],
						userPass: [
							{ 
								type: 'string', 
								required: true, 
								message: '请输入密码'
							},
							{ 
								regexp: '/^[a-zA-Z0-9]{2,12}$/', 
								message: '密码格式错误'
							},
						]
					}
				},
				/*条件*/
				formData: {
					userName: '',
					userPass: null,
					subFactory: null,
					userType: 1
				},
				/*页面信息*/
				pageInfo: {
					factoryId: null,
					factoryName: null,
					factoryLogo: null
				},
				validator: null
			}
		},
		mounted() {
			this.validator = new schema(this.config.rules)
			this.getConfig()
		},
		computed: {
			nameUpper: {
				get(){
					return this.formData.userName
				},
				set( val ){
					this.formData.userName = val.toUpperCase()
				}
			}
		},
		methods: {
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getSF()
				const { factory_info, sub_factory } = result
				this.pageInfo.factoryId = factory_info.FactoryId
				this.pageInfo.factoryName = factory_info.FactoryName
				this.pageInfo.factoryLogo = factory_info.FactoryLogo

				if( sub_factory.length > 0 ) {
					sub_factory.forEach((item,index)=> {
						this.config.picker.columns.push({ text:item.SShortName, key:item.SubFacId })
						if(this.formData.subFactoryId == item.SubFacId) {
							this.config.picker.defaultIndex = index
						}
					})
					this.config.field.show = true
				}
			},
			/*密码点击隐藏/显示*/
			eyeClick() {
				if( this.config.field.passIcon == 'eye-o'  ){
					this.config.field.passIcon = 'closed-eye'
					this.config.field.type = 'password'
				}else{
					this.config.field.passIcon = 'eye-o'
					this.config.field.type = 'text'
				}
			},
			/*登录按钮点击*/
			onLogin() {
				this.validator.validate(this.formData).then(()=>{
					this.login( this.formData )
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				})				
			},
			login( data ) {
				this.$store.dispatch('staff/login',{
					user_name: data.userName.toUpperCase(),
					user_pass: data.userPass,
					user_type: data.userType,
					sub_fac_id: data.subFactoryId
				}).then(()=> {
					this.$router.replace("/staff/index/menu")
				})
				
			},
			/*picker确认*/
			confirm( val, idx ) {
				this.formData.subFactory = val.text + '(' + val.key + ')'
				this.formData.subFactoryId = val.key
				this.config.picker.defaultIndex = idx
				this.config.popup.show = false
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}

	.login-header {
		width: 100%;
		height: 2.75rem;
		background-color: #5677FC;
		display: flex;
		align-items: center;
	}
	
	.tui-bg-box {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding-top: 2.75rem;
	}
	
	.tui-photo {
		height: 4.3125rem;
		width: 4.3125rem;
		display: block;
		margin: 0.625rem auto 0 auto;
		position: relative;
		z-index: 2;
	}

	.tui-factory {
		height: 2rem;
		line-height: 2rem;
		width: 10rem;
		display: block;
		margin: 0.625rem auto 0 auto;
		position: relative;
		z-index: 2;
		text-align: center;
	}
	
	.tui-bg-img {
		width: 100%;
		height: 10.8125rem;
		display: block;
		position: absolute;
		top: 0;
	}
	
	.tui-login-name {
		width: 8rem;
		height: 2.5rem;
		font-size: 1.875rem;
		color: #fff;
		margin: 2.25rem auto 0 auto;
		text-align: center;
		position: relative;
		z-index: 2;
		font-weight: 500;
		color: #000;
	}
	
	.tui-login-from {
		width: 100%;
		padding: 2.5rem 3.25rem 0 3.25rem;
		box-sizing: border-box;
	}
	

	.tui-login-form-btn {
		width: 100%;
		padding-top: 0.5rem;
	}

	.tui-login-footer {
		width: 100%;
		box-sizing: border-box;
	}
</style>