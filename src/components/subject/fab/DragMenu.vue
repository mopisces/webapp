<template>
	<div>
		<div
			id="_drag_button"
			class="drag"
			:style="'left: ' + left + 'px; top:' + top + 'px;zIndex:'+ zIndex"
			@touchstart="touchstart"
			@touchmove.stop.prevent="touchmove"
			@touchend="touchend"
			@click.stop.prevent="click"
			:class="{transition: isDock && !isMove }"
		>
			<div class="next-cursor-point" :style="{ width: size + 'px', height: size + 'px' }">
				<div 
					v-if="popMenu && (leftBottom||rightBottom||leftTop||rightTop) && content.length > 0"
					class="next-fab"
					:style="{borderRadius: size + 'px'}"
					:class="{
						'next-fab--leftBottom': leftBottom,
						'next-fab--rightBottom': rightBottom,
						'next-fab--leftTop': leftTop,
						'next-fab--rightTop': rightTop
					}"
				>
					<div
						:class="{
							'next-fab__content--left': _horizontal === 'left',
							'next-fab__content--right': _horizontal === 'right',
							'next-fab__content--flexDirection': _direction === 'vertical',
							'next-fab__content--flexDirectionStart': flexDirectionStart,
							'next-fab__content--flexDirectionEnd': flexDirectionEnd,
						}"
						:style="{ width: boxWidth, height: boxHeight, borderRadius: size + 'px', backgroundColor: styles.backgroundColor }"
						class="next-fab__content" 
						elevation="5"
					>
						<div :style="{ width: size + 'px', height: size + 'px' }" v-if="flexDirectionStart || horizontalLeft" class="next-fab__item next-fab__item--first">
						</div>
						<div 
							v-for="(item, index) in content" 
							:key="index" 
							:class="{ 'next-fab__item--active': isShow }"
							class="next-fab__item" 
							:style="{ width: size + 'px', height: size + 'px' }"
							@click="_onItemClick(index, item)"
						>
							<div 
								class="next-fab__item-image" 
								:style="{ width: size / 2 + 'px', height: size / 2 + 'px' }"
							>
								<van-icon 
					                :name="item.iconPath" 
					                :size="size / 2"
					                color="#3c9cff"
					            />
							</div>
							<span 
								class="next-fab__item-text"
								:style="{ color: item.active ? styles.selectedColor : styles.color, fontSize: fontSize + 'px', lineHeight: fontSize + 'px' }"
							>
								{{ item.text }}
							</span>
						</div>
						<div  
							v-if="flexDirectionEnd || horizontalRight"
							:style="{ width: size + 'px', height: size  + 'px' }"
							class="next-fab__item next-fab__item--first"
						></div>
					</div>
				</div>
				<div
					class="next-fab__circle next-fab__plus" 
					:style="{ 'background-color': styles.buttonColor, width: size + 'px', height: size + 'px', borderRadius: size + 'px' }" 
					@click="_onClick"
				>
					<div class="next-fab__menu">
						<van-icon 
			                class="fab-circle-icon"
			                :class="{'next-fab__plus--active': isShow && content.length > 0}"
			                :name="styles.icon" 
			                :size="value.length > 0 ? 24:32" 
			                :color="styles.iconColor"
			            />
			            <div v-if="value.length > 0" class="next-fab__menu-value">
			            	{{value}}
			            </div>
		            </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	import { Icon } from 'vant'

	export default {
	    name: 'DragMenu',
		emits: ['fabClick', 'trigger'],
		components: {
			[Icon.name]: Icon
		},
		props: {
			zIndex: {
				type: Number,
				default: 999
			},
			isDock:{
				type: Boolean,
				default: true
			},
			isLock:{
				type: Boolean,
				default: false
			},
			pattern: {
				type: Object,
				default () {
					return {}
				}
			},
			horizontal: {
				type: String,
				default: 'right'
			},
			vertical: {
				type: String,
				default: 'bottom'
			},
			direction: {
				type: String,
				default: 'vertical'
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
			},
			size: {
				type: Number,
				default: 45
			},
			fontSize: {
				type: Number,
				default: 12
			},
			defpositon: {
				type: String,
				default: 'rb'	// lt 左上 lb 左下 rt 右上 rb右下
			},
			edge: {
				type: Number,
				default: 50
			},
			value: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				top:0,
				left:0,
				width: 0,
				height: 0,
				offsetLeft: 0,
				offsetTop: 0,
				windowWidth: 0,
				windowHeight: 0,
				isMove: true,
				isShow: false,
				_direction: '',
				_horizontal: '',
				_vertical: '',
				styles: {
					color: '#2c2c2c',
					selectedColor: '#1989fa',
					backgroundColor: '#fff',
					buttonColor: '#1989fa',
					iconColor: '#fff',
					icon: 'plus'
				}
			}
		},
		computed: {
			contentWidth(e) {
				return (this.content.length + 1) * this.size + 15 + 'px'
			},
			contentWidthMin() {
				return this.size + 'px'
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
			},
			_windowWidth: {
				get() {
					return this.windowWidth
				},
			},
			_windowHeight: {
				get() {
					return this.windowHeight
				}
			}
		},
		watch: {
			_windowWidth(nVal, oVal) {
				if (this.defpositon === 'lt') {
					this.left = this.edge
					this.top = this.edge
				} else if (this.defpositon === 'lb') {
					this.left = this.edge
					this.top = this._windowHeight - this.edge - this.height
				} else if (this.defpositon === 'rt') {
					this.top = this.edge + 100
					this.left = this._windowWidth - this.edge - this.width
				} else if (this.defpositon === 'rb') {
					this.top = this._windowHeight - this.edge - this.height
					this.left = this._windowWidth - this.edge - this.width
				}
			}
		},
		created() {
			this.isShow = this.show
			
			// 初始化样式
			this.styles = Object.assign({}, this.styles, this.pattern)
			this._direction = this.direction
			this._horizontal = this.horizontal
			this._vertical = this.vertical
			// 绑定监听
			this.$watch(() => this.pattern, (val, oldVal) => {
				this.styles = Object.assign({}, this.styles, val)
			}, {deep: true})
		},
		mounted() {
			this.handleResize()
			window.addEventListener('resize', this.handleResize)
			/*this.windowWidth = window.screen.width;
			this.windowHeight = window.screen.height;*/
			this.width = this.size
			this.height = this.size
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize)
		},
		methods: {
			handleResize() {
				this.windowWidth = window.innerWidth
				this.windowHeight = window.innerHeight
			},
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
				if (!this.isShow) {
					return
				}
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
					return this._horizontal === paramA && this._vertical === paramB
				} else if (types === 1) {
					return this._direction === paramA && this._vertical === paramB
				} else if (types === 2) {
					return this._direction === paramA && this._horizontal === paramB
				} else {
					return this.isShow && this._direction === paramA ? this.contentWidth : this.contentWidthMin
				}
			},
			click() {
				this.$emit('btnClick');
			},
			touchstart(e) {
				if (this.isLock || this.isShow) return
				this.$emit('btnTouchstart');
				this.offsetTop = e.touches[0].clientY - this.top
				this.offsetLeft = e.touches[0].clientX - this.left
			},
			touchmove(e) {
				if (this.isLock || this.isShow) return
				// 单指触摸
				if (e.touches.length !== 1) {
					return false;
				}

				this.isMove = true;
				
				this.left = e.touches[0].clientX - this.offsetLeft;
				
				this.top = e.touches[0].clientY - this.offsetTop;
		
			},
			touchend(e) {
				if (this.isLock || this.isShow) return
				if (this.isDock) {
					if (this.left < this.edge) {
						this.left = this.edge
					} else if (this.left > this.windowWidth - this.edge - this.width) {
						this.left = this.windowWidth - this.edge - this.width
					}
					if (this.top < this.edge) {
						this.top = this.edge
					}	else if (this.top > this._windowHeight - this.edge - this.height) {
						this.top = this._windowHeight - this.edge - this.height
					}
				}
				this.autoSwitchModel()
				this.isMove = false;
				
				this.$emit('btnTouchend');
			},
			autoSwitchModel () {
				const contentW = parseFloat(this.contentWidth)
				if (this._direction === 'horizontal') {
					if (this._horizontal === 'left') {
						if (contentW > this.windowWidth - this.left) {
							this._horizontal = 'right'
						}
					} else if (this._horizontal === 'right') {
						if (this.left < contentW - this.width) {
							this._horizontal = 'left'
						}
					}
				} else if (this._direction === 'vertical') {
					if (this._vertical === 'top') {
						if (this.top > this._windowHeight - contentW + this.height) {
							this._vertical = 'bottom'
						}
					} else if (this._vertical === 'bottom') {
						if (this.top < contentW - this.height) {
							this._vertical = 'top'
						}
					}
					
				}
			}
		}
	}
