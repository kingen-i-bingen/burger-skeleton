<template>
<div id="stock">
  <div class="ingredients" v-for="item in ingredients" :key="item.ingredient_id">
      {{item["ingredient_"+ lang]}}: {{item.stock}}
      <br>
      <input v-model.number="numbers[item.ingredient_id]" type="number" placeholder="Add to stock">
      <button v-on:click="add(item);clearInput(item.ingredient_id)"> HEJ </button>
  </div>
</div>
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

   },
   clearInput: function(id){
     this.numbers[id] = null;
   }
 }

}
</script>

<style>

</style>
