<template>
<div id="orders">

  <div id="summaryOrder">
     <h1> {{uiLabels.ordersSummary}}</h1>
     <div v-for="countIng in countAllIngredients"
           v-if="countIng.count>0"
           :key="countAllIngredients.indexOf(countIng)">
         {{countIng.name}}: {{countIng.count}}
   </div>
  </div>

<div id="ordersQueue">
  <h1>{{ uiLabels.ordersInQueue }}</h1>
    <OrderItemToPrepare
      v-for="(order, key) in orders"
      v-if="order.status !== 'done'"
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
    <OrderItem
      v-for="(order, key) in orders"
      v-if="order.status === 'done'"
      :order-id="key"
      :order="order"
      :lang="lang"
      :ui-labels="uiLabels"
      :key="key">
    </OrderItem>
  </div>

</div>
</template>
<script>
import OrderItem from '@/components/OrderItem.vue'
import OrderItemToPrepare from '@/components/OrderItemToPrepare.vue'


//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'

export default {
  name: 'Ordering',
  components: {
    OrderItem,
    OrderItemToPrepare,

  },
  mixins: [sharedVueStuff], // include stuff that is used in both
                            //the ordering system and the kitchen
  data: function(){
    return {
      chosenIngredients: [],
      price: 0
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
          ingredientTuples[i].name = this.ingredients[i]['ingredient_' + this.lang];
          ingredientTuples[i].count = this.countNumberOfIngredients(this.ingredients[i].ingredient_id);
        }
        return ingredientTuples;
      }
    },

  methods: {

    markDone: function (orderid) {
      this.$store.state.socket.emit("orderDone", orderid);
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
     return counter;
   }
 }

}
</script>


<style scoped>



	#orders {
    font-size:16pt;
    display:grid;
    grid-gap:1px;
    grid-template-columns:33,33333333333vw 33,333333333333vw 33,33333333333vw;
    background-color: lightblue;

  }


#ordersQueue{
grid-column:1;
grid-row: 1;
border: 2px solid #ff9900;
margin:5px;
padding: 10px;



  }

  #summaryOrder {
grid-column: 2;
grid-row: 1;
border: 2px solid #ff9900;
margin:5px;
padding: 10px;



  }


  #finishedOrder{
grid-column:3;
grid-row: 1;
border: 2px solid #ff9900;
margin:5px;
padding: 10px;


  }



  h1 {
    text-transform: uppercase;
    font-size: 1.4em;
    text-align: center;
    border-bottom: solid 1px black;

  }
</style>
