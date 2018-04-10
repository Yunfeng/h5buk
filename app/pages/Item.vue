<template>
  <div><h1>{{ item.title }}</h1></div>
</template>

<script>
export default {
  asyncData ({ store, route }) {
    // return the Promise from the action
    // console.log('aysnData')
    return store.dispatch('fetchItem', route.params.id)
  },

  computed: {
    // display the item from store state.
    item () {
      // console.log('computed: item')
      return this.$store.state.items[this.$route.params.id]
    }
  }
}
</script>