</script>

<style type="text/css">
	.drag {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		position: fixed;
		transform: translateZ(0); 
		transition: left .3s ease,top .3s ease;
		box-shadow: 0 1px 5px 2px rgba(102, 102, 102, 0.3);
	}

	.next-fab {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		box-shadow: 0 1px 5px 2px rgba(102, 102, 102, 0.3);
	}

	.next-cursor-point {
		position: relative;
		cursor: pointer;
	}

	.next-fab--active {
		opacity: 1;
	}

	.next-fab--leftBottom {
		left: 0;
		bottom: 0;
	}

	.next-fab--leftTop {
		left: 0;
		top: 0;
	}

	.next-fab--rightBottom {
		right: 0;
		bottom: 0;
	}

	.next-fab--rightTop {
		right: 0;
		top: 0;
	}


	.next-fab__circle {
		position: absolute; 
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #3c3e49;
		z-index: 11;
	}

	.next-fab__circle--left {
		left: 0;
	}
	
	.next-fab__circle--right {
		right: 0;
	}
	
	.next-fab__circle--top {
		top: 0;
	}
	
	.next-fab__circle--bottom {
		bottom: 0;
	}
	.next-fab__plus {
		font-weight: bold;
	}

	.fab-circle-icon {
		transform: rotate(0deg);
		transition: transform 0.3s;
		font-weight: 200;
	}

	.next-fab__plus--active {
		transform: rotate(135deg);
	}

	.next-fab__content {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		overflow: hidden;
		transition-property: width, height;
		transition-duration: 0.2s;
		border-color: #DDDDDD;
		border-width: 1px;
		border-style: solid;
	}

	.next-fab__content--left {
		justify-content: flex-start;
	}

	.next-fab__content--right {
		justify-content: flex-end;
	}

	.next-fab__content--flexDirection {
		flex-direction: column;
		justify-content: flex-end;
	}

	.next-fab__content--flexDirectionStart {
		flex-direction: column;
		justify-content: flex-start;
	}

	.next-fab__content--flexDirectionEnd {
		flex-direction: column;
		justify-content: flex-end;
	}

	.next-fab__item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.next-fab__item--active {
		opacity: 1;
	}

	.next-fab__item-image {
		width: 20px;
		height: 20px;
		margin-bottom: 4px;
	}

	.next-fab__item-text {
		color: #FFFFFF;
		margin-top: 2px;
	}

	.next-fab__menu {
		display: flex;
		flex-direction: column;
	}

	.next-fab__menu-value {
		font-size: 0.6rem;
		text-align: center;
		color: #fff;
	}
</style>