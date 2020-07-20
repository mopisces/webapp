<template>
	<div>
		<div id="container" :style="'width:100%;height:' + config.amap.height + 'px;'"></div>
		<div class="input-card" style='width:28rem;'>
			<label style='color:grey'>地理编码，根据地址获取经纬度坐标</label>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">客户名称</span></div>
				<el-autocomplete v-model="formData.cusSubChiName" :fetch-suggestions="querySearch" placeholder="请输入地址" :trigger-on-foucus="false" @select="handleSelect" clearable @clear="handleClear"></el-autocomplete>
			</div>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">地址</span></div>
				<input disabled type="text" :value="config.address">
			</div>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">经纬度</span></div>
				<input id='lnglat' disabled type="text" :value="formData.lnglat.join(',')">
			</div>
			<el-button type="primary" @click="goSearch()" v-if="config.button.showSearch">搜索</el-button>
			<el-button type="warning" @click="goLocation()" v-else>定位</el-button>
		</div>
		<div id="info"></div>
	</div>
</template>

<script>
	import { Toast, Dialog } from 'vant';
	import { mapLoader } from '@/util';
	export default {
		data(){
			return {
				config:{
					amap:{
						height:0,
						center:[119.949216,30.046985],
						zoom:13,
					},
					address:'',
					addressOptions:[],
					button:{
						showSearch:true
					}
				},
				map:null,
				marker:null,
				placeSearch:null,
				contextMenuPositon:null,
				menu:null,
				formData:{
					cusId:'',
					cusSubNo:'',
					cusSubChiName:'',
					lnglat:[],
				}
			}
		},
		methods:{
			init(){
				let self = this;
				mapLoader().then(AMap => {
					self.map = new AMap.Map('container', {
						zoom: self.config.amap.zoom,
						center: self.config.amap.center,
						resizeEnable:true,
						viewMode: '3D',
						pinch: 45
					});
					/*地图罗盘*/
					AMap.plugin([
						'AMap.ControlBar',
	    			], function(){
	        			self.map.addControl(new AMap.ControlBar());
	    			});
					/*地图标记对象*/
					self.marker = new AMap.Marker({
						map: self.map,
						clickable:true,
						draggable:true,
						visible:false
					});
					/*标记拖动监听方法*/
					self.marker.on('dragging', function(){
						let position = self.marker.getPosition();
						self.formData.lnglat = [position.lng, position.lat];
					});
					/*地图右键菜单*/
					this.menu = new AMap.ContextMenu({isCustom: true});
					this.contextMenu();
				},e=>{
					console.log('地图加载失败' ,e)
				});
			},
			/*获取客户信息*/
			getAddressOptions(){
				let self = this;
				this.$request.amap.getLocation.getCustomerDN().then(res=>{
					if(res.errorCode == '00000'){
						self.config.addressOptions = res.result;
					}
				}).then(()=>{
					this.init();
				});
			},
			/*右键菜单*/
			contextMenu(){
				let self = this;
				self.menu.addItem("放大一级", function () {
					self.map.zoomIn();
				}, 0);
				self.menu.addItem("缩小一级", function () {
					self.map.zoomOut();
				}, 1);
				self.menu.addItem("添加标记", function (e) {
					self.setMarker( self.contextMenuPositon );
					self.marker.on("dblclick", function(e){
						self.getLocation( self.marker.getPosition() );
					});
				}, 3);
				self.map.on('rightclick', function (e) {
					self.menu.open(self.map, e.lnglat);
					self.contextMenuPositon = e.lnglat;
				});
			},
			/*设置地图标记并显示*/
			setMarker( position ){
				this.marker.setPosition( position );
				this.marker.setLabel({
					content:"<div class='marker'>" + this.formData.cusSubChiName + "</div>",
				});
				if( this.formData.cusSubChiName ){
					this.marker.show();
				}
			},
			/*地图搜索*/
			goSearch(){
				let self = this;
				AMap.service(["AMap.PlaceSearch"],function(){
					self.placeSearch = new AMap.PlaceSearch({
						pageSize: 5,
						pageIndex: 1,
						city:'杭州',
						map:self.map,
						panel:'info',
						autoFitView:true,
					});
					self.placeSearch.search(self.config.address);
					self.placeSearch.on('markerClick',function(e){
						self.getLocation(e.data.location);
					});
				});
			},
			/*设置已有用户地址*/
			goLocation(){
				let lnglat = JSON.parse(JSON.stringify(this.formData.lnglat));
				this.map.setCenter( new AMap.LngLat(lnglat[0], lnglat[1]) );
				this.setMarker( new AMap.LngLat(lnglat[0], lnglat[1]) );
			},
			/*保存用户地址api*/
			getLocation(position){
				this.formData.lnglat = [position.lng, position.lat];
				Dialog.confirm({
					title:'提示',
					message:'将该点经纬度设置为该公司地址？'
				}).then(()=>{
					this.$request.amap.getLocation.saveMapPosition(this.formData).then(res=>{
						if(res.errorCode == '00000'){
							Toast.success('保存成功!');
						}
					});
				}).catch(()=>{
					Dialog.close();
				});
			},
			/*选择当前用户*/
			querySearch(queryString,cb){
				let addressOptions = this.config.addressOptions;
				let results = queryString ? this.config.addressOptions.filter( this.createFilter(queryString) ) : addressOptions;
				cb(results);
			},
			createFilter(queryString){
				return (item) => {
					return ( item.value.toLowerCase().indexOf( queryString.toLowerCase() ) === 0 );
				}
			},
			/*用户选中后触发函数*/
			handleSelect(item){
				this.formData.lnglat = [];
				this.config.address    = item.SubDNAddress;
				this.formData.cusId    = item.CusId;
				this.formData.cusSubNo = item.CusSubNo;
				if( item.MapPosition ){
					this.config.button.showSearch = false;
					this.formData.lnglat = JSON.parse(JSON.stringify(item.MapPosition.split(','))).map(Number);
				}else{
					this.config.button.showSearch = true;
				}
			},
			/*用户点击清除按钮后触发*/
			handleClear(){
				this.formData.lnglat = [];
				this.config.address    = '';
				this.formData.cusId    = '';
				this.formData.cusSubNo = '';
				if( this.placeSearch ){
					this.placeSearch.clear();
				}
				this.marker.hide();
				this.map.setZoomAndCenter(this.config.amap.zoom, this.config.amap.center);
				this.config.button.showSearch = true;
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','地理位置获取坐标');
		},
		mounted(){
			this.getAddressOptions();
			this.config.amap.height = document.body.clientHeight; 
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			changeChiName(){
				return this.formData.cusSubChiName;
			}
		},
		watch:{
			changeChiName( newV, oldV ){
				if( newV == '' ){
					this.handleClear();
				}
			}
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