<template>
	<div style="font-size:0.8125rem;">
		<!-- <van-notice-bar :text="config.notice.text" left-icon="volume-o" /> -->
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.activeItem" :options="config.dropDownOption" />
		</van-dropdown-menu>
		<template v-if="config.updown">
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				切刀数
				<van-button plain type="info" size="small" @click="buildChart('切刀数(上刀)','刀数','qds1')">{{ updownInfo.qds1 }}</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small" @click="buildChart('切刀数(下刀)','刀数','qds2')">{{ updownInfo.qds2 }}</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				生产刀数
				<van-button plain type="info" size="small" @click="buildChart('生产刀数(上刀)','刀数','scds1')">{{ updownInfo.scds1 }}</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small" @click="buildChart('生产刀数(下刀)','刀数','scds2')">{{ updownInfo.scds2 }}</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				剩余刀数
				<van-button plain type="info" size="small" @click="buildChart('剩余刀数(上刀)','刀数','syds1')">{{ updownInfo.syds1 }}</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small" @click="buildChart('剩余刀数(下刀)','刀数','syds2')">{{ updownInfo.syds2 }}</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				不良刀数
				<van-button plain type="info" size="small" @click="buildChart('不良刀数(上刀)','刀数','blds1')">{{ updownInfo.blds1 }}</van-button>
				<div style="width:100%;height:0.1rem"></div>
				<van-button plain type="info" size="small" @click="buildChart('不良刀数(下刀)','刀数','blds2')">{{ updownInfo.blds2 }}</van-button>
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
					<td @click="buildChart('糊机/车速','','huji_cs')">{{ updownInfo.huji.cs }}</td>
					<td @click="buildChart('SF1/车速','','SF1_cs')">{{ updownInfo.SF1.cs }}</td>
					<td @click="buildChart('SF2/车速','','SF2_cs')">{{ updownInfo.SF2.cs }}</td>
					<td @click="buildChart('SF3/车速','','SF3_cs')">{{ updownInfo.SF3.cs }}</td>
				</tr>
			</table>
			<table>
				<tr>
					<td>订单</td>
					<td>{{ className }}班</td>
					<td>本笔</td>
				</tr>
				<tr>
					<td>总米数(m)</td>
					<td @click="buildChart('？班/总米数','米(m)','benban_zms')">{{ updownInfo.benban.zms }}</td>
					<td @click="buildChart('本笔/总米数','米(m)','benbi_zms')">{{ updownInfo.benbi.zms }}</td>
				</tr>
				<tr>
					<td>生产(m)</td>
					<td @click="buildChart('？班/生产','米(m)','benban_sc')">{{ updownInfo.benban.sc }}</td>
					<td @click="buildChart('本笔/生产','米(m)','benbi_sc')">{{ updownInfo.benbi.sc }}</td>
				</tr>
				<tr>
					<td>剩余(m)</td>
					<td @click="buildChart('？班/剩余','米(m)','benban_sy')">{{ updownInfo.benban.sy }}</td>
					<td @click="buildChart('本笔/剩余','米(m)','benbi_sy')">{{ updownInfo.benbi.sy }}</td>
				</tr>
				<tr>
					<td>不良(m)</td>
					<td @click="buildChart('？班/不良','米(m)','benban_bl')">{{ updownInfo.benban.bl }}</td>
					<td @click="buildChart('本笔/不良','米(m)','benbi_bl')">{{ updownInfo.benbi.bl }}</td>
				</tr>
				<tr>
					<td>均速(m/min)</td>
					<td @click="buildChart('？班/均速','米(m)','benban_js')">{{ updownInfo.benban.js }}</td>
					<td @click="buildChart('本笔/均速','米(m)','benbi_js')">{{ updownInfo.benbi.js }}</td>
				</tr>
				<tr>
					<td>生产平方(㎡)</td>
					<td @click="buildChart('？班/生产平方','平方米(㎡)','benban_scpf')">{{ updownInfo.benban.scpf }}</td>
					<td @click="buildChart('本笔/生产平方','平方米(㎡)','benbi_scpf')">{{ updownInfo.benbi.scpf }}</td>
				</tr>
				<tr>
					<td>停车次数</td>
					<td @click="buildChart('？班/停车次数','次数','benban_tccs')">{{ updownInfo.benban.tccs }}</td>
					<td @click="buildChart('本笔/停车次数','次数','benbi_tccs')">{{ updownInfo.benbi.tccs }}</td>
				</tr>
				<tr>
					<td>坏纸率(%)</td>
					<td @click="buildChart('？班/坏纸率','%','benban_hzl')">{{ updownInfo.benban.hzl }}</td>
					<td @click="buildChart('本笔/坏纸率','%','benbi_hzl')">{{ updownInfo.benbi.hzl }}</td>
				</tr>
				<tr>
					<td>修边率(%)</td>
					<td @click="buildChart('？班/修边率','%','benban_xbl')">{{ updownInfo.benban.xbl }}</td>
					<td @click="buildChart('本笔/修边率','%','benbi_xbl')">{{ updownInfo.benbi.xbl }}</td>
				</tr>
				<tr>
					<td>生产时间</td>
					<td>{{ timeFormat(updownInfo.benban.scsj) }}</td>
					<td>{{ timeFormat(updownInfo.benbi.scsj) }}</td>
				</tr>
				<tr>
					<td>停车时间</td>
					<td>{{ timeFormat(updownInfo.benban.tcsj) }}</td>
					<td>{{ timeFormat(updownInfo.benbi.tcsj) }}</td>
				</tr>
			</table>
		</template>
		<template v-else>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				切刀数<br/>
				<van-button plain type="info" size="small" @click="buildChart('切刀数','刀数','qds')">{{ normalInfo.qds }}</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				生产刀数<br/>
				<van-button plain type="info" size="small" @click="buildChart('生产刀数','刀数','scds')">{{ normalInfo.scds }}</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				剩余刀数<br/>
				<van-button plain type="info" size="small" @click="buildChart('剩余刀数','刀数','syds')">{{ normalInfo.syds }}</van-button>
			</div>
			<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
				不良刀数<br/>
				<van-button plain type="info" size="small" @click="buildChart('不良刀数','刀数','blds')">{{ normalInfo.blds }}</van-button>
			</div>
			<template v-if="config.isnew">
				<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
					剩余(m)<br/>
					<van-button plain type="info" size="small" @click="buildChart('订单剩余','米(m)','ddsy')">{{ normalInfo.ddsy }}</van-button>
				</div>
				<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
					订单长(m)<br/>
					<van-button plain type="info" size="small" @click="buildChart('订单长','米(m)','ddc')">{{ normalInfo.ddc }}</van-button>
				</div>
				<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
					切长(mm)<br/>
					<van-button plain type="info" size="small"  @click="buildChart('切长','毫米(mm)','qc')">{{ normalInfo.qc }}</van-button>
				</div>
				<div class="van-col van-col--6" style="text-align:center;border: 1px solid #ddd; ">
					车速<br/>
					<van-button plain type="info" size="small"  @click="buildChart('车速','','cs')">{{ normalInfo.cs }}</van-button>
				</div>
			</template>
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
					<td @click="buildChart('糊机/车速','','huji_cs')">{{ normalInfo.huji.cs }}</td>
					<td @click="buildChart('SF1/车速','','SF1_cs')">{{ normalInfo.SF1.cs }}</td>
					<td @click="buildChart('SF2/车速','','SF2_cs')">{{ normalInfo.SF2.cs }}</td>
					<td @click="buildChart('SF3/车速','','SF3_cs')">{{ normalInfo.SF3.cs }}</td>
				</tr>
				<tr v-if="config.isnew">
					<td>剩余</td>
					<td @click="buildChart('糊机/剩余','','huji_cs')">{{ normalInfo.huji.sy }}</td>
					<td @click="buildChart('SF1/剩余','','SF1_sy')">{{ normalInfo.SF1.sy }}</td>
					<td @click="buildChart('SF2/剩余','','SF2_sy')">{{ normalInfo.SF2.sy }}</td>
					<td @click="buildChart('SF3/剩余','','SF3_sy')">{{ normalInfo.SF3.sy }}</td>
				</tr>
				<tr v-if="config.isnew">
					<td>累计</td>
					<td @click="buildChart('糊机/累计','','huji_lj')">{{ normalInfo.huji.lj }}</td>
					<td @click="buildChart('SF1/累计','','SF1_lj')">{{ normalInfo.SF1.lj }}</td>
					<td @click="buildChart('SF2/累计','','SF2_lj')">{{ normalInfo.SF2.lj }}</td>
					<td @click="buildChart('SF3/累计','','SF3_lj')">{{ normalInfo.SF3.lj }}</td>
				</tr>
			</table>
			<table>
				<tr>
					<td>订单</td>
					<td>{{ className }}班</td>
					<td>本笔</td>
				</tr>
				<tr>
					<td>总米数(m)</td>
					<td @click="buildChart('？班/总米数','米(m)','benban_zms')">{{ normalInfo.benban.zms }}</td>
					<td @click="buildChart('本笔/总米数','米(m)','benbi_zms')">{{ normalInfo.benbi.zms }}</td>
				</tr>
				<tr>
					<td>生产(m)</td>
					<td @click="buildChart('？班/生产','米(m)','benban_sc')">{{ normalInfo.benban.sc }}</td>
					<td @click="buildChart('本笔/生产','米(m)','benbi_sc')">{{ normalInfo.benbi.sc }}</td>
				</tr>
				<tr>
					<td>剩余(m)</td>
					<td @click="buildChart('？班/剩余','米(m)','benban_sy')">{{ normalInfo.benban.sy }}</td>
					<td @click="buildChart('本笔/剩余','米(m)','benbi_sy')">{{ normalInfo.benbi.sy }}</td>
				</tr>
				<tr>
					<td>不良(m)</td>
					<td @click="buildChart('？班/不良','米(m)','benban_bl')">{{ normalInfo.benban.bl }}</td>
					<td @click="buildChart('本笔/不良','米(m)','benbi_bl')">{{ normalInfo.benbi.bl }}</td>
				</tr>
				<tr>
					<td>生产平方(㎡)</td>
					<td @click="buildChart('？班/生产平方','平方米(㎡)','benban_scpf')">{{ normalInfo.benban.scpf }}</td>
					<td @click="buildChart('本笔/生产平方','平方米(㎡)','benbi_scpf')">{{ normalInfo.benbi.scpf }}</td>
				</tr>
				<tr>
					<td>坏纸率(%)</td>
					<td @click="buildChart('？班/坏纸率','%','benban_hzl')">{{ normalInfo.benban.hzl }}</td>
					<td @click="buildChart('本笔/坏纸率','%','benbi_hzl')">{{ normalInfo.benbi.hzl }}</td>
				</tr>
				<tr>
					<td>修边率(%)</td>
					<td @click="buildChart('？班/修边率','%','benban_xbl')">{{ normalInfo.benban.xbl }}</td>
					<td @click="buildChart('本笔/修边率','%','benbi_xbl')">{{ normalInfo.benbi.xbl }}</td>
				</tr>
				<tr>
					<td>均速(m/min)</td>
					<td @click="buildChart('？班/均速','米/分(m/min)','benban_js')">{{ normalInfo.benban.js }}</td>
					<td @click="buildChart('本笔/均速','米/分(m/min)','benbi_js')">{{ normalInfo.benbi.js }}</td>
				</tr>
				<tr>
					<td>停车次数</td>
					<td @click="buildChart('？班/停车次数','次数','benban_tccs')">{{ normalInfo.benban.tccs }}</td>
					<td @click="buildChart('本笔/停车次数','次数','benbi_tccs')">{{ normalInfo.benbi.tccs }}</td>
				</tr>
				<tr>
					<td>生产时间</td>
					<td>{{ timeFormat(normalInfo.benban.scsj) }}</td>
					<td>{{ timeFormat(normalInfo.benbi.scsj) }}</td>
				</tr>
				<tr>
					<td>停车时间</td>
					<td>{{ timeFormat(normalInfo.benban.tcsj) }}</td>
					<td>{{ timeFormat(normalInfo.benbi.tcsj) }}</td>
				</tr>
			</table>
		</template>
		<div>
			<div class="highcharts-container" id="chart-container" ></div>
		</div>
	</div>
