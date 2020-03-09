<template>
	<div class="van-cell van-field">
		<div class="van-cell__title" >
			<span>{{ label }}</span>
		</div>
		<div class="van-cell__value">
			<div class="van-field__body">
				<input :placeholder="placeholder" v-model="values" :maxlength="maxlength" :type=" type "  :readonly="readonly" :class="[readonly=='readonly'?'field-readonly van-field__control--center':'van-field__control van-field__control--center']" id="fieldValue"/>
			</div>
		</div>
	</div>
</template>
<script>
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		props:['label','placeholder','value','maxlength','type','readonly','rows','onFocus'],
		data(){
			return {
				values  : this.value,
				isFocus : this.onFocus
			}
		},
		methods:{
			
		},
		created(){
			
		},
		mounted(){
			
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			value(newV,oldV){
				this.values = newV;
			},
			values(newV,oldV){
				this.$emit("update:value", newV);
			},
			onFocus(newV,oldV){
				this.isFocus = newV;
				if( newV ){
					document.getElementById('fieldValue').focus();
				}
			},
			isFocus(newV,oldV){
				this.$emit("update:onFocus", newV);
			}
		}
	}
</script>

