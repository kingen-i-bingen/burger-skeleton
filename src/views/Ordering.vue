<template>
  <div id="ordering">
    <header id="header">
        <!-- <img class="example-panel" src="@/assets/exampleImage.jpg"> -->
        <button v-on:click="switchLang()">{{ uiLabels.language }}</button>
        <h1>{{ uiLabels.headline }}</h1>
    </header>
    <div class="wrapper">
      <h1>{{ uiLabels.ingredients }}</h1>
      <div class="Box a">
          <Ingredient
          ref="ingredient"
          v-for="item in ingredients"
          v-show="item.category===category"
          v-on:increment="addToOrder(item)"
          v-on:remove="removeFromOrder(item)"
          :item="item"
          :lang="lang"
          :key="item.ingredient_id">
          </Ingredient>
        </div>
        <div class="Box b">
        <button v-on:click="nextCategory()">{{uiLabels.next}}</button><button v-on:click="previousCategory()">{{uiLabels.previous}}</button>
        </div>
      <div class="Box c">
    <h1>{{ uiLabels.order }}</h1>
    <div v-for="chosen in chosenIngredients">
    <!-- {{ chosenIngredients.map(item => item["ingredient_"+lang]).join("\n") }}, {{ price }} kr   {{chosen["ingredient_"+lang] }} -->
    {{ chosen["ingredient_"+lang] }}:  {{chosen["selling_price"]}} :-<br>
    </div>
    <br>
    {{ price }} kr
    <button v-on:click="placeOrder()">{{ uiLabels.placeOrder }}</button>
    <h1>{{ uiLabels.ordersInQueue }}</h1>
      <div>
        <OrderItem
              v-for="(order, key) in orders"
              v-if="order.status !== 'done'"
              :order-id="key"
              :order="order"
              :ui-labels="uiLabels"
              :lang="lang"
              :key="key">
        </OrderItem>
      </div>
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
      chosenIngredients: [],
      price: 0,
      orderNumber: "",
      category: 1
    }
  },
  created: function () {
    this.$store.state.socket.on('orderNumber', function (data) {
      this.orderNumber = data;
    }.bind(this));
  },
  methods: {
    nextCategory: function (){
    if (this.category<6){
      this.category += 1;
    }
    },
    previousCategory: function (){
      if (this.category>1){
        this.category -= 1;
      }
    },
    addToOrder: function (item) {
      this.chosenIngredients.push(item);
      this.price += +item.selling_price;
    },
    removeFromOrder: function (item){
      this.chosenIngredients.splice(this.chosenIngredients.indexOf(item),1);
      this.price += -item.selling_price;
    },
    placeOrder: function () {
      var i,
      //Wrap the order in an object
        order = {
          ingredients: this.chosenIngredients,
          price: this.price
        };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      this.$store.state.socket.emit('order', {order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.price = 0;
      this.chosenIngredients = [];
    }
  }
}
</script>
<style scoped>
/* scoped in the style tag means that these rules will only apply to elements, classes and ids in this template and no other templates. */
#ordering {
  margin: 0em 2vw;
  /* margin:auto; */
  /* width: 40em; */
}
#header h1{
  text-align: center;
}

.wrapper{
display:grid;
grid-template-columns: 66vw 30vw;
grid-gap: 2em;
}

.a{
  grid-column: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill,12em);
  grid-gap:1em
}
.b{
  display: grid;
  grid-column: 1;
  grid-row: 3;
}
.c{
  position: fixed;
  right: 1em;
  border: 3px solid #ccd;
  border-radius: 1em;
  height: 90vh;
  width: 25vw;
  grid-column: 2;
  grid-row: 1 / span 3;
  text-align: center;

}

.example-panel {
  position: fixed;
  left:0;
  top:0;
  z-index: -2;
}
.ingredient {
  border: 1px solid #ccd;
  padding: 1em;
  background-image: url('~@/assets/exampleImage.jpg');
  color: white;
  border-radius: 2em;
  text-align: center;
}
</style>
