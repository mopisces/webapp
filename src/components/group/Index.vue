<template>
	<div>
		<van-grid :column-num="2">
			<van-grid-item v-if=" boardGroupOpen " to="/group/board/lists">
				<div slot="icon" style="position:relative;">
					<div style="position:absolute;right:0;top:0;z-index:999;">
						<van-tag mark type="danger">{{ config.grid.groupBoard.tagName }}</van-tag>
					</div>
					<van-image :src="config.grid.groupBoard.img">
						<template v-slot:error>加载失败</template>
					</van-image>
				</div>
				<div slot="text" style="color:red;font-size:0.8rem;">
					{{ config.grid.groupBoard.tagName }}
				</div>
			</van-grid-item>
			<van-grid-item v-if=" boardGroupOpen " to="/group/board/flagLists">
				<div slot="icon" style="position:relative;">
					<div style="position:absolute;right:0;top:0;z-index:999;">
						<van-tag mark type="danger">{{ config.grid.groupBoardFlag.tagName }} ( {{ config.grid.groupBoardFlag.flag }} ) </van-tag>
					</div>
					<van-image :src="config.grid.groupBoardFlag.img">
						<template v-slot:error>加载失败</template>
					</van-image>
				</div>
				<div slot="text" style="color:red;font-size:0.8rem;">
					{{ config.grid.groupBoardFlag.tagName }}  ( {{ config.grid.groupBoardFlag.flag }} ) 
				</div>
			</van-grid-item>
			<van-grid-item v-if=" boxGroupOpen " to="/group/box/lists">
				<div slot="icon" style="position:relative;">
					<div style="position:absolute;right:0;top:0;z-index:999;">
						<van-tag mark type="danger">{{ config.grid.groupBox.tagName }}</van-tag>
					</div>
					<van-image :src="config.grid.groupBox.img">
						<template v-slot:error>加载失败</template>
					</van-image>
				</div>
				<div slot="text" style="color:red;font-size:0.8rem;">
					{{ config.grid.groupBox.tagName }}
				</div>
			</van-grid-item>
			<van-grid-item v-if=" boxGroupOpen " to="/group/box/flagLists">
				<div slot="icon" style="position:relative;">
					<div style="position:absolute;right:0;top:0;z-index:999;">
						<van-tag mark type="danger">{{ config.grid.groupBoxFlag.tagName }} ( {{ config.grid.groupBoxFlag.flag }} ) </van-tag>
					</div>
					<van-image :src="config.grid.groupBoxFlag.img">
						<template v-slot:error>加载失败</template>
					</van-image>
				</div>
				<div slot="text" style="color:red;font-size:0.8rem;">
					{{ config.grid.groupBoxFlag.tagName }} ( {{ config.grid.groupBoxFlag.flag }} ) 
				</div>
			</van-grid-item>
		</van-grid>
	</div>
</template>
<script>
	import { Image, Tag, Grid, GridItem } from 'vant';
	export default {
		components:{
			[Image.name]: Image,
			[Tag.name]: Tag,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
		},
		data(){
			return {
				config:{
					grid : {
						groupBoard : {
							img     : '',
							tagName : '纸板团购',
						},
						groupBoardFlag : {
							img     : '',
							tagName : '纸板团购',
							flag    : ''
						},
						groupBox : {
							img     : '',
							tagName : '淘宝箱团购'
						},
						groupBoxFlag : {
							img     : '',
							tagName : '淘宝箱团购',
							flag    : ''
						}
					},
				},
				boardGroupOpen : false,
				boxGroupOpen   : false
			}
		},
		methods:{
			getIndexConfig(){
				let self = this;
				this.$request.client.other.getIndexConfig().then(res=>{
					if( res.result.UseBoardGroup == '1' ){
						self.config.grid.groupBoard.img      = this.$store.state.common.imgUrl + res.result.BoardGroupPic;
						self.config.grid.groupBoardFlag.img  = this.$store.state.common.imgUrl + res.result.FlagBoardGroupPic;
						self.config.grid.groupBoardFlag.flag = res.result.BoardFlag;
						self.boardGroupOpen = true;
					}
					if( res.result.UseBoxGroup == '1' ){
						self.config.grid.groupBox.img      = this.$store.state.common.imgUrl  + res.result.BoxGroupPic;
						self.config.grid.groupBoxFlag.img  = this.$store.state.common.imgUrl  +  res.result.FlagBoxGroupPic;
						self.config.grid.groupBoxFlag.flag = res.result.BoxFlag;
						self.boxGroupOpen = true;
					}
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','团购页面');
			this.$store.commit('common/setType','group');
		},
		mounted(){
			this.getIndexConfig();
			this.$store.commit('common/setIndexActive','group');
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