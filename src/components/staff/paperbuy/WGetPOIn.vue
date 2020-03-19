<template>
	<div>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" :radioVal="radioVal"  v-if="config.prevNext.show"></prev-next>
		<div role="button" tabindex="0" class="van-cell van-cell--clickable" v-for="(item,index) in listData" :key="index" @click="listClick(item)" style="font-size:15px;">
			<div class="van-cell__title">
				<span>{{ item.InNo }}</span><br/>
				<span>{{ item.PONo }}</span>
			</div>
			<div class="van-cell__title">
				<span>{{ item.InQty }}&nbsp;件</span><br/>
				<span>{{ item.SumPaper }}</span>
			</div>
			<div class="van-cell__title">
				<span>{{ item.SumInWt }}&nbsp;kg</span><br/>
				<span>{{ item.ShortName }}</span>
			</div>
			<van-icon name="arrow" color="#ddd" size="24" style="margin-top:9px"/>
		</div>
		<van-popup v-model="config.popup.show" position="top" :style="{ height:'100%' }" v-if="config.popup.show">
			<div class="header" style="width:100%;position:fixed;height:46px;top:0px;text-align:center;">
				<div class="van-nav-bar van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						详细信息 
					</div>
				</div>
			</div>
			<div class="content" style="width:100%;margin-top:46px;">
				<van-field center input-align="right" label="收货日期" v-model="detailData.fieldData.RecDate"></van-field>
				<van-field center input-align="right" label="收货单号" v-model="detailData.fieldData.InNo"></van-field>
				<van-field center input-align="right" label="供应商" v-model="detailData.fieldData.ShortName"></van-field>
				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="detailData.tableData" row-hover-color="#eee" row-click-color="#edf7ff" even-bg-color="#fafafa" :height="config.table.height" >
				</v-table>
			</div>	
			<div class="footer" style="width:100%;position:fixed;height:46px;bottom:0px;">
				<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0;" @click="config.popup.show = false">关闭</van-button>
			</div>
		</van-popup>
	</div>
	
</template>
<script>
	import { Button, Icon, Popup, Field } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import { VTable, VPagination } from 'vue-easytable';

	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			PrevNext
		},
		data(){
			return {
				radioData:[],
				radioVal:'',
				listData:[],
				detailData:{
					fieldData:{},
					tableData:{}
				},
				config:{
					prevNext:{
						show:false
					},
					popup:{
						show:false
					},
					table : {
						height : 0,
						columns : [
							{field: 'PaperCode', title: '纸类', width: 40, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true}, 
							{field: 'PaperWidth', title: '门幅', width: 50, titleAlign: 'center', columnAlign: 'center',isResize:true}, 
							{field: 'PaperWt', title: '克重', width: 40, titleAlign: 'center', columnAlign: 'center',isResize:true}, 
							{field: 'InWt', title: '收货重量(kg)', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true}, 
							{field: 'dPrice', title: '单价', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true}, 
						]
					}
				},
				filterMain:{
					buyOrderDate:''
				}
			}
		},
		methods:{
			radioConfirm( value ){
				this.filterMain.buyOrderDate = value;
				this.paperInMain( this.filterMain );
			},
			getPaperInConfig(){
				let self = this;
				this.$request.staff.paperbuy.paperInConfig().then(res=>{
					self.radioVal  = res.result[0].RecDate;
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.RecDate; 
					});
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.prevNext.show = true;
					});
				});
			},
			paperInDetail( No ){
				let self = this;
				this.$request.staff.paperbuy.paperInDetail( No ).then(res=>{
					self.detailData.tableData = res.result[0];
				}).then(()=>{
					this.config.popup.show = true;
				});
			},
			paperInMain( data ){
				let self = this;
				this.$request.staff.paperbuy.paperInMain( data ).then(res=>{
					self.listData = res.result;
				});
			},
			listClick( data ){
				this.detailData.fieldData = data;
				this.paperInDetail( data.InNo );
			}
		},
		created(){
			this.getPaperInConfig();
		},
		mounted(){
			this.$store.commit('staff/setHeaderTitle','原纸收货');
			this.config.table.height = window.screen.height - 126;
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>