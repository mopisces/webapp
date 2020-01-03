<template>
	<div>
		<van-cell-group title="公共参数">
			<van-switch-cell v-model="formData.Wap1Right" title="用户权限" />
		</van-cell-group>
	</div>
</template>
<script>
	import { Button, CellGroup, Field, SwitchCell, Dialog } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
		},
		data(){
			return {
				formData : {
					Wap1Right : '',
				}
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('admin/setHeaderTitle','内部参数修改');
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