<template>
	<div>
		<van-tabs v-model="config.tabs.active" sticky>
			<van-tab :title="item" v-for="item in config.tabs.title">
				<van-cell-group>
					<van-cell title="客户" is-link value="内容"  @click="cusPicker()"/>
					<van-cell title="材质" is-link value="内容"/>
					<van-cell title="加修边" is-link>
						<van-switch v-model="checked" slot="right-icon"/>
					</van-cell>
					<van-cell title="加面积" is-link>
						<van-switch v-model="checked" slot="right-icon"/>
					</van-cell>
					<van-cell title="毛片" is-link>
						<van-switch v-model="checked" slot="right-icon"/>
					</van-cell>
					<template v-if="config.tabs.active == 0 ">
						<van-cell title="规格(mm)" is-link>
							<div slot="right-icon">
								<input type="number" placeholder="板长" class="cell-input">
	                    		x
	                    		<input type="number" placeholder="板宽" class="cell-input">
							</div>
						</van-cell>
						<van-field v-model="value" placeholder="压线和=板宽(格式：x+x+x)" label="压线" />
					</template>
					<template v-if="config.tabs.active == 1 ">
						<van-cell title="箱型" is-link value="内容" />
						<van-cell title="规格" is-link >
							<div slot="right-icon">
								<input type="number" placeholder="箱长(mm)" class="cell-input" >
	                    		x
	                    		<input type="number" placeholder="箱宽(mm)" class="cell-input">
	                    		x
	                    		<input type="number" placeholder="箱高(mm)" class="cell-input">
							</div>
						</van-cell>
						<van-field v-model="value" placeholder="输入箱舌(mm)" label="箱舌" />
						<van-field v-model="value" placeholder="输入封箱调整(mm)" label="封箱调整" />
						<van-cell title="板长(mm)" value="内容" />
						<van-cell title="板宽(mm)" value="内容" />
						<van-cell title="压线" value="内容" />
					</template>
					<van-field v-model="value" placeholder="输入订单数" label="订单数"/>
					<van-cell title="销售面积(㎡)" value="内容" />
					<van-cell title="折扣" value="内容" />
					<van-cell title="平方报价(元/㎡)" value="内容" />
					<van-cell title="片价(元/片)" value="内容" />
					<van-cell title="平方价(元/㎡)" value="内容" />
					<van-cell title="金额(元)" value="内容" />
					<van-button type="primary" size="large" round >大号按钮</van-button>
				</van-cell-group>
			</van-tab>
		</van-tabs>
		<template>
			<van-popup v-model="show" position="bottom" :style="{ height: '50%' }" :overlay="false" >
				<van-picker show-toolbar :columns="columns" @cancel="show = false"  @confirm="onConfirm" @change="cusChange">
					<van-search slot="title" v-model="value" @search="onSearch"> </van-search>
				</van-picker>
			</van-popup>
		</template>
	</div>
</template>
<script>
	import { Tab, Tabs, Switch, CellGroup, Cell, Field, Button, Popup, Picker, Search   } from 'vant';
	export default {
		components:{
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Switch.name]: Switch,
			[Field.name]: Field,
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Search.name]: Search,
		},
		data(){
			return {
				columns: [],
				overlay:false,
				checked: false,
				show:false,
				value:'',
				config:{
					tabs:{
						active:0,
						title:['纸箱纸板','纸箱纸板']
					},
					picker:{
						loading:true,
						noData:true,
						cusShow:false
					}
				},
				info:{
					cusPicker:{
						data:{},
						keyWord:'',
						selectData:{}
					}
				},
				commonForm:{

				},
				boardForm:{

				},
				boxForm:{

				}
			}
		},
		methods:{
			cusPicker(){
				this.show = true;
				this.cusPickerSearch();
				console.log(this.info.cusPicker.data);
				console.log(Object.keys(this.info.cusPicker.data));
				this.columns =  Object.keys(this.info.cusPicker.data);
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.info.cusPicker.keyWord ).then(res=>{
					let data = {};
					res.result.forEach((item,index)=>{
						data[ item.CusName ] = [ item.CusId ];
					})
					self.columns = Object.keys(data);
				});
			},
			onConfirm(){
				console.log('confirm')
			},
			onSearch(  ){

			},
			cusChange(picker,values){
				picker.setColumnValues(1, citys[values[0]]);
				console.log(values);
			}
		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','试算');
		}	
	}
</script>
<style>
	.cell-input {
		width: 150px;
	    height: 50px;
	    text-align: center;
	    border:1px solid;
	}
	
</style>