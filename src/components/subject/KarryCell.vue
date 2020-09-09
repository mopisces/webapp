<template>
	<div class="van-cell" style="display: flex;align-items: center;">
		<div class="van-cell__title van-field__label">纸板规格(mm)</div>
		<input type="text" name="hello" class="karry-input" placeholder="长" />
		<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
		<input type="text" name="hello" class="karry-input" placeholder="宽"/>
		<div class="van-field__right-icon">
			<van-icon name="question-o" />
		</div>
	</div>
</template>
<script>
	import { Icon } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
		},
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
<style type="text/css">
	.karry-cell-value{
		display: flex;
        flex-flow: wrap;
	}
	.karry-cell-value_div{
		align-self:center;
	}
	.karry-input{
		text-align:center;
		width:45%;
		outline:none;
        background:#ede9e9;
        border:none;
        -webkit-text-fill-color:#f30b0b;
	}
</style>