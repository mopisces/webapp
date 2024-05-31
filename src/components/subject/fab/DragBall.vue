<template>
	<div 
		v-show="show"
		class="drag-ball" 
		ref="dragBall" 
		@touchstart.stop.prevent="touchstart" 
		@touchmove.stop.prevent="touchmove" 
		@touchend.stop.prevent="touchend"
	>
		<div class="drag-content">
			<slot name="value">{{ value }}</slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'drag-ball',
		props: {
			value: {
				type: String,
				default: '菜单'
			},
			bottomPx: {
				type: Number,
				default: 30
			},
			rightPx: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				canDrag: false,

				inset: {
					left: 0,
					top: 0
				},

				move: {},

				position: {
					left: 0,
					top: 0
				},

				positionOld: {},
				startTime: null,
				endTime: null,
				show: true
			}
		},
		methods: {
			setMenu( status ) {
				this.show = status
			},
			touchstart(e) {
				if (!this.canDrag) {
					this.startTime = e.timeStamp
					this.positionOld =  this.getPosition(this.dragBall)
					this.position = {...this.positionOld}
					this.inset = {
						left: e.targetTouches[0].clientX - this.positionOld.left,
						top: e.targetTouches[0].clientY - this.positionOld.top
					}
					this.canDrag = true
				}
			},
			touchmove(e) {
				if (this.canDrag) {
					let left = e.targetTouches[0].clientX - this.inset.left
					let top = e.targetTouches[0].clientY - this.inset.top
					if (left < 0) {
						left = 0
					} else if(left > (window.innerWidth - this.dragBall.offsetWidth)) {
						left = window.innerWidth - this.dragBall.offsetWidth
					}

					if (top < 0) {
						top = 0
					} else if (top > (window.innerHeight - this.dragBall.offsetHeight)) {
						top = window.innerHeight - this.dragBall.offsetHeight
					}

					this.dragBall.style.left = left/16 + 'rem'
					this.dragBall.style.top = top/16 + 'rem'
					this.move = {
						x: left - this.positionOld.left,
						y: top - this.positionOld.top
					}

					this.position = {left, top}
				}
			},
			touchend(e) {
				if (this.canDrag) {
					this.endTime = e.timeStamp
					if ( this.endTime - this.startTime > 400 || Math.abs(this.move.x) > 2 || Math.abs(this.move.y) > 2 ) {
						if ( (this.position.left + this.dragBall.offsetWidth / 2) > window.innerWidth / 2) {
							this.dragBall.style.left = (window.innerWidth - this.dragBall.offsetWidth)/16 + 'rem'
						} else {
							this.dragBall.style.left = 0 + 'rem'
						}
					} else {
						this.$emit('click')
					}

					this.inset = {}
					this.move = {}
					this.position = {}
					this.canDrag = false
				}
			},
			getPosition(source) {
				let left = source.offsetLeft
				let top = source.offsetTop
				let current = source.offsetParent
				while (current != null) {
					left += current.offsetLeft
					top += current.offsetTop
					current = current.offsetParent
				}
				return {
					left: left,
					top: top
				}
			}
		},
		computed: {
			dragBall() {
				return this.$refs.dragBall
			}
		}
	}
</script>

<style type="text/css" scoped>
	.drag-ball {
		position: absolute;
		z-index: 10003;
		right: 0;
		top: 70%;
		width: 3rem;
		height: 3rem;
		background: deepskyblue;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 0rem 0rem 0.625rem 0.125rem skyblue;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		user-select: none;
	}

	.drag-ball .drag-content {
		overflow-wrap: break-word;
		font-size: 1rem;
		color: #fff;
		letter-spacing: 0.125rem;
	}
</style>