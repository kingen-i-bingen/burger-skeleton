<template>
  <body>
  <div id="ordering">
    <header id="header">
        <img class="bg" src="@/assets/background_burg.png">
        <button id="langButton" v-on:click="switchLang()">
          <img id="langPic" v-if="flag_en" src="@/assets/englishFlag.webp" width="30px" height="20px">
          <img id="langPic" v-if="flag_sv" src="@/assets/swedishFlag.png" width="30px" height="20px">
        </button>
        <button id="cancelOrder" @click="$router.push({ path: '/'})">
          <img id="CancelSym" src="@/assets/cancel-icon.png" width="40px" height="40px">
        </button>
        <h1 v-show="category === 7">{{ uiLabels.myOrder }}</h1>
    </header>
    <div class="wrapper" v-show="category !== 7 && category !== 8">
      <h1 id="category"> {{uiLabels.choose}} {{ arrayOfLabels }}</h1>

      <div class="tabs">
        <button class="tablinks" v-on:click="changeCategory(1, 'tab1')" :class="{active: activeTab === 'tab1' }"
        v-bind:style=" checkCategory(1) ? 'color: green; font-weight:bold;' : 'color: white' ">{{ uiLabels.arrayOfLabels[0]}}</button>
        <button class="tablinks" v-on:click="changeCategory(2, 'tab2')" :class="{active: activeTab === 'tab2' }" v-bind:style=" checkCategory(2) ? 'color: green; font-weight:bold;' : 'color: white' ">{{ uiLabels.arrayOfLabels[1] }}</button>
        <button class="tablinks" v-on:click="changeCategory(3, 'tab3')" :class="{active: activeTab === 'tab3' }" v-bind:style=" checkCategory(3) ? 'color: green; font-weight:bold;' : 'color: white' ">{{ uiLabels.arrayOfLabels[2] }}</button>
        <button class="tablinks" v-on:click="changeCategory(4, 'tab4')" :class="{active: activeTab === 'tab4' }" v-bind:style=" checkCategory(4) ? 'color: green; font-weight:bold;' : 'color: white' ">{{ uiLabels.arrayOfLabels[3] }}</button>
        <button class="tablinks" v-on:click="changeCategory(5, 'tab5')" :class="{active: activeTab === 'tab5' }" v-bind:style=" checkCategory(5) ? 'color: green; font-weight:bold;' : 'color: white' ">{{ uiLabels.arrayOfLabels[4] }}</button>
        <button class="tablinks" v-on:click="changeCategory(6, 'tab6')" :class="{active: activeTab === 'tab6' }" v-bind:style=" checkCategory(6) ? 'color: green; font-weight:bold;' : 'color: white' ">{{ uiLabels.arrayOfLabels[5] }}</button>
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
          :key="item.ingredient_id"
          v-bind:style=" chosenIngredients.includes(item) ? 'border: 2px solid green; box-shadow: 0 1px 4px 0 green, 0 2px 5px 0 green;' : 'border: 2px solid #ccd;' ">
          </Ingredient>
        </div>
        <div class="Box b">
          <button class="PreviousButton" v-on:click="previousCategory()" :disabled="category === 1"><span>{{uiLabels.previous}}</span></button>
          <button class="NextButton" v-on:click="nextCategory()" :disabled="category===6"><span>{{uiLabels.next}}</span></button>
        </div>
      <div class="Box c">
  <h1>{{uiLabels.menu}} {{uiLabels.number}} {{burgerNumber+1}}</h1>
    <div id= "priset">
      {{uiLabels.menuPrice}}: {{ price }} kr
    </div>
    <br>
    <div id="summaryContent" v-for="chosen in countAllIngredients" :key="countAllIngredients.indexOf(chosen)">
        <button class="modifyOrder" v-on:click="summaryRemove(chosen)">-</button>
        {{ chosen.count }}
        <button class="modifyOrder" v-on:click="summaryAdd(chosen)">+</button>
        {{chosen.name}} {{chosen.itemPrice*chosen.count}} kr<br>
    </div>
    </div>

        <div class="Box d">
            <div class="Box b">
                <button class="OrderSummary" v-on:click="toSummary()" >{{uiLabels.orderSummary}} {{price}} kr</button>
            </div>

        </div>
  </div>
  <div id="orderScreen" v-show="category === 7">
      <div id="orderMenu">
        <div id= "orderBoxes">
        <div v-for="burger in countAllIngredientsInAllBurgers" id="differentBurgersBox" :key="countAllIngredientsInAllBurgers.indexOf(burger)">
            <button id="removeOrder" v-on:click="removeOrder(burger.number)">X</button>
        <span id="differentMenus">{{uiLabels.menu}} {{burger.number+1}}</span>
        <label>
        <button id="changeBurgerButton" v-on:click="changeBurger(burger.number)">{{uiLabels.change}}</button>
        <img id = "changePic" src="@/assets/edit_pen.png" width="15px" height="13px">
      </label><br>
        <br>
            <div v-for="chosen in burger.burgerIngredients" :key="burger.burgerIngredients.indexOf(chosen)">
            {{ chosen.count }}x  {{chosen.name}} {{chosen.itemPrice}}:-<br>
            </div>
        <h4>Price: {{burger.burgerPrice}} kr</h4>
      </div>
      </div>

  </div>
      <div id= "totalpris">
          {{uiLabels.totalPrice}}{{totalPrice()}} kr
      </div>
  <button id="placeOrderButton" v-on:click="placeOrder()">{{ uiLabels.placeOrder }} {{totalPrice()}} kr </button>
  <button id="newBurgerButton" v-on:click="addAnotherBurger()"> {{uiLabels.newMenu}} </button>
  </div>
  <div v-show="category === 8">
    <h1 id="thankYouOrder"> {{uiLabels.thankOrder}} </h1>
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
  name: 'ordering',
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
      activeTab: 'tab1',
      currentOrder: {
           burgers: []
         },
      burgerNumber: 0
    }
  },
  beforeRouteLeave (to, from, next) {
			this.$dialog.confirm('Do you want to cancel? Your order will be lost!')
			.then(function () {
				next();
			})
			.catch(function () {
				next(false);
			});
		},

  created: function () {
    this.$store.state.socket.on('orderNumber', function (data) {
      this.orderNumber = data;
    }.bind(this));
  },
  computed: {
    countAllIngredientsInAllBurgers: function() {
      let burgerList = [];
      for (let j = 0; j < this.currentOrder.burgers.length; j += 1) {
          let ingredientTuples = [];
          for (let i = 0; i < this.currentOrder.burgers[j].ingredients.length; i += 1) {
            ingredientTuples[i] = {};
            ingredientTuples[i].name = this.currentOrder.burgers[j].ingredients[i]['ingredient_' + this.lang];
            ingredientTuples[i].itemPrice = this.currentOrder.burgers[j].ingredients[i]['selling_price'];
            ingredientTuples[i].count = this.countNumberOfIngredientsAll(this.currentOrder.burgers[j].ingredients[i].ingredient_id,j);
          }
          var difIngredients = Array.from(new Set(ingredientTuples.map(o => o.name)))
          .map(name=> {
            return{
              name: name,
              itemPrice: ingredientTuples.find(o => o.name === name).itemPrice,
              count: ingredientTuples.find(o => o.name === name).count
                              };
                            });
            burgerList[j] = {}
            burgerList[j].number = j;
            burgerList[j].burgerIngredients = difIngredients;
            burgerList[j].burgerPrice = this.currentOrder.burgers[j].price;
            }
            return burgerList
          },
    countAllIngredients: function() {
      let ingredientTuples = []
      for (let i = 0; i < this.chosenIngredients.length; i += 1) {
        ingredientTuples[i] = {};
        ingredientTuples[i].name = this.chosenIngredients[i]['ingredient_' + this.lang];
        ingredientTuples[i].id = this.chosenIngredients[i]['ingredient_id'];
        ingredientTuples[i].itemPrice = this.chosenIngredients[i]['selling_price'];
        ingredientTuples[i].count = this.countNumberOfIngredients(this.chosenIngredients[i].ingredient_id);
      }
      var difIngredients = Array.from(new Set(ingredientTuples.map(o => o.name)))
      .map(name=> {
        return{
          name: name,
          id: ingredientTuples.find(o => o.name === name).id,
          itemPrice: ingredientTuples.find(o => o.name === name).itemPrice,
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

    totalPrice: function () {
      let value=0
      for (let j = 0; j < this.currentOrder.burgers.length; j += 1){
        value+= this.currentOrder.burgers[j].price
      }
      return value;
    },

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
    countNumberOfIngredientsAll: function (id, burgerId) {
      let counter = 0;
      for (let item in this.currentOrder.burgers[burgerId].ingredients) {
              if (this.currentOrder.burgers[burgerId].ingredients[item].ingredient_id === id) {
                counter +=1;
              }
          }
      return counter;
    },
    nextCategory: function (){

        this.category += 1;
        this.activeTab= "tab"+this.category;


    },
    previousCategory: function (){
      if (this.category==7){
        this.category -= 1;
        this.activeTab= "tab"+this.category;
        this.chosenIngredients = this.currentOrder.burgers[this.burgerNumber].ingredients;
        this.price = this.currentOrder.burgers[this.burgerNumber].price;
        for (let i = 0; i < this.chosenIngredients.length; i += 1) {
          this.$refs.ingredient[this.chosenIngredients[i].ingredient_id-1].restoreCounter();
        }
      }
      else{
        this.category -= 1;
        this.activeTab= "tab"+this.category;
      }
    },
    toSummary: function() {
        this.category = 7;
        if (this.burgerNumber==this.currentOrder.burgers.length ) {
            if (this.chosenIngredients.length > 0) {
                this.currentOrder.burgers.push({
                    ingredients: this.chosenIngredients,
                    price: this.price
                });
            }
        }
        else {
            if (this.chosenIngredients.length > 0) {
                let order = {
                    ingredients: this.chosenIngredients,
                    price: this.price

                };

                this.currentOrder.burgers.splice(this.burgerNumber, 1, order);
            }
            else{
                this.currentOrder.burgers.splice(this.burgerNumber, 1);
            }
        }
        //set all counters to 0. Notice the use of $refs
        for (let i = 0; i < this.$refs.ingredient.length; i += 1) {
            this.$refs.ingredient[i].resetCounter();
        }
        this.chosenIngredients = [];
        this.price = 0;

        },
      removeOrder:function(id){
          this.currentOrder.burgers.splice(id, 1)
      },

    changeBurger: function(id){
      this.category = 1;
      this.activeTab = "tab"+this.category;
      this.burgerNumber = id;
      this.chosenIngredients = this.currentOrder.burgers[this.burgerNumber].ingredients;
      this.price = this.currentOrder.burgers[this.burgerNumber].price;
      for (let i = 0; i < this.chosenIngredients.length; i += 1) {
        this.$refs.ingredient[this.chosenIngredients[i].ingredient_id-1].restoreCounter();
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
    summaryRemove: function (item) {
        this.$refs.ingredient[item.id-1].removeCounter();
    },
    summaryAdd: function(item) {
        this.$refs.ingredient[item.id-1].incrementCounter();
    },

    placeOrder: function () {
      for (let j = 0; j < this.currentOrder.burgers.length; j += 1){

        let order = {
            ingredients: this.currentOrder.burgers[j].ingredients,
            price: this.currentOrder.burgers[j].price
          };

      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      this.$store.state.socket.emit('order', {order: order});
    }
    this.category = 8;
    },
    addAnotherBurger: function(){
      this.category = 1;
      this.burgerNumber = this.currentOrder.burgers.length;
      this.activeTab ="tab1";
    },

    checkCategory: function(number) {
      let categoryExist = false;
      for (let item in this.chosenIngredients) {
        if (this.chosenIngredients[item].category===number){
          categoryExist = true;
        }
      }
      return categoryExist;
    }
  }

}
</script>
<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed|Shadows+Into+Light&display=swap');
/* scoped in the style tag means that these rules will only apply to elements, classes and ids in this template and no other templates. */
#ordering {
  margin: 0em 2vw;
  /* margin:auto; */
  /* width: 40em; */
}
.bg {
    position: fixed;
    z-index: -2;
    opacity: 20%;
    top: -6vh;


}

body{
    font-family: 'Roboto Condensed', sans-serif;
    color:white;


}

h1{
  font-weight: lighter;
}

#header h1{
  text-align: center;
  font-weight: lighter;

}
#header button:hover{
  cursor:pointer;
  transform:scale(1.1);
}
#header button:active {
    transform:scale(1);
}
#category{
  text-align: center;
}
.b  button {
  border: none;
  color: white;
  padding: 2vh 0.5vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
  border-radius: 8px;
}

