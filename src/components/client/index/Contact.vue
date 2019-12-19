<template>
	<div>
		<van-field :label="item.Name" :value="item.Content" v-for="(item,index) in iconInfo" :key="index" input-align="right">
			<van-icon slot="left-icon" class-prefix="iconfont" :name="item.Icon" size="25" />
		</van-field>
	</div>
</template>
<script>
	import { Icon, Field } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Field.name]: Field,
		},
		data(){
			return {
				iconInfo:[],
				value:''
			}
		},
		methods:{
			getContact(){
				let self = this;
				this.$request.client.other.contactWay().then(res=>{
					res.result.forEach((item,index)=>{
						item.Icon = item.Icon.slice(5);
					});
					self.iconInfo = res.result;
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','联系我们');
		},
		mounted(){
			this.getContact();
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