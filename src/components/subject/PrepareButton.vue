<template>
	<van-button type="info" @click="prepareClick">{{ buttonName }}</van-button>
</template>
<script>
	import { Button } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
		},
		props:{
            rowData:{
                type:Object
            },
            field:{
                type:String
            },
            index:{
                type:Number
            }
        },
		data(){
			return {
				buttonName:'准备'
			}
		},
		methods:{
			prepareClick(){
				if( this.rowData.CarState == 1 ){
					this.buttonName = '取消准备';
					this.$emit('cancelPar',this.rowData);
				}else{
					this.$emit('confirmPar',this.rowData);
				}
			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>