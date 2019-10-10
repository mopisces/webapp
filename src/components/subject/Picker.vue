<template>
    <div class="master-picker">
    <div class="mask" @click="close" v-if="show"></div>
    <transition name="fade">
        <div class="area_ctrl" v-if="show">
                <div class="area_btn_box">
                        <div class="area_btn larea_cancel" @click="clear">清空</div>
                        <div class="slot-center">
                                <slot></slot>
                            </div>
                        <div class="area_btn larea_finish" @click="confirm">确定</div>
                    </div>
                <div class="area_roll_mask">
                        <div class="area_roll">
                                <div class="loading" v-if="loading">
                                        <div>
                                                <svg class="svg" width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#1aad19">
                                                        <g fill="none" fill-rule="evenodd">
                                                                <g transform="translate(1 1)" stroke-width="3">
                                                                        <circle stroke-opacity="0.3" cx="18" cy="18" r="18"/>
                                                                        <path d="M36 18c0-9.94-8.06-18-18-18">
                                                                                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.6s" repeatCount="indefinite"/>
                                                                            </path>
                                                                    </g>
                                                            </g>
                                                    </svg>

                                            </div>
                                    </div>
                                <div>
                                        <div top="0" ref="province" class="gear area_province" data-areatype="area_province" data-type="provs" :data-len="pData1.length" val="5" @touchstart="gearTouchStart" @touchmove="gearTouchMove" @touchend="gearTouchEnd">
                                                <div v-if="connection" class="tooth" v-for="(v,k) in pData1" :key="k">
                                                        <div class="row">
                                                                <span>{{v.value}}</span>
                                                                <span>{{v.text}}</span>
                                                            </div>
                                                    </div>
                                                <div v-if="!connection" class="tooth" v-for="(v,k) in pData1" :key="k">
                                                        <div>{{v.text}}</div>
                                                    </div>
                                            </div>
                                        <div class="area_grid" v-if="!noData">
                                            </div>
                                        <div class="no-data" v-else>暂无数据</div>
                                    </div>
                                <div v-if="selectData.columns > 1">
                                        <div class="gear area_city" top="0" ref="city" data-areatype="area_city" data-type="city" :data-len="pData2.length" @touchstart="gearTouchStart" @touchmove="gearTouchMove" @touchend="gearTouchEnd" val="5">
                                                <div class="tooth" v-for="(v,k) in pData2" :key="k">{{v.text}}</div>
                                            </div>
                                        <div class="area_grid"></div>
                                    </div>
                                <div v-if="selectData.columns > 2">
                                        <div class="gear area_county" top="0" ref="county" data-areatype="area_county" :data-len="pData3.length" @touchstart="gearTouchStart" @touchmove="gearTouchMove" @touchend="gearTouchEnd" val="5">
                                                <div class="tooth" v-for="(v,k) in pData3" :key="k">{{v.text}}</div>
                                            </div>
                                        <div class="area_grid"></div>
                                    </div>
                            </div>
                    </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            connection: Boolean,
            show: {
                type: Boolean,
                default: false,
            },
            selectData: {
                type: Object,
                default: {},
            },
            loading: Boolean,
            noData: Boolean,
        },
        data: function() {
            return {
                pData1: [],
                pData2: [],
                pData3: [],
                selects: {
                    select1: '',
                    select2: '',
                    select3: '',
                },
                toothHeight: 0,
            };
        },
        methods: {
            clear: function(e) {
                this.$emit('clear');
                e.preventDefault();
            },
            confirm: function(e) {
                this.$emit('confirm', this.selects);
                e.preventDefault();
            },
            close: function(){
                this.$emit('close', this.selects);
                this.$emit('update:show', false);
            },
            gearTouchStart: function(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains('gear')) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                clearInterval(target['int_' + target.id]);
                target['old_' + target.id] = e.targetTouches[0].screenY;
                target['o_t_' + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target['o_d_' + target.id] = parseFloat(top.replace(/em/g, ''));
                } else {
                    target['o_d_' + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            },
            gearTouchMove: function(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains('gear')) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                target['new_' + target.id] = e.targetTouches[0].screenY;
                target['n_t_' + target.id] = (new Date()).getTime();
                var f = (target['new_' + target.id] - target['old_' + target.id]) * 30 / window.innerHeight;
                target['pos_' + target.id] = target['o_d_' + target.id] + f;
                target.style['-webkit-transform'] = 'translate3d(0,' + target['pos_' + target.id] + 'em,0)';
                target.setAttribute('top', target['pos_' + target.id] + 'em');
                if (e.targetTouches[0].screenY < 1) {
                    this.gearTouchEnd(e);
                }
            },
            gearTouchEnd: function(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains('gear')) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target['new_' + target.id] - target['old_' + target.id]) / (target['n_t_' + target.id] - target['o_t_' + target.id]);
                if (Math.abs(flag) <= 0.2) {
                    target['spd_' + target.id] = (
                        flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target['spd_' + target.id] = (
                            flag < 0 ? -0.16 : 0.16);
                    } else {
                        target['spd_' + target.id] = flag / 2;
                    }
                }
                if (!target['pos_' + target.id]) {
                    target['pos_' + target.id] = 0;
                }
                this.rollGear(target);
            },
            rollGear: function(target) {
                var _this = this;
                var d = 0;
                var stopGear = false;
                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                clearInterval(target['int_' + target.id]);
                target['int_' + target.id] = setInterval(function() {
                    var pos = target['pos_' + target.id];
                    var speed = target['spd_' + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {

                    } else {
                        var b = Math.round(pos / 2) * 2;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    var minTop = -(target.dataset.len - 1) * 2;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        var gearVal = Math.abs(pos) / 2;
                        _this.setGear(target, gearVal);
                        clearInterval(target['int_' + target.id]);
                    }
                    target['pos_' + target.id] = pos;
                    target.style['-webkit-transform'] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            },
            setGear: function(target, val) {
                var _self = this;
                var endVal = Math.round(val);
                var type = target.getAttribute('data-type');
                if (!this.selectData.link) {
                    if (type === 'provs') {
                        _self.selects.select1 = _self.pData1[endVal];
                    } else if (type === 'city') {
                        _self.selects.select2 = _self.pData2[endVal];
                    } else {
                        _self.selects.select3 = _self.pData3[endVal];
                    }
                } else {
                    if (type === 'provs') {
                        _self.selects.select1 = _self.pData1[endVal];
                        _self.resetData2(endVal);
                        if (this.selectData.columns === 3) {
                            _self.resetData3(0);
                        }
                    } else if (type === 'city' && this.selectData.columns === 2) {
                        this.selects.select2 = this.pData2[endVal];
                    } else if (type === 'city' && this.selectData.columns === 3) {
                        _self.resetData3(endVal);
                        this.selects.select2 = this.pData2[endVal];
                    } else if (this.selectData.columns === 3) {
                        this.selects.select3 = this.pData3[endVal];
                    }
                }
            },
            setTop: function(defaultData) {
                this.$nextTick(function() {
                    var province = this.$refs.province;
                    var city = this.$refs.city;
                    var county = this.$refs.county;
                    var pos1 = 0;
                    var pos2 = 0;
                    var pos3 = 0;
                    if (defaultData[0] && defaultData[0].value) {
                        this.selects.select1 = defaultData[0];
                        for (var i = 0, len = this.pData1.length; i < len; i++) {
                            if (this.pData1[i].value == defaultData[0].value) {
                                pos1 = -(i * 2);
                                break;
                            }
                        }
                        province.style.transform = province.style['-webkit-transform'] = 'translate3d(0,' + pos1 + 'em,0)';
                        province.setAttribute('top', pos1 + 'em');
                    }
                    if (defaultData[1] && defaultData[1].value) {
                        for (var i = 0, len = this.pData2.length; i < len; i++) {
                            if (this.pData2[i].value == defaultData[1].value) {
                                pos2 = -(i * 2);
                                break;
                            }
                        }
                        this.selects.select2 = defaultData[1];
                        city.setAttribute('top', pos2 + 'em');
                        city.style['-webkit-transform'] = 'translate3d(0,' + pos2 + 'em,0)';
                    }
                    if (defaultData[2] && defaultData[2].value) {
                        for (var i = 0, len = this.pData3.length; i < len; i++) {
                            if (this.pData3[i].value == defaultData[2].value) {
                                pos3 = -(i * 2);
                                break;
                            }
                        }
                        this.selects.select3 = defaultData[2];
                        county.setAttribute('top', pos3 + 'em');
                        county.style['-webkit-transform'] = 'translate3d(0,' + pos3 + 'em,0)';
                    }
                });
            },
            resetData2: function(endVal) {
                this.$nextTick(function() {
                    var city = this.$refs.city;
                    if (this.pData1[endVal] && this.selectData.pData2[this.pData1[endVal].value]) {
                        this.pData2 = this.selectData.pData2[this.pData1[endVal].value];
                    } else {
                        this.pData2 = [];
                    }
                    this.selects.select2 = this.pData2[0];
                    city.setAttribute('top', 0);
                    city.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
                });
            },
            resetData3: function(endVal) {
                this.$nextTick(function() {
                    var county = this.$refs.county;
                    if (this.pData2.length > 0 && this.pData2[endVal]) {
                        this.pData3 = this.selectData.pData3[this.pData2[endVal].value];
                    } else {
                        this.pData3 = [];
                    }
                    this.selects.select3 = this.pData3[0];
                    county.setAttribute('top', 0);
                    county.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
                });
            },
            init: function() {
                if (!this.selectData.link) {
                    this.pData1 = this.selectData.pData1;
                    this.pData2 = this.selectData.pData2;
                    this.pData3 = this.selectData.pData3;
                } else {
                    this.pData1 = this.selectData.pData1;
                    this.pData2 = this.selectData.pData2[this.pData1[0].value];
                    if (this.selectData.columns === 3) {
                        this.pData3 = this.selectData.pData3[this.pData2[0].value];
                    }
                }
                if (this.selectData.columns === 1) {
                    this.selects.select1 = this.pData1[0];
                } else if (this.selectData.columns === 2) {
                    this.selects.select1 = this.pData1[0];
                    this.selects.select2 = this.pData2[0];
                } else if (this.selectData.columns === 3) {
                    this.selects.select1 = this.pData1[0];
                    this.selects.select2 = this.pData2[0];
                    this.selects.select3 = this.pData3[0];
                }
            },
        },
        created: function () {
            this.init();
        },
        watch: {
            selectData: {
                handler: function () {
                    var _this = this;
                    setTimeout(function () {
                        if(_this.$refs.province){
                            _this.$refs.province.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
                        }
                    },0);
                    _this.init();
                },
                deep: true,
            },
            show: function(val) {
                val && this.setTop(this.selectData.default || []);
            },
        }
    }
</script>

<style>
    .master-picker {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10010;
    }
    .master-picker .area_ctrl {
        font-size: 12px;
        vertical-align: middle;
        background-color: #fcfcfc;
        color: #000;
        margin: 0;
        height: auto;
        width: 100%;
        overflow: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 9901;
    }
    .master-picker .area_roll {
        width: 100%;
        height: auto;
        overflow: hidden;
        background-color: transparent;
        -webkit-mask: -webkit-gradient(linear, 0% 50%, 0% 100%, from(#debb47), to(rgba(36, 142, 36, 0)));
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: relative;
    }
    .master-picker .area_roll > div {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        font-size: 16px;
        color: #333;
        height: 232px;
        float: left;
        background-color: transparent;
        overflow: hidden;
        position: relative;
    }
    .master-picker .area_roll .loading {
        width: 100%;
        height: 100%;
        text-align: center;
        background-color: #fff;
        position: absolute;
        z-index: 10010;
    }
    .master-picker .area_roll .loading > div {
        text-align: center;
        width: 100%;
        transform: translateY(-50%);
        font-size: 14px;
        position: absolute;
        top: 50%;
    }
    .master-picker .area_roll .loading span {
        display: block;
    }
    .master-picker .area_roll > div .gear {
        width: 100%;
        margin-top: 100px;
        float: left;
        position: absolute;
        z-index: 9902;
    }
    .master-picker .area_roll_mask {
        padding: 0;
        -webkit-mask: -webkit-gradient(linear, 0% 40%, 0% 0%, from(#debb47), to(rgba(36, 142, 36, 0)));
    }
    .master-picker .area_grid {
        width: 100%;
        height: 32px;
        margin: 0;
        box-sizing: border-box;
        background-color: #ececec;
        background-image: -webkit-linear-gradient(top, #d0d0d0, #d0d0d0, transparent, transparent), -webkit-linear-gradient(bottom, #d0d0d0, #d0d0d0, transparent, transparent);
        background-image: linear-gradient(to bottom, #d0d0d0, #d0d0d0, transparent, transparent), linear-gradient(to top, #d0d0d0, #d0d0d0, transparent, transparent);
        background-position: top, bottom;
        background-size: 100% 1px;
        background-repeat: no-repeat;
        position: relative;
        top: 100px;
        z-index: 0;
    }
    .master-picker .no-data {
        text-align: center;
        width: 100%;
        position: relative;
        top: 100px;
    }
    .master-picker .area_roll > div:nth-child(3) .area_grid > div {
        left: 42%;
    }
    .master-picker .area_btn {
        font-size: 15px;
        line-height: 44px;
        text-align: center;
    }
    .master-picker .area_btn.larea_cancel {
        padding-left: 15px;
        color: #828282;
    }
    .master-picker .area_btn.larea_finish {
        padding-right: 15px;
        color: #1aad19;
    }
    .master-picker .area_btn_box:before,
    .master-picker .area_btn_box:after {
        content: '';
        height: 1px;
        width: 100%;
        display: block;
        background-color: #d9d9d9;
        transform: scaleY(0.33);
        position: absolute;
        z-index: 15;
    }
    .master-picker .area_btn_box {
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: stretch;
        -webkit-align-items: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        background-color: #fbf9fe;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: relative;
    }
    .master-picker .area_btn_box .slot-center {
        flex: 1;
        line-height: 44px;
        text-align: center;
    }
    .master-picker .area_btn_box .slot-center .keyword {
        width: 80%;
        height: 26px;
        display: inline-block;
        outline: none;
        padding-left: 3px;
        border: none;
        color: #333;
        text-align: center;
    }
    .master-picker .area_btn_box:before {
        transform-origin: 50% 20%;
        left: 0;
        top: 0;
    }
    .master-picker .area_btn_box:after {
        transform-origin: 50% 70%;
        left: 0;
        bottom: 0;
    }
    .master-picker .tooth {
        height: 32px;
        line-height: 32px;
        text-align: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        overflow: hidden;
        justify-content: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }
    .master-picker .tooth .row {
        padding: 0 25px;
        display: flex;
    }
    .master-picker .tooth .row > span {
        flex: 1;
        vertical-align: middle;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
    }
    .master-picker .mask {
        transition: opacity 0.3s;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9900;
    }
    .master-picker .fade-enter-active,
    .master-picker .fade-leave-active {
        transition: 0.3s;
    }
    .master-picker .fade-enter,
    .master-picker .fade-leave-to {
        transform: translate3d(0, 100%, 0);
    }
</style>
