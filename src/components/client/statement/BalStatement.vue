<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="header-container">
				<div class="header-list" >
					<div class="header-list-item header-item-btn" @click="config.filter.show=true">
						<div class="header-item-btn-text">
							筛选
						</div>
					</div>
				</div>
			</div>		
		</van-sticky>
		<van-cell-group>
			<div 
				v-for="(item, idx) in config.indexList" 
				:key="idx"
			>
				<van-cell
				 	:title="item.title" 
				 	:label="item.OPDate" 
				 	@click="rowClick(item)"
				>
					<div class="default-list" slot="default">
						<div class="default-list-item default-text">
							{{item.RealAmt}}
						</div>
						<div class="default-list-item">
							{{item.CurLeftMinAmt}}
						</div>
					</div>
				</van-cell>
				<div class="cell-extra">
					{{ item.Reamark }}
				</div>
			</div>
		</van-cell-group>
		<!-- 筛选 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="config.filter.time.maxDate"
					:minDate.sync="config.filter.time.minDate"
				></time-range-picker>
				<van-cell>
					<van-checkbox slot="icon" v-model="formData.opType" shape="square">隐藏回签</van-checkbox>
				</van-cell>
				<van-switch-cell v-model="config.filter.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<!-- 订单信息 -->
		<van-dialog 
			v-model="config.dialog.show" 
			title="订单信息"
			:before-close="beforeClose"
		>
			<van-cell-group>
				<van-field label="操作类型" :value="rowData.AmtOpType" readonly />
				<van-field label="信息" :value="rowData.OpKey" readonly />
				<van-field 
					v-model="rowData.Reamark"
					rows="3"
					autosize
					label="变化原因"
					type="textarea"
					readonly
				/>
			</van-cell-group>
		</van-dialog>
	</div>
</template>
<script>
	import { Button, Cell, Icon, CellGroup, Checkbox, Field, SwitchCell, Dialog, Sticky } from 'vant';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Checkbox.name]: Checkbox,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Sticky.name]: Sticky,

			//NewTimePicker,
			PopupFilter,

			TimeRangePicker
		},
		data(){
			return {
				/*配置*/
				config: {
					/*列表数据*/
					indexList: [],
					/*筛选条件*/
					filter: {
						show: false,
						/*时间组件*/
						time: {
							show: false,
							maxDate: null,
							minDate: null,
						},
						/*是否记录*/
						switch: {
							checked: false
						}
					},
					/*详细信息*/
					dialog: {
						show: false
					}
				},
				/*筛选条件*/
				formData: {
					beginDate: null,
					endDate: null,
					opType: true
				},
				/*弹窗信息*/
				rowData: {
					AmtOpType: null,
					OpKey: null,
					Reamark: null,
				}
			}
		},
		methods:{
			/*获取参数*/
			async getConfig( isInit = true ){
				const { result } = await getWebConfig({paramType: 'clientFrec'})
				this.config.filter.time.maxDate = result.maxDate
				this.config.filter.time.minDate = result.minDate
				if( isInit ){
					this.formData.beginDate = result.beginDate
					this.formData.endDate = result.endDate
				}
				await this.queryList()
			},
			queryList(){
				this.config.indexList = this.$options.data().config.indexList
				let postData = {
					beginDate: this.formData.beginDate,
					endDate: this.formData.endDate,
					opType: this.formData.opType ? 1:0
				}
				this.$request.client.statement.fetchBalStatementList(postData).then((res)=>{
					if( res.errorCode == '00000' ){
						this.config.indexList = res.result
					}
				})
			},
			/*筛选点击重置*/
			resetClick(){
				this.getConfig(true)
			},
			/*筛选点击*/
			filterClick(){
				this.queryList()
			},
			/*列表点击*/
			rowClick(item){
				Object.assign(this.rowData, item)
				this.config.dialog.show = true
			},
			/*弹窗关闭触发*/
			beforeClose( action, done ){
				this.rowData = this.$options.data().rowData
				done()
			},
			beforeunloadHandler(){
				console.log(this.config.filter.switch.checked)
				if( this.config.filter.switch.checked ){
					setStorage('client-statement/bal',this.formData);
				}else{
					removeStorage('client-statement/bal');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','客户信用余额明细')
			if( getStorage('client-statement/bal') !== null ){
				let storageData = JSON.parse(getStorage('client-statement/bal'))
				this.formData = storageData
				this.config.filter.switch.checked = true
				this.getConfig(false)
			}else{
				this.getConfig(true)
			}
		},
		mounted(){
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style type="text/css">
	.header-container{
		padding-bottom: 0.2rem;
		width: 100%;
		height: 3.625rem;
		background-color: #f1f1f1; 
	}
	.header-list{
		width: 100%;
	    height: 3.1875rem;
	    box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    background-color: #fff;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    padding: 0.1rem;
	}
	.header-list-item{
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
	}
	.list-item-name{
		font-size:0.8rem;
		padding-bottom: 0.2rem;
	}
	.list-item-text{
		font-size: 1rem; 
	}

	.header-item-btn {
		height: 2.9875rem;
		background: linear-gradient(45deg, #f1f1f1, #556270);
		box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	}

	.header-item-btn-text {
		line-height: 2.9875rem;
		font-size: 1rem;
	}

	.default-list {
		display: flex;
		flex-direction: column;
		height: 45px;
	}

	.default-list-item {
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: right;
	}

	.default-text {
		color: #000;
		font-weight: bold;
	}

	.cell-extra {
		height: 1.3rem;
		padding-right: 1rem;
		padding-left: 1rem;
		padding-bottom: 0.2rem;
		line-height: 1rem;
		font-size: 0.75rem;
		border-bottom: 0.1rem solid gray; 
	}

</style>