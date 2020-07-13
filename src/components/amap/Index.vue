<template>
	<div>
		<!-- <div class="map" id="map"></div> -->
		<!-- <div class="map" id="container"></div>
		<div id="panel"></div>
		<div class="input-card">
			<label style='color:grey'>请输入或点击地图获取经纬度：(经度,纬度)</label>
			<div class="input-item">
				<div class="input-item-prepend">
					<span class="input-item-text" >经纬度</span>
				</div>
				<input id='lnglat' type="text" value="116.512402,39.867054" />
			</div>
			<label style='color:grey'>请输入平面地图像素坐标：(x,y)</label>
			<div class="input-item">
				<div class="input-item-prepend">
				 	<span class="input-item-text">平面坐标</span>
				</div>
				<input id='pixel' type="text" />
			</div>
		</div>
		<input id="lnglat2pixel" type="button" class="btn" value="经纬度 -> 平面像素坐标" />
		<input id="pixel2lnglat" type="button" class="btn" value="平面像素坐标 -> 经纬度" /> -->
		<div id="container" :style="'width:100%;height:' + config.containerHeight + 'px;'"></div>
		<div id="panel">
			<div style="width:100%;">
				<input type="button" style="height:2rem;width:4rem;" value="刷新" @click="getUnPackList()"/>
				<v-table is-horizontal-resize is-vertical-resize style="width:100%;" :height="config.panelHeight * 0.20" :columns="config.table.top.columns" :table-data="config.table.top.data" row-hover-color="#eee" row-click-color="#edf7ff" :index="0" @on-custom-comp="customCompFunc" :select-change="selectChange">
				</v-table>
			</div>
			<div style="width:100%;margin-top:2rem;">
				<v-table is-horizontal-resize is-vertical-resize style="width:100%;" :height="config.panelHeight * 0.40" :columns="config.table.middle.columns" :table-data="config.table.middle.data" row-hover-color="#eee" row-click-color="#edf7ff" :index="1">
				</v-table>
			</div>
			<div style="width:100%;margin-top:2rem;">
				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :height="config.panelHeight * 0.40" :columns="config.table.bottom.columns" :table-data="config.table.bottom.data" row-hover-color="#eee" row-click-color="#edf7ff" :index="2">
				</v-table>
			</div>
		</div>
		<div id="info"></div>
		<!-- <input id="tipinput" type="text" placeholder="输入提示" /> -->
	</div>
</template>