.NextButton {
background-color: mediumblue; /* Green */
height: 7vh;
width: 12vw;
right: 29vw;
top: 90vh;
position: fixed;

}

.PreviousButton {
background-color: #f44336; /* Red */
height: 7vh;
width: 12vw;
top: 90vh;
position: fixed;

}

.OrderSummary {
    background-color: #006400; /* Green */
    height: 9vh;
    width: 15vw;
    position: relative;
    top: 3.5vh;
    left: 5.5vw;

}

.b button:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  cursor:pointer;
  transform:scale(1.1);
}
.b button:active {
  box-shadow: 0 7px 10px 0 rgba(0,0,0,0.24), 0 12px 30px 0 rgba(0,0,0,0.19);
  transform:scale(1.05);
}
.b button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}
.b button span:after {
    position: absolute;
    opacity: 0;
    top: 0;
    transition: 0.5s;
}

.NextButton span:after {
  content: '\00bb';
  right: -20px;

}

.NextButton:hover span {
  padding-right: 25px;
}

.NextButton:hover span:after {
  opacity: 1;
  right: 0;
}

.NextButton:disabled{
    opacity: 20%;
    pointer-events: none;
}


.PreviousButton:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  cursor:pointer;
  transform:scale(1.1);

}
.PreviousButton span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.PreviousButton span:after {
  content: '\00ab';
  left: -20px;
  position: absolute;
  opacity: 0;
  top: 0;
  transition: 0.5s;
}
.PreviousButton:hover span{
  padding-left: 30px;

}

