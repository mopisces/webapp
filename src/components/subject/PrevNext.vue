<template>
	<div>
		<div class="van-row van-row--flex van-row--justify-space-around" style="margin-top:10px;">
			<div class="van-col van-col--8" style="text-align:center;border: 1px solid #ddd;" @click="headerChange('prev')">
				<div style="padding-top:5px;">
				<div v-if="!config.header.prev.noData">
						<van-icon class-prefix="iconfont" size="20" name="zuojiantouxiangzuofanhuimianxing" slot="icon"  color="#1aad19"/>
						<p style="color:#1aad19">{{ config.header.prev.data }}</p>
					</div>
					<div v-else>
						<van-icon class-prefix="iconfont" size="20" name="zuojiantouxiangzuofanhuimianxing" slot="icon"  color="#ddd"/>
						<p style="color:#ddd">到顶了</p>
					</div>
				</div>
			</div>
			<div class="van-col van-col--8" style="text-align:center;border-top: 1px solid #ddd;border-bottom:1px solid #ddd;" @click="middleClick() ">
				<div style="padding-top:5px;" >
					<div v-if="!config.header.middle.noData">
						<van-icon class-prefix="iconfont" size="20" name="gouxuan4" slot="icon"  color="#1aad19"/>
						<p style="color:#1aad19">{{ config.header.middle.data }}</p>
					</div>
					<div v-else>
						<van-icon class-prefix="iconfont" size="20" name="gouxuan4" slot="icon"  color="#ddd"/>
						<p style="color:#ddd">未选择</p>
					</div>
				</div>
			</div>
			<div class="van-col van-col--8" style="text-align:center;border: 1px solid #ddd; ">
				<div style=" padding-top:5px;" @click="headerChange('next')">
					<div v-if="!config.header.next.noData">
						<van-icon class-prefix="iconfont" size="20" name="youjiantouxiangyouqianwangmianxing" slot="icon"  color="#1aad19"/>
						<p style="color:#1aad19">{{ config.header.next.data }}</p>
					</div>
					<div v-else>
						<van-icon class-prefix="iconfont" size="20" name="youjiantouxiangyouqianwangmianxing" slot="icon"  color="#ddd"/>
						<p style="color:#ddd">到底了</p>
					</div>
				</div>
			</div>
		</div>
		<van-popup  v-model="config.popup.show" position="top" :style="{ height: '100%' }">
			<div class="header" style="width:100%;position:fixed;height:46px;top:0px;text-align:center;">
				<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						筛选条件
					</div>
				</div>
			</div>
			<div class="content" style="width:100%;margin-top:46px;">
				<van-radio-group v-model="radio" v-if="config.popup.show" >
					<van-cell-group>
						<div role="button" tabindex="0"  class="van-cell van-cell--clickable" v-for="(item,index) in radioData" :key="index" @click="radioClick( item.prevNext,index )">
							<!-- 原纸收货按日期汇总 -->
							<div :class="[{ active: isActive == index }, 'van-cell__title'] "  v-if="item.RecDate">
								<span>{{ item.RecDate }}</span><br/>
								<span>{{ item.InQty }}&nbsp;件</span><br/>
								<span>{{ item.SumInWt }}&nbsp;kg</span>
							</div>
							<!-- 按门幅汇总 -->
							<div :class="[{ active: isActive == index }, 'van-cell__title'] " v-else-if="item.PaperWidth">
								<span>门幅:{{ item.PaperWidth }}</span><br/>
								<span>整卷卷数:{{ item.ZJCount }}</span><br/>
								<span>残卷卷数:{{ item.CJCount }}</span><br/>
								<span>重量:{{ item.SRWt }}</span>
							</div>
							<!-- 按纸类汇总 -->
							<div :class="[{ active: isActive == index }, 'van-cell__title'] " v-else-if="item.PaperCode">
								<span>纸类:{{ item.PaperCode }}
									<span v-if="item.PaperName">{{ '[' + item.PaperName + ']' }}</span>
								</span><br/>
								<span>整卷卷数:{{ item.ZJCount }}</span><br/>
								<span>残卷卷数:{{ item.CJCount }}</span><br/>
								<span>重量:{{ item.SRWt }}</span>
							</div>
							<!-- 原纸采购 -->
							<div :class="[{ active: isActive == index }, 'van-cell__title'] " v-if=" item.tag === 'poMain' ">
								<span>日期:{{ item.prevNext }}</span><br/>
							</div>
							<!-- 每日订单按日期汇总 -->
							<div :class="[{ active: isActive == index }, 'van-cell__title'] " v-else-if=" item.tag === 'daily' ">
								<span>{{ item.OrderDate }}</span><br/>
								<span>{{ item.ICount }}笔订单</span>
							</div>
							<van-radio slot="right-icon" :name="item.prevNext"  />
						</div>
					</van-cell-group>
				</van-radio-group>
				<div style="margin-bottom:46px;"></div>
			</div>
			<div class="footer" style="width:100%;position:fixed;height:46px;bottom:0px;">
				<van-button type="primary" size="normal"  @click="confirmClick()" style="width:100%;">确定</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Popup, RadioGroup, Radio  } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
		},
		props:['radioData'],
		data(){
			return {
				radio:'',
				config:{
					popup:{
						show: false
					},
					radio:{
						show:false
					},
					header:{
						index:0,
						prev:{
							noData:false,
							data:''
						},
						next:{
							noData:false,
							data:''
						},
						middle:{
							noData:false,
							data:''
						}
					}
				},
				isActive : 0
			}
		},
		methods:{
			controllerPrevNext(){
				let prev = Number(this.config.header.index) - 1;
				let next = Number(this.config.header.index) + 1;
				if( this.radioData[ prev ] == undefined ){
					this.config.header.prev.noData = true;
					this.config.header.prev.data = '';
				}else{
					this.config.header.prev.noData = false;
					this.config.header.prev.data = this.radioData[ prev ].prevNext;
				}
				if( this.radioData[ next ] == undefined ){
					this.config.header.next.noData = true;
					this.config.header.next.data = '';
				}else{
					this.config.header.next.noData = false;
					this.config.header.next.data = this.radioData[ next ].prevNext;
				}
				if( this.radioData[ this.config.header.index ] == undefined ){
					this.config.header.middle.noData = true;
					this.config.header.middle.data = '';
				}else{
					this.config.header.middle.noData = false;
					this.config.header.middle.data = this.radioData[ this.config.header.index ].prevNext;
				}
			},
			radioClick( value,index ){
				this.isActive = index;
				this.radio    = value;
				this.config.header.index = Number( index );
				this.controllerPrevNext();
			},
			confirmClick(){
				this.config.popup.show = false;
				this.$emit('radioConfirm',this.radio);
			},
			headerChange( type ){
				if( type == 'prev' ){
					this.config.header.index--;
					if( this.config.header.index <= 0 ){
						this.config.header.index = 0;
					}
				}
				if( type == 'next' ){
					this.config.header.index++; 
					if( this.config.header.index >= this.radioData.length ){
						this.config.header.index = this.radioData.length - 1 ;
					}
				}
				this.isActive = this.config.header.index;
				this.radio = this.radioData[ this.config.header.index ].prevNext;
				this.controllerPrevNext();
			},
			middleClick(){
				this.radio = this.radioData[ this.config.header.index ].prevNext;
				this.config.popup.show = true;
			}
		},
		mounted(){
			this.controllerPrevNext();
		},
		created(){
			if( this.radioData[0].prevNext ){
				this.radio = this.radioData[0].prevNext;
			}
		},
		computed:{
			radioChange(){
				return this.radio;
			}
		},
		watch:{
			radioChange( newV, oldV ){
				if( this.config.popup.show === false ){
					this.$emit('radioConfirm',newV);
				}
			}
		}
	}
</script>
<style>
	.active{
		color:#0bf147;
	}
</style>