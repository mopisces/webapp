<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="formData.configIndex" :options="config.dropDownOption" />
			</van-dropdown-menu>
		</van-sticky>
		<van-divider :style="{color: '#1989fa', borderColor: '#1989fa', padding: '0 16px'}">
			ID&nbsp;[&nbsp;{{ formData.id }}&nbsp;]
		</van-divider>
		<div style="width:100%;height:0.5rem;"></div>
		<div style="width:100%;height:3rem;text-align:center;padding:1rem;">
			<van-slider v-model="formData.sliderValue"  bar-height="5px" :max="10000"/>
		</div>
		<div style="width:100%;height:1rem;"></div>
		<van-cell value="Id对应值">
			<template slot="right-icon">
				<van-stepper v-model="value" integer disabled-input input-width="42" min="0" max="10000" @change="stepperChange" />
			</template>
		</van-cell>
		<div style="text-align:center;width:100%;">
			<van-button type="info" style="width:80%;" @click="modifyClick()">修改</van-button>
			<div style="width:100%;height:0.5rem;"></div>
			<van-button type="info" plain  style="width:80%;" @click="clearClick()">清空记录</van-button>
		</div>
		<div style="margin: 20px 0 80px;">
	        <div style="padding: 2px 20px;font-size: 14px;text-align: center;overflow: auto;white-space: nowrap;" v-for="(item,index) in recordList">
	            <span v-if=" !config.isnew ">
	            	id&nbsp;[&nbsp;
	            	<span style="color: #3598dc;">{{item.id}}</span>
	            	&nbsp;]
	            </span>
	            <span style="color: #3598dc;text-decoration: underline;cursor: pointer;" @click="recover(item)">
	            	{{item.before}}
	            </span>
	            <van-icon class-prefix="iconfont" name="youjiantouxiangyouqianwangmianxing" size="16" color="#3598dc"/>
	            &nbsp;<span style="color: #3598dc;">{{item.after}}</span>
	            [&nbsp;<span style="color: #3598dc;">{{item.time}}</span>&nbsp;]
	        </div>
	    </div>
	</div>
</template>
<script>
	import { Button, Cell, Icon, Slider, Stepper, Dialog, DropdownMenu, DropdownItem, Toast, Divider, Sticky } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[Slider.name]: Slider,
			[Stepper.name]: Stepper,
			[Dialog.name]: Dialog,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[Toast.name]: Toast,
			[Divider.name]: Divider,
			[Sticky.name]: Sticky,
		},
		data(){
			return {
				config : {
					dropDownOption : [],
					isnew : false
				},
				formData : {
					configIndex : 0,
					id : '',
					sliderValue : 0
				},
				value       : 0,
				recordList  : []
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.sg.select.getConfig().then(res=>{
					if( res.errorCode == '00000' ){
						res.result.forEach((item,index)=>{
							self.config.dropDownOption.push({text:item.DB_FLAG,value:index,isnew:item.isnew,updown:item.updown});
						});
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.isnew = this.config.dropDownOption[ this.formData.configIndex ].isnew;
					})
				});
			},
			stepperChange(value,detail){
				this.formData.sliderValue = Number(value);
				if( Number(value) > 10000 ){
					this.formData.sliderValue = 10000;
				}
			},
			modifyClick(){
				Dialog.confirm({
					message: '确认要修改吗?'
				}).then(()=>{
					self.changeVal();
				}).catch(()=>{
					Dialog.close();
				});
			},
			clearClick(){
				Dialog.confirm({
					message: '确认要清空记录吗?'
				}).then(()=>{
					self.clearRecord();
				}).catch(()=>{
					Dialog.close();
				});
			},
			recover( item ){
				if( !this.config.isnew ){
					this.formData.id = item.id;
				}
				this.formData.sliderValue = Number(item.before);
			},
			getValue(){
				let self = this;
				this.$request.sg.alter.getValue( this.formData ).then(res=>{
					console.log(res)
					if( res.errorCode != '00000' ){
						return ;
					}
					if( !self.config.dropDownOption[ self.formData.configIndex ].isnew ){
						self.formData.id
					}
					this.value = '';
				});
			},
			changeVal(){
				let self = this;
				this.$request.sg.alter.changeVal( this.formData ).then(res=>{
					console.log(res)
					if( res.errorCode == '00000' ){
						self.recordList.push(res.result);
					}
				});
			},
			getRecord(){
				let self = this;
				this.$request.sg.alter.getRecord( this.formData ).then(res=>{
					console.log(res)
					if( res.errorCode == '00000' ){
						res.result.forEach((item,index)=>{
							self.recordList.push(item);
						});
					}
				});
			},
			clearRecord(){
				let self = this;
				this.$request.sg.alter.clearRecord( this.formData ).then(res=>{
					console.log(res)
					if( res.errorCode == '00000' ){
						Toast.success('清除成功！');
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.getRecord();
					});
				});
			},
			init(){
				this.getConfig();
				this.getValue();
				this.getRecord();
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','修改');
			this.init();
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			sliderChange(){
				return this.formData.sliderValue;
			},
			configIndexChange(){
				return this.formData.configIndex;
			}
		},
		watch:{
			sliderChange( newV, oldV ){
				this.value = Number( newV );
			},
			configIndexChange( newV, oldV ){
				this.config.isnew = this.config.dropDownOption[ newV ].isnew;
			}
		}
	}
</script>