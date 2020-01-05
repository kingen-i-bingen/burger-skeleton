<template>
  <div class="ingredient">
    <div id="orderButtons">
      <span>{{item["ingredient_"+ lang]}}</span>
      <br>
      {{item.selling_price}} kr {{checkIfOut(item.stock)}}
      <br>
      <button class="removeButton" v-on:click="removeCounter" :disabled="counter === 0">-</button>    {{ counter }}
      <button class="addButton" v-on:click="incrementCounter">+</button>
      <br>
      <img src="@/assets/milk_free.png" v-show="item.milk_free===1" height="20em" width="20em">
      <img src="@/assets/gluten_free.png" v-show="item.gluten_free===1" height="20em" width="20em">
      <img src="@/assets/vegan2.svg" v-show="item.vegan===1" height="20em" width="20em">
    </div>
  </div>
</template>
<script>


export default {
  name: 'Ingredient',
  props: {
    item: Object,
    lang: String
  },
    data: function () {
    return {
      counter: 0
    };
  },
  methods: {
    checkIfOut:function(stock){
        if(stock<1){
          return "OUT";
        }
        else{
          return "";
        }
    },
    incrementCounter: function () {
        this.counter += 1;
        // sending 'increment' message to parent component or view so that it
        // can catch it with v-on:increment in the component declaration
        this.$emit('increment');
    },
    restoreCounter: function () {
        this.counter += 1;
    },

      removeCounter:function () {
        if(this.counter > 0){
        this.counter -= 1;
        // sending 'remove' message to parent component or view so that it
        // can catch it with v-on:remove in the component declaration
        this.$emit('remove');
      }
      },
    resetCounter: function () {
      this.counter = 0;
      console.log(this.counter);
    }
  }
}
</script>
<style scoped>
  #orderButtons span {
    font-size: 1.1em;
  }

  button {
    background-color: transparent;
    border: black;
    color: #BC0022;
    padding: 0.5em 1em 0.55em 1em;
    text-decoration: none;
    display: inline-block;
    position: relative;
    font-size: 22px;
    font-weight: bolder;
    border-radius: 8px;
  }

  button:hover {
    cursor: pointer;
    transform:scale(1.05);
    box-shadow:1px 1px 3px rgba(0,0,0,0.5);
  }

  button:active {
    box-shadow: none;
    transform: none;
  }

  .removeButton {
    right: 0.6em;
  }


  .removeButton:disabled {
    opacity: 30%;
    pointer-events: none;
  }

  .addButton {
    left: 0.6em;
  }
</style>
