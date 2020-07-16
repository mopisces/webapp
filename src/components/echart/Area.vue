<template>
	<div>
		<div id="main" style="width:800px;height:600px;"></div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				value:''
			}
		},
		methods:{
			init(){
				this.$request.amap.getLocation.getAreaData().then(res=>{
					
					let data = [
						{ name:'xAxis', children:[
							{ name:'xAxis.axisLabel', children:[
								{ name: "xAxis.axisLabel.show", value: 444 },
								{ name: "xAxis.axisLabel.rotate", value: 584 },
								{ name: "xAxis.axisLabel.inside", value: 416 },
								{ name: "xAxis.axisLabel.formatter", value: 886 },
								{ name: "xAxis.axisLabel.show", value: 444 },
								[
									{ name:'xAxis.axisLabel.textStyle.color', value:142 },
									{ name:'xAxis.axisLabel.textStyle.fontStyle', value:107 },
									{ name:'xAxis.axisLabel.textStyle.fontWeight', value:73 },
									{ name:'xAxis.axisLabel.textStyle.fontFamily', value:68 },
									{ name:'xAxis.axisLabel.textStyle.fontSize', value:128 },
									{ name:'xAxis.axisLabel.textStyle', value:490 },
								]
							] }
						] }
					];
					console.log(data)
					console.log(res.result);
					this.chartInit(res.result);
				});
			},
			chartInit(data){
				let mychart = echarts.init(document.getElementById('main'));
				mychart.hideLoading();
				let formatUtil = echarts.format;
				let option = {
					title:{
						text:'库区面积统计',
						left:'center'
					},
					tooltip:{
						/*formatter:function(info){
							var value = info.value;
							var treePathInfo = info.treePathInfo;
                			var treePath = [];
                			for( var i = 1; i < treePathInfo.length; i++ ){
                				treePath.push(treePathInfo[i].name);
                			}
                			return [
                    			'<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                    			'库区' + info.data.name + '面积: ' + formatUtil.addCommas(value) + ' 平方米',
                			].join('');
						}*/
					},
					series:[
						{
							name:'全部库区',
							type:'treemap',
							visibleMin:300,
							lable:{
								show:true,
								formatter:'{b}'
							},
							upperLabel:{
								show:true,
								height:30
							},
							itemStyle:{
								borderColor:'#fff'
							},
							levels:this.getLevelOption(),
							data:data,
							leafDepth:2,
						}
					]
				};
				mychart.setOption(option);
			},
			getLevelOption(){
				/*return [
					{
						itemStyle:{
							borderColor:'#777',
							borderWidth:0,
							gapWidth:1
						},
						upperLabel:{
							show:false
						}
					},
					{
						itemStyle:{
							borderColor:'#555',
							borderWidth:1,
							gapWidth:1
						},
						emphasis:{
							itemStyle:{
								borderColor:'#ddd'
							}
						}
					},
					{
						colorSaturation:[0.35, 0.5],
						itemStyle:{
							borderWidth:1,
							gapWidth:1,
							borderColorSaturation:0.6
						}
					}
				];*/
				return [
					{
						itemStyle:{
							borderColor:'#555',
							borderWidth:4,
							gapWidth:4
						}
					},
					{
						colorSaturation:[0.3, 0.6],
						itemStyle:{
							borderColorSaturation: 0.7,
							gapWidth: 2,
							borderWidth: 2,
							shadowOffsetY:0
						}
					},
					{
						colorSaturation: [0.3, 0.5],
						itemStyle:{
							borderColorSaturation: 0.6,
							gapWidth: 1
						}
					},
					{
						colorSaturation: [0.3, 0.5]
					}
				];
			},
		},
		created(){
			
		},
		mounted(){
			this.init();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>