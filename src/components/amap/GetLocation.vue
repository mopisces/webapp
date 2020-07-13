<template>
	<div>
		<div id="container" :style="'width:100%;height:' + config.amap.height + 'px;'"></div>
		<div class="input-card" style='width:28rem;'>
			<label style='color:grey'>地理编码，根据地址获取经纬度坐标</label>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">客户名称</span></div>
				<el-autocomplete v-model="formData.cusSubChiName" :fetch-suggestions="querySearch" placeholder="请输入地址" :trigger-on-foucus="false" @select="handleSelect"></el-autocomplete>
			</div>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">地址</span></div>
				<input disabled type="text" :value="config.address">
			</div>
			<div class="input-item">
				<div class="input-item-prepend"><span class="input-item-text">经纬度</span></div>
				<input id='lnglat' disabled type="text" :value="formData.lnglat.join(',')">
			</div>
			<input id="search" type="button" class="btn" value="搜索" @click="goSearch()"/>
		</div>
		<div id="info"></div>
	</div>
</template>

<script>
	import { mapLoader } from '@/util'
	export default {
		data(){
			return {
				config:{
					amap:{
						height:0,
					},
					address:'',
					addressOptions:[],
				},
				address:'',
				map:null,
				geocoder:null,
				marker:null,
				placeSearch:null,
				mouseTool:null,
				contextMenuPositon:null,
				menu:null,
				formData:{
					cusId:'',
					cusSubNo:'',
					cusSubChiName:'',
					lnglat:['',''],
				}
			}
		},
		methods:{
			init(){
				let self = this;
				mapLoader().then(AMap => {
					self.map = new AMap.Map('container', {
						zoom:13,
						center: [119.949216,30.046985],
						resizeEnable:true,
						viewMode: '3D',
						pinch: 45
					});

					//罗盘
					AMap.plugin([
						'AMap.ControlBar',
	    			], function(){
	        			self.map.addControl(new AMap.ControlBar());
	    			});
					var auto = new AMap.Autocomplete({
				        input: "address"
				    });

					self.geocoder = new AMap.Geocoder();

					self.marker = new AMap.Marker();

					this.menu = new AMap.ContextMenu();
					this.contextMenu();

				},e=>{
					console.log('地图加载失败' ,e)
				});
			},
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
			//右键菜单
			contextMenu(){
				let self = this;
				self.menu.addItem("放大一级", function () {
					self.map.zoomIn();
				}, 0);
				self.menu.addItem("缩小一级", function () {
					self.map.zoomOut();
				}, 1);
				self.menu.addItem("添加标记", function (e) {
					self.map.remove(self.marker);
					self.marker = new AMap.Marker({
						title:'1234',
						clickable:true,
						draggable:true,
						label:{
							offset:new AMap.Pixel(0, -10),
							content:"<div class='marker'>自定义地址</div>",
							direction :'top',
						},
						map: self.map,
						position: self.contextMenuPositon //基点位置
					});
					self.marker.on("dblclick",function(e){
						self.getLocation(self.marker.getPosition());
					});
				}, 3);
				self.map.on('rightclick', function (e) {
					self.menu.open(self.map, e.lnglat);
					self.contextMenuPositon = e.lnglat;
				});
			},
			//搜索
			goSearch(){
				let self = this;
				AMap.service(["AMap.PlaceSearch"],function(){
					let placeSearch = new AMap.PlaceSearch({
						pageSize: 5,
						pageIndex: 1,
						city:'杭州',
						map:self.map,
						panel:'info',
						autoFitView:true,
					});
					placeSearch.search(self.config.address);
					placeSearch.on('markerClick',function(e){
						self.getLocation(e.data.location);
					});
				});
			},
			getLocation(position){
				this.formData.lnglat = [position.lng, position.lat];
				this.$confirm('将该点经纬度设置为该公司地址？', '提示', {
					confirmButtonText : '确定',
					cancelButtonText  : '取消',
					type:'warning'
				}).then(()=>{
					this.$request.amap.getLocation.saveMapPosition(this.formData).then(res=>{
						if(res.errorCode == '00000'){
							this.$message({
								type: 'success',
								message: '保存成功!'
							})
						}
					});
				});
			},
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
			handleSelect(item){
				this.formData.lnglat = [];
				this.config.address    = item.SubDNAddress;
				this.formData.cusId    = item.CusId;
				this.formData.cusSubNo = item.CusSubNo
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
        top: 20rem;
        right: 1rem;
        width: 20rem;
    }
    #panel .amap-call {
        background-color: #009cf9;
        border-top-left-radius: 4px;
	        border-top-right-radius: 4px;
    }
    #panel .amap-lib-driving {
        border-bottom-left-radius: 4px;
	        border-bottom-right-radius: 4px;
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
        border-top-left-radius: 4px;
	        border-top-right-radius: 4px;
    }
    #info .amap-lib-driving {
        border-bottom-left-radius: 4px;
	        border-bottom-right-radius: 4px;
        overflow: hidden;
    }
    .marker {
		position: absolute;
		top: -1.25rem;
		right: -7.375rem;
		color: #fff;
		padding: 0.25rem 0.625rem;
		box-shadow: 0.0625rem 0.0625rem 0.0625rem rgba(10, 10, 10, .2);
		white-space: nowrap;
		font-size: 1rem;
		font-family: "";
		background-color: #25A5F7;
		border-radius: 0.1875rem;
	}
	</style>
