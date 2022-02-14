<template>
	<div>
		<van-field v-model="value" input-align="center" clickable readonly :label="fieldConfig.label" :placeholder="fieldConfig.placeholder" @click=" show = true ">
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
			<van-picker ref="lineInfo" :columns="columns" @change="onChange" @confirm="onConfirm" @cancel="cancel" show-toolbar ></van-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon, Popup, Field, Picker } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Picker.name]: Picker,
		},
		props:[ 'lineInfo', 'calcDefault' ],
		data(){
			return {
				show:false,
				fieldConfig:{
					placeholder:'请选择压线压型',
					label:'压线压型'
				},
				value: this.calcDefault.edgeType + '-' + this.calcDefault.name,
			}
		},
		methods:{
			confirmClick(){
				this.show = false;
			},
			onChange( picker, values){
				picker.setColumnValues(1, this.lineInfo[values[0]]);
			},
			onConfirm(data){
				this.value = data[0] + '-' + data[1];
				this.$emit('buildCalc', data );
				this.show = false;
			},
			cancel(){
				this.$refs.lineInfo.setColumnValue(0,'净片');
				this.$refs.lineInfo.setColumnValues(1, this.lineInfo['净片']);
				this.$refs.lineInfo.setColumnValue(1,this.calcDefault.name);
				this.value = '净片-' + this.calcDefault.name;
			}
		},
		created(){
			console.log(this.columns)
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			columns(){
				return [
					{
						values:Object.keys(this.lineInfo),
						defaultIndex: this.calcDefault.edgeType == '毛片' ? 1 : 0
					},
					{
						values:this.lineInfo[this.calcDefault.edgeType],
						defaultIndex: this.calcDefault.index
					}
				]
			}
		},
		watch:{

		}
	}
</script>