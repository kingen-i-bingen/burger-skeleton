<template>
  <div class="ingredient">
    <label>
      {{item["ingredient_"+ lang]}} <br> {{item.selling_price}}:-, {{item.stock}} pcs<br>
      <button v-on:click="removeCounter">-</button>       {{ counter }}    <button v-on:click="incrementCounter">+</button>
      <!-- <button v-on:click="incrementCounter">{{ counter }}</button>  BORTAGEN-->
    </label>
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
    incrementCounter: function () {
      this.counter += 1;
      // sending 'increment' message to parent component or view so that it
      // can catch it with v-on:increment in the component declaration
      this.$emit('increment');
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
    }
  }
}
</script>
<style scoped>

</style>
