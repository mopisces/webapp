<template>
	<div class="highcharts-container" id="highcharts-container"></div>
</template>
<script>
	import Highcharts from 'highcharts/highstock';
	export default {
		props:['options'/*,'type','styles'*/],
		data(){
			return {
				chart : null,
				baseOptions:{
					line : {
						chart: {
			                type: 'line'
			            },
			            title: {
			                text: this.options.xTitle             // 标题
			            },
			            xAxis: {
			                categories: this.options.categories   // x 轴分类
			            },
			            yAxis: {
			                title: {
			                    text: this.options.yTitle         // y 轴标题
			                }
			            },
			            series: [{                                // 数据列
			                name: this.options.yTitle,            // 数据列名
			                data: this.options.data               // 数据
			            }],
					},
					column :{
						chart:{
							type : 'column'
						},
						title:{
							text : this.options.xTitle
						},
						subtitle:{
							text : ''
						},
						xAxis:{
							categories : this.options.categories,
							crosshair  : true, 
						},
						yAxis:{
							min : 0,
							title : {
								text : ''
							}
						},
						tooltip : {
							headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
							pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
							footerFormat: '</table>',
							shared: true,
							useHTML: true
						},
						plotOptions: {
					        column: {
					            borderWidth: 0
					        }
					    },
					    series : [{
					    	name : this.options.yTitle,
					    	data : this.options.data
					    }]
					},
					pie : {
						chart:{
							type: 'pie'
						},
						title : {
							text : this.options.xTitle
						},
						tooltip: {
							pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
						plotOptions : {
							pie : {
								allowPointSelect: true,
								cursor: 'pointer',
								dataLabels: { 
									enabled: true,
									format: '<b>{point.name}</b>: {point.percentage:.1f} %',
									style: {
										color : 'black'
									} 
								} 
							}
						},
						series:[{
							name: 'Brands',
							colorByPoint: true,
							data : this.changePieData(this.options.data,this.options.categories)
						}]
					},
					pie3d : {
						chart : {
							type: 'pie',
							options3d: { 
								enabled: true,
								alpha: 45,
								beta: 0
							}
						},
						title : {
							text : this.options.xTitle
						},
						tooltip: {
							pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
						plotOptions : {
							pie : {
								allowPointSelect: true,
								cursor: 'pointer',
								depth: 35,
								dataLabels: {
									enabled: true,
									format: '{point.name}'
								}
							}
						},
						series: [{
							type : 'pie',
							name : this.options.yTitle,
							data : this.changePie3dData(this.options.data,this.options.categories)
						}]
					},
					pieDonut3d : {
						chart : {
							type: 'pie',
							options3d: {
								enabled: true,
								alpha: 45
							}
						},
						title:{
							text : this.options.xTitle
						},
						plotOptions :{
							pie : {
								innerSize : 100,
								depth : 45
							}
						},
						series:[{
							name : this.options.yTitle,
							data : this.changePie3dData(this.options.data,this.options.categories)
						}]
					}
				}
			}
		},
		methods:{
			initChart(){
				let chartOptions = {};
				switch( this.options.chartType ){
					case 'line':
						chartOptions = this.baseOptions.line;
						break;
					case 'columnRotatedLabels' :
						chartOptions = this.baseOptions.column;
						break;
					case 'pie' :
						chartOptions = this.baseOptions.pie;
						break;
					case 'pie3d' :
						chartOptions = this.baseOptions.pie3d;
						break;
					case 'pieDonut3d' : 
						chartOptions = this.baseOptions.pieDonut3d
				}
				this.chart = new Highcharts.chart('highcharts-container',chartOptions);
			},
			changePieData( data, categories ){
				let pieData = [];
				data.forEach((item,index)=>{
					pieData[ index ] = { name: categories[index], y : item };
				});
				return pieData;
			},
			changePie3dData( data, categories ){
				let pie3dData = [];
				data.forEach((item,index)=>{
					pie3dData[ index ] = [categories[index], item ];
				});
				return pie3dData;
			}
		},
		created(){
			
		},
		mounted(){
			this.initChart();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			chartTypeChange(){
				return this.options.chartType;
			}
		},
		watch:{
			chartTypeChange( newV, oldV ){
				if( newV != '' && oldV !== newV ){
					this.initChart();
				}
			}
		}
	}
</script>
<style>
	.highcharts-container {
		height: 1000px;
	}
</style>