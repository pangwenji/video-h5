<template>
	<RouterView />
</template>
<script setup>
import { RouterView } from 'vue-router';
import { initWindowHidden } from '@/utils'

initWindowHidden()
</script>

<style lang="less" scoped>
#app {
	height: 100%;
	width: 100%;
}
</style>
