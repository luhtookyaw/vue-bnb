<template>
    <div>
        <i class="fas fa-star" v-for="star in fullStar" :key="star" @click="$emit('input', star)"></i>
        <i class="fas fa-star-half-alt" v-if="halfStar"></i>
        <i class="far fa-star" v-for="star in emptyStar" :key="star" @click="$emit('input', fullStar + star)"></i>
    </div>
</template>
<script>
export default {
    name: "StarRating",
    props: {
        value: Number,
    },
    computed: {
        halfStar() {
            const fraction = this.value - Math.floor(this.value)
            return fraction > 0 && fraction < 0.5;
        },
        fullStar() {
            return Math.round(this.value);
        },
        emptyStar() {
            return 5 - Math.ceil(this.value);
        },
    },
}
</script>