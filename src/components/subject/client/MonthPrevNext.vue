<template>
	<div>
		<div class="month-container">
			<div :class="[leftGray ? 'gray-color':'','month-list-item','list-left']" @click="monthClick(1)">
				上个月
			</div>
			<div class="month-list-item list-middle" @click="monthClick(2)">
				{{ dateMonth }}
			</div>
			<div :class="[rightGray ? 'gray-color':'','month-list-item', 'list-right']" @click="monthClick(3)">
				下个月
			</div>
		</div>
		<van-popup v-model="show" position="bottom" @click-overlay="clickOverlay" :close-on-click-overlay="false" get-container="body">
			<van-datetime-picker v-model="pickerTime" :min-date="min" :max-date="max" type="year-month" title="选择月份" show-toolbar @cancel="onCancel" @confirm="onConfirm"></van-datetime-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Popup, Field, DatetimePicker } from 'vant';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Popup.name]: Popup,
			[Field.name]: Field,
			[DatetimePicker.name]: DatetimePicker,
		},
		props:['dateTime','minDate','maxDate'],
		data(){
			return {
				value:'',
				dateMonth: dateTimeFormat(this.dateTime,'yyyy-MM'),
				pickerTime : new Date(this.dateTime),
				max  : new Date(this.maxDate),
				min  : new Date(this.minDate),
				show:false,
				leftGray:false,
				rightGray:false
			}
		},
		methods:{
			monthClick( type ){
				if( !this.dateMonth ){
					return 
				}
				let dateArr = this.dateMonth.split('-');
				let year = dateArr[0];
				let month = dateArr[1];

				if( type == '1' && this.leftGray == false ){
					console.log('left')
					let yearNew = year;
					let monthNew =  parseInt(month) - 1;
					if( monthNew == 0 ){
						yearNew = parseInt(yearNew) - 1;
						monthNew = 12;
					}
					if( monthNew < 10 ){
						monthNew = '0' + monthNew;
					}
					this.dateMonth = yearNew + '-' + monthNew;
					if( new Date(this.dateMonth).getTime() < this.min.getTime() ){
						this.dateMonth = dateArr[0] + '-' + dateArr[1];
						this.leftGray = true;
					}
					this.rightGray = false;
					this.pickerTime = new Date(this.dateMonth);
					this.$emit("update:dateTime", this.dateMonth );
				}
				if( type == '2' ){
					this.show = true;
				}
				if( type == '3' ){
					let yearNew = year;
					let monthNew =  parseInt(month) + 1;
					if (monthNew == 13) {
						yearNew = parseInt(yearNew) + 1;
						monthNew = 1;
					}
					if( monthNew < 10 ){
						monthNew = '0' + monthNew;
					}
					this.dateMonth = yearNew + '-' + monthNew;
					if( new Date(this.dateMonth).getTime() > this.max.getTime() ){
						this.dateMonth = dateArr[0] + '-' + dateArr[1];
						this.rightGray = true;
					}
					this.leftGray = false;
					this.pickerTime = new Date(this.dateMonth);
					this.$emit("update:dateTime", this.dateMonth );
				}
			},
			clickOverlay(){
				this.show = false;
			},
			onCancel(){
				this.clickOverlay();
			},
			onConfirm( value ){
				//this.$emit("update:dateTime", dateTimeFormat(value,'yyyy-MM'));
				this.dateMonth = dateTimeFormat(value,'yyyy-MM');
				/*this.rightGray = false;
				this.leftGray = false;
				if( new Date(this.dateMonth).getTime() > this.max.getTime() ){
					this.rightGray = true;
				}
				if( new Date(this.dateMonth).getTime() < this.min.getTime() ){
					this.leftGray = true;
				}*/
				this.clickOverlay();
			}
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
			dateMonthChange(){
				return this.dateMonth;
			}
		},
		watch:{
			dateMonthChange( newV, oldV ){
				this.rightGray = false;
				this.leftGray = false;
				if( new Date(newV).getTime() > this.max.getTime() ){
					this.rightGray = true;
				}
				if( new Date(newV).getTime() < this.min.getTime() ){
					this.leftGray = true;
				}
				this.$emit("update:dateTime", dateTimeFormat(newV,'yyyy-MM'));
			}	
		}
	}
</script>
<style type="text/css">
	.month-container{
		width:100%;
		height: 1.875rem;
		padding: 0 0.9375rem;
	    box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    background-color: #fff;
	}
	.month-list-item{
		width:33.33%;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.list-left:{
		text-align: left;
	}
	.list-middle{
		color:red;
		text-align: center;
	}
	.list-right{
		text-align: right;
	}
	.gray-color{
		color:gray;
	}
</style>