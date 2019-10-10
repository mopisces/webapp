<template>
	<div>
		<van-nav-bar  :title="config.headerTitle" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft" @click-right="onClickRight" :fixed="true"/>
		<!-- <van-cell style="margin-top:50px;">
			<p slot="title">账号：AQ</p>
			<van-button type="info" slot="right-icon" round icon="https://img.yzcdn.cn/vant/logo.png">更改密码</van-button>
			<van-button type="info" slot="right-icon" round icon="https://img.yzcdn.cn/vant/logo.png">登录二维码</van-button>
		</van-cell> -->
		<div style="margin-top:50px;margin-bottom:50px;" >
			<router-view />
		</div>
		
		<!-- <div ref="wrapper" class="wrapper" style="height:300px;margin-top:50px">
			<router-view />
			<ul class="content">
				<li style="height:100px">222</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
				<li style="height:100px">1</li>
			</ul>
		</div> -->
		<!-- <van-grid :column-num="3">
			<van-grid-item  text="简单纸板下单" >
				<p slot="icon">ssss</p>
			</van-grid-item>
			<van-grid-item icon="photo-o" text="纸箱纸板下单" />
			<van-grid-item icon="photo-o" text="纸箱下单" />
			<van-grid-item icon="photo-o" text="微信订单" />
			<van-grid-item icon="photo-o" text="常用订单" />
			<van-grid-item icon="photo-o" text="常用材质" />
			<van-grid-item icon="photo-o" text="ERP订单" />
			<van-grid-item icon="photo-o" text="每日订单" />
			<van-grid-item icon="photo-o" text="对账单" />
			<van-grid-item icon="photo-o" text="报价价格" />
			<van-grid-item icon="photo-o" text="报价规则" />
			<van-grid-item icon="photo-o" text="信用余额" />
		</van-grid> -->
		<!-- <v-table :width="1000" :columns="columns" :table-data="tableData" :show-vertical-border="false "></v-table> -->
		<van-tabbar v-model="active" @change="onChange">
			<van-tabbar-item icon="home-o">刷新</van-tabbar-item>
			<van-tabbar-item icon="search">退出</van-tabbar-item>
			<van-tabbar-item icon="friends-o">首页</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import BScroll from 'better-scroll';
	//import {VTable,VPagination} from 'vue-easytable';
	import { NavBar, Tabbar, TabbarItem, Cell, Button, Grid, GridItem } from 'vant';
	export default{
		components:{
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Cell.name]: Cell,
			[Button.name]: Button,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
			//[VPagination.name]: VPagination,
			//[VTable.name]: VTable,
		},
		data(){
			return {
				config:{
					headerTitle:''
				},
				options:{
					scrollbar :true,
					fade: false ,
					bounce:true,
				},
				active:0,
				/*tableData: [
                           {"name":"赵伟","tel":"156*****1987","hobby":"钢琴、书法、唱歌","address":"上海市黄浦区金陵东路569号17楼"},
                           {"name":"李伟","tel":"182*****1538","hobby":"钢琴、书法、唱歌","address":"上海市奉贤区南桥镇立新路12号2楼"},
                           {"name":"孙伟","tel":"161*****0097","hobby":"钢琴、书法、唱歌","address":"上海市崇明县城桥镇八一路739号"},
                           {"name":"周伟","tel":"197*****1123","hobby":"钢琴、书法、唱歌","address":"上海市青浦区青浦镇章浜路24号"},
                           {"name":"吴伟","tel":"183*****6678","hobby":"钢琴、书法、唱歌","address":"上海市松江区乐都西路867-871号"}
                    ],
                    columns: [
                           {field: 'name', title:'姓名', width: 150, titleAlign: 'center',columnAlign:'center', isFrozen: true},
                           {field: 'tel', title: '手机号码', width: 280, titleAlign: 'center',columnAlign:'center', isFrozen: true},
                           {field: 'hobby', title: '爱好', width: 380, titleAlign: 'center',columnAlign:'center'},
                           {field: 'address', title: '地址', width: 430, titleAlign: 'center',columnAlign:'left'}
                    ]*/
			};
		},
		methods:{
			onClickLeft(){
				console.log('1');
			},
			onClickRight(){
				
				console.log('2');
			},
			onChange( active ){
				console.log(active);
			},
			scrollInit(){
				this.scroll = new BScroll(this.$refs.wrapper, this.options);
			}
		},
		mounted(){

		},
		created(){
			/*this.$nextTick(() => {
				this.scrollInit();
			});*/
			this.config.headerTitle = this.$store.state.staff.layout.title;
		},
		computed:{
			setTitle(){
				return this.$store.state.staff.layout.title;
			}
		},
		watch:{
			'setTitle':{
				handler:function(newV,oldV){
					this.config.headerTitle = newV;
				}
			}
		}
	}
</script>
