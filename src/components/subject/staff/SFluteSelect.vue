<template>
	<div>
		<van-field v-model="cusId" clickable @click="popupShow = true" placeholder="选择客户名称" input-align="center" label="机台" readonly>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
	</div>
</template>
<script>
	import { Icon ,Field } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Field.name]: Field,
		},
		props:[],
		data(){
			return {
				value:''
			}
		},
		methods:{

		},
		created(){
			
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