.PreviousButton:hover span:after {
  opacity: 1;
  left: 0;
}

.PreviousButton:disabled{
  opacity: 20%;
  pointer-events: none;
}

.OrderSummary span:after {
    content: '\00bb';
    right: -20px;
}

.OrderSummary:hover span {
    padding-right: 25px;
}
.OrderSummary:hover span:after {
    opacity: 1;
    right: 0;
}

.c button {
    background-color: transparent;
    border: black;
    color: #BC0022;
    padding: 0.5em 1em 0.55em 1em;
    text-decoration: none;
    display: inline-block;
    position: relative;
    font-size: 15px;
    font-weight: bolder;
    border-radius: 8px;
}

.c button:hover {
    cursor: pointer;
    transform:scale(1.05);
    box-shadow:1px 1px 3px rgba(0,0,0,0.5);
}

.c button:active {
    box-shadow: none;
    transform: none;
}

.tablinks {
  float: left;
  border-width: 0.2em;
  border-color: whitesmoke;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  background-color: inherit;
  width: 8vw;


}

.tablinks:hover {

  transform:scale(1.05);
  box-shadow:1px 1px 3px rgba(0,0,0,0.5);
  background-color: rgb(60, 60, 60);;
    border-bottom: none;
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
  text-align: left;
  grid-column: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill,12em);
  grid-gap:1em;
  overflow-y:auto;
  grid-row: 3;
  margin-bottom: 15vh;
  padding-left: 15vw;
  padding-right: 10vw;
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
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  height: 65vh;
  width: 25vw;
  top:15vh;
  grid-column: 2;
  grid-row: 1 / span 3;
  text-align: center;
  overflow-y: auto;
  background-color: #d9d9d9;
  color: black;
}


