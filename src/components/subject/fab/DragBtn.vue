<!-- 可拖拽的小球 封装 -->
<template>
	<div
		ref="floatButton"
		class="backHome"
		@click="goCreatePage"
		:style="{
			width: itemWidth + 'px',
			height: itemHeight + 'px',
			left: left + 'px',
			top: top + 'px',
		}"
	>
		<div class="drag-btn-circle drag-btn-plus" style="background-color:#007AFF;">
            <van-icon 
                class="fab-circle-icon" 
                name="plus" 
                size="32" 
                color="#fff"
                :class="{'drag-btn-plus--active': isShow && content.length > 0}"
            />
        </div>
	</div>
</template>
 
<script>
import { Icon } from 'vant'

export default {
	name: 'BackHome',
	components: {
        [Icon.name]: Icon
    },
	props: {
		itemWidth: {
			// 悬浮按钮宽度
			type: Number,
			default: 55,
		},
		itemHeight: {
			// 悬浮按钮高度
			type: Number,
			default: 55,
		},
		gapWidth: {
			// 距离左右两边距离
			type: Number,
			default: 10,
		},
		coefficientHeight: {
			// 从上到下距离比例
			type: Number,
			default: 0.72,
		},
	},
	data() {
		return {
			top: 0,
			left: 0,
			currentTop: 0,
			clientWidth: 0,
			clientHeight: 0,
			timer: null,
		};
	},
	created() {
		this.clientWidth = document.documentElement.clientWidth; // 手机宽度
		this.clientHeight = document.documentElement.clientHeight;
		this.left = this.clientWidth - this.itemWidth - this.gapWidth;
		this.top = this.clientHeight * this.coefficientHeight;
	},
	mounted() {
		this.$nextTick(() => {
			const floatButton = this.$refs.floatButton;
			floatButton.addEventListener('touchstart', () => {
				floatButton.style.transition = 'none';
			});
			// 在拖拽过程中，组件应该跟随手指的移动而移动
			floatButton.addEventListener('touchmove', (e) => {
				if (e.targetTouches.length === 1) {
					// 一根手指
					let touch = e.targetTouches[0];
					this.left = touch.clientX - 20;
					this.top = touch.clientY - 25;
				}
			});
			// 拖拽结束后，重新调整组件的位置并重新设置过渡动画
			floatButton.addEventListener('touchend', () => {
				floatButton.style.transition = 'all 0.3s';
				if (this.left > document.documentElement.clientWidth / 2) {
					this.left =
						this.clientWidth - this.itemWidth - this.gapWidth;
				} else {
					this.left = 10;
				}
			});
		});
	},
	methods: {
		// 返回首页菜单
		goCreatePage() {
			this.$emit('goManage');
		},
	},
};
</script>
 
<style>
	.backHome {
		position: fixed;
		z-index: 999;
	}

	.drag-btn-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        background-color: #3c3e49;
        border-radius: 2.5rem;
        z-index: 110;
    }

    .drag-btn-plus--active {
        transform: rotate(135deg);
    }
    .drag-btn-plus {
        font-weight: bold;
    }
</style>