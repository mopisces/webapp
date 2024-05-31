<!-- 客户报价查询 -->
<template>
	<div :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<van-cell-group>
			<van-cell 
				is-link 
				v-for="(item,index) in config.indexList" 
				:key="index" 
				:title="item.cusShortName + '(' + item.cusId + ')'" 
				@click="detail(item)"
			/>
		</van-cell-group>
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>	
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="formData.cusId"></cus-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	import { Cell, CellGroup, SwitchCell } from "vant"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { fetchList } from "@/api/staff/customer.js"

	export default {
		components: {
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[SwitchCell.name]: SwitchCell,

			PopupFilter,
			CusPicker,
			DragMenu
		},
		data() {
			return {
				/*配置信息*/
				config: {
					filter: {
						show: false
					},
					switch: {
						checked: false
					},
					//数据
					indexList: []
				},
				/*筛选条件*/
				formData: {
					/*数据类型 10->客户报价查询客户列表*/
					dataType: 10,
					cusId: ''
				}
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '报价查询')
			if( getStorage('quo/CustomerQuo') !== null ) {
				let storageData = JSON.parse( getStorage('quo/CustomerQuo') )
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
			}
			await this.fetchData()
		},
		async mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
			await this.$store.commit('staff/setBackPath','/staff/index/menu')
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			beforeunloadHandler() {
				if( this.config.switch.checked ) {
					setStorage('quo/CustomerQuo', this.formData)
				} else {
					removeStorage('quo/CustomerQuo')
				}
			},
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*详情点击*/
			detail( row ) {
				this.$store.commit('staff/setBackPath', '/staff/quo/customerQuo')
				this.$router.push({
					path: '/staff/quo/quoDetail',
					query: {
						cusId: row.cusId,
						cusShortName: row.cusShortName,
						stateType: 1
					}
				})
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.fetchData()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			}
		}
	}
</script>