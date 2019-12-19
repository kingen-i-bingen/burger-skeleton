<template>
  <!-- Note in this component that it is using another component -->
<div>
  <OrderItem
    :ui-labels="uiLabels"
    :lang="lang"
    :order-id="orderId"
    :order="order">
  </OrderItem>
  <button id="donebutton" v-on:click="orderDone">
    {{uiLabels.ready}}
  </button>
</div>
</template>
<script>
import OrderItem from '@/components/OrderItem.vue'

export default {
  name: 'OrderItemToPrepare',
  components: { OrderItem },
  props: {
    uiLabels: Object,
    order: Object,
    orderId: String,
    lang: String
  },
  methods: {
    orderDone: function () {
      // sending 'done' message to parent component or view so that it
      // can catch it with v-on:done in the component declaration
      this.$emit('done');
    },
    cancelOrder: function () {
      // not implemented
    }
  }
}
</script>
<style scoped>

#donebutton {
font-size: 18pt;
border-radius: 30px;
/* background-color: #98FB98; */
background-color:rgb(240, 245, 245);
border-color:rgb(0, 230, 77);
border-width:0.5vw;
color:rgb(0, 102, 34);
font-weight: bolder;

}

#donebutton:hover{
  background-color: lightgreen;
}

</style>
