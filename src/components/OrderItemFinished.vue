<template>

<div>
  <OrderItem
    :ui-labels="uiLabels"
    :lang="lang"
    :order-id="orderId"
    :order="order">
  </OrderItem>
  <button id="FinishButton" v-on:click="orderTaken">
    {{uiLabels.Taken}}
  </button>
</div>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue'

export default {
  name: 'OrderItemFinished',
  components: { OrderItem },
  props: {
    uiLabels: Object,
    order: Object,
    orderId: String,
    lang: String
  },

  methods: {
    orderTaken: function () {
      // sending 'done' message to parent component or view so that it
      // can catch it with v-on:done in the component declaration
      console.log("first");
      this.$emit('taken');

    },
    cancelOrder: function () {
      // not implemented
    }
  }
}
</script>
<style scoped>

#FinishButton {
font-size: 16pt;
border-radius: 30px;
background-color: #98FB98;
opacity: 80%;
}

#FinishButton:hover{
  background-color: lightgreen;
}
</style>
