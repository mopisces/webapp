<template>
	<van-popup v-model="show" position="top" :style="{ height: '100%',width:'100%' }">
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
  			统计类型
		</div>
		<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center">
			<div class="van-col van-col--6" v-for="(item,index) in statisType" :key="index">
				<van-button plain type="primary" size="small" @click="statisTypeClick(item.value)">{{ item.text }}</van-button>
			</div>
		</div>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
  			统计方式
		</div>
		<div class="van-row van-row--flex van-row--justify-center" style="text-align:center">
			<div class="van-col van-col--10">
				<van-button plain type="primary" size="small" @click=" statisMethod = 'list'">列表</van-button>
			</div>
			<div class="van-col van-col--10">
				<van-button plain type="primary" size="small" @click=" statisMethod = 'chart' ">图表</van-button>
			</div>
		</div>
		<div v-if=" statisMethod == 'chart' ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
	  			图表类型
			</div>
			<div class="van-row van-row--flex van-row--justify-center" style="text-align:center;margin-top:5px;">
				<div class="van-col van-col--6"  v-for="(item,index) in userChartType.slice(0,3)" :key="index">
					<van-button plain type="primary" size="small" @click="test">{{ item.text }}</van-button>
				</div>
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center;margin-top:5px;">
				<div class="van-col van-col--6"  v-for="(item,index) in userChartType.slice(3)" :key="index">
					<van-button plain type="primary" size="small">{{ item.text }}</van-button>
				</div>
			</div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
	  			图表属性
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center;margin-top:5px;">
				<div class="van-col van-col--6" v-for="(item,index) in chartProperties.slice(0,3)" :key="index">
					<van-button plain type="primary" size="small">{{ item.text }}</van-button>
				</div>
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center;margin-top:5px;">
				<div class="van-col van-col--6"  v-for="(item,index) in chartProperties.slice(3,6)" :key="index">
					<van-button plain type="primary" size="small">{{ item.text }}</van-button>
				</div>
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center;margin-top:5px;">
				<div class="van-col van-col--6" v-for="(item,index) in chartProperties.slice(6,10)" :key="index">
					<van-button plain type="primary" size="small">{{ item.text }}</van-button>
				</div>
			</div>
		</div>
		
		<div style="padding: 0px 16px;margin-top:30px">
			<van-button type="primary" size="large" @click="closeClick">确定</van-button>
		</div>
	</van-popup>
</template>
<script>
	import { Popup, Button } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[Button.name]: Button,
		},
		props:['show','statisType','chartType','chartProperties'],
		data(){
			return {
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
			}
		},
		methods:{
			closeClick(){
				this.$emit('statusCloseClick');
			},
			statisTypeClick( index ){
				console.log(index)
			},
			test( event ){
				console.log(event)
			}
		},
		mounted(){
			this.insideChartType.forEach((item,index)=>{
				if( this.chartType.indexOf( item.text ) > -1 ){
					this.userChartType.push(item);
				}
			});
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>