<template>
	<div>
		<div style="width:100%;height:0.0625rem;"></div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
		</van-sticky>
		<van-cell-group>
			<van-cell is-link :title="item.CusShortName + '(' + item.CusId + ')'" v-for="(item,index) in cellInfo" :key="index" @click="cellClick(item)"/>
		</van-cell-group>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick" id="popup-filter">
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="filterForm.cusName"></cus-picker>
				<van-switch-cell v-model="config.switch.rem.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, SwitchCell, Sticky  } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			CusPicker,
			PopupFilter,
		},
		data(){
			return {
				config:{
					popup:{
						rightFilter:{
							show :false,
						},
						timeFilter:{
							isFinishLoad:false
						}
					},
					switch:{
						rem:{
							checked : false
						}
					}
				},
				cellInfo:[],
				filterForm:{
					cusName : ''
				},
			}
		},
		methods:{
			cellClick(item){
				let str  = JSON.stringify(Object.assign({},item));
				setStorage('quo/CustomerQuo/info',str);
				this.$router.push('/staff/quo/quoDetail');
			},
			fetchCustomer(){
				let self = this;
				self.cellInfo = [];
				this.$request.staff.quo.getCustomer( this.filterForm.cusName ).then(res=>{
					self.cellInfo = res.result
				});
			},
			resetClick(){
				this.filterForm = {
					cusName:''
				};
				this.$refs.cusPicker.cusPickerClean();
				removeStorage('quo/CustomerQuo');
				this.config.switch.rem.checked = false;
			},
			filterClick(){
				this.config.popup.rightFilter.show = false;
				this.fetchCustomer();
			},
			beforeunloadHandler(){
				if( this.config.switch.rem.checked ){
					setStorage('quo/CustomerQuo',this.filterForm);
				}else{
					removeStorage('quo/CustomerQuo');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','报价查询');
			removeStorage('quo/CustomerQuo/info');
			if( getStorage('quo/CustomerQuo') !== null   ){
				let storageData = JSON.parse( getStorage('quo/CustomerQuo') );
				this.filterForm = storageData;
				this.config.switch.rem.checked = true;
			}
		},
		mounted(){
			this.fetchCustomer()	
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
			this.$store.commit('staff/setBackPath','/staff/index/menu');
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>