<template>
    <div>
        <van-button type="primary">主要按钮</van-button>
        <van-tabs>
          <van-tab v-for="(index,key) in 8" :title="'标签 ' + index" :key="key">
              内容 {{ index }}
          </van-tab>
        </van-tabs>
        <div ref="wrapper"  style="height:10px;">
            <ul>
                <li style="height:10px">1</li>
                <li style="height:10px">2</li>
                <li style="height:10px">3</li>
                <li style="height:10px">4</li>
                <li style="height:10px">5</li>
                <li style="height:10px">6</li>
                <li style="height:10px">7</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Button, NavBar,  Tab, Tabs } from 'vant';
import BScroll from 'better-scroll'
export default {
  data(){
    return {
      options:{
        scrollbar :true,
        fade: false 
      }
    }
  },
  name: 'HelloWorld',
  components:{
    [Button.name]:Button,
    [NavBar.name]:NavBar,
    [Tab.name]:Tab,
    [Tabs.name]:Tabs,
  },
  props: {
    msg: String
  },
  created(){
    this.test()
  },
  mounted() {
    setTimeout(() => {
      this.scroll = new BScroll(this.$refs.wrapper, this.options)
    }, 20)
  },
  methods:{
    test(){
      this.$request.adminRequest.login().then((res)=>{
        localStorage.setItem("jwt", res.result);
      })
    },
    click(){
      this.$request.adminRequest.check().then((res)=>{
        window.console.dir(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
