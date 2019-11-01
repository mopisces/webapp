<template>
	<div>
		<van-notice-bar color="#1989fa" background="#ecf9ff" mode="link" @click="noticeClick(0)">
			统计类型:{{ config.notice.statisTypeText }}&nbsp;&nbsp;&nbsp;&nbsp;
			统计方式:{{ config.notice.statisWayText }}&nbsp;&nbsp;&nbsp;&nbsp;
			图表类型:{{ config.notice.chartTypeText }}&nbsp;&nbsp;&nbsp;&nbsp;
			图表属性:{{ config.notice.chartPropertiesText }}&nbsp;&nbsp;&nbsp;&nbsp;
		</van-notice-bar>
		<van-popup v-model="popupShow" position="right" :style="{ height: '100%', width:'100%' }" :close-on-click-overlay="false">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
				<div class="van-nav-bar__title van-ellipsis">
					筛选条件
				</div>
			</div>
			<div style="margin-top:46px;"></div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
  			统计类型
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center">
				<div class="van-col van-col--6" v-for="(item,index) in statisType" :key="index">
					<van-button v-bind:color="item.value == config.select.statisType ? '#de1a1e' :'' " type="primary" size="small" @click="statisTypeClick(item)">{{ item.text }}</van-button>
				</div>
			</div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
	  			统计方式
			</div>
			<div class="van-row van-row--flex van-row--justify-center" style="text-align:center">
				<div class="van-col van-col--10" v-for="(item,index) in statisWay" :key="index">
					<van-button v-bind:color="item.value == config.select.statisWay ? '#de1a1e' :'' " type="primary" size="small" @click="wayClick(item)">{{ item.text }}</van-button>
				</div>
			</div>
			<div v-if=" statisMethod == 'chart' ">
				<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
		  			图表类型
				</div>
				<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;margin-top:5px;" v-for="(it,id) in Math.ceil(userChartType.length/3)" :key="id + 'chartType' ">
					<div class="van-col van-col--6"  v-for="(item,index) in userChartType.slice(id*3,id*3 + 3)" :key="index">
						<van-button v-bind:color="item.value == config.select.chartType ? '#de1a1e' :'' "  type="primary" size="small" @click="chartTypeClick(item)">{{ item.text }}</van-button>
					</div>
				</div>
				<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
		  			图表属性
				</div>
				<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center;margin-top:5px;" v-for="(it,id) in Math.ceil(chartProperties.length/3)" :key="id">
					<div class="van-col van-col--6" v-for="(item,index) in chartProperties.slice(id*3,id*3 + 3)" :key="index">
						<van-button  v-bind:color="item.value == config.select.chartProperties ? '#de1a1e' :'' " type="primary" size="small" @click="chartPropertiesClick(item)">{{ item.text }}</van-button>
					</div>
				</div>
			</div>
			<div style="padding: 0px 16px;margin-top:30px">
				<van-button type="primary" size="large" @click="closeClick()">确定</van-button>
			</div>
		</van-popup>
	</div>
	
</template>
<script>
	import { Popup, NoticeBar, Button } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup ,
			[NoticeBar.name]: NoticeBar ,
			[Button.name]: Button,
		},
		props:['show','statisType','chartType','chartProperties'],
		data(){
			return {
				popupShow:this.show,
				statisMethod:'list',
				insideChartType:[
					{ text: '3D饼状图', value: 'pie3d' },
					{ text: '饼状图', value: 'pie' },
					{ text: '3D环形图', value: 'pieDonut3d' },
					{ text: '柱状图', value: 'columnRotatedLabels' },
					{ text: '直线图', value: 'line' },
					{ text: '走势图', value: 'lineTimeSeries' },
				],
				userChartType:[],
				statisWay:[
					{ text: '列表', value: 0},
					{ text: '图表', value: 1},
				],
				config:{
					select:{
						statisType:'',
						statisWay:'',
						chartType:'',
						chartProperties:'',
					},
					notice:{
						text:'',
						statisTypeText:'',
						statisWayText:'',
						chartTypeText:'',
						chartPropertiesText:''
					}
				},
			}
		},
		methods:{
			closeClick( isClose = 1 ){
				if( isClose == 1 ){
					this.popupShow = false;
					this.$emit('',this.config.select);
				}else{
					this.popupShow = true;
				}
			},
			noticeClick( isClose ){
				this.closeClick( isClose );
			},
			statisTypeClick( item ){
				this.config.select.statisType = item.value;
			},
			wayClick( item ){
				this.config.select.statisWay = item.value;
				if( item.value == 0 ){
					this.statisMethod = 'list';
					this.config.select.chartType = '';
					this.config.select.chartProperties = '';
				}else{
					this.statisMethod = 'chart';
					this.config.select.chartType = this.userChartType[0].value;
					this.config.select.chartProperties = this.chartProperties[0].value;
				}
			},
			chartTypeClick( item ){
				this.config.select.chartType = item.value;
			},
			chartPropertiesClick( item ){
				this.config.select.chartProperties = item.value;
			},
			getChartType(){
				if( this.chartType[0] === 'all' ){
					this.userChartType = this.insideChartType;
				}else{
					this.chartType.forEach((item,index)=>{
						 for ( var i = 0; i < 6; i++){
						 	if( this.insideChartType[ i ].value === item ){
						 		this.userChartType.push( this.insideChartType[ i ] );
						 		break;
						 	}
						 }
					});
				}
			},
			getNoticeInit(){
				this.config.select.statisType = this.statisType[0].value;
				this.config.select.statisWay = this.statisWay[0].value;
				this.getChartType();	
			},
		},
		mounted(){
			this.getNoticeInit();
		},
		created(){
			
		},
		computed:{
			noticeStatisType(){
				return this.config.select.statisType;
			},
			noticeStatisWay(){
				return this.config.select.statisWay;
			},
			noticeChartType(){
				return this.config.select.chartType;
			},
			noticeChartProperties(){
				return this.config.select.chartProperties;
			}
		},
		watch:{
			show(newV,oldV){
				this.popupShow = newV;
			},
			popupShow(newV,oldV){
				this.$emit("update:show", newV);
			},
			noticeStatisType(newV,oldV){
				this.config.notice.statisTypeText = this.statisType[newV].text;
			},
			noticeStatisWay(newV,oldV){
				this.config.notice.statisWayText = this.statisWay[newV].text;
			},
			noticeChartType(newV,oldV){
				if( newV == '' ){
					this.config.notice.chartTypeText = '';
					return ;
				}
				for (var i = this.userChartType.length - 1; i >= 0; i--) {
					if(this.userChartType[i].value === newV ){
						this.config.notice.chartTypeText = this.userChartType[i].text;
						break;
					}
				}
			},
			noticeChartProperties(newV,oldV){
				if( newV == '' ){
					this.config.notice.chartPropertiesText = '';
					return ;
				}
				for (var i = this.chartProperties.length - 1; i >= 0; i--) {
					if(this.chartProperties[i].value === newV ){
						this.config.notice.chartPropertiesText = this.chartProperties[i].text;
						break;
					}
				}
			}
		}
	}
</script>
