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
				chartSize : '60%',
				baseOptions:{
					line : {
						chart: {
			                type: 'line',
			                //backgroundColor: '#FCFFC5',
			                //polar:true
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
								} 
							}
						},
						series:[{
							name : this.options.yTitle,
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
							//size : this.chartSize,
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
					},
					lineTimeSeries : {
						chart : {
							zoomType : 'x'
						},
						title : {
							text : this.options.xTitle
						},
						xAxis : {
							type : 'category'
						},
						tooltip: { 
							pointFormat: this.options.yTitle + ' : <b>{point.y:.0f}</b>'
						},
						yAxis : {
							min : 0,
							title : {
								text : this.options.yTitle
							}
						},
						legend : {
							enabled : false
						},
						plotOptions : {
							area : {
								fillColor : {
									linearGradient : {
										x1: 0,
										y1: 0,
										x2: 0,
										y2: 1
									},
									stops : [
										[0, Highcharts.getOptions().colors[0]],
                        				[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
									]
								},
								marker: {
                    				radius: 2
                				},
                				lineWidth: 1,
                				states: {
                    				hover: {
                        				lineWidth: 1
                    				}
                				},
                				threshold: null
							}
						},
						series : [{
							type : 'area',
							name : '',
							data : this.lineTimeSeriesData(this.options.data,this.options.categories)
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
						chartOptions = this.baseOptions.pieDonut3d;
						break;
					case 'lineTimeSeries' : 
						chartOptions = this.baseOptions.lineTimeSeries;
						break;
					default : 
						return ;
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
			},
			lineTimeSeriesData( data, categories ){
				let lineTimeSeriesData = [];
				data.forEach((item,index)=>{
					lineTimeSeriesData[ index ] = [categories[index], item ];
				});
				return lineTimeSeriesData;
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