<template>
  <div class="startpage">
    <header id="header">
      <button id="langButton" v-on:click="switchLang()">
        <img id="langPic" v-if="flag_en" src="@/assets/englishFlag.webp" width="30px" height="20px">
        <img id="langPic" v-if="flag_sv" src="@/assets/swedishFlag.png" width="30px" height="20px">
      </button>
    <h1 id="startHead"> {{uiLabels.welcome}} </h1>
  </header>
  <div class="wrapper">
    <div class="Box a">
    <button class="BuildButton" v-on:click="previousCategory()"> {{uiLabels.buildBurger}} </button>
    </div>
  </div>
</div>

</template>

<script>
//import the components that are used in the template, the name that you
//use for importing will be used in the template above and also below in
//components
import Ingredient from '@/components/Ingredient.vue'
import OrderItem from '@/components/OrderItem.vue'

//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'
/* instead of defining a Vue instance, export default allows the only
necessary Vue instance (found in main.js) to import your data and methods */

export default {
  name: 'Ordering',
  components: {
    Ingredient,
    OrderItem
  },
  mixins: [sharedVueStuff], // include stuff that is used in both
  // the ordering system and the kitchen
  data: function() { //Not that data is a function!
    return {
    }
  },
  methods: {
  },
}
</script>
<style>

.BuildButton{
  border: none;
  color: black;
  padding: 2vh 2vh;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
  border-radius: 8px;
  position: fixed;
  top: 200;
}
.wrapper{
display:grid;
}
.a {

}

</style>
