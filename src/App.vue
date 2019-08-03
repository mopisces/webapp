<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
	window.onload = () => {
		document.getElementById("app").style.height = window.screen.height +"px";
		document.getElementById("app").style.width  = window.screen.width+"px";
	}
</script>