.d {
    position: fixed;
    right: 2vw;
    border: 3px solid #ccd;
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    height: 15vh;
    width: 25vw;
    top:80vh;
    background-color: #d9d9d9;
}

#summaryContent {
    text-align: left;
    padding-left: 1vw;
}
.example-panel {
  position: fixed;
  left:0;
  top:0;
  z-index: -2;
}
.ingredient {
  border: 1px solid #ccd;
  padding: 1em 0em 1em 0em;
  /*background-image: url('~@/assets/exampleImage.jpg');*/
  background-color: #d9d9d9;
    opacity: 90%;
  color: black;
  font-weight: bold;
  border-radius: 1em;
  text-align: center;
}
#priset{
  font-size: 22px;
}

#totalpris{
  font-size: 30px;
  /* position: absolute; */
    border: 3px solid #ccd;
    border-top: none;
    border-bottom-right-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  /* bottom: 5vh;
  left: 27vw; */
  grid-row: 2;
    grid-column: 2;
    padding: 0.8em;
    width: inherit;
    margin-bottom: 2vh;


}
#orderScreen{
  display:grid;
  grid-template-columns: 16vw 60vw 21vw;
}
#orderMenu{

    padding: 1vw;
    grid-column: 2;
    border: 3px solid #ccd;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    min-height: 69vh;
}

