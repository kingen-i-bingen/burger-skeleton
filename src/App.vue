<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Ordering from "./views/Ordering.vue"

export default {
  name: 'app',
  components: {
    Ordering
  }
}
</script>

<style>
  html {
    background-color: whitesmoke;
  }
</style>
