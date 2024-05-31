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
		<copy-right></copy-right>
	</div>
</template>
<script>
	import { Image, Tag, Grid, GridItem } from 'vant';
	import CopyRight from '@/components/subject/footer/CopyRight';

	/*后台地址*/
	import { backStageUrl } from '@/config/domain.js'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Image.name]: Image,
			[Tag.name]: Tag,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,

			CopyRight
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
			async getIndexConfig(){
				const { result } = await getWebConfig({paramType: 'clientIndex'})
				if( result.UseBoardGroup == 1 ) {
					this.config.grid.groupBoard.img = backStageUrl + '/upload/' + result.BoardGroupPic
					this.config.grid.groupBoardFlag.img = backStageUrl + '/upload/' + result.FlagBoardGroupPic
					this.config.grid.groupBoardFlag.flag = result.BoardFlag
					this.boardGroupOpen = true
				}
				if( result.UseBoxGroup == 1 ) {
					this.config.grid.groupBox.img = backStageUrl + '/upload/' + result.BoxGroupPic
					this.config.grid.groupBoxFlag.img = backStageUrl + '/upload/' + result.FlagBoxGroupPic
					this.config.grid.groupBoxFlag.flag = result.BoxFlag
					this.boxGroupOpen = true
				}
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