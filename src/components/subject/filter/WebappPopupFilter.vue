<template>
	<van-popup 
		v-model="show" 
		position="bottom" 
		:close-on-click-overlay="false"
		get-container="body"
		:safe-area-inset-bottom="true"
		@click-overlay="filterOverlayClick"
	>
		<div class="popup-filter-container" :style="setContainer">
			<div class="popup-filter-header">
				筛选条件
			</div>
			<div class="popup-filter-content" :style="setContent">
				<slot name="content"></slot>
			</div>
			<div class="popup-filter-foot">
				<div class="popup-filter-foot-item reset-btn" @click="resetClick()">重置</div>
				<div class="popup-filter-foot-item filter-btn" @click="filterClick()">筛选</div>
			</div>
		</div>
	</van-popup>
</template>

<script>
	import { Button, Popup } from 'vant'

	export default {
		name: 'WebappPopupFilter',
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,
		},
		props: {
			filterShow: {
				type: Boolean,
				default: false
			}
		},
		created() {

		},
		data() {

		},
		computed: {
			show: {
				get() {
					return this.$props.filterShow
				},
				set( val ) {
					this.$emit("update:filterShow", val)
				}
			},
			setContainer() {
				let clientWidth = document.documentElement.clientWidth
				let clientHeight = document.documentElement.clientHeight
				return 'height:' + clientHeight*0.8/16 + 'rem; width: ' + clientWidth/16 + 'rem;'
			},
			setContent() {
				let clientWidth = document.documentElement.clientWidth
				let clientHeight = document.documentElement.clientHeight
				return 'height:' + (clientHeight*0.8/16 - 6) + 'rem; width: ' + clientWidth/16 + 'rem;'
			}
		},
		methods: {
			resetClick(){
				this.$emit('reset')
				this.show = false
			},
			filterClick(){
				this.$emit('filter')
				this.filterOverlayClick()
			},
			filterOverlayClick(){
				this.show = false
			}
		}
	}
</script>
<style type="text/css">
	.popup-filter-container {
        position: relative;
	}

	.popup-filter-header {
		padding: 0.5rem 0rem;
		font-size: 1rem;
		font-weight: 500;
		line-height: 2rem;
		position: absolute;
		top: 0;
		width: 100%;
		text-align: center;

	}

	.popup-filter-content {
		overflow-y: auto;
		position: absolute;
		top: 3rem;
		background: #f1f1f1;
	}

	.popup-filter-foot {
		padding: 0.5rem 0rem;
		line-height: 2rem;
		padding: 0.5rem 0rem;
		position: absolute;
		bottom: 0;
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-filter-foot-item {
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
        border-radius: 2.5rem;
	}

	.reset-btn {
		background: #f56c6c;
	}

	.filter-btn {
		background-color: #5ac725;
	}
</style>