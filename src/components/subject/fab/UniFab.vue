<template>
	<div class="uni-cursor-point">
		<div v-if="popMenu && (leftBottom||rightBottom||leftTop||rightTop) && content.length > 0" :class="{
        'uni-fab--leftBottom': leftBottom,
        'uni-fab--rightBottom': rightBottom,
        'uni-fab--leftTop': leftTop,
        'uni-fab--rightTop': rightTop
      }" class="uni-fab">
			<div :class="{
          'uni-fab__content--left': horizontal === 'left',
          'uni-fab__content--right': horizontal === 'right',
          'uni-fab__content--flexDirection': direction === 'vertical',
          'uni-fab__content--flexDirectionStart': flexDirectionStart,
          'uni-fab__content--flexDirectionEnd': flexDirectionEnd,
		  'uni-fab__content--other-platform': !isAndroidNvue
        }" :style="{ width: boxWidth, height: boxHeight, backgroundColor: styles.backgroundColor }"
				class="uni-fab__content" elevation="5">
				<div v-if="flexDirectionStart || horizontalLeft" class="uni-fab__item uni-fab__item--first"></div>
				<div 
					v-for="(item, index) in content" 
					:key="index" 
					:class="{ 'uni-fab__item--active': isShow }"
					class="uni-fab__item" 
					@click="_onItemClick(index, item)"
				>
					<div class="uni-fab__item-image">
						<van-icon 
							:name="item.icon" 
							size="1.25rem"
							color="#3c9cff" 
						/>
					</div>
					<span 
						class="uni-fab__item-text"
						:style="{ color: item.active ? styles.selectedColor : styles.color }"
					>
						{{ item.text }}
					</span>
				</div>
				<div v-if="flexDirectionEnd || horizontalRight" class="uni-fab__item uni-fab__item--first" />
			</div>
		</div>
		<div :class="{
		  'uni-fab__circle--leftBottom': leftBottom,
		  'uni-fab__circle--rightBottom': rightBottom,
		  'uni-fab__circle--leftTop': leftTop,
		  'uni-fab__circle--rightTop': rightTop,
		  'uni-fab__content--other-platform': !isAndroidNvue
		}" class="uni-fab__circle uni-fab__plus" :style="{ 'background-color': styles.buttonColor }" @click="_onClick">
			<van-icon 
				class="fab-circle-icon" 
				name="plus" 
				size="32" 
				:color="styles.iconColor"
				:class="{'uni-fab__plus--active': isShow && content.length > 0}"
			/>
		</div>
	</div>
</template>

<script>
	import { Icon, Image as VanImage } from 'vant';
	let platform = 'android'
	// #ifdef APP-NVUE
	//platform = uni.getSystemInfoSync().platform
	// #endif

	/**
	 * Fab 悬浮按钮
	 * @description 点击可展开一个图形按钮菜单
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=144
	 * @property {Object} pattern 可选样式配置项
	 * @property {Object} horizontal = [left | right] 水平对齐方式
	 * 	@value left 左对齐
	 * 	@value right 右对齐
	 * @property {Object} vertical = [bottom | top] 垂直对齐方式
	 * 	@value bottom 下对齐
	 * 	@value top 上对齐
	 * @property {Object} direction = [horizontal | vertical] 展开菜单显示方式
	 * 	@value horizontal 水平显示
	 * 	@value vertical 垂直显示
	 * @property {Array} content 展开菜单内容配置项
	 * @property {Boolean} popMenu 是否使用弹出菜单
	 * @event {Function} trigger 展开菜单点击事件，返回点击信息
	 * @event {Function} fabClick 悬浮按钮点击事件
	 */
	export default {
		name: 'UniFab',
		emits: ['fabClick', 'trigger'],
		components: {
			[Icon.name]: Icon,
			[VanImage.name]: VanImage
		},
		props: {
			pattern: {
				type: Object,
				default () {
					return {}
				}
			},
			horizontal: {
				type: String,
				default: 'left'
			},
			vertical: {
				type: String,
				default: 'bottom'
			},
			direction: {
				type: String,
				default: 'horizontal'
			},
			content: {
				type: Array,
				default () {
					return []
				}
			},
			show: {
				type: Boolean,
				default: false
			},
			popMenu: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				fabShow: false,
				isShow: false,
				isAndroidNvue: platform === 'android',
				styles: {
					color: '#3c3e49',
					selectedColor: '#007AFF',
					backgroundColor: '#fff',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				}
			}
		},
		computed: {
			contentWidth(e) {
				return ((this.content.length + 1) * 50 + 15)/16 + 'rem'
			},
			contentWidthMin() {
				return '3.125rem'
			},
			// 动态计算宽度
			boxWidth() {
				return this.getPosition(3, 'horizontal')
			},
			// 动态计算高度
			boxHeight() {
				return this.getPosition(3, 'vertical')
			},
			// 计算左下位置
			leftBottom() {
				return this.getPosition(0, 'left', 'bottom')
			},
			// 计算右下位置
			rightBottom() {
				return this.getPosition(0, 'right', 'bottom')
			},
			// 计算左上位置
			leftTop() {
				return this.getPosition(0, 'left', 'top')
			},
			rightTop() {
				return this.getPosition(0, 'right', 'top')
			},
			flexDirectionStart() {
				return this.getPosition(1, 'vertical', 'top')
			},
			flexDirectionEnd() {
				return this.getPosition(1, 'vertical', 'bottom')
			},
			horizontalLeft() {
				return this.getPosition(2, 'horizontal', 'left')
			},
			horizontalRight() {
				return this.getPosition(2, 'horizontal', 'right')
			}
		},
		watch: {
			pattern: {
				handler(val, oldVal) {
					this.styles = Object.assign({}, this.styles, val)
				},
				deep: true
			}
		},
		created() {
			this.isShow = this.show
			if (this.top === 0) {
				this.fabShow = true
			}
			// 初始化样式
			this.styles = Object.assign({}, this.styles, this.pattern)
		},
		methods: {
			_onClick() {
				this.$emit('fabClick')
				if (!this.popMenu) {
					return
				}
				this.isShow = !this.isShow
			},
			open() {
				this.isShow = true
			},
			close() {
				this.isShow = false
			},
			/**
			 * 按钮点击事件
			 */
			_onItemClick(index, item) {
				this.$emit('trigger', {
					index,
					item
				})
				this.close()
			},
			/**
			 * 获取 位置信息
			 */
			getPosition(types, paramA, paramB) {
				if (types === 0) {
					return this.horizontal === paramA && this.vertical === paramB
				} else if (types === 1) {
					return this.direction === paramA && this.vertical === paramB
				} else if (types === 2) {
					return this.direction === paramA && this.horizontal === paramB
				} else {
					return this.isShow && this.direction === paramA ? this.contentWidth : this.contentWidthMin
				}
			}
		}
	}
