<template>
    <div>
        <h6 class="text-uppercase text-secondary font-weight-border pt-3">
            price breakdown
        </h6>
        <div 
            v-for="(days, price) in price.breakdown" :key="price" 
            class="py-2 border-bottom border-top d-flex justify-content-between"
        >
            <span>{{ days }} x ${{ price }}</span>
            <span>${{ days * price }}</span>
        </div>
        <div class="font-weight-bolder d-flex justify-content-between py-1">
            <span>Total</span>
            <span>${{ price.total }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PriceBreakdown',
    props: {
        price: Object,
    }
}
</script>