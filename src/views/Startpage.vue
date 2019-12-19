<template>
  <div class="startpage">
    <header id="header">
      <button id="langButton" v-on:click="switchLang()">
        <img class="langPic" v-if="flag_en" src="@/assets/englishFlag.webp" width="30px" height="20px">
        <img class="langPic" v-if="flag_sv" src="@/assets/swedishFlag.png" width="30px" height="20px">
      </button>
    <h1 id="startHead"> {{uiLabels.welcome}} </h1>
  </header>
    <button class="BuildButton" @click="$router.push({ path: '/ordering'})"> {{uiLabels.buildBurger}} </button>
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



.startpage {
font-family: helvetica;
font-weight: lighter;
background-image: url('~@/assets/Burgerlogga.png') ;
}
h1 {
  font-size: 3em;
}

#startHead {
  text-align: center;
}

.BuildButton{
  border: none;
  color: black;
  padding: 5vh 5vh;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 35px;
  border-radius: 8px;
  top: 45%;
  left:37%;
  position: fixed;
}
.BuildButton:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor:pointer;
    transform:scale(1.1);
}
.langPic{
  height: 100%;
}

#langButton{
  position: absolute;
  top:30px;
  right:50px;
  padding:0;
  margin:0;
  background: transparent;
  border: transparent;
}

</style>
