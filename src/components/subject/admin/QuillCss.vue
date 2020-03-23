<template>
	<div id="quillCss">
		<remote-css href="https://cdn.quilljs.com/1.3.6/quill.snow.css"></remote-css>
		<remote-css href="https://cdn.quilljs.com/1.3.6/quill.bubble.css"></remote-css>
		<remote-css href="https://cdn.quilljs.com/1.3.6/quill.core.css"></remote-css>
	</div>
</template>
<script>
	export default {
		name:'quillCss',
		components:{
			'remote-css' : {
				render(createElement) { 
					return createElement('link', { attrs: { rel: 'stylesheet', href: this.href }});
				}
			},
			props:{
				href: { type: String, required: true },
			}
		},
		data(){
			return {
				value:''
			}
		},
		methods:{

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
			
		},
		watch:{

		}
	}
</script>