</script>

<style >
	.uni-fab {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
		border-radius: 2.8125rem;
		box-shadow: 0 0.0625rem 0.3125rem 0.125rem rgba(255, 255, 255, 0.3);
	}

	.uni-cursor-point {
		cursor: pointer;
	}

	.uni-fab--active {
		opacity: 1;
	}

	.uni-fab--leftBottom {
		left: 0.9375rem;
		bottom: 1.875rem;
		/* #ifdef H5 */
		left: 1.875rem;;
		bottom: 2.875rem;
		/* #endif */
	}

	.uni-fab--leftTop {
		left: 0.9375rem;
		top: 1.875rem;
	}

	.uni-fab--rightBottom {
		right: 0.9375rem;
		bottom: 1.875rem;
	}

	.uni-fab--rightTop {
		right: 0.9375rem;
		top: 3.875rem;
	}

	.uni-fab__circle {
		position: fixed;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		width: 3.125rem;
		height: 3.125rem;
		background-color: #3c3e49;
		border-radius: 2.8125rem;
		z-index: 101;
	}

	.uni-fab__circle--leftBottom {
		left: 0.9375rem;
		bottom: 1.875rem;
		
	}

	.uni-fab__circle--leftTop {
		left: 0.9375rem;
		top: 1.875rem;
	}

	.uni-fab__circle--rightBottom {
		right: 0.9375rem;
		bottom: 1.875rem;
	}

	.uni-fab__circle--rightTop {
		right: 0.9375rem;
		top: 3.875rem;
	}

	.uni-fab__circle--left {
		left: 0;
	}

	.uni-fab__circle--right {
		right: 0;
	}

	.uni-fab__circle--top {
		top: 0;
	}

	.uni-fab__circle--bottom {
		bottom: 0;
	}

	.uni-fab__plus {
		font-weight: bold;
	}

	.fab-circle-icon {
		transform: rotate(0deg);
		transition: transform 0.3s;
		font-weight: 200;
	}

	.uni-fab__plus--active {
		transform: rotate(135deg);
	}

	.uni-fab__content {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		border-radius: 3.125rem;
		overflow: hidden;
		transition-property: width, height;
		transition-duration: 0.2s;
		width: 3.125rem;
		border-color: #DDDDDD;
		border-width: 0.0625rem;
		border-style: solid;
	}

	.uni-fab__content--other-platform {
		border-width: 0rem;
		box-shadow: 0 0.0625rem 0.3125rem 0.125rem rgba(255, 255, 255, 0.3);
	}

	.uni-fab__content--left {
		justify-content: flex-start;
	}

	.uni-fab__content--right {
		justify-content: flex-end;
	}

	.uni-fab__content--flexDirection {
		flex-direction: column;
		justify-content: flex-end;
	}

	.uni-fab__content--flexDirectionStart {
		flex-direction: column;
		justify-content: flex-start;
	}

	.uni-fab__content--flexDirectionEnd {
		flex-direction: column;
		justify-content: flex-end;
	}

	.uni-fab__item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 3.125rem;
		height: 3.125rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.uni-fab__item--active {
		opacity: 1;
	}

	.uni-fab__item-image {
		width: 1.25rem;
		height: 1.25rem;
		margin-bottom: 0.25rem;
	}

	.uni-fab__item-text {
		color: #FFFFFF;
		font-size: 0.75rem;
		line-height: 0.75rem;
		margin-top: 0.125rem;
	}

	.uni-fab__item--first {
		width: 3.125rem;
	}
</style>
