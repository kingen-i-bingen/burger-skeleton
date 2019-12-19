<template>
<body id="stockpage">
<h1>{{uiLabels.stockPage}}</h1>
<button id="langButton" v-on:click="switchLang()">
  <img id="langPic" v-if="flag_en" src="@/assets/englishFlag.webp" width="30px" height="20px">
  <img id="langPic" v-if="flag_sv" src="@/assets/swedishFlag.png" width="30px" height="20px">
</button>
<div id="stock">
  <div class="ingredients" v-for="item in ingredients" :key="item.ingredient_id">
      {{item["ingredient_"+ lang]}}: <br><br>{{item.stock }} {{uiLabels.inStock}}
      <br><br>
      <input v-model.number="numbers[item.ingredient_id]" type="number" placeholder="Add to stock" id="antal" name="antal"><br>
      <button v-on:click="add(item);clearInput(item.ingredient_id)">Confirm</button>
  </div>
</div>
</body>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue'
import OrderItemToPrepare from '@/components/OrderItemToPrepare.vue'
import Ingredient from '@/components/Ingredient.vue'

//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'

export default {
  name: 'stockpage',
  components: {
    OrderItem,
    OrderItemToPrepare,
    Ingredient

  },
  mixins: [sharedVueStuff], // include stuff that is used in both
                            //the ordering system and the kitchen
  data: function(){
    return {
      chosenIngredients: [],
      price: 0,
      numbers: {}
    }
  },

  computed: {

    },
  methods: {
   add: function(item){
     this.$store.state.socket.emit('updateStock', {
      ingredient: item
    }, item.stock + this.numbers[item.ingredient_id])
    },
   clearInput: function(id){
     this.numbers[id] = null;
   }
 }

}
</script>

<style>
#stockpage{
  font-family: helvetica;
  background-color: rgb(44,44,44);
}
#stockpage h1{
  text-align:center;
  margin: 0px;
  padding: 0.5em;
  color: whitesmoke;
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


#langPic{
  height: 100%;
}
#stock{
  display: grid;
  grid-template-columns: repeat(auto-fill,15em);
  grid-gap: 1vw;
  margin-left: 3em;
}
.ingredients{
  border: 1px solid #ccd;
  padding: 1em 0em 1em 0em;
  background-color: whitesmoke;
  color: black;
  font-weight: bold;
  border-radius: 1em;
  text-align: center;
}

</style>
