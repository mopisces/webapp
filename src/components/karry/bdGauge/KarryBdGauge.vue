<template>
	<div class="bd-gauge-container">
		<div class="bd-gauge-label">{{ label }}</div>
		<div class="range-cell">
			<input class="bd-gauge-input" v-model="len" type="number" placeholder="板长" />
			<div>×</div>
			<input class="bd-gauge-input" v-model="width" type="number" placeholder="板宽" />
		</div>
	</div>
</template>

<script>
	export default {
		name: "KarryBoxGauge",
		props: {
			label: {
				type: String,
				default: '纸板规格'
			},
			bdL: {
				type: String,
				default: '',
			},
			bdW: {
				type: String,
				default: '',
			}
		},
		computed: {
			len: {
				get(){
					return this.$props.bdL
				},
				set( value ){
					this.$emit("update:bdL", value)
				}
			},
			width: {
				get(){
					return this.$props.bdW
				},
				set( value ){
					this.$emit("update:bdW", value)
				}
			}
		},
		data() {
			return {}
		},
	}
</script>

<style>
	.bd-gauge-container {
		border: 0.0625rem solid #ebedf0;
		background: #fff;
	}

	.bd-gauge-label {
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

	.bd-gauge-input {
		flex: 1;
		text-align: center;
		border: none;
		border-bottom: 0.0625rem solid #ebedf0;
		line-height: 1.5rem;
		width: 3.5rem;
	}
</style>