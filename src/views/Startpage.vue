<template>
    <div class="startpage">

          <button id="langButton" v-on:click="switchLang()">
            <img class="langPic" v-if="flag_en" src="@/assets/englishFlag.webp" width="30px" height="20px">
            <img class="langPic" v-if="flag_sv" src="@/assets/swedishFlag.png" width="30px" height="20px">
          </button>

          <h1 id="startHead"> {{uiLabels.welcome}} </h1>
          <img class="logPic"  src="@/assets/burglog.png" width="150vw" height="150vh">

        <button class="BuildButton" @click="$router.push({ path: '/ordering'})"> {{uiLabels.buildBurger}} </button>
    </div>
</div>
</body>
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
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed|Shadows+Into+Light&display=swap');



.startpage {
  background-color: rgb(38, 38, 38);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 98vh;
  width: 99vw;
  color: white;
  font-family: 'Shadows Into Light', cursive;  font-weight: lighter;
}
h1 {
  text-align:center;
  font-size: 5em;
  font-weight: lighter;
  padding:0;
  padding-top: 20vh;
  border: 0;
  margin:0;
  top: 40vh;

  /* position: fixed;
  left:22vw;*/

  color: lightgray;

}

.BuildButton{
  border: none;
  color: white;
  padding: 5vh 5vh;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  color: lightgray;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 35px;
  border-radius: 8px;
  top: 60%;
  left:39%;
  position: fixed;
  background: transparent;
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);

}

.BuildButton:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor:pointer;
    transform:scale(1.1);
}
.langPic{
  height: 100%;
}

.logPic{
  position: fixed;
  top: 5vh;
  left: 3vw;
  transform: rotate(-10deg);
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

/* url('~@/assets/burgback.jpg') ; carambi */

</style>
