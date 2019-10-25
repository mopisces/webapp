<template>
	<van-popup :value="filterShow" position="right" :style="{ height: '100%', width:'80%' }" @click-overlay="filterOverlayClick" :close-on-click-overlay="false">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
				<div class="van-nav-bar__title van-ellipsis">
					筛选条件
				</div>
			</div>
			<div style="margin-top:46px;"></div>
			<slot name="filter-field-1"></slot>
			<slot name="filter-field-2"></slot>
			<slot name="filter-field-3"></slot>
			<slot name="filter-field-4"></slot>
			<slot name="filter-field-5"></slot>
			<slot name="filter-field-6"></slot>
			<slot name="filter-field-7"></slot>
			<div class="van-hairline--top-bottom van-tabbar">
				<div class="van-tabbar-item">
					<van-button type="danger" style="width:60%" @click="resetClick()">重置</van-button>
				</div>
				<div class="van-tabbar-item">
					<van-button type="primary" style="width:60%" @click="filterClick()">筛选</van-button>
				</div>
			</div>
		</van-popup>
</template>

<script>
	import { Popup, SwitchCell, Button } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[SwitchCell.name]: SwitchCell,
			[Button.name]: Button,
		},
		props:{
			filterShow:{
				type:Boolean,
				default:false,
				required:true
			}
		},
		data(){
			return {
			}
		},
		methods:{
			resetClick(){
				this.$emit('resetClick');
			},
			filterClick(){
				this.$emit('filterClick');
			},
			filterOverlayClick(){
				this.$emit('filterOverlayClick');
			},
			filterRemClick(checked){
				this.$emit('filterRemClick',{checked:checked});
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