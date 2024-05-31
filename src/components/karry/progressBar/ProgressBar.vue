<template>
	<div class="sku-oper-area">
		<div class="sku-oper-icon-box buy-icon"></div>
		<div class="visible-wrapper" threshold="0">
			<div class="sku-progress-bar-wrapper">
				<div class="sku-progress-bar-bg"></div>
				<div class="sku-progress-bar-fill-stripe" :style="'width: ' + per + '%;'">
					<div class="sku-progress-bar-fill-mask"></div>
				</div>
			</div>
		</div>
		<div class="progress-bar-right-text">已抢{{ per }}%</div>
	</div>
</template>

<script>
	export default {
		name: "ProgressBar",
		props: {
			percent: {
				type: String,
				default: 0
			},
		},
		data() {
			return {}
		},
		computed: {
			per: {
				get() {
					return Number(this.$props.percent)
				}
			}
		},
	}
</script>

<style type="text/css">
	.sku-oper-area {
	    width: 13rem;
		height: 2rem;
		margin-top: 0.125rem;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding-left: 0.5rem;
		position: relative;
	}

	.sku-oper-icon-box {
		background: url(https://img11.360buyimg.com/imagetools/jfs/t1/171791/29/41214/10374/64e87b37Fbf547106/e446a5e5e4e75350.png) no-repeat;
    	background-size: 100%;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		-webkit-box-pack: end;
		-webkit-justify-content: flex-end;
		justify-content: flex-end;
	}

	.sku-wrapper .sku-oper-area {
		background: url(https://img11.360buyimg.com/imagetools/jfs/t1/171791/29/41214/10374/64e87b37Fbf547106/e446a5e5e4e75350.png) no-repeat;
    	background-size: 100%;
	}

	.sku-wrapper .sku-oper-area {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		-webkit-box-pack: end;
		-webkit-justify-content: flex-end;
		justify-content: flex-end;
	}

	.sku-progress-bar-wrapper {
		width: 5rem;
		height: 0.5625rem;
		position: relative;
		border-radius: 0.4375rem;
		overflow: hidden;
	}
	.sku-progress-bar-wrapper .sku-progress-bar-bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		border-radius: 0.4375rem;
		background: rgba(248,49,76,0.2);
		opacity: 40;
	}

	.sku-progress-bar-wrapper .sku-progress-bar-fill-stripe {
	    position: absolute;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    width: 0;
	    height: 100%;
	    background: -webkit-gradient(linear, left top, right top, from(#ff2600), to(#ff165f));
	    background: -webkit-linear-gradient(left, #ff2600 0%, #ff165f 100%);
	    background: linear-gradient(90deg, #ff2600 0%, #ff165f 100%);
	    border-radius: 0.4375rem;
	    -webkit-transition: width 600ms ease-in-out;
	    transition: width 600ms ease-in-out;
	}

	.sku-progress-bar-wrapper .sku-progress-bar-fill-mask {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		border-radius: 0.4375rem;
		background: url(https://img12.360buyimg.com/imagetools/jfs/t1/209776/16/38022/635/64ae7a52F25d3571d/6a76fb014302cc74.png);
		background-size: cover;
	}

	.sku-wrapper .sku-oper-area {
	    margin-left: 0.1875rem;
	    font-size: 0.6875rem;
	    color: #ff0031;
	    z-index: 0;
	}

	.progress-bar-right-text {
		margin-left: 0.1875rem;
	    font-size: 0.6875rem;
	    color: #ff0031;
	    z-index: 0;
	}

	.ihub-floor * {
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
		-webkit-font-smoothing: antialiased;
		font-family: PingFang SC, Helvetica Neue, sans-serif;
		-webkit-user-select: none;
		user-select: none;
		line-height: normal;
	}
</style>