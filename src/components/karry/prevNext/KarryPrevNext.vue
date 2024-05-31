<template>
	<div class="prev-next-container">
		<div class="prev-next-header-box">
			<div class="prev-next-item" @click="headerChange('prev')">
				<van-icon 
					class-prefix="iconfont" 
					size="20" 
					name="zuojiantouxiangzuofanhuimianxing" 
					:color=" !config.header.prev.noData?'#1aad19': '#ddd'"
				/>
				<div class="prev-next-box-text-box">
					{{ !config.header.prev.noData?config.header.prev.data:'到顶了' }}
				</div>
			</div>
			<div class="prev-next-top-middle prev-next-item" @click="middleClick()">
				<van-icon 
					class-prefix="iconfont" 
					size="20" 
					name="gouxuan4" 
					:color="!config.header.middle.noData?'#1aad19':'#ddd'"
				/>
				<div 
					class="prev-next-box-text-box" 
					:class="!config.header.middle.noData?'prev-next-actived-color':'prev-next-no-actived-color'"
				>
					{{ !config.header.middle.noData?config.header.middle.data:'未选择' }}
				</div>
			</div>
			<div class="prev-next-item" @click="headerChange('next')">
				<van-icon 
					class-prefix="iconfont" 
					size="20" 
					name="youjiantouxiangyouqianwangmianxing" 
					:color="!config.header.next.noData?'#1aad19':'#ddd'"
				/>
				<div class="prev-next-box-text-box">
					{{ !config.header.next.noData?config.header.next.data:'到底了' }}
				</div>
			</div>
		</div>
		<van-popup  
			v-model="config.popup.show" 
			:round="true"
			:style="{ height: '75%', width: '95%' }"
		>
			<div class="prev-next-popup-content">
				<van-radio-group v-model="selected">
					<van-cell-group>
						<van-cell
							is-link
							:style="isActive == index?'background-color:#f1f1f1':''"
							v-for="(item,index) in radioData" 
							:key="index" 
							@click="radioClick( item.prevNext, index )"
						>
							<template slot="title">
								<div :class="[{ 'prev-next-actived-color': isActive == index }, 'van-cell__title']">
									<!-- 原纸收货按日期汇总 -->
									<span v-if="dataType=='poIn'">
										<span>{{ item.recDate }}</span><br/>
										<span>{{ item.inQty }}&nbsp;件</span><br/>
										<span>{{ item.sumInWt }}&nbsp;kg</span>
									</span>
									<!-- 按门幅汇总 -->
									<span v-if="dataType=='paperWidth'">
										<span>门幅:{{ item.paperWidth }}</span><br/>
										<span>整卷卷数:{{ item.zjCount }}</span><br/>
										<span>残卷卷数:{{ item.cjCount }}</span><br/>
										<span>重量:{{ item.srwt }}</span>
									</span>
									<!-- 按纸类汇总 -->
									<span v-if="dataType=='paperCode'">
										<span>纸类:{{ item.paperCode }}
											<span v-if="item.paperName">{{ '[' + item.paperName + ']' }}</span>
										</span><br/>
										<span>整卷卷数:{{ item.zjCount }}</span><br/>
										<span>残卷卷数:{{ item.cjCount }}</span><br/>
										<span>重量:{{ item.srwt }}</span>
									</span>
									<!-- 原纸日用量 -->
									<span v-if="dataType=='dailyUsed'">
										<span>{{ item.outDate }}</span><br/>
										<span>整卷卷数:{{ item.zjCount }}</span><br/>
										<span>残卷卷数:{{ item.cjCount }}</span><br/>
										<span>重量:{{ item.srwt }}</span>
									</span>
									<!-- 原纸采购 -->
									<span v-if="dataType=='poMain'">
										<span>日期:{{ item.prevNext }}</span><br/>
									</span>
									<!-- 每日订单按日期汇总 -->
									<span v-if="dataType=='dailyOrd'"  class="prev-next-radio-text">
										<div>{{ item.orderDate }}</div>
										<div>{{ item.iCount }}笔订单</div>
									</span>
									<!-- 每日送货按日期汇总 -->
									<div v-if="dataType=='deliDaily'" class="prev-next-radio-text">
										<div>{{ item.dnDate }}</div>
										<div>{{ item.iCount }}笔订单</div>
									</div>
								</div>
							</template>
							<van-radio slot="right-icon" :name="item.prevNext"  />
						</van-cell>
					</van-cell-group>
				</van-radio-group>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Cell, CellGroup, Icon, Popup, RadioGroup, Radio  } from "vant"
	export default {
		name: "KarryPrevNext",
		components:{
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			dataType: {
				type: String,
				default: ''
			}
		},
		data(){
			return {
				/*配置*/
				config:{
					popup:{
						show: false
					},
					/*头部配置*/
					header: {
						index: 0,
						prev: {
							noData: false,
							data: ''
						},
						next: {
							noData: false,
							data: ''
						},
						middle: {
							noData: false,
							data: ''
						}
					}
				},
				/*被选中项的index*/
				isActive: 0,
				/*单选数据列表*/
				radioData: [],
			}
		},
		computed:{
			selected: {
				get() {
					return this.$props.value
				},
				set(nVal) {
					this.$emit("update:value", nVal)
				}
			}
		},
		methods:{
			controllerPrevNext() {
				let prev = Number(this.config.header.index) - 1
				let next = Number(this.config.header.index) + 1
				if( this.radioData[ prev ] == undefined ){
					this.config.header.prev.noData = true
					this.config.header.prev.data = ''
				}else{
					this.config.header.prev.noData = false
					this.config.header.prev.data = this.radioData[ prev ].prevNext
				}
				if( this.radioData[ next ] == undefined ){
					this.config.header.next.noData = true
					this.config.header.next.data = ''
				}else{
					this.config.header.next.noData = false
					this.config.header.next.data = this.radioData[ next ].prevNext
				}
				if( this.radioData[ this.config.header.index ] == undefined ){
					this.config.header.middle.noData = true
					this.config.header.middle.data = ''
				}else{
					this.config.header.middle.noData = false
					this.config.header.middle.data = this.radioData[ this.config.header.index ].prevNext
				}
			},
			async radioClick( value,index ){
				this.isActive = index
				this.selected = value
				this.config.header.index = Number( index )
				await this.controllerPrevNext()
				this.config.popup.show = false
			},
			async headerChange( type ){
				if( type == 'prev' ){
					this.config.header.index--
					if( this.config.header.index <= 0 ){
						this.config.header.index = 0
					}
				}
				if( type == 'next' ){
					this.config.header.index++;
					if( this.config.header.index >= this.radioData.length ){
						this.config.header.index = this.radioData.length - 1 
					}
				}
				this.isActive = this.config.header.index
				this.selected = this.radioData[ this.config.header.index ].prevNext
				await this.controllerPrevNext()
			},
			middleClick(){
				this.selected = this.radioData[ this.config.header.index ].prevNext
				this.config.popup.show = true
			},
			async complete( radioData ) {
				this.config = this.$options.data().config
				this.isActive = this.$options.data().isActive

				if( radioData.length == 0 ){
					this.selected = null
					this.radioData = radioData
				}else{
					this.selected = radioData[0].prevNext
					this.radioData = radioData
					await this.controllerPrevNext()
				}
			}
		},
		
	}
</script>
<style>
	.prev-next-container {
		font-size: 0.75rem;
		background-color: #f1f1f1;
	}
	
	.prev-next-header-box {
		height: 3.75rem;
		box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    background-color: #fff;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    padding: 0.1rem;
	}

	.prev-next-item {
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
	}
	
	.prev-next-top-middle {
		text-align: center;
		border-left: 0.0625rem solid #ddd;
		border-right: 0.0625rem solid #ddd;
	}

	.prev-next-box-text-box {
		color: #1aad19;
		line-height: 1rem;
	}
	
	.prev-next-popup-header {
		width: 100%;
		position: fixed;
		height: 2.875rem;
		top: 0rem;
		text-align: center;
		line-height: 2.875rem;
		font-size: 1.5rem;
	}

	.prev-next-popup-content {
		width: 100%;
	}

	.prev-next-radio-text {
		flex: 1;
    	display: flex;
    	flex-direction: column;
		align-items: left;
		font-size: 0.75rem;
		line-height: 1.5rem;
	}

	.prev-next-no-actived-color {
		color: #ddd;
	}

	.prev-next-actived-color {
		color: #1aad19;
	}
</style>