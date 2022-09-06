<template>
	<div>
		<van-field v-model="result" placeholder="请输入订单号" label="条形码编号" input-align="center" maxlength="12">
		 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" @click="scanQRCode()" />
		</van-field>
		<van-dialog v-model="show" :title="tipMsg" show-cancel-button>
			<video ref="video" id="video" class="scan-video" autoplay controls="true"></video>
		</van-dialog>
	</div>
</template>
<script>
	import { Icon, Field, Dialog  } from 'vant';

	import { BrowserMultiFormatReader } from '@zxing/library';
	export default {
		components:{
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Dialog.Component.name]: Dialog.Component,
		},
		props:['scanResult'],
		data(){
			return {
				result : this.scanResult,
				codeReader : null,
				tipMsg : '正在尝试识别....',
				show   : false
			}
		},
		methods:{
			scanQRCode(){
				this.show = true;
				this.codeReader = new BrowserMultiFormatReader();
				console.log(this.codeReader)
				this.startScan();
			},
			async startScan(){
				this.codeReader.getVideoInputDevices().then( (videoInputDevices)=>{
					this.tipMsg = '正在调用摄像头...';
					let firstDeviceId = videoInputDevices[0].deviceId;
					const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label);
					if (videoInputDevices.length > 1) {
						if (videoInputDeviceslablestr.indexOf('back') > -1) {
							firstDeviceId = videoInputDevices[0].deviceId;
						}else{
							firstDeviceId = videoInputDevices[1].deviceId;
						}
					}
					this.decodeFromInputVideoFunc(firstDeviceId);
				}).catch(err=>{
					this.tipMsg = '调用摄像头失败';
					console.error(err);
				});
			},
			decodeFromInputVideoFunc(firstDeviceId){
				this.codeReader.reset();
				this.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
					this.tipMsg = '正在尝试识别...';
					if (result) {
						console.log('扫描结果', result);
						this.result = result.text;
						if( this.result ){
							this.show = false;
						}
					}
					if (err && !(err)){
						this.tipMsg = '识别失败';
						setTimeout(() => {
			            	this.show = false;
			            }, 2000)
			            console.error(err);
					}
				})
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
			changeShow(){
				return this.show;
			}
		},
		watch:{
			scanResult(newV,oldV){
				this.result = newV;
			},
			result(newV,oldV){
				this.$emit("update:scanResult", newV);
			},
			changeShow(newV,oldV){
				if( newV == false ){
					this.codeReader.reset();
				}
			}
		}
	}
</script>
<style type="text/css">
	.scan-video{
		width:100%;
		height:100%;
	}
	video::-webkit-media-controls{
		display: none !important;
	}
</style>

