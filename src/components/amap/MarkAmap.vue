<template>
	<div>
		<div id="markContainer" :style="'width:' + config.amap.containerWidth + 'px;height:' + config.amap.containerHeight + 'px;'"></div>
		<div class="input-card" style='width:28rem;'>
			<label style='color:grey'>送货热点图</label>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">切换图</span></div>
				<el-button type="success" @click="change">切换</el-button>
			</div>
			<label style='color:grey'>绘制线段</label>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">绘制线段</span></div>
				<el-button type="success" @click="drawPolyline">绘制线段</el-button>
			</div>
			<label style='color:grey'>绘制区域</label>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">绘制区域</span></div>
				<el-button type="success" @click="drawArea">绘制</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapLoader } from '@/util';
	export default {
		components:{

		},
		data(){
			return {
				formData:{
					cusSubChiName:''
				},
				config:{
					amap:{
						containerHeight:0,
						containerWidth:0,
						zoom: 11,
						center: [116.418261, 39.921984]
					},
					heatMap:{
						hide:false
					},
					markMap:{
					}
				},
				map:{},        //地图实例
				heatMap:{},    //热力图实例
				markMap:{},    //标记图实例
				mouseTool:null   //鼠标工具实例
			}
		},
		methods:{
			amapInit(){
				let self = this;
				mapLoader().then(Amap=>{
					self.map = new Amap.Map('markContainer', 
						{
							zoom: self.config.amap.zoom,
							center: self.config.amap.center,
							resizeEnable:true,
							mapStyle: 'amap://styles/light', 
							features:['bg','road','building'],
							showBuildingBlock:true,
							viewMode: '2D',
							pinch: 45
						}
					);
					self.heatMap = new AMap.Heatmap(self.map,{
						radius: 40,
						opacity: [0, 0.8]
					});
					self.heatMap.setDataSet({
						data: heatmapData,
						max: 100
					});
				},e=>{
					console.log('地图加载失败' ,e);
				});
			},
			setMark(){
				let self = this;
				let style = [
					{
					    url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
					    anchor: new AMap.Pixel(6, 6),
					    size: new AMap.Size(11, 11)
					}, {
					    url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
					    anchor: new AMap.Pixel(4, 4),
					    size: new AMap.Size(7, 7)
					}, {
					    url: 'https://a.amap.com/jsapi_demos/static/images/mass2.png',
					    anchor: new AMap.Pixel(3, 3),
					    size: new AMap.Size(5, 5)
					}
				];

				let markData = [];
				heatmapData.forEach((item,idx)=>{
					markData.push({lnglat:[item.lng,item.lat],name: '厂家名称' + idx,style:self.random()})
				});
				self.markMap = new AMap.MassMarks(markData,{
			        opacity: 0.8,
			        zIndex: 111,
			        cursor: 'pointer',
			        style: style
			    });
			    self.markMap.setMap(self.map);

			    var marker = new AMap.Marker({content: ' ', map: self.map});

			    self.markMap.on('mouseover',(e)=>{
			    	marker.setPosition(e.data.lnglat);
			    	marker.setLabel({content: e.data.name});
			    });

			    self.markMap.on('dblclick',(e)=>{
			    	console.log(e)
			    });
			},

			setElementSize(){
				console.log(document.documentElement.clientHeight)
				console.log(document.documentElement.clientWidth)
				this.config.amap.containerHeight = document.documentElement.clientHeight; 
				this.config.amap.containerWidth  = document.documentElement.clientWidth; 
			},
			isSupportCanvas(){
				var elem = document.createElement('canvas');
				return !!(elem.getContext && elem.getContext('2d'));
			},
			change(){
				if( this.config.heatMap.hide ){
					this.heatMap.show();
					if(this.markMap) this.markMap.hide();
				}else{
					this.heatMap.hide();
					this.setMark();
				}
				this.config.heatMap.hide = !this.config.heatMap.hide;
			},
			random(){
				return Math.floor(Math.random() * (3 - 0)) + 0;
			},
			drawPolyline(){
				if( !this.mouseTool ) this.mouseTool = new AMap.MouseTool(this.map);
				this.mouseTool.polyline({
			 		strokeColor: "#3366FF", 
					strokeOpacity: 1,
					strokeWeight: 6,
					// 线样式还支持 'dashed'
					strokeStyle: "solid",
					// strokeStyle是dashed时有效
					// strokeDasharray: [10, 5],
				});
				this.mouseTool.on('draw', (e)=>{
					//console.log('覆盖物对象绘制完成');
					let point = [];
					let drawPath = e.obj.getPath();
					drawPath.forEach((item,idx)=>{
						point.push({lat:item.lat,lng:item.lng})
					});
					console.log(point);

					/*let bounds = e.obj.getBounds();
					console.log(bounds)*/
				});
			},
			drawArea(){
				let res = [
					{
						color:'#FF33FF',
						data:[
							[116.453322, 39.920255],
							[116.460703, 39.897555],
							[116.452292, 39.892353],
							[116.439846, 39.891365],
							[116.453322, 39.920255]
						]
					},
					{
						color:'green',
						data:[
							[116.403322, 39.920255],
							[116.410703, 39.897555],
							[116.402292, 39.892353],
							[116.389846, 39.891365],
							[116.403322, 39.920255]
						]
					},
					{
						color:'yellow',
						data:[
							[116.353322, 39.820255],
							[116.360703, 39.797555],
							[116.352292, 39.792353],
							[116.339846, 39.791365],
							[116.353322, 39.820255]
						]
					},
				];
				let line = [];
				for(var i = 0; i<res.length; i++){
					line.push(new AMap.Polyline({
						path: res[i].data,
						strokeColor: res[i].color,
						strokeWeight: 6,
						strokeOpacity: 0.9,
						zIndex: 50,
						bubble: true,
					}))
				}
				this.map.add(line)
			}
		},
		created(){
			
		},
		mounted(){
			this.setElementSize();
			this.amapInit();
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
<style type="text/css">
	html body{
		height: 100%;
		width: 100%;
	}
</style>