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
					},
					sgStatistic:{
						chart:{
							type : 'column',
							panning: true,
							pinchType: 'x',
							zoomType:'x',
							resetZoomButton: {
								position: {
									y: -1000
								}
							}
						},
						title: {
				            text:this.getSgStatisYAxisTitle( this.options.chartProperties )
				        },
				        xAxis: {
				            categories: this.options.categories,
				        },
				        yAxis:{
							min : 0,
							title : {
								text : null
							},
							stackLabels: {
								enabled: false,
								overflow:'none',
								verticalAlign:'middle',
								textAlign:'center',
								rotation:270,
								//x:5,
								color:'#39ed0c'
							},
						},
				        tooltip: {
							followTouchMove: false,
							formatter: function () {
					            var str = '';
					            this.points.map(function(item,idx){
					            	if( idx == 0 ){
					            		str += '<b>' + item.x + '</b><br/>';
					            		str += '<b>合计:</b>' + item.total + '<br/>';
					            	}
					            	str += '<b>' + item.series.name + ':' + item.y + '</b><br/>';
					            });
					            return str
					        },
					        shared: true
						},
				        plotOptions: {
				        	column: {
				        		stacking: 'normal',
				        		dataLabels: {
				        			enabled: false,
				        			
				        		}
				        	},
				        },
				        series:this.options.series
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
					case 'sgStatistic':
						chartOptions = this.baseOptions.sgStatistic;
						break;
					default : 
						return ;
				}
				if( this.options.chartType == 'sgStatistic' ){
					this.chart = new Highcharts.chart('highcharts-container',chartOptions,function(c){
						c.xAxis[0].setExtremes(0, 5);
					});
					return true;
				}
				this.chart = new Highcharts.chart('highcharts-container',chartOptions);
			},
			changePieData( data, categories ){
				if( data == undefined ){
					return false
				}
				let pieData = [];
				data.forEach((item,index)=>{
					pieData[ index ] = { name: categories[index], y : item };
				});
				return pieData;
			},
			changePie3dData( data, categories ){
				if( data == undefined ){
					return false
				}
				let pie3dData = [];
				data.forEach((item,index)=>{
					pie3dData[ index ] = [categories[index], item ];
				});
				return pie3dData;
			},
			lineTimeSeriesData( data, categories ){
				if( data == undefined ){
					return false
				}
				let lineTimeSeriesData = [];
				data.forEach((item,index)=>{
					lineTimeSeriesData[ index ] = [categories[index], item ];
				});
				return lineTimeSeriesData;
			},
			getSgStatisYAxisTitle( cate ){
				if( this.options.chartType != 'sgStatistic' ){
					return ;
				}
				switch( cate ){
					case 'sumArea':
				        return '单位:平方米';
				    	break;
				   	case 'sumLen':
				       return '单位:米';
				    	break;
				    case 'avgSpeed':
				        return '平均车速';
				    	break;
				    case 'sumLoss':
				        return '单位:平方米';
				    	break;
				    case 'sumStops':
				        return '单位:次';
				    	break;
				    default:
				    	return '单位:平方米';
				}
			},
			getSgStatisSeries( cate ){
				if( this.options.chartType != 'sgStatistic' ){
					return ;
				}
				switch( cate ){
					case 'sumArea':
				        return '总面积';
				    	break;
				   	case 'sumLen':
				       return '总长度';
				    	break;
				    case 'avgSpeed':
				        return '平均车速';
				    	break;
				    case 'sumLoss':
				        return '损耗面积';
				    	break;
				    case 'sumStops':
				        return '停次';
				    	break;
				    default:
				    	return '总面积';
				}
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