<template>
    <div class="cell" :style="{padding:padding}" :class="{'cell-clickable':clickable || isLink}" @click="onClick">
        <div class="cell-title" :style="{width:labelWidth?labelWidth:''}">
            <span v-html="title"></span>
        </div>
        <div class="cell-value">
           <slot>
               <span style="display: block;text-align: center;" :style="{color:!value?'#999':'inherit','padding-right':help?'5px':'0'}">
                   {{value?value:placeholder}}
               </span>
           </slot>
        </div>
        <slot name="right-icon"></slot>
        <i class="cell-right-icon" :class="{'arrow-left-icon':isLink}" :style="{'padding-right':help?'5px':'0'}">
            <svg @click.stop="$emit('icon-click')" v-if="help" t="1524312955582" fill="#1aad19" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2159" width="18" height="18">
                <path d="M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z"                  p-id="2160"></path>            <path d="M533.078812 691.418556C551.918022 691.418556 567.190219 706.673952 567.190219 725.511386L567.190219 734.541728C567.190219 753.370677 552.049365 768.634558 533.078812 768.634558L533.078812 768.634558C514.239601 768.634558 498.967405 753.379162 498.967405 734.541728L498.967405 725.511386C498.967405 706.682436 514.108258 691.418556 533.078812 691.418556L533.078812 691.418556ZM374.634146 418.654985C374.634146 418.654985 377.308518 442.210609 403.631972 442.210609 429.955424 442.210609 431.511799 418.654985 431.511799 418.654985 429.767552 342.380653 465.107535 306.162338 537.45591 309.760186 585.612324 315.19693 610.562654 342.380653 612.231066 391.391309 608.894242 413.21824 590.617557 441.441342 558.083539 475.90071 515.008196 519.47462 493.470524 558.49126 493.470524 592.950626L493.470524 628.289468C493.470524 628.289468 496.775846 649.365867 520.582206 649.365867 544.388565 649.365867 547.693888 628.289468 547.693888 628.289468L547.693888 603.744164C547.693888 574.961397 568.321517 540.342125 609.652612 500.28611 652.879629 460.469948 674.341463 424.091729 674.341463 391.391309 670.777131 300.725594 623.530758 253.473886 532.223166 249.796087 427.189099 248.037141 374.634146 304.323439 374.634146 418.654985Z" p-id="2161"></path>
            </svg>
        </i>
    </div>
</template>

<script>
	export default {
        props: {
            title: String,
            placeholder: String,
            value: [String, Number],
            isLink: Boolean,
            help: Boolean,
            clickable: Boolean,
            padding: String,
            labelWidth: String
        },
		methods: {
            onClick: function () {
                this.$emit('click');
            }
		}
	}
</script>

<style>
    .cell-group {
        background-color: #fff;
    }
    .cell-group .cell-flex-rows {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
    }
    .cell-group .cell-flex-rows .cell {
        flex: 50%;
    }
    .cell-group .cell-flex-rows .cell:nth-child(even)::after {
        left: 0;
    }
    .cell-group .cell::after {
        content: '';
        height: 1px;
        background-color: #c8c7cc;
        transform: scaleY(0.3);
        position: absolute;
        bottom: 0;
        left: 8px;
        right: 0;
    }
    .cell-group .cell:last-child::after {
        left: 0;
    }
    .cell-group .cell {
        width: 100%;
        line-height: 24px;
        background-color: #fff;
        color: #333;
        font-size: 14px;
        padding: 10px 15px;
        box-sizing: border-box;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        overflow: hidden;
        position: relative;
    }
    .cell-group.mini .cell {
        padding: 8px 15px;
    }
    .cell-group .cell.cell-clickable:active {
        background-color: #e8e8e8;
    }
    .cell-group .cell .cell-title {
        width: 105px;
    }
    .cell-group .cell .cell-value {
        -webkit-box-flex: 1;
        text-align: center;
        vertical-align: middle;
        word-break: break-all;
        flex: 1;
    }
    .cell-group .cell .cell-value .slot input {
        width: 60px;
        height: 23px;
        text-align: center;
        outline: none;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .cell-group .cell .cell-value .slot input:focus {
        border-color: #1aad19;
    }
    .cell-group .cell .cell-right-icon {
        cursor: pointer;
        position: relative;
        top: 3px;
    }
    .cell-group .cell .cell-right-icon.arrow-left-icon {
        content: ' ';
        display: inline-block;
        height: 6px;
        width: 6px;
        border-width: 1.5px 1.5px 0 0;
        border-color: #c8c8cd;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        margin-top: -4px;
        position: absolute;
        top: 50%;
        right: 15px;
    }
    .cell-group .field .field-control {
        padding: 0 5px;
        display: block;
        width: 100%;
        resize: none;
        border: 0;
        box-sizing: border-box;
        border-radius: 2px;
    }
    .cell-group .field .field-control:focus {
        background-color: #f1f1f1;
    }
    .cell-group .field .field-control:disabled {
        opacity: 1;
        color: #666 !important;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    .cell-group .field .cell-value {
        position: relative;
    }
    .cell-group .field .cell-value input,
    .cell-group .field .cell-value textarea {
        font: inherit;
        color: #000 !important;
        word-break: break-all;
    }
    .cell-group .cell-flex-rows .cell .cell-title {
        width: 80px;
    }
    .cell-group .cell-flex-rows .cell .cell-value input.rows-item {
        padding: 0 10px;
        height: 28px;
        line-height: 28px;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    .cell-group .cell-flex-rows .cell .cell-value input.rows-item:focus {
        border-color: #1aad19;
    }
    .cell-group .field .cell-value input::-webkit-input-placeholder,
    .cell-group .field .cell-value textarea::-webkit-input-placeholder {
        color: #b3b3b3;
    }
    .cell-group .field .cell-value input:-moz-placeholder,
    .cell-group .field .cell-value textarea:-moz-placeholder {
        color: #b3b3b3;
    }
    .cell-group .field .cell-value input::-moz-placeholder,
    .cell-group .field .cell-value textarea::-moz-placeholder {
        color: #b3b3b3;
    }
    .cell-group .field .cell-value input:-ms-input-placeholder,
    .cell-group .field .cell-value textarea:-ms-input-placeholder {
        color: #b3b3b3;
    }
</style>
