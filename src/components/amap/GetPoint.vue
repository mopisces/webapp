<template>
	<div>
		<!-- <div id="amapContainer" :style="'width:' + config.amap.containerWidth + 'px;height:' + config.amap.containerHeight + 'px;'"></div> -->
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa" :row-click="rowClick"></v-table>

	</div>
</template>
<script>
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		data(){
			return {
				config:{
					amap:{
						containerWidth:0,
						containerHeight:0,
					},
					table:{
						columns:[
							{field:"OrderId",title:"订单编号",width:"100",titleAlign:"center",columnAlign:"center",isResize:true},
							{field:"OrderId",title:"订单编号",width:"100",titleAlign:"center",columnAlign:"center",isResize:true},
						],
						height:500
					}
				},
				tableData:[
					{ OrderId:1, }
				]
			}
		},
		methods:{
			setElementSize(){
			},
			rowClick(){}
		},
		created(){
			this.setElementSize();
		},
		mounted(){

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