<template>
	<div>
		<div id="main" style="width:800px;height:600px;"></div>
	</div>
</template>
<script>
	export default {
		components:{
			
		},
		data(){
			return {
				value:''
			}
		},
		methods:{
			init(){
				this.$request.amap.getLocation.getAreaData().then(res=>{
					this.chartInit(res);
				});
			},
			chartInit(data){
				let mychart = echarts.init(document.getElementById('main'));
				mychart.hideLoading();
				let formatUtil = echarts.format;
				let option = {
					title:{
						text:'标题',
						left:'center'
					},
					tooltip:{
						formatter:function(info){
							var value = info.value;
							var treePathInfo = info.treePathInfo;
                			var treePath = [];
                			for( var i = 1; i < treePathInfo.length; i++ ){
                				treePath.push(treePathInfo[i].name);
                			}
                			return [
                    			'<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                    			'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                			].join('');
						}
					},
					series:[
						{
							name:'标题',
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
							data:data
						}
					]
				};
				mychart.setOption(option);
			},
			getLevelOption(){
				return [
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
							borderWidth:5,
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
							borderWidth:5,
							gapWidth:1,
							borderColorSaturation:0.6
						}
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