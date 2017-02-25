<template>
	<div class='message'>welcome, {{username}}! {{ msg }}</div>
</template>

<script>
export default {
	data () {
		return {
			msg: 'This is FLIGHT BOOKING webapp!'
		}
	},
	computed: {
		username () {
			return this.$store.state.username;
		}
	}
}
</script>

<style>
.message {
 color: green;
}
</style>