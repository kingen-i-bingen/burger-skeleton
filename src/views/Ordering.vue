<template>
  <div id="ordering">
    <header id="header">
        <!-- <img class="example-panel" src="@/assets/exampleImage.jpg"> -->
        <button v-on:click="switchLang()">{{ uiLabels.language }}</button>
        <h1>{{ uiLabels.headline }}</h1>
    </header>
    <div class="wrapper">
      <h1 id="category">{{ arrayOfLabels }}</h1>

      <div class="tab">
        <button class="tablinks" v-on:click="changeCategory(1)">Patty</button>
        <button class="tablinks" v-on:click="changeCategory(2)">Toppings</button>
        <button class="tablinks" v-on:click="changeCategory(3)">Sauce</button>
        <button class="tablinks" v-on:click="changeCategory(4)">Bread</button>
        <button class="tablinks" v-on:click="changeCategory(5)">Sides</button>
        <button class="tablinks" v-on:click="changeCategory(6)">Drinks</button>
      </div>
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
          <button id="PreviousButton" v-on:click="previousCategory()">{{uiLabels.previous}}</button>
          <button id="NextButton" v-on:click="nextCategory()">{{uiLabels.next}}</button>
        </div>
      <div class="Box c">
    <h1>{{ uiLabels.order }}</h1>
    <div v-for="chosen in countAllIngredients" :key="countAllIngredients.indexOf(chosen)">
    <!-- {{ chosenIngredients.map(item => item["ingredient_"+lang]).join("\n") }}, {{ price }} kr   {{chosen["ingredient_"+lang] }} -->
    {{ chosen.count }}x  {{chosen.name}} :-<br>
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
  computed: {
    countAllIngredients: function() {
      let ingredientTuples = []
      for (let i = 0; i < this.chosenIngredients.length; i += 1) {
        ingredientTuples[i] = {};
        ingredientTuples[i].name = this.chosenIngredients[i]['ingredient_' + this.lang];
        ingredientTuples[i].count = this.countNumberOfIngredients(this.chosenIngredients[i].ingredient_id);
      }
      var difIngredients = Array.from(new Set(ingredientTuples.map(o => o.name)))
      .map(name=> {
        return{
          name: name,
          count: ingredientTuples.find(o => o.name === name).count
                          };
                        });
                return difIngredients;
          },
    arrayOfLabels: function() {
      return this.uiLabels.arrayOfLabels[this.category-1]
    }
  },
  methods: {
    changeCategory: function (number) {
      this.category = number;
    },
    countNumberOfIngredients: function (id) {
      let counter = 0;
      for (let item in this.chosenIngredients) {
              if (this.chosenIngredients[item].ingredient_id === id) {
                counter +=1;
              }
          }
      return counter;
    },
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
#category{
  text-align: center;
}
#NextButton {
background-color: #4CAF50; /* Green */
border: none;
color: white;
padding: 15px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
border-radius: 8px;
}
#NextButton:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
cursor:pointer;
}

#PreviousButton {
background-color: #f44336; /* Red */
border: none;
color: white;
padding: 15px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
border-radius: 8px;
}

#PreviousButton:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
cursor:pointer;
}
.wrapper{
display:grid;
grid-template-columns: 66vw 30vw;
grid-gap: 2em;
}
.tab{
  grid-column: 1;
  grid-row: 2;

}
.a{
  grid-column: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill,12em);
  grid-gap:1em
}
.b{
  grid-column: 1;
  grid-row: 4;
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
