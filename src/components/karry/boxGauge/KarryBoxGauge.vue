<template>
	<div class="box-gauge-container">
		<div class="box-gauge-label">{{ label }}</div>
		<div class="range-cell">
			<input class="range-date-input" v-model="len" type="number" placeholder="箱长" />
			<div>×</div>
			<input class="range-date-input" v-model="width" type="number" placeholder="箱宽" />
			<div>×</div>
			<input class="range-date-input" v-model="height" type="number" placeholder="箱高"/>
		</div>
	</div>
</template>

<script>
	export default {
		name: "KarryBoxGauge",
		props: {
			label: {
				type: String,
				default: '纸箱规格'
			},
			boxL: {
				type: String,
				default: '',
			},
			boxW: {
				type: String,
				default: '',
			},
			boxH: {
				type: String,
				default: '',
			},
		},
		computed: {
			len: {
				get(){
					return this.$props.boxL
				},
				set( value ){
					this.$emit("update:boxL", value)
				}
			},
			width: {
				get(){
					return this.$props.boxW
				},
				set( value ){
					this.$emit("update:boxW", value)
				}
			},
			height: {
				get(){
					return this.$props.boxH
				},
				set( value ){
					this.$emit("update:boxH", value)
				}
			},
		},
		data() {
			return {}
		},
	}
</script>

<style>
	.box-gauge-container {
		border: 0.0625rem solid #ebedf0;
		background: #fff;
	}

	.box-gauge-label {
		line-height: 1rem;
		font-size: 0.875rem;
		text-align: left;
		padding: 0.25rem 0rem 0.25rem 1rem;
	}

	.range-cell {
		display: flex;
		padding: 0.5rem 1rem;
		line-height: 1.3125rem;
		flex-direction: row;
	}

	.range-date-input {
		flex: 1;
		text-align: center;
		border: none;
		border-bottom: 0.0625rem solid #ebedf0;
		line-height: 1.5rem;
		width: 3.5rem;
	}
</style>