<template>
  <div>
    <scan-code :scanResult.sync="value"></scan-code>
  </div>
</template>
<script>
  import { Field } from 'vant';
  import ScanCode from '@/components/subject/scancode/ScanCode.vue';
  export default {
    components:{
      [Field.name]: Field,
      ScanCode
    },
    data(){
      return {
        value:null
      }
    },
    methods:{

    },
    created(){
      console.log(ScanCode)
      this.$store.commit('client/setHeaderTitle','1234');
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

    }
  }
</script>
项目范围管理计划    
输入：项目管理计划、项目章程、事业环境因素、组织过程资产 
工具与技术：专家判断、会议 
输出：范围管理计划、需求管理计划

收集需求
输入：范围管理计划、需求管理计划、干系人管理计划、干系人登记册
工具与技术：焦点访谈、引导式研讨会、群体创新技术(头脑风暴、名义小组技术、亲和图、德尔菲技术、概念/思维图、多标准决策分析)、群体决策技术、标杆对照、原型、系统交互图、文件分析
输出：需求文件、需求跟踪矩阵

定义范围
输入：范围管理计划、需求文件、项目章程、组织过程资产
工具与技术：引导式探讨会、专家判断、产品分析、备选方案生成
输出：项目范围说明书、项目文件更新

创建WBS
输入：范围管理计划、项目范围说明书、需求文件、事业环境因素、组织过程资产
工具与技术：分解、专家判断
输出：范围基准（批准的项目范围说明书、WBS、WBS词典）、项目文件更新

确认范围
输入：项目管理计划、需求文件、需求跟踪矩阵、确认的可交付成果、工作绩效数据
工具与技术：检查、群体决策技术
输出：验收的可交付成果、变更请求、工作绩效信息、项目文件更新

控制范围
输入：项目管理计划、需求文件、需求跟踪矩阵、工作绩效数据、组织过程资产
工具与技术：偏差分析
输出：工作绩效信息、变更请求、项目管理计划更新、项目文件更新、组织过程资产更新
