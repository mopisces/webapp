<template>
	<div>
		<van-notice-bar color="#1989fa" background="#ecf9ff" :scrollable="false">
			{{ config.notice.value }}
		</van-notice-bar>
		<van-tabs v-model="formData.active">
			<van-tab title="公共规则" name="1"></van-tab>
			<van-tab title="特别规则" name="0"></van-tab>
			<van-tab title="报价价格" name="2">
				<van-search placeholder="请输入材质编号" v-model="formData.filterValue" @input="filterData()"/>
			</van-tab>
		</van-tabs>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
	</div>
</template>
<script>
	import { Search, Tab, Tabs, NoticeBar } from 'vant';
	import { getStorage, setStorage } from '@/util/storage';
	export default {
		components:{
			[Search.name]: Search,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[NoticeBar.name]: NoticeBar,
		},
		data(){
			return {
				config:{
					table:{
						height:0,
						columns:[]
					},
					notice:{
						value:''
					}
				},
				formData:{
					active:null,
					cusId:null,
					filterValue:''
				},
				tableData:[],
				original:[]
			}
		},
		methods:{
			filterData(){
				if( this.formData.filterValue != '' ){
					this.tableData = [];
					for (var i = 0; i < this.original.length; i++) {
						if( this.original[i].BoardId.indexOf(this.formData.filterValue) !== -1 ){
							this.tableData.push(this.original[i])
						}
					}
				}else{
					this.tableData = this.original
				}
			},
			setTableStyle(){
				this.$request.common.table.getTableConfig().then(res=>{
					if( this.formData.active != 2 ){
						this.config.table.height  = window.screen.height - 180
						this.config.table.columns = res.staffCustomerQuoRule
					}else{
						this.config.table.height  = window.screen.height - 241
						this.config.table.columns = res.staffCustomerQuoPrice
					}
				}).then(()=>{
					this.fetchData()
				})
			},
			fetchData(){
				this.tableData = []
				this.$request.staff.quo.getCustomerQuoDetail(this.formData).then(res=>{
					this.tableData = res.result
					this.original = res.result
				})
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','报价详细信息')
			if( getStorage('quo/CustomerQuo/info') !== null ){
				this.form = JSON.parse(getStorage('quo/CustomerQuo/info'))
				this.formData.cusId = this.form.CusId
				this.config.notice.value = this.form.CusShortName + '(' +this.form.CusId + ')'
			}else{
				this.$router.go(-1);
			}
			this.$store.commit('staff/setBackPath','/staff/quo/customerQuo');
		},
		mounted(){
			this.config.table.height = window.screen.height - 180;
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			tabsActiveChange(){
				return this.formData.active;
			}
		},
		watch:{
			async tabsActiveChange( newV, oldV ){
				await this.setTableStyle()
			}
		}
	}
</script>