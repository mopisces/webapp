<template>
	<div>
		<van-field :value="shortName" clickable @click="popupShow = true" placeholder="请选择方式" input-align="center" :label="label" readonly>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-field v-model="id" label="隐藏" v-show="false"/>
		<van-popup v-model="popupShow" position="bottom" @click-overlay="overlay()" get-container="body">
			<van-picker show-toolbar :columns="columns" :default-index="defaultIndex" @cancel="clean()" @confirm="confirm" cancel-button-text="清空" title="请选择方式">
			</van-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon, Popup, Picker, Field, Search } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
			[Search.name]: Search
		},
		props:['typeId','type'],
		data(){
			return {
				label:'',
				id:this.typeId,
				shortName:null,
				popupShow:false,
				columns:[],
				defaultIndex:-1,
				config:{
					collection:[],  //收款可选数组
					adjust:[]       //调账可选数组
				}
			}
		},
		methods:{
			getFrecPayType(){
				this.columns = [];
				if( this.config.collection.length == 0 || this.config.adjust.length == 0 ){
					let self = this;
					this.$request.staff.frec.getFrecPayType(this.type).then((res)=>{
						if( res.errorCode == '00000' ){
							res.result.collection.forEach((item,idx)=>{
								self.config.collection.push({text:item.ShortName,key:item.TypeId,effDay:item.EffDay});
							});
							res.result.adjust.forEach((item,idx)=>{
								self.config.adjust.push({text:item.ShortName,key:item.TypeId,effDay:item.EffDay});
							});
						}
					}).then(()=>{
						this.findTypeId();
					});
				}else{
					this.findTypeId();
				}
			},
			overlay(){
				this.popupShow = false;
			},
			clean(){
				this.shortName = null;
				this.defaultIndex = 0;
				this.id = this.columns[this.defaultIndex].key;
			},
			confirm(value,idx){
				this.shortName = value.text;
				this.id = value.key;
				this.defaultIndex = idx;
				this.$emit('payTypeConfirm',value);
				this.popupShow = false;
			},
			findTypeId(){
				if( this.type == 0 ){
					this.label = '调账方式';
					this.columns = this.config.adjust;
				}
				if( this.type == 1 ){
					this.label = '收款方式';
					this.columns = this.config.collection;
				}
				if( !this.typeId){
					this.shortName = null;
					this.defaultIndex = -1;
					return false;
				}
				this.columns.forEach((item,idx)=>{
					if( item.key == this.typeId ){
						this.shortName = item.text;
						this.defaultIndex = idx;
						this.$emit('payTypeConfirm',item);
					}
				});

			}
		},
		created(){
			this.getFrecPayType();
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
			typeId(newV,oldV){
				this.id = newV;
				this.getFrecPayType();
			},
			id(newV,oldV){
				this.$emit("update:typeId", newV);
			},
			type( newV,oldV ){
				this.getFrecPayType();
			}
		}
	}
</script>