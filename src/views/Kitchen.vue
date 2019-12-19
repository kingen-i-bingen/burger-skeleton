<template>
<div id="orders">

  <div id="summaryOrder">
     <h1> {{uiLabels.ordersSummary}}</h1>
     <div v-for="countIng in countAllIngredients"
           v-if="countIng.count>0"
           :key="countAllIngredients.indexOf(countIng)"> <br>
           {{countIng.name}}: {{countIng.count}} <br> <br>
            <button id="OneDoneButton" v-on:click="setOneDone(countIng)"> -1 </button>
   </div>
  </div>

<div id="ordersQueue">
  <h1>{{ uiLabels.ordersInQueue }}</h1>

    <OrderItemToPrepare
      v-for="(order, key) in orders"
      v-if="order.status === 'not-started'"
      v-on:done="markDone(key)"
      :order-id="key"
      :order="order"
      :ui-labels="uiLabels"
      :lang="lang"
      :key="key">

    </OrderItemToPrepare>
  </div>


  <div id="finishedOrder">
    <h1>{{ uiLabels.ordersFinished }}</h1>
    <OrderItemFinished
      v-for="(order, key) in orders"
      v-if="order.status === 'done'"
      v-on:taken="markTaken(key)"
      :order-id="key"
      :order="order"
      :lang="lang"
      :ui-labels="uiLabels"
      :key="key">

    </OrderItemFinished>

  </div>
</div>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue'
import OrderItemToPrepare from '@/components/OrderItemToPrepare.vue'
import OrderItemFinished from '@/components/OrderItemFinished.vue'

//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'

export default {
  name: 'Ordering',
  components: {
    OrderItem,
    OrderItemToPrepare,
    OrderItemFinished

  },
  mixins: [sharedVueStuff], // include stuff that is used in both
                            //the ordering system and the kitchen
  data: function(){
    return {
      chosenIngredients: [],
      price: 0,
      doneIngredients: []
    }
  },

  computed: {
      countBeef100: function() {
        return this.countNumberOfIngredients(2)
      },
      countAllIngredients: function() {
        let ingredientTuples = []
        for (let i = 0; i < this.ingredients.length; i += 1) {
          ingredientTuples[i] = {};
          ingredientTuples[i].id = this.ingredients[i].ingredient_id;
          ingredientTuples[i].name = this.ingredients[i]['ingredient_' + this.lang];
          ingredientTuples[i].count = this.countNumberOfIngredients(this.ingredients[i].ingredient_id);
        }
        return ingredientTuples;
      },
    },
  methods: {
    setOneDone: function (item) {
      this.doneIngredients.push(item)
    },
    markDone: function (orderid) {
      this.$store.state.socket.emit("orderDone", orderid);
    },

    markTaken: function(orderid) {
      console.log("and");
      this.$store.state.socket.emit("orderTaken", orderid);

    },

  countNumberOfIngredients: function (id) {
     let counter = 0;
     for (let order in this.orders) {
         for (let i = 0; i < this.orders[order].ingredients.length; i += 1) {
           if (this.orders[order].ingredients[i].ingredient_id === id) {
             counter +=1;
           }
         }
     }
     for (let i = 0; i < this.doneIngredients.length; i += 1) {
       if (this.doneIngredients[i].id === id) {
         counter -=1;
       }
     }
     return counter;
   }
 }

}
</script>


<style scoped>



	#orders {     /* wrapper*/
    font-size:18pt;
    font-family: 'Roboto Condensed', sans-serif;
    display:grid;
    grid-gap:1px;
    grid-template-columns:33vw 33vw 33vw;
    height: 96vh;
    width: 99vw;
    background-color: rgb(44,44,44);
    color: rgb(242, 242, 242);

  }


#ordersQueue{
grid-column:1;
grid-row: 1;
border: 5px solid;
border-radius: 10px;
overflow: auto;
margin:3px;
text-align: center;


  }

#ordersQueue h1{
  text-transform: uppercase;
  font-size: 24pt;
  font-weight:bold;
  text-align: center;
  border-bottom: solid 0.4vw;

}




  #summaryOrder {
grid-column: 2;
grid-row: 1;
border: 5px solid;
border-radius: 10px;
overflow: auto;
margin:3px;
text-align: center;

  }

#summaryOrder h1 {
  text-transform: uppercase;
  font-size: 24pt;
  font-weight:bold;
  border-bottom: solid 0.4vw;
  text-align: center;
}

#summaryOrder button {
  font-size: 26pt;
  border-radius: 30px;
  /* background-color: #98FB98; */
  background-color:rgb(240, 245, 245);
  border-color:rgb(51, 51, 204);
  border-width:0.5vw;
  color:rgb(0, 102, 34);
  font-weight: bolder;


}

#summaryOrder button:hover{
  background-color: lightgreen;

}

  #finishedOrder{
grid-column:3;
grid-row: 1;
border: 5px solid;
border-radius: 10px;
overflow: auto;
margin:3px;
text-align:center;
  }

#finishedOrder h1{
  text-transform: uppercase;
  font-size: 24pt;
  font-weight:bold;
  text-align: center;
  border-bottom: solid 0.4vw;
  /* border-bottom: solid 1px black; */
  /* border:solid;
  border-radius:3vw; */
}

/* #OneDoneButton {
position:absolute;
right:35vw;
overflow: auto;

} */




</style>
