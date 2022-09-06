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