</template>
<script>
	import { Button, DropdownMenu, DropdownItem, NoticeBar, Grid, GridItem } from 'vant';
	import { secondsFormat } from '@/util';
	import Highcharts from 'highcharts/highstock';
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
					},
					chart:{
						show : false,
						keyName : ''
					}
				},
				formData:{
					activeItem : 0
				},
				socket:{},  //socket链接对象
				className:'',
				updownInfo:{
					'qds1'  : 0,
	                'scds1' : 0,
	                'syds1' : 0,
	                'ddsy1' : 0,
	                'blds1' : 0,
	                'ddc1'  : 0,
	                'qc1'   : 0,
	                'qds2'  : 0,
	                'scds2' : 0,
	                'syds2' : 0,
	                'ddsy2' : 0,
	                'blds2' : 0,
	                'ddc2'  : 0,
	                'qc2'   : 0,
	                'xs'    : 0,
	                'benban': {
	                    'zms'   : 0,
	                    'sc'    : 0,
	                    'sy'    : 0,
	                    'bl'    : 0,
	                    'js'    : 0,
	                    'scpf'  : 0,
	                    'scsj'  : 0,
	                    'tcsj'  : 0,
	                    'tccs'  : 0,
	                    'scjpf' : 0,
	                    'hzl'   : 0,
	                    'xbl'   : 0
	                },
	                'benbi': {
	                    'zms'   : 0,
	                    'sc'    : 0,
	                    'sy'    : 0,
	                    'bl'    : 0,
	                    'js'    : 0,
	                    'scpf'  : 0,
	                    'scsj'  : 0,
	                    'tcsj'  : 0,
	                    'tccs'  : 0,
	                    'scjpf' : 0,
	                    'hzl'   : 0,
	                    'xbl'   : 0
	                },
	                'huji' : {
	                	'cs' : 0
	                },
	                'SF1' : {
	                	'cs' : 0
	                },
	                'SF2' : {
	                	'cs' : 0
	                },
	                'SF3' : {
	                	'cs' : 0
	                }
				}, //上下刀数据
				normalInfo:{
					'qds'  : 0,
	                'scds' : 0,
	                'syds' : 0,
	                'ddsy' : 0,
	                'blds' : 0,
	                'ddc'  : 0,
	                'qc'   : 0,
	                'cs'   : 0,
	                'benban': {
	                    'zms'   : 0,
	                    'sc'    : 0,
	                    'sy'    : 0,
	                    'bl'    : 0,
	                    'js'    : 0,
	                    'scpf'  : 0,
	                    'scsj'  : 0,
	                    'tcsj'  : 0,
	                    'tccs'  : 0,
	                    'scjpf' : 0,
	                    'hzl'   : 0,
	                    'xbl'   : 0
	                },
	                'benbi': {
	                    'zms'   : 0,
	                    'sc'    : 0,
	                    'sy'    : 0,
	                    'bl'    : 0,
	                    'js'    : 0,
	                    'scpf'  : 0,
	                    'scsj'  : 0,
	                    'tcsj'  : 0,
	                    'tccs'  : 0,
	                    'scjpf' : 0,
	                    'hzl'   : 0,
	                    'xbl'   : 0
	                },
	                'huji': {
	                    'cs' : 0,
	                    'sy' : 0,
	                    'lj' : 0
	                },
	                'SF1': {
	                    'cs' : 0,
	                    'sy' : 0,
	                    'lj' : 0
	                },
	                'SF2': {
	                    'cs' : 0,
	                    'sy' : 0,
	                    'lj' : 0
	                },
	                'SF3': {
	                    'cs' : 0,
	                    'sy' : 0,
	                    'lj' : 0
	                }
				},  //非上下刀数据
				chart:{}
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
						this.getSocket(this.config.dropDownOption[ this.formData.activeItem ].socketUrl,this.formData.activeItem)
					});
				});
			},
			getSocket( socketUrl, index ){
				this.socket = io(socketUrl,{
					timeout:3000
				});

				this.socket.on('connect',()=>{
					this.config.notice.text = '链接成功！';
				});
				this.socket.on('AnalyUdpData' + index, (data)=>{
					if( data == 10060 ){
						this.config.notice.text = '后台udp广播暂未开启';
					}else{
						this.config.notice.text = '监控开启成功';
						if( !JSON.parse(data).data || JSON.parse(data).ret == 0){
							this.config.notice.text = '数据不完整';
						}
						let udpData = JSON.parse(data).data
						this.className = udpData.class
						if( this.config.updown ){
							Object.assign(this.updownInfo, udpData);
						}else{
							Object.assign(this.normalInfo, udpData);
						}

						if( !this.config.chart.show ) return;
						if( this.config.updown ){
							if( this.config.chart.keyName.indexOf('_') === -1 ){
								this.chart.series[0].addPoint([(new Date()).getTime(),this.updownInfo[this.config.chart.keyName]],true,true);
							}else{
								let keyArr = this.config.chart.keyName.split('_');
								this.chart.series[0].addPoint([(new Date()).getTime(),this.updownInfo[keyArr[0]][keyArr[1]]],true,true);
							}
						}else{
							if( this.config.chart.keyName.indexOf('_') === -1 ){
								this.chart.series[0].addPoint([(new Date()).getTime(),this.normalInfo[this.config.chart.keyName]],true,true);
							}else{
								let keyArr = this.config.chart.keyName.split('_');
								this.chart.series[0].addPoint([(new Date()).getTime(),this.normalInfo[keyArr[0]][keyArr[1]]],true,true);
							}
						}
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
			},
			buildChart( xTitle, yTitle, keyName ){
				let className = '';
				if( this.config.updown ){
					className = this.updownInfo.class;
				}else{
					className = this.normalInfo.class;
				}
				this.chart = new Highcharts.chart('chart-container',{
					chart:{
						type        : 'spline',
						animation   : Highcharts.svg,
						marginRight : 10,
					},
					credits:{
						enabled : false
					},
					title : {
						text : xTitle.replace(/？/g,className)
					},
					xAxis:{
						type : 'datetime',
						tickPixelInterval : 150,
						visible : true
					},
					yAxis:{
						title : {
							text : yTitle
						},
						plotLines:[{
							value: 0,
                            width: 1,
                            color: '#808080'
						}],
						visible : true
					},
					tooltip:{
						formatter : function() {
							return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
						}
					},
					legend:{
						enabled : false
					},
					series:[{
						name : xTitle.replace(/？/g,className),
						data : (function(){
							var data = [],
								i;
							for (i = -10; i <= 0; i++ ) {
								data.push({
									x: (new Date()).getTime() + i * 1000,
									y: 0
								});
							}
							return data;
						}())
					}]
				});
				
				this.config.chart.keyName = keyName;
				this.config.chart.show    = true;
			},
			timeFormat( seconds ){
				return secondsFormat( seconds );
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','生管监控');
			this.$store.commit('sg/setTabbar','monitor');
			this.getConfig();
		},
		mounted(){
			Highcharts.setOptions({
				global:{
					useUTC:false
				}
			});
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
				if( this.config.chart.show ){
					this.chart.setSize(undefined,1);
				}
				this.socket.close();
				this.config.notice.text = '';
				this.getSocket(this.config.dropDownOption[ newV ].socketUrl, newV);
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
        padding:10px 0;
    }
</style>