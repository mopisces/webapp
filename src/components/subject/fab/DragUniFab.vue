<template>
    <div
        @touchstart.stop.prevent="handleTouchstart"
        @touchmove.stop.prevent="handleTouchmove"
        @touchend.stop.prevent="handleTouchend"
        class="uni-cursor-point"
        :style="dragStyle"
    >
        <div v-if="popMenu && horizontal && vertical && content.length > 0" class="uni-cursor-point uni-fab">
            <div
                v-bind:class="[
                    !isAndroidNvue ? 'uni-fab__content--other-platform' : '',
                    horizontal === 'left' ? 'uni-fab__content--left' : 'uni-fab__content--right',
                    vertical === 'top' && direction === 'horizontal' ? 'uni-fab__content--horizontal-top' : '',
                    vertical === 'bottom' && direction === 'horizontal' ? 'uni-fab__content--horizontal-bottom' : '',
                    vertical === 'top' && direction === 'vertical' ? 'uni-fab__content--vertical-top' : '',
                    vertical === 'bottom' && direction === 'vertical' ? 'uni-fab__content--vertical-bottom' : ''  
                ]"
                :style="{
                    width: boxWidth,
                    height: boxHeight,
                    backgroundColor: styles.backgroundColor,
                }"
                class="uni-fab__content"
                elevation="5"
            >
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
            </div>
        </div>
        <div class="uni-fab__circle uni-fab__plus" :style="styleTest" @click="_onClick">
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

import { Icon } from 'vant'

let platform = 'android'

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
 * @property {Array} content 展开菜单内容配置项 ，增加content配置项中增加"shareButton",使其可分享到微信好友
 * @property {Boolean} popMenu 是否使用弹出菜单
 * @property {Boolean} origin 拖动完成后是否自动回到原点
 * @property {Boolean} drag 是否开启按钮拖动
 * @event {Function} trigger 展开菜单点击事件，返回点击信息
 * @event {Function} fabClick 悬浮按钮点击事件
 */
export default {
    name: 'UniFabDrag',
    emits: ['fabClick', 'trigger'],
    components: {
        [Icon.name]: Icon
    },
    props: {
        pattern: {
            type: Object,
            default() {
                return {}
            },
        },
        horizontal: {
            type: String,
            default: 'left',
        },
        vertical: {
            type: String,
            default: 'top',
        },
        direction: {
            type: String,
            default: 'vertical',
        },
        content: {
            type: Array,
            default() {
                return []
            },
        },
        show: {
            type: Boolean,
            default: false,
        },
        popMenu: {
            type: Boolean,
            default: true,
        },
        origin: {
            type: Boolean,
            default: false,
        },
        drag: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            fabShow: false,
            isShow: false,
            isAndroidNvue: platform === 'android',
            startPosition: null,
            currentDrayDistance: { x: 0, y: 0 },
            totalDragPosition: { x: 0.9375, y: 1.875 },
            styles: {
                color: '#3c3e49',
                selectedColor: '#007AFF',
                backgroundColor: '#fff',
                buttonColor: '#007AFF',
                iconColor: '#fff',
                icon: 'plusempty',
            },
        }
    },
    computed: {
        dragStyle() {
            let numX,
                numY
            numX = Number(this.totalDragPosition.x) + Number(this.currentDrayDistance.x)
            numY = Number(this.totalDragPosition.y) + Number(this.currentDrayDistance.y)
            return this.horizontal + ': calc(' + numX + 'rem + var(--window-left));' 
                    + this.vertical+': calc(' + numY + 'rem + var(--window-top));'
            
        },
        styleTest() {
            return this.horizontal + ':0;' + this.vertical + '0;background-color:' + this.styles.buttonColor
        },
        // 动态计算宽度
        boxWidth() {
            if (this.direction === 'vertical' || !this.isShow) return '3.4375rem'
            return ((this.content.length + 1) * 55 + 15)/16 + 'rem'
        },
        // 动态计算高度
        boxHeight() {
            if (this.direction !== 'vertical' || !this.isShow) return '3.4375rem'
            return ((this.content.length + 1) * 55 + 15)/16 + 'rem'
        }
    },
    watch: {
        pattern: {
            handler(val, oldVal) {
                this.styles = Object.assign({}, this.styles, val)
            },
            deep: true,
        },
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
        /** 处理手指触摸开始事件 */
        handleTouchstart(event) {
            if (!this.drag) {
                return
            }
            this.startPosition = event.touches[0]
            // 记录一些数据
        },
        /** 处理手指触摸后移动 */
        handleTouchmove(event) {
            if (!this.drag) {
                return
            }
            const { pageX: currentX, pageY: currentY } = event.touches[0]
            const { pageX: startX, pageY: startY } = this.startPosition
            //更新组件
            this.currentDrayDistance.x = this.horizontal === 'left' ? (currentX - startX)/16 : (startX - currentX)/16
            this.currentDrayDistance.y = this.vertical === 'top' ? (currentY - startY)/16 : (startY - currentY)/16
        },

        /** 处理手指松开事件 */
       handleTouchend(event) {
            if (!this.drag) {
                return
            }
            if (!this.origin) {
                this.totalDragPosition.x += this.currentDrayDistance.x
                this.totalDragPosition.y += this.currentDrayDistance.y
            }
            this.currentDrayDistance.x = 0
            this.currentDrayDistance.y = 0
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
            if (item.type !== 'shareButton') {
                this.$emit('trigger', {
                    index,
                    item,
                })
                this.close()
            }
        },
    },
}
</script>



