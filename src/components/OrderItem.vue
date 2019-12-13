<template>
	<div>
			<p>
		   <ul>
       	 {{orderId}}{{order.type}}: {{ order.ingredients.map(item=>item["ingredient_"+ lang]).join(", ") }}
	     </ul>
	   </p>
	</div>
</template>
<script>
export default {
  name: 'OrderItem',
  props: {
    uiLabels: Object,
    order: Object,
    orderId: String,
    lang: String
  }
}
</script>
<style scoped>

</style>
