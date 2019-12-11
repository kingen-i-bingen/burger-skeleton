<template>
  <body>
  <div id="ordering">
    <header id="header">
        <!-- <img class="example-panel" src="@/assets/exampleImage.jpg"> -->
        <button v-on:click="switchLang()">{{ uiLabels.language }}</button>
        <h1>{{ uiLabels.headline }}</h1>
    </header>
    <div class="wrapper">
      <h1 id="category"> {{uiLabels.choose}} {{ arrayOfLabels }}</h1>

      <div class="tabs">
        <button class="tablinks" v-on:click="changeCategory(1, 'tab1')" :class="{active: activeTab === 'tab1' }">{{ uiLabels.arrayOfLabels[0]}}</button>
        <button class="tablinks" v-on:click="changeCategory(2, 'tab2')" :class="{active: activeTab === 'tab2' }">{{ uiLabels.arrayOfLabels[1] }}</button>
        <button class="tablinks" v-on:click="changeCategory(3, 'tab3')" :class="{active: activeTab === 'tab3' }">{{ uiLabels.arrayOfLabels[2] }}</button>
        <button class="tablinks" v-on:click="changeCategory(4, 'tab4')" :class="{active: activeTab === 'tab4' }">{{ uiLabels.arrayOfLabels[3] }}</button>
        <button class="tablinks" v-on:click="changeCategory(5, 'tab5')" :class="{active: activeTab === 'tab5' }">{{ uiLabels.arrayOfLabels[4] }}</button>
        <button class="tablinks" v-on:click="changeCategory(6, 'tab6')" :class="{active: activeTab === 'tab6' }">{{ uiLabels.arrayOfLabels[5] }}</button>
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
          <button id="PreviousButton" v-on:click="previousCategory()" :disabled="category === 1">{{uiLabels.previous}}</button>
          <button id="NextButton" v-on:click="nextCategory()" v-show="category != 6"><span>{{uiLabels.next}}</span></button>
        </div>
      <div class="Box c">
    <h1>{{ uiLabels.order }}</h1>
    <div v-for="chosen in countAllIngredients" :key="countAllIngredients.indexOf(chosen)">
    <!-- {{ chosenIngredients.map(item => item["ingredient_"+lang]).join("\n") }}, {{ price }} kr   {{chosen["ingredient_"+lang] }} -->
    {{ chosen.count }}x  {{chosen.name}} {{chosen.itemPrice*chosen.count}} :-<br>
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
      chosenIngredients: [],
      price: 0,
      orderNumber: "",
      category: 1,
      activeTab: 'tab1'
    }
  },
  created: function () {
    this.$store.state.socket.on('orderNumber', function (data) {
      this.orderNumber = data;
    }.bind(this));
  },
  computed: {
    countAllIngredients: function() {
      let ingredientTuples = [];
      for (let i = 0; i < this.chosenIngredients.length; i += 1) {
        ingredientTuples[i] = {};
        ingredientTuples[i].name = this.chosenIngredients[i]['ingredient_' + this.lang];
        ingredientTuples[i].itemPrice = this.chosenIngredients[i]['selling_price'];
        ingredientTuples[i].count = this.countNumberOfIngredients(this.chosenIngredients[i].ingredient_id);
      }
      var difIngredients = Array.from(new Set(ingredientTuples.map(o => o.name)))
      .map(name=> {
        return{
          name: name,
          itemPrice: ingredientTuples.find(o => o.name === name).itemPrice,
          count: ingredientTuples.find(o => o.name === name).count
                          };
                        });
                console.log(difIngredients);
                return difIngredients;
          },
    arrayOfLabels: function() {
      return this.uiLabels.arrayOfLabels[this.category-1]
    }
  },
  methods: {
    changeCategory: function (number, button) {
      this.category = number;
      this.activeTab = button;

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
        this.activeTab= "tab"+this.category;
      }
    },
    previousCategory: function (){
      if (this.category>1){
        this.category -= 1;
        this.activeTab= "tab"+this.category;
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

body{
font-family: helvetica;

}

h1{
  font-weight: lighter;
}

#header h1{
  text-align: center;
  font-weight: lighter;

}

#header button{
  background-color: #E8E5E2; //Villes secial light grey
  border-radius:8px;
  border:none;
  padding: 10px 25px;
  text-align: center;
  color: black;

}

#header button:hover{
  cursor:pointer;
  transform:scale(1.1);
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
position: fixed;
top: 90vh;
right: 29vw;
opacity: 0.9;
}
#NextButton:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
cursor:pointer;
transform:scale(1.1);
  transition: 0.5s;
}
#NextButton:active {
  box-shadow: 0 7px 10px 0 rgba(0,0,0,0.24), 0 12px 30px 0 rgba(0,0,0,0.19);
  transform:scale(1.05);
}
#NextButton span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

#NextButton span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}
#NextButton:hover span {
  padding-right: 25px;
}

#NextButton:hover span:after {
  opacity: 1;
  right: 0;
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
position: fixed;
top: 90vh;
opacity: 0.9;
}

#PreviousButton:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
cursor:pointer;
transform:scale(1.1);
}
#PreviousButton:active {
  box-shadow: 0 7px 10px 0 rgba(0,0,0,0.24), 0 12px 30px 0 rgba(0,0,0,0.19);
  transform:scale(1.05);
}
#PreviousButton:disabled{
  opacity: 50%;
  pointer-events: none;
}

.tablinks {
  float: left;
  border-width: 0.1em;
  border-color: darkgray;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  background-color: #ddd;
  width: 8vw;

}

.tablinks:hover {

  transform:scale(1.05);
  /*transform-origin: bottom;*/
  box-shadow:1px 1px 3px rgba(0,0,0,0.5);
  background-color: white;
}

.active {
  background-color: inherit;
  border-bottom: none;
  pointer-events: none;

}


.wrapper{
display:grid;
grid-template-columns: 66vw 30vw;
grid-gap: 2em;
}
.tabs{
  grid-column: 1;
  grid-row: 2;
  padding-left: 8vw;

}
.a{
  grid-column: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill,12em);
  grid-gap:1em;
  overflow-y:auto;
  grid-row: 3;
  margin-bottom: 15vh;
  padding-left: 15vw;
}
.b{
  grid-column: 1;
  grid-row: 4;
  position: sticky;
}
.c{
  position: fixed;
  right: 2vw;
  border: 3px solid #ccd;
  border-radius: 1em;
  height: 80vh;
  width: 25vw;
  top:15vh;
  grid-column: 2;
  grid-row: 1 / span 3;
  text-align: center;
  overflow-y: auto;

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
  border-radius: 1em;
  text-align: center;
}
</style>