<style>
    :root {
        --window-left: 2.5rem;
        --window-bottom: 2rem;
        --window-top: 2rem;
        --window-right: 2.5rem;
    }

    .uni-fab {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 120;
        border-radius: 2.8125rem;
        box-shadow: 0 0.0625rem 0.3125rem 0.125rem rgba(255, 255, 255, 0.3);
    }

    .uni-cursor-point {
        z-index: 100;
        position: fixed;
        cursor: pointer;

    }

    .uni-fab--active {
        opacity: 1;
    }

    .uni-fab__circle {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.4375rem;
        height: 3.4375rem;
        background-color: #3c3e49;
        border-radius: 2.8125rem;
        z-index: 110;
    }

    .uni-fab__circle--left-bottom {
        left: calc(0.9375rem + var(--window-left));
        bottom: calc(3.875rem + var(--window-bottom));
    }

    .uni-fab__circle--left-top {
        left: calc(0.9375rem + var(--window-left));
        top: calc(3.875rem + var(--window-top));
    }

    .uni-fab__circle--right-bottom {
        right: calc(0.9375rem + var(--window-right));
        bottom: calc(3.125rem + var(--window-bottom));
    }

    .uni-fab__circle--right-top {
        right: calc(0.9375rem + var(--window-right));
        top: calc(3.125rem + var(--window-top));
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
        border-radius: 3.4375rem;
        overflow: hidden;
        transition-property: width, height;
        transition-duration: 0.2s;
        width: 3.4375rem;
        border: 0.0625rem solid #dddddd;
    }

    .uni-fab__content--other-platform {
        border-width: 0rem;
        box-shadow: 0 0.0625rem 0.3125rem 0.125rem rgba(255, 255, 255, 0.3);
    }

    .uni-fab__content--left {
        justify-content: flex-start;
        padding: 0 0 0 3.4375rem;
    }

    .uni-fab__content--right {
        justify-content: flex-end;
        padding: 0 3.4375rem 0 0;
    }

    .uni-fab__content--vertical-top {
        flex-direction: column;
        justify-content: flex-start;
        padding: 3.4375rem 0 0 0;
    }

    .uni-fab__content--vertical-bottom {
        flex-direction: column;
        justify-content: flex-end;
        padding: 0 0 3.4375rem 0;
    }

    /* .uni-fab__content--horizontal-top {
        flex-direction: row;
        justify-content: flex-start;
        padding: 0 0 0 0;
    } */

    .uni-fab__content--horizontal-bottom {
        flex-direction: row;
        justify-content: flex-end;
        padding: 0 0 0 0;
    }

    .uni-fab__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 3.4375rem;
        height: 3.4375rem;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .uni-fab__item--active {
        opacity: 1;
    }

    .uni-fab__item-image {
        width: 1.25rem;
        height: 1.25rem;
        margin-bottom: 0.25rem;;
    }

    .uni-fab__item-text {
        color: #FFFFFF;
        font-size: 0.75rem;
        line-height: 0.75rem;
        margin-top: 0.125rem;
    }

    .no-scroll {
        overflow: hidden;
    }
</style>