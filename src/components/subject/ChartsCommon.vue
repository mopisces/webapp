<template>
	<div >
		<div :id="id" :option="options"></div>
	</div>
</template>
<script>
	import HighCharts from 'highcharts/highstock';
	export default {
		components:{
			
		},
		props:{
			id: {
				type:String,
				require:true
			},
			options:{
				type:Object,
				require:true
			}
		},
		data(){
			return {

			}
		},
		methods:{

		},
		mounted(){
			HighCharts.chart(this.id,this.options);
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>