<script>
	import { mapLoader } from '@/util'
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		data(){
			return {
				config:{
					panelHeight:0,
					containerHeight:0,
					table:{
						top:{
							columns : [
								{field: 'amapPDNCusRadio', title: '装货单号', width: 100, titleAlign: 'center',componentName: 'table-operate', columnAlign: 'center',isResize:true,isFrozen:true},
								{field: 'PListNo', title: '装货单号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen:true},
								{field: 'CarCode', title: '车辆编号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'CarPId', title: '司机编号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TVolume', title: '体积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'To5Area', title: '折五面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TWeight', title: '重量', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'CusNames', title: '拼车客户', width: 350, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'amapPDNCus', title: '操作', width: 120, titleAlign: 'center',componentName:'table-operate', columnAlign: 'center',isResize:true}
							],
							data    : {}
						},
						middle:{
							columns : [
								/*{field: 'CusId', title: 'CusId', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen:true},
								{field: 'CusSubNo', title: 'CusSubNo', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},*/
								{field: 'CusSubName', title: '送货公司', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TVolume', title: '体积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'To5Area', title: '折五面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TWeight', title: '重量', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TransC', title: '运费', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'RouteName', title: '路线', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'AreaName', title: '地区', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'SubDNAddress', title: '送货地址', width: 350, titleAlign: 'center', columnAlign: 'center',isResize:true},
								/*{field: 'MapPosition', title: 'MapPosition', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'Distance', title: 'Distance', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},*/
							],
							data    : {}
						},
						bottom:{
							columns : [
								/*{field: 'CusId', title: 'CusId', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen:true},
								{field: 'CusSubNo', title: 'CusSubNo', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},*/
								{field: 'CusSubName', title: '送货公司', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TVolume', title: '体积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'To5Area', title: '折五面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TWeight', title: '重量', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'TransC', title: '运费', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'RouteName', title: '路线', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'AreaName', title: '地区', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'SubDNAddress', title: '送货地址', width: 250, titleAlign: 'center', columnAlign: 'center',isResize:true},
								/*{field: 'MapPosition', title: 'MapPosition', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
								{field: 'Distance', title: 'Distance', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},*/
							],
							data    : {}
						}
					}
				},
				map:null,
				placeSearch:null,
				infoWindow:[
					{lnglat:[119.949216,30.046985],address:'1',name:'a'},
					{lnglat:[119.982175,30.03688],address:'2', name:'b'},
					{lnglat:[119.991358,30.009607],address:'3',name:'c'},
					{lnglat:[119.9696,30.005444],address:'4',  name:'d'},
					{lnglat:[119.946383,29.999944],address:'5',name:'e'},
					{lnglat:[119.924668,29.952658],address:'7',name:'g'},
					{lnglat:[119.925601,29.931656],address:'8',name:'h'},
					{lnglat:[119.929507,29.925482],address:'9',name:'i'},
					{lnglat:[119.888638,30.082481],address:'10',name:'j'}
				]
			}
		},
		methods:{
			/*MapInit(){
				let _this = this;
				let map = new AMap.Map("map", {
			        center: [105.397428, 35.90923],
			        mapStyle: "amap://styles/这里放入样式ID",
			        resizeEnable: true,
			        zoom: 5,
			    });
			},
			init(){
				var map = new AMap.Map('container', {
	               	resizeEnable: true,
			        center: [116.397428, 39.90923],
			        zoom: 13
	            });
	            var driving = new AMap.Driving({
	            	map: map,
	            	panel: "panel"
	            });
	            driving.search(
	            	[
	            		{keyword:'北京南站',city:'北京市'},
	            		{keyword:'杭州市江干区新加坡杭州科技园11幢',city:'杭州市'},
	            		{keyword:'北京西站',city:'北京市'},
	            	],
	            	function(status,result){
	            		if (status === 'complete') {
				            console.log('绘制驾车路线完成')
				        } else {
				            console.log('获取驾车数据失败：' + result)
				        }
	            	}
	            );
			}*/
			init(){
				let self = this;
				mapLoader().then(AMap => {
					self.map = new AMap.Map('container', {
						zoom:15,
						center: [119.949216,30.046985],
						resizeEnable:true,
						viewMode: '3D',
						pinch: 45
					});

					//罗盘
					/*AMap.plugin([
						'AMap.ControlBar',
	    			], function(){
	        			self.map.addControl(new AMap.ControlBar());
	    			});

					var auto = new AMap.Autocomplete({
				        input: "tipinput"
				    });*/
				    /*var placeSearch = new AMap.PlaceSearch({
				    	map:self.map
				    });
	        			'AMap.ControlBar',

				    AMap.event.addListener(auto, "select", select);

				    function select(e) {
				        placeSearch.setCity(e.poi.adcode);
				        placeSearch.search(e.poi.name);  //关键字查询查询
				    }*/
				    var drivingOption = {
				    	policy      : 1,          //路线规划策略
						size        : 2,          //车型大小,必填,1-4分别对应小型至大型
						width       : 2.5,        //宽度
						height      : 2.0,        //高度
						load        : 1.5,        //载重
						weight      : 15,         //自重
						axlesNum    : 4,          //轴数
						extensions  : 'all',      //
						map         : self.map,   //AMap.Map对象, 展现结果的地图实例
						//panel       : 'info',    //
						hideMarkers : false,      //设置隐藏路径规划的起始点图标
						showTraffic : true,       //设置是否显示实时路况信息，默认设置为true
						isOutline   : true,       //使用map属性时,绘制的规划线路是否显示描边
						outlineColor: 'white',    //使用map属性时,绘制的规划线路的描边颜色,缺省为'white'
						autoFitView : true,       //用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
						province    : '浙',       //车辆牌照省份
						number      : '88888',    //车牌号
					};
				    //货车路径规划
				    var truck = new AMap.TruckDriving(drivingOption);
				    truck.search(
				    	[
		            		{lnglat:[119.949216,30.046985]},
		            		{lnglat:[119.982175,30.03688]},
		            		{lnglat:[119.991358,30.009607]},
		            		{lnglat:[119.9696,30.005444]},
		            		{lnglat:[119.946383,29.999944]},
		            		{lnglat:[119.924668,29.952658]},
		            		{lnglat:[119.925601,29.931656]},
		            		{lnglat:[119.929507,29.925482]},
		            		{lnglat:[119.888638,30.082481]},
		            	],
		            	function(status,result){
		            		if (status === 'complete') {
					            console.log('绘制驾车路线完成')
					        } else {
					            console.log('获取驾车数据失败：' + result)
					        }
		            	},
		            );
		            let markers = [
		            	{position:[119.949216,30.046985],company:'杭州'},
		            	{position:[119.982175,30.03688],company:'杭州'},
		            	{position:[119.991358,30.009607],company:'杭州'},
		            	{position:[119.9696,30.005444],company:'杭州'},
		            	{position:[119.946383,29.999944],company:'杭州'},
		            	{position:[119.924668,29.952658],company:'杭州'},
		            	{position:[119.925601,29.931656],company:'杭州'},
		            	{position:[119.929507,29.925482],company:'杭州'},
		            	{position:[119.888638,30.082481],company:'杭州'},
		            ];
		            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
		            markers.forEach((item,index)=>{
		            	 var marker = new AMap.Marker({
		            		map: self.map,
		            		position: [item.position[0], item.position[1]]
		            		//offset: new AMap.Pixel(-13, -30)
			           	});
		            	marker.content = '公司名称：' + item.company + index;
		            	marker.on('click', markerClick);
		            	marker.emit('click', {target: marker});
		            });
		           	function markerClick(e) {
		           		infoWindow.setContent(e.target.content);
		           		infoWindow.open(self.map, e.target.getPosition());
		           	}
		            //驾车导航
					/*var driving = new AMap.Driving({
		            	map: self.map,
		            	panel: "panel"
		            });
		            driving.search(
		            	[
		            		{keyword:'北京南站',city:'北京市'},
		            		{keyword:'杭州市滨江区市民中心',city:'杭州市'},
		            		{keyword:'杭州市江干区新加坡杭州科技园11幢',city:'杭州市'},
		            		{keyword:'北京西站',city:'北京市'},
		            	],
		            	function(status,result){
		            		if (status === 'complete') {
					            console.log('绘制驾车路线完成')
					        } else {
					            console.log('获取驾车数据失败：' + result)
					        }
		            	}
		            );*/
				},e=>{
					console.log('地图加载失败' ,e)
				});
			},
			getUnPackList(){
				let self = this;
				this.$request.amap.tableInfo.getUnPackList().then(res=>{
					if(res.errorCode == '00000'){
						self.config.table.top.data = res.result;
						/*self.config.table.middle.data = res.result.middle_info;
						self.config.table.bottom.data = res.result.bottom_info;*/
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.init();
					});
				});
			},
			getPDNCus(pListNo){
				let self = this;
				this.$request.amap.tableInfo.getPDNCus(pListNo).then((res)=>{
					if(res.errorCode == '00000'){
						self.config.table.middle.data = res.result;
					}
				});
			},
			getPackDetail(){
				let self = this;
				this.$request.amap.tableInfo.getPackDetail().then((res)=>{
					if(res.errorCode == '00000'){
						self.config.table.bottom.data = res.result;
					}
				});
			},
			openInfo( index = 1 ){
				let self = this;
				MapLoader().then(AMap => {
					let info = [];
					//let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
					info.push("<div class='input-card content-window-card'><div><img style=\"float:left;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div>")
					info.push("<div style=\"padding:17px 0px 0px 0px;\"><h4>" + self.infoWindow[index].name + "</h4>");
        			info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
        			info.push("<p class='input-item'>地址 :" + self.infoWindow[index].address + "</p></div></div>");
        			//infoWindow.setContent(info);
        			//infoWindow.setPosition(self.infoWindow[index].lnglat);
					//self.map.setFitView()
					
					let infoWindow = new AMap.InfoWindow({
						content: info.join(""),
						position:self.infoWindow[index].lnglat
					});
					infoWindow.open(self.map, self.map.getCenter());
				});
				
			},
			//
			customCompFunc(params){
				if(params.type == 'detail'){
					this.getPDNCus(params.rowData.PListNo);
				}
				if(params.type == 'refresh'){
					this.getPDNCus(params.rowData.PListNo);
				}
			},
			selectChange(selection,rowData){
				console.log(selection);
				console.log(rowData);
			}
		},
		created(){
			
		},
		mounted(){
			this.config.panelHeight = document.getElementById("panel").offsetHeight - 5 * 16 - 20 *3;
			this.config.containerHeight = document.body.clientHeight;
			this.getUnPackList();
			this.getPackDetail();
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

<style>
	.map{
		width:100%;
		height:1600px;
	}
	html,body,#container{
        height:100%;
        width:100%;
    }
    .btn{
        width:14em;
        margin-left:3.2rem;  
        margin-top: 0.8rem; 
    }
</style>
<style type="text/css">
    #panel {
        position: fixed;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;
        top: 2rem;
        right: 1rem;
        width: 40rem;
        height: 40.5rem;
    }
    #panel .amap-call {
        background-color: #009cf9;
        border-top-left-radius: 0.25rem;
	    border-top-right-radius: 0.25rem;
    }
    #panel .amap-lib-driving {
        border-bottom-left-radius: 0.25rem;
	    border-bottom-right-radius: 0.25rem;
        overflow: hidden;
    }
    #info {
        position: fixed;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;
        top: 1rem;
        left: 1rem;
        width: 20rem;
    }
    #info .amap-call {
        background-color: #009cf9;
        border-top-left-radius: 0.25rem;
	        border-top-right-radius: 0.25rem;
    }
    #info .amap-lib-driving {
        border-bottom-left-radius: 0.25rem;
	        border-bottom-right-radius: 0.25rem;
        overflow: hidden;
    }
    .v-table-title-class{
		color:#1a991d;
		font-size: 1rem;
	}
	.v-table-body-class{
		font-size: 1rem;
	}
</style>
<link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css"/>