#orderBoxes{
  display:grid;
  grid-row: 1;
  grid-gap: 1vw;
  grid-template-columns: repeat(auto-fill,14em);
}
#orderMenu h1{
  text-align: center;
}
#differentBurgersBox{
  padding: 1vw;
}
#differentMenus{
  font-weight: bold;
  font-size: 20px;
}
#placeOrderButton {
background-color: #006400; /* Green */
border: none;
color: white;
padding: 2vh 2vh;
height: 17vh;
width: 17vw;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 20px;
font-weight: bold;
border-radius: 8px;
position: fixed;
top: 80vh;
right: 1.5vw;
opacity: 0.9;
}
#placeOrderButton:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
cursor:pointer;
transform:scale(1.1);
}
#placeOrderButton:active {
  box-shadow: 0 7px 10px 0 rgba(0,0,0,0.24), 0 12px 30px 0 rgba(0,0,0,0.19);
  transform:scale(1.05);
}
#placeOrderButton span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

#placeOrderButton span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

#placeOrderButton:hover span {
  padding-right: 25px;
}

#placeOrderButton:hover span:after {
  opacity: 1;
  right: 0;
}
#newBurgerButton {
background-color: #6699FF; /* Green */
border: none;
color: white;
padding: 2vh 2vh;
height: 13vh;
width: 17vw;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 20px;
border-radius: 8px;
position: fixed;
top: 63vh;
right: 1.65vw;
opacity: 0.9;
}
#newBurgerButton:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
cursor:pointer;
transform:scale(1.1);
}
#newBurgerButton:active {
  box-shadow: 0 7px 10px 0 rgba(0,0,0,0.24), 0 12px 30px 0 rgba(0,0,0,0.19);
  transform:scale(1.05);
}
#changeBurgerButton{
  font-size: 16px;
    color: white;
   background-color: transparent;
   text-decoration: underline;
   border: none;
   margin-left: 0.5em;
}

#changeBurgerButton:hover{
  cursor: pointer;
}
#orderScreen label:hover {
  cursor: pointer;
}

#removeOrder {
    font-size: 18px;
    font-weight: bold;
    color: firebrick;
    background-color: transparent;
    border: none;
    margin-right: 0.3em;
}
#removeOrder:hover {
    cursor: pointer;
    transform: scale(1.1);
}


#thankYouOrder{

    text-align: center;
    position:relative;
    top: 12vh;
    font-size: 52pt;
}

#changePic{
  background:transparent;

}


#langButton{
  position: fixed;
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
#cancelOrder{
  position: fixed;
  top:30px;
  padding:0;
  margin:0;
  background: transparent;
  border: transparent;
}
</style>
