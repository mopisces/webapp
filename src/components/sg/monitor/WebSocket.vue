<template>
	<div style="font-size:0.8125rem;">
		<van-notice-bar :text="config.notice.text" left-icon="volume-o" />
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownOption" />
		</van-dropdown-menu>
		<template v-if="config.updown">
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				切刀数
				<van-button plain type="info" size="small">30000</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small">19000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				生产刀数
				<van-button plain type="info" size="small">30000</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small">19000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				剩余刀数
				<van-button plain type="info" size="small">30000</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small">19000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				不良刀数
				<van-button plain type="info" size="small">30000</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small">19000</van-button>
			</div>
			<div style="width:100%;height:0.1rem;"></div>
			<table>
				<tr>
					<td>坑机</td>
					<td>糊机</td>
					<td>SF1</td>
					<td>SF2</td>
					<td>SF3</td>
				</tr>
				<tr>
					<td>车速</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</table>
			<table>
				<tr>
					<td>订单</td>
					<td>A班</td>
					<td>本笔</td>
				</tr>
				<tr>
					<td>总米数(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>生产(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>剩余(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>不良(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>均速(m/min)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>生产平方(㎡)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>停车次数</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>坏纸率(%)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>修边率(%)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>生产时间</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>停车时间</td>
					<td></td>
					<td></td>
				</tr>
			</table>
		</template>
		<template v-else>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				切刀数<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				生产刀数<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				剩余刀数<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				不良刀数<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				剩余(m)<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				订单长(m)<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				切长(mm)<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				车速<br/>
				<van-button plain type="info" size="small">30000</van-button>
			</div>
			<table>
				<tr>
					<td>坑机</td>
					<td>糊机</td>
					<td>SF1</td>
					<td>SF2</td>
					<td>SF3</td>
				</tr>
				<tr>
					<td>车速</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr v-if="config.isnew">
					<td>剩余</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr v-if="config.isnew">
					<td>累计</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</table>
			<table>
				<tr>
					<td>订单</td>
					<td>A班</td>
					<td>本笔</td>
				</tr>
				<tr>
					<td>总米数(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>生产(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>剩余(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>不良(m)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>生产平方(㎡)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>坏纸率(%)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>修边率(%)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>均速(m/min)</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>停车次数</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>生产时间</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>停车时间</td>
					<td></td>
					<td></td>
				</tr>
			</table>
		</template>
	</div>
</template>
<script>
	import { Button, DropdownMenu, DropdownItem, NoticeBar, Grid, GridItem } from 'vant';
	import io from 'socket.io-client';
	export default {
		components:{
			[Button.name]: Button,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[NoticeBar.name]: NoticeBar,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
		},
		data(){
			return {
				config:{
					dropDownOption : [],
					updown : true,
					isnew  : true,
					notice : {
						text : '',
						avaliable : false
					}
				},
				formData:{
					activeItem : 0
				},
				socket:{}  //socket链接对象
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.sg.select.getConfig().then(res=>{
					if( res.errorCode == '00000' ){
						res.result.forEach((item,index)=>{
							self.config.dropDownOption.push({text:item.DB_FLAG,value:index,isnew:item.isnew,updown:item.updown,socketUrl:item.socketio.domain});
						});
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.updown = this.config.dropDownOption[ this.formData.activeItem ].updown;
						this.config.isnew = this.config.dropDownOption[ this.formData.activeItem ].isnew;
						this.getSocket(this.config.dropDownOption[ this.formData.activeItem ].socketUrl)
					});
				});
			},
			getSocket( socketUrl ){
				this.socket = io(socketUrl,{
					timeout:3000
				});

				this.socket.on('connect',()=>{
					this.config.notice.text = '链接成功！';
				});
				this.socket.on('sendMsg', (data)=>{
					if( data == 10060 ){
						this.config.notice.text = '后台udp广播暂未开启';
					}else{
						//this.config.notice.text = '监控开启成功！！！';
						this.config.notice.text = JSON.stringify(data);
					}
				});
				this.socket.on('connect_error',(error)=>{
					this.config.notice.text = '链接失败,后台服务暂未开启！';
				});
				this.socket.on('connect_timeout',(timeout)=>{
					this.config.notice.text = '超时链接,后台服务暂未开启！';
				});
				this.socket.on('error',(error)=>{
					this.config.notice.text = '链接错误';
				});
				this.socket.on('disconnect',(error)=>{
					this.config.notice.text = 'disconnect';
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','生管监控');
			this.getConfig();
		},
		mounted(){
			
		},
		updated(){
			
		},
		destroyed(){
			this.socket.close();
		},
		computed:{
			activeItemChange(){
				return this.formData.activeItem;
			}
		},
		watch:{
			activeItemChange( newV, oldV ){
				this.config.updown = this.config.dropDownOption[ newV ].updown;
				this.config.isnew  = this.config.dropDownOption[ newV ].isnew;
				this.socket.close();
				this.config.notice.text = '';
				this.getSocket(this.config.dropDownOption[ newV ].socketUrl);
			}
		}
	}
</script>
<style>
	table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }
    table td {
        border: 1px solid #e0e0e0;
        border-top: none;
        text-align: center;
    }
</style>