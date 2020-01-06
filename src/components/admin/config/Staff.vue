<template>
	<div>
		
	</div>
</template>
<script>
	import {  Button, Row, Col, Field, SwitchCell, Dialog, Collapse, CollapseItem  } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Row.name]: Row,
			[Col.name]: Col,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
		},
		data(){
			return {
				value:''
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('admin/setHeaderTitle','外部参数修改');
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