<template>
	<div>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" :radioVal="radioVal"  v-if="config.prevNext.show"></prev-next>
		<div role="button" tabindex="0" class="van-cell van-cell--clickable" v-for="(item,index) in listData" :key="index" @click="listClick(item)">
			<div class="van-cell__title">
				<span>{{ item.PONo }}</span><br/>
				<span>{{ item.InNo }}</span>
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
				<van-field center  input-align="center" label="收货日期" v-model="detailData.fieldData.RecDate"></van-field>
				<van-field center  input-align="center" label="收货单号" v-model="detailData.fieldData.InNo"></van-field>
				<van-field center  input-align="center" label="供应商" v-model="detailData.fieldData.ShortName"></van-field>
				<div class="van-row" style="text-align:center; height:48px;">
					<div class="van-col van-col--4">纸类</div>
					<div class="van-col van-col--5">门幅</div>
					<div class="van-col van-col--5">克重</div>
					<div class="van-col van-col--5">收货重量(kg)</div>
					<div class="van-col van-col--5">单价</div>
				</div>
				<div class="van-row" style="text-align:center; height:48px;" v-for="(item,index) in detailData.tableData " :key="index">
					<div class="van-col van-col--4">{{ item.PaperCode }}</div>
					<div class="van-col van-col--5">{{ item.PaperWidth }}</div>
					<div class="van-col van-col--5">{{ item.PaperWt }}</div>
					<div class="van-col van-col--5">{{ item.InWt }}</div>
					<div class="van-col van-col--5">{{ item.dPrice }}</div>
				</div>
				<div style="margin-bottom:46px;"></div>
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
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,

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
					self.radioVal = res.result[0].RecDate;
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
		mounted(){
			this.$store.commit('staff/setHeaderTitle','原纸收货');
		},
		created(){
			this.getPaperInConfig();
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>