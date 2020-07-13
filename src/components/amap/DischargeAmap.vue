<template>
	<div>
		<div id="amapContainer" :style="'width:' + config.amap.containerWidth + 'px;height:' + config.amap.containerHeight + 'px;'"></div>
		<div id="rightTab">
			<div id="rightTop">
				<vxe-toolbar refresh :refresh="{query: getUnPackList}" size="mini">
					<template v-slot:buttons>
						<vxe-button @click="amapSearch()" :disabled="config.amap.disableSearch">绘制路线图</vxe-button>
					</template>
				</vxe-toolbar>
				<vxe-table :data.sync="config.table.top.list" ref="topXTable" :max-height="config.table.top.maxHeight" border :loading="config.table.top.loading" :radio-config="{ trigger: 'row', highlight: true }" size="mini"@radio-change="radioChange" >
					<vxe-table-column type="radio" title="单选" width="60" fixed="left"></vxe-table-column>
					<vxe-table-column prop="PListNo" label="装货单号" width="100" fixed="left"></vxe-table-column>
					<vxe-table-column prop="CarCode" label="车辆编号" width="100"></vxe-table-column>
					<vxe-table-column prop="CarPId" label="司机编号" width="100"></vxe-table-column>
					<vxe-table-column prop="TVolume" label="体积" width="100"></vxe-table-column>
					<vxe-table-column prop="To5Area" label="折五面积" width="100"></vxe-table-column>
					<vxe-table-column prop="TWeight" label="重量" width="100"></vxe-table-column>
					<vxe-table-column prop="CusNames" label="拼车客户" width="350" show-overflow></vxe-table-column>
				</vxe-table>
			</div>
			<div id="rightMiddle">
				<vxe-table :data.sync="config.table.middle.list" ref="middleXTable" :max-height="config.table.middle.maxHeight" border highlight-current-row size="mini">
					<vxe-table-column prop="CusSubName" label="送货公司" width="120" show-overflow fixed="left"></vxe-table-column>
					<vxe-table-column prop="TVolume" label="体积" width="100"></vxe-table-column>
					<vxe-table-column prop="To5Area" label="折五面积" width="100"></vxe-table-column>
					<vxe-table-column prop="TWeight" label="重量" width="100"></vxe-table-column>
					<vxe-table-column prop="TransC" label="运费" width="100"></vxe-table-column>
					<vxe-table-column prop="RouteName" label="路线" width="100"></vxe-table-column>
					<vxe-table-column prop="AreaName" label="地区" width="100"></vxe-table-column>
					<vxe-table-column prop="SubDNAddress" label="送货地址" width="350" show-overflow></vxe-table-column>
				</vxe-table>
			</div>
			<div id="rightButtom">
				<vxe-table :data.sync="config.table.buttom.list" ref="buttomXTable" :max-height="config.table.buttom.maxHeight" border highlight-current-row size="mini" :show-footer="true" :footer-method="footerMethod" :footer-cell-class-name="footerCellClassName">
					<!-- <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column> -->
					<vxe-table-column prop="CusSubName" label="送货公司" width="120" show-overflow fixed="left"></vxe-table-column>
					<vxe-table-column prop="TVolume" label="体积" width="100"></vxe-table-column>
					<vxe-table-column prop="To5Area" label="折五面积" width="100"></vxe-table-column>
					<vxe-table-column prop="TWeight" label="重量" width="100"></vxe-table-column>
					<vxe-table-column prop="TransC" label="运费" width="100"></vxe-table-column>
					<vxe-table-column prop="RouteName" label="路线" width="100"></vxe-table-column>
					<vxe-table-column prop="AreaName" label="地区" width="100"></vxe-table-column>
					<vxe-table-column prop="SubDNAddress" label="送货地址" width="350" show-overflow></vxe-table-column>
				</vxe-table>
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
				notificationClass:null,
				showNatification: null,
				config:{
					amap:{
						containerHeight:0,
						containerWidth:0,
						disableSearch:true,
					},
					table:{
						top:{
							maxHeight:0,
							loading:false,
							list:[]
						},
						middle:{
							maxHeight:0,
							list:[]
						},
						buttom:{
							maxHeight:0,
							list:[]
						}
					}
				},
				countDataList:[],
				topPListNo:'', //顶部表单选装货单号
				map:{},        //地图实例
				truck:{},      //货车规划实例
			}
		},
		methods:{
			/*获取装货信息(右侧顶部表格数据)*/
			getUnPackList(){
				let self = this;
				this.$request.amap.tableInfo.getUnPackList().then(res=>{
					if(res.errorCode == '00000'){
						self.config.table.top.list = res.result;
						self.config.table.top.loading = false;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.initTopTable();
					});
				});
			},
			/*获取装货单明细客户*/
			getPDNCus(pListNo){
				this.config.amap.disableSearch = true;
				let self = this;
				this.$request.amap.tableInfo.getPDNCus(pListNo).then((res)=>{
					if(res.errorCode == '00000'){
						self.config.table.middle.list = res.result;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						if( !XEUtils.isEmpty(this.map) ){
							this.config.amap.disableSearch = false;
						}
					});
				});
			},
			/*获取待装货客户*/
			getPackDetail(){
				let self = this;
				this.$request.amap.tableInfo.getPackDetail().then((res)=>{
					if(res.errorCode == '00000'){
						self.config.table.buttom.list = res.result;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.$refs.buttomXTable.updateFooter();
					});
				});
			},
			/*地图初始化*/
			amapInit(){
				let self = this;
				mapLoader().then(Amap=>{
					self.map = new AMap.Map('amapContainer', {
						zoom:15,
						center: [119.949216,30.046985],
						resizeEnable:true,
						viewMode: '3D',
						pinch: 45
					});
					let drivingOption = {
						policy      : 1,          //路线规划策略
						size        : 2,          //车型大小,必填,1-4分别对应小型至大型
						width       : 2.5,        //宽度
						height      : 2.0,        //高度
						load        : 1.5,        //载重
						weight      : 15,         //自重
						axlesNum    : 4,          //轴数
						extensions  : 'all',      //
						map         : this.map,   //AMap.Map对象, 展现结果的地图实例
						//panel       : 'info',    //
						hideMarkers : false,      //设置隐藏路径规划的起始点图标
						showTraffic : true,       //设置是否显示实时路况信息，默认设置为true
						isOutline   : true,       //使用map属性时,绘制的规划线路是否显示描边
						outlineColor: 'white',    //使用map属性时,绘制的规划线路的描边颜色,缺省为'white'
						autoFitView : true,       //用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
						province    : '浙',       //车辆牌照省份
						number      : '88888',    //车牌号
					};
					self.truck = new AMap.TruckDriving(drivingOption);
				},e=>{
					console.log('地图加载失败' ,e);
				});
			},
			/*设置需要修改的元素尺寸*/
			setElementSize(){
				/*设置导航地图高度*/
				this.config.amap.containerHeight = document.getElementById('rightTab').clientHeight; 
				this.config.amap.containerWidth  = document.body.clientWidth - document.getElementById('rightTab').clientWidth - 20; 
				/*设置右侧table最大高度(需要减去padding距离的2倍)*/
				this.config.table.top.maxHeight     = document.getElementById('rightTop').clientHeight - 56;
				this.config.table.middle.maxHeight  = document.getElementById('rightMiddle').clientHeight - 10;
				this.config.table.buttom.maxHeight  = document.getElementById('rightButtom').clientHeight - 10;
			},
			/*底部表格内汇总*/
			footerMethod({ columns, data }){
				let sums = [];
				let count = [];
				let self = this;
				columns.forEach((column, columnIndex)=>{
					if (columnIndex === 0) {
						sums.push('合计');
						count.push('统计');
					} else {
						let sumCell = null;
						let countCell = null;
						let topList = [];
						if( column.property == 'TVolume' || column.property == 'To5Area' || column.property == 'TWeight'){
							sumCell = XEUtils.sum(data, column.property);
							if( !XEUtils.isNull(self.$refs.topXTable.getRadioRecord()) ){
								topList[0] = self.$refs.topXTable.getRadioRecord();
								countCell += XEUtils.sum(topList,column.property);
							}
							if( !XEUtils.isEmpty(self.$refs.buttomXTable.getTableData().tableData) ){
								countCell += XEUtils.sum(self.$refs.buttomXTable.getTableData().tableData,column.property);
							}
						}else{
							sumCell = '--';
							countCell = '--'
						}
						sums.push(sumCell);
						count.push(countCell);
					}
				});
				return [ sums, count ];
			},
			/*底部表格表尾统计行样式*/
			footerCellClassName({ $rowIndex, column, columnIndex }){
				if ($rowIndex === 0) {
					return 'col-blue';
				} else {
					return 'col-red';
				}
			},
			/*顶部表格单选改变后触发*/
			radioChange({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }){
				this.$refs.buttomXTable.updateFooter();
				this.getPDNCus(row.PListNo);
			},
			/*刷新时触发(保持顶部表格选中)*/
			initTopTable(){
				let row = {};
				if( this.topPListNo != '' ){
					this.config.table.top.list.forEach((item,index)=>{
						if( item.PListNo == this.topPListNo ){
							row = item;
						}
					});
				}else{
					row = this.config.table.top.list[0];
				}
				this.$refs.topXTable.setRadioRow(row);
				this.$refs.topXTable.scrollToRow(row);
				this.getPDNCus(row.PListNo);
				this.$refs.buttomXTable.updateFooter();
			},
			/*绘制驾车路线图*/
			amapSearch(){
				if(!XEUtils.isEmpty(this.truck)){
					this.truck.clear();
				}
				let path = [];
				/*起始点*/
				path.push({
					lnglat:[120.307257,30.137186]
				});
				let newPath = this.searchFilter();
				if( !XEUtils.isEmpty(newPath) ){
					newPath.forEach((item,index)=>{
						let lnglat = JSON.parse(JSON.stringify(item.MapPosition)).map(Number);
						path.push({lnglat:lnglat});
					});
				}
				this.truck.search(path,function(status,result){
	            		if (status === 'complete') {
				            console.log('绘制驾车路线完成')
				        } else {
				            console.log('获取驾车数据失败：' + result)
				        }
            		}
            	);
			},
			/*对中间和底部表去重排序*/
			searchFilter(){
				let middleIsEmpty = XEUtils.isEmpty(this.$refs.middleXTable.getTableData().tableData);
				let buttomIsEmpty = XEUtils.isEmpty(this.$refs.buttomXTable.getTableData().tableData);
				if( middleIsEmpty && !buttomIsEmpty ){
					return this.$refs.buttomXTable.getTableData().tableData;
				}else if( middleIsEmpty && buttomIsEmpty ){
					return false;
				}else if( !middleIsEmpty && !buttomIsEmpty ){
					let arr = this.$refs.buttomXTable.getTableData().tableData.concat(this.$refs.middleXTable.getTableData().tableData);
					let newArr = [arr[0]];
					for (let i = 1; i < arr.length; i++) {
						let repeat = false;
						for (let j = 0; j < newArr.length; j++) {
							if (arr[i] === newArr[j]) {
								repeat = true;
							}
						}
						if (!repeat) {
							newArr.push(arr[i]);
						}
					}
					return newArr.sort((a,b)=>{
						if( a.Distance == b.Distance ){
							return a.TVolume - b.TVolume;
						}
						return a.Distance == b.Distance
					});
				}else{
					return this.$refs.middleXTable.getTableData().tableData;
				}
			}
		},
		created(){
			
		},
		mounted(){
			this.setElementSize();
			Promise.all([this.getUnPackList(),this.getPackDetail(),this.amapInit()]);
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
		padding: 0;
	}
	#rightTab {
        position: fixed;
        /* background-color: #7d8b8d; */
        border:0.125rem solid #000;
        /* max-height: 90%; */
        overflow-y: auto;
        top: 0rem;
        right: 1rem;
        bottom:0rem;
        width: 40%;
    }
    #rightTop {
    	/* background-color: red; */
    	width:100%;
    	height: 30%;
    	padding: 0.3125rem;
    }
    #rightMiddle {
    	/* background-color: yellow; */
    	border-top: 0.125rem solid #000;
    	width:100%;
    	height: 30%;
    	padding: 0.3125rem;
    }
    #rightButtom {
    	/* background-color: blue; */
    	border-top: 0.125rem solid #000;
    	width:100%;
    	height: 30%;
    	padding: 0.3125rem;
    }
    #rightButtom .col-blue {
		background-color: #2db7f5;
		color: #fff;
	}
	#rightButtom .col-red {
		background-color: red;
		color: #fff;
	}

</style>