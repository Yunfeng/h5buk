<template>
</template>

<script>
module.exports = {
  mounted: function() {
    var to = GetURLParameter("to")
    var id = GetURLParameter("id")
    //console.log(to);

    if (to !== undefined && to.length > 0) {
      var path = "/" + to
      if (id !== undefined && id.length > 0) {
        path = path + "/" + id
      }
      this.$router.replace(path)
    } else {
      this.$router.push('/home')
    }    
  }  